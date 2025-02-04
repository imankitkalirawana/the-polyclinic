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
  useDisclosure
} from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { CopyText } from '@/components/ui/copy';
import { ServiceType } from '@/models/Service';
import { redirectTo } from '@/functions/server-actions';
import { rowOptions } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { EmailType } from '@/models/Email';
import { getAllServices } from '@/functions/server-actions/services';
// import useSWR from 'swr';

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  inactive: 'danger'
};

const INITIAL_VISIBLE_COLUMNS = [
  'uid',
  'name',
  'price',
  'status',
  'updatedAt',
  'actions'
];

export default function Services() {
  const { data: services } = useQuery<ServiceType[]>({
    queryKey: ['services'],
    queryFn: () => getAllServices(),
    initialData: [] as ServiceType[]
  });

  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<ServiceType | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  });

  const handleDelete = async (service: ServiceType) => {
    setIsDeleting(true);
    try {
      await fetch(`/api/services/${service._id}`, {
        method: 'DELETE'
      });

      toast.success('ServiceType deleted successfully');
      deleteModal.onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete service');
    }
    setIsDeleting(false);
  };

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredHotels = [...services];

    if (hasSearchFilter) {
      filteredHotels = filteredHotels.filter(
        (service) =>
          service.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          service.uniqueId.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredHotels = filteredHotels.filter((service) =>
        Array.from(statusFilter).includes(service.status)
      );
    }

    return filteredHotels;
  }, [services, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ServiceType, b: ServiceType) => {
      const first = a[sortDescriptor.column as keyof ServiceType] as string;
      const second = b[sortDescriptor.column as keyof ServiceType] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (service: ServiceType, columnKey: React.Key) => {
      const cellValue = service[columnKey as keyof ServiceType];
      switch (columnKey) {
        case 'uid':
          return (
            <>
              <CopyText>{service.uniqueId}</CopyText>
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
                  <p className="whitespace-nowrap text-xs capitalize text-default-400">
                    {/* @ts-ignore */}
                    {service.type}
                  </p>
                </div>
              </div>
            </>
          );
        case 'price':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {service.price}
              </p>
            </div>
          );
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[service.status]}
              size="sm"
              variant="flat"
            >
              {service.status}
            </Chip>
          );
        case 'updatedAt':
          return (
            <>
              <p className="text-bold whitespace-nowrap text-sm capitalize">
                {humanReadableDate(service.updatedAt)}
              </p>
              <p className="whitespace-nowrap text-xs capitalize text-default-400">
                {humanReadableTime(service.updatedAt)}
              </p>
            </>
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
                  onPress={() => {
                    setSelected(service);
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

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
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
      <div className="flex flex-col gap-4">
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
                  variant="flat"
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
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
              href="/dashboard/services/new"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {services.length} services
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
    services.length,
    hasSearchFilter
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Services List"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]'
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => {
          redirectTo(`/dashboard/services/${key}`);
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
        <TableBody items={sortedItems} emptyContent={'No services found'}>
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
      <Modal
        backdrop="blur"
        scrollBehavior="inside"
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col items-center">
                <Icon
                  icon="tabler:trash-x"
                  fontSize={54}
                  className="text-danger"
                />
                <h2 className="mt-4 max-w-xs text-center text-base">
                  Are you sure you permanently want to delete {selected?.name}{' '}
                  from the Database?
                </h2>
              </ModalHeader>
              <ModalBody className="items-center text-sm">
                You can&apos;t undo this action.
              </ModalBody>
              <ModalFooter className="flex-col-reverse sm:flex-row">
                <Button fullWidth variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  isLoading={isDeleting}
                  onPress={() => handleDelete(selected as ServiceType)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const columns = [
  { name: 'UID', uid: 'uid', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'PRICE', uid: 'price', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];

const statusOptions = [
  { name: 'ACTIVE', uid: 'active' },
  { name: 'INACTIVE', uid: 'inactive' }
];
