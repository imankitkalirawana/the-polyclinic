import { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent } from '@heroui/react';

import { useAppointmentDate } from './store';

import { SlotsPreview } from '@/components/dashboard/doctors/doctor/slots/slots-preview';
import { useSlotsByUID } from '@/hooks/queries/client/slots';

export default function DoctorSlots({ selectedDoctor }: { selectedDoctor: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: slots, isLoading: isSlotsLoading } = useSlotsByUID(selectedDoctor);

  const { setSelectedDate } = useAppointmentDate();

  return (
    <>
      <Button isLoading={isSlotsLoading} onPress={() => setIsOpen(true)}>
        Select a slot
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="5xl"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalBody>
            {slots && (
              <SlotsPreview
                config={slots}
                onSlotSelect={(date) => {
                  setSelectedDate(date);
                  setIsOpen(false);
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
