import { CSSProperties } from 'react';
import { flexRender, RowData, Table } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

import { DATA_TABLE_DEFAULTS } from '../constants';
import { getCommonPinningStyles, getIsLastColumnPinned } from '../utils';
import {
  tableHeadClasses,
  tableHeaderCellClasses,
  tableHeaderCellPinnedClasses,
  tableHeaderCellContentClasses,
  lastLeftPinnedCellWithShadowClasses,
  resizeTriggerClasses,
  resizeGuideLineClasses,
} from './styles';

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
    <div className={tableHeadClasses} style={style}>
      {virtualPaddingLeft ? <div style={{ width: virtualPaddingLeft }} /> : null}

      {tableHeaderGroups.map((headerGroup) => (
        <>
          {virtualColumns.map((vc) => {
            const header = headerGroup.headers[vc.index];

            return (
              <div
                key={header.id}
                className={`${tableHeaderCellClasses} ${
                  header.column.getIsPinned() ? tableHeaderCellPinnedClasses : ''
                } ${
                  getIsLastColumnPinned(header.column) && isHorizontalScrollPresent
                    ? lastLeftPinnedCellWithShadowClasses
                    : ''
                }`}
                style={{
                  width: `calc(var(--header-${header?.id}-size) * 1px)`,
                  ...getCommonPinningStyles(header.column),
                }}
              >
                <div className={tableHeaderCellContentClasses}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>

                {header.column.getCanResize() ? (
                  <div
                    className={resizeTriggerClasses}
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  >
                    {header.column.getIsResizing() ? (
                      <div
                        className={resizeGuideLineClasses}
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
