'use client';

import { useState, useEffect } from 'react';
import { CellContext, RowData } from '@tanstack/react-table';
import { cn } from '@heroui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import type { Key } from 'react';

export type ColumnType = 'text' | 'number' | 'textarea' | 'email' | 'url' | 'select';

export interface EditableCellProps<TData extends RowData> extends CellContext<TData, unknown> {
  columnType?: ColumnType;
  canEdit?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  options?: { label: string; value: string }[];
}

export function EditableCell<TData extends RowData>({
  getValue,
  row,
  column,
  table,
  columnType = 'text',
  canEdit = true,
  placeholder,
  className,
  inputClassName,
  options,
}: EditableCellProps<TData>) {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  // Update local state when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const setEditingCell = table.options.meta?.setEditingCell as
    | ((rowId: string | null, columnId: string | null) => void)
    | undefined;

  const editingCell = table.options.meta?.editingCell as
    | { rowId: string; columnId: string }
    | null
    | undefined;

  const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;

  const handleClick = () => {
    if (canEdit && setEditingCell) {
      setEditingCell(row.id, column.id);
    }
  };

  const onBlur = () => {
    // Update the data when cell loses focus
    const updateData = table.options.meta?.updateCellData as
      | ((rowId: string, columnId: string, newValue: string) => void)
      | undefined;

    if (updateData) {
      updateData(row.id, column.id, value);
    }

    // Clear editing state
    if (setEditingCell) {
      setEditingCell(null, null);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter' && columnType !== 'textarea' && columnType !== 'select') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      if (setEditingCell) {
        setEditingCell(null, null);
      }
      e.currentTarget.blur();
    }
  };

  // Render input based on column type
  const renderInput = () => {
    const commonProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValue(e.target.value),
      onBlur,
      onKeyDown: handleKeyDown,
      autoFocus: true,
      placeholder,
      className: cn('text-sm pl-3 w-full', inputClassName),
    };

    if (columnType === 'textarea') {
      return <textarea {...commonProps} rows={2} />;
    }

    if (columnType === 'number') {
      return <input {...commonProps} type="number" />;
    }

    if (columnType === 'email') {
      return <input {...commonProps} type="email" />;
    }

    if (columnType === 'url') {
      return <input {...commonProps} type="url" />;
    }

    if (columnType === 'select') {
      const handleSelectionChange = (key: Key | null) => {
        if (key) {
          setValue(key as string);
          // Use requestAnimationFrame to allow the selection to complete before closing
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              onBlur();
            });
          });
        }
      };

      return (
        <Autocomplete
          selectedKey={value || null}
          onSelectionChange={handleSelectionChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className={cn('w-full pl-3 text-sm')}
          items={options}
        >
          {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
        </Autocomplete>
      );
    }

    return <input {...commonProps} type="text" />;
  };

  if (isEditing && canEdit) {
    return <div className={className}>{renderInput()}</div>;
  }

  // For select type, display label instead of value
  const displayValue =
    columnType === 'select' && options && value
      ? options.find((opt) => opt.value === value)?.label || value
      : value || placeholder || ' ';

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex h-full w-full items-center overflow-hidden rounded-sm px-3 py-2 transition-colors',
        {
          'hover:bg-default-100 cursor-text': canEdit,
          'cursor-default': !canEdit,
        },
        className
      )}
    >
      <span className="text-sm whitespace-nowrap">{displayValue}</span>
    </div>
  );
}
