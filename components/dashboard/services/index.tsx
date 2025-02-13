'use client';
import { capitalize } from '@/lib/utility';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  ChipProps,
  Chip,
  Selection,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Input,
  Pagination,
  Tooltip,
  Spinner
} from '@heroui/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { CopyText } from '@/components/ui/copy';
import { ServiceType } from '@/models/Service';
import { redirectTo } from '@/functions/server-actions';
import { rowOptions } from '@/lib/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import FormatTimeInTable from '@/components/ui/format-time-in-table';
import Skeleton from '@/components/ui/skeleton';
import useDebounce from '@/hooks/useDebounce';
import { saveTableConfig, loadTableConfig } from '@/utils/localStorageUtil';
import axios from 'axios';
import HandleExport from '../common/handle-export';
import { useRouter } from 'nextjs-toploader/app';

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  inactive: 'danger'
};

const tableKey = 'services';

const savedConfig = loadTableConfig(tableKey);

const INITIAL_VISIBLE_COLUMNS = savedConfig?.columns || [
  'status',
  'uniqueId',
  'name',
  'type',
  'price',
  'duration',
  'createdAt',
  'actions'
];

const INITIAL_VISIBLE_TYPES = savedConfig?.type || [
  'medical',
  'surgical',
  'diagnostic',
  'consultation'
];

const INITIAL_SORT_DESCRIPTOR = savedConfig?.sortDescriptor || {
  column: 'date',
  direction: 'ascending'
};

const INITIAL_LIMIT = savedConfig?.limit || 10;

const getAllServices = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
  types?: string[];
}): Promise<{
  services: ServiceType[];
  total: number;
  totalPages: number;
}> => {
  let types = encodeURIComponent(JSON.stringify(params.types));

  const res = await axios.get(`/api/v1/services`, {
    params: {
      ...params,
      types
    }
  });
  return res.data;
};

export default function Services({ session }: { session: any }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const query = useDebounce(searchQuery, 500);
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(INITIAL_LIMIT);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>(
    INITIAL_SORT_DESCRIPTOR
  );
  const [types, setTypes] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_TYPES)
  );

  const { data, isLoading } = useQuery({
    queryKey: [
      'services',
      page,
      limit,
      sortDescriptor,
      query,
      Array.from(types)
    ],
    queryFn: () =>
      getAllServices({
        limit,
        page,
        sortColumn: sortDescriptor.column as string,
        sortDirection: sortDescriptor.direction,
        query,
        types: Array.from(types).map(String)
      })
  });

  useEffect(() => {
    if (data) {
      setPages(data?.totalPages);
    }
  }, [data]);

  const [pages, setPages] = React.useState(1);

  const services = data?.services || [];

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  useEffect(() => {
    saveTableConfig(tableKey, {
      columns: Array.from(visibleColumns),
      types: Array.from(types),
      sortDescriptor,
      limit
    });
  }, [visibleColumns, types, sortDescriptor, limit]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback(
    (service: ServiceType, columnKey: React.Key) => {
      const cellValue = service[columnKey as keyof ServiceType];
      switch (columnKey) {
        case 'status':
          return (
            <Tooltip content={capitalize(service.status)}>
              <Chip
                className="capitalize"
                color={statusColorMap[service.status]}
                size="sm"
                variant="dot"
              >
                {/* {service.status} */}
              </Chip>
            </Tooltip>
          );
        case 'uniqueId':
          return (
            <>
              <CopyText>{service.uniqueId.toString()}</CopyText>
            </>
          );
        case 'name':
          return (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-bold whitespace-nowrap text-sm capitalize">
                    {service.name}
                  </p>
                </div>
              </div>
            </>
          );
        case 'type':
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <p className="text-bold whitespace-nowrap text-sm capitalize">
                  {service.type}
                </p>
              </div>
            </div>
          );
        case 'price':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {service.price
                  ? `₹${service.price.toLocaleString('en-IN')}`
                  : '-'}
              </p>
            </div>
          );
        case 'duration':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {service.duration
                  ? `${Math.floor(service.duration / 60) > 0 ? `${Math.floor(service.duration / 60)}hr` : ''}${service.duration % 60 ? ` ${service.duration % 60}min` : ''}`
                  : 'N/A'}
              </p>
            </div>
          );

        case 'createdAt':
          return (
            <div className="space-y-1">
              {service.createdAt && (
                <>
                  <FormatTimeInTable date={service.createdAt} template="PP" />
                  <FormatTimeInTable
                    date={service.createdAt}
                    template="p"
                    className="text-xs text-default-400"
                    skeleton={<Skeleton className="h-4 w-20" />}
                  />
                </>
              )}
            </div>
          );
        case 'actions':
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <Icon icon="tabler:dots-vertical" fontSize={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key={'view'}
                  startContent={
                    <Icon icon="ic:round-view-in-ar" fontSize={20} />
                  }
                  as={Link}
                  href={`/dashboard/services/${service.uniqueId}`}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key={'edit'}
                  startContent={<Icon icon="tabler:edit" fontSize={20} />}
                  as={Link}
                  href={`/dashboard/services/${service.uniqueId}/edit`}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key={'delete'}
                  startContent={<Icon icon="tabler:trash" fontSize={20} />}
                  className="text-danger"
                  color="danger"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLimit(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="mt-12 flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-sm"
            placeholder="Search by name, phone, email, etc."
            startContent={<Icon icon="tabler:search" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
          <div className="flex gap-3">
            {session?.user?.role === 'admin' && (
              <HandleExport collection="services" />
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Service Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Service Type Dropdown"
                closeOnSelect={false}
                selectedKeys={types}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  setTypes(keys);
                  setPage(1); // Reset to first page when status changes
                }}
              >
                {typesOption.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    color={statusColorMap[column.uid]}
                    className="capitalize"
                  >
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:plus'} />}
              as={Link}
              href="/services/new"
            >
              New Service
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data?.total} services
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              value={limit}
            >
              {rowOptions.map((row) => (
                <option key={row.label} value={row.value}>
                  {row.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    visibleColumns,
    onRowsPerPageChange,
    services.length,
    searchQuery,
    types
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          Showing {services.length} of {data?.total} services
        </span>
        <Pagination
          page={page}
          total={pages}
          onChange={setPage}
          isCompact
          showControls
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1 || page === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1 || page === pages}
            size="sm"
            variant="flat"
            onPress={() => setPage((prev) => (prev < 10 ? prev + 1 : prev))}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, services.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Services"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]'
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => {
          router.push(`/dashboard/services/${key}`);
        }}
        className="cursor-pointer"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={services}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={'No services found'}
        >
          {(item) => (
            <TableRow
              key={item.uniqueId}
              className="transition-all hover:bg-default-100"
            >
              {(columnKey) => (
                // @ts-ignore
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

const columns = [
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'UID', uid: 'uniqueId', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'TYPE', uid: 'type', sortable: true },
  { name: 'PRICE', uid: 'price', sortable: true },
  { name: 'DURATION', uid: 'duration', sortable: true },
  { name: 'CREATED On', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];

const typesOption = [
  { name: 'MEDICAL', uid: 'medical' },
  { name: 'SURGICAL', uid: 'surgical' },
  { name: 'DIAGNOSTIC', uid: 'diagnostic' },
  { name: 'CONSULTATION', uid: 'consultation' }
];
