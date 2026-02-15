import type { Selection, SortDescriptor } from '@heroui/react';
import type React from 'react';

import type { $FixMe } from '@/types';
import { Role } from '@/services/common/user/user.constants';

export type TableItem = Record<string, $FixMe>;

export interface ColumnDef<T extends TableItem> {
  name: string;
  uid: string;
  sortable?: boolean;
  filterable?: boolean;
  info?: string;
  sortDirection?: 'ascending' | 'descending';
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  isHidden?: boolean;
  roles?: Role[];
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
  uniqueKey: string;
  isLoading?: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  initialVisibleColumns?: string[];
  keyField: keyof T;
  filters?: FilterDef<T>[];
  searchField?: keyof T | ((item: T, searchValue: string) => boolean);
  endContent?: () => React.ReactNode;
  renderSelectedActions?: (selectedKeys: Selection) => React.ReactNode;
  onRowAction?: (row: string | number | bigint) => void;
  rowsPerPage?: number;
  initialSortDescriptor?: SortDescriptor;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  isError?: boolean;
  errorMessage?: string;
  renderFilter?: () => React.ReactNode;
}

export interface TableState {
  key: string;
  filterValue: string;
  selectedKeys: Selection;
  visibleColumns: Selection;
  page: number;
  sortDescriptor: SortDescriptor;
  rowsPerPage: number;
  filterValues: Record<string, string>;
}
