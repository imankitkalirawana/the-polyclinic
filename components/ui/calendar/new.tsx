'use client';

import type React from 'react';
import { format } from 'date-fns';
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@heroui/react';
import { useFormik } from 'formik';
import UsersList from '../appointments/users-list';
import { UserType } from '@/models/User';
import { useState } from 'react';
import { useLinkedUsers } from '@/services/user';

interface NewAppointmentModalProps {
  users: UserType[];
  self: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
}

export default function NewAppointmentModal({
  self,
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
}: NewAppointmentModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<UserType>(self);
  const { data: users, isLoading } = useLinkedUsers();

  const formik = useFormik({
    initialValues: {
      appointment: {
        patient: self,
        doctor: '',
        date: selectedDate,
        type: 'consultation',
        notes: '',
        symptoms: '',
      },
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const formatDateTime = () => {
    if (!selectedDate) return '';
    const dateStr = format(selectedDate, 'EEEE, MMMM d, yyyy');
    return selectedTime ? `${dateStr} at ${selectedTime}` : dateStr;
  };

  return (
    <Modal
      size="5xl"
      isOpen={open}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
    >
      <ModalContent
        as={Form}
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <ModalHeader>
          <h3 className="text-large font-medium">Create New Appointment</h3>
        </ModalHeader>

        <ModalBody as={ScrollShadow} className="w-full">
          <div className="rounded-small bg-default p-3">
            <div className="text-small font-medium">Date & Time</div>
            <div className="text-small text-default-foreground">
              {formatDateTime()}
            </div>
          </div>
          <UsersList
            id="patient"
            users={users ?? []}
            isLoading={isLoading}
            size="sm"
            selectedUser={selectedPatient}
            onSelectionChange={setSelectedPatient}
          />
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            type="button"
            variant="bordered"
            onPress={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Create Appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
