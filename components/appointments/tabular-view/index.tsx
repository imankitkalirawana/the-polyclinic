'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
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
import { getAllAppointments } from '@/functions/server-actions/appointment';
import useDebounce from '@/hooks/useDebounce';
import { rowOptions } from '@/lib/config';
import { capitalize } from '@/lib/utility';
import { AppointmentType } from '@/models/Appointment';
import { loadTableConfig, saveTableConfig } from '@/utils/localStorageUtil';

const statusColorMap: Record<string, ChipProps['color']> = {
  booked: 'default',
  confirmed: 'success',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'danger',
  overdue: 'danger',
  'on-hold': 'warning',
};

const tableKey = 'appointments';

const savedConfig = loadTableConfig(tableKey);

const INITIAL_VISIBLE_COLUMNS = savedConfig?.columns || [
  'status',
  'aid',
  'patient.name',
  'date',
  'doctor.name',
  'createdAt',
  'actions',
];

const INITIAL_VISIBLE_STATUS = savedConfig?.status || [
  'booked',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'overdue',
  'on-hold',
];

const INITIAL_SORT_DESCRIPTOR = savedConfig?.sortDescriptor || {
  column: 'date',
  direction: 'ascending',
};

const INITIAL_LIMIT = savedConfig?.limit || 10;

export default function TabularView() {
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

  const { data, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ['appointments', page, limit, sortDescriptor, query, status],
    queryFn: () =>
      getAllAppointments({
        limit,
        page,
        sort: sortDescriptor,
        query,
        status: Array.from(status) as string[],
      }),
  });

  useEffect(() => {
    if (data) {
      setPages(data?.totalPages); // Update pages when data changes
    }
  }, [data]);

  const [pages, setPages] = React.useState(1);

  const appointments = data?.appointments || [];

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
    (appointment: AppointmentType, columnKey: React.Key) => {
      const cellValue = appointment[columnKey as keyof AppointmentType];
      switch (columnKey) {
        case 'status':
          return (
            <Tooltip content={capitalize(appointment.status)}>
              <Chip
                className="capitalize"
                color={statusColorMap[appointment.status]}
                size="sm"
                variant="dot"
              >
                {/* {appointment.status} */}
              </Chip>
            </Tooltip>
          );
        case 'aid':
          return (
            <>
              <CopyText>{appointment.aid.toString()}</CopyText>
            </>
          );
        case 'patient.name':
          return (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-bold whitespace-nowrap text-sm capitalize">
                    {appointment.patient.name}
                  </p>
                  <p className="whitespace-nowrap text-xs capitalize text-default-400">
                    {appointment.patient.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </>
          );
        case 'date':
          return (
            <div className="space-y-1">
              <FormatTimeInTable date={appointment.date} template="PP" />
              <FormatTimeInTable
                date={appointment.date}
                template="p"
                className="text-xs text-default-400"
                skeleton={<Skeleton className="h-4 w-20" />}
              />
            </div>
          );
        case 'doctor.name':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {appointment.doctor?.name || 'N/A'}
              </p>
            </div>
          );
        case 'patient.phone':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm text-default-400">
                {appointment.patient?.phone || 'N/A'}
              </p>
            </div>
          );
        case 'patient.email':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm text-default-400">
                {appointment.patient?.email || 'N/A'}
              </p>
            </div>
          );
        case 'createdAt':
          return (
            <div className="space-y-1">
              {appointment.createdAt && (
                <>
                  <FormatTimeInTable
                    date={appointment.createdAt}
                    template="PP"
                  />
                  <FormatTimeInTable
                    date={appointment.createdAt}
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
                  href={`/dashboard/appointments/${appointment.aid}`}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key={'edit'}
                  startContent={<Icon icon="tabler:edit" fontSize={20} />}
                  as={Link}
                  href={`/dashboard/appointments/${appointment.aid}/edit`}
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

  // filter appointments based on status
  const filteredAppointments = React.useMemo(() => {
    return appointments.filter(
      (appointment) => status === 'all' || status.has(appointment.status)
    );
  }, [appointments, status]);

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
              href="/appointments/new"
            >
              New Appointment
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data?.total} appointments
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
    appointments.length,
    searchQuery,
    status,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          Showing {appointments.length} of {data?.total} appointments
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
  }, [selectedKeys, appointments.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Appointments"
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
          redirectTo(`/dashboard/appointments/${key}`);
        }}
        className="mx-auto max-w-7xl cursor-pointer px-4"
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
          items={filteredAppointments}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={'No appointments found'}
        >
          {(item) => (
            <TableRow
              key={item.aid}
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
  { name: 'AID', uid: 'aid', sortable: true },
  { name: 'NAME', uid: 'patient.name', sortable: true },
  { name: 'DATE', uid: 'date', sortable: true },
  { name: 'DOCTOR', uid: 'doctor.name', sortable: true },
  { name: 'PHONE', uid: 'patient.phone', sortable: true },
  { name: 'EMAIL', uid: 'patient.email', sortable: true },
  { name: 'Booked On', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

const statusOptions = [
  { name: 'BOOKED', uid: 'booked' },
  { name: 'CONFIRMED', uid: 'confirmed' },
  { name: 'IN PROGRESS', uid: 'in-progress' },
  { name: 'COMPLETED', uid: 'completed' },
  { name: 'CANCELLED', uid: 'cancelled' },
  { name: 'OVERDUE', uid: 'overdue' },
  { name: 'ON HOLD', uid: 'on-hold' },
];
