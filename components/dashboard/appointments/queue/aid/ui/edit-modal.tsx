import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/ui/modal';
import CommonFields from '@/components/dashboard/users/user/form/common-fields';
import PatientFields from '@/components/dashboard/users/user/form/patient-fields';
import { useAppointmentQueueWithAID } from '@/services/client/appointment/queue/queue.query';
import { useUserProfileByID, useUpdateUser } from '@/services/common/user/user.query';
import { userFormValuesSchema } from '@/services/common/user/user.validation';
import { UserFormValues } from '@/services/common/user/user.types';

interface EditModalProps {
  aid: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditModal({ aid, isOpen, onClose }: EditModalProps) {
  const { data: appointment } = useAppointmentQueueWithAID(aid);
  const patientUserId = appointment?.patient;

  const { data: profile } = useUserProfileByID(patientUserId?.user_id);
  const updateUser = useUpdateUser();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormValuesSchema),
    defaultValues: {
      user: profile?.user,
      patient: profile?.patient,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        user: profile.user,
        patient: profile.patient,
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: UserFormValues) => {
    if (!profile?.user.id) {
      return;
    }

    await updateUser.mutateAsync({
      id: profile.user.id,
      data: values,
    });

    onClose();
  };

  const renderBody = () => {
    if (!appointment || !profile) {
      return (
        <p className="text-default-500 py-6 text-center">
          {appointment ? 'Loading patient details...' : 'Unable to load appointment details.'}
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 p-1 py-4 md:grid-cols-2">
        <CommonFields control={form.control} showRole={false} />
        <PatientFields control={form.control} />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      title="Edit Patient Details"
      subtitle="Update the patient's basic and personal information."
      body={renderBody()}
      submitButton={{
        children: 'Save Changes',
        whileSubmitting: 'Saving...',
        isLoading: updateUser.isPending,
        isDisabled: !profile,
      }}
      onSubmit={form.handleSubmit(handleSubmit)}
    />
  );
}
