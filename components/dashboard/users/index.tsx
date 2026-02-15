'use client';

import React, { useMemo, useState } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection, useDisclosure } from '@heroui/react';
import Link from 'next/link';
// eslint-disable-next-line no-restricted-imports
import { toast } from 'sonner';

import { UserQuickLook } from './quicklook';
import { useUserStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  renderChip,
  renderDate,
  RenderUser,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { useAllUsers } from '@/services/common/user/user.query';
import { UserType } from '@/services/common/user/user.types';
import { CopyText } from '@/components/ui/copy';
import ResetPasswordModal from './ui/reset-password-modal';
import DeleteUserModal from './ui/delete-user-modal';
import { useSession } from '@/libs/providers/session-provider';
import { Role } from '@/services/common/user/user.constants';
import { useRouter } from 'nextjs-toploader/app';

const INITIAL_VISIBLE_COLUMNS = ['image', 'name', 'email', 'role', 'createdAt'];

type Action = 'edit' | 'delete' | 'change-password';

const PERMISSIONS: Record<Action, Partial<Record<Role, Role[]>>> = {
  edit: {
    PATIENT: [Role.ADMIN, Role.RECEPTIONIST],
    DOCTOR: [Role.ADMIN],
    RECEPTIONIST: [Role.ADMIN],
    ADMIN: [Role.ADMIN],
  },

  delete: {
    PATIENT: [Role.ADMIN],
    DOCTOR: [Role.ADMIN],
    RECEPTIONIST: [Role.ADMIN],
    ADMIN: [Role.ADMIN],
  },

  'change-password': {
    PATIENT: [Role.ADMIN],
    DOCTOR: [Role.ADMIN],
    RECEPTIONIST: [Role.ADMIN],
    ADMIN: [Role.ADMIN],
  },
};

const getRoles = (targetUser: UserType, action: Action): Role[] => {
  return PERMISSIONS[action]?.[targetUser.role] ?? [];
};

export default function Users() {
  const router = useRouter();
  const { user: currentUser } = useSession();
  const deleteModal = useDisclosure();
  const resetPasswordModal = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { setSelected } = useUserStore();

  const { data, isLoading, isError, error } = useAllUsers();

  const handleDelete = async (id: string) => {
    setSelectedUserId(id);
    deleteModal.onOpen();
  };

  const handleChangePassword = async (id: string) => {
    setSelectedUserId(id);
    resetPasswordModal.onOpen();
  };

  const dropdownMenuItems = (user: UserType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        onPress: () => router.push(`/dashboard/users/${user.id}`),
      },
      {
        key: 'edit',
        children: 'Edit',
        onPress: () => router.push(`/dashboard/users/${user.id}/edit`),
        roles: getRoles(user, 'edit'),
      },
      {
        key: 'change-password',
        color: 'warning',
        children: 'Reset Password',
        onPress: () => handleChangePassword(user.id),
        section: 'Danger Zone',
        className: 'text-warning',
        roles: getRoles(user, 'change-password'),
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => handleDelete(user.id),
        section: 'Danger Zone',
        className: 'text-danger',
        roles: getRoles(user, 'delete'),
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<UserType>[] = useMemo(
    () => [
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (user) => (
          <RenderUser
            size="md"
            name={user.name}
            variant={user.role === Role.DOCTOR ? 'beam' : 'marble'}
            description={user.phone || '-'}
            classNames={{
              description: 'lowercase',
            }}
          />
        ),
      },
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (user) => <CopyText>{user.email}</CopyText>,
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (user) => <CopyText>{user.phone}</CopyText>,
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
        renderCell: (user) => renderDropdownMenu(dropdownMenuItems(user), currentUser?.role),
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
    <Button color="primary" size="sm" as={Link} href="/dashboard/users/new">
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

  let users: UserType[] = [];
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
        keyField="id"
        filters={filters}
        searchField={(user, searchValue) =>
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.id.toString().includes(searchValue) ||
          (user.phone ? user.phone.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const user = users.find((user) => user.id == row);
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
      <ResetPasswordModal
        userId={selectedUserId}
        isOpen={resetPasswordModal.isOpen}
        onClose={resetPasswordModal.onClose}
      />
      <DeleteUserModal
        userId={selectedUserId}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </>
  );
}
