import React, { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { Row, RowData, Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { DATA_TABLE_DEFAULTS } from '../constants';
import { useColumnVirtualizer, useScrollWhenPointerOnEdges } from '../hooks';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import MinimalPlaceholder from '../../minimal-placeholder';

type DataTableProps<TData extends RowData> = {
  /**
   * Table instance from tanstack-table
   */
  table: Table<TData>;
  /**
   * A ref to the table container element
   */
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  /**
   * Triggered when the table body is scrolled, can be used to implement infinite loading
   */
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  renderExpandedRow?: (row: Row<TData>, table: Table<TData>) => React.ReactNode;
};

/**
 * @example
 * setting `overflow: hidden` and `display: flex` will allow the table body to scroll
 * <SomeWrapper style={{ overflow: hidden, display: flex }} >
 * 	<DataTable table={table} />
 * </SomeWrapper>
 */
const DataTable = <TData extends RowData>({
  table,
  containerRef,
  onScroll,
  renderExpandedRow,
}: DataTableProps<TData>) => {
  const internalTableContainerRef = useRef<HTMLDivElement | null>(null);

  const resolvedRowHeight = table.options.meta?.rowHeight ?? DATA_TABLE_DEFAULTS.ROW_HEIGHT;

  const headerRowHeight = DATA_TABLE_DEFAULTS.ROW_HEIGHT;

  const columnSizingVars = useMemo(() => {
    /*
			Calling column.getSize() for each cell is expensive, have to memoize
			Ref: https://tanstack.com/table/v8/docs/guide/column-sizing#advanced-column-resizing-performance
		*/
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // IMP: this method should be called when table.options.column changes to handle changed columns
  }, [table.getState().columnSizingInfo, table.getState().columnSizing, table.options.columns]);

  const { columnVirtualizer, virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    useColumnVirtualizer(table, internalTableContainerRef);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => internalTableContainerRef.current,
    estimateSize: () => resolvedRowHeight,
    overscan: 15,
  });

  const columnSizingState = table.getState().columnSizing;
  useEffect(() => {
    // re-measure virtualized columns
    columnVirtualizer.measure();
  }, [columnVirtualizer, columnSizingState]);

  const cellAutoFillDraggingState = table.getState().cellAutoFill.isDragging;
  const { pointerMoveHandler } = useScrollWhenPointerOnEdges({
    enabled: cellAutoFillDraggingState,
    scrollContainerRef: internalTableContainerRef,
    shouldScrollHorizontal: false,
  });

  const isHorizontalScrollPresent = !!(
    columnVirtualizer.scrollOffset && columnVirtualizer.scrollOffset > 0
  );

  const tableBodyHeightWithoutHeaderCells = internalTableContainerRef.current?.clientHeight
    ? internalTableContainerRef.current?.clientHeight - headerRowHeight
    : '100%';

  const isTableEmpty = rows.length === 0;

  return (
    <div
      ref={(node) => {
        internalTableContainerRef.current = node;
        // eslint-disable-next-line no-param-reassign
        if (containerRef) containerRef.current = node;
      }}
      style={{ ...columnSizingVars }}
      onPointerUp={() =>
        table.options.meta?.handleUpdateCellAutoFill &&
        table.options.meta?.handleUpdateCellAutoFill(table.getState().cellAutoFill, table)
      }
      onPointerMove={pointerMoveHandler}
      onScroll={onScroll}
      onPointerLeave={(e) => {
        internalTableContainerRef.current?.setPointerCapture(e.pointerId);
      }}
      onPointerEnter={(e) => {
        internalTableContainerRef.current?.releasePointerCapture(e.pointerId);
      }}
      className="relative flex-1 overflow-auto rounded-t-md border-l border-t"
    >
      <div
        role="table"
        className="flex flex-col rounded-t-md"
        style={{
          width: table.getTotalSize(),
        }}
      >
        <TableHeader
          table={table}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
          virtualColumns={virtualColumns}
          isHorizontalScrollPresent={isHorizontalScrollPresent}
          style={{ height: headerRowHeight }}
        />

        <div
          className="flex flex-col bg-white"
          style={{
            height: isTableEmpty
              ? tableBodyHeightWithoutHeaderCells
              : `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {isTableEmpty && <MinimalPlaceholder message="No Data Found" />}
          {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
            const row = rows[virtualRow.index];

            return (
              <TableRow
                key={row.id}
                table={table}
                row={row}
                onDraggerPointerDown={() => table.setAutoFillDragging(true)}
                virtualPaddingLeft={virtualPaddingLeft}
                virtualPaddingRight={virtualPaddingRight}
                virtualColumns={virtualColumns}
                isHorizontalScrollPresent={isHorizontalScrollPresent}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                }}
                renderExpandedRow={renderExpandedRow}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
