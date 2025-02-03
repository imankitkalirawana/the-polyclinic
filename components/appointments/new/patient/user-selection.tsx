'use client';

import {
  Card,
  CardBody,
  cn,
  ScrollShadow,
  Image,
  Link,
  Button,
  Input
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { UserType } from '@/models/User';
import { getAllPatientsWithEmail } from '@/functions/server-actions/user';
import {
  removeSelectedUser,
  setSelectedUser
} from '@/store/slices/appointment-slice';
import NoResults from '@/components/ui/no-results';
import { LoadingUsers } from './loading-user';

export default function UserSelection({
  session,
  onConfirm
}: {
  session?: any;
  onConfirm: () => void;
}) {
  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);
  const [query, setQuery] = useState('');
  const debounce = useDebounce(query, 500);

  const { data: users, isLoading } = useQuery<UserType[]>({
    queryKey: ['userwithemail', session?.user?.email],
    queryFn: () => getAllPatientsWithEmail(session?.user?.email),
    enabled: !!session?.user?.email
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
            <div className="xs:max-w-sm">
              <Input
                placeholder="Search for a user"
                // icon={<Icon icon="tabler:search" />}
                className="w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {filteredUsers.length < 1 ? (
              <div className="flex justify-center">
                <NoResults message="No User Found" />
              </div>
            ) : (
              <>
                <ScrollShadow
                  orientation="horizontal"
                  className="mt-8 flex gap-4"
                >
                  {filteredUsers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((user) => (
                      <Card
                        isPressable
                        key={user.uid}
                        className={cn(
                          'no-scrollbar min-w-80 rounded-xl border border-divider shadow-none',
                          {
                            'border-2 border-primary-400':
                              user.uid === appointment.user?.uid
                          }
                        )}
                        onPress={() => {
                          //   setSelectedKeys(new Set(['time-selection']));
                          dispatch(
                            setSelectedUser({
                              ...user,
                              createdAt: '',
                              updatedAt: ''
                            })
                          );
                        }}
                      >
                        <CardBody className="items-center gap-4 p-8">
                          <div>
                            <Image
                              src="/assets/placeholder-avatar.jpeg"
                              alt="User"
                              width={80}
                              height={80}
                              className="rounded-full"
                              isBlurred
                            />
                          </div>
                          <div>
                            <h2 className="text-center text-lg font-semibold">
                              {user.name}
                            </h2>
                            <p className="text-sm font-light text-default-500">
                              {user.email}
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                </ScrollShadow>

                {!isLoading && (
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
                    className="w-full max-w-64 xs:w-fit"
                    endContent={<Icon icon="tabler:chevron-right" />}
                    onPress={onConfirm}
                    isDisabled={!appointment.user}
                    variant={appointment.user ? 'solid' : 'flat'}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function UserSelectionTitle({
  setSelectedKeys,
  selectedKeys,
  session
}: {
  setSelectedKeys: any;
  selectedKeys: Set<string>;
  session: any;
}) {
  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);

  return appointment.user && !selectedKeys.has('user-selection') ? (
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
        <h2 className="text-lg font-semibold">{appointment.user.name}</h2>
        <p>{appointment.user.email}</p>
        <Link
          className="hover:underline"
          href="#"
          onPress={() => {
            setSelectedKeys(new Set(['user-selection']));
            dispatch(removeSelectedUser());
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
      <p>
        You have following patients associated with{' '}
        <strong>{session?.user?.email || '-'}</strong>
      </p>
    </div>
  );
}
