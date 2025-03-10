'use client';
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
import { DrugType } from '@/models/Drug';
import { rowOptions } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import FormatTimeInTable from '@/components/ui/format-time-in-table';
import Skeleton from '@/components/ui/skeleton';
import useDebounce from '@/hooks/useDebounce';
import { saveTableConfig, loadTableConfig } from '@/utils/localStorageUtil';
import axios from 'axios';
import HandleExport from '../common/handle-export';
import { useRouter } from 'nextjs-toploader/app';

const statusColorMap: Record<string, ChipProps['color']> = {
  available: 'success',
  unavailable: 'danger'
};

const tableKey = 'drugs';

const savedConfig = loadTableConfig(tableKey);

const INITIAL_VISIBLE_COLUMNS = savedConfig?.columns || [
  'status',
  'did',
  'brandName',
  'genericName',
  'manufacturer',
  'price',
  'stock',
  'createdAt',
  'actions'
];

const INITIAL_VISIBLE_TYPES = savedConfig?.status || [
  'available',
  'unavailable'
];

const INITIAL_SORT_DESCRIPTOR = savedConfig?.sortDescriptor || {
  column: 'date',
  direction: 'ascending'
};

const INITIAL_LIMIT = savedConfig?.limit || 10;

const getAllDrugs = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
  status?: string[];
}): Promise<{
  drugs: DrugType[];
  total: number;
  totalPages: number;
}> => {
  let status = encodeURIComponent(JSON.stringify(params.status));

  const res = await axios.get(`/api/v1/drugs`, {
    params: {
      ...params,
      status
    }
  });
  return res.data;
};

export default function Drugs({ session }: { session: any }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const query = useDebounce(searchQuery, 500);
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(INITIAL_LIMIT);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>(
    INITIAL_SORT_DESCRIPTOR
  );
  const [status, setStatus] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_TYPES)
  );

  const { data, isLoading } = useQuery({
    queryKey: ['drugs', page, limit, sortDescriptor, query, Array.from(status)],
    queryFn: () =>
      getAllDrugs({
        limit,
        page,
        sortColumn: sortDescriptor.column as string,
        sortDirection: sortDescriptor.direction,
        query,
        status: Array.from(status).map(String)
      })
  });

  useEffect(() => {
    if (data) {
      setPages(data?.totalPages);
    }
  }, [data]);

  const [pages, setPages] = React.useState(1);

  const drugs = data?.drugs || [];

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  useEffect(() => {
    saveTableConfig(tableKey, {
      columns: Array.from(visibleColumns),
      status: Array.from(status),
      sortDescriptor,
      limit
    });
  }, [visibleColumns, status, sortDescriptor, limit]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback(
    (drug: DrugType, columnKey: React.Key) => {
      const cellValue = drug[columnKey as keyof DrugType];
      switch (columnKey) {
        case 'status':
          return (
            <Tooltip content={drug.status}>
              <Chip
                className="capitalize"
                color={statusColorMap[drug.status]}
                size="sm"
                variant="dot"
              >
                {/* {drug.status} */}
              </Chip>
            </Tooltip>
          );
        case 'did':
          return (
            <>
              <CopyText>{drug.did.toString()}</CopyText>
            </>
          );
        case 'brandName':
          return (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-bold whitespace-nowrap text-sm capitalize">
                    {drug.brandName}
                  </p>
                </div>
              </div>
            </>
          );
        case 'genericName':
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <p className="text-bold whitespace-nowrap text-sm capitalize">
                  {drug.genericName}
                </p>
              </div>
            </div>
          );
        case 'price':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {drug.price ? `₹${drug.price.toLocaleString('en-IN')}` : '-'}
              </p>
            </div>
          );
        case 'stock':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {drug.stock || '-'}
              </p>
            </div>
          );

        case 'createdAt':
          return (
            <div className="space-y-1">
              {drug.createdAt && (
                <>
                  <FormatTimeInTable date={drug.createdAt} template="PP" />
                  <FormatTimeInTable
                    date={drug.createdAt}
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
                  href={`/dashboard/drugs/${drug.did}`}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key={'edit'}
                  startContent={<Icon icon="tabler:edit" fontSize={20} />}
                  as={Link}
                  href={`/dashboard/drugs/${drug.did}/edit`}
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
              <HandleExport collection="drugs" />
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Drug Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Drug Type Dropdown"
                closeOnSelect={false}
                selectedKeys={status}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  setStatus(keys);
                  setPage(1); // Reset to first page when status changes
                }}
              >
                {statusOptions.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    color={statusColorMap[column.uid]}
                    className="capitalize"
                  >
                    {column.name}
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
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:plus'} />}
              as={Link}
              href="/dashboard/drugs/new"
            >
              New Drug
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data?.total} drugs
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
  }, [visibleColumns, onRowsPerPageChange, drugs.length, searchQuery, status]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          Showing {drugs.length} of {data?.total} drugs
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
  }, [selectedKeys, drugs.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Drugs"
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
          router.push(`/dashboard/drugs/${key}`);
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
          items={drugs}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={'No drugs found'}
        >
          {(item) => (
            <TableRow
              key={item.did}
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
  { name: 'DID', uid: 'did', sortable: true },
  { name: 'BRAND NAME', uid: 'brandName', sortable: true },
  { name: 'GENERIC NAME', uid: 'genericName', sortable: true },
  { name: 'MANUFACTURER', uid: 'manufacturer', sortable: true },
  { name: 'PRICE', uid: 'price', sortable: true },
  { name: 'STOCK', uid: 'stock', sortable: true },
  { name: 'CREATED On', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];

const statusOptions = [
  { name: 'AVAILABLE', uid: 'available' },
  { name: 'UNAVAILABLE', uid: 'unavailable' }
];
