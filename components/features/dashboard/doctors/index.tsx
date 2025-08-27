'use client';

import { useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';

import { UserQuickLook } from './quicklook';
import { useDoctorStore } from './store';

import Loading from '@/app/loading';
import { Table } from '@/components/ui/data-table';
import {
  renderActions,
  renderCopyableText,
  renderDate,
  renderUser,
} from '@/components/ui/data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/data-table/types';
import { castData } from '@/lib/utils';
import { useAllDoctors, useDeleteDoctor } from '@/hooks/queries/client/doctor';
import { DoctorType } from '@/types/client/doctor';

const INITIAL_VISIBLE_COLUMNS = [
  'image',
  'uid',
  'name',
  'email',
  'seating',
  'designation',
  'createdAt',
];

export default function Doctors() {
  const router = useRouter();
  const deleteModal = useDisclosure();
  const { setSelected } = useDoctorStore();
  const deleteDoctor = useDeleteDoctor();

  const { data, isLoading, isError, error } = useAllDoctors();

  const handleDelete = async (uid: number) => {
    toast.promise(deleteDoctor.mutateAsync(uid), {
      loading: `Deleting doctor ${uid}`,
      success: (data) => data.message,
      error: (error) => error.message,
    });
  };

  // Define columns with render functions
  const columns: ColumnDef<DoctorType>[] = useMemo(
    () => [
      {
        name: 'User ID',
        uid: 'uid',
        sortable: true,
        renderCell: (doctor) => renderCopyableText(doctor.uid.toString()),
      },
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (doctor) =>
          renderUser({
            avatar: doctor.image,
            name: doctor.name,
            description: doctor.email,
          }),
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (doctor) => (
          <div className="truncate lowercase text-default-foreground">{doctor.email}</div>
        ),
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (doctor) => (
          <div className="truncate text-default-foreground">{doctor.phone || 'N/A'}</div>
        ),
      },
      {
        name: 'Designation',
        uid: 'designation',
        sortable: true,
        renderCell: (doctor) => (
          <div className="truncate text-default-foreground">{doctor.designation || 'N/A'}</div>
        ),
      },
      {
        name: 'Seating',
        uid: 'seating',
        sortable: true,
        renderCell: (doctor) => (
          <div className="truncate text-default-foreground">{doctor.seating || 'N/A'}</div>
        ),
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
        renderCell: (doctor) =>
          renderActions({
            onView: () => router.push(`/dashboard/doctors/${doctor.uid}`),
            onEdit: () => router.push(`/dashboard/doctors/${doctor.uid}/edit`),
            key: doctor.uid,
            onDelete: () => handleDelete(doctor.uid),
          }),
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
    <Button color="primary" size="sm" onPress={() => router.push('/dashboard/doctors/new')}>
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

  const doctors = castData<DoctorType[]>(data);

  if (isLoading) return <Loading />;

  if (!doctors) return null;

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
        keyField="uid"
        filters={filters}
        searchField={(doctor, searchValue) =>
          doctor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          doctor.uid.toString().includes(searchValue) ||
          (doctor.phone ? doctor.phone.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const doctor = doctors.find((doctor) => doctor.uid == row);
          if (doctor) {
            setSelected(doctor);
          }
        }}
      />

      {/* {quickLook.isOpen && quickLookItem && (
        <QuickLook
          onClose={quickLook.onClose}
          item={quickLookItem as DoctorType}
        />
      )} */}
      <UserQuickLook />
    </>
  );
}
