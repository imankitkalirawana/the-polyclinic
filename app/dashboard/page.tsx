'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  addToast,
  Button,
  DropdownItem,
  DropdownMenu,
  Selection,
} from '@heroui/react';

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
import { UserStatus, UserType } from '@/models/User';
import { generateUsers } from './users/mock';
import { useQuery } from '@tanstack/react-query';

const INITIAL_VISIBLE_COLUMNS = ['uid', 'name', 'email', 'role', 'createdAt'];

export default function UserTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => generateUsers(100),
  });

  const users: UserType[] = data ?? [];

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
          { label: 'Blocked', value: 'blocked' },
          { label: 'Deleted', value: 'deleted' },
          { label: 'Unverified', value: 'unverified' },
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
  const endContent = () => (
    <Button color="primary" size="sm">
      New User
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
      endContent={endContent}
      renderSelectedActions={renderSelectedActions}
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
  );
}
