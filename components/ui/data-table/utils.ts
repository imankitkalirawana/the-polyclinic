import { CSSProperties } from 'react';
import { Column, RowData } from '@tanstack/react-table';

export const getCommonPinningStyles = <TData extends RowData>(
  column: Column<TData>
): CSSProperties => {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 100 : 0,
  };
};

export const getIsLastColumnPinned = <TData extends RowData>(column: Column<TData>) =>
  column.getIsPinned() === 'left' && column.getIsLastColumn('left');
