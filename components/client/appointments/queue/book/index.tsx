'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateAppointmentSidebar } from '../../create/sidebar';
import { BOOK_QUEUE_APPOINTMENT_STEPS } from '../../create/data';
import PatientSelection from './patient';
import { CreateAppointmentFormValues } from './types';
import DoctorSelection from './doctor';
import AdditionalInfo from './additional-info';
import PaymentConfirmation from './payment';
import AppointmentSummary from './summary';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <DoctorSelection />,
  2: <AdditionalInfo />,
  3: <AppointmentSummary />,
  4: <PaymentConfirmation />,
};

export default function BookQueueAppointment() {
  const form = useForm<CreateAppointmentFormValues>({
    defaultValues: {
      appointment: {
        patientId: '',
        doctorId: '',
        notes: null,
      },
      meta: {
        currentStep: 0,
        showConfirmation: false,
        showReceipt: false,
        createNewPatient: false,
      },
    },
  });

  const onSubmit = async (values: CreateAppointmentFormValues) => {
    console.log(values);
  };

  const currentStep = form.watch('meta.currentStep');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
      <FormProvider {...form}>
        <div className="flex h-[calc(100vh-3.75rem)]">
          <CreateAppointmentSidebar
            steps={BOOK_QUEUE_APPOINTMENT_STEPS}
            currentStep={currentStep}
            setCurrentStep={(step) => form.setValue('meta.currentStep', step)}
          />
          {contentMap[currentStep]}
        </div>
      </FormProvider>
    </form>
  );
}
