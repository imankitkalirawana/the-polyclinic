'use client';

import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type OnChangeFn,
  type Table,
} from '@tanstack/react-table';

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
  /** Controlled column order (array of column ids). When provided with onColumnOrderChange, column reordering is enabled. */
  state?: { columnOrder?: ColumnOrderState };
  /** Called when column order changes (e.g. after drag-and-drop reorder). */
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
};

/**
 * Read-only TanStack table instance with column resizing and optional column reordering.
 * Initial column widths come from column def `size` (e.g. from API).
 * Pass stable `data` and `columns` (e.g. via useMemo) to avoid infinite re-renders.
 */
export function useNewDataTable<TData extends Record<string, unknown>>(
  options: UseNewDataTableOptions<TData>
): Table<TData> {
  const { data, columns, getRowId, state, onColumnOrderChange } = options;

  return useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    state,
    onColumnOrderChange,
    initialState: {
      columnOrder: columns.map((c) => c.id).filter(Boolean) as string[],
    },
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    defaultColumn: {
      minSize: COLUMN_SIZING.MIN_WIDTH,
      maxSize: COLUMN_SIZING.MAX_WIDTH,
    },
  });
}
