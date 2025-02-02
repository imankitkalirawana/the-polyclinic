'use client';
import Skeleton from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Image,
  Link,
  ScrollShadow,
  TimeInputValue
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  Time,
  isWeekend
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import {
  setSelectedDoctor,
  removeSelectedDoctor,
  setSelectedDate,
  setSelectedTime,
  setSelectedUser,
  removeSelectedUser
} from '@/store/slices/appointment-slice';
import { getAllDoctors } from '@/functions/server-actions';
import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import { getAllPatientsWithEmail } from '@/functions/server-actions/user';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import DateTimePicker from '../date-time-picker';
import { TIMINGS } from '@/lib/config';
import { disabledDates } from '@/lib/appointments/new';
import { format } from 'date-fns';

export default function Selection({ session }: { session?: any }) {
  const dispatch = useDispatch();
  const { locale } = useLocale();
  const appointment = useSelector((state: any) => state.appointment);
  const [selectedKeys, setSelectedKeys] = useState(new Set(['user-selection']));

  const { data: doctors, isLoading } = useQuery<DoctorType[]>({
    queryKey: ['doctors'],
    queryFn: () => getAllDoctors(),
    enabled: !!appointment.user
  });

  const { data: users, isLoading: isUserLoading } = useQuery<UserType[]>({
    queryKey: ['userwithemail', session?.user?.email],
    queryFn: () => getAllPatientsWithEmail(session?.user?.email),
    enabled: !!session?.user?.email
  });

  const [date, setDate] = useState<CalendarDate>(
    (() => {
      const localDateTime = new Date();

      // if current time is after 5 PM, set the date to tomorrow
      if (localDateTime.getHours() >= TIMINGS.appointment.end) {
        localDateTime.setDate(localDateTime.getDate() + 1);
      }

      return new CalendarDate(
        localDateTime.getFullYear(),
        localDateTime.getMonth() + 1,
        localDateTime.getDate()
      );
    })()
  );

  const [time, setTime] = useState<TimeInputValue | null>(
    (() => {
      const localDateTime = new Date();
      const currentHour = localDateTime.getHours();
      const currentMinute = localDateTime.getMinutes();

      if (
        currentHour < TIMINGS.appointment.start ||
        currentHour >= TIMINGS.appointment.end
      ) {
        return new Time(TIMINGS.appointment.start);
      }

      return new Time(currentHour, currentMinute);
    })()
  );

  const convertTimeToDate = (time: TimeInputValue | null): Date | null => {
    if (!time) return null;

    const { hour, minute, second, millisecond } = time;

    const newDate = date.toDate(getLocalTimeZone());
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    newDate.setSeconds(second);
    newDate.setMilliseconds(millisecond);

    return newDate;
  };

  return (
    <Accordion
      defaultSelectedKeys={['user-selection']}
      className="divide-y-2 divide-divider border-b border-divider py-4"
      selectedKeys={selectedKeys}
      hideIndicator
      aria-label="User and Doctor Selection"
    >
      <AccordionItem
        key="user-selection"
        textValue="User Selection"
        title={
          appointment.user ? (
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
                <h2 className="text-lg font-semibold">
                  {appointment.user.name}
                </h2>
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
          )
        }
      >
        <div className="space-y-4">
          <ScrollShadow orientation="horizontal" className="mt-8 flex gap-4">
            {isUserLoading ? (
              <LoadingUsers />
            ) : (
              users?.map((user) => (
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
                    setSelectedKeys(new Set(['time-selection']));
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
      </AccordionItem>
      <AccordionItem
        textValue="Time Selection"
        // isDisabled={!appointment.user}
        key="time-selection"
        indicator={
          <Link
            href="#"
            onPress={() => {
              setSelectedKeys(new Set(['time-selection']));
              dispatch(removeSelectedDoctor());
            }}
          >
            Change
          </Link>
        }
        hideIndicator={
          !appointment.time ||
          selectedKeys.has('time-selection') ||
          !appointment.user
        }
        title={
          appointment.time && !selectedKeys.has('time-selection') ? (
            <h3 className="text-2xl font-semibold">
              {format(convertTimeToDate(time) as Date, 'iii, MMM do')} at{' '}
              {format(convertTimeToDate(time) as Date, 'h:mm a')}
            </h3>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Choose Date & Time</h3>
            </div>
          )
        }
      >
        <DateTimePicker
          date={date}
          time={time as TimeInputValue}
          onDateChange={(date) => {
            setDate(date as CalendarDate);
          }}
          onTimeChange={(time) => {
            setTime(time);
          }}
          dateProps={{
            isInvalid:
              isWeekend(date!, locale) ||
              disabledDates[0].map((d) => d.compare(date!)).includes(0)
          }}
        />
        <div className="mt-4">
          <Button
            color="primary"
            radius="lg"
            className="w-full max-w-64 xs:w-fit"
            endContent={<Icon icon="tabler:chevron-right" />}
            isDisabled={
              !date ||
              !time ||
              isWeekend(date, locale) ||
              disabledDates[0].map((d) => d.compare(date)).includes(0)
            }
            onPress={() => {
              setSelectedKeys(new Set(['doctor-selection']));
              dispatch(setSelectedDate(date));
              dispatch(setSelectedTime(time as TimeInputValue));
            }}
          >
            Continue
          </Button>
        </div>
      </AccordionItem>
      <AccordionItem
        textValue="Doctor Selection"
        isDisabled={!appointment.user}
        key="doctor-selection"
        indicator={
          <Link
            href="#"
            onPress={() => {
              setSelectedKeys(new Set(['doctor-selection']));
              dispatch(removeSelectedDoctor());
            }}
          >
            Change
          </Link>
        }
        hideIndicator={
          !appointment.doctor ||
          selectedKeys.has('doctor-selection') ||
          !appointment.user
        }
        title={
          appointment.doctor && !selectedKeys.has('doctor-selection') ? (
            <h3 className="text-2xl font-semibold">
              {appointment.doctor.name}
            </h3>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">
                Choose a doctor (Optional)
              </h3>
            </div>
          )
        }
      >
        {appointment.user && (
          <ScrollShadow orientation="horizontal" className="mt-8 flex gap-4">
            {isLoading ? (
              <LoadingUsers />
            ) : (
              doctors?.map((doctor) => (
                <Card
                  isPressable
                  key={doctor.uid}
                  className={cn(
                    'no-scrollbar min-w-80 rounded-xl border border-divider shadow-none',
                    {
                      'border-2 border-primary-400':
                        doctor.uid === appointment.doctor?.uid
                    }
                  )}
                  onPress={() => {
                    dispatch(
                      setSelectedDoctor({
                        ...doctor,
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
                        {doctor.name}
                      </h2>
                      <p className="text-sm font-light text-default-500">
                        {doctor.email}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </ScrollShadow>
        )}
      </AccordionItem>
    </Accordion>
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
