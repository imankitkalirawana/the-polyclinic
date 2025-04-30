'use client';

import { useMemo } from 'react';
import { addToast, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  renderActions,
  renderCopyableText,
  renderDate,
} from '../../components/ui/data-table/cell-renderers';
import type {
  ColumnDef,
  FilterDef,
} from '../../components/ui/data-table/types';

import { Table } from '@/components/ui/data-table';

// Sample appointment data
interface Appointment {
  id: number;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  notes?: string;
}

const appointments: Appointment[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  appointmentId: `APT-${1000 + i}`,
  patientName: [
    'John Smith',
    'Emma Johnson',
    'Michael Brown',
    'Sophia Davis',
    'James Wilson',
  ][Math.floor(Math.random() * 5)],
  doctorName: [
    'Dr. Roberts',
    'Dr. Chen',
    'Dr. Patel',
    'Dr. Garcia',
    'Dr. Thompson',
  ][Math.floor(Math.random() * 5)],
  department: [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
  ][Math.floor(Math.random() * 5)],
  date: new Date(
    Date.now() + (Math.floor(Math.random() * 30) - 15) * 24 * 60 * 60 * 1000
  ),
  time: ['09:00 AM', '10:30 AM', '01:15 PM', '03:45 PM', '05:00 PM'][
    Math.floor(Math.random() * 5)
  ],
  status: ['Scheduled', 'Completed', 'Cancelled', 'No-show'][
    Math.floor(Math.random() * 4)
  ] as Appointment['status'],
  notes:
    Math.random() > 0.7 ? 'Patient requested follow-up appointment' : undefined,
}));

export default function AppointmentTable() {
  // Define columns with render functions
  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
      {
        name: 'Appointment ID',
        uid: 'appointmentId',
        sortable: true,
        renderCell: (appointment) =>
          renderCopyableText(appointment.appointmentId),
      },
      {
        name: 'Patient',
        uid: 'patientName',
        sortable: true,
        renderCell: (appointment) => (
          <div className="font-medium text-default-foreground">
            {appointment.patientName}
          </div>
        ),
      },
      {
        name: 'Doctor',
        uid: 'doctorName',
        sortable: true,
        renderCell: (appointment) => (
          <div className="text-default-foreground">
            {appointment.doctorName}
          </div>
        ),
      },
      {
        name: 'Department',
        uid: 'department',
        sortable: true,
        renderCell: (appointment) => (
          <div className="text-default-foreground">
            {appointment.department}
          </div>
        ),
      },
      {
        name: 'Date',
        uid: 'date',
        sortable: true,
        renderCell: (appointment) => renderDate(appointment.date),
      },
      {
        name: 'Time',
        uid: 'time',
        sortable: true,
        renderCell: (appointment) => (
          <div className="text-default-foreground">{appointment.time}</div>
        ),
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (appointment) => {
          const getStatusColor = () => {
            switch (appointment.status) {
              case 'Scheduled':
                return 'bg-blue-500 text-blue-700';
              case 'Completed':
                return 'bg-success-500 text-success-700';
              case 'Cancelled':
                return 'bg-danger-500 text-danger-700';
              case 'No-show':
                return 'bg-warning-500 text-warning-700';
              default:
                return 'bg-default-500 text-default-700';
            }
          };

          return (
            <Chip
              className={`gap-1 rounded-lg px-2 py-1 capitalize`}
              size="sm"
              variant="flat"
              startContent={
                <span className={`${getStatusColor()} h-2 w-2 rounded-full`} />
              }
            >
              {appointment.status.split('-').join(' ')}
            </Chip>
          );
        },
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (appointment) =>
          renderActions(
            () => console.log('View', appointment.id),
            () => console.log('Edit', appointment.id),
            () => console.log('Delete', appointment.id),
            () => console.log('Copy', appointment.id)
          ),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<Appointment>[] = useMemo(
    () => [
      {
        name: 'Department',
        key: 'department',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Cardiology', value: 'cardiology' },
          { label: 'Neurology', value: 'neurology' },
          { label: 'Pediatrics', value: 'pediatrics' },
          { label: 'Orthopedics', value: 'orthopedics' },
          { label: 'Dermatology', value: 'dermatology' },
        ],
        filterFn: (appointment, value) =>
          appointment.department.toLowerCase() === value,
      },
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'No-show', value: 'no-show' },
        ],
        filterFn: (appointment, value) =>
          appointment.status.toLowerCase() === value,
      },
      {
        name: 'Date',
        key: 'date',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Next week', value: 'nextWeek' },
          { label: 'Past appointments', value: 'past' },
        ],
        filterFn: (appointment, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);

          const daysDiff = Math.floor(
            (appointmentDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          switch (value) {
            case 'today':
              return daysDiff === 0;
            case 'thisWeek':
              return daysDiff >= 0 && daysDiff < 7;
            case 'nextWeek':
              return daysDiff >= 7 && daysDiff < 14;
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
  const renderTopBar = () => (
    <div className="mb-[18px] flex items-center justify-between">
      <div className="flex w-[226px] items-center gap-2">
        <h1 className="text-2xl font-[700] leading-[32px]">Appointments</h1>
        <Chip
          className="hidden items-center text-default-500 sm:flex"
          size="sm"
          variant="flat"
        >
          {appointments.length}
        </Chip>
      </div>
      <Button
        color="primary"
        endContent={<Icon icon="solar:calendar-add-bold" width={20} />}
      >
        New Appointment
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <Table
        data={appointments}
        columns={columns}
        initialVisibleColumns={columns.map((col) => col.uid)}
        keyField="appointmentId"
        filters={filters}
        searchField={(appointment, searchValue) =>
          appointment.patientName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          appointment.doctorName
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        }
        renderTopBar={renderTopBar}
        initialSortDescriptor={{
          column: 'date',
          direction: 'ascending',
        }}
        onRowAction={(row) => {
          addToast({
            title: 'Appointment',
            description: `Appointment ${row} clicked`,
            color: 'success',
          });
        }}
      />
    </div>
  );
}
