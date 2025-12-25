import { MutableRefObject, useEffect } from 'react';
import { ColumnSizingState, OnChangeFn, RowData, Table } from '@tanstack/react-table';

type UseResizeColumnsToTakeFullWidthParams<T extends RowData> = {
  /**
   * The table instance returned by useDataTable
   */
  table: Table<T>;
  /**
   * reference to the table container
   */
  tableBodyRef: MutableRefObject<HTMLDivElement | null>;

  /**
   * the setter function for column sizing state.
   * @note column sizing state needs to be controlled (hoisted up in a state variable)
   */
  setColumnSizing: OnChangeFn<ColumnSizingState>;
};

export const useResizeColumnsToTakeFullWidth = <T extends RowData>({
  table,
  tableBodyRef,
  setColumnSizing,
}: UseResizeColumnsToTakeFullWidthParams<T>) => {
  useEffect(() => {
    const initialTotalColsWidth = table
      .getAllLeafColumns()
      .reduce((acc, col) => acc + col.getSize(), 0);
    const tableBodyContainerWidth = tableBodyRef.current?.offsetWidth || 0;

    if (initialTotalColsWidth < tableBodyContainerWidth) {
      /* TODO: Handle if vertical scroll bar is present */
      const approxEachColWidth = tableBodyContainerWidth / table.getAllLeafColumns().length - 1;

      table.getAllLeafColumns().forEach((col) => {
        setColumnSizing((prev) => ({
          ...prev,
          [col.id]: approxEachColWidth,
        }));
      });
    }
  }, [table.options.columns]);
};
