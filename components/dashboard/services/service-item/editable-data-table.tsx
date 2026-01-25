'use client';

import { useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { useFormik } from 'formik';
import Editor from '@/components/ui/text-editor/editor';
import { Icon } from '@iconify/react/dist/iconify.js';

import { cn } from '@heroui/react';

interface EditableDataTableProps {
  data: Record<string, string>;
  onChange?: (data: Record<string, string>) => void;
}

export default function EditableDataTable({ data, onChange }: EditableDataTableProps) {
  const formik = useFormik({
    initialValues: {
      data,
    },
    onSubmit: async (values) => {
      console.warn('Updated Table Data:', values.data);
    },
  });

  const [numRows, setNumRows] = useState(
    Math.max(...Object.keys(formik.values.data).map((key) => parseInt(key.split('-')[1]))) + 1
  );

  const [numCols, setNumCols] = useState(
    Math.max(...Object.keys(formik.values.data).map((key) => parseInt(key.split('-')[2]))) + 1
  );

  const handleInputChange = (key: string, value: string) => {
    formik.setFieldValue(`data.${key}`, value);
    if (onChange) {
      onChange(formik.values.data);
    }
  };

  const handleAddRow = (rowIndex: number) => {
    const newValues = { ...formik.values.data };
    for (let i = numRows; i > rowIndex; i--) {
      for (let j = 0; j < numCols; j++) {
        newValues[`cell-${i}-${j}`] = newValues[`cell-${i - 1}-${j}`] || '';
      }
    }

    for (let j = 0; j < numCols; j++) {
      newValues[`cell-${rowIndex + 1}-${j}`] = '';
    }

    setNumRows(numRows + 1);
    formik.setValues({ data: newValues });
  };

  const handleAddColumn = (colIndex: number) => {
    const newValues = { ...formik.values.data };
    for (let i = 0; i < numRows; i++) {
      for (let j = numCols; j > colIndex; j--) {
        newValues[`cell-${i}-${j}`] = newValues[`cell-${i}-${j - 1}`] || '';
      }
    }

    for (let i = 0; i < numRows; i++) {
      newValues[`cell-${i}-${colIndex + 1}`] = '';
    }

    setNumCols(numCols + 1);
    formik.setValues({ data: newValues });
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newValues = { ...formik.values.data };
    for (let i = rowIndex; i < numRows - 1; i++) {
      for (let j = 0; j < numCols; j++) {
        newValues[`cell-${i}-${j}`] = newValues[`cell-${i + 1}-${j}`] || '';
      }
    }

    for (let j = 0; j < numCols; j++) {
      delete newValues[`cell-${numRows - 1}-${j}`];
    }

    setNumRows(numRows - 1);
    formik.setValues({ data: newValues });
  };

  const handleDeleteColumn = (colIndex: number) => {
    const newValues = { ...formik.values.data };
    for (let i = 0; i < numRows; i++) {
      for (let j = colIndex; j < numCols - 1; j++) {
        newValues[`cell-${i}-${j}`] = newValues[`cell-${i}-${j + 1}`] || '';
      }
    }

    for (let i = 0; i < numRows; i++) {
      delete newValues[`cell-${i}-${numCols - 1}`];
    }

    setNumCols(numCols - 1);
    formik.setValues({ data: newValues });
  };

  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

  return (
    <form onSubmit={formik.handleSubmit}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {Array.from({ length: numCols }).map((_, colIndex) => (
              <th
                className="text-center"
                key={colIndex}
                onMouseEnter={() => setHoveredColIndex(colIndex)}
                onMouseLeave={() => setHoveredColIndex(null)}
              >
                <div
                  className={cn('flex flex-row justify-between opacity-0', {
                    'opacity-100': hoveredColIndex === colIndex,
                  })}
                >
                  {numCols > 1 && (
                    <Tooltip
                      className="justify-self-center"
                      content="Delete Column"
                      color="danger"
                      size="sm"
                      showArrow
                    >
                      <Button
                        isIconOnly
                        radius="full"
                        color="danger"
                        variant="light"
                        size="sm"
                        onPress={() => handleDeleteColumn(colIndex)}
                      >
                        <Icon icon="solar:close-circle-bold-duotone" />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip content="Add Column (After)" size="sm" color="primary" showArrow>
                    <Button
                      isIconOnly
                      radius="full"
                      color="primary"
                      variant="light"
                      size="sm"
                      onPress={() => handleAddColumn(colIndex)}
                    >
                      <Icon icon="tabler:circle-plus-filled" />
                    </Button>
                  </Tooltip>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numRows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="group">
              {Array.from({ length: numCols }).map((_, colIndex) => {
                const key = `cell-${rowIndex}-${colIndex}`;
                return (
                  <td
                    key={colIndex}
                    onMouseEnter={() => setHoveredColIndex(colIndex)}
                    onMouseLeave={() => setHoveredColIndex(null)}
                    className="h-full"
                  >
                    <Editor
                      content={formik.values.data[key] || ''}
                      onChange={(html) => {
                        handleInputChange(key, html);
                      }}
                    />
                  </td>
                );
              })}
              <td className="w-[40px] opacity-0 transition-all group-hover:opacity-100">
                <div className="flex flex-col items-center gap-1">
                  {numRows > 1 && (
                    <Tooltip
                      content="Delete Row"
                      placement="left"
                      color="danger"
                      size="sm"
                      showArrow
                    >
                      <Button
                        onPress={() => handleDeleteRow(rowIndex)}
                        isIconOnly
                        radius="full"
                        color="danger"
                        variant="light"
                        size="sm"
                      >
                        <Icon icon="solar:close-circle-bold-duotone" />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip
                    content="Add Row (Below)"
                    placement="left"
                    color="primary"
                    size="sm"
                    showArrow
                  >
                    <Button
                      onPress={() => handleAddRow(rowIndex)}
                      isIconOnly
                      radius="full"
                      color="primary"
                      variant="light"
                      size="sm"
                    >
                      <Icon icon="tabler:circle-plus-filled" />
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}
