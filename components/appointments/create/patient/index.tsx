'use client';

import React, { useMemo, useState } from 'react';
import { Avatar, Button, Card, Input, ScrollShadow } from '@heroui/react';
import { cn } from '@heroui/react';

import { useAppointmentDate, useCreateAppointment } from '../hooks';

import { useLinkedUsers } from '@/services/user';

const PatientSelection = ({ className }: { className?: string }) => {
  const { data: patients } = useLinkedUsers();
  const { formik } = useCreateAppointment();
  const { setCurrentStep } = useAppointmentDate();
  const [search, setSearch] = useState('');

  const filteredPatients = useMemo(() => {
    return patients?.filter(
      (patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone.toLowerCase().includes(search.toLowerCase()) ||
        patient.uid.toString().includes(search)
    );
  }, [patients, search]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-3xl font-bold leading-9 text-default-foreground">
          Patient Selection
        </div>
        <div className="text-center leading-5 text-default-500">
          Select the patient for whom you want to book the appointment
        </div>
      </div>
      <form className={cn('grid w-full grid-cols-12 flex-col py-8', className)}>
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
                  'border-primary': formik.values.patient === patient.uid,
                }
              )}
              onPress={() => formik.setFieldValue('patient', patient.uid)}
            >
              <Avatar src={patient.image} />
              <div className="flex flex-col items-start gap-0">
                <h4 className="text-small">{patient.name}</h4>
                <p className="text-sm text-default-500">{patient.email}</p>
              </div>
            </Card>
          ))}
        </ScrollShadow>
        <Button
          className="col-span-12 mt-4"
          size="lg"
          variant="shadow"
          color="primary"
          onPress={() => setCurrentStep(1)}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default PatientSelection;
