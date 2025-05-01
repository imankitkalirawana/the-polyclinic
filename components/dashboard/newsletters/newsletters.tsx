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
import { NewsletterType } from '@/models/Newsletter';
import { useQuery } from '@tanstack/react-query';
import { getAllNewsletters } from '@/app/dashboard/newsletters/helper';

const INITIAL_VISIBLE_COLUMNS = ['email', 'updatedAt', 'createdAt'];

export default function Newsletters() {
  const { data, isLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: () => getAllNewsletters(),
  });

  const newsletters: NewsletterType[] = data || [];

  // Define columns with render functions
  const columns: ColumnDef<NewsletterType>[] = useMemo(
    () => [
      {
        name: 'Email',
        uid: 'email',
        sortable: true,
        renderCell: (newsletter) => (
          <div className="truncate lowercase text-default-foreground">
            {newsletter.email}
          </div>
        ),
      },

      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (newsletter) =>
          renderDate({ date: newsletter.createdAt, isTime: true }),
      },
      {
        name: 'Updated At',
        uid: 'updatedAt',
        sortable: true,
        renderCell: (newsletter) =>
          renderDate({ date: newsletter.updatedAt, isTime: true }),
      },

      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (newsletter) =>
          renderActions(
            () => console.log('View', newsletter._id),
            () => console.log('Edit', newsletter._id),
            () => console.log('Delete', newsletter._id),
            () => console.log('Copy', newsletter._id)
          ),
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
      key="newsletters"
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
