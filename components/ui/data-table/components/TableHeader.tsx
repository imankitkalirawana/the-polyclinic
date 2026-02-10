import { CSSProperties } from 'react';
import { flexRender, RowData, Table } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

import { DATA_TABLE_DEFAULTS } from '../constants';
import { getCommonPinningStyles, getIsLastColumnPinned } from '../utils';

import { cn } from '@heroui/react';

type TableHeaderProps<TData extends RowData> = {
  table: Table<TData>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  virtualColumns: Array<VirtualItem>;
  isHorizontalScrollPresent: boolean;
  style?: CSSProperties;
};

const TableHeader = <TData extends RowData>({
  table,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualColumns,
  isHorizontalScrollPresent,
  style,
}: TableHeaderProps<TData>) => {
  const limitedResizingDeltaOffset = (() => {
    const { deltaOffset, startSize } = table.getState().columnSizingInfo;
    if (!deltaOffset || !startSize) return 0;

    const columnWidth = startSize + deltaOffset;

    const { minSize, maxSize } = table.options.defaultColumn || {};

    return (
      Math.max(
        minSize || DATA_TABLE_DEFAULTS.MIN_COLUMN_WIDTH,
        Math.min(maxSize || DATA_TABLE_DEFAULTS.MAX_COLUMN_WIDTH, columnWidth)
      ) - startSize
    );
  })();

  const tableHeaderGroups = table.getHeaderGroups();

  return (
    <div
      className="bg-primary-50 z-1 sticky top-0 flex items-center font-medium text-neutral-700"
      style={style}
    >
      {virtualPaddingLeft ? <div style={{ width: virtualPaddingLeft }} /> : null}

      {tableHeaderGroups.map((headerGroup) => (
        <>
          {virtualColumns.map((vc) => {
            const header = headerGroup.headers[vc.index];

            return (
              <div
                key={header.id}
                className={cn('relative flex h-full items-center justify-between p-3', {
                  'bg-primary-50': header.column.getIsPinned(),
                  'relative after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:top-0 after:w-[30px] after:translate-x-full after:shadow-[rgba(5,5,5,0.06)_10px_0px_8px_-6px_inset] after:content-[""]':
                    getIsLastColumnPinned(header.column) && isHorizontalScrollPresent,
                })}
                style={{
                  width: `calc(var(--header-${header?.id}-size) * 1px)`,
                  ...getCommonPinningStyles(header.column),
                }}
              >
                <div className="w-full">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>

                {header.column.getCanResize() ? (
                  <div
                    className='z-2 absolute bottom-0 right-0 top-0 w-[10px] cursor-col-resize touch-none select-none after:absolute after:right-0 after:inline-block after:h-full after:w-0.5 after:bg-neutral-200 after:content-[""] hover:after:w-1'
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  >
                    {header.column.getIsResizing() ? (
                      <div
                        className="bg-primary z-2 absolute right-0 h-screen w-0.5 -translate-x-px touch-none select-none"
                        style={{
                          transform: `translateX(${limitedResizingDeltaOffset}px)`,
                        }}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </>
      ))}

      {virtualPaddingRight ? <div style={{ width: virtualPaddingRight }} /> : null}
    </div>
  );
};

export default TableHeader;
