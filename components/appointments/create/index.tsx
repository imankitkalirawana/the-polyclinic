'use client';

import { Accordion, AccordionItem, Link } from '@heroui/react';
import { AccordionTitle } from './title';
import { useFormik } from 'formik';
import { UserType } from '@/types/user';
import { DoctorType } from '@/types/doctor';
import { useLinkedUsers } from '@/services/user';
import UsersList from '@/components/ui/appointments/users-list';
import { useState } from 'react';
import DateSelection, { DateSelectionTitle } from './date-selection';
import { DoctorSelectionTitle } from '../new/session/doctor-selection';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle,
} from '../new/session/additional-details-selection';
import { AppointmentFormType } from './types';
import { Gender } from '@/lib/interface';
import { AppointmentMode, AType } from '@/types/appointment';

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

  const formik = useFormik<AppointmentFormType>({
    initialValues: {
      patient: {
        uid: 0,
        name: '',
        email: '',
        phone: '',
        gender: Gender.male,
      },
      doctor: {
        uid: 0,
        name: '',
        email: '',
        phone: '',
        sitting: '',
      },
      date: selectedDate || new Date(),
      type: AType.consultation,
      additionalInfo: {
        notes: '',
        type: AppointmentMode.online,
        symptoms: '',
      },
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const {
    values: appointment,
    setFieldValue: setAppointment,
    handleChange: handleAppointmentChange,
  } = formik;

  return (
    <div>
      <Accordion
        defaultSelectedKeys={[KeyMap[currentStep]]}
        selectedKeys={[KeyMap[currentStep]]}
      >
        <AccordionItem
          hideIndicator
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
          title={<DateSelectionTitle date={new Date(appointment.date)} />}
        >
          <DateSelection
            date={new Date(appointment.date)}
            setDate={(date) => setAppointment('date', date)}
            onSubmit={() => setCurrentStep(3)}
          />
        </AccordionItem>
        <AccordionItem
          textValue="Doctor Selection"
          isDisabled={currentStep < 3}
          key="doctor"
          indicator={
            <Link
              href="#"
              onPress={() => {
                setCurrentStep(3);
                setAppointment('doctor', {} as DoctorType);
              }}
            >
              Change
            </Link>
          }
          hideIndicator={currentStep <= 3}
          title={
            <DoctorSelectionTitle doctor={appointment.doctor as DoctorType} />
          }
        >
          <UsersList
            id="doctor"
            size="sm"
            isLoading={isLinkedUsersLoading}
            users={linkedUsers || []}
            selectedUser={appointment.doctor as unknown as UserType}
            onSelectionChange={(user) => {
              setAppointment('doctor', user);
              setCurrentStep(4);
            }}
          />
        </AccordionItem>
        <AccordionItem
          textValue="Additional Details"
          isDisabled={currentStep < 4}
          key="additional-details"
          title={<AdditionalDetailsSelectionTitle />}
        >
          <AdditionalDetailsSelection
            appointment={appointment}
            handleAppointmentChange={handleAppointmentChange}
            onContinue={() => setCurrentStep(5)}
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
