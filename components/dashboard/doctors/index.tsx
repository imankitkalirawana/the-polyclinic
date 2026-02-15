'use client';

import { useMemo, useState } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';

import { UserQuickLook } from './quicklook';
import { useDoctorStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  renderDate,
  RenderUser,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { DoctorType } from '@/services/client/doctor';
import { useAllDoctors } from '@/services/client/doctor/doctor.query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import Link from 'next/link';
import { CopyText } from '@/components/ui/copy';
import ResetPasswordModal from '../users/ui/reset-password-modal';
import DeleteUserModal from '../users/ui/delete-user-modal';
import { Role } from '@/services/common/user/user.constants';
import { useSession } from '@/libs/providers/session-provider';

const INITIAL_VISIBLE_COLUMNS = [
  'image',
  'name',
  'email',
  'seating',
  'specialization',
  'createdAt',
];

export default function Doctors() {
  const { user: currentUser } = useSession();
  const { setSelected } = useDoctorStore();
  const deleteModal = useDisclosure();
  const resetPasswordModal = useDisclosure();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAllDoctors();

  const doctors = data?.doctors ?? [];

  const handleDelete = async (userId: string) => {
    setSelectedUserId(userId);
    deleteModal.onOpen();
  };

  const handleChangePassword = async (userId: string) => {
    setSelectedUserId(userId);
    resetPasswordModal.onOpen();
  };

  const dropdownMenuItems = (doctor: DoctorType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/doctors/${doctor.id}`,
      },
      {
        key: 'edit',
        children: 'Edit',
        as: Link,
        href: `/dashboard/doctors/${doctor.id}/edit`,
        roles: [Role.ADMIN],
      },
      {
        key: 'change-password',
        color: 'warning',
        children: 'Reset Password',
        onPress: () => handleChangePassword(doctor.user_id),
        section: 'Danger Zone',
        className: 'text-warning',
        roles: [Role.ADMIN],
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => handleDelete(doctor.user_id),
        section: 'Danger Zone',
        className: 'text-danger',
        roles: [Role.ADMIN],
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<DoctorType>[] = useMemo(
    () => [
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (doctor) => (
          <RenderUser variant="beam" name={doctor.name} description={doctor.email} />
        ),
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (doctor) => <CopyText>{doctor.email}</CopyText>,
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (doctor) => <CopyText>{doctor.phone}</CopyText>,
      },
      {
        name: 'Specialization',
        uid: 'specialization',
        sortable: true,
        renderCell: (doctor) => <CopyText>{doctor.specializations?.join(', ')}</CopyText>,
      },
      {
        name: 'Seating',
        uid: 'seating',
        sortable: true,
        renderCell: (doctor) => <CopyText>{doctor.seating}</CopyText>,
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (doctor) => renderDate({ date: doctor.createdAt, isTime: true }),
      },

      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (doctor) => renderDropdownMenu(dropdownMenuItems(doctor), currentUser?.role),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<DoctorType>[] = useMemo(
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
        filterFn: (doctor, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(doctor.createdAt);
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
      href="/dashboard/users/new?redirectUrl=/dashboard/doctors&role=DOCTOR"
    >
      New Doctor
    </Button>
  );

  const renderSelectedActions = (selectedKeys: Selection) => (
    <DropdownMenu aria-label="Selected Actions">
      <DropdownItem
        key="export"
        onPress={async () => {
          const ids = Array.from(selectedKeys);

          const exportPromise = fetch('/api/v1/doctors/export', {
            method: 'POST',
            body: JSON.stringify({ ids: selectedKeys === 'all' ? [] : ids }),
          })
            .then(async (res) => {
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `doctors-${new Date().toISOString().split('T')[0]}.xlsx`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
              return 'Users exported successfully';
            })
            .catch((err) => {
              console.error(err);
              return 'Failed to export doctors';
            });

          toast.promise(exportPromise, {
            loading: 'Exporting doctors',
            success: 'Users exported successfully',
            error: 'Failed to export doctors',
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

  if (isLoading) return <MinimalPlaceholder message="Loading doctors..." />;

  return (
    <>
      <Table
        isError={isError}
        errorMessage={error?.message}
        uniqueKey="doctors"
        isLoading={isLoading}
        data={doctors}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="id"
        filters={filters}
        searchField={(doctor, searchValue) =>
          doctor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          doctor.id.toString().includes(searchValue) ||
          (doctor.phone ? doctor.phone.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const doctor = doctors.find((doctor) => doctor.id == row);
          if (doctor) {
            setSelected(doctor);
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
