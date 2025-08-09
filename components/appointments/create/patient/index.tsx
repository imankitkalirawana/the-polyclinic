'use client';

import React, { useMemo, useState } from 'react';
import { Avatar, Button, Card, Input, ScrollShadow } from '@heroui/react';
import { cn } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import { CreateAppointmentPatientDetails } from './details';

import Skeleton from '@/components/ui/skeleton';
import { isSearchMatch } from '@/lib/utils';
import { useLinkedUsers } from '@/services/user';

function PatientsSkeleton() {
  return (
    <div className="col-span-full flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center gap-4 rounded-large border border-divider p-4 py-2"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

const PatientSelection = ({ className }: { className?: string }) => {
  const { data: patients, isLoading: isPatientsLoading } = useLinkedUsers();
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const [search, setSearch] = useState('');

  const { appointment } = formik.values;

  const filteredPatients = useMemo(() => {
    return patients?.filter(
      (patient) =>
        isSearchMatch(patient.name, search) ||
        isSearchMatch(patient.email, search) ||
        isSearchMatch(patient.phone, search) ||
        isSearchMatch(patient.uid.toString(), search)
    );
  }, [patients, search]);

  const patient = useMemo(() => {
    return patients?.find((p) => p.uid === appointment.patient);
  }, [patients, appointment.patient]);

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
          onPress={() => formik.setFieldValue('meta.currentStep', 1)}
          isDisabled={!appointment.patient}
          isLoading={isPatientsLoading}
        >
          Next
        </Button>
      }
      endContent={!!patient && <CreateAppointmentPatientDetails user={patient} />}
    >
      <div className={cn('grid w-full grid-cols-12 flex-col', className)}>
        {isPatientsLoading ? (
          <PatientsSkeleton />
        ) : !!filteredPatients && filteredPatients?.length > 0 ? (
          <>
            <Input
              placeholder="Search for a patient"
              radius="lg"
              className="col-span-12 mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ScrollShadow className="col-span-12 flex max-h-80 flex-col gap-4 pr-3">
              {filteredPatients?.map((patient) => (
                <Card
                  isPressable
                  key={patient.uid}
                  className={cn(
                    'flex flex-row items-center justify-start gap-4 border-2 border-divider px-4 py-4 shadow-none',
                    {
                      'border-primary': appointment.patient === patient.uid,
                    }
                  )}
                  onPress={() => formik.setFieldValue('appointment.patient', patient.uid)}
                >
                  <Avatar src={patient.image} />
                  <div className="flex flex-col items-start gap-0">
                    <h4 className="text-small">{patient.name}</h4>
                    <p className="text-sm text-default-500">{patient.email}</p>
                  </div>
                </Card>
              ))}
            </ScrollShadow>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-sm text-default-500">No patients found</p>
          </div>
        )}
      </div>
    </CreateAppointmentContentContainer>
  );
};

export default PatientSelection;
