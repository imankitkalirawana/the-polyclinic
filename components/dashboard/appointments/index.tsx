'use client';

import { useMemo } from 'react';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  Selection,
  Tooltip,
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
import { AppointmentType } from '@/types/appointment';
import { useRouter } from 'nextjs-toploader/app';
import { useAppointmentStore } from '@/store/appointment';
import { apiRequest } from '@/lib/axios';
import { AppointmentQuickLook } from './quicklook';
import CancelDeleteAppointments from '../../appointments/ui/bulk-cancel-delete';
import { convertSelectionToKeys } from '@/components/ui/data-table/helper';
import Link from 'next/link';
import { useAllAppointments } from '@/services/appointment';
import { Icon } from '@iconify/react/dist/iconify.js';

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
  const { data, isLoading } = useAllAppointments();

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
            uid: appointment.patient.uid,
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
            onView: () =>
              router.push(`/dashboard/appointments/${appointment.aid}`),
            onEdit: () =>
              router.push(`/dashboard/appointments/${appointment.aid}/edit`),
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
    <div className="flex gap-2">
      <Tooltip content="Calendar View" delay={1000} placement="top">
        <Button
          isIconOnly
          size="sm"
          variant="bordered"
          as={Link}
          href="/appointments"
        >
          <Icon icon="solar:calendar-linear" width={16} />
        </Button>
      </Tooltip>
      <Button color="primary" size="sm" as={Link} href="/appointments/create">
        New Appointment
      </Button>
    </div>
  );

  const renderSelectedActions = (selectedKeys: Selection) => {
    return (
      <DropdownMenu aria-label="Selected Actions">
        <DropdownItem
          key="export"
          onPress={async () => {
            // convert selectedKeys to array of numbers
            const keys = convertSelectionToKeys(selectedKeys);

            await apiRequest({
              method: 'POST',
              url: '/api/v1/appointments/export',
              data: { keys },
              responseType: 'blob',
              successMessage: {
                title: 'Appointments exported successfully',
              },
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
            setAction('bulk-cancel');
          }}
        >
          Cancel
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          onPress={() => {
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
        searchField={(appointment, searchValue) =>
          appointment.patient.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          appointment.patient?.phone
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          appointment.aid.toString().includes(searchValue)
        }
        selectedKeys={keys}
        onSelectionChange={(selectedKeys) => {
          setKeys(selectedKeys);
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
      {selected && <AppointmentQuickLook />}
      {(action === 'bulk-delete' || action === 'bulk-cancel') && (
        <CancelDeleteAppointments
          appointments={appointments.filter((appointment) => {
            if (keys === 'all') return true;
            return keys?.has(String(appointment.aid));
          })}
          type={action === 'bulk-delete' ? 'delete' : 'cancel'}
        />
      )}
    </>
  );
}
