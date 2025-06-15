'use client';

import { Accordion, AccordionItem, Link } from '@heroui/react';
import { AccordionTitle } from './title';
import { useFormik } from 'formik';
import { UserType } from '@/models/User';
import { AppointmentType } from '@/models/Appointment';
import { DoctorType } from '@/models/Doctor';
import { useLinkedUsers } from '@/services/user';
import UsersList from '@/components/ui/appointments/users-list';
import { useState } from 'react';
import DateSelection, { DateSelectionTitle } from './date-selection';

const KeyMap: Record<number, string> = {
  1: 'patient',
  2: 'time',
  3: 'doctor',
  4: 'additional-details',
};

export default function CreateAppointment({
  selectedDate,
  selectedTime,
}: {
  selectedDate: Date | null;
  selectedTime: string | null;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: linkedUsers, isLoading: isLinkedUsersLoading } =
    useLinkedUsers();

  const formik = useFormik({
    initialValues: {
      patient: {} as UserType,
      doctor: {} as DoctorType,
      appointment: {} as AppointmentType,
      date: selectedDate || new Date(),
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const { values: appointment, setFieldValue: setAppointment } = formik;

  return (
    <div>
      <Accordion
        defaultSelectedKeys={[KeyMap[currentStep]]}
        selectedKeys={[KeyMap[currentStep]]}
      >
        <AccordionItem
          key="patient"
          textValue="patient"
          title={
            <AccordionTitle
              isActive={currentStep === 1}
              image={appointment.patient?.image}
              title={
                currentStep === 1
                  ? 'Please select for whom you want to book an appointment?'
                  : appointment.patient?.name
              }
              subtitle={currentStep === 1 ? null : appointment.patient?.email}
              onPress={() => {
                setCurrentStep(1);
                setAppointment('patient', {} as UserType);
              }}
            />
          }
        >
          <UsersList
            id="patient"
            size="sm"
            isLoading={isLinkedUsersLoading}
            users={linkedUsers || []}
            selectedUser={appointment.patient}
            onSelectionChange={(user) => {
              setAppointment('patient', user);
              setCurrentStep(2);
            }}
          />
        </AccordionItem>
        <AccordionItem
          textValue="Time Selection"
          isDisabled={currentStep < 2}
          key="time"
          indicator={
            <Link
              href="#"
              onPress={() => {
                setCurrentStep(2);
              }}
            >
              Change
            </Link>
          }
          hideIndicator={currentStep <= 2}
          title={<DateSelectionTitle date={appointment.date} />}
        >
          <DateSelection
            date={appointment.date}
            setDate={(date) => setAppointment('date', date)}
            onSubmit={() => setCurrentStep(3)}
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
