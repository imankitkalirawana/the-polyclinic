import { Button, Divider } from '@heroui/react';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
} from '../../../(common)';
import { useFormContext } from 'react-hook-form';
import { CellRenderer } from '@/components/ui/cell-renderer';
import { useDoctorById } from '@/services/client/doctor/query';
import { usePatientById } from '@/services/client/patient/query';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/types';

export default function AppointmentSummary() {
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const appointment = form.watch('appointment');

  const { data: doctor } = useDoctorById(appointment.doctorId);
  const { data: patient } = usePatientById(appointment.patientId);

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Appointment Summary"
          description="Please review the details of your appointment"
        />
      }
      footer={
        <>
          <Button
            variant="shadow"
            color="primary"
            radius="full"
            onPress={() => form.setValue('meta.currentStep', 4)}
            // endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          >
            Next
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-full flex items-center gap-2">
          <Divider className="flex-1" />
          <p className="text-center text-default-500 text-small">Patient Details</p>
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
          <p className="text-center text-default-500 text-small">Doctor Details</p>
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

        <div className="col-span-full flex items-center gap-2">
          <Divider className="flex-1" />
          <p className="text-center text-default-500 text-small">Additional Details</p>
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
