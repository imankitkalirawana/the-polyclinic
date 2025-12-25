/* eslint-disable no-param-reassign */
import {
  Cell,
  Column,
  functionalUpdate,
  makeStateUpdater,
  OnChangeFn,
  Row,
  RowData,
  Table,
  TableFeature,
  Updater,
} from '@tanstack/react-table';

import { DATA_TABLE_DEFAULTS } from '../constants';

type CellInfo = {
  cell_id: string;
  column_id: string;
  row_id: string;
  rowIndex: number;
};

export type CellAutoFillState = {
  origin: CellInfo | null;
  end: Omit<CellInfo, 'column_id' | 'cell_id'> | null;
  isDragging: boolean;
  direction: 'up' | 'down' | null;
};

export interface CellAutoFillTableState {
  cellAutoFill: CellAutoFillState;
}

export interface CellAutoFillOptions {
  enableCellAutoFill?: boolean;
  autoFillSelectionLimit?: number;
  /** Updates  with selected cells id  */
  onCellAutoFillStateChange?: OnChangeFn<CellAutoFillState>;
}

export interface CellAutoFillInstance {
  setCellAutoFill: (updater: Updater<CellAutoFillState>) => void;
  resetCellAutoFill: () => void;
  setAutoFillDragging: (isDragging: boolean) => void;
}

export interface CellAutoFillRow {
  setAsAutoFillEnd: () => void;
}

export interface CellAutoFillCell {
  setToggleAutoFillOriginCell: () => void;

  /**
   * Returns if a cell is the origin for auto fill
   * Don't call this function for cells that is not a field
   */
  getIsOriginForAutoFill: () => boolean;

  /**
   * Checks if a a cel is the terminal cell for the aut fill range
   * Returns if the cell is in up or down wrt to the origin cell.
   */
  getIsEndForAutoFill: () => { isEndUp: boolean; isEndDown: boolean };

  /**
   * Check if the cell is in between the origin and end cells wrt to the origin column
   */
  getIsBetweenAutoFillRange: () => boolean;
}

/**
 * Uses declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
 * Note: This affect global namespace for @tanstack/react-table types
 */
declare module '@tanstack/react-table' {
  interface TableState extends CellAutoFillTableState {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableOptionsResolved<TData extends RowData> extends CellAutoFillOptions {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Table<TData extends RowData> extends CellAutoFillInstance {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Row<TData extends RowData> extends CellAutoFillRow {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Cell<TData extends RowData, TValue> extends CellAutoFillCell {}
}

export const cellAutoFillInitialState = {
  isDragging: false,
  direction: null,
  end: null,
  origin: null,
} satisfies CellAutoFillState;

/**
 * React Table custom feature enables vertical cell Auto Fill like google sheets
 */
export const CellAutoFillFeature: TableFeature<unknown> = {
  getInitialState: (state): CellAutoFillTableState => {
    return {
      ...state,
      cellAutoFill: cellAutoFillInitialState,
    };
  },

  getDefaultOptions: <TData extends RowData>(table: Table<TData>): CellAutoFillOptions => {
    // Value while initializing table will override these.
    return {
      enableCellAutoFill: false,
      autoFillSelectionLimit: DATA_TABLE_DEFAULTS.AUTO_FILL_SELECTION_LIMIT,
      onCellAutoFillStateChange: makeStateUpdater('cellAutoFill', table),
    } as CellAutoFillOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setCellAutoFill = (updater) => {
      const safeUpdater: Updater<CellAutoFillState> = (old) => {
        return functionalUpdate(updater, old);
      };

      return table.options.onCellAutoFillStateChange?.(safeUpdater);
    };

    table.resetCellAutoFill = () => {
      table.setCellAutoFill(() => cellAutoFillInitialState);
    };

    table.setAutoFillDragging = (isDragging: boolean) => {
      table.setCellAutoFill((old) => ({ ...old, isDragging }));
    };
  },

  createRow: <TData extends RowData>(row: Row<TData>, table: Table<TData>): void => {
    row.setAsAutoFillEnd = () => {
      if (!table.getState().cellAutoFill.isDragging) return;

      table.setCellAutoFill((old) => {
        const {
          column_id: originColId,
          row_id: originRowId,
          rowIndex: originRowIdx,
        } = old.origin || {};

        if (row.id === originRowId) return { ...old, end: null };
        const currentRowCells = row.getAllCells();
        const targetCell = currentRowCells.find((cell) => cell.column.id === originColId);

        const startRowIndex = originRowId ? table.getRow(originRowId).index : null;

        const selectedCellsLen = Math.abs((originRowIdx || 0) - row.index);
        const canSelectMoreCells = selectedCellsLen <= (table.options.autoFillSelectionLimit || 0);

        if (targetCell && startRowIndex !== null && canSelectMoreCells) {
          const direction = row.index > startRowIndex ? 'down' : 'up';

          return {
            ...old,
            direction,
            end: { row_id: row.id, cell_id: targetCell.id, rowIndex: row.index },
          };
        }

        return old;
      });
    };
  },

  createCell: <TData extends RowData>(
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    cell.setToggleAutoFillOriginCell = () => {
      if (!cell.column.columnDef.meta?.isAutoFillAbleColumn) return;

      table.setCellAutoFill((old) => {
        if (old.origin?.cell_id === cell.id) return cellAutoFillInitialState;

        return {
          ...cellAutoFillInitialState,
          origin: { cell_id: cell.id, column_id: column.id, row_id: row.id, rowIndex: row.index },
        };
      });
    };

    cell.getIsOriginForAutoFill = () => {
      const autoFillState = table.getState().cellAutoFill;
      return autoFillState.origin?.cell_id === cell.id;
    };
    cell.getIsEndForAutoFill = () => {
      const autoFillState = table.getState().cellAutoFill;

      if (cell.column.id !== autoFillState.origin?.column_id)
        return { isEndUp: false, isEndDown: false };

      const isEnd = autoFillState.end?.row_id === row.id;
      const isEndUp = isEnd && autoFillState.direction === 'up';
      const isEndDown = isEnd && autoFillState.direction === 'down';
      return { isEndUp, isEndDown };
    };

    cell.getIsBetweenAutoFillRange = () => {
      const { origin, end } = table.getState().cellAutoFill;
      if (!origin || !end) return false;
      if (cell.column.id !== origin?.column_id) return false;

      const originRowIndex = origin.rowIndex;
      const endRowIndex = end.rowIndex;
      const currCellRowIndex = row.index;

      return (
        (currCellRowIndex > originRowIndex && currCellRowIndex <= endRowIndex) ||
        (currCellRowIndex < originRowIndex && currCellRowIndex >= endRowIndex)
      );
    };
  },
};
