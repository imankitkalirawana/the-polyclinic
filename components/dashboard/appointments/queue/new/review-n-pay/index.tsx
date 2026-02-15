import { Divider } from '@heroui/react';
import { format } from 'date-fns';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
} from '../../../(common)';
import { useFormContext } from 'react-hook-form';
import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import { Doctor } from '@/services/client/doctor/doctor.api';
import { PatientApi } from '@/services/client/patient/patient.api';
import PaymentFooter from './payment-footer';
import { useIndexedCacheValueOrFetch } from '@/store';

export default function ReviewAndPay() {
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const appointment = form.watch('appointment');

  const patient = useIndexedCacheValueOrFetch('patientById', appointment.patientId, {
    queryKey: ['patient', appointment.patientId],
    queryFn: () => PatientApi.getById(appointment.patientId),
  });
  const doctor = useIndexedCacheValueOrFetch('doctorById', appointment.doctorId, {
    queryKey: ['doctor', appointment.doctorId],
    queryFn: () => Doctor.getById(appointment.doctorId),
  });

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Review and Pay"
          description="Please review the details of your appointment and pay to confirm your appointment"
        />
      }
      footer={<PaymentFooter />}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-full flex items-center gap-2">
          <Divider className="flex-1" />
          <p className="text-default-500 text-small text-center">Patient Details</p>
          <Divider className="flex-1" />
        </div>
        <CellRenderer
          icon="solar:user-bold-duotone"
          label="Name"
          value={patient?.name ?? '-'}
          classNames={{
            icon: 'text-blue-500 bg-blue-100',
          }}
        />
        <CellRenderer
          icon="solar:phone-bold-duotone"
          label="Phone Number"
          value={patient?.phone ?? '-'}
          classNames={{
            icon: 'text-cyan-500 bg-cyan-100',
          }}
        />
        <CellRenderer
          icon="solar:calendar-bold-duotone"
          label="Age"
          value={patient?.age ? `${patient.age} ${patient.age === 1 ? 'year' : 'years'}` : '-'}
          classNames={{
            icon: 'text-red-500 bg-red-100',
          }}
        />
        <CellRenderer
          icon="solar:users-group-rounded-bold-duotone"
          label="Gender"
          value={patient?.gender ? `${patient.gender.toLowerCase()}` : '-'}
          classNames={{
            icon: 'text-green-500 bg-green-100',
          }}
        />

        <div className="col-span-full flex items-center gap-2">
          <Divider className="flex-1" />
          <p className="text-default-500 text-small text-center">Doctor Details</p>
          <Divider className="flex-1" />
        </div>
        <CellRenderer
          icon="solar:stethoscope-bold-duotone"
          label="Doctor's Name"
          value={doctor?.name ?? '-'}
          classNames={{
            icon: 'text-primary-500 bg-primary-100',
          }}
        />

        <CellRenderer
          icon="solar:calendar-bold-duotone"
          label="Appointment Date"
          value={
            appointment.appointmentDate
              ? format(appointment.appointmentDate, 'EE, MMMM d, yyyy')
              : '-'
          }
          classNames={{
            icon: 'text-purple-500 bg-purple-100',
          }}
        />

        <div className="col-span-full flex items-center gap-2">
          <Divider className="flex-1" />
          <p className="text-default-500 text-small text-center">Additional Details</p>
          <Divider className="flex-1" />
        </div>
        <CellRenderer
          icon="solar:notes-bold-duotone"
          label="Notes"
          value={appointment.notes ?? '-'}
          classNames={{
            icon: 'text-amber-500 bg-amber-100',
          }}
        />
      </div>
    </CreateAppointmentContentContainer>
  );
}
