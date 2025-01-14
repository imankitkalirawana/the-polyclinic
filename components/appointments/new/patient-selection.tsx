'use client';

import { getAllPatients, getUserWithUID } from '@/functions/server-actions';
import { UserType } from '@/models/User';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import React, { useEffect } from 'react';
import PatientProfile from './patient-profile';
import { useQuery } from '@tanstack/react-query';

export default function PatientSelection() {
  const [uid, setUIDParam] = useQueryState('uid');
  const [users, setUsers] = React.useState<UserType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllPatients();
        setUsers(users);
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
    <div className="flex w-full flex-col gap-4">
      <Autocomplete
        defaultItems={users}
        label="Choose Patient"
        className="max-w-md"
        placeholder="Search for a patient"
        showScrollIndicators={false}
        onSelectionChange={(value) => {
          setUIDParam(value ? value.toString() : '');
        }}
        isLoading={isLoading}
        selectedKey={user ? user.uid.toString() : ''}
      >
        {(user) => (
          <AutocompleteItem key={user.uid}>{user?.name}</AutocompleteItem>
        )}
      </Autocomplete>
      {user && <PatientProfile user={user} />}
    </div>
  );
}
