'use client';

import { useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';

import { UserQuickLook } from './quicklook';
import { usePatientStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  renderActions,
  renderCopyableText,
  renderDate,
  RenderUser,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { castData } from '@/lib/utils';
import { PatientType } from '@/services/client/patient';
import { useDeleteUser } from '@/services/common/user/user.query';
import { useSubdomain } from '@/hooks/useSubDomain';
import { useAllPatients } from '@/services/client/patient';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

const INITIAL_VISIBLE_COLUMNS = ['image', 'uid', 'name', 'email', 'age', 'gender', 'createdAt'];

export default function Patients() {
  const router = useRouter();
  const deleteModal = useDisclosure();
  const { setSelected } = usePatientStore();
  const deletePatient = useDeleteUser();
  const organization = useSubdomain();

  const { data, isLoading, isError, error } = useAllPatients();

  const handleDelete = async (uid: string) => {
    await deletePatient.mutateAsync({ uid, organization });
  };

  // Define columns with render functions
  const columns: ColumnDef<PatientType>[] = useMemo(
    () => [
      {
        name: 'User ID',
        uid: 'uid',
        sortable: true,
        renderCell: (patient) => renderCopyableText(patient.uid.toString()),
      },
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (patient) => <RenderUser name={patient.name} description={patient.email} />,
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (patient) => (
          <div className="truncate lowercase text-default-foreground">{patient.email}</div>
        ),
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (patient) => (
          <div className="truncate text-default-foreground">{patient.phone || 'N/A'}</div>
        ),
      },
      {
        name: 'Age',
        uid: 'age',
        sortable: true,
        renderCell: (patient) => (
          <div className="truncate text-default-foreground">{patient.age || 'N/A'}</div>
        ),
      },
      {
        name: 'Gender',
        uid: 'gender',
        sortable: true,
        renderCell: (patient) => (
          <div className="truncate text-default-foreground">{patient.gender || 'N/A'}</div>
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
        renderCell: (patient) =>
          renderActions({
            onView: () => router.push(`/dashboard/patients/${patient.uid}`),
            onEdit: () => router.push(`/dashboard/patients/${patient.uid}/edit`),
            key: patient.uid,
            onDelete: () => handleDelete(patient.uid),
          }),
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
      onPress={() =>
        router.push('/dashboard/users/new?redirectUrl=/dashboard/patients&role=patient')
      }
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

  const patients = castData<PatientType[]>(data);

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
        keyField="uid"
        filters={filters}
        searchField={(patient, searchValue) =>
          patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.uid.toString().includes(searchValue) ||
          (patient.phone ? patient.phone.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const patient = patients.find((patient) => patient.uid == row);
          if (patient) {
            setSelected(patient);
          }
        }}
      />

      <UserQuickLook />
    </>
  );
}
