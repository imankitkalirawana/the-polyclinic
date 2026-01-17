'use client';

import { useMemo } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';
import Link from 'next/link';

import { EmailQuickLook } from './quicklook';
import { useEmailStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import { renderDropdownMenu, renderDate } from '@/components/ui/static-data-table/cell-renderers';
import { DropdownItemWithSection } from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { useAllEmails } from '@/services/client/email/email.query';
import { EmailType } from '@/services/client/email/email.types';

const INITIAL_VISIBLE_COLUMNS = ['id', 'from', 'to', 'subject', 'message', 'createdAt'];

export default function Emails() {
  const { data, isLoading } = useAllEmails();
  const { selected, setSelected } = useEmailStore();

  const emails: EmailType[] = data || [];

  const dropdownMenuItems = (email: EmailType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/emails/${email._id}`,
      },
    ];
  };
  // Define columns with render functions
  const columns: ColumnDef<EmailType>[] = useMemo(
    () => [
      {
        name: 'From',
        uid: 'from',
        sortable: true,
        renderCell: (email) => (
          <div className="font-medium text-default-foreground">{email.from}</div>
        ),
      },
      {
        name: 'To',
        uid: 'to',
        sortable: true,
        renderCell: (email) => <div className="truncate text-default-foreground">{email.to}</div>,
      },
      {
        name: 'Subject',
        uid: 'subject',
        sortable: true,
        renderCell: (email) => (
          <div className="truncate capitalize text-default-foreground">{email.subject}</div>
        ),
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (email) => renderDate({ date: email.createdAt, isTime: true }),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (email) => renderDropdownMenu(dropdownMenuItems(email)),
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

  const renderSelectedActions = (selectedKeys: Selection) => (
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

  return (
    <>
      <Table
        uniqueKey="emails"
        isLoading={isLoading}
        data={emails}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="_id"
        filters={filters}
        searchField={(email, searchValue) =>
          email.from.toLowerCase().includes(searchValue.toLowerCase()) ||
          email.to.toLowerCase().includes(searchValue.toLowerCase()) ||
          (email.message ? email.message.toLowerCase().includes(searchValue.toLowerCase()) : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const email = emails.find((email) => email._id == row);
          if (email) {
            setSelected(email);
          }
        }}
      />
      {selected && <EmailQuickLook />}
    </>
  );
}
