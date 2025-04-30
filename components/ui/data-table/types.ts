import type React from 'react';
import type { Selection, SortDescriptor } from '@heroui/react';

export type TableItem = Record<string, any>;

export interface ColumnDef<T extends TableItem> {
  name: string;
  uid: string;
  sortable?: boolean;
  filterable?: boolean;
  info?: string;
  sortDirection?: 'ascending' | 'descending';
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
}

export interface FilterOpt {
  label: string;
  value: string;
}

export interface FilterDef<T extends TableItem> {
  name: string;
  key: string;
  options: FilterOpt[];
  filterFn: (item: T, value: string) => boolean;
}

export interface TableProps<T extends TableItem> {
  data: T[];
  columns: ColumnDef<T>[];
  initialVisibleColumns?: string[];
  keyField: keyof T;
  filters?: FilterDef<T>[];
  searchField?: keyof T | ((item: T, searchValue: string) => boolean);
  renderTopBar?: () => React.ReactNode;
  onRowAction?: (row: string | number | bigint) => void;
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
