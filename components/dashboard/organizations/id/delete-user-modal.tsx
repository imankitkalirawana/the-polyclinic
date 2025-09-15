'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: React.ReactNode | string;
  modalTitle: string;
  onDelete: () => void;
  isLoading?: boolean;
  showAlert?: boolean;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  content,
  modalTitle,
  onDelete,
  isLoading,
  showAlert,
}: DeleteUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-danger">
            <Icon icon="solar:trash-bin-trash-line-duotone" className="h-5 w-5" />
            <span>{modalTitle}</span>
          </div>
        </ModalHeader>

        <ModalBody>{content}</ModalBody>

        <div className="flex items-center p-6">
          {showAlert && (
            <Alert
              color="danger"
              title="This action cannot be undone."
              classNames={{
                base: 'py-2',
              }}
            />
          )}
        </div>

        <ModalFooter>
          <Button variant="flat" onPress={onClose} fullWidth>
            Cancel
          </Button>
          <Button color="danger" onPress={onDelete} isLoading={isLoading} fullWidth>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
