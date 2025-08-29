'use client';

import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Button, Kbd, Spinner } from '@heroui/react';
import { cn } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import { CreateAppointmentPatientDetails } from './details';

import { useKeyPress } from '@/hooks/useKeyPress';
import { usePatientsInfiniteQuery } from '@/hooks/queries/client/patient';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
  SelectionList,
  SelectionSkeleton,
} from '../ui';
import { useDebounce } from '@/hooks/useDebounce';

const PatientSelection = ({ className }: { className?: string }) => {
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const queryResult = usePatientsInfiniteQuery(debouncedSearch);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error } =
    queryResult;

  const allPatients = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data?.pages]);

  const { appointment } = formik.values;

  const handlePatientSelect = (patientId: string) => {
    formik.setFieldValue('appointment.patient', patientId);
  };

  const handleNext = () => {
    formik.setFieldValue('meta.currentStep', 1);
  };

  const canProceed = !!appointment.patientId;

  useKeyPress(
    ['Enter'],
    () => {
      if (canProceed && !formik.values.meta.createNewPatient) {
        handleNext();
      }
    },
    { capture: true }
  );

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPatientRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const renderContent = () => {
    if (isLoading) {
      return <SelectionSkeleton className="flex flex-col gap-2" />;
    }

    if (isError) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          <p className="mb-2 text-danger">Failed to load patients</p>
          <p className="text-sm text-default-500">{error?.message}</p>
        </div>
      );
    }

    const patientItems = allPatients.map((patient, index) => ({
      id: patient.uid,
      image: patient.image,
      title: patient.name,
      subtitle: patient.email,
      ref: index === allPatients.length - 1 ? lastPatientRef : undefined,
    }));

    return (
      <div className="min-h-0 flex-1">
        <SelectionList
          items={patientItems}
          selectedId={appointment.patientId}
          onSelect={handlePatientSelect}
          emptyMessage={
            debouncedSearch.trim()
              ? `No patients found for "${debouncedSearch}"`
              : 'No patients found'
          }
          containerClassName="h-full"
        />
        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <Spinner size="sm" />
          </div>
        )}
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
            endContent={<Kbd keys={['enter']} className="bg-transparent" />}
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
