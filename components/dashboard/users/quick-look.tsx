import { UserType } from '@/models/User';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

interface QuickLookProps {
  onClose: () => void;
  item: UserType;
}

export default function QuickLook({ onClose, item }: QuickLookProps) {
  return (
    <Modal size="5xl" isOpen backdrop="blur" onClose={onClose}>
      <ModalContent className="h-[85vh] sm:my-0">
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
}
