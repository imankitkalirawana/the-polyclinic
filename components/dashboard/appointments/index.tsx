'use client';

import { useMemo } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';

import {
  renderActions,
  renderChip,
  renderCopyableText,
  renderDate,
} from '@/components/ui/data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/data-table/types';

import { Table } from '@/components/ui/data-table';
import { AppointmentType } from '@/models/Appointment';
import { useRouter } from 'nextjs-toploader/app';
import QuickLook from './quick-look';
import { useAppointment } from './context';

const INITIAL_VISIBLE_COLUMNS = [
  'aid',
  'date',
  'patient.name',
  'doctor.name',
  'status',
];

export default function Appointments() {
  const router = useRouter();
  const { query, formik } = useAppointment();

  const appointments: AppointmentType[] = query.data || [];

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
        renderCell: (appointment) => (
          <div className="truncate capitalize text-default-foreground">
            {appointment.patient.name}
          </div>
        ),
      },
      {
        name: 'Doctor Name',
        uid: 'doctor.name',
        sortable: true,
        renderCell: (appointment) => (
          <div
            className={`truncate capitalize ${
              appointment?.doctor?.name
                ? 'text-default-foreground'
                : 'text-gray-400'
            }`}
          >
            {appointment?.doctor?.name || 'Not Assigned'}
          </div>
        ),
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
    <Button color="primary" size="sm">
      New Appointment
    </Button>
  );

  const renderSelectedActions = (selectedKeys: Selection) => {
    return (
      <DropdownMenu aria-label="Selected Actions">
        <DropdownItem
          key="bulk-edit"
          onPress={() => {
            console.log('Bulk edit', selectedKeys);
          }}
        >
          Bulk edit
        </DropdownItem>
        <DropdownItem
          key="export"
          onPress={() => {
            console.log('Export', selectedKeys);
          }}
        >
          Export
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          onPress={() => {
            console.log('Delete', selectedKeys);
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
        isLoading={query.isLoading}
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
            formik.setFieldValue('selected', appointment);
          }
        }}
      />
      {formik.values.selected && <QuickLook />}
    </>
  );
}
