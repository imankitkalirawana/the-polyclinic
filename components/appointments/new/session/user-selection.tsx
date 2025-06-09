'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  cn,
  Image,
  Input,
  Link,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';

import { useForm } from './context';
import { LoadingUsers } from './loading-user';

import NoResults from '@/components/ui/no-results';
import {
  getAllPatients,
  getAllPatientsWithEmail,
} from '@/functions/server-actions/users';
import { useDebounce } from 'react-haiku';
import { UserRole, UserType } from '@/models/User';
import UsersList from '@/components/ui/appointments/users-list';

export default function UserSelection() {
  const { formik, session } = useForm();

  const [query, setQuery] = useState('');
  const debounce = useDebounce(query, 500);

  const fetchFunctionMap: Record<string, () => Promise<UserType[]>> = {
    user: () => getAllPatientsWithEmail(session?.user?.email),
    receptionist: () => getAllPatients(),
    admin: () => getAllPatients(),
  };

  const { data: users, isLoading } = useQuery<UserType[]>({
    queryKey: ['user', session?.user?.uid],
    queryFn: fetchFunctionMap[session?.user?.role as UserRole],
    refetchOnWindowFocus: false,
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      if (query === '') return true;
      return (
        user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        user?.email?.toLowerCase().includes(query.toLowerCase()) ||
        user?.phone?.toLowerCase().includes(query.toLowerCase()) ||
        user.uid.toString().includes(query.toLowerCase())
      );
    });
  }, [debounce, users]);

  return (
    <>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            <LoadingUsers />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <UsersList
              id="patient"
              users={users ?? []}
              size="sm"
              selectedUser={formik.values.patient}
              onSelectionChange={(user) => {
                formik.setFieldValue('patient', user);
              }}
            />
            {!isLoading && session.user.role === 'user' && (
              <div>
                Patient not shown?{' '}
                <Link href="#">
                  Register <Icon icon="tabler:chevron-right" />
                </Link>
              </div>
            )}
            <div className="mt-4">
              <Button
                color="primary"
                radius="lg"
                className="w-full xs:w-fit"
                endContent={<Icon icon="tabler:chevron-right" />}
                onPress={() => formik.setFieldValue('step', 2)}
                isDisabled={!formik.values.patient?.uid}
                variant={formik.values.patient ? 'solid' : 'flat'}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function UserSelectionTitle() {
  const { formik, session } = useForm();

  return formik.values.patient && formik.values.step > 1 ? (
    <div className="flex items-center gap-4">
      <div>
        <Image
          src="/assets/placeholder-avatar.jpeg"
          alt="User"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <div>
        <h2 className="text-large font-semibold">
          {formik.values.patient?.name}
        </h2>
        <p>{formik.values.patient?.email}</p>
        <Link
          className="hover:underline"
          href="#"
          onPress={() => {
            formik.setFieldValue('step', 1);
          }}
        >
          Change <Icon icon="tabler:chevron-right" />
        </Link>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">
        Please select for whom you want to book an appointment?
      </h3>
      {session?.user?.role === 'user' && (
        <p>
          You have following patients associated with{' '}
          <strong>{session?.user?.email || '-'}</strong>
        </p>
      )}
    </div>
  );
}
