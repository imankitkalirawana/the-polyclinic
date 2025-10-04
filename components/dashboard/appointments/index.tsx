'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import { Button, DropdownItem, DropdownMenu, Selection, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import CancelDeleteAppointments from '@/components/client/appointments/ui/bulk-cancel-delete';
import { AppointmentQuickLook } from './quicklook';

import { Table } from '@/components/ui/data-table';
import {
  renderActions,
  renderChip,
  renderCopyableText,
  renderDate,
  renderUser,
} from '@/components/ui/data-table/cell-renderers';
import { convertSelectionToKeys } from '@/components/ui/data-table/helper';
import type { ColumnDef, FilterDef } from '@/components/ui/data-table/types';
import { apiRequest } from '@/lib/axios';
import { useAllAppointments } from '@/services/client/appointment/query';
import { useAppointmentStore } from '@/store/appointment';
import { AppointmentType } from '@/services/client/appointment';

const INITIAL_VISIBLE_COLUMNS = ['aid', 'date', 'patient.name', 'doctor.name', 'status'];

export default function Appointments() {
  const router = useRouter();

  const { aid, setAid, keys, setKeys, action, setAction } = useAppointmentStore();
  const { data, isLoading } = useAllAppointments();

  // Removed debug log for production

  const appointments: AppointmentType[] = useMemo(() => data || [], [data]);

  // Define columns with render functions
  const columns: ColumnDef<AppointmentType>[] = useMemo(
    () => [
      {
        name: 'Appointment ID',
        uid: 'aid',
        sortable: true,
        renderCell: (appointment) => renderCopyableText(appointment.aid.toString()),
      },

      {
        name: 'Patient Name',
        uid: 'patient.name',
        sortable: true,
        renderCell: (appointment) =>
          renderUser({
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
        renderCell: (appointment) => renderDate({ date: appointment.date, isTime: true }),
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (appointment) => renderDate({ date: appointment.createdAt, isTime: true }),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (appointment) =>
          renderActions({
            onView: () => router.push(`/dashboard/appointments/${appointment.aid}`),
            onEdit: () => router.push(`/dashboard/appointments/${appointment.aid}/edit`),
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
        filterFn: (appointment, value) => appointment.status.toLowerCase() === value,
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
        <Button isIconOnly size="sm" variant="bordered" as={Link} href="/appointments">
          <Icon icon="solar:calendar-linear" width={16} />
        </Button>
      </Tooltip>
      <Button color="primary" size="sm" as={Link} href="/appointments/create">
        New Appointment
      </Button>
    </div>
  );

  const renderSelectedActions = (selectedKeys: Selection) => (
    <DropdownMenu aria-label="Selected Actions">
      <DropdownItem
        key="export"
        onPress={async () => {
          // convert selectedKeys to array of numbers
          const keys = convertSelectionToKeys(selectedKeys);

          // TODO: Fix this
          await apiRequest({
            method: 'POST',
            url: '/appointments/export',
            data: { keys },
            responseType: 'blob',
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
          appointment.patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          appointment.patient?.phone?.toLowerCase().includes(searchValue.toLowerCase()) ||
          appointment.aid.toString().includes(searchValue)
        }
        selectedKeys={keys}
        onSelectionChange={(selectedKeys) => {
          setKeys(selectedKeys);
        }}
        onRowAction={(row) => {
          const appointment = appointments.find((appointment) => appointment.aid == row);
          if (appointment) {
            setAid(appointment.aid);
          }
        }}
      />
      {aid && <AppointmentQuickLook />}
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
