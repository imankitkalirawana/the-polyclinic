'use client';
import Skeleton from '@/components/ui/skeleton';
import { getDoctorWithUID, getUserWithUID } from '@/functions/server-actions';
import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { format } from 'date-fns';
import { today, getLocalTimeZone } from '@internationalized/date';
import { useSelector } from 'react-redux';

export default function AppointmentPreview() {
  const appointment = useSelector((state: any) => state.appointment);
  console.log(appointment);

  const [uid] = useQueryState('uid');
  const [did] = useQueryState('did');
  const [date] = useQueryState('date', {
    defaultValue: today(getLocalTimeZone()).toString()
  });
  const [time] = useQueryState('slot', {
    defaultValue: new Date()
      .toLocaleTimeString('en-IN', { hour12: false })
      .split(' ')[0]
  });

  const { data: user, isLoading: isUserLoading } = useQuery<UserType>({
    queryKey: ['user', uid],
    queryFn: () => {
      if (!appointment.user) {
        return getUserWithUID(parseInt(uid as string));
      }
      return Promise.resolve(appointment.user);
    },
    enabled: !!uid
  });

  const { data: doctor, isLoading: isDoctorLoading } = useQuery<DoctorType>({
    queryKey: ['doctor', did],
    queryFn: () => {
      if (!appointment.doctor) {
        return getDoctorWithUID(parseInt(did as string));
      }
      return Promise.resolve(appointment.doctor);
    },
    enabled: !!did && !appointment.doctor,
    initialData: appointment.doctor
  });

  return (
    <>
      <div className="ml-96 w-full px-[5%] py-8">
        <div className="flex w-full flex-col overflow-hidden rounded-2xl shadow-lg">
          <div className="w-full bg-foreground px-4 py-2 text-background">
            <h3>This is a preview.</h3>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <h4>Personal Details</h4>
              <Card className="rounded-xl border border-divider shadow-none">
                <CardBody className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={'/assets/placeholder-avatar.jpeg'}
                      alt={`${user?.name}`}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="space-y-1">
                      {isUserLoading ? (
                        <Skeleton className="h-6 w-40" />
                      ) : (
                        <h2 className="text-xl font-semibold">
                          {user ? user.name : '-'}
                        </h2>
                      )}
                      <div className="flex flex-col gap-2 text-sm text-default-500 sm:flex-row sm:gap-4">
                        {isUserLoading ? (
                          <div className="flex items-center gap-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ) : (
                          <>
                            {user?.phone && (
                              <div className="flex items-center gap-1">
                                <Icon
                                  icon="solar:phone-rounded-linear"
                                  width={18}
                                />
                                <span>+91 {user?.phone}</span>
                              </div>
                            )}
                            {user?.email && (
                              <div className="flex items-center gap-2">
                                <Icon icon="iconoir:mail" width={18} />
                                <span>{user?.email}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg bg-default-100 p-2 text-default-500">
                    <h3 className="font-medium text-foreground">
                      Appointment Note
                    </h3>
                    <p className="text-sm text-default-500">
                      Eating sweet foods, not brushing your teeth regularly.
                      often drink cold water when eating food that is still hot.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Symptoms</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {['Headache', 'Fever', 'Cough', 'Sore throat'].map(
                          (symptom) => (
                            <Chip
                              key={symptom}
                              size="sm"
                              radius="sm"
                              className="capitalize"
                            >
                              {symptom}
                            </Chip>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Symptoms</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {['Headache', 'Fever', 'Cough', 'Sore throat'].map(
                          (symptom) => (
                            <Chip
                              key={symptom}
                              size="sm"
                              radius="sm"
                              className="capitalize"
                            >
                              {symptom}
                            </Chip>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="flex flex-col gap-2">
              <h4>Appointment Details</h4>
              <Card className="rounded-xl border border-divider shadow-none">
                <CardBody className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Date & Time</h3>
                      <div className="flex flex-col text-sm">
                        <span>{format(date as string, 'PPPP')}</span>
                        <span>{format(new Date(`${date}T${time}`), 'p')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium text-foreground">Doctor</h3>
                      {isDoctorLoading ? (
                        <Skeleton className="h-8 w-20" />
                      ) : doctor ? (
                        <div>
                          <Button
                            variant="bordered"
                            radius="sm"
                            size="sm"
                            as={Link}
                            target="_blank"
                            href="/doctors/1"
                            className="capitalize"
                            endContent={<Icon icon="fluent:open-20-filled" />}
                          >
                            {doctor.name}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col text-sm">
                          No doctor selected
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Appointment Mode</h3>
                      <Chip
                        variant="bordered"
                        radius="sm"
                        className="capitalize"
                      >
                        In-person
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const PreviewSkeleton = () => {
  return <></>;
};
