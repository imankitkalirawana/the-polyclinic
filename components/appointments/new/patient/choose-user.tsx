'use client';
import Skeleton from '@/components/ui/skeleton';
import { getAllPatientsWithEmail } from '@/functions/server-actions/user';
import { UserType } from '@/models/User';
import { Card, CardBody, Chip, Image, Link, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedUser,
  removeSelectedUser
} from '@/store/slices/appointment-slice';

export default function ChooseUser({ session }: { session?: any }) {
  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);

  const {
    data: users,
    isError,
    isLoading
  } = useQuery<UserType[]>({
    queryKey: ['userwithemail', session?.user?.email],
    queryFn: () => getAllPatientsWithEmail(session?.user?.email),
    enabled: !!session?.user?.email
  });

  return (
    <div className="border-b border-divider py-4">
      {appointment.user ? (
        <SelectedUser user={appointment.user} />
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">
              Please select for whom you want to book an appointment?
            </h3>
            <p>
              You have following patients associated with{' '}
              <strong>{session?.user?.email || '-'}</strong>
            </p>
          </div>
          <ScrollShadow orientation="horizontal" className="mt-8 flex gap-4">
            {isLoading ? (
              <LoadingUsers />
            ) : (
              users?.map((user) => (
                <Card
                  isPressable
                  key={user.uid}
                  className="no-scrollbar min-w-80 rounded-xl border border-divider shadow-none"
                  onPress={() => {
                    dispatch(
                      setSelectedUser({
                        ...user,
                        createdAt: null,
                        updatedAt: null
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
              ))
            )}
          </ScrollShadow>
          {!isLoading && (
            <div>
              Patient not shown?{' '}
              <Link href="#">
                Register <Icon icon="tabler:chevron-right" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SelectedUser({ user }: { user: UserType }) {
  const dispatch = useDispatch();
  return (
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
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p>{user.email}</p>
        <Link
          className="hover:underline"
          href="#"
          onPress={() => {
            dispatch(removeSelectedUser());
          }}
        >
          Change <Icon icon="tabler:chevron-right" />
        </Link>
      </div>
    </div>
  );
}

const LoadingUsers = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="flex min-w-80 flex-row justify-between rounded-2xl border border-divider p-3 shadow-none transition-all"
        >
          <CardBody className="items-center gap-2 p-8">
            <div>
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
};
