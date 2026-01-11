'use client';

import React, { useState, useMemo } from 'react';
import { Button, Kbd } from '@heroui/react';
import { cn } from '@heroui/react';
import Fuse from 'fuse.js';

import { CreateAppointmentPatientDetails } from './details';
import { useCreateAppointmentForm } from '../index';

import { useKeyPress } from '@/hooks/useKeyPress';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
  SelectionList,
} from '@/components/dashboard/appointments/(common)';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllPatients } from '@/services/client/patient';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

const PatientSelection = ({ className }: { className?: string }) => {
  const { watch, setValue } = useCreateAppointmentForm();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: allPatients, isLoading, isError, error } = useAllPatients();

  const patientId = watch('appointment.patientId');
  const createNewPatient = watch('meta.createNewPatient');

  const fuse = useMemo(() => {
    if (!allPatients) return null;
    return new Fuse(allPatients, {
      keys: ['name', 'email', 'phone', 'id'],
      threshold: 0.3,
    });
  }, [allPatients]);

  const filteredPatients = useMemo(() => {
    if (!allPatients) return [];
    if (!debouncedSearch.trim() || !fuse) return allPatients;

    return fuse.search(debouncedSearch).map((result) => result.item);
  }, [allPatients, debouncedSearch, fuse]);

  const handlePatientSelect = (id: string) => {
    setValue('appointment.patientId', id);
  };

  const handleNext = () => {
    setValue('meta.currentStep', 1);
  };

  const canProceed = !!patientId;

  useKeyPress(
    ['Enter'],
    () => {
      if (canProceed && !createNewPatient) {
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
            filteredPatients?.map((patient) => ({
              id: patient.id,
              image: patient.image,
              title: patient.name,
              subtitle: patient.email,
            })) ?? []
          }
          selectedId={patientId}
          onSelect={handlePatientSelect}
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
            onPress={() => setValue('meta.createNewPatient', true)}
          >
            Create New Patient
          </Button>
        </>
      }
      endContent={<CreateAppointmentPatientDetails id={patientId ?? ''} />}
    >
      <div className={cn('flex h-full w-full flex-col', className)}>
        <SearchInput
          key="patient-search-input"
          value={search}
          placeholder="Search by name, email, phone, or ID"
          onChange={setSearch}
        />
        {renderContent()}
      </div>
    </CreateAppointmentContentContainer>
  );
};

export default PatientSelection;
