'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateAppointmentSidebar } from '../../create/sidebar';
import { BOOK_QUEUE_APPOINTMENT_STEPS } from '../../create/data';
import PatientSelection from './patient';
import DoctorSelection from './doctor';
import AdditionalInfo from './additional-info';
import ReviewAndPay from './review-n-pay';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import AppointmentQueueReceipt from './receipt';

const contentMap: Record<number, React.ReactNode> = {
  0: <PatientSelection />,
  1: <DoctorSelection />,
  2: <AdditionalInfo />,
  3: <ReviewAndPay />,
};

export default function NewQueueAppointment() {
  const form = useForm<CreateAppointmentQueueFormValues>({
    defaultValues: {
      appointment: {
        queueId: null,
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

  const currentStep = form.watch('meta.currentStep');

  return (
    <form className="flex-1" onSubmit={(e) => e.preventDefault()}>
      <FormProvider {...form}>
        <div className="flex h-[calc(100vh-3.75rem)]">
          <CreateAppointmentSidebar
            steps={BOOK_QUEUE_APPOINTMENT_STEPS}
            currentStep={currentStep}
            setCurrentStep={(step) => form.setValue('meta.currentStep', step)}
          />
          {contentMap[currentStep]}
        </div>
        {form.watch('meta.showReceipt') && <AppointmentQueueReceipt />}
      </FormProvider>
    </form>
  );
}
