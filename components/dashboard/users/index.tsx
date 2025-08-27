'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import { toast } from 'sonner';

import { UserQuickLook } from './quicklook';
import { useUserStore } from './store';

import { Table } from '@/components/ui/data-table';
import {
  renderActions,
  renderChip,
  renderCopyableText,
  renderDate,
  renderUser,
} from '@/components/ui/data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/data-table/types';
import { useAllUsers, useDeleteUser } from '@/hooks/queries/client/user';
import { UnifiedUserType } from '@/types';

const INITIAL_VISIBLE_COLUMNS = ['image', 'uid', 'name', 'email', 'role', 'createdAt'];

export default function Users() {
  const router = useRouter();
  const deleteUser = useDeleteUser();
  const deleteModal = useDisclosure();
  const { setSelected } = useUserStore();

  const { data, isLoading, isError, error } = useAllUsers();

  const handleDelete = async (uid: string) => {
    toast.promise(deleteUser.mutateAsync(uid), {
      loading: `Deleting user ${uid}`,
      success: (data) => data.message,
      error: (error) => error.message,
    });
  };

  // Define columns with render functions
  const columns: ColumnDef<UnifiedUserType>[] = useMemo(
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
        renderCell: (user) =>
          renderUser({
            avatar: user.image,
            name: user.name,
            description: user.email,
          }),
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (user) => (
          <div className="truncate lowercase text-default-foreground">{user.email}</div>
        ),
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (user) => (
          <div className="truncate text-default-foreground">{user.phone || 'N/A'}</div>
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
        renderCell: (user) => renderDate({ date: user.createdAt, isTime: true }),
      },

      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (user) =>
          renderActions({
            onView: () => router.push(`/dashboard/users/${user.uid}`),
            onEdit: () => router.push(`/dashboard/users/${user.uid}/edit`),
            key: user.uid,
            onDelete: () => handleDelete(user.uid),
          }),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<UnifiedUserType>[] = useMemo(
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
    <Button color="primary" size="sm" onPress={() => router.push('/dashboard/users/new')}>
      New User
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

  let users: UnifiedUserType[] = [];
  if (data) {
    users = data;
  }

  return (
    <>
      <Table
        isError={isError}
        errorMessage={error?.message}
        uniqueKey="users"
        isLoading={isLoading}
        data={users}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="uid"
        filters={filters}
        searchField={(user, searchValue) =>
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.uid.toString().includes(searchValue) ||
          (user.phone ? user.phone.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const user = users.find((user) => user.uid == row);
          if (user) {
            setSelected(user);
          }
        }}
      />

      {/* {quickLook.isOpen && quickLookItem && (
        <QuickLook
          onClose={quickLook.onClose}
          item={quickLookItem as UserType}
        />
      )} */}
      <UserQuickLook />
    </>
  );
}
