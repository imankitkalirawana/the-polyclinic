import { format } from 'date-fns';

import { useCreateAppointmentForm } from '../index';

import { castData } from '@/libs/utils';
import { useAppointmentWithAID } from '@/services/client/appointment/appointment.query';
import { AppointmentType } from '@/services/client/appointment';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

export default function CreateAppointmentSelectedPreviousAppointment() {
  const { watch } = useCreateAppointmentForm();
  const appointment = watch('appointment');

  const { data, isLoading } = useAppointmentWithAID(appointment.previousAppointment ?? '');
  const previousAppointment = castData<AppointmentType>(data);

  return (
    <div className="flex-1 border-t border-divider p-4">
      {isLoading ? (
        <MinimalPlaceholder message="Loading appointment details..." />
      ) : previousAppointment ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-default-500">
            {previousAppointment?.patient.name} - {previousAppointment?.doctor?.name}
          </div>
          <div className="text-sm text-default-500">
            {format(new Date(previousAppointment?.date), 'PPp')}
          </div>
        </div>
      ) : (
        <p className="text-sm text-default-500">No previous appointment selected</p>
      )}
    </div>
  );
}
