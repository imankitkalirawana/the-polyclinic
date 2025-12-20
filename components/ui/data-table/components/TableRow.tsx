import { CSSProperties, PointerEvent, useRef } from 'react';
import { flexRender, Row, RowData, Table } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

import { TABLE_THEME } from '../constants';
import { getCommonPinningStyles, getIsLastColumnPinned } from '../utils';
import {
  tableRowClasses,
  tableBodyCellClasses,
  tableBodyCellContentClasses,
  lastLeftPinnedCellWithShadowClasses,
  cellFilteredClasses,
  cellSelectedClasses,
  cellSelectionDraggerClasses,
  cellBetweenClasses,
  cellEndClasses,
  cellEndDownClasses,
  cellEndUpClasses,
  cellSelectableClasses,
  cellInvalidClasses,
} from './styles';

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
        className={tableRowClasses}
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

          const cellClassName = [
            tableBodyCellClasses,
            getIsLastColumnPinned(column) &&
              isHorizontalScrollPresent &&
              lastLeftPinnedCellWithShadowClasses,
            isOriginForAutoFill && cellSelectedClasses,
            isCellBetweenAutoFillRange && cellBetweenClasses,
            isEndDown && `${cellEndClasses} ${cellEndDownClasses}`,
            isEndUp && `${cellEndClasses} ${cellEndUpClasses}`,
            isCellSelectable && cellSelectableClasses,
            !isCellEditable && !(isCellSelectable && isOriginForAutoFill) && cellInvalidClasses,
            isCellColumnFiltered && cellFilteredClasses,
          ]
            .filter(Boolean)
            .join(' ');

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
              className={cellClassName}
              style={{
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                ...getCommonPinningStyles(column),
                backgroundColor: row.getIsSelected()
                  ? TABLE_THEME.ROW_HIGHLIGHT_BACKGROUND
                  : 'white',
              }}
            >
              <div className={tableBodyCellContentClasses}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
              {isOriginForAutoFill ? (
                <div
                  ref={draggerRef}
                  data-testid="cell-selection-dragger"
                  className={cellSelectionDraggerClasses}
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
