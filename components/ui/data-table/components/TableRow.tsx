import { CSSProperties, PointerEvent, useRef } from 'react';
import { flexRender, Row, RowData, Table } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

import { TABLE_THEME } from '../constants';
import { getCommonPinningStyles, getIsLastColumnPinned } from '../utils';
import { cn } from '@heroui/react';

type TableRowProps<TData extends RowData> = {
  row: Row<TData>;
  table: Table<TData>;
  style?: CSSProperties;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  virtualColumns: VirtualItem[];
  isHorizontalScrollPresent: boolean;
  onDraggerPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  renderExpandedRow?: (row: Row<TData>, table: Table<TData>) => React.ReactNode;
};

const TableRow = <TData extends RowData>({
  row,
  table,
  style,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualColumns,
  isHorizontalScrollPresent,
  onDraggerPointerDown,
  renderExpandedRow,
}: TableRowProps<TData>) => {
  const draggerRef = useRef<HTMLDivElement>(null);
  const visibleCells = row.getVisibleCells();

  const handlePointerDownOnDragger = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onDraggerPointerDown(e);
  };

  const handleMouseEnter = () => {
    const { setHoveredRowId } = table.options.meta || {};
    if (setHoveredRowId) {
      setHoveredRowId(row.id);
    }
  };

  const handleMouseLeave = () => {
    const { setHoveredRowId } = table.options.meta || {};
    if (setHoveredRowId) {
      setHoveredRowId(null);
    }
  };

  const { transform: transformStyleForExpandedRow } = style || {};

  return (
    <>
      <div
        className="group flex h-full flex-row"
        role="row"
        key={row.id}
        style={style}
        tabIndex={0}
        onPointerEnter={row.setAsAutoFillEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {virtualPaddingLeft ? <div style={{ width: virtualPaddingLeft }} /> : null}

        {virtualColumns.map((vc) => {
          const cell = visibleCells[vc.index];
          const { column } = cell;
          const isOriginForAutoFill = cell.getIsOriginForAutoFill();

          const isCellBetweenAutoFillRange = cell.getIsBetweenAutoFillRange();
          const { isEndUp, isEndDown } = cell.getIsEndForAutoFill();

          const isAutoFillAbleColumn = cell.column.columnDef.meta?.isAutoFillAbleColumn;
          const { getIsCellSelectable, getIsCellEditable } = table.options.meta || {};

          const isCellSelectable =
            isAutoFillAbleColumn && getIsCellSelectable && getIsCellSelectable(cell);

          const isCellEditable =
            isAutoFillAbleColumn && getIsCellEditable && getIsCellEditable(cell);

          const isCellColumnFiltered = cell.column.columnDef.meta?.isFiltered;

          return (
            <div
              role="cell"
              key={cell.id}
              data-cell-id={cell.id}
              data-column-id={column.id}
              onClick={(e) => {
                e.stopPropagation();
                if (isCellSelectable) {
                  cell.setToggleAutoFillOriginCell();
                }
              }}
              className={cn(
                'relative flex items-center p-3 shadow-[0_-2px_0_0_var(--color-neutral-100)_inset]',
                {
                  'relative after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:top-0 after:w-[30px] after:translate-x-full after:shadow-[rgba(5,5,5,0.06)_10px_0px_8px_-6px_inset] after:content-[""]':
                    getIsLastColumnPinned(column) && isHorizontalScrollPresent,
                  'border-primary border': isOriginForAutoFill,
                  'border-primary border-l border-r border-dashed': isCellBetweenAutoFillRange,
                  'border-primary border-b border-l border-r border-dashed': isEndDown,
                  'border-primary border-l border-r border-t border-dashed': isEndUp,
                  'cursor-pointer': isCellSelectable,
                  'border-danger': !isCellEditable && !(isCellSelectable && isOriginForAutoFill),
                  '!bg-default-100': isCellColumnFiltered,
                }
              )}
              style={{
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                ...getCommonPinningStyles(column),
                backgroundColor: row.getIsSelected()
                  ? TABLE_THEME.ROW_HIGHLIGHT_BACKGROUND
                  : 'white',
              }}
            >
              <div className="w-full">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
              {isOriginForAutoFill ? (
                <div
                  ref={draggerRef}
                  data-testid="cell-selection-dragger"
                  className="bg-primary absolute bottom-0 right-0 h-2.5 w-2.5 cursor-cell"
                  onPointerDown={handlePointerDownOnDragger}
                />
              ) : null}
            </div>
          );
        })}

        {virtualPaddingRight ? <div style={{ width: virtualPaddingRight }} /> : null}
      </div>

      {/* Add Sub Component here */}
      {row.getIsExpanded() && renderExpandedRow ? (
        <tr
          {...(transformStyleForExpandedRow && {
            style: { transform: transformStyleForExpandedRow },
          })}
        >
          <td colSpan={table.getAllColumns().length} style={{ width: table.getTotalSize() }}>
            {renderExpandedRow(row, table)}
          </td>
        </tr>
      ) : null}
    </>
  );
};

export default TableRow;
