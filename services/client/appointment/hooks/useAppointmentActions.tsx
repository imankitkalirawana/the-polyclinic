import { useSession } from '@/lib/providers/session-provider';
import { useConfirmAppointment, useSendReminder } from '../query';
import { AppointmentType } from '../types';

export const useAppointmentActions = () => {
  const confirmMutation = useConfirmAppointment();
  const reminderMutation = useSendReminder();
  const { user } = useSession();
  const role = user?.role;

  const handleConfirm = async (appointment: AppointmentType) => {
    await confirmMutation.mutateAsync({ aid: appointment.aid.toString() });
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
