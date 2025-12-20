import { useCallback } from 'react';
import {
  ColumnDef,
  ColumnSizingState,
  ExpandedState,
  getCoreRowModel,
  RowData,
  RowSelectionState,
  TableOptions,
  Updater,
  useReactTable,
} from '@tanstack/react-table';

import { DATA_TABLE_DEFAULTS } from '../constants';
import {
  CellAutoFillFeature,
  CellAutoFillOptions,
  CellAutoFillState,
} from '../custom-features/cellAutoFill';

type DataTableOptions<TData extends RowData> = {
  /** @note `data` should be memoized or referentially stable to avoid infinite re-renders */
  data: Array<TData>;

  /** @note `columns` should be memoized or referentially stable to avoid infinite re-renders */
  columns: Array<ColumnDef<TData, unknown>>;

  /**
   * Supports below custom external validation functions
   * - getIsCellSelectable (cell auto fill)
   * - getIsCellEditable (cell auto fill)
   */
  meta?: Partial<TableOptions<TData>['meta']>;

  /**
   * state values can be hoisted by providing an external state
   * @link https://tanstack.com/table/v8/docs/framework/react/guide/table-state#controlled-state
   */
  state?: Partial<{
    rowSelection: RowSelectionState;
    columnSizing: ColumnSizingState;
    cellAutoFill: CellAutoFillState;
    expanded: ExpandedState;
  }>;

  onColumnSizingChange?: TableOptions<TData>['onColumnSizingChange'];

  /**
   * @see TableOptions.defaultColumn
   */
  defaultColumn?: TableOptions<TData>['defaultColumn'];

  /**
   * - Enables/disables row selection for all rows in the table OR
   * - A function that given a row, returns whether to enable/disable row selection for that row
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablerowselection)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
   */
  enableRowSelection?: TableOptions<TData>['enableRowSelection'];
  onRowSelectionChange?: TableOptions<TData>['onRowSelectionChange'];

  /**
   * Number of columns that should be pinned to the left side of the table
   * @note columns should have unique ids for pinning to work, provide id in column definition
   * @note this value is not reactive, its just an initial state
   */
  numberOfLeftPinnedColumns?: number;

  /**
   * @see TableOptions.getRowId
   */
  getRowId?: TableOptions<TData>['getRowId'];

  /**
   * determines if a row can be expanded. True means all rows include expanded data
   * @link [API Docs] (https://tanstack.com/table/latest/docs/guide/expanding)
   */
  getRowCanExpand?: TableOptions<TData>['getRowCanExpand'];

  autoFillSelectionLimit?: number;
  enableCellAutoFill?: boolean;
  onCellAutoFillStateChange?: CellAutoFillOptions['onCellAutoFillStateChange'];
  onExpandedChange?: (newExpanded: Updater<ExpandedState>) => void;
};

/**
 * @note This is an opinionated wrapper around `useReactTable` hook with required defaults
 * It doesn't expose all the options of `useReactTable` but only exposes
 * a limited set of options that are supported by the `DataTable` component
 */
export const useDataTable = <TData extends RowData>({
  data,
  columns,
  numberOfLeftPinnedColumns,
  getRowId,
  meta,
  state,
  defaultColumn,
  onRowSelectionChange,
  onColumnSizingChange,
  enableRowSelection,
  autoFillSelectionLimit,
  enableCellAutoFill,
  getRowCanExpand,
  onExpandedChange,
  onCellAutoFillStateChange,
}: DataTableOptions<TData>) => {
  const getColumnIdsForPinning = useCallback(
    (noOfColsToPinLeft: number) => {
      return columns.slice(0, noOfColsToPinLeft).map((column) => column.id || '');
    },
    [columns]
  );

  /* 
  	The following properties will override their default table behavior 
  	even when explicitly set to undefined. We need to exclude them from 
  	the config when they are undefined to maintain default functionality.
	*/
  const sensitiveOptions: Partial<Omit<TableOptions<TData>, 'data' | 'columns'>> = {
    ...(onRowSelectionChange !== undefined && { onRowSelectionChange }),
    ...(onColumnSizingChange !== undefined && { onColumnSizingChange }),
    ...(onCellAutoFillStateChange !== undefined && { onCellAutoFillStateChange }),
    ...(onExpandedChange !== undefined && { onExpandedChange }),
  };

  const table = useReactTable({
    _features: [CellAutoFillFeature],
    data,
    columns,
    meta: {
      ...meta,
      rowHeight: meta?.rowHeight ?? DATA_TABLE_DEFAULTS.ROW_HEIGHT,
    },
    state,
    initialState: {
      columnPinning: {
        left: getColumnIdsForPinning(numberOfLeftPinnedColumns || 0),
      },
    },
    defaultColumn: {
      ...defaultColumn,
      minSize: defaultColumn?.minSize ?? DATA_TABLE_DEFAULTS.MIN_COLUMN_WIDTH,
      maxSize: defaultColumn?.maxSize ?? DATA_TABLE_DEFAULTS.MAX_COLUMN_WIDTH,
    },
    enableRowSelection,
    autoFillSelectionLimit: autoFillSelectionLimit ?? DATA_TABLE_DEFAULTS.AUTO_FILL_SELECTION_LIMIT,
    enableCellAutoFill,
    columnResizeMode: 'onEnd',
    columnResizeDirection: 'ltr',
    getRowId,
    getRowCanExpand,
    onExpandedChange,
    getCoreRowModel: getCoreRowModel(),
    ...sensitiveOptions,
  });

  return table;
};
