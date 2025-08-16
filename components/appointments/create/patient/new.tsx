import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { useFormikContext } from 'formik';
import { CreateAppointmentFormValues } from '../types';

export default function CreateAppointmentPatientNew() {
  const { setFieldValue } = useFormikContext<CreateAppointmentFormValues>();

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onOpenChange={() => setFieldValue('meta.createNewPatient', false)}
    >
      <ModalContent>
        <ModalHeader>Create New Patient</ModalHeader>
        <ModalBody>
          <p>This is the new patient modal.</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
