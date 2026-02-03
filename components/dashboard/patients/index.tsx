'use client';

import { useMemo, useState } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';

import { UserQuickLook } from './quicklook';
import { usePatientStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  DropdownItemWithSection,
  renderDate,
  renderDropdownMenu,
  RenderUser,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { PatientType } from '@/services/client/patient';
import { useAllPatients } from '@/services/client/patient';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import Link from 'next/link';
import { CopyText } from '@/components/ui/copy';
import { formatAge, formatGender } from '@/libs/utils';
import ResetPasswordModal from '../users/ui/reset-password-modal';
import DeleteUserModal from '../users/ui/delete-user-modal';
import { Role } from '@/services/common/user/user.constants';
import { useSession } from '@/libs/providers/session-provider';

const INITIAL_VISIBLE_COLUMNS = ['image', 'name', 'email', 'age', 'gender', 'createdAt'];

export default function Patients() {
  const { user: currentUser } = useSession();
  const deleteModal = useDisclosure();
  const resetPasswordModal = useDisclosure();
  const { setSelected } = usePatientStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: patients, isLoading, isError, error } = useAllPatients();

  const handleDelete = async (userId: string) => {
    setSelectedUserId(userId);
    deleteModal.onOpen();
  };

  const handleChangePassword = async (userId: string) => {
    setSelectedUserId(userId);
    resetPasswordModal.onOpen();
  };

  const dropdownMenuItems = (patient: PatientType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/patients/${patient.id}`,
      },
      {
        key: 'edit',
        children: 'Edit',
        as: Link,
        href: `/dashboard/patients/${patient.id}/edit`,
        roles: [Role.ADMIN, Role.RECEPTIONIST],
      },
      {
        key: 'change-password',
        color: 'warning',
        children: 'Reset Password',
        onPress: () => handleChangePassword(patient.userId),
        section: 'Danger Zone',
        className: 'text-warning',
        roles: [Role.ADMIN],
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => handleDelete(patient.userId),
        section: 'Danger Zone',
        className: 'text-danger',
        roles: [Role.ADMIN],
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<PatientType>[] = useMemo(
    () => [
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (patient) => <RenderUser name={patient.name} description={patient.phone} />,
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (patient) => <CopyText>{patient.email}</CopyText>,
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (patient) => <CopyText>{patient.phone}</CopyText>,
      },
      {
        name: 'Age',
        uid: 'age',
        sortable: true,
        renderCell: (patient) => (
          <CopyText>{formatAge(patient.age, { fullString: true })}</CopyText>
        ),
      },
      {
        name: 'Gender',
        uid: 'gender',
        sortable: true,
        renderCell: (patient) => (
          <CopyText>{formatGender(patient.gender, { fullString: true })}</CopyText>
        ),
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (patient) => renderDate({ date: patient.createdAt, isTime: true }),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (patient) => renderDropdownMenu(dropdownMenuItems(patient), currentUser?.role),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<PatientType>[] = useMemo(
    () => [
      {
        name: 'Created At',
        key: 'createdAt',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Past Users', value: 'past' },
        ],
        filterFn: (patient, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(patient.createdAt);
          createdAt.setHours(0, 0, 0, 0);

          const daysDiff = Math.floor(
            (createdAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          switch (value) {
            case 'today':
              return daysDiff === 0;
            case 'thisWeek':
              return daysDiff >= 0 && daysDiff < 7;
            case 'past':
              return daysDiff < 0;
            default:
              return true;
          }
        },
      },
    ],
    []
  );

  // Render top bar
  const endContent = () => (
    <Button
      color="primary"
      size="sm"
      as={Link}
      href="/dashboard/users/new?redirectUrl=/dashboard/patients&role=PATIENT"
    >
      New Patient
    </Button>
  );

  const renderSelectedActions = (selectedKeys: Selection) => (
    <DropdownMenu aria-label="Selected Actions">
      <DropdownItem
        key="export"
        onPress={async () => {
          const ids = Array.from(selectedKeys);

          const exportPromise = fetch('/api/v1/patients/export', {
            method: 'POST',
            body: JSON.stringify({ ids: selectedKeys === 'all' ? [] : ids }),
          })
            .then(async (res) => {
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `patients-${new Date().toISOString().split('T')[0]}.xlsx`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
              return 'Users exported successfully';
            })
            .catch((err) => {
              console.error(err);
              return 'Failed to export patients';
            });

          toast.promise(exportPromise, {
            loading: 'Exporting patients',
            success: 'Users exported successfully',
            error: 'Failed to export patients',
          });
        }}
      >
        Export
      </DropdownItem>
      <DropdownItem
        key="delete"
        className="text-danger"
        color="danger"
        onPress={() => {
          deleteModal.onOpen();
        }}
      >
        Delete
      </DropdownItem>
    </DropdownMenu>
  );

  if (isLoading) return <MinimalPlaceholder message="Loading patients..." />;

  if (!patients) return null;

  return (
    <>
      <Table
        isError={isError}
        errorMessage={error?.message}
        uniqueKey="patients"
        isLoading={isLoading}
        data={patients}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="id"
        filters={filters}
        searchField={(patient, searchValue) =>
          patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.id.toString().includes(searchValue) ||
          (patient.phone ? patient.phone.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const patient = patients.find((patient) => patient.id == row);
          if (patient) {
            setSelected(patient);
          }
        }}
      />

      <UserQuickLook />
      <ResetPasswordModal
        userId={selectedUserId}
        isOpen={resetPasswordModal.isOpen}
        onClose={resetPasswordModal.onClose}
      />
      <DeleteUserModal
        userId={selectedUserId}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </>
  );
}
