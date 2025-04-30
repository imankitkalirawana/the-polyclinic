import type React from 'react';
import type { Selection, SortDescriptor } from '@heroui/react';

export type GenericDataItem = Record<string, any>;

export interface ColumnDefinition<T extends GenericDataItem> {
  name: string;
  uid: string;
  sortable?: boolean;
  filterable?: boolean;
  info?: string;
  sortDirection?: 'ascending' | 'descending';
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDefinition<T extends GenericDataItem> {
  name: string;
  key: string;
  options: FilterOption[];
  filterFn: (item: T, value: string) => boolean;
}

export interface GenericTableProps<T extends GenericDataItem> {
  data: T[];
  columns: ColumnDefinition<T>[];
  initialVisibleColumns?: string[];
  keyField: keyof T;
  filters?: FilterDefinition<T>[];
  searchField?: keyof T | ((item: T, searchValue: string) => boolean);
  renderTopBar?: () => React.ReactNode;
  onRowAction?: (action: string, item: T) => void;
  rowsPerPage?: number;
  initialSortDescriptor?: SortDescriptor;
}

export interface TableState {
  filterValue: string;
  selectedKeys: Selection;
  visibleColumns: Selection;
  page: number;
  sortDescriptor: SortDescriptor;
  filterValues: Record<string, string>;
}
