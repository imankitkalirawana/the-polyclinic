import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';

export default function FixMeModal() {
  return (
    <Modal isOpen backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Fix Me Modal
            </ModalHeader>
            <ModalBody>
              <p>This is placeholder for the fix me modal.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
