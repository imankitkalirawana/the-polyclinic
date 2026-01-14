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
} from '@/components/dashboard/appointments/(common)';
import { PatientType, useAllPatients } from '@/services/client/patient';
import { useFormContext } from 'react-hook-form';
import Modal from '@/components/ui/modal';
import ViewPatientBody from '@/components/ui/modal/view-modal';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { Icon } from '@iconify/react/dist/iconify.js';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import NewPatient from './new-patient';
// import { useDeleteUser } from '@/services/common/user/user.query';

export default function PatientSelection() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: patients, isLoading, isRefetching } = useAllPatients(debouncedSearch);
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
          isLoading={isLoading || isRefetching}
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
            onView={setSelectedPatient}
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
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        size="4xl"
        title="Patient Details"
        body={<ViewPatientBody patient={selectedPatient as PatientType} />}
        hideCancelButton
      />
    </CreateAppointmentContentContainer>
  );
}

const PatientCard = ({
  patient,
  isSelected,
  onSelect,
  onView,
  onDelete,
}: {
  patient: PatientType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView?: (patient: PatientType) => void;
  onDelete?: (patient: PatientType) => void;
}) => {
  return (
    <>
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
              <DropdownItem key="view" onPress={() => onView?.(patient)}>
                View
              </DropdownItem>

              <DropdownItem color="warning" key="edit">
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                onClick={() => onDelete?.(patient)}
                className="text-danger"
                color="danger"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Card>
    </>
  );
};
