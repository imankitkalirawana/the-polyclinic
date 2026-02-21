import {
  addToast,
  Button,
  Card,
  Chip,
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
import { useAllPatients } from '@/services/client/patient';
import { useCacheStore } from '@/store';
import { useFormContext } from 'react-hook-form';
import Modal from '@/components/ui/modal';
import ViewPatientBody from '@/components/ui/modal/view-modal';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { Icon } from '@iconify/react/dist/iconify.js';
import { BookQueueSteps } from '@/components/dashboard/appointments/create/data';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import EditPatientModal from './edit-patient';
import { formatAge, formatGender } from '@repo/store';
import { Patient } from '@repo/store';

export default function PatientSelection() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: patients, isLoading, isRefetching } = useAllPatients(debouncedSearch);
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const setIndexedCache = useCacheStore((state) => state.setIndexedCache);

  const patientId = form.watch('appointment.patientId');

  // Cache the selected patient when patientId changes
  const handlePatientSelect = (id: string) => {
    form.setValue('appointment.patientId', id);
    // Find and cache the selected patient for later use in ReviewAndPay
    const patient = patients?.find((p) => p.id === id);
    if (patient) {
      setIndexedCache('patientById', id, patient);
    }
  };

  const handleNext = () => {
    if (!patientId) {
      addToast({
        title: 'Patient not selected',
        description: 'Please select a patient to proceed',
        color: 'danger',
      });
      return;
    }
    form.setValue('meta.currentStep', BookQueueSteps.DOCTOR_SELECTION);
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
            onSelect={handlePatientSelect}
            onView={setSelectedPatient}
            onEdit={(patientRecord) => {
              setPatientToEdit(patientRecord);
            }}
          />
        ))}
      </div>
      {/* {form.watch('meta.createNewPatient') && (
        <NewPatient
          onClose={() => form.setValue('meta.createNewPatient', false)}
          onSuccess={(id) => {
            form.setValue('appointment.patientId', id);
            form.setValue('meta.createNewPatient', false);
            form.setValue('meta.currentStep', BookQueueSteps.DOCTOR_DATE_SELECTION);
          }}
        />
      )} */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        size="3xl"
        title="Patient Details"
        body={<ViewPatientBody patient={selectedPatient as Patient} />}
        hideCancelButton
      />
      {patientToEdit && (
        <EditPatientModal
          patient={patientToEdit}
          isOpen={!!patientToEdit}
          onClose={() => setPatientToEdit(null)}
        />
      )}
    </CreateAppointmentContentContainer>
  );
}

const PatientCard = ({
  patient,
  isSelected,
  onSelect,
  onView,
  onEdit,
}: {
  patient: Patient;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
}) => {
  return (
    <Card
      isPressable
      className={cn(
        'border-divider flex w-full flex-row items-center justify-between gap-4 border-2 px-4 py-4 shadow-none',
        {
          'border-primary': isSelected,
        }
      )}
      onPress={() => onSelect(patient.id)}
    >
      <RenderUser
        name={patient.name}
        description={
          <div className="flex gap-1">
            <Chip title={patient.phone || patient.email} size="sm" color="primary" variant="flat">
              <span className="block max-w-24 truncate">{patient.phone || patient.email}</span>
            </Chip>
            {patient.age && (
              <Chip
                title={formatAge(patient.age, { fullString: true })}
                size="sm"
                color="warning"
                variant="flat"
              >
                <span className="block max-w-24 truncate">{formatAge(patient.age)}</span>
              </Chip>
            )}
            {patient.gender && (
              <Chip
                title={formatGender(patient.gender, { fullString: true })}
                size="sm"
                variant="flat"
                className="bg-blue-50 text-blue-700"
              >
                <span className="block max-w-24 truncate">
                  {formatGender(patient.gender, { fullString: true })}
                </span>
              </Chip>
            )}
          </div>
        }
      />
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
            <DropdownItem color="warning" key="edit" onPress={() => onEdit?.(patient)}>
              Edit
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>
  );
};
