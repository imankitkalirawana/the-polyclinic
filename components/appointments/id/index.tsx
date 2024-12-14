'use client';
import Heading from '@/components/ui/heading';
import Skeleton from '@/components/ui/skeleton';
import SubHeading from '@/components/ui/sub-heading';
import { getUserWithUID } from '@/functions/server-actions';
import { Appointment, User } from '@/lib/interface';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Link,
  Textarea
} from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { imageMap } from '../new/calendar/profile';
import { Icon } from '@iconify/react/dist/iconify.js';
import { calculateAge } from '@/lib/client-functions';
import ListTitle from '@/components/ui/list-title';
import { humanReadableDate } from '@/lib/utility';
import { format } from 'date-fns';

interface Props {
  session: any;
  aid: string;
}

export default function ViewAppointment({ session, aid }: Props) {
  const [appointment, setAppointment] = useState<Appointment | null>(
    {} as Appointment
  );
  const [user, setUser] = useState<User | null>({} as User);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/appointments/${aid}`)
        .then(async (res) => {
          setAppointment(res.data);
          await getUserWithUID(res.data.uid)
            .then((user) => {
              setUser(user);
            })
            .catch((err) => {
              console.error(err);
              toast.error('Failed to fetch user');
            });
        })
        .catch((err) => {
          console.error(err);
          toast.error('Failed to fetch appointment');
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);

  return (
    <>
      {!isLoading ? (
        <div>
          <Heading
            title="Appointment Details"
            className="justify-start gap-4"
            button={
              <Chip radius="sm" variant="bordered">
                ID: #{appointment?.aid}
              </Chip>
            }
          />
          <div className="mb-12">
            <SubHeading className="my-0" title="Personal Details" />
            <Card className="p-4">
              <CardBody className="gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <Avatar
                      alt={user?.name}
                      src={
                        user?.image ||
                        imageMap[user?.gender || 'male'] ||
                        'https://nextui.org/images/hero-card.jpeg'
                      }
                      name={user?.name}
                      radius="full"
                      className="h-16 w-16"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl">{user?.name}</h3>
                    <div className="flex items-center gap-2 text-sm font-light text-default-500">
                      <a
                        href={`tel:+91${user?.phone}`}
                        className="flex items-center gap-1 hover:underline"
                      >
                        <Icon icon="solar:phone-linear" width={18} />
                        <p>+91{user?.phone}</p>
                      </a>
                      <span className="size-1 rounded-full bg-default-500"></span>
                      <a
                        href={`mailto:${user?.email}`}
                        className="flex items-center gap-1 hover:underline"
                      >
                        <Icon icon="mynaui:envelope" width={18} />
                        <p>{user?.email}</p>
                      </a>
                    </div>
                  </div>
                </div>
                <Textarea
                  label="Appointment Notes"
                  value={appointment?.notes}
                  readOnly
                />
                <div className="grid md:grid-cols-2">
                  <ul>
                    <li className="flex gap-2">
                      <p className="">Age:</p>
                      <p className="text-default-500">
                        {calculateAge(user?.dob || '')} Years
                      </p>
                    </li>
                    <li className="flex gap-2">
                      <p className="">Gender:</p>
                      <p className="capitalize text-default-500">
                        {user?.gender}
                      </p>
                    </li>
                  </ul>
                  <ul>
                    <li>Address:</li>
                    <li>{user?.address}</li>
                    <li>{`${user?.city ? user.city + ', ' : ''} ${user?.state ? user.state + ', ' : ''}`}</li>
                    <li>{`${user?.country ? user.country + ', ' : ''} ${user?.zipcode}`}</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="mb-12">
            <SubHeading className="my-0" title="Appointment Details" />
            <Card className="p-4">
              <CardBody className="gap-4">
                <div className="grid md:grid-cols-2">
                  <div>
                    <ListTitle
                      className="my-0"
                      title="Date"
                      icon={<Icon icon="solar:calendar-bold" />}
                    />
                    <p className="text-default-500">
                      {format(appointment?.date as Date, 'PPPPp')}
                    </p>
                  </div>
                  <div>
                    <ListTitle
                      className="my-0"
                      title="Appointment Type"
                      icon={<Icon icon="icon-park-solid:appointment" />}
                    />
                    <Button
                      className="mt-2"
                      startContent={
                        <Icon icon="logos:whatsapp-icon" width={16} />
                      }
                      size="sm"
                      radius="sm"
                      variant="bordered"
                      as={Link}
                      href={`https://wa.me/+91${user?.phone}`}
                      target="_blank"
                    >
                      Chat on Whatsapp
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <>
      <div className="grid gap-3">
        <div className="space-y-2">
          <Skeleton className="flex h-8 w-full" />
          <Skeleton className="flex h-4 w-36" />
        </div>
        <div className="mt-2 space-y-2">
          <Skeleton className="flex h-4 w-24" />
          <Skeleton className="flex h-4 w-36" />
          <Skeleton className="flex h-4 w-32" />
        </div>
      </div>
    </>
  );
};
