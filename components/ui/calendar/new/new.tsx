'use client';
import type React from 'react';
import { Modal, ModalBody, ModalContent, ScrollShadow } from '@heroui/react';
import CreateAppointment from '@/components/appointments/create';

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export default function NewAppointmentModal({
  selectedDate,
  open,
  onOpenChange,
}: NewAppointmentModalProps) {
  return (
    <Modal
      size="5xl"
      isOpen={open}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        <ModalBody as={ScrollShadow} className="w-full">
          <CreateAppointment
            selectedDate={selectedDate}
            onClose={() => onOpenChange(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
