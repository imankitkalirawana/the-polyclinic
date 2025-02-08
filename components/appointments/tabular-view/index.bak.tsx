'use client';
import {
  capitalize,
  humanReadableDate,
  humanReadableTime
} from '@/lib/utility';
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Spinner
} from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { CopyText } from '@/components/ui/copy';
import { AppointmentType } from '@/models/Appointment';
import { redirectTo } from '@/functions/server-actions';
import { rowOptions } from '@/lib/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllAppointments } from '@/functions/server-actions/appointment';
import FormatTimeInTable from '@/components/ui/format-time-in-table';
import Skeleton from '@/components/ui/skeleton';
import { useQueryState } from 'nuqs';

const statusColorMap: Record<string, ChipProps['color']> = {
  booked: 'default',
  confirmed: 'success',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'danger',
  overdue: 'danger',
  'on-hold': 'warning'
};

const INITIAL_VISIBLE_COLUMNS = [
  'status',
  'aid',
  'name',
  'date',
  'doctor',
  'createdAt',
  // 'phone',
  // 'email',
  'actions'
];

export default function TabularView({ session }: { session: any }) {
  // const [appointments, setAppointments] = React.useState<AppointmentType[]>([]);
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'all'
  });

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ['appointments', status, page, limit],
    queryFn: () =>
      getAllAppointments({ limit, status, page }).then((res) => {
        setPages(res.totalPages);
        return res;
      })
  });

  const [pages, setPages] = React.useState(data?.totalPages || 1);

  const appointments = data?.appointments || [];

  const deleteModal = useDisclosure();
  const [selected, setSelected] = React.useState<AppointmentType | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const FilteredItems = React.useMemo(() => {
    let filteredItems = [...appointments];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter(
        (appointment) =>
          appointment.patient.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment.patient.email
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          (appointment.patient?.phone &&
            appointment.patient?.phone
              .toLowerCase()
              .includes(filterValue.toLowerCase())) ||
          appointment.aid.toString().includes(filterValue)
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredItems = filteredItems.filter((appointment) =>
        Array.from(statusFilter).includes(appointment.status)
      );
    }

    return filteredItems;
  }, [appointments, filterValue, statusFilter]);

  const sortedItems = React.useMemo(() => {
    return [...appointments].sort((a: AppointmentType, b: AppointmentType) => {
      const first = a[sortDescriptor.column as keyof AppointmentType] as string;
      const second = b[
        sortDescriptor.column as keyof AppointmentType
      ] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor]);

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
        case 'name':
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
        case 'doctor':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {appointment.doctor?.name || 'N/A'}
              </p>
            </div>
          );
        case 'phone':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm text-default-400">
                {appointment.patient?.phone || 'N/A'}
              </p>
            </div>
          );
        case 'email':
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
                  onPress={() => {
                    setSelected(appointment);
                    deleteModal.onOpen();
                  }}
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

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="mt-12 flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            // startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
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
              href="/dashboard/appointments/new"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {appointments.length} appointments
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
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
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    appointments.length,
    hasSearchFilter
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${FilteredItems.length} selected`}
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
  }, [selectedKeys, FilteredItems.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Appointments"
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
          redirectTo(`/dashboard/appointments/${key}`);
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
          items={FilteredItems}
          isLoading={isLoading || isRefetching}
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
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'Date', uid: 'date', sortable: true },
  { name: 'Doctor', uid: 'doctor', sortable: true },
  { name: 'Phone', uid: 'phone', sortable: true },
  { name: 'Email', uid: 'email', sortable: true },
  { name: 'Booked On', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];

const statusOptions = [
  { name: 'BOOKED', uid: 'booked' },
  { name: 'CONFIRMED', uid: 'confirmed' },
  { name: 'IN PROGRESS', uid: 'in-progress' },
  { name: 'COMPLETED', uid: 'completed' },
  { name: 'CANCELLED', uid: 'cancelled' },
  { name: 'OVERDUE', uid: 'overdue' },
  { name: 'ON HOLD', uid: 'on-hold' }
];
