'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button, DropdownItem, DropdownMenu, Selection } from '@heroui/react';
// eslint-disable-next-line no-restricted-imports
import { toast } from 'sonner';

import { ServiceQuickLook } from './quicklook';
import { useServiceStore } from './store';

import { Table } from '@/components/ui/static-data-table';
import {
  renderDropdownMenu,
  renderChip,
  renderCopyableText,
  renderDate,
  DropdownItemWithSection,
} from '@/components/ui/static-data-table/cell-renderers';
import type { ColumnDef, FilterDef } from '@/components/ui/static-data-table/types';
import { CLINIC_INFO } from '@/libs/config';
import { useAllServices, useDeleteService } from '@/services/client/service/service.query';
import { ServiceType } from '@/services/client/service/service.types';

const INITIAL_VISIBLE_COLUMNS = [
  'uniqueId',
  'name',
  'price',
  'duration',
  'type',
  'status',
  'createdAt',
];

export default function Services() {
  const { data, isLoading } = useAllServices();
  const { selected, setSelected } = useServiceStore();
  const deleteService = useDeleteService();

  const services: ServiceType[] = data || [];

  const handleDelete = async (uid: string) => {
    toast.promise(deleteService.mutateAsync(uid), {
      loading: `Deleting service #${uid}`,
      success: (data) => data.message,
      error: (error) => error.message,
    });
  };

  const dropdownMenuItems = (service: ServiceType): DropdownItemWithSection[] => {
    return [
      {
        key: 'view',
        children: 'View',
        as: Link,
        href: `/dashboard/services/${service.uniqueId}`,
      },
      {
        key: 'edit',
        children: 'Edit',
        as: Link,
        href: `/dashboard/services/${service.uniqueId}/edit`,
      },
      {
        key: 'delete',
        children: 'Delete',
        color: 'danger',
        onPress: () => handleDelete(service.uniqueId),
        section: 'Danger Zone',
        className: 'text-danger',
      },
    ];
  };

  // Define columns with render functions
  const columns: ColumnDef<ServiceType>[] = useMemo(
    () => [
      {
        name: 'ID',
        uid: 'uniqueId',
        sortable: true,
        renderCell: (service) => renderCopyableText(service.uniqueId.toString()),
      },
      {
        name: 'Name',
        uid: 'name',
        sortable: true,
        renderCell: (service) => (
          <div className="truncate font-medium text-default-foreground">{service.name}</div>
        ),
      },
      {
        name: 'Description',
        uid: 'description',
        sortable: true,
        renderCell: (service) => (
          <div className="truncate lowercase text-default-foreground">{service.description}</div>
        ),
      },
      {
        name: 'Duration',
        uid: 'duration',
        sortable: true,
        renderCell: (service) => (
          <div className="truncate lowercase text-default-foreground">
            {service.duration} {service.duration === 1 ? 'hr' : 'hrs'}
          </div>
        ),
      },
      {
        name: 'Price',
        uid: 'price',
        sortable: true,
        renderCell: (service) => (
          <div className="truncate lowercase text-default-foreground">
            {CLINIC_INFO.preferences.currency.symbol} {service.price.toLocaleString('en-IN')}
          </div>
        ),
      },
      {
        name: 'Type',
        uid: 'type',
        sortable: true,
        renderCell: (service) =>
          renderChip({
            item: service.type,
          }),
      },
      {
        name: 'Status',
        uid: 'status',
        sortable: true,
        renderCell: (service) =>
          renderChip({
            item: service.status,
          }),
      },
      {
        name: 'Created At',
        uid: 'createdAt',
        sortable: true,
        renderCell: (service) => renderDate({ date: service.createdAt, isTime: true }),
      },

      {
        name: 'Actions',
        uid: 'actions',
        sortable: false,
        renderCell: (service) => renderDropdownMenu(dropdownMenuItems(service)),
      },
    ],
    []
  );

  // Define filters
  const filters: FilterDef<ServiceType>[] = useMemo(
    () => [
      {
        name: 'Type',
        key: 'type',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Medical', value: 'medical' },
          { label: 'Surgical', value: 'surgical' },
          { label: 'Diagnostic', value: 'diagnostic' },
          { label: 'Consultation', value: 'consultation' },
          { label: 'Nurse', value: 'nurse' },
        ],
        filterFn: (service, value) => service.type.toLowerCase() === value,
      },
      {
        name: 'Status',
        key: 'status',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
        filterFn: (service, value) => service.status.toLowerCase() === value,
      },
      {
        name: 'Created At',
        key: 'createdAt',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'thisWeek' },
          { label: 'Past Services', value: 'past' },
        ],
        filterFn: (service, value) => {
          if (value === 'all') return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const createdAt = new Date(service.createdAt);
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
    <Button color="primary" size="sm" as={Link} href="/dashboard/services/new">
      New Service
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
        uniqueKey="services"
        isLoading={isLoading}
        data={services}
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        keyField="uniqueId"
        filters={filters}
        searchField={(service, searchValue) =>
          service.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
          service.uniqueId?.toString().includes(searchValue)
        }
        endContent={endContent}
        renderSelectedActions={renderSelectedActions}
        initialSortDescriptor={{
          column: 'createdAt',
          direction: 'descending',
        }}
        onRowAction={(row) => {
          const service = services.find((service) => service.uniqueId == row);
          if (service) {
            setSelected(service);
          }
        }}
      />
      {selected && <ServiceQuickLook />}
    </>
  );
}
