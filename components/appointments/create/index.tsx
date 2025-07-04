'use client';
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
import { AccordionTitle } from './accordion-title';
import { useFormik } from 'formik';
import { UserType } from '@/types/user';
import { DoctorType } from '@/types/doctor';
import { useLinkedUsers } from '@/services/user';
import UserSelection from '@/components/appointments/create/user-selection';
import { useEffect, useState } from 'react';
import DateSelection, { DateSelectionTitle } from './date-selection';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle,
} from './additional-details-selection';
import { CreateAppointmentType } from '@/types/appointment';
import { format } from 'date-fns';
import { useCreateAppointment } from '@/services/appointment';
import { castData } from '@/lib/utils';
import { $FixMe } from '@/types';
import { useCalendarStore } from '@/components/ui/calendar/store';
import { getNextAvailableTimeSlot } from './helper';
import { useRouter } from 'nextjs-toploader/app';

const KeyMap: Record<number, string> = {
  1: 'patient',
  2: 'time',
  3: 'doctor',
  4: 'additional-details',
};

const getDate = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  return newDate;
};

export default function CreateAppointment({
  open,
  onOpenChange,
  selectedDate,
  onClose,
  size = '5xl',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onClose?: () => void;
  size?: ModalProps['size'];
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const createAppointment = useCreateAppointment();
  const { setAppointment: setCalendarAppointment } = useCalendarStore();
  const { data: linkedUsers, isLoading: isLinkedUsersLoading } =
    useLinkedUsers();

  const formik = useFormik<CreateAppointmentType>({
    initialValues: {
      patient: castData<UserType>({}),
      doctor: castData<DoctorType>({}),
      date: selectedDate,
      type: 'consultation',
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await createAppointment.mutateAsync(values);
        addToast({
          title: 'Appointment created',
          description: `Your appointment is scheduled for ${format(
            new Date(values.date),
            'PPp'
          )}`,
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

  useEffect(() => {
    setAppointment('date', selectedDate);
    setAppointment('time', getNextAvailableTimeSlot(selectedDate));
  }, [selectedDate]);

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
                  image={appointment.patient?.image}
                  title={
                    currentStep === 1
                      ? 'Please select for whom you want to book an appointment?'
                      : appointment.patient?.name
                  }
                  subtitle={
                    currentStep === 1 ? null : appointment.patient?.email
                  }
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
              title={
                <DateSelectionTitle
                  date={new Date(appointment.date)}
                  isSelected={currentStep === 2}
                />
              }
            >
              <DateSelection
                onSubmit={() => setCurrentStep(3)}
                date={new Date(appointment.date)}
                setDate={(date) => setAppointment('date', date)}
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
                <DoctorSelectionTitle
                  doctor={appointment.doctor as DoctorType}
                />
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
        </ModalBody>
      </ModalContent>
    </Modal>
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
