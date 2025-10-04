import { useConfirmAppointment, useCancelAppointment, useSendReminder } from '../query';
import { AppointmentType } from '../types';

export const useAppointmentActions = () => {
  const confirmMutation = useConfirmAppointment();
  const cancelMutation = useCancelAppointment();
  const reminderMutation = useSendReminder();

  const handleConfirm = async (appointment: AppointmentType) => {
    await confirmMutation.mutateAsync({ aid: appointment.aid.toString() });
  };

  const handleCancel = async (appointment: AppointmentType) => {
    await cancelMutation.mutateAsync({ aid: appointment.aid.toString() });
  };

  const handleReminder = async (appointment: AppointmentType) => {
    await reminderMutation.mutateAsync({ aid: appointment.aid.toString() });
  };

  return {
    handleConfirm,
    handleCancel,
    handleReminder,
  };
};
