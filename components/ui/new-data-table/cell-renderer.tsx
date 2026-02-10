'use client';

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { CellOption, ColumnDefinition } from './types';
import { ColumnDataType } from '@/services/common/columns/columns.types';

function formatDateValue(value: string): string {
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, 'dd MMM yyyy') : value;
}

function formatTimeValue(value: string): string {
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, 'HH:mm') : value;
}

function formatDateTimeValue(value: string): string {
  const parsed = parseISO(value);
  return isValid(parsed) ? format(parsed, 'dd MMM yyyy HH:mm') : value;
}

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
  const { data_type } = column;

  switch (data_type) {
    case ColumnDataType.DATE:
      return formatDateValue(value);
    case ColumnDataType.TIME:
      return formatTimeValue(value);
    case ColumnDataType.DATETIME:
      return formatDateTimeValue(value);
    default:
      return value;
  }
}
