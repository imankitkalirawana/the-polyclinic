'use client';

import { useMemo } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';
import Link from 'next/link';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  renderDate,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { useAllDrugs } from '@/services/client/drug/drug.query';
import { Drug } from '@/shared';
import { CopyText } from '@/components/ui/copy';

const INITIAL_VISIBLE_COLUMNS = ['did', 'name', 'generic_name', 'manufacturer', 'createdAt'];

export default function Drugs() {
  const { data, isLoading } = useAllDrugs();

  const drugs: Drug[] = data || [];

  const dropdownMenuItems = (drug: Drug): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/drugs/${drug.unique_id}`,
      },
      {
        key: 'edit',
        children: 'Edit',
        as: Link,
        href: `/dashboard/drugs/${drug.unique_id}/edit`,
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => console.log('Delete', drug.unique_id),
        section: 'Danger Zone',
        className: 'text-danger',
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<Drug>[] = useMemo(
    () => [
      {
        name: 'Drug ID',
        uid: 'unique_id',
        sortable: true,
        renderCell: (drug) => <CopyText>{drug.unique_id}</CopyText>,
      },
      {
        name: 'Brand Name',
        uid: 'name',
        sortable: true,
        renderCell: (drug) => (
          <div className="text-default-foreground font-medium">{drug.name}</div>
        ),
      },
      {
        name: 'Generic Name',
        uid: 'generic_name',
        sortable: true,
        renderCell: (drug) => (
          <div className="text-default-foreground truncate capitalize">{drug.generic_name}</div>
        ),
      },
      {
        name: 'Manufacturer',
        uid: 'manufacturer',
        sortable: true,
        renderCell: (drug) => (
          <div className="text-default-foreground truncate capitalize">{drug.manufacturer}</div>
        ),
      },

      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (drug) => renderDate({ date: drug.createdAt, isTime: true }),
      },
      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (drug) => renderDropdownMenu(dropdownMenuItems(drug)),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<Drug>[] = useMemo(
    () => [
      {
        name: 'Created At',
        key: 'createdAt',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Past Drugs', value: 'past' },
        ],
        filterFn: (drug, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(drug.createdAt);
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
      New Drug
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
        uniqueKey="drugs"
        isLoading={isLoading}
        data={drugs}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="unique_id"
        filters={filters}
        searchField={(drug, searchValue) =>
          drug.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          drug.generic_name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (drug.manufacturer
            ? drug.manufacturer.toLowerCase().includes(searchValue.toLowerCase())
            : false)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        // onRowAction={() => {}}
      />
    </>
  );
}
