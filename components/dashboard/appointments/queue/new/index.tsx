'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateAppointmentSidebar } from '../../create/sidebar';
import { BookQueueSteps, getBookQueueStepsByRole, getFirstBookQueueStep } from '../../create/data';
import PatientSelection from './patient';
import DoctorSelection from './doctor';
import AdditionalInfo from './additional-info';
import ReviewAndPay from './review-n-pay';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import AppointmentQueueReceipt from './receipt';
import { useSession } from '@/libs/providers/session-provider';
import { Role } from '@/services/common/user/user.constants';

const contentMap: Record<BookQueueSteps, React.ReactNode> = {
  [BookQueueSteps.PATIENT_INFORMATION]: <PatientSelection />,
  [BookQueueSteps.DOCTOR_SELECTION]: <DoctorSelection />,
  [BookQueueSteps.ADDITIONAL_DETAILS]: <AdditionalInfo />,
  [BookQueueSteps.REVIEW_AND_PAY]: <ReviewAndPay />,
};

export default function NewQueueAppointment() {
  const { user } = useSession();
  const integratedUserId = user?.integrated_user_id ?? '';

  const role = user?.role ?? Role.PATIENT;
  const form = useForm<CreateAppointmentQueueFormValues>({
    defaultValues: {
      appointment: {
        aid: null,
        patientId: role === Role.PATIENT ? integratedUserId : '',
        doctorId: '',
        appointmentDate: new Date(),
        notes: null,
      },
      meta: {
        currentStep: getFirstBookQueueStep(role),
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
            steps={getBookQueueStepsByRole(role)}
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
