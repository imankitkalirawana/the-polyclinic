import { RowData } from '@tanstack/react-table';

import { CellAutoFillState } from './custom-features/cellAutoFill';

/**
 * Uses declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
 * Note: This affect global namespace for @tanstack/react-table types
 */
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    columnKey: string;
    columnName: string;
    columnType?: string;
    isAutoFillAbleColumn?: boolean;
    isFiltered?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    rowHeight: number;
    getIsCellSelectable?: <TValue = unknown>(cell: Cell<TData, TValue>) => boolean;
    getIsCellEditable?: <TValue = unknown>(cell: Cell<TData, TValue>) => boolean;
    handleUpdateCellAutoFill?: (cellAutoFillState: CellAutoFillState, table: Table<TData>) => void;
    hoveredRowId?: string | null;
    setHoveredRowId?: (rowId: string | null) => void;
    [key: string]: unknown; // Allow any additional properties
  }
}
