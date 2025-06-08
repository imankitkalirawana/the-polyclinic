'use client';

import type React from 'react';

import { format } from 'date-fns';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { UserType } from '@/models/User';
import { AppointmentType } from '@/models/Appointment';

interface NewAppointmentModalProps {
  open: boolean;
  user: Pick<UserType, 'uid' | 'name' | 'email' | 'phone' | 'image'>;
  linkedUsers: UserType[];
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  onCreateAppointment: (appointmentData: any) => void;
}

export default function NewAppointmentModal({
  open,
  user,
  onOpenChange,
  selectedDate,
  selectedTime,
  onCreateAppointment,
  linkedUsers,
}: NewAppointmentModalProps) {
  const formik = useFormik({
    initialValues: {
      appointment: {
        patient: user,
        doctor: '',
        date: selectedDate,
        type: 'consultation',
        notes: '',
        symptoms: '',
      },
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onCreateAppointment(values);
    },
  });

  const formatDateTime = () => {
    if (!selectedDate) return '';
    const dateStr = format(selectedDate, 'EEEE, MMMM d, yyyy');
    return selectedTime ? `${dateStr} at ${selectedTime}` : dateStr;
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange} scrollBehavior="inside">
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
          <div className="rounded-lg bg-default p-3">
            <div className="text-small font-medium">Date & Time</div>
            <div className="text-small text-default-foreground">
              {formatDateTime()}
            </div>
          </div>

          <Input
            label="Patient Name"
            id="patientName"
            value={formik.values.appointment.patient.name}
            onChange={formik.handleChange}
            required
          />

          <div className="space-y-2">
            <Input
              label="Patient Email"
              id="patientEmail"
              type="email"
              value={formik.values.appointment.patient.email}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Patient Phone"
              id="patientPhone"
              value={formik.values.appointment.patient.phone}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Doctor"
              value={formik.values.appointment.doctor}
              onChange={formik.handleChange}
            >
              <SelectItem key="Dr. Smith">Dr. Smith</SelectItem>
              <SelectItem key="Dr. Johnson">Dr. Johnson</SelectItem>
              <SelectItem key="Dr. Williams">Dr. Williams</SelectItem>
            </Select>
          </div>

          <div className="space-y-2">
            <Select
              label="Appointment Type"
              value={formik.values.appointment.type}
              onChange={formik.handleChange}
            >
              <SelectItem key="consultation">Consultation</SelectItem>
              <SelectItem key="follow-up">Follow-up</SelectItem>
              <SelectItem key="emergency">Emergency</SelectItem>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              label="Symptoms"
              id="symptoms"
              value={formik.values.appointment.symptoms}
              onChange={formik.handleChange}
              placeholder="e.g., headache, fever"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              label="Additional Notes"
              id="notes"
              value={formik.values.appointment.notes}
              onChange={formik.handleChange}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4"></div>
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
