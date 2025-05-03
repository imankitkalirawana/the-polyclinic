'use client';

import { useMemo } from 'react';
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
} from '@/components/ui/data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/data-table/types';

import { Table } from '@/components/ui/data-table';
import { EmailType } from '@/models/Email';
import { useQuery } from '@tanstack/react-query';
import { getAllEmails } from '@/app/dashboard/emails/helper';

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'from',
  'to',
  'subject',
  'message',
  'createdAt',
];

export default function Emails() {
  const { data, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: () => getAllEmails(),
  });

  const emails: EmailType[] = data || [];
  console.log('emails', emails);
  // Define columns with render functions
  const columns: ColumnDef<EmailType>[] = useMemo(
    () => [
      // {
      //   name: 'Id',
      //   uid: 'id',
      //   sortable: true,
      //   renderCell: (email) => renderCopyableText(email._id.toString()),
      // },
      {
        name: 'From',
        uid: 'from',
        sortable: true,
        renderCell: (email) => (
          <div className="font-medium text-default-foreground">
            {email.from}
          </div>
        ),
      },
      {
        name: 'To',
        uid: 'to',
        sortable: true,
        renderCell: (email) => (
          <div className="truncate text-default-foreground">{email.to}</div>
        ),
      },
      {
        name: 'Subject',
        uid: 'subject',
        sortable: true,
        renderCell: (email) => (
          <div className="truncate capitalize text-default-foreground">
            {email.subject}
          </div>
        ),
      },
      // {
      //   name: 'Message',
      //   uid: 'message',
      //   sortable: true,
      //   renderCell: (email) => (
      //     <div className="truncate capitalize text-default-foreground">
      //       {email.message}
      //     </div>
      //   ),
      // },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (email) =>
          renderDate({ date: email.createdAt, isTime: true }),
      },

      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (email) =>
          renderActions(
            () => console.log('View', email._id),
            () => console.log('Edit', email._id),
            () => console.log('Delete', email._id),
            () => console.log('Copy', email._id)
          ),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<EmailType>[] = useMemo(
    () => [
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable' },
        ],
        filterFn: (email, value) => email._id.toLowerCase() === value,
      },
      {
        name: 'Created At',
        key: 'createdAt',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Past Emails', value: 'past' },
        ],
        filterFn: (email, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(email.createdAt);
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
      New Email
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
      key="emails"
      isLoading={isLoading}
      data={emails}
      columns={columns}
      initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
      keyField="_id"
      filters={filters}
      searchField={(email, searchValue) =>
        email.from.toLowerCase().includes(searchValue.toLowerCase()) ||
        email.to.toLowerCase().includes(searchValue.toLowerCase()) ||
        (email.message
          ? email.message.toLowerCase().includes(searchValue.toLowerCase())
          : false)
      }
      endContent={endContent}
      renderSelectedActions={renderSelectedActions}
      initialSortDescriptor={{
        column: 'createdAt',
        direction: 'descending',
      }}
      onRowAction={(row) => {
        addToast({
          title: 'Email',
          description: `Email ${row} clicked`,
          color: 'success',
        });
      }}
    />
  );
}
