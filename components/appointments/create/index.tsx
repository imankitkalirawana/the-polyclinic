'use client';
import {
  Accordion,
  AccordionItem,
  addToast,
  Button,
  Link,
} from '@heroui/react';
import { AccordionTitle } from './accordion-title';
import { useFormik } from 'formik';
import { UserType } from '@/types/user';
import { DoctorType } from '@/types/doctor';
import { useLinkedUsers } from '@/services/user';
import UserSelection from '@/components/appointments/create/user-selection';
import { useState } from 'react';
import DateSelection, { DateSelectionTitle } from './date-selection';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle,
} from './additional-details-selection';
import { AppointmentFormType } from './types';
import { AppointmentMode, AType } from '@/types/appointment';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/axios';
import { format } from 'date-fns';
import { useAllAppointments } from '@/services/appointment';
import { castData } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';
import { useSession } from 'next-auth/react';

const KeyMap: Record<number, string> = {
  1: 'patient',
  2: 'time',
  3: 'doctor',
  4: 'additional-details',
};

export default function CreateAppointment({
  selectedDate,
  onClose,
}: {
  selectedDate: Date;
  onClose?: () => void;
}) {
  const router = useRouter();
  const { refetch } = useAllAppointments();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: linkedUsers, isLoading: isLinkedUsersLoading } =
    useLinkedUsers();
  const [currentStep, setCurrentStep] = useState(1);

  const formik = useFormik<AppointmentFormType>({
    initialValues: {
      patient: castData<UserType>({}),
      doctor: castData<DoctorType>({}),
      date: selectedDate,
      type: AType.consultation,
      additionalInfo: {
        notes: '',
        type: AppointmentMode.online,
        symptoms: '',
      },
    },
    onSubmit: async (values) => {
      try {
        await apiRequest({
          method: 'POST',
          url: '/api/v1/appointments',
          data: values,
          onSuccess: async () => {
            addToast({
              title: 'Appointment Scheduled',
              description: `Your appointment with ${values.doctor?.name} has been scheduled for ${format(values.date, 'PPp')}.`,
              color: 'success',
              endContent: (
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    router.push(
                      `/appointments/all?view=day&date=${new Date(values.date).toISOString()}`
                    );
                  }}
                >
                  View
                </Button>
              ),
            });
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ['appointments'],
              }),
              refetch(),
            ]);
            formik.resetForm();
            if (onClose) {
              onClose();
            } else {
              if (session?.user?.role !== 'receptionist') {
                router.push(
                  `/appointments/all?view=day&date=${new Date(values.date).toISOString()}`
                );
              }
            }
          },
        });
      } catch (error) {
        addToast({
          title: 'Appointment creation failed',
          description: 'Appointment creation failed',
          color: 'danger',
        });
      }
    },
  });

  const {
    values: appointment,
    setFieldValue: setAppointment,
    handleChange: handleAppointmentChange,
  } = formik;

  return (
    <div className="w-full">
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
          <UserSelection
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
          <UserSelection
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
            onContinue={formik.handleSubmit}
            isSubmitting={formik.isSubmitting}
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function DoctorSelectionTitle({ doctor }: { doctor: DoctorType }) {
  return doctor.uid ? (
    <h3 className="text-2xl font-semibold">
      {doctor?.uid === 0 ? 'No Doctor Selected' : doctor?.name}
    </h3>
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Choose a doctor (Optional)</h3>
    </div>
  );
}
