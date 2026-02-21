'use client';

import React, { useMemo } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';
import Link from 'next/link';
// eslint-disable-next-line no-restricted-imports
import { toast } from 'sonner';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  RenderUser,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { useSession } from '@/libs/providers/session-provider';
import { AppointmentQueue } from '@repo/store';
import { useRouter } from 'nextjs-toploader/app';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import RenderChip from '@/components/ui/new-data-table/cell-renderer/render-chip';
import {
  FormatDate,
  FormatDateTime,
} from '@/components/ui/new-data-table/cell-renderer/render-date';
import { CopyText } from '@/components/ui/copy';

const INITIAL_VISIBLE_COLUMNS = [
  'aid',
  'patient',
  'doctor',
  'appointmentDate',
  'status',
  'createdAt',
];

export default function AppointmentQueues() {
  const router = useRouter();
  const { user: currentUser } = useSession();

  const { data: queues, isLoading, isError, error } = useAllAppointmentQueues();

  const dropdownMenuItems = (queue: AppointmentQueue): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        onPress: () => router.push(`/dashboard/queues/${queue.id}`),
      },
      {
        key: 'edit',
        children: 'Edit',
        onPress: () => router.push(`/dashboard/queues/${queue.id}/edit`),
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        section: 'Danger Zone',
        className: 'text-danger',
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<AppointmentQueue>[] = useMemo(
    () => [
      {
        name: 'Appointment ID',
        uid: 'aid',
        sortable: true,
        renderCell: (queue) => <CopyText>{queue.aid}</CopyText>,
      },
      {
        name: 'Patient',
        uid: 'patient',
        sortable: true,
        renderCell: (queue) => (
          <RenderUser
            size="md"
            name={queue.patient.name}
            description={queue.patient.phone || queue.patient.email}
            classNames={{
              description: 'lowercase',
            }}
          />
        ),
      },
      {
        name: 'Doctor',
        uid: 'doctor',
        sortable: true,
        renderCell: (queue) => (
          <RenderUser
            size="md"
            name={queue.doctor.name}
            description={queue.doctor.phone || queue.doctor.email}
            classNames={{
              description: 'lowercase',
            }}
          />
        ),
      },
      {
        name: 'Appointment Date',
        uid: 'appointmentDate',
        sortable: true,
        renderCell: (queue) => <FormatDate value={queue.appointmentDate} />,
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (queue) => <RenderChip value={queue.status} />,
      },
      {
        name: 'Gender',
        uid: 'gender',
        sortable: true,
        renderCell: (queue) => <RenderChip value={queue.patient.gender} />,
      },
      {
        name: 'Booked At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (queue) => <FormatDateTime value={queue.createdAt} />,
      },
      {
        name: 'Booked By',
        uid: 'bookedByUser',
        sortable: true,
        renderCell: (queue) => (
          <RenderUser
            size="md"
            name={queue.bookedByUser.name}
            description={queue.bookedByUser.email}
          />
        ),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (queue) => renderDropdownMenu(dropdownMenuItems(queue), currentUser?.role),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<AppointmentQueue>[] = useMemo(
    () => [
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Payment Pending', value: 'paymentPending' },
          { label: 'Payment Failed', value: 'paymentFailed' },
          { label: 'Booked', value: 'booked' },
          { label: 'Called', value: 'called' },
          { label: 'In Consultation', value: 'inConsultation' },
          { label: 'Skipped', value: 'skipped' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Completed', value: 'completed' },
        ],
        filterFn: (queue, value) => queue.status.toLowerCase() === value,
      },
      {
        name: 'Created At',
        key: 'createdAt',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Past Users', value: 'past' },
        ],
        filterFn: (queue, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(queue.createdAt);
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
    <Button color="primary" size="sm" as={Link} href="/dashboard/queues/new">
      New Appointment
    </Button>
  );

  const renderSelectedActions = (selectedKeys: Selection) => (
    <DropdownMenu aria-label="Selected Actions">
      <DropdownItem
        key="export"
        onPress={async () => {
          const ids = Array.from(selectedKeys);

          const exportPromise = fetch('/api/v1/users/export', {
            method: 'POST',
            body: JSON.stringify({ ids: selectedKeys === 'all' ? [] : ids }),
          })
            .then(async (res) => {
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `users-${new Date().toISOString().split('T')[0]}.xlsx`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
              return 'Users exported successfully';
            })
            .catch((err) => {
              console.error(err);
              return 'Failed to export users';
            });

          toast.promise(exportPromise, {
            loading: 'Exporting users',
            success: 'Users exported successfully',
            error: 'Failed to export users',
          });
        }}
      >
        Export
      </DropdownItem>
      <DropdownItem key="delete" className="text-danger" color="danger">
        Delete
      </DropdownItem>
    </DropdownMenu>
  );

  return (
    <>
      <Table
        isError={isError}
        errorMessage={error?.message}
        uniqueKey="appointments"
        isLoading={isLoading}
        data={queues || []}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="id"
        filters={filters}
        searchField={(queue, searchValue) =>
          queue.patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          queue.patient.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          queue.aid.toLowerCase().includes(searchValue.toLowerCase()) ||
          (queue.patient.phone
            ? queue.patient.phone.toLowerCase().includes(searchValue.toLowerCase())
            : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
      />
    </>
  );
}
