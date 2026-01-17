'use client';

import { useMemo } from 'react';
import { addToast, Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';
import Link from 'next/link';

import { Table } from '@/components/ui/static-data-table';
import { renderDropdownMenu, renderDate } from '@/components/ui/static-data-table/cell-renderers';
import { DropdownItemWithSection } from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef } from '@/components/ui/static-data-table/types';
import { useAllNewsletters } from '@/services/client/newsletters/newsletter.query';
import { NewsletterType } from '@/services/client/newsletters/newsletter.types';

const INITIAL_VISIBLE_COLUMNS = ['email', 'updatedAt', 'createdAt'];

export default function Newsletters() {
  const { data, isLoading } = useAllNewsletters();

  const newsletters: NewsletterType[] = data || [];

  const dropdownMenuItems = (newsletter: NewsletterType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/newsletters/${newsletter._id}`,
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<NewsletterType>[] = useMemo(
    () => [
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (newsletter) => (
          <div className="truncate lowercase text-default-foreground">{newsletter.email}</div>
        ),
      },

      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (newsletter) => renderDate({ date: newsletter.createdAt, isTime: true }),
      },
      {
        name: 'Updated At',
        uid: 'updatedAt',
        sortable: true,
        renderCell: (newsletter) => renderDate({ date: newsletter.updatedAt, isTime: true }),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (newsletter) => renderDropdownMenu(dropdownMenuItems(newsletter)),
      },
    ],
    []
  );

  // Render top bar
  const endContent = () => (
    <Button color="primary" size="sm">
      New Newsletter
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
    <Table
      uniqueKey="newsletters"
      isLoading={isLoading}
      data={newsletters}
      columns={columns}
      initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
      keyField="_id"
      // filters={filters}
      searchField={(newsletter, searchValue) =>
        newsletter.email.toLowerCase().includes(searchValue.toLowerCase())
      }
      endContent={endContent}
      renderSelectedActions={renderSelectedActions}
      initialSortDescriptor={{
        column: 'createdAt',
        direction: 'descending',
      }}
      onRowAction={(row) => {
        addToast({
          title: 'Newsletter',
          description: `Newsletter ${row} clicked`,
          color: 'success',
        });
      }}
    />
  );
}
