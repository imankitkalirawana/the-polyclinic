'use client';

import { getAllPatients, getUserWithUID } from '@/functions/server-actions';
import { UserType } from '@/models/User';
import { motion } from 'framer-motion';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input
} from '@nextui-org/react';
import { parseAsInteger, useQueryState } from 'nuqs';
import React, { useEffect, useMemo } from 'react';
import PatientProfile from './patient-profile';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react/dist/iconify.js';
import { humanReadableDate } from '@/lib/utility';
import { cn } from '@/lib/utils';
import DateTimePicker from './date-time-picker';

export default function PatientSelection() {
  const [uid, setUIDParam] = useQueryState('uid');
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllPatients();
        setUsers(users);
        setUIDParam(users[0].uid.toString());
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const {
    data: user,
    isError,
    isLoading
  } = useQuery<UserType>({
    queryKey: ['user', uid],
    queryFn: () => {
      if (!uid) {
        console.error('Invalid UID');
        return Promise.reject('Invalid UID');
      }
      return getUserWithUID(parseInt(uid));
    },
    enabled: !!uid
  });

  if (isError) {
    return <p>Error fetching user data</p>;
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 sm:items-start md:flex-row',
        {
          'flex-col sm:flex-row': step === 1
        }
      )}
    >
      {step === 0 && (
        <div
          className={cn('flex flex-col gap-2', {
            'md:max-w-[240px]': user,
            'w-full': !user
          })}
        >
          <div className="mb-4 flex max-w-sm flex-col gap-4">
            <h2>Patients</h2>
            <Input
              placeholder="Search by UID, Name, Email and Phone"
              endContent={
                <Button isIconOnly variant="light">
                  <Icon icon="tabler:search" width="24" height="24" />
                </Button>
              }
            />
          </div>
          <div
            className={cn(
              'no-scrollbar grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 overflow-scroll transition-all',
              {
                'flex md:flex-col': user
              }
            )}
          >
            {users.map((user) => (
              <Card
                isHoverable
                isPressable
                key={user.uid}
                className={cn(
                  'flex flex-row justify-between rounded-2xl border p-3 shadow-none transition-all',
                  {
                    'border-primary-400': user.uid.toString() === uid,
                    'min-w-[200px]': user
                  }
                )}
                onPress={() => {
                  if (uid == user.uid.toString()) {
                    setUIDParam(null);
                  } else {
                    setUIDParam(user.uid.toString());
                  }
                }}
              >
                <div className="flex max-w-[75%] flex-col items-start justify-between gap-4 overflow-hidden">
                  <div className="flex flex-col items-start">
                    <h3 className="line-clamp-1">{user.name}</h3>
                    <p
                      title={user.email}
                      className="line-clamp-1 text-sm text-default-500"
                    >
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm text-default-500">
                    <p>{humanReadableDate(user.createdAt)}</p>
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
            ))}
          </div>
        </div>
      )}
      {user && <PatientProfile user={user} />}
      {step === 1 && <DateTimePicker />}
    </div>
  );
}
