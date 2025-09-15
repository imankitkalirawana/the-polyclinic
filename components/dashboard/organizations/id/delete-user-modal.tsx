'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: React.ReactNode | string;
  modalTitle: string;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  content,
  modalTitle,
  onDelete,
  isLoading,
}: DeleteUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-danger">
            <Icon icon="solar:trash-bin-trash-line-duotone" className="h-5 w-5" />
            <span>{modalTitle}</span>
          </div>
        </ModalHeader>

        <ModalBody>{content}</ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={onDelete} isLoading={isLoading}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
