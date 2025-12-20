'use client';

import { useState, useEffect } from 'react';
import { CellContext, RowData } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

export type ColumnType = 'text' | 'number' | 'textarea' | 'email' | 'url';

export interface EditableCellProps<TData extends RowData> extends CellContext<TData, unknown> {
  columnType?: ColumnType;
  canEdit?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && columnType !== 'textarea') {
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

    return <input {...commonProps} type="text" />;
  };

  if (isEditing && canEdit) {
    return <div className={className}>{renderInput()}</div>;
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex h-full w-full items-center overflow-hidden rounded px-3 py-2 transition-colors',
        {
          'cursor-text hover:bg-default-100': canEdit,
          'cursor-default': !canEdit,
        },
        className
      )}
    >
      <span className="text-sm">{value || placeholder || ' '}</span>
    </div>
  );
}
