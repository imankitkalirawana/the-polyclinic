'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Selection } from '@heroui/react';
import {
  Button,
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
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Spinner,
} from '@heroui/react';
import { cn } from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';
import { Icon } from '@iconify/react';
import type { Key } from '@react-types/shared';

import type { TableItem, TableProps, TableState } from './types';
import { useMemoizedCallback } from './use-memoized-callback';
import useDebounce from '@/hooks/useDebounce';

export function Table<T extends TableItem>({
  isLoading,
  data,
  columns,
  initialVisibleColumns,
  keyField,
  filters = [],
  searchField,
  renderTopBar,
  onRowAction,
  rowsPerPage = 10,
  initialSortDescriptor = { column: 'createdAt', direction: 'descending' },
}: TableProps<T>) {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const [state, setState] = useState<TableState>({
    filterValue: '',
    selectedKeys: new Set([]),
    visibleColumns: new Set([
      ...(initialVisibleColumns || columns.map((col) => col.uid)),
      'actions',
    ]),
    page: 1,
    sortDescriptor: initialSortDescriptor,
    filterValues: Object.fromEntries(
      filters.map((filter) => [filter.key, 'all'])
    ),
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
          Array.from(state.visibleColumns).includes(column.uid)
      );
  }, [state.visibleColumns, state.sortDescriptor, columns]);

  const itemFilter = useCallback(
    (item: T) => {
      // Apply all active filters
      return filters.every((filter) => {
        const filterValue = state.filterValues[filter.key];
        if (filterValue === 'all') return true;
        return filter.filterFn(item, filterValue);
      });
    },
    [filters, state.filterValues]
  );

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    // Apply search filter
    if (state.filterValue) {
      filteredData = filteredData.filter((item) => {
        if (typeof searchField === 'function') {
          return searchField(item, state.filterValue);
        } else if (searchField) {
          const fieldValue = item[searchField];
          if (typeof fieldValue === 'string') {
            return fieldValue
              .toLowerCase()
              .includes(state.filterValue.toLowerCase());
          } else if (
            typeof fieldValue === 'object' &&
            fieldValue !== null &&
            'name' in fieldValue
          ) {
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
  }, [data, state.filterValue, itemFilter, searchField]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (state.page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [state.page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    if (!state.sortDescriptor.column) return items;

    return [...items].sort((a: T, b: T) => {
      const column = state.sortDescriptor.column;

      let first = a[column];
      let second = b[column];

      // Handle nested properties
      if (typeof first === 'object' && first !== null && 'name' in first) {
        first = first.name;
      }

      if (typeof second === 'object' && second !== null && 'name' in second) {
        second = second.name;
      }

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
  }, [state.sortDescriptor, items]);

  const filterSelectedKeys = useMemo(() => {
    if (state.selectedKeys === 'all') return state.selectedKeys;
    let resultKeys = new Set<Key>();

    if (state.filterValue) {
      filteredItems.forEach((item) => {
        const stringId = String(item[keyField]);

        if ((state.selectedKeys as Set<string>).has(stringId)) {
          resultKeys.add(stringId);
        }
      });
    } else {
      resultKeys = state.selectedKeys;
    }

    return resultKeys;
  }, [state.selectedKeys, filteredItems, state.filterValue, keyField]);

  const renderCell = useMemoizedCallback((item: T, columnKey: string) => {
    const column = columns.find((col) => col.uid === columnKey);

    if (column?.renderCell) {
      return column.renderCell(item, columnKey);
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

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    if (keys === 'all') {
      if (state.filterValue) {
        const resultKeys = new Set(
          filteredItems.map((item) => String(item[keyField]))
        );
        updateState({ selectedKeys: resultKeys });
      } else {
        updateState({ selectedKeys: keys });
      }
    } else if (keys.size === 0) {
      updateState({ selectedKeys: new Set() });
    } else {
      const resultKeys = new Set<Key>();

      keys.forEach((v) => {
        resultKeys.add(v);
      });

      const selectedValue =
        state.selectedKeys === 'all'
          ? new Set(filteredItems.map((item) => String(item[keyField])))
          : state.selectedKeys;

      selectedValue.forEach((v) => {
        if (items.some((item) => String(item[keyField]) === v)) {
          return;
        }
        resultKeys.add(v);
      });

      updateState({ selectedKeys: new Set(resultKeys) });
    }
  });

  const onFilterChange = useMemoizedCallback(
    (filterKey: string, value: string) => {
      updateState({
        filterValues: {
          ...state.filterValues,
          [filterKey]: value,
        },
        page: 1,
      });
    }
  );

  useEffect(() => {
    updateState({
      filterValue: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch]);

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            {searchField && (
              <Input
                className="min-w-[200px]"
                endContent={
                  <SearchIcon className="text-default-400" width={16} />
                }
                placeholder="Search"
                size="sm"
                value={searchValue}
                onValueChange={onSearchChange}
              />
            )}

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
                    <ScrollShadow className="flex max-h-96 w-full flex-col gap-6 px-2 py-4 scrollbar-hide">
                      {filters.map((filter) => (
                        <RadioGroup
                          key={filter.key}
                          label={filter.name}
                          value={state.filterValues[filter.key]}
                          onValueChange={(value) =>
                            onFilterChange(filter.key, value)
                          }
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
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-linear"
                        width={16}
                      />
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
                  items={columns}
                  selectedKeys={state.visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={(keys) =>
                    updateState({ visibleColumns: keys })
                  }
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          <div className="whitespace-nowrap text-sm text-default-800">
            {filterSelectedKeys === 'all'
              ? 'All items selected'
              : `${filterSelectedKeys.size > 0 ? `${filterSelectedKeys.size} Selected` : ''}`}
          </div>

          {(filterSelectedKeys === 'all' || filterSelectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 text-default-800"
                  endContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:alt-arrow-down-linear"
                    />
                  }
                  size="sm"
                  variant="flat"
                >
                  Selected Actions
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Selected Actions">
                <DropdownItem key="bulk-edit">Bulk edit</DropdownItem>
                <DropdownItem key="export">Export</DropdownItem>
                <DropdownItem key="delete" className="text-danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }, [
    searchValue,
    state.visibleColumns,
    filterSelectedKeys,
    headerColumns,
    state.sortDescriptor,
    state.filterValues,
    filters,
    searchField,
    onSearchChange,
    onFilterChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={state.page}
          total={pages}
          onChange={(page) => updateState({ page })}
        />
        <div className="flex items-center justify-end gap-6">
          <span className="text-small text-default-400">
            {filterSelectedKeys === 'all'
              ? 'All items selected'
              : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
          </span>
        </div>
      </div>
    );
  }, [filterSelectedKeys, state.page, pages, filteredItems.length]);

  return (
    <div className="h-full w-full">
      {renderTopBar && renderTopBar()}
      <HeroTable
        isHeaderSticky
        aria-label="Generic data table with sorting, filtering, and pagination"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: 'before:bg-transparent',
        }}
        selectedKeys={filterSelectedKeys}
        selectionMode="multiple"
        sortDescriptor={state.sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={(descriptor) =>
          updateState({ sortDescriptor: descriptor })
        }
        onRowAction={(row) => {
          onRowAction?.(row);
        }}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
              className={cn([
                column.uid === 'actions'
                  ? 'flex items-center justify-end px-[20px]'
                  : '',
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
                      <Icon
                        icon="solar:alt-arrow-up-linear"
                        className="text-default-400"
                      />
                    ) : (
                      <Icon
                        icon="solar:alt-arrow-down-linear"
                        className="text-default-400"
                      />
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
          emptyContent={'No data found'}
          items={sortedItems}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={String(item[keyField])}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </HeroTable>
    </div>
  );
}
