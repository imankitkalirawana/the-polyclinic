'use client';

import React, { useMemo, useState } from 'react';
import { Button, Kbd } from '@heroui/react';
import { cn } from '@heroui/react';
import { useFormikContext } from 'formik';
import Fuse from 'fuse.js';

import { CreateAppointmentFormValues } from '../types';
import { CreateAppointmentPatientDetails } from './details';

import { useKeyPress } from '@/hooks/useKeyPress';
import { useAllPatients } from '@/services/patient';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
  SelectionList,
  SelectionSkeleton,
} from '../ui';

const PatientSelection = ({ className }: { className?: string }) => {
  const { data: patients, isLoading: isPatientsLoading } = useAllPatients();
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const [search, setSearch] = useState('');

  const fuse = useMemo(() => {
    if (!patients) return null;
    return new Fuse(patients, {
      keys: ['name', 'email', 'phone', 'uid'],
      threshold: 0.3,
    });
  }, [patients]);

  const { appointment } = formik.values;

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    if (!search.trim() || !fuse) return patients;

    return fuse.search(search).map((result) => result.item);
  }, [patients, search, fuse]);

  const selectedPatient = useMemo(() => {
    return patients?.find((p) => p.uid === appointment.patient);
  }, [patients, appointment.patient]);

  const handlePatientSelect = (patientId: string | number) => {
    formik.setFieldValue('appointment.patient', Number(patientId));
  };

  const handleNext = () => {
    formik.setFieldValue('meta.currentStep', 1);
  };

  const canProceed = !!appointment.patient;

  useKeyPress(
    ['Enter'],
    () => {
      if (canProceed) {
        handleNext();
      }
    },
    { capture: true }
  );

  const renderContent = () => {
    if (isPatientsLoading) {
      return <SelectionSkeleton className="flex flex-col gap-2" />;
    }

    const patientItems = filteredPatients.map((patient) => ({
      id: patient.uid,
      image: patient.image,
      title: patient.name,
      subtitle: patient.email,
    }));

    return (
      <>
        <SearchInput
          value={search}
          placeholder="Search by name, email, phone or UID"
          onChange={setSearch}
        />
        <div className="min-h-0 flex-1">
          <SelectionList
            items={patientItems}
            selectedId={appointment.patient}
            onSelect={handlePatientSelect}
            emptyMessage="No patients found"
            containerClassName="h-full"
          />
        </div>
      </>
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
        <Button
          variant="shadow"
          color="primary"
          radius="full"
          onPress={handleNext}
          isDisabled={!canProceed}
          endContent={<Kbd keys={['enter']} className="bg-transparent" />}
        >
          Next
        </Button>
      }
      endContent={selectedPatient && <CreateAppointmentPatientDetails user={selectedPatient} />}
    >
      <div className={cn('flex h-full w-full flex-col', className)}>{renderContent()}</div>
    </CreateAppointmentContentContainer>
  );
};

export default PatientSelection;
