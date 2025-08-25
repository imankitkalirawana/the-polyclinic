import { format } from 'date-fns';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';

import { castData } from '@/lib/utils';
import { useAppointmentWithAID } from '@/hooks/queries/client/appointment';
import { AppointmentType } from '@/types/appointment';

export default function CreateAppointmentSelectedPreviousAppointment() {
  const { values } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;

  const { data } = useAppointmentWithAID(appointment.previousAppointment ?? 0);
  const previousAppointment = castData<AppointmentType>(data);

  return (
    <div className="flex-1 border-t border-divider p-4">
      {previousAppointment ? (
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
