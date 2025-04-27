'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';

import { CopyText } from '@/components/ui/copy';
import FormatTimeInTable from '@/components/ui/format-time-in-table';
import Skeleton from '@/components/ui/skeleton';
import { redirectTo } from '@/functions/server-actions';
import useDebounce from '@/hooks/useDebounce';
import { rowOptions } from '@/lib/config';
import { capitalize } from '@/lib/utility';
import { UserType } from '@/models/User';
import { loadTableConfig, saveTableConfig } from '@/utils/localStorageUtil';

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  inactive: 'warning',
  blocked: 'danger',
  deleted: 'danger',
  unverified: 'default',
};

const tableKey = 'users';

const savedConfig = loadTableConfig(tableKey);

const INITIAL_VISIBLE_COLUMNS = savedConfig?.columns || [
  'status',
  'uid',
  'name',
  'contact',
  'address',
  'createdAt',
  'actions',
];

const INITIAL_VISIBLE_STATUS = savedConfig?.status || [
  'active',
  'inactive',
  'blocked',
  'deleted',
  'unverified',
];

const INITIAL_SORT_DESCRIPTOR = savedConfig?.sortDescriptor || {
  column: 'date',
  direction: 'ascending',
};

const INITIAL_LIMIT = savedConfig?.limit || 10;

const getAllUsers = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
  status?: string[];
}): Promise<{
  users: UserType[];
  total: number;
  totalPages: number;
}> => {
  let status = encodeURIComponent(JSON.stringify(params.status));

  const res = await axios.get(`/api/v1/users`, {
    params: { ...params, status },
  });
  return res.data;
};

const handleExport = async () => {
  try {
    const response = await fetch('/api/v1/users/export');
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toLocaleDateString()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error downloading the file:', error);
    toast.error('Error downloading the file');
  }
};

export default function Users() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const query = useDebounce(searchQuery, 500);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(INITIAL_LIMIT);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>(
    INITIAL_SORT_DESCRIPTOR
  );
  const [status, setStatus] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_STATUS)
  );

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit, sortDescriptor, query, Array.from(status)],
    queryFn: () =>
      getAllUsers({
        limit,
        page,
        sortColumn: sortDescriptor.column as string,
        sortDirection: sortDescriptor.direction,
        query,
        status: Array.from(status).map(String),
      }),
  });

  useEffect(() => {
    if (data) {
      setPages(data?.totalPages);
    }
  }, [data]);

  const [pages, setPages] = React.useState(1);

  const users = data?.users || [];

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
      limit,
    });
  }, [visibleColumns, status, sortDescriptor, limit]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback(
    (user: UserType, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserType];
      switch (columnKey) {
        case 'status':
          return (
            <Tooltip content={capitalize(user.status)}>
              <Chip
                className="capitalize"
                color={statusColorMap[user.status]}
                size="sm"
                variant="dot"
              >
                {/* {user.status} */}
              </Chip>
            </Tooltip>
          );
        case 'uid':
          return (
            <>
              <CopyText>{user.uid.toString()}</CopyText>
            </>
          );
        case 'name':
          return (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-bold whitespace-nowrap text-sm capitalize">
                    {user.name}
                  </p>
                  <p className="whitespace-nowrap text-xs text-default-400">
                    {user.role}
                  </p>
                </div>
              </div>
            </>
          );
        case 'contact':
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <p className="text-bold whitespace-nowrap text-sm">
                  {user.email}
                </p>
                <p className="whitespace-nowrap text-xs text-default-400">
                  {user.phone || ''}
                </p>
              </div>
            </div>
          );
        case 'address':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {user.address || '-'}
              </p>
            </div>
          );

        case 'createdAt':
          return (
            <div className="space-y-1">
              {user.createdAt && (
                <>
                  <FormatTimeInTable date={user.createdAt} template="PP" />
                  <FormatTimeInTable
                    date={user.createdAt}
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
                  href={`/dashboard/users/${user.uid}`}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key={'edit'}
                  startContent={<Icon icon="tabler:edit" fontSize={20} />}
                  as={Link}
                  href={`/dashboard/users/${user.uid}/edit`}
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
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:download'} />}
              onPress={handleExport}
            >
              Export
            </Button>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Dropdown"
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
              href="/users/new"
            >
              New User
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data?.total} users
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
  }, [visibleColumns, onRowsPerPageChange, users.length, searchQuery, status]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          Showing {users.length} of {data?.total} users
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
  }, [selectedKeys, users.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Users"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]',
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => {
          redirectTo(`/dashboard/users/${key}`);
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
          items={users}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={'No users found'}
        >
          {(item) => (
            <TableRow
              key={item.uid}
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
  { name: 'UID', uid: 'uid', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'CONTACT', uid: 'contact', sortable: true },
  { name: 'ADDRESS', uid: 'address', sortable: true },
  { name: 'CREATED On', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

const statusOptions = [
  { name: 'active', uid: 'active' },
  { name: 'inactive', uid: 'inactive' },
  { name: 'blocked', uid: 'blocked' },
  { name: 'deleted', uid: 'deleted' },
  { name: 'unverified', uid: 'unverified' },
];
