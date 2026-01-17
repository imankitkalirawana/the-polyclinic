'use client';

import { useMemo, useState } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';

// import { UserQuickLook } from './quicklook';
// import { useDoctorStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  renderChip,
  renderDate,
  RenderUser,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { isSearchMatch } from '@/lib/utils';
import { useDeleteUser } from '@/services/common/user/user.query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { AppointmentQueueResponse } from '@/services/client/appointment/queue/queue.types';
import Link from 'next/link';
import QueueQuickLook from './quicklook';
import { CopyText } from '@/components/ui/copy';

const INITIAL_VISIBLE_COLUMNS = [
  'sequenceNumber',
  'aid',
  'patient.name',
  'doctor.name',
  'status',
  'appointmentDate',
  'createdAt',
];

export default function DefaultQueueView() {
  const deleteModal = useDisclosure();
  const deleteDoctor = useDeleteUser();
  const [selectedQueue, setSelectedQueue] = useState<AppointmentQueueResponse | null>(null);

  const { data: queues, isLoading, isError, error } = useAllAppointmentQueues();

  const handleDelete = async (uid: string) => {
    await deleteDoctor.mutateAsync(uid);
  };

  const dropdownMenuItems = (queue: AppointmentQueueResponse): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/queues/${queue.id}`,
      },
      {
        key: 'edit',
        children: 'Edit',
        as: Link,
        href: `/dashboard/queues/${queue.id}/edit`,
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => handleDelete(queue.id),
        section: 'Danger Zone',
        className: 'text-danger',
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<AppointmentQueueResponse>[] = useMemo(
    () => [
      {
        name: 'Sequence Number',
        uid: 'sequenceNumber',
        sortable: true,
        renderCell: (queue) => (
          <div className="truncate text-default-foreground">#{queue.sequenceNumber}</div>
        ),
      },
      {
        name: 'Appointment ID',
        uid: 'aid',
        sortable: true,
        renderCell: (queue) => <CopyText>{queue.aid}</CopyText>,
      },
      {
        name: 'Name',
        uid: 'patient.name',
        sortable: true,
        renderCell: (queue) => (
          <RenderUser name={queue.patient.name} description={queue.patient.phone} />
        ),
      },
      {
        name: 'Email',
        uid: 'patient.email',
        sortable: true,
        renderCell: (queue) => <CopyText>{queue.patient.email}</CopyText>,
      },
      {
        name: 'Doctor',
        uid: 'doctor.name',
        sortable: true,
        renderCell: (queue) => <CopyText>{queue.doctor.name || 'N/A'}</CopyText>,
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (queue) => renderChip({ item: queue.status }),
      },
      {
        name: 'Seating',
        uid: 'seating',
        sortable: true,
        renderCell: (queue) => <CopyText>{queue.doctor.seating || 'N/A'}</CopyText>,
      },
      // {
      //   name: 'Scheduled Date',
      //   uid: 'appointmentDate',
      //   sortable: true,
      //   renderCell: (queue) => renderDate({ date: queue.appointmentDate }),
      // },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (doctor) => renderDate({ date: doctor.createdAt, isTime: true }),
      },
      {
        name: 'Booked By',
        uid: 'bookedByUser.name',
        sortable: true,
        renderCell: (queue) => <CopyText>{queue.bookedByUser.name}</CopyText>,
      },
      {
        name: 'Completed By',
        uid: 'completedByUser.name',
        sortable: true,
        renderCell: (queue) =>
          queue.completedByUser ? (
            <RenderUser
              name={queue.completedByUser.name}
              description={queue.completedByUser.email}
            />
          ) : null,
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (queue) => renderDropdownMenu(dropdownMenuItems(queue)),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<AppointmentQueueResponse>[] = useMemo(
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

  if (!queues) return null;

  return (
    <>
      <Table
        isError={isError}
        errorMessage={error?.message}
        uniqueKey="doctors"
        isLoading={isLoading}
        data={queues}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="id"
        filters={filters}
        searchField={(queue, searchValue) =>
          isSearchMatch(queue.patient.name, searchValue) ||
          isSearchMatch(queue.patient.email, searchValue) ||
          isSearchMatch(queue.aid, searchValue) ||
          isSearchMatch(queue.patient.phone || '', searchValue)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const queue = queues.find((queue) => queue.id == row);
          if (queue) {
            setSelectedQueue(queue);
          }
        }}
      />

      {!!selectedQueue && (
        <QueueQuickLook queue={selectedQueue} onClose={() => setSelectedQueue(null)} />
      )}
    </>
  );
}
