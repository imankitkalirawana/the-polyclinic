'use client';

import React, { useEffect, useState } from 'react';
import { Button, Kbd } from '@heroui/react';
import { cn } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import { CreateAppointmentPatientDetails } from './details';

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
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: allPatients, isLoading, isError, error } = useAllPatients();

  const { appointment } = formik.values;

  const handlePatientSelect = (patientId: string) => {
    formik.setFieldValue('appointment.patientId', patientId);
  };

  const handleNext = () => {
    formik.setFieldValue('meta.currentStep', 1);
  };

  const canProceed = !!appointment.patientId;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const wrapper = document.querySelector('.patient-search-wrapper');
      if (wrapper && active && wrapper.contains(active)) {
        if (/^[sdwmytTSDWMY]$/.test(e.key)) {
          e.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener('keydown', handler, true); // capture
    return () => window.removeEventListener('keydown', handler, true);
  }, []);

  useKeyPress(
    ['Enter'],
    () => {
      if (canProceed && !formik.values.meta.createNewPatient) {
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
            onPress={() => formik.setFieldValue('meta.createNewPatient', true)}
          >
            Create New Patient
          </Button>
        </>
      }
      endContent={<CreateAppointmentPatientDetails uid={appointment.patientId ?? ''} />}
    >
      <div className={cn('flex h-full w-full flex-col', className)}>
        <div className="patient-search-wrapper">
          <SearchInput
            key="patient-search-input"
            value={search}
            placeholder="Search by name, email, phone, or UID"
            onChange={setSearch}
          />
        </div>
        {renderContent()}
      </div>
    </CreateAppointmentContentContainer>
  );
};

export default PatientSelection;
