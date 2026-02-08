'use client';

import { getCoreRowModel, useReactTable, type ColumnDef, type Table } from '@tanstack/react-table';

const COLUMN_SIZING = {
  MIN_WIDTH: 50,
  MAX_WIDTH: 600,
} as const;

export type UseNewDataTableOptions<TData extends Record<string, unknown>> = {
  /** Table rows. Should be memoized or referentially stable to avoid unnecessary re-renders. */
  data: TData[];
  /** TanStack column definitions. Should be memoized or referentially stable. Column `size` from API is used as initial width. */
  columns: ColumnDef<TData, unknown>[];
  /** Optional stable row id. When omitted, table uses row index. */
  getRowId?: (row: TData) => string;
};

/**
 * Read-only TanStack table instance with column resizing. Initial column widths come from column def `size` (e.g. from API).
 * Pass stable `data` and `columns` (e.g. via useMemo) to avoid infinite re-renders.
 */
export function useNewDataTable<TData extends Record<string, unknown>>(
  options: UseNewDataTableOptions<TData>
): Table<TData> {
  const { data, columns, getRowId } = options;

  return useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    defaultColumn: {
      minSize: COLUMN_SIZING.MIN_WIDTH,
      maxSize: COLUMN_SIZING.MAX_WIDTH,
    },
  });
}
