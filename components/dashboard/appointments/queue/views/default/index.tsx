'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  cn,
  DropdownItem,
  DropdownMenu,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
  Selection,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
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
import type { ColumnDef } from '@/components/ui/static-data-table/types';
import { isSearchMatch } from '@/libs/utils';
import { useDeleteUser } from '@/services/common/user/user.query';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import {
  AppointmentQueueType,
  DEFAULT_APPOINTMENT_QUEUE_FILTERS,
  type AppointmentQueueFilters,
  QueueStatus,
  normalizeFiltersFromApi,
} from '@/services/client/appointment/queue/queue.types';
import Link from 'next/link';
import QueueQuickLook from './quicklook';
import { CopyText } from '@/components/ui/copy';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Role } from '@/services/common/user/user.constants';
import { useSession } from '@/libs/providers/session-provider';
import { QueueFilters } from './filters';
import { getActiveFilterCount } from './helper';

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
  const { user: currentUser } = useSession();
  const deleteModal = useDisclosure();
  const filterPopover = useDisclosure();
  const deleteDoctor = useDeleteUser();
  const [selectedQueue, setSelectedQueue] = useState<AppointmentQueueType | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppointmentQueueFilters | undefined>(
    undefined
  );

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAllAppointmentQueues(appliedFilters);

  const { queues, filters: filtersFromApi } = data || {};
  const filterInitialValues: AppointmentQueueFilters =
    appliedFilters ?? normalizeFiltersFromApi(filtersFromApi) ?? DEFAULT_APPOINTMENT_QUEUE_FILTERS;

  const handleDelete = async (uid: string) => {
    await deleteDoctor.mutateAsync(uid);
  };

  const dropdownMenuItems = (queue: AppointmentQueueType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/queues/${queue.id}`,
      },
      {
        key: 'cancel',
        children: 'Cancel Appointment',
        section: 'Danger Zone',
        color: 'danger',
        isHidden: [QueueStatus.CANCELLED, QueueStatus.COMPLETED].includes(queue.status),
        roles: [Role.ADMIN, Role.RECEPTIONIST],
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => handleDelete(queue.id),
        section: 'Danger Zone',
        className: 'text-danger',
        roles: [Role.ADMIN],
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<AppointmentQueueType>[] = useMemo(
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
        renderCell: (queue) => (
          <RenderUser variant="beam" name={queue.doctor.name} description={queue.doctor.seating} />
        ),
        isHidden: currentUser?.role === Role.DOCTOR,
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
      {
        name: 'Scheduled Date',
        uid: 'appointmentDate',
        sortable: true,
        renderCell: (queue) => renderDate({ date: queue.appointmentDate }),
      },
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
        renderCell: (queue) => renderDropdownMenu(dropdownMenuItems(queue), currentUser?.role),
      },
    ],
    []
  );

  // Render top bar
  const endContent = () => (
    <div className="flex gap-2">
      <Tooltip content="Refresh Data">
        <Button size="sm" variant="flat" radius="full" isIconOnly onPress={() => refetch()}>
          <Icon
            icon="solar:refresh-bold-duotone"
            className={cn({ 'animate-spin': isRefetching })}
            width={18}
          />
        </Button>
      </Tooltip>
      <Button color="primary" size="sm" as={Link} href="/dashboard/queues/new">
        New Appointment
      </Button>
    </div>
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

  const renderFilter = () => (
    <div>
      <Popover
        placement="bottom"
        isOpen={filterPopover.isOpen}
        onOpenChange={filterPopover.onOpenChange}
      >
        <PopoverTrigger>
          <Button
            className="bg-default-100 text-default-800"
            size="sm"
            startContent={
              <Icon className="text-default-400" icon="solar:tuning-2-linear" width={16} />
            }
            endContent={
              getActiveFilterCount(filterInitialValues) > 0 && (
                <Chip size="sm" color="primary" variant="flat">
                  {getActiveFilterCount(filterInitialValues)}
                </Chip>
              )
            }
          >
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ScrollShadow className="flex max-h-96 w-full flex-col gap-6 px-2 py-4 scrollbar-hide">
            <QueueFilters
              initialValues={filterInitialValues}
              onSubmit={setAppliedFilters}
              onClear={() => setAppliedFilters(undefined)}
              onApplyComplete={filterPopover.onClose}
            />
          </ScrollShadow>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <>
      <Table
        renderFilter={renderFilter}
        isError={isError}
        errorMessage={error?.message}
        uniqueKey="appointments"
        isLoading={isLoading}
        data={queues || []}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="id"
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
          const queue = queues?.find((queue) => queue.id == row);
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
