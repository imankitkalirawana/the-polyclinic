import { MutableRefObject, useCallback, useMemo } from 'react';
import { RowData, Table } from '@tanstack/react-table';
import { defaultRangeExtractor, Range, useVirtualizer } from '@tanstack/react-virtual';

export const useColumnVirtualizer = <TData extends RowData>(
  tableInstance: Table<TData>,
  tableContainerRef: MutableRefObject<HTMLDivElement | null>
) => {
  const visibleColumns = tableInstance.getVisibleLeafColumns();
  const leftPinnedIndexes = useMemo(
    () => tableInstance.getLeftVisibleLeafColumns().map((c) => c.getPinnedIndex()),
    [tableInstance]
  );
  const numOfColumnsPinnedLeft = leftPinnedIndexes.length;

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    rangeExtractor: useCallback(
      (range: Range) => {
        const indicesToRender = Array.from(
          new Set([...leftPinnedIndexes, ...defaultRangeExtractor(range)])
        );
        return indicesToRender;
      },
      [leftPinnedIndexes]
    ),
    horizontal: true,
    overscan: 3,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualColLen = virtualColumns.length;

  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColLen) {
    const totalColSize = columnVirtualizer.getTotalSize();
    const leftNonPinnedStart = virtualColumns[numOfColumnsPinnedLeft]?.start || 0;
    const leftNonPinnedEnd = virtualColumns[numOfColumnsPinnedLeft - 1]?.end || 0;

    virtualPaddingLeft = leftNonPinnedStart - leftNonPinnedEnd;
    virtualPaddingRight = totalColSize - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return { columnVirtualizer, virtualColumns, virtualPaddingLeft, virtualPaddingRight };
};
