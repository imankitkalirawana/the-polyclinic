'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  cn,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  ScrollShadow,
  Spinner,
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';
import { Icon } from '@iconify/react';

import { isAll } from './helper';
import type { TableItem, TableProps, TableState } from './types';
import { useMemoizedCallback } from './use-memoized-callback';

import type { $FixMe } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useSession } from '@/libs/providers/session-provider';
import { Role } from '@/services/common/user/user.constants';

export function Table<T extends TableItem>({
  uniqueKey,
  isLoading,
  data,
  columns,
  initialVisibleColumns,
  keyField,
  filters = [],
  searchField,
  endContent,
  renderSelectedActions,
  onRowAction,
  rowsPerPage = 10,
  initialSortDescriptor = { column: 'createdAt', direction: 'descending' },
  selectedKeys = new Set([]),
  onSelectionChange,
  isError,
  errorMessage,
  renderFilter,
}: TableProps<T>) {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 500);
  const { user: currentUser } = useSession();

  const [state, setState] = useState<TableState>({
    key: uniqueKey,
    filterValue: debouncedSearch,
    selectedKeys,
    visibleColumns: new Set([
      ...(initialVisibleColumns || columns.map((col) => col.uid)),
      'actions',
    ]),
    page: 1,
    sortDescriptor: initialSortDescriptor,
    rowsPerPage,
    filterValues: Object.fromEntries(filters.map((filter) => [filter.key, 'all'])),
  });

  const updateState = (newState: Partial<TableState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const headerColumns = useMemo(() => {
    if (state.visibleColumns === 'all') return columns;

    return columns
      .map((item) => {
        if (item.uid === state.sortDescriptor.column) {
          return {
            ...item,
            sortDirection: state.sortDescriptor.direction,
          };
        }
        return item;
      })
      .filter(
        (column) =>
          state.visibleColumns === 'all' ||
          (Array.from(state.visibleColumns).includes(column.uid) &&
            !column.isHidden &&
            // When currentUser is missing (e.g. SSR), show column so server/client column set matches and hydration succeeds
            (!currentUser || !column.roles || column.roles.includes(currentUser.role)))
      );
  }, [state.visibleColumns, state.sortDescriptor, columns, currentUser?.role]);

  const itemFilter = useCallback(
    (item: T) =>
      // Apply all active filters
      filters.every((filter) => {
        const filterValue = state.filterValues[filter.key];
        if (filterValue === 'all') return true;
        return filter.filterFn(item, filterValue);
      }),
    [filters, state.filterValues]
  );

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    // Apply search filter
    if (state.filterValue) {
      filteredData = filteredData.filter((item) => {
        if (typeof searchField === 'function') {
          return searchField(item, state.filterValue);
        }
        if (searchField) {
          const fieldValue = item[searchField];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(state.filterValue.toLowerCase());
          }
          if (typeof fieldValue === 'object' && fieldValue !== null && 'name' in fieldValue) {
            return (fieldValue.name as string)
              .toLowerCase()
              .includes(state.filterValue.toLowerCase());
          }
        }
        return false;
      });
    }

    // Apply other filters
    filteredData = filteredData.filter(itemFilter);

    return filteredData;
  }, [data, state.filterValue, itemFilter, searchField, isLoading]);

  // Helper function to get nested object values using dot notation
  const getNestedValue = (obj: T, path: string): $FixMe => {
    // If the path doesn't contain dots, it's a direct property
    if (!path.includes('.')) {
      const value = obj[path];

      // Handle case where value is an object with a name property
      if (typeof value === 'object' && value !== null && 'name' in value) {
        return value.name;
      }

      return value;
    }

    // For nested paths like "patient.name", split and traverse
    const keys = path.split('.');
    let current = obj as unknown as Record<string, $FixMe>;

    // Early return if the root object is null or undefined
    if (current === null || current === undefined) {
      return '';
    }

    for (let i = 0; i < keys.length; i++) {
      if (current === null || current === undefined) {
        return '';
      }

      // Check if the next key exists before accessing it
      if (!(keys[i] in current)) {
        return '';
      }

      current = current[keys[i]];
    }

    // Return empty string for null/undefined values for consistent sorting
    return current === null || current === undefined ? '' : current;
  };

  // Sort filteredItems before paginating
  const sortedItems = useMemo(() => {
    if (!state.sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a: T, b: T) => {
      const { column } = state.sortDescriptor;

      // Handle nested object paths with dot notation (e.g., "patient.name")
      let first = getNestedValue(a, column.toString());
      let second = getNestedValue(b, column.toString());

      // Handle special case for IDs with prefixes
      if (typeof first === 'string' && typeof second === 'string') {
        const firstMatch = first.match(/([A-Za-z]+-)?(\d+)/);
        const secondMatch = second.match(/([A-Za-z]+-)?(\d+)/);

        if (firstMatch && secondMatch) {
          first = Number.parseInt(firstMatch[2]);
          second = Number.parseInt(secondMatch[2]);
        }
      }

      // Compare values
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return state.sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [state.sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage) || 1;

  // Paginate sortedItems
  const items = useMemo(() => {
    const start = (state.page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [state.page, sortedItems, rowsPerPage]);

  const renderCell = useMemoizedCallback((item: T, columnKey: string) => {
    const column = columns.find((col) => col.uid === columnKey);

    if (column?.renderCell) {
      return column.renderCell(item, columnKey);
    }

    // Use the same getNestedValue function for rendering cells with dot notation
    if (columnKey.includes('.')) {
      const value = getNestedValue(item, columnKey);
      return value !== undefined && value !== null ? value : null;
    }

    const value = item[columnKey];

    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === 'object') {
      if ('name' in value) {
        return value.name;
      }
      return JSON.stringify(value);
    }

    return value;
  });

  const onSearchChange = useMemoizedCallback((value?: string) => {
    setSearchValue(value || '');
  });

  const onFilterChange = useMemoizedCallback((filterKey: string, value: string) => {
    updateState({
      filterValues: {
        ...state.filterValues,
        [filterKey]: value,
      },
      page: 1,
    });
  });

  useEffect(() => {
    updateState({
      filterValue: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch]);

  const topContent = useMemo(
    () => (
      <div className="flex items-center justify-between gap-4 px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            {searchField && (
              <Input
                className="min-w-[200px]"
                endContent={<SearchIcon className="text-default-400" width={16} />}
                placeholder="Search"
                size="sm"
                value={searchValue}
                onValueChange={onSearchChange}
              />
            )}

            {!!renderFilter && renderFilter()}
            {filters.length > 0 && (
              <div>
                <Popover placement="bottom">
                  <PopoverTrigger>
                    <Button
                      className="bg-default-100 text-default-800"
                      size="sm"
                      startContent={
                        <Icon
                          className="text-default-400"
                          icon="solar:tuning-2-linear"
                          width={16}
                        />
                      }
                    >
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <ScrollShadow className="scrollbar-hide flex max-h-96 w-full flex-col gap-6 px-2 py-4">
                      {filters.map((filter) => (
                        <RadioGroup
                          key={filter.key}
                          label={filter.name}
                          value={state.filterValues[filter.key]}
                          onValueChange={(value) => onFilterChange(filter.key, value)}
                        >
                          {filter.options.map((option) => (
                            <Radio key={option.value} value={option.value}>
                              {option.label}
                            </Radio>
                          ))}
                        </RadioGroup>
                      ))}
                    </ScrollShadow>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon className="text-default-400" icon="solar:sort-linear" width={16} />
                    }
                  >
                    Sort
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort"
                  items={headerColumns.filter((c) => c.sortable !== false)}
                >
                  {(item) => (
                    <DropdownItem
                      key={item.uid}
                      onPress={() => {
                        updateState({
                          sortDescriptor: {
                            column: item.uid,
                            direction:
                              state.sortDescriptor.direction === 'ascending'
                                ? 'descending'
                                : 'ascending',
                          },
                        });
                      }}
                      endContent={
                        state.sortDescriptor.column === item.uid && (
                          <Icon
                            icon={
                              state.sortDescriptor.direction === 'ascending'
                                ? 'solar:sort-from-top-to-bottom-bold-duotone'
                                : 'solar:sort-from-bottom-to-top-bold-duotone'
                            }
                            width={18}
                          />
                        )
                      }
                    >
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>

            <div>
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-horizontal-linear"
                        width={16}
                      />
                    }
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  items={columns
                    .filter((c) => c.uid !== 'actions')
                    .filter(
                      (c) =>
                        !c.isHidden && (c.roles?.includes(currentUser?.role as Role) || !c.roles)
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))}
                  selectedKeys={state.visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={(keys) => updateState({ visibleColumns: keys })}
                >
                  {(item) => <DropdownItem key={item.uid}>{item.name}</DropdownItem>}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          <div className="text-default-800 text-small whitespace-nowrap">
            {isAll(selectedKeys)
              ? 'All items selected'
              : `${selectedKeys.size > 0 ? `${selectedKeys.size} Selected` : ''}`}
          </div>

          {renderSelectedActions && (isAll(selectedKeys) || selectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={
                    <Icon className="text-default-400" icon="solar:alt-arrow-down-linear" />
                  }
                  size="sm"
                  variant="flat"
                >
                  Selected Actions
                </Button>
              </DropdownTrigger>
              {renderSelectedActions(selectedKeys)}
            </Dropdown>
          )}
        </div>
        {endContent && endContent()}
      </div>
    ),
    [
      searchValue,
      state.visibleColumns,
      selectedKeys,
      headerColumns,
      state.sortDescriptor,
      state.filterValues,
      filters,
      searchField,
      onSearchChange,
      onFilterChange,
    ]
  );

  const bottomContent = useMemo(
    () => (
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={state.page}
          total={pages}
          onChange={(page) => updateState({ page })}
          size="sm"
        />
        <div className="flex items-center justify-end gap-6">
          <span className="text-default-400 text-small">
            {isAll(selectedKeys)
              ? 'All items selected'
              : `${selectedKeys.size} of ${sortedItems.length} selected`}
          </span>
        </div>
      </div>
    ),
    [selectedKeys, state.page, pages, sortedItems.length]
  );

  return (
    <div className="h-full w-full p-2">
      <HeroTable
        isHeaderSticky
        aria-label="Generic data table with sorting, filtering, and pagination"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: 'before:bg-transparent',
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={state.sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={(descriptor) => updateState({ sortDescriptor: descriptor })}
        onRowAction={(row) => {
          onRowAction?.(row);
        }}
        className="max-h-full px-px"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
              className={cn([
                column.uid === 'actions' ? 'flex items-center justify-end px-[20px]' : '',
              ])}
            >
              {column.sortable !== false ? (
                <div
                  className="flex w-full cursor-pointer items-center justify-between"
                  onClick={() => {
                    updateState({
                      sortDescriptor: {
                        column: column.uid,
                        direction:
                          state.sortDescriptor.direction === 'ascending'
                            ? 'descending'
                            : 'ascending',
                      },
                    });
                  }}
                >
                  {column.name}
                  {state.sortDescriptor.column === column.uid &&
                    (state.sortDescriptor.direction === 'ascending' ? (
                      <Icon icon="solar:alt-arrow-up-linear" className="text-default-400" />
                    ) : (
                      <Icon icon="solar:alt-arrow-down-linear" className="text-default-400" />
                    ))}
                </div>
              ) : column.info ? (
                <div className="flex min-w-[108px] items-center justify-between">
                  {column.name}
                  <Tooltip content={column.info}>
                    <Icon
                      className="text-default-300"
                      height={16}
                      icon="solar:info-circle-linear"
                      width={16}
                    />
                  </Tooltip>
                </div>
              ) : (
                column.name
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={
            isError ? <div className="bg-red-200">Error: {errorMessage}</div> : 'No data found'
          }
          items={items}
          loadingContent={<Spinner label={`Fetching ${uniqueKey}...`} />}
        >
          {(item) => (
            <TableRow key={String(item[keyField])}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey.toString())}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </HeroTable>
    </div>
  );
}
