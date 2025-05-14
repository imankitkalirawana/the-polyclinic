'use client';

import { useMemo } from 'react';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  Selection,
  User,
} from '@heroui/react';

import {
  renderActions,
  renderChip,
  renderCopyableText,
  renderDate,
  renderUser,
} from '@/components/ui/data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/data-table/types';

import { Table } from '@/components/ui/data-table';
import { AppointmentType } from '@/models/Appointment';
import { useRouter } from 'nextjs-toploader/app';
import QuickLook from './quick-look';
import { useAppointmentData, useAppointmentStore } from './store';
import { avatars } from '@/lib/avatar';
import BulkDeleteModal from '@/components/ui/common/modals/bulk-delete';
import { ModalCellRenderer } from './cell-renderer';
import { apiRequest } from '@/lib/axios';

const INITIAL_VISIBLE_COLUMNS = [
  'aid',
  'date',
  'patient.name',
  'doctor.name',
  'status',
];

export default function Appointments() {
  const router = useRouter();

  const { selected, setSelected, keys, setKeys, action, setAction } =
    useAppointmentStore();
  const { data, isLoading, refetch } = useAppointmentData();

  const appointments: AppointmentType[] = useMemo(() => {
    return data || [];
  }, [data]);

  // Define columns with render functions
  const columns: ColumnDef<AppointmentType>[] = useMemo(
    () => [
      {
        name: 'Appointment ID',
        uid: 'aid',
        sortable: true,
        renderCell: (appointment) =>
          renderCopyableText(appointment.aid.toString()),
      },

      {
        name: 'Patient Name',
        uid: 'patient.name',
        sortable: true,
        renderCell: (appointment) =>
          renderUser({
            uid: appointment.patient?.uid,
            avatar: appointment.patient.image,
            name: appointment.patient.name,
            description: `#${appointment.patient.uid}`,
          }),
      },
      {
        name: 'Doctor Name',
        uid: 'doctor.name',
        sortable: true,
        renderCell: (appointment) =>
          appointment.doctor?.uid
            ? renderUser({
                uid: appointment.doctor?.uid,
                avatar: appointment.doctor?.image,
                name: appointment.doctor?.name,
                description: `#${appointment.doctor?.uid}`,
              })
            : '',
      },

      {
        name: 'Patient Phone',
        uid: 'patient.phone',
        sortable: true,
        renderCell: (appointment) => (
          <div className="truncate capitalize text-default-foreground">
            {appointment.patient.phone}
          </div>
        ),
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (appointment) =>
          renderChip({
            item: appointment.status,
          }),
      },
      {
        name: 'Appointment Date',
        uid: 'date',
        sortable: true,
        renderCell: (appointment) =>
          renderDate({ date: appointment.date, isTime: true }),
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (appointment) =>
          renderDate({ date: appointment.createdAt, isTime: true }),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (appointment) =>
          renderActions({
            onView: () => router.push(`/dashboard/users/${appointment.aid}`),
            onEdit: () =>
              router.push(`/dashboard/users/${appointment.aid}/edit`),
            onDelete: () => console.log('Delete', appointment.aid),
            key: appointment.aid,
          }),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<AppointmentType>[] = useMemo(
    () => [
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable' },
        ],
        filterFn: (appointment, value) =>
          appointment.status.toLowerCase() === value,
      },
      {
        name: 'Created At',
        key: 'createdAt',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Past Appointments', value: 'past' },
        ],
        filterFn: (appointment, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(appointment.createdAt);
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
    <Button color="primary" size="sm" onPress={() => refetch()}>
      Refetch
    </Button>
  );

  const renderSelectedActions = (selectedKeys: Selection) => {
    return (
      <DropdownMenu aria-label="Selected Actions">
        <DropdownItem
          key="export"
          onPress={async () => {
            setKeys(selectedKeys);
            // convert selectedKeys to array of numbers
            let keys = [];
            if (selectedKeys === 'all') {
              keys = [-1];
            } else {
              keys = Array.from(selectedKeys);
            }
            await apiRequest({
              method: 'POST',
              url: '/api/v1/appointments/export',
              data: { keys },
              responseType: 'blob',
              successMessage: 'Appointments exported successfully',
              onSuccess: (data) => {
                setAction(null);
                // Create a blob URL and trigger download
                const blob = new Blob([data], {
                  type: 'application/vnd.ms-excel',
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                  'download',
                  `appointments-export-${new Date().toISOString().split('T')[0]}.xlsx`
                );
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
              },
            });
          }}
        >
          Export
        </DropdownItem>
        <DropdownItem
          key="cancel"
          onPress={() => {
            setKeys(selectedKeys);
            setAction('bulk-cancel');
          }}
        >
          Cancel
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          onPress={() => {
            setKeys(selectedKeys);
            setAction('bulk-delete');
          }}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    );
  };

  return (
    <>
      <Table
        uniqueKey="appointments"
        isLoading={isLoading}
        data={appointments}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="aid"
        filters={filters}
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'date',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const appointment = appointments.find(
            (appointment) => appointment.aid == row
          );
          if (appointment) {
            setSelected(appointment);
          }
        }}
      />
      {selected && <QuickLook />}
      {(action === 'bulk-delete' || action === 'bulk-cancel') && (
        <BulkDeleteModal<AppointmentType>
          canUndo={action !== 'bulk-delete'}
          modalKey="appointments"
          title={
            action === 'bulk-delete'
              ? 'Delete the selected appointments?'
              : 'Cancel the selected appointments?'
          }
          confirmButtonText={
            action === 'bulk-delete'
              ? 'Confirm Deletion'
              : 'Confirm Cancellation'
          }
          items={appointments.filter((appointment) => {
            if (keys === 'all') return true;
            return keys?.has(String(appointment.aid));
          })}
          onClose={() => setAction(null)}
          onDelete={async () => {
            if (!keys) return;
            let ids = [];
            if (keys === 'all') {
              ids.push(-1); // -1 is the id for all appointments
            } else {
              ids = Array.from(keys);
            }
            if (action === 'bulk-delete') {
              await apiRequest({
                method: 'DELETE',
                url: '/api/v1/appointments',
                data: { ids },
                onSuccess: () => {
                  setAction(null);
                  refetch();
                },
                onError: (error) => {
                  console.log('error', error);
                },
              });
            } else {
              await apiRequest({
                method: 'PATCH',
                url: '/api/v1/appointments',
                data: { ids },
                onSuccess: () => {
                  setAction(null);
                  refetch();
                },
              });
            }
          }}
          renderItem={(appointment) => (
            <ModalCellRenderer appointment={appointment} />
          )}
        />
      )}
    </>
  );
}
