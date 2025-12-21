'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable, useDataTable } from '@/components/ui/data-table';
import { EditableCell } from '@/components/ui/data-table/components/EditableCell';

type Medicine = {
  id: string;
  medicine: string;
  quantity: string;
  frequency: string;
  notes: string;
};

// Dummy data
const initialMedicines: Medicine[] = [
  {
    id: '1',
    medicine: 'Paracetamol 500mg',
    quantity: '10 tablets',
    frequency: 'Twice daily',
    notes: 'Take after meals',
  },
  {
    id: '2',
    medicine: 'Amoxicillin 250mg',
    quantity: '21 capsules',
    frequency: 'Three times daily',
    notes: 'Complete full course',
  },
  {
    id: '3',
    medicine: 'Ibuprofen 400mg',
    quantity: '15 tablets',
    frequency: 'As needed',
    notes: 'Maximum 3 per day',
  },
  {
    id: '4',
    medicine: 'Cetirizine 10mg',
    quantity: '7 tablets',
    frequency: 'Once daily',
    notes: 'Take at bedtime',
  },
  {
    id: '5',
    medicine: 'Omeprazole 20mg',
    quantity: '14 capsules',
    frequency: 'Once daily',
    notes: 'Take before breakfast',
  },
];

export default function Medicines() {
  const [data, setData] = useState<Medicine[]>(initialMedicines);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);

  const updateCellData = (rowId: string, columnId: string, newValue: string) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === rowId ? { ...row, [columnId]: newValue } : row))
    );
  };

  const handleSetEditingCell = (rowId: string | null, columnId: string | null) => {
    if (rowId && columnId) {
      setEditingCell({ rowId, columnId });
    } else {
      setEditingCell(null);
    }
  };

  const columns: ColumnDef<Medicine>[] = useMemo(
    () => [
      {
        id: 'medicine',
        header: 'Medicine',
        accessorKey: 'medicine',
        size: 200,
        cell: (props) => (
          <EditableCell
            {...props}
            columnType="select"
            options={[
              { label: 'Paracetamol 500mg', value: 'paracetamol' },
              { label: 'Amoxicillin 250mg', value: 'amoxicillin' },
              { label: 'Ibuprofen 400mg', value: 'ibuprofen' },
              { label: 'Cetirizine 10mg', value: 'cetirizine' },
              { label: 'Omeprazole 20mg', value: 'omeprazole' },
            ]}
            canEdit
            placeholder="Enter medicine name"
          />
        ),
        meta: {
          columnKey: 'medicine',
          columnName: 'Medicine',
          isAutoFillAbleColumn: true,
        },
      },
      {
        id: 'quantity',
        header: 'Quantity',
        accessorKey: 'quantity',
        size: 120,
        cell: (props) => (
          <EditableCell {...props} columnType="text" canEdit placeholder="Enter quantity" />
        ),
        meta: {
          columnKey: 'quantity',
          columnName: 'Quantity',
          isAutoFillAbleColumn: true,
        },
      },
      {
        id: 'frequency',
        header: 'Frequency',
        accessorKey: 'frequency',
        size: 150,
        cell: (props) => (
          <EditableCell {...props} columnType="text" canEdit placeholder="Enter frequency" />
        ),
        meta: {
          columnKey: 'frequency',
          columnName: 'Frequency',
          isAutoFillAbleColumn: true,
        },
      },
      {
        id: 'notes',
        header: 'Notes',
        accessorKey: 'notes',
        size: 250,
        cell: (props) => (
          <EditableCell {...props} columnType="text" canEdit placeholder="Enter notes (optional)" />
        ),
        meta: {
          columnKey: 'notes',
          columnName: 'Notes',
          isAutoFillAbleColumn: true,
        },
      },
    ],
    []
  );

  const table = useDataTable({
    data,
    columns,
    getRowId: (row) => row.id,
    enableCellAutoFill: true,
    meta: {
      getIsCellEditable: () => true,
      getIsCellSelectable: () => true,
      updateCellData,
      editingCell,
      setEditingCell: handleSetEditingCell,
      handleUpdateCellAutoFill: (cellAutoFillState, tableInstance) => {
        // Handle auto-fill updates
        const { origin, end } = cellAutoFillState;
        if (!origin || !end) return;

        const tableData = tableInstance.options.data as Medicine[];
        const originRow = tableData.find((row) => row.id === origin.row_id);
        const originValue = originRow?.[origin.column_id as keyof Medicine] as string;

        if (originValue && origin.rowIndex !== null && end.rowIndex !== null) {
          const startIndex = Math.min(origin.rowIndex, end.rowIndex);
          const endIndex = Math.max(origin.rowIndex, end.rowIndex);

          setData((prevData) => {
            const newData = [...prevData];
            for (let i = startIndex; i <= endIndex; i++) {
              if (i !== origin.rowIndex && newData[i]) {
                newData[i] = {
                  ...newData[i]!,
                  [origin.column_id]: originValue,
                };
              }
            }
            return newData;
          });
        }
      },
    },
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <DataTable table={table} />
      </div>
    </div>
  );
}
