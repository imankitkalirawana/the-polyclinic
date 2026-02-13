'use client';

import React from 'react';
import { CellOption, ColumnDefinition } from '../types';
import { ColumnDataType, ColumnType } from '@/services/common/columns/columns.types';
import { Chip } from '@heroui/react';
import { FormatDate, FormatDateTime, FormatTime } from './date-renderer';

/**
 * Renders a table cell based on column data_type. Uses label for display where applicable;
 * DATE/TIME/DATETIME are formatted; STRING/INTEGER/HASHTAG show label (or value as fallback).
 */
export function CellRenderer({
  column,
  data,
}: {
  column: ColumnDefinition;
  data: CellOption;
}): React.ReactNode {
  if (!data || !data.value) {
    return null;
  }

  const { value } = data;
  const { data_type, column_type } = column;

  switch (data_type) {
    case ColumnDataType.DATE:
      switch (column_type) {
        case ColumnType.DATE:
          return <FormatDate value={value} />;
        case ColumnType.TIME:
          return <FormatTime value={value} />;
        case ColumnType.DATETIME:
          return <FormatDateTime value={value} />;
      }
      break;
    case ColumnDataType.STRING:
      switch (column_type) {
        case ColumnType.CHIP:
          return <Chip size="sm">{value}</Chip>;
        default:
          return value;
      }
    default:
      return value;
  }
}
