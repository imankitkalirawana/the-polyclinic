import { ColumnDefinition } from '@/services/common/columns/columns.types';
import { Checkbox, CheckboxGroup, ScrollShadow } from '@heroui/react';

export default function AllColumns({
  selectedColumns,
  onSelectionChange,
  columns,
}: {
  selectedColumns: ColumnDefinition[];
  onSelectionChange: (value: string[]) => void;
  columns: ColumnDefinition[];
}) {
  return (
    <ScrollShadow hideScrollBar>
      <CheckboxGroup
        value={selectedColumns.map((column) => column.id)}
        onValueChange={onSelectionChange}
      >
        {columns?.map((column) => (
          <Checkbox key={column.id} value={column.id}>
            {column.name}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </ScrollShadow>
  );
}
