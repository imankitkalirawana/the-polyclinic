'use client';

import { getAllDoctors } from '@/functions/server-actions';
import { UserType } from '@/models/User';
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input
} from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import React, { useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { humanReadableDate } from '@/lib/utility';
import { cn } from '@/lib/utils';
import NoResults from '@/components/ui/no-results';
import Skeleton from '@/components/ui/skeleton';
import { DoctorType } from '@/models/Doctor';

export default function DoctorSelection() {
  const [did, setDidParam] = useQueryState('did');
  const [doctors, setDoctors] = React.useState<DoctorType[]>([]);
  const [query, setQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctors = await getAllDoctors();
        setDoctors(doctors);
        setIsLoading(false);
        // setUIDParam(doctors[0].uid.toString());
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const FilteredDoctors = useMemo(() => {
    const filteredDoctors = doctors.filter((doctor) => {
      if (query === '') return true;
      return (
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.email.toLowerCase().includes(query.toLowerCase()) ||
        doctor.phone.toLowerCase().includes(query.toLowerCase()) ||
        doctor.uid.toString().includes(query.toLowerCase())
      );
    });
    return (
      <>
        {filteredDoctors.length === 0 ? (
          <NoResults />
        ) : (
          filteredDoctors.map((doctor) => (
            <Card
              isPressable
              isHoverable
              key={doctor.uid}
              className={cn(
                'flex flex-row justify-between rounded-2xl border p-3 shadow-none transition-all',
                {
                  'border-2 border-primary-400': doctor.uid.toString() === did,
                  'min-w-[200px]': doctor
                }
              )}
              onPress={() => {
                setDidParam(doctor.uid.toString());
              }}
            >
              <div className="flex flex-col items-start justify-between gap-4 overflow-hidden">
                <div className="flex flex-col items-start">
                  <h3 className="line-clamp-1">{doctor.name}</h3>
                  <p
                    title={doctor.email}
                    className="line-clamp-1 text-sm text-default-500"
                  >
                    {doctor.email}
                  </p>
                </div>
                <div className="text-sm text-default-500">
                  <p>{humanReadableDate(doctor.createdAt)}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <Dropdown size="sm" placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="tabler:dots" width="16" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="edit">Edit</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </Card>
          ))
        )}
      </>
    );
  }, [doctors, query, did]);

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-4 flex gap-2">
        <Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search by UID, Name, Email and Phone"
          endContent={
            <Button isIconOnly variant="light">
              <Icon icon="tabler:search" width="24" height="24" />
            </Button>
          }
          isDisabled={isLoading}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              variant="flat"
              endContent={<Icon icon="solar:sort-horizontal-outline" />}
              isIconOnly
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Sort Doctors">
            <DropdownItem key="name">By Name</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="no-scrollbar grid max-h-[70vh] grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 overflow-scroll transition-all">
        {isLoading ? <LoadingList /> : FilteredDoctors}
      </div>
    </div>
  );
}

export const LoadingList = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="flex flex-row justify-between rounded-2xl border p-3 shadow-none transition-all"
        >
          <div className="flex flex-col items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <Skeleton className="h-6 w-6" />
          </div>
        </Card>
      ))}
    </>
  );
};
