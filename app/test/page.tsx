'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

// Define the data type for our table
type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

// Use the provided JSON data
const initialData: Person[] = [
  {
    id: 'id-0',
    firstName: 'First 0',
    lastName: 'Last 0',
    age: 44,
    visits: 55,
    status: 'single',
    progress: 92,
  },
  {
    id: 'id-1',
    firstName: 'First 1',
    lastName: 'Last 1',
    age: 32,
    visits: 56,
    status: 'relationship',
    progress: 49,
  },
  {
    id: 'id-2',
    firstName: 'First 2',
    lastName: 'Last 2',
    age: 24,
    visits: 70,
    status: 'single',
    progress: 76,
  },
  {
    id: 'id-3',
    firstName: 'First 3',
    lastName: 'Last 3',
    age: 23,
    visits: 34,
    status: 'relationship',
    progress: 46,
  },
  {
    id: 'id-4',
    firstName: 'First 4',
    lastName: 'Last 4',
    age: 34,
    visits: 82,
    status: 'single',
    progress: 2,
  },
  {
    id: 'id-5',
    firstName: 'First 5',
    lastName: 'Last 5',
    age: 31,
    visits: 43,
    status: 'relationship',
    progress: 90,
  },
  {
    id: 'id-6',
    firstName: 'First 6',
    lastName: 'Last 6',
    age: 35,
    visits: 78,
    status: 'relationship',
    progress: 11,
  },
  {
    id: 'id-7',
    firstName: 'First 7',
    lastName: 'Last 7',
    age: 39,
    visits: 56,
    status: 'relationship',
    progress: 10,
  },
  {
    id: 'id-8',
    firstName: 'First 8',
    lastName: 'Last 8',
    age: 25,
    visits: 78,
    status: 'single',
    progress: 37,
  },
  {
    id: 'id-9',
    firstName: 'First 9',
    lastName: 'Last 9',
    age: 28,
    visits: 72,
    status: 'single',
    progress: 1,
  },
];

export default function DataTable() {
  // State for table data
  const [data, setData] = useState<Person[]>(initialData);
  const [columns, setColumns] = useState<ColumnDef<Person>[]>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>('onChange');
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [columnTypes] = useState<string[]>(['string', 'number']);
  const [newColumnType, setNewColumnType] = useState<string>('string');
  const [globalFilter, setGlobalFilter] = useState('');

  // Ref for drag and drop
  const draggedColumnRef = useRef<string | null>(null);

  // Initialize columns dynamically based on data structure
  useEffect(() => {
    if (data.length === 0) return;

    // Get column keys from the first data item
    const sampleDataItem = data[0];
    const columnKeys = Object.keys(sampleDataItem);

    const dynamicColumns: ColumnDef<Person>[] = columnKeys.map((key) => {
      const isNumber = typeof sampleDataItem[key as keyof Person] === 'number';

      return {
        accessorKey: key,
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <div
              className="cursor-move"
              draggable
              onDragStart={() => {
                draggedColumnRef.current = column.id;
              }}
            >
              <Icon icon="lucide:grip-vertical" className="h-4 w-4" />
            </div>
            <div className="flex items-center">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="ml-1 flex flex-col">
                <button
                  onClick={() => column.toggleSorting(false)}
                  className="h-2 w-2"
                >
                  <Icon icon="lucide:chevron-up" className="h-2 w-2" />
                </button>
                <button
                  onClick={() => column.toggleSorting(true)}
                  className="h-2 w-2"
                >
                  <Icon icon="lucide:chevron-down" className="h-2 w-2" />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                const pinningState = { ...columnPinning };
                if (pinningState.left?.includes(column.id)) {
                  pinningState.left = pinningState.left.filter(
                    (id) => id !== column.id
                  );
                } else {
                  pinningState.left = [...(pinningState.left || []), column.id];
                }
                setColumnPinning(pinningState);
              }}
              className="ml-1"
            >
              <Icon
                icon="lucide:pin"
                className={`h-3 w-3 ${columnPinning.left?.includes(column.id) ? 'text-blue-500' : 'text-gray-400'}`}
              />
            </button>
          </div>
        ),
        cell: ({ row, column }) => (
          <div className="h-full w-full">
            {editingCell?.rowId === row.id &&
            editingCell?.columnId === column.id ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => {
                  setData((old) =>
                    old.map((rowData) => {
                      if (rowData.id === row.id) {
                        const updatedRow = { ...rowData };
                        const key = column.id as keyof Person;

                        if (typeof rowData[key] === 'number') {
                          updatedRow[key] = Number(editValue) as any;
                        } else {
                          updatedRow[key] = editValue as any;
                        }

                        return updatedRow;
                      }
                      return rowData;
                    })
                  );
                  setEditingCell(null);
                }}
                autoFocus
                className="h-8 w-full"
                type={isNumber ? 'number' : 'text'}
              />
            ) : (
              <div
                className="h-full w-full p-2"
                onClick={() => {
                  console.log(row.id, column.id);
                  setEditingCell({ rowId: row.id, columnId: column.id });
                  // setEditValue(String(row.getValue(column.id) || ''));
                }}
              >
                {row.getValue(column.id)}
              </div>
            )}
          </div>
        ),
      };
    });

    // Add actions column
    dynamicColumns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setData((old) =>
                old.filter((item) => item.id !== row.original.id)
              );
            }}
            isIconOnly
          >
            <Icon icon="lucide:trash" className="h-4 w-4" />
          </Button>
        </div>
      ),
    });

    setColumns(dynamicColumns);
    setColumnOrder(
      dynamicColumns.map((col) => (col.id || col.accessorKey) as string)
    );
  }, [data.length === 0, columnPinning]); // Only re-run if data is empty or columnPinning changes

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
      columnPinning,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
  });

  // Function to add a new row
  const addRow = () => {
    const newRow: Person = {
      id: `id-${data.length}`,
      firstName: `First ${data.length}`,
      lastName: `Last ${data.length}`,
      age: 20 + Math.floor(Math.random() * 30),
      visits: Math.floor(Math.random() * 100),
      status: ['single', 'relationship', 'complicated'][
        Math.floor(Math.random() * 3)
      ],
      progress: Math.floor(Math.random() * 100),
    };
    setData((prev) => [...prev, newRow]);
  };

  // Function to add a new column
  const addColumn = () => {
    if (!newColumnName) return;

    const newCol: ColumnDef<Person> = {
      accessorKey: newColumnName.toLowerCase().replace(/\s+/g, '_'),
      header: ({ column }) => (
        <div className="flex items-center space-x-1">
          <div
            className="cursor-move"
            draggable
            onDragStart={() => {
              draggedColumnRef.current = column.id;
            }}
          >
            <Icon icon="lucide:grip-vertical" className="h-4 w-4" />
          </div>
          <div className="flex items-center">
            <span>{newColumnName}</span>
            <div className="ml-1 flex flex-col">
              <button
                onClick={() => column.toggleSorting(false)}
                className="h-2 w-2"
              >
                <Icon icon="lucide:chevron-up" className="h-2 w-2" />
              </button>
              <button
                onClick={() => column.toggleSorting(true)}
                className="h-2 w-2"
              >
                <Icon icon="lucide:chevron-down" className="h-2 w-2" />
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              const pinningState = { ...columnPinning };
              if (pinningState.left?.includes(column.id)) {
                pinningState.left = pinningState.left.filter(
                  (id) => id !== column.id
                );
              } else {
                pinningState.left = [...(pinningState.left || []), column.id];
              }
              setColumnPinning(pinningState);
            }}
            className="ml-1"
          >
            <Icon
              icon="lucide:pin"
              className={`h-3 w-3 ${columnPinning.left?.includes(column.id) ? 'text-blue-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
      ),
      cell: ({ row, column }) => (
        <div className="h-full w-full">
          {editingCell?.rowId === row.id &&
          editingCell?.columnId === column.id ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                setData((old) =>
                  old.map((rowData) => {
                    if (rowData.id === row.id) {
                      const updatedRow = { ...rowData };
                      const key = column.id as keyof Person;

                      if (typeof rowData[key] === 'number') {
                        updatedRow[key] = Number(editValue) as any;
                      } else {
                        updatedRow[key] = editValue as any;
                      }

                      return updatedRow;
                    }
                    return rowData;
                  })
                );
                setEditingCell(null);
              }}
              autoFocus
              className="h-8 w-full"
              type={newColumnType === 'number' ? 'number' : 'text'}
            />
          ) : (
            <div
              className="h-full w-full p-2"
              onClick={() => {
                setEditingCell({ rowId: row.id, columnId: column.id });
                setEditValue(String(row.getValue(column.id) || ''));
              }}
            >
              {row.getValue(column.id) || ''}
            </div>
          )}
        </div>
      ),
    };

    // Update data to include the new column
    setData((old) =>
      old.map((row) => ({
        ...row,
        [newColumnName.toLowerCase().replace(/\s+/g, '_')]:
          newColumnType === 'number' ? 0 : '',
      }))
    );

    setColumns([...columns, newCol]);
    setColumnOrder([
      ...columnOrder,
      newColumnName.toLowerCase().replace(/\s+/g, '_'),
    ]);
    setNewColumnName('');
  };

  // Function to delete a column
  const deleteColumn = (columnId: string) => {
    setColumns(
      columns.filter((col) => (col.id || col.accessorKey) !== columnId)
    );
    setColumnOrder(columnOrder.filter((id) => id !== columnId));
  };

  // Function to save data
  const saveData = () => {
    console.log('Saving data:', data);
    alert('Data saved to console!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Input
              placeholder="New column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              className="max-w-xs"
            />
            <Select
              aria-label="New column type"
              value={newColumnType}
              onSelectionChange={(value) => setNewColumnType(value.toString())}
            >
              {columnTypes.map((type) => (
                <SelectItem key={type} textValue={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
            <Button onPress={addColumn} disabled={!newColumnName}>
              <Icon icon="lucide:plus" className="mr-1 h-4 w-4" /> Add Column
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onPress={addRow}>
            <Icon icon="lucide:plus" className="mr-1 h-4 w-4" /> Add Row
          </Button>
          <Button onPress={saveData}>
            <Icon icon="lucide:save" className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div
          className="overflow-auto"
          style={{
            position: 'relative',
            width: '100%',
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const targetColumnId = e.target
              .closest('[data-column-id]')
              ?.getAttribute('data-column-id');

            if (draggedColumnRef.current && targetColumnId) {
              const newColumnOrder = [...columnOrder];
              const draggedColumnIndex = newColumnOrder.indexOf(
                draggedColumnRef.current
              );
              const targetColumnIndex = newColumnOrder.indexOf(targetColumnId);

              if (draggedColumnIndex !== -1 && targetColumnIndex !== -1) {
                newColumnOrder.splice(draggedColumnIndex, 1);
                newColumnOrder.splice(
                  targetColumnIndex,
                  0,
                  draggedColumnRef.current
                );
                setColumnOrder(newColumnOrder);
              }

              draggedColumnRef.current = null;
            }
          }}
        >
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      data-column-id={header.id}
                      style={{
                        width: header.getSize(),
                        position: 'relative',
                        userSelect: 'none',
                      }}
                      className="border-b border-r bg-gray-100 p-2 text-left"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() &&
                            header.id !== 'actions' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto"
                                onPress={() => deleteColumn(header.id)}
                              >
                                <Icon icon="lucide:trash" className="h-3 w-3" />
                              </Button>
                            )}
                        </div>
                      )}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none ${
                          header.column.getIsResizing()
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className="border-b border-r p-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="bordered"
            size="sm"
            onPress={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="bordered"
            size="sm"
            onPress={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <span className="flex items-center gap-1 text-sm">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
        <Select
          aria-label="Page size"
          value={table.getState().pagination.pageSize.toString()}
          onSelectionChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <SelectItem key={pageSize} textValue={pageSize.toString()}>
              {pageSize}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
