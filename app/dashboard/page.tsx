'use client';

import { useEffect, useMemo, useState } from 'react';
import { addToast, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  renderActions,
  renderChip,
  renderCopyableText,
  renderDate,
} from '../../components/ui/data-table/cell-renderers';
import type {
  ColumnDef,
  FilterDef,
} from '../../components/ui/data-table/types';

import { Table } from '@/components/ui/data-table';
import { UserType } from '@/models/User';
import { generateRows } from './users/mock';

const INITIAL_VISIBLE_COLUMNS = ['uid', 'name', 'email', 'role', 'createdAt'];

export default function UserTable() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const rows = await generateRows(100);
      setUsers(rows);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Define columns with render functions
  const columns: ColumnDef<UserType>[] = useMemo(
    () => [
      {
        name: 'User ID',
        uid: 'uid',
        sortable: true,
        renderCell: (user) => renderCopyableText(user.uid.toString()),
      },
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (user) => (
          <div className="font-medium text-default-foreground">{user.name}</div>
        ),
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (user) => (
          <div className="truncate lowercase text-default-foreground">
            {user.email}
          </div>
        ),
      },
      {
        name: 'Role',
        uid: 'role',
        sortable: true,
        renderCell: (user) =>
          renderChip({
            item: user.role,
          }),
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (user) =>
          renderChip({
            item: user.status,
          }),
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (user) =>
          renderDate({ date: user.createdAt, isTime: true }),
      },

      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (user) =>
          renderActions(
            () => console.log('View', user.uid),
            () => console.log('Edit', user.uid),
            () => console.log('Delete', user.uid),
            () => console.log('Copy', user.uid)
          ),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<UserType>[] = useMemo(
    () => [
      {
        name: 'Role',
        key: 'role',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Admin', value: 'admin' },
          { label: 'Doctor', value: 'doctor' },
          { label: 'Patient', value: 'user' },
          { label: 'Receptionist', value: 'receptionist' },
          { label: 'Nurse', value: 'nurse' },
        ],
        filterFn: (user, value) => user.role.toLowerCase() === value,
      },
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
        filterFn: (user, value) => user.status.toLowerCase() === value,
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
        filterFn: (user, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(user.createdAt);
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
  const renderTopBar = () => (
    <div className="mb-[18px] flex items-center justify-between">
      <div className="flex w-[226px] items-center gap-2">
        <h1 className="text-2xl font-[700] leading-[32px]">Users</h1>
        <Chip
          className="hidden items-center text-default-500 sm:flex"
          size="sm"
          variant="flat"
        >
          {users.length}
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

  // Show empty state during client-side loading

  return (
    <div className="p-6">
      <Table
        key="users"
        isLoading={isLoading}
        data={users}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="uid"
        filters={filters}
        searchField={(user, searchValue) =>
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
        }
        renderTopBar={renderTopBar}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          addToast({
            title: 'User',
            description: `User ${row} clicked`,
            color: 'success',
          });
        }}
      />
    </div>
  );
}
