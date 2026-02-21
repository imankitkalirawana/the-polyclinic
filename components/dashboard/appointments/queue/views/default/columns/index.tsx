import Modal from '@/components/ui/modal';
import { Button, useDisclosure } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import AllColumns from './all-columns';
import SelectedColumns from './selected-columns';
import { SelectedColumnDefinition, TableViewType } from '@/services/common/columns/columns.types';
import {
  useAllColumns,
  useSelectedColumns,
  useUpdateColumns,
} from '@/services/common/columns/columns.query';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

const MIN_SELECTED_COLUMNS = 3;

export default function QueueColumns() {
  const columnModal = useDisclosure();
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnDefinition[]>([]);
  const { data: columns, isLoading: isLoadingColumns } = useAllColumns(TableViewType.QUEUE);
  const { data: selectedColumnsData } = useSelectedColumns(TableViewType.QUEUE);
  const { mutateAsync: updateColumns } = useUpdateColumns();

  useEffect(() => {
    if (selectedColumnsData) {
      setSelectedColumns(selectedColumnsData);
    }
  }, [selectedColumnsData]);

  const renderBody = useMemo(() => {
    return (
      <div className="grid grid-cols-2 overflow-hidden">
        <AllColumns
          columns={columns || []}
          selectedColumns={selectedColumns}
          onSelectionChange={(value) => {
            setSelectedColumns((previousSelectedColumns) => {
              return value
                .map((id, index) => {
                  const existingColumn = previousSelectedColumns.find(
                    (selectedColumn) => selectedColumn.id === id
                  );

                  if (existingColumn) {
                    return {
                      ...existingColumn,
                      order: index,
                    };
                  }

                  const baseColumn = columns?.find((column) => column.id === id);

                  if (!baseColumn) {
                    return null;
                  }

                  return {
                    ...baseColumn,
                    order: index,
                    pinned: false,
                  };
                })
                .filter((item): item is SelectedColumnDefinition => item !== null);
            });
          }}
        />
        <DragDropProvider
          onDragEnd={(event) => {
            setSelectedColumns((currentSelectedColumns) => {
              const reorderedColumns = move(currentSelectedColumns, event);

              return reorderedColumns.map((column, index) => ({
                ...column,
                order: index,
              }));
            });
          }}
        >
          <SelectedColumns
            selectedColumns={selectedColumns}
            onRemoveColumn={(column) =>
              setSelectedColumns((current) =>
                current.length <= MIN_SELECTED_COLUMNS
                  ? current
                  : current.filter((c) => c.id !== column.id)
              )
            }
          />
        </DragDropProvider>
      </div>
    );
  }, [columns, selectedColumns]);

  return (
    <>
      {/* TODO: Add a loading state */}
      <Button size="sm" onPress={columnModal.onOpen} isDisabled={isLoadingColumns}>
        Columns
      </Button>
      <Modal
        size="4xl"
        isOpen={columnModal.isOpen}
        onClose={columnModal.onClose}
        title="Columns"
        subtitle="Select the columns you want to display in the appointment table"
        body={renderBody}
        submitButton={{
          children: 'Save',
        }}
        onSubmit={async () => {
          await updateColumns({ viewType: TableViewType.QUEUE, columns: selectedColumns });
          columnModal.onClose();
        }}
      />
    </>
  );
}
