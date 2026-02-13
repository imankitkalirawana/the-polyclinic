'use client';

import React, { useMemo, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Table as TanStackTable, ColumnDef } from '@tanstack/react-table';
import {
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { cn } from '@heroui/react';

import type { ColumnDefinition, NewDataTableProps, RowData } from './types';
import { createColumnDefsFromDefinitions, isColumnDefinitionArray } from './helper';
import { useNewDataTable } from './use-new-data-table';

function TableContent<TData>({
  table,
  topContent,
}: {
  table: TanStackTable<TData>;
  topContent?: React.ReactNode;
}) {
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const flatHeaders = headerGroups[0]?.headers ?? [];

  const handleColumnDragStart = (columnId: string) => (e: React.DragEvent) => {
    setDraggedColumnId(columnId);
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleColumnDrop = (dropTargetId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedColumnId(null);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === dropTargetId) return;
    table.setColumnOrder((prev) => {
      const from = prev.indexOf(draggedId);
      const to = prev.indexOf(dropTargetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      return next;
    });
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnId(null);
  };

  return (
    <div className="min-h-[200px] w-full flex-1 p-2">
      <HeroTable
        isHeaderSticky
        aria-label="Generic data table with sorting, filtering, and pagination"
        classNames={{
          td: 'before:bg-transparent',
        }}
        topContentPlacement="outside"
        className="max-h-full px-px"
        topContent={topContent}
      >
        <TableHeader columns={flatHeaders}>
          {(header) => (
            <TableColumn
              key={header.id}
              width={header.column.getSize()}
              onDragOver={handleColumnDragOver}
              onDrop={handleColumnDrop(header.column.id)}
              onDragStart={handleColumnDragStart(header.column.id)}
              onDragEnd={handleColumnDragEnd}
              draggable
              className="hover:cursor-grab"
            >
              <div
                className={cn('relative flex w-full items-center gap-1 pr-1', {
                  'opacity-50 backdrop-blur-lg': draggedColumnId === header.column.id,
                })}
              >
                <span className="min-w-0 flex-1 truncate">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
                {header.column.getCanResize() ? (
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize column"
                    className={cn(
                      'absolute top-0 right-0 bottom-0 z-2 w-3 cursor-col-resize touch-none select-none',
                      'after:bg-default-200 hover:after:bg-primary-400 after:absolute after:right-0 after:inline-block after:h-full after:w-0.5 after:content-[""]'
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      header.getResizeHandler()(e);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      header.getResizeHandler()(e);
                    }}
                  />
                ) : null}
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={<div className="text-default-500 text-center">No data</div>}>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={flatHeaders.length} className="text-default-500 text-center">
                No data
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </HeroTable>
    </div>
  );
}

function TableWithData<TData extends Record<string, unknown>>({
  data,
  columns,
  getRowId,
  topContent,
}: Extract<NewDataTableProps<TData>, { table?: undefined }> & { topContent?: React.ReactNode }) {
  const columnDefs = useMemo(() => {
    if (isColumnDefinitionArray(columns as ColumnDefinition[] | ColumnDef<unknown, unknown>[])) {
      return createColumnDefsFromDefinitions(columns as ColumnDefinition[]);
    }
    return columns as ColumnDef<TData, unknown>[];
  }, [columns]);

  const initialColumnOrder = useMemo(
    () => columnDefs.map((c) => c.id).filter(Boolean) as string[],
    [columnDefs]
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder);

  const table = useNewDataTable({
    data,
    columns: columnDefs as ColumnDef<TData, unknown>[],
    getRowId,
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
  });

  return <TableContent table={table} topContent={topContent} />;
}

export function Table<TData extends Record<string, unknown> = RowData>(
  props: NewDataTableProps<TData> & { topContent?: React.ReactNode }
) {
  if ('table' in props && props.table) {
    return <TableContent table={props.table} topContent={props.topContent} />;
  }
  const { data, columns, getRowId, topContent, tableKey } = props;
  return (
    <TableWithData<TData>
      key={tableKey}
      data={data}
      columns={columns}
      getRowId={getRowId}
      topContent={topContent}
    />
  );
}

export { createColumnDefsFromDefinitions, isColumnDefinitionArray } from './helper';
export { useNewDataTable } from './use-new-data-table';
export type { UseNewDataTableOptions } from './use-new-data-table';
export {
  type CellOption,
  type ColumnDefinition,
  type NewDataTableDataProps,
  type NewDataTableProps,
  type NewDataTableTableProps,
  type RowData,
  type TableProps,
} from './types';
