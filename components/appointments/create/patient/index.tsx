'use client';

import React, { useMemo, useState } from 'react';

import { Avatar, Button, Card, Input, Kbd, ScrollShadow } from '@heroui/react';
import { cn } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import { CreateAppointmentPatientDetails } from './details';

import Skeleton from '@/components/ui/skeleton';
import { isSearchMatch } from '@/lib/utils';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useAllPatients } from '@/services/patient';

function PatientsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
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
  const { data: patients, isLoading: isPatientsLoading } = useAllPatients();
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

  useKeyPress(
    ['Enter'],
    () => {
      if (appointment.patient) {
        formik.setFieldValue('meta.currentStep', 1);
      }
    },
    {
      capture: true,
    }
  );

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
          endContent={<Kbd keys={['enter']} className="bg-transparent" />}
        >
          Next
        </Button>
      }
      endContent={!!patient && <CreateAppointmentPatientDetails user={patient} />}
    >
      <div className={cn('flex h-full w-full flex-col', className)}>
        {isPatientsLoading ? (
          <PatientsSkeleton />
        ) : (
          <>
            {/* Search input - fixed at top */}
            <div className="mb-4 flex-shrink-0">
              <Input
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                radius="full"
                variant="bordered"
              />
            </div>

            {/* Scrollable patients list */}
            <div className="min-h-0 flex-1">
              {!!filteredPatients && filteredPatients?.length > 0 ? (
                <ScrollShadow className="h-full pr-3">
                  <div className="flex flex-col gap-2">
                    {filteredPatients.map((patient) => (
                      <Card
                        isPressable
                        key={patient.uid}
                        className={cn(
                          'flex h-full min-h-16 flex-row items-center justify-start gap-4 border-2 border-divider px-4 py-4 shadow-none',
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
                  </div>
                </ScrollShadow>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-default-500">No patients found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </CreateAppointmentContentContainer>
  );
};

export default PatientSelection;
