'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import {
  Accordion,
  AccordionItem,
  addToast,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalProps,
  ScrollShadow,
} from '@heroui/react';
import { format } from 'date-fns';
import { useFormik } from 'formik';

import { AccordionTitle } from './accordion-title';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle,
} from './additional-details-selection';
import AppointmentTypeSelection, {
  AppointmentTypeSelectionTitle,
} from './appointment-type-selection';
import DateSelection, { DateSelectionTitle } from './date-selection';
import DoYouKnowDoctorSelection from './do-you-know-doctor-selection';
import DoctorSelection from './doctor-selection';
import { useAppointmentDate } from './store';

import { CreateAppointmentType } from '@/components/appointments/create/types';
import UserSelection from '@/components/appointments/create-legacy/user-selection';
import Skeleton from '@/components/ui/skeleton';
import { castData } from '@/lib/utils';
import { useAllAppointments, useCreateAppointment } from '@/services/appointment';
import { useLinkedUsers, useUserWithUID } from '@/services/user';
import { useAppointmentStore } from '@/store/appointment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $FixMe } from '@/types';
import { AppointmentType } from '@/types/appointment';
import { UserType } from '@/types/user';

const KeyMap: Record<number, string> = {
  1: 'patient',
  2: 'appointment-type',
  3: 'do-you-know-your-doctor',
  4: 'doctor-date-selection',
  5: 'additional-details',
};

export function CreateAppointment({
  open,
  onOpenChange,
  defaultSelectedDate,
  onClose,
  size = '5xl',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSelectedDate: Date;
  onClose?: () => void;
  size?: ModalProps['size'];
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const { selectedDate } = useAppointmentDate();
  const { data: allAppointments } = useAllAppointments();

  const appointments = castData<AppointmentType[]>(allAppointments);

  const createAppointment = useCreateAppointment();

  const { setAppointment: setCalendarAppointment } = useAppointmentStore();
  const { data: linkedUsers, isLoading: isLinkedUsersLoading } = useLinkedUsers();

  const formik = useFormik<CreateAppointmentType>({
    initialValues: {
      date: selectedDate || defaultSelectedDate,
      type: 'consultation',
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
      previousAppointment: undefined,
      knowYourDoctor: false,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await createAppointment.mutateAsync(values);
        addToast({
          title: 'Appointment created',
          description: `Your appointment is scheduled for ${format(new Date(values.date), 'PPp')}`,
          color: 'success',
          endContent: (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => {
                if (size === 'full') {
                  router.push(`/appointments/${data.aid}`);
                  return;
                }
                setCalendarAppointment(data);
              }}
            >
              View
            </Button>
          ),
        });
        setCurrentStep(1);
        resetForm();
        onClose?.();
      } catch (error: $FixMe) {
        console.error(error);
        addToast({
          title: 'Failed to create appointment',
          description: `${error.message}`,
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

  // useEffect(() => {
  //   setAppointment('date', selectedDate || defaultSelectedDate);
  //   setAppointment('time', getNextAvailableTimeSlot(selectedDate || defaultSelectedDate));
  // }, [selectedDate, defaultSelectedDate]);

  const selectedPatient = useMemo(
    () => linkedUsers?.find((user) => user.uid === appointment.patient),
    [linkedUsers, appointment.patient]
  );

  return (
    <Modal
      size={size}
      isOpen={open}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      backdrop="blur"
      hideCloseButton={size === 'full'}
    >
      <ModalContent>
        <ModalBody as={ScrollShadow} hideScrollBar className="w-full">
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
                  image={selectedPatient?.image}
                  title={
                    currentStep === 1
                      ? 'Please select for whom you want to book an appointment?'
                      : selectedPatient?.name || 'No patient selected'
                  }
                  subtitle={currentStep === 1 ? null : selectedPatient?.email}
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
                onSelectionChange={(uid) => {
                  setAppointment('patient', uid);
                  setCurrentStep(2);
                }}
              />
            </AccordionItem>
            <AccordionItem
              textValue="Appointment Type"
              isDisabled={currentStep < 2}
              key="appointment-type"
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
              title={
                <AppointmentTypeSelectionTitle
                  appointmentType={appointment.type}
                  previousAppointment={appointment.previousAppointment}
                />
              }
            >
              <AppointmentTypeSelection
                appointmentType={appointment.type}
                previousAppointment={appointment.previousAppointment}
                setAppointmentType={(type) => setAppointment('type', type)}
                setPreviousAppointment={(aid) => setAppointment('previousAppointment', aid)}
                onContinue={() => {
                  if (appointment.type === 'follow-up' && appointment.previousAppointment) {
                    const previousAppointment = appointments?.find(
                      (apt) => apt.aid === appointment.previousAppointment
                    );
                    if (previousAppointment) {
                      setAppointment('doctor', previousAppointment.doctor);
                      setCurrentStep(5);
                      return;
                    }
                  }
                  setCurrentStep(3);
                }}
              />
            </AccordionItem>
            <AccordionItem
              textValue="Do you know your doctor?"
              isDisabled={currentStep < 3 || appointment.type === 'follow-up'}
              key="do-you-know-your-doctor"
              hideIndicator={currentStep <= 3}
              indicator={
                <Link
                  href="#"
                  onPress={() => {
                    setCurrentStep(3);
                  }}
                >
                  Change
                </Link>
              }
              title={
                <h3 className="text-2xl font-semibold">
                  Do you know you doctor?
                  {currentStep > 3 ? (appointment.knowYourDoctor ? ' (Yes)' : ' (No)') : ''}
                </h3>
              }
            >
              <DoYouKnowDoctorSelection
                knowYourDoctor={appointment.knowYourDoctor}
                onSelectionChange={(value) => {
                  setAppointment('knowYourDoctor', value === 'know-your-doctor');
                }}
                onContinue={() => {
                  setCurrentStep(4);
                }}
              />
            </AccordionItem>
            {appointment.knowYourDoctor ? (
              <AccordionItem
                textValue="Doctor Selection"
                isDisabled={currentStep < 4 || appointment.type === 'follow-up'}
                key="doctor-date-selection"
                indicator={
                  <Link
                    href="#"
                    onPress={() => {
                      setCurrentStep(4);
                    }}
                  >
                    Change
                  </Link>
                }
                hideIndicator={currentStep <= 4}
                title={<DoctorSelectionTitle doctor={appointment?.doctor} />}
              >
                <DoctorSelection
                  selectedDoctor={appointment.doctor}
                  setAppointment={setAppointment}
                  onContinue={() => setCurrentStep(5)}
                />
              </AccordionItem>
            ) : (
              <AccordionItem
                textValue="Time Selection"
                isDisabled={currentStep < 4}
                key="doctor-date-selection"
                indicator={
                  <Link
                    href="#"
                    onPress={() => {
                      setCurrentStep(4);
                    }}
                  >
                    Change
                  </Link>
                }
                hideIndicator={currentStep <= 4}
                title={
                  <DateSelectionTitle
                    date={new Date(appointment.date)}
                    isSelected={currentStep === 4}
                  />
                }
              >
                <DateSelection
                  onSubmit={() => setCurrentStep(5)}
                  date={new Date(appointment.date)}
                  setDate={(date) => setAppointment('date', date)}
                />
              </AccordionItem>
            )}
            <AccordionItem
              textValue="Additional Details"
              isDisabled={currentStep < 5}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function DoctorSelectionTitle({ doctor }: { doctor?: number }) {
  const { data: doctorData, isLoading } = useUserWithUID(doctor);
  return doctor ? (
    isLoading ? (
      <Skeleton className="h-8 w-32" />
    ) : (
      <h3 className="text-2xl font-semibold">{doctorData?.name}</h3>
    )
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Choose a doctor</h3>
    </div>
  );
}

export default function CreateAppointmentWrapper() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
      <CreateAppointment
        open
        onOpenChange={() => {}}
        defaultSelectedDate={new Date()}
        size="full"
      />
    </div>
  );
}
