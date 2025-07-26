'use client';

import React, { useMemo, useState } from 'react';
import { cn, TableColumn, TableHeader, TableRow } from '@heroui/react';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Header,
  Table as TanStackTable,
  useReactTable,
} from '@tanstack/react-table';

import { Table } from './ui/table';

interface Person {
  key: string;
  name: string;
  role: string;
  status: string;
}

interface TableMeta {
  updateData: (rowIndex: number, columnId: string, value: string) => void;
}

const EditableCell: React.FC<CellContext<Person, string>> = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState<string>(initialValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const onBlur = (): void => {
    setIsEditing(false);
    (table.options.meta as TableMeta)?.updateData(row.index, column.id, value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onBlur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (isEditing) {
    return (
      <input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full rounded border-none px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
        autoFocus
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className="cursor-text rounded px-2 py-1">
      {value}
    </div>
  );
};

interface ColumnResizerProps {
  header: Header<Person, unknown>;
  table: TanStackTable<Person>;
}

const ColumnResizer: React.FC<ColumnResizerProps> = ({ header }) => (
  <div
    onMouseDown={header.getResizeHandler()}
    onTouchStart={header.getResizeHandler()}
    className={cn(
      'absolute right-0 top-0 h-full w-px cursor-col-resize touch-none select-none bg-default-300 hover:w-[2px] hover:bg-primary-500',
      {
        'bg-primary-500': header.column.getIsResizing(),
      }
    )}
  />
);

const App: React.FC = () => {
  const [data, setData] = useState<Person[]>([
    {
      key: '1',
      name: 'Tony Reichert',
      role: 'CEO',
      status: 'Active',
    },
    {
      key: '2',
      name: 'Zoey Lang',
      role: 'Technical Lead',
      status: 'Paused',
    },
    {
      key: '3',
      name: 'Jane Fisher',
      role: 'Senior Developer',
      status: 'Active',
    },
    {
      key: '4',
      name: 'William Howard',
      role: 'Community Manager',
      status: 'Vacation',
    },
  ]);

  const columnHelper = createColumnHelper<Person>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'NAME',
        cell: EditableCell,
        size: 200,
        minSize: 100,
        maxSize: 400,
      }),
      columnHelper.accessor('role', {
        header: 'ROLE',
        cell: EditableCell,
        size: 250,
        minSize: 150,
        maxSize: 500,
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: EditableCell,
        size: 150,
        minSize: 100,
        maxSize: 300,
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable<Person>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((prevData) =>
          prevData.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row))
        );
      },
    } as TableMeta,
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">TanStack Table with HeroUI</h1>
      <div className="overflow-x-auto rounded-lg border border-divider">
        <Table
          aria-label="Editable table with resizable columns"
          style={{ width: table.getCenterTotalSize() }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableColumn
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() && (
                      <ColumnResizer header={header} table={table} />
                    )}
                  </TableColumn>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                    className="border border-divider bg-background"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-6 rounded-lg bg-default-50 p-4">
        <h3 className="mb-2 font-semibold">Instructions:</h3>
        <ul className="space-y-1 text-sm text-default-500">
          <li>• Click on any cell to edit its content</li>
          <li>• Press Enter to save changes, Escape to cancel</li>
          <li>• Drag the right edge of column headers to resize</li>
          <li>• Columns have min/max width constraints</li>
        </ul>
      </div>

      <div className="mt-4 rounded-lg bg-primary-100 p-4">
        <h3 className="mb-2 font-semibold">Current Data:</h3>
        <pre className="text-xs text-default-500">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
