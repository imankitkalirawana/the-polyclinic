import { ColumnDefinition } from '@/services/common/columns/columns.types';
import { useSortable } from '@dnd-kit/react/sortable';
import { Button, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';

const MIN_SELECTED_COLUMNS = 3;

export default function SelectedColumns({
  selectedColumns,
  onRemoveColumn,
}: {
  selectedColumns: ColumnDefinition[];
  onRemoveColumn: (column: ColumnDefinition) => void;
}) {
  const canRemove = selectedColumns.length > MIN_SELECTED_COLUMNS;

  return (
    <ScrollShadow className="border-divider border-l px-4">
      <ul className="flex flex-col">
        {selectedColumns?.map((column, index) => (
          <Sortable
            key={column.id}
            column={column}
            index={index}
            onRemoveColumn={onRemoveColumn}
            canRemove={canRemove}
          />
        ))}
      </ul>
    </ScrollShadow>
  );
}

function Sortable({
  column,
  index,
  onRemoveColumn,
  canRemove,
}: {
  column: ColumnDefinition;
  index: number;
  onRemoveColumn: (column: ColumnDefinition) => void;
  canRemove: boolean;
}) {
  const { ref, handleRef } = useSortable({
    id: column.id,
    index,
    modifiers: [RestrictToVerticalAxis],
  });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <li
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      ref={ref}
      className="rounded-small hover:bg-default-100 flex h-8 items-center justify-between px-2 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span ref={handleRef} className="hover:bg-default-200 rounded-full hover:cursor-grab">
          <Icon icon="material-symbols-light:drag-indicator" width={18} />
        </span>
        <span>{column.name}</span>
      </div>
      {isHovering && canRemove && (
        <Button
          color="danger"
          radius="full"
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => onRemoveColumn(column)}
        >
          <Icon icon="solar:close-circle-bold-duotone" width={18} />
        </Button>
      )}
    </li>
  );
}
