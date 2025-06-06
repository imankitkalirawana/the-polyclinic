'use client';

import type React from 'react';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  onCreateAppointment: (appointmentData: any) => void;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  onCreateAppointment,
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorName: 'Dr. Smith',
    type: 'consultation',
    appointmentType: 'online',
    notes: '',
    symptoms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAppointment(formData);
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      doctorName: 'Dr. Smith',
      type: 'consultation',
      appointmentType: 'online',
      notes: '',
      symptoms: '',
    });
  };

  const formatDateTime = () => {
    if (!selectedDate) return '';
    const dateStr = format(selectedDate, 'EEEE, MMMM d, yyyy');
    return selectedTime ? `${dateStr} at ${selectedTime}` : dateStr;
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <h3 className="text-lg font-medium">Create New Appointment</h3>
        </ModalHeader>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm font-medium">Date & Time</div>
            <div className="text-muted-foreground text-sm">
              {formatDateTime()}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              label="Patient Name"
              id="patientName"
              value={formData.patientName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  patientName: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Patient Email"
              id="patientEmail"
              type="email"
              value={formData.patientEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  patientEmail: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Patient Phone"
              id="patientPhone"
              value={formData.patientPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  patientPhone: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Doctor"
              value={formData.doctorName}
              //   onChange={(value) =>
              //     setFormData((prev) => ({ ...prev, doctorName: value }))
              //   }
            >
              <SelectItem key="Dr. Smith">Dr. Smith</SelectItem>
              <SelectItem key="Dr. Johnson">Dr. Johnson</SelectItem>
              <SelectItem key="Dr. Williams">Dr. Williams</SelectItem>
            </Select>
          </div>

          <div className="space-y-2">
            <Select
              label="Appointment Type"
              value={formData.type}
              // onValueChange={(value) =>
              //     setFormData((prev) => ({ ...prev, type: value }))
              // }
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
              value={formData.symptoms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, symptoms: e.target.value }))
              }
              placeholder="e.g., headache, fever"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              label="Additional Notes"
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
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
          </div>
        </Form>
      </ModalContent>
    </Modal>
  );
}
