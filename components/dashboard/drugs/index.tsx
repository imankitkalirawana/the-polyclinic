'use client';

import { useMemo } from 'react';
import { Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';
import Link from 'next/link';
import { DrugQuickLook } from './quicklook';
import { useDrugStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  renderChip,
  renderCopyableText,
  renderDate,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { useAllDrugs } from '@/services/client/drug/drug.query';
import { DrugType } from '@/services/client/drug/drug.types';

const INITIAL_VISIBLE_COLUMNS = [
  'did',
  'brandName',
  'genericName',
  'manufacturer',
  'status',
  'createdAt',
];

export default function Drugs() {
  const { data, isLoading } = useAllDrugs();

  const drugs: DrugType[] = data || [];
  const { selected, setSelected } = useDrugStore();

  const dropdownMenuItems = (drug: DrugType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/drugs/${drug.did}`,
      },
      {
        key: 'edit',
        children: 'Edit',
        as: Link,
        href: `/dashboard/drugs/${drug.did}/edit`,
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => console.log('Delete', drug.did),
        section: 'Danger Zone',
        className: 'text-danger',
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<DrugType>[] = useMemo(
    () => [
      {
        name: 'Drug ID',
        uid: 'did',
        sortable: true,
        renderCell: (drug) => renderCopyableText(drug.did.toString()),
      },
      {
        name: 'Brand Name',
        uid: 'brandName',
        sortable: true,
        renderCell: (drug) => (
          <div className="font-medium text-default-foreground">{drug.brandName}</div>
        ),
      },
      {
        name: 'Generic Name',
        uid: 'genericName',
        sortable: true,
        renderCell: (drug) => (
          <div className="truncate capitalize text-default-foreground">{drug.genericName}</div>
        ),
      },
      {
        name: 'Manufacturer',
        uid: 'manufacturer',
        sortable: true,
        renderCell: (drug) => (
          <div className="truncate capitalize text-default-foreground">{drug.manufacturer}</div>
        ),
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (drug) =>
          renderChip({
            item: drug.status,
          }),
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
  const filters: FilterDef<DrugType>[] = useMemo(
    () => [
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable' },
        ],
        filterFn: (drug, value) => drug.status.toLowerCase() === value,
      },
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
        keyField="did"
        filters={filters}
        searchField={(drug, searchValue) =>
          drug.brandName.toLowerCase().includes(searchValue.toLowerCase()) ||
          drug.genericName.toLowerCase().includes(searchValue.toLowerCase()) ||
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
        onRowAction={(row) => {
          const drug = drugs.find((drug) => drug.did == row);
          if (drug) {
            setSelected(drug);
          }
        }}
      />
      {/* Quick Look or Sidebar can be added here */}
      {selected && <DrugQuickLook />}
    </>
  );
}
