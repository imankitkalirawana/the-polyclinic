import { useSession } from '@/libs/providers/session-provider';
import { useConfirmAppointment, useSendReminder } from '../appointment.query';
import { AppointmentType } from '../appointment.types';

export const useAppointmentActions = () => {
  const confirmMutation = useConfirmAppointment();
  const reminderMutation = useSendReminder();
  const { user } = useSession();
  const role = user?.role;

  const handleConfirm = async (appointment: AppointmentType) => {
    await confirmMutation.mutateAsync(appointment.aid);
  };

  const handleReminder = async (appointment: AppointmentType) => {
    let emails: string[] = [];

    if (role === 'DOCTOR') {
      emails = [appointment.patient.email];
    } else {
      emails = [appointment.patient.email, appointment.doctor?.email || ''];
    }

    await reminderMutation.mutateAsync({
      aid: appointment.aid,
      emails,
    });
  };

  return {
    handleConfirm,
    handleReminder,
  };
};
