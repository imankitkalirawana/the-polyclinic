'use client';

import {
  capitalize,
  humanReadableDate,
  humanReadableTime
} from '@/lib/utility';
import { NewsletterType } from '@/models/Newsletter';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
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
  Tooltip
} from '@heroui/react';
import { IconTableExport } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getAllNewsletters } from '@/functions/server-actions/newsletters';

const INITIAL_VISIBLE_COLUMNS = ['email', 'createdAt', 'actions'];

export default function Newsletters() {
  const { data: newsletters } = useQuery<NewsletterType[]>({
    queryKey: ['newsletters'],
    queryFn: () => getAllNewsletters(),
    initialData: [] as NewsletterType[]
  });

  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<NewsletterType | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'email',
    direction: 'ascending'
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredNewsletters = [...newsletters];

    if (hasSearchFilter) {
      filteredNewsletters = filteredNewsletters.filter((newsletter) =>
        newsletter.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredNewsletters;
  }, [newsletters, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: NewsletterType, b: NewsletterType) => {
      const first = a[sortDescriptor.column as keyof NewsletterType] as string;
      const second = b[sortDescriptor.column as keyof NewsletterType] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (newsletter: NewsletterType, columnKey: React.Key) => {
      const cellValue = newsletter[columnKey as keyof NewsletterType];
      switch (columnKey) {
        case 'email':
          return (
            <>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-bold whitespace-nowrap text-sm">
                    {newsletter.email}
                  </p>
                </div>
              </div>
            </>
          );

        case 'createdAt':
          return (
            <>
              <p className="text-bold whitespace-nowrap text-sm capitalize">
                {humanReadableDate(newsletter.createdAt)}
              </p>
              <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
                {humanReadableTime(newsletter.createdAt)}
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
                  key={'delete'}
                  startContent={<Icon icon="tabler:trash" fontSize={20} />}
                  className="text-danger"
                  color="danger"
                  onPress={() => {
                    setSelected(newsletter);
                    deleteModal.onOpen();
                  }}
                >
                  Unsubscribe
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

  const handleExport = async () => {
    try {
      const response = await fetch('/api/newsletter/export', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to download the file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletters-${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const handleDownload = async () => {
    await toast.promise(handleExport(), {
      loading: 'Downloading...',
      success: 'Downloaded successfully',
      error: 'Failed to download'
    });
  };
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
            <Tooltip content="Export to Excel">
              <Button
                variant="bordered"
                isIconOnly
                radius="full"
                endContent={<IconTableExport size={20} />}
                onPress={handleDownload}
              />
            </Tooltip>
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
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {newsletters.length} newsletters
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
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
    newsletters.length,
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

  const formikDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      await fetch(`/api/newsletter/${selected?.email}`, {
        method: 'DELETE'
      });
      toast.success('NewsletterType Unsubscribed successfully');
      deleteModal.onClose();
      router.refresh();
    }
  });

  return (
    <>
      <Table
        aria-label="Newsletters List"
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
        <TableBody items={sortedItems} emptyContent={'No newsletters found'}>
          {(item) => (
            <TableRow
              key={item._id}
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
                  Are you sure you permanently want to delete {selected?.email}{' '}
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
                  isLoading={formikDelete.isSubmitting}
                  onPress={() => formikDelete.handleSubmit()}
                >
                  Unsubscribe
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
  { name: 'EMAIL', uid: 'email', sortable: true },
  { name: 'SUBSCRIBED AT', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];
