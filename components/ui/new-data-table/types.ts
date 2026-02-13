import { ColumnDataType, ColumnType } from '@/services/common/columns/columns.types';
import type { ColumnDef, Table } from '@tanstack/react-table';

export type ColumnDefinition = {
  key: string;
  name: string;
  data_type: ColumnDataType;
  column_type: ColumnType;
  order: number;
  pinned: boolean;
  /** When omitted (e.g. from API), column is shown. Use false to hide. */
  visible?: boolean;
  width: number;
};

export type CellOption = {
  value: string;
};

export type RowData = Record<string, CellOption>;

/** Props when passing a pre-built TanStack table instance (Mode A). */
export type NewDataTableTableProps<TData> = {
  table: Table<TData>;
};

/** Props when passing data + TanStack column defs (Mode B). When columns is ColumnDefinition[], TData is inferred as RowData. */
export type NewDataTableDataProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[] | ColumnDefinition[];
  getRowId?: (row: TData) => string;
  /**
   * When this value changes, the table remounts so it picks up new data.
   * Use e.g. query.dataUpdatedAt so the table updates after invalidation/refetch.
   */
  tableKey?: string | number;
};

/** Union: either a table instance or data + columns. */
export type NewDataTableProps<TData = RowData> =
  | NewDataTableTableProps<TData>
  | (NewDataTableDataProps<TData> & { table?: undefined });

/** @deprecated Use NewDataTableProps with data + columns (ColumnDefinition[]) for API-driven usage. */
export type TableProps = {
  columns: ColumnDefinition[];
  rows: RowData[];
};
