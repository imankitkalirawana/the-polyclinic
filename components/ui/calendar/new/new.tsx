'use client';
import type React from 'react';
import { Modal, ModalBody, ModalContent, ScrollShadow } from '@heroui/react';
import { FormProvider } from '@/components/appointments/new/session/context';
import { useSession } from 'next-auth/react';
import AccordionWrapper from '@/components/appointments/new/session/selection';

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
}

export default function NewAppointmentModal({
  open,
  onOpenChange,
}: NewAppointmentModalProps) {
  const { data: session } = useSession();

  if (!open) return null;

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
          <FormProvider session={session}>
            <AccordionWrapper />
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
