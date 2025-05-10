'use client';

import { useMemo, useState } from 'react';
import {
  addToast,
  Avatar,
  Button,
  DropdownItem,
  DropdownMenu,
  Selection,
  useDisclosure,
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
import { UserType } from '@/models/User';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/lib/users/helper';
import { useRouter } from 'nextjs-toploader/app';
import { toast } from 'sonner';
import QuickLook from './quick-look';
import BulkDeleteModal from '../../ui/common/modals/bulk-delete';
import axios from 'axios';
import { ModalCellRenderer } from './cell-renderer';

const INITIAL_VISIBLE_COLUMNS = [
  'image',
  'uid',
  'name',
  'email',
  'role',
  'createdAt',
];

export default function Users() {
  const router = useRouter();
  const deleteModal = useDisclosure();
  const quickLook = useDisclosure();

  const [selectedKeys, setSelectedKeys] = useState<Selection>();
  const [quickLookItem, setQuickLookItem] = useState<UserType | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(),
  });

  const users: UserType[] = data || [];

  // Define columns with render functions
  const columns: ColumnDef<UserType>[] = useMemo(() => {
    return [
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
          <div className="truncate lowercase text-default-foreground">
            {user.email}
          </div>
        ),
      },
      {
        name: 'Phone',
        uid: 'phone',
        sortable: true,
        renderCell: (user) => (
          <div className="truncate text-default-foreground">
            {user.phone || 'N/A'}
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
          renderActions({
            onView: () => router.push(`/dashboard/users/${user.uid}`),
            onEdit: () => router.push(`/dashboard/users/${user.uid}/edit`),
            key: user.uid,
            onDelete: async () => {
              const deletePromise = fetch(`/api/v1/users/uid/${user.uid}`, {
                method: 'DELETE',
              });
              toast.promise(deletePromise, {
                loading: `Deleting ${user.name}`,
                success: `${user.name} was deleted successfully`,
                error: (err: any) => {
                  console.error(err);
                  return err?.message || 'Failed to delete user';
                },
              });
              // remove all selected keys
              refetch();
            },
          }),
      },
    ];
  }, []);

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
    <Button
      color="primary"
      size="sm"
      onPress={() => router.push('/dashboard/users/new')}
    >
      New User
    </Button>
  );

  const renderSelectedActions = (selectedKeys: Selection) => {
    return (
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
            setSelectedKeys(selectedKeys);
            deleteModal.onOpen();
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
          (user.phone
            ? user.phone.toLowerCase().includes(searchValue.toLowerCase())
            : false)
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
            setQuickLookItem(user);
            quickLook.onOpen();
          }
        }}
      />
      {deleteModal.isOpen && (
        <BulkDeleteModal<UserType>
          modalKey="users"
          items={users.filter((user) => {
            if (selectedKeys === 'all') return true;
            return selectedKeys?.has(String(user.uid));
          })}
          onClose={deleteModal.onClose}
          onDelete={async () => {
            if (!selectedKeys) return;

            const ids = Array.from(selectedKeys);
            await axios
              .delete('/api/v1/users', {
                data: { ids },
              })
              .then(() => {
                addToast({
                  title: 'Deleted successfully',
                  description: `${ids.length} user${
                    ids.length > 1 ? 's' : ''
                  } ${ids.length > 1 ? 'were' : 'was'} deleted successfully`,
                  color: 'success',
                });
                deleteModal.onClose();
                refetch();
                setSelectedKeys(undefined);
              })
              .catch((err) => {
                console.error(err);
                addToast({
                  title: 'Failed to delete users',
                  description: err?.message || 'Failed to delete users',
                  color: 'danger',
                });
              });
          }}
          renderItem={(user) => <ModalCellRenderer user={user} />}
        />
      )}
      {quickLook.isOpen && quickLookItem && (
        <QuickLook onClose={quickLook.onClose} item={quickLookItem} />
      )}
    </>
  );
}
