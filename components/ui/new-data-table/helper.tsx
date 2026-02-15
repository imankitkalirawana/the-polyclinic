import type { ColumnDef } from '@tanstack/react-table';
import { Selection } from '@heroui/react';
import React from 'react';

import type { ColumnDefinition, RowData } from './types';
import { RenderCell } from './cell-renderer';

export const isAll = (selection: Selection): selection is 'all' => selection === 'all';

export const convertSelectionToKeys = (selection: Selection): number[] => {
  let keys = [];
  if (isAll(selection)) {
    keys = [-1];
  } else {
    keys = Array.from(selection);
  }
  return keys.map((key) => Number(key));
};

/**
 * Builds TanStack column definitions from API-driven column definitions.
 * Pure: no hardcoded column keys; everything derived from ColumnDefinition.
 */
export function createColumnDefsFromDefinitions(
  definitions: ColumnDefinition[]
): ColumnDef<RowData, unknown>[] {
  return definitions
    .filter((def) => def.visible !== false)
    .sort((a, b) => a.order - b.order)
    .map((definition) => ({
      id: definition.key,
      accessorKey: definition.key,
      header: definition.name,
      size: definition.width,
      meta: {
        columnKey: definition.key,
        columnName: definition.name,
        columnDefinition: definition,
      },
      cell: ({ getValue, column }) => {
        const value = getValue() as RowData[string] | undefined;
        const columnDefinition = (
          column.columnDef.meta as { columnDefinition?: ColumnDefinition } | undefined
        )?.columnDefinition;
        if (!columnDefinition) return null;
        return <RenderCell column={columnDefinition} data={value ?? { value: '' }} />;
      },
    }));
}

export function isColumnDefinitionArray(
  columns: readonly ColumnDefinition[] | readonly ColumnDef<unknown, unknown>[]
): columns is ColumnDefinition[] {
  return (
    columns.length > 0 &&
    columns[0] !== null &&
    typeof columns[0] === 'object' &&
    'key' in columns[0] &&
    'data_type' in columns[0]
  );
}
