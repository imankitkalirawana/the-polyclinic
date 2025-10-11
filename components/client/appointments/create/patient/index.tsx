'use client';

import React, { useState } from 'react';
import { Button, Kbd } from '@heroui/react';
import { cn } from '@heroui/react';

import { CreateAppointmentPatientDetails } from './details';
import { useCreateAppointmentForm } from '../context';

import { useKeyPress } from '@/hooks/useKeyPress';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
  SelectionList,
} from '../ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllPatients } from '@/services/client/patient';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

const PatientSelection = ({ className }: { className?: string }) => {
  const { form, values } = useCreateAppointmentForm();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: allPatients, isLoading, isError, error } = useAllPatients();

  const { appointment } = values;

  const handlePatientSelect = (patientId: string) => {
    form.setValue('appointment.patientId', patientId);
  };

  const handleNext = () => {
    form.setValue('meta.currentStep', 1);
  };

  const canProceed = !!appointment.patientId;

  useKeyPress(
    ['Enter'],
    () => {
      if (canProceed && !values.meta.createNewPatient) {
        handleNext();
      }
    },
    { capture: true }
  );

  const renderContent = () => {
    if (isLoading) {
      return <MinimalPlaceholder message="Loading patients..." />;
    }

    if (isError) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          <p className="mb-2 text-danger">Failed to load patients</p>
          <p className="text-sm text-default-500">{error?.message}</p>
        </div>
      );
    }

    return (
      <div className="min-h-0 flex-1">
        <SelectionList
          items={
            allPatients?.map((patient) => ({
              id: patient.uid,
              image: patient.image,
              title: patient.name,
              subtitle: patient.email,
            })) ?? []
          }
          selectedId={appointment.patientId}
          onSelect={handlePatientSelect}
          emptyMessage={
            debouncedSearch.trim()
              ? `No patients found for "${debouncedSearch}"`
              : 'No patients found'
          }
          containerClassName="h-full"
        />
      </div>
    );
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
            isDisabled={!canProceed}
            endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
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
      endContent={<CreateAppointmentPatientDetails uid={appointment.patientId ?? ''} />}
    >
      <div className={cn('flex h-full w-full flex-col', className)}>
        <SearchInput
          key="patient-search-input"
          value={search}
          placeholder="Search by name, email, phone, or UID"
          onChange={setSearch}
        />
        {renderContent()}
      </div>
    </CreateAppointmentContentContainer>
  );
};

export default PatientSelection;
