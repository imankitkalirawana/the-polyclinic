'use client';

import React, { useMemo } from 'react';
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

function TableContent<TData>({ table }: { table: TanStackTable<TData> }) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const flatHeaders = headerGroups[0]?.headers ?? [];
  const hasColumns = flatHeaders.length > 0;

  if (!hasColumns) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-default-200 bg-default-50 p-6">
        <p className="text-neutral-500">No columns configured</p>
      </div>
    );
  }

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
      >
        <TableHeader columns={flatHeaders}>
          {(header) => (
            <TableColumn key={header.id} width={header.column.getSize()}>
              <div className="relative flex w-full items-center justify-between pr-1">
                <span className="truncate">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
                {header.column.getCanResize() ? (
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize column"
                    className={cn(
                      'absolute bottom-0 right-0 top-0 z-[2] w-2 cursor-col-resize touch-none select-none',
                      'after:absolute after:right-0 after:inline-block after:h-full after:w-0.5 after:bg-default-200 after:content-[""] hover:after:bg-default-400'
                    )}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  />
                ) : null}
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={flatHeaders.length} className="text-center text-neutral-500">
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
}: Extract<NewDataTableProps<TData>, { table?: undefined }>) {
  const columnDefs = useMemo(() => {
    if (isColumnDefinitionArray(columns as ColumnDefinition[] | ColumnDef<unknown, unknown>[])) {
      return createColumnDefsFromDefinitions(columns as ColumnDefinition[]);
    }
    return columns as ColumnDef<TData, unknown>[];
  }, [columns]);

  const table = useNewDataTable({
    data,
    columns: columnDefs as ColumnDef<TData, unknown>[],
    getRowId,
  });

  return <TableContent table={table} />;
}

export function Table<TData extends Record<string, unknown> = RowData>(
  props: NewDataTableProps<TData>
) {
  if ('table' in props && props.table) {
    return <TableContent table={props.table} />;
  }
  const { data, columns, getRowId } = props;
  return <TableWithData<TData> data={data} columns={columns} getRowId={getRowId} />;
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
export { ColumnDataType } from './types';
