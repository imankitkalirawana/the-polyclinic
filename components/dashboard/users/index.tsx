'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Chip,
  Selection,
  Avatar,
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
  Spinner,
  ChipProps
} from "@heroui/react";
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { useQueryState, parseAsInteger } from 'nuqs';
import useDebounce from '@/hooks/useDebounce';
import { UserType } from '@/models/User';
import { CopyText } from '@/components/ui/copy';

import {
  capitalize,
  humanReadableDate,
  humanReadableTime
} from '@/lib/utility';
import { redirectTo } from '@/functions/server-actions';
import { rowOptions } from '@/lib/config';
const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  inactive: 'warning',
  blocked: 'warning',
  deleted: 'danger'
};
const roleColorMap: Record<string, ChipProps['color']> = {
  admin: 'danger',
  user: 'default',
  nurse: 'warning',
  receptionist: 'warning',
  doctor: 'success',
  pharmacist: 'success',
  laboratorist: 'success'
};
const INITIAL_VISIBLE_COLUMNS = [
  'uid',
  'name',
  'email',
  'phone',
  'status',
  'updatedAt',
  'actions'
];

export default function Users() {
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    totalLinks: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<UserType | null>(null);
  const [filterValue, setFilterValue] = useQueryState('query', {
    defaultValue: ''
  });
  const debouncedSearchTerm = useDebounce(filterValue, 500);

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useQueryState(
    'rows',
    parseAsInteger.withDefault(20)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res = await axios.get(`/api/users`, {
        params: {
          page,
          limit: rowsPerPage,
          search: filterValue
        }
      });
      const data = res.data.users;
      setUsers(data);
      setPages(res.data.pagination.totalPages);
      setPagination(res.data.pagination);
      setIsLoading(false);
    };
    getData();
  }, [debouncedSearchTerm, rowsPerPage, page]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const sortedItems = React.useMemo(() => {
    return [...users].sort((a: UserType, b: UserType) => {
      const first = a[sortDescriptor.column as keyof UserType] as string;
      const second = b[sortDescriptor.column as keyof UserType] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, users]);

  const renderCell = React.useCallback(
    (user: UserType, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserType];
      switch (columnKey) {
        case 'uid':
          return (
            <>
              <CopyText>{user.uid + ''}</CopyText>
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
                  <Chip
                    variant="flat"
                    size="sm"
                    color={roleColorMap[user.role]}
                    className="w-fit whitespace-nowrap rounded-full py-0.5 text-xs font-light"
                  >
                    {user.role}
                  </Chip>
                </div>
              </div>
            </>
          );
        case 'email':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm text-default-400">
                {user.email}
              </p>
            </div>
          );
        case 'phone':
          return (
            <div className="flex flex-col">
              <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
                {user.phone}
              </p>
            </div>
          );
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="flat"
            >
              {user.status}
            </Chip>
          );
        case 'updatedAt':
          return (
            <>
              <p className="text-bold whitespace-nowrap text-sm capitalize">
                {humanReadableDate(user.updatedAt)}
              </p>
              <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
                {humanReadableTime(user.updatedAt)}
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
                  href={`/${user._id}`}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key={'edit'}
                  startContent={<Icon icon="tabler:edit" fontSize={20} />}
                  as={Link}
                  href={`/${user._id}/edit`}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key={'delete'}
                  startContent={<Icon icon="tabler:trash" fontSize={20} />}
                  className="text-danger"
                  color="danger"
                  onPress={() => {
                    setSelected(user);
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
            placeholder="Search anything..."
            startContent={<Icon icon="tabler:search" />}
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
              href="/new"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {pagination.totalLinks} users
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
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${users.length} selected`}
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
  }, [selectedKeys, users.length, page, pages]);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        await fetch(`/api/user/${selected?._id}`, {
          method: 'DELETE'
        });
        toast.success('Link deleted successfully');
        deleteModal.onClose();
        // refresh data
        router.refresh();
      } catch (e) {
        toast.error('Failed to delete');
        console.error(e);
      }
    }
  });

  return (<>
    <Table
      aria-label="Users List"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px]'
      }}
      selectedKeys={selectedKeys}
      //   selectionMode="multiple"
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
        items={sortedItems}
        loadingContent={<Spinner />}
        loadingState={isLoading ? 'loading' : 'idle'}
        emptyContent={'No users found'}
      >
        {(item) => (
          <TableRow
            key={item.uid}
            className="transition-all hover:bg-default-100"
          >
            {(columnKey) => (
              // @ts-ignore
              (<TableCell>{renderCell(item, columnKey)}</TableCell>)
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
              <h2 className="mt-4 max-w-xs text-center text-sm font-[400]">
                Are you sure you permanently want to delete{' '}
                <span className="font-semibold">{selected?.name}</span> from
                the Database?
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
                isLoading={formik.isSubmitting}
                onPress={() => formik.handleSubmit()}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </>);
}

const columns = [
  { name: 'UID', uid: 'uid', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'EMAIL', uid: 'email' },
  { name: 'PHONE', uid: 'phone' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];
