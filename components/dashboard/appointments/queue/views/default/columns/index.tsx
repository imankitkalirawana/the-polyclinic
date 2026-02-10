import Modal from '@/components/ui/modal';
import { Button, useDisclosure } from '@heroui/react';
import { useMemo, useState } from 'react';
import AllColumns from './all-columns';
import SelectedColumns from './selected-columns';
import { ColumnDefinition, TableViewType } from '@/services/common/columns/columns.types';
import { useAllColumns } from '@/services/common/columns/columns.query';

export default function QueueColumns() {
  const columnModal = useDisclosure();
  const [selectedColumns, setSelectedColumns] = useState<ColumnDefinition[]>([]);
  const { data: columns } = useAllColumns(TableViewType.QUEUE);

  const renderBody = useMemo(() => {
    return (
      <div className="grid grid-cols-2">
        <AllColumns
          columns={columns || []}
          selectedColumns={selectedColumns}
          onSelectionChange={(value) =>
            setSelectedColumns(value.map((id) => columns?.find((column) => column.id === id)!))
          }
        />
        <SelectedColumns selectedColumns={selectedColumns} />
      </div>
    );
  }, [columns, selectedColumns]);

  return (
    <>
      <Button onPress={columnModal.onOpen}>Columns</Button>
      <Modal
        size="4xl"
        isOpen={columnModal.isOpen}
        onClose={columnModal.onClose}
        title="Columns"
        body={renderBody}
        submitButton={{
          children: 'Save',
        }}
        onSubmit={() => {
          columnModal.onClose();
        }}
      />
    </>
  );
}
