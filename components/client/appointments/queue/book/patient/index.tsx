import {
  addToast,
  Button,
  Card,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
} from '@/components/client/appointments/(common)';
import { PatientType, useAllPatients } from '@/services/client/patient';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { Icon } from '@iconify/react/dist/iconify.js';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import NewPatient from './new-patient';

export default function PatientSelection() {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data: patients } = useAllPatients(debouncedSearch);
  const form = useFormContext<CreateAppointmentQueueFormValues>();

  const patientId = form.watch('appointment.patientId');

  const handleNext = () => {
    if (!patientId) {
      addToast({
        title: 'Patient not selected',
        description: 'Please select a patient to proceed',
        color: 'danger',
      });
      return;
    }
    form.setValue('meta.currentStep', 1);
  };

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Patient Selection"
          description="Select the patient for whom you want to book the appointment"
        />
      }
      footer={
        <>
          <Button
            variant="shadow"
            color="primary"
            radius="full"
            onPress={handleNext}
            isDisabled={!patientId}
            // endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          >
            Next
          </Button>
          <Button
            variant="light"
            color="primary"
            radius="full"
            onPress={() => form.setValue('meta.createNewPatient', true)}
          >
            Create New Patient
          </Button>
        </>
      }
    >
      <div>
        <SearchInput
          value={search}
          placeholder="Search by name, phone or email"
          onChange={(value) => {
            setSearch(value);
            form.setValue('appointment.patientId', '');
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {patients?.map((patient, index) => (
          <PatientCard
            key={index}
            patient={patient}
            isSelected={patientId === patient.id}
            onSelect={(id) => form.setValue('appointment.patientId', id)}
          />
        ))}
      </div>
      {form.watch('meta.createNewPatient') && (
        <NewPatient
          onClose={() => form.setValue('meta.createNewPatient', false)}
          onSuccess={(id) => {
            form.setValue('appointment.patientId', id);
            form.setValue('meta.createNewPatient', false);
            form.setValue('meta.currentStep', 1);
          }}
        />
      )}
    </CreateAppointmentContentContainer>
  );
}

const PatientCard = ({
  patient,
  isSelected,
  onSelect,
}: {
  patient: PatientType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <Card
      isPressable
      className={cn(
        'flex w-full flex-row items-center justify-between gap-4 border-2 border-divider px-4 py-4 shadow-none',
        {
          'border-primary': isSelected,
        }
      )}
      onPress={() => onSelect(patient.id)}
    >
      <RenderUser name={patient.name} description={patient.phone || patient.email} />
      <div>
        <Dropdown aria-label="Patient actions" placement="bottom-end">
          <DropdownTrigger>
            <Button size="sm" isIconOnly variant="light" radius="full">
              <Icon icon="solar:menu-dots-bold-duotone" className="rotate-90" width={18} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="view">View</DropdownItem>
            <DropdownItem color="warning" key="edit">
              Edit
            </DropdownItem>
            <DropdownItem color="danger" key="delete">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>
  );
};
