'use client';

import React from 'react';
import {
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { TableProps } from './types';
import { CellRenderer } from './cell-renderer';

export function Table({ columns, rows }: TableProps) {
  return (
    <div className="h-full w-full p-2">
      <HeroTable
        isHeaderSticky
        aria-label="Generic data table with sorting, filtering, and pagination"
        classNames={{
          td: 'before:bg-transparent',
        }}
        topContentPlacement="outside"
        className="max-h-full px-px"
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <CellRenderer column={column} data={row[column.key]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </HeroTable>
    </div>
  );
}
