'use client';
import Heading from '@/components/ui/heading';
import Skeleton from '@/components/ui/skeleton';
import SubHeading from '@/components/ui/sub-heading';
import { getUserWithUID } from '@/functions/server-actions';
import { EventType } from '@/lib/interface';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Link,
  Textarea,
  Tooltip
} from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { imageMap } from '../new/calendar/profile';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  addToGoogleCalendar,
  addToOutlookCalendar,
  calculateAge
} from '@/lib/client-functions';
import ListTitle from '@/components/ui/list-title';
import { format } from 'date-fns';
import { AppointmentType } from '@/models/Appointment';
import { UserType } from '@/models/User';

interface Props {
  session: any;
  aid: string;
}

export default function ViewAppointment({ session, aid }: Props) {
  const [appointment, setAppointment] = useState<AppointmentType | null>(
    {} as AppointmentType
  );
  const [user, setUser] = useState<UserType | null>({} as UserType);
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

  const event: EventType = {
    title: 'Appointment with ' + user?.name,
    description: 'Appointment with ' + user?.name,
    location: appointment?.type === 'online' ? 'Online' : 'Clinic',
    start: new Date(appointment?.date as Date),
    end: new Date(appointment?.date as Date),
    duration: [1, 'hour'],
    busy: true
  };

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
                    <div className="flex flex-col items-center gap-2 text-sm font-light text-default-500 sm:flex-row">
                      <a
                        href={`tel:+91${user?.phone}`}
                        className="flex items-center gap-1 hover:underline"
                      >
                        <Icon icon="solar:phone-linear" width={18} />
                        <p>+91{user?.phone}</p>
                      </a>
                      <span className="hidden size-1 rounded-full bg-default-500 sm:block"></span>
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
                <div className="grid gap-2 md:grid-cols-2">
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <ListTitle
                      className="my-0"
                      title="Date"
                      icon={<Icon icon="solar:calendar-bold" />}
                    />
                    <p className="text-default-500">
                      {format(appointment?.date as Date, 'PPp')}
                    </p>
                  </div>
                  <div>
                    <ListTitle
                      className="my-0"
                      title="Appointment Type"
                      icon={<Icon icon="icon-park-solid:appointment" />}
                    />
                    {appointment?.type === 'online' ? (
                      <Button
                        className="mt-2"
                        startContent={
                          <Icon icon="logos:whatsapp-icon" width={16} />
                        }
                        radius="sm"
                        variant="bordered"
                        as={Link}
                        href={`https://wa.me/+91${user?.phone}`}
                        target="_blank"
                      >
                        Chat on Whatsapp
                      </Button>
                    ) : (
                      <p className="text-default-500">Clinic Appointment</p>
                    )}
                  </div>
                </div>
              </CardBody>
              <CardFooter className="justify-start gap-2">
                <Tooltip color="primary" content="Add to Google Calendar">
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => {
                      addToGoogleCalendar(event);
                    }}
                    startContent={<Icon icon="logos:google-calendar" />}
                  >
                    Add to Calendar
                  </Button>
                </Tooltip>
                <Tooltip content="Add to Outlook">
                  <Button
                    variant="bordered"
                    isIconOnly
                    startContent={
                      <Icon icon="vscode-icons:file-type-outlook" />
                    }
                    onPress={() => {
                      addToOutlookCalendar(event);
                    }}
                  />
                </Tooltip>
                <Tooltip content="Download ICS File">
                  <Button
                    variant="bordered"
                    isIconOnly
                    startContent={
                      <Image
                        src="/icons/ics-format.png"
                        className="w-full p-2"
                      />
                    }
                  />
                </Tooltip>
              </CardFooter>
            </Card>
          </div>
          <div className="mb-12">
            <SubHeading className="my-0" title="Appointment Details" />
            <Card className="p-4"></Card>
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
