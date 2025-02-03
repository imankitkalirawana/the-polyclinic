'use client';
import { Accordion, AccordionItem, Image, Link } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useDispatch, useSelector } from 'react-redux';

import {
  removeSelectedDoctor,
  removeSelectedUser
} from '@/store/slices/appointment-slice';
import { useState } from 'react';
import DoctorSelection from './doctor-selection';
import UserSelection from './user-selection';
import DateSelection from './date-selection';
import { format } from 'date-fns';

export default function Selection({ session }: { session?: any }) {
  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);
  const [selectedKeys, setSelectedKeys] = useState(new Set(['user-selection']));

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
          appointment.user && !selectedKeys.has('user-selection') ? (
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
        <UserSelection
          session={session}
          onConfirm={() => {
            setSelectedKeys(new Set(['time-selection']));
          }}
        />
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
          !appointment.date ||
          selectedKeys.has('time-selection') ||
          !appointment.user
        }
        title={
          appointment.date && !selectedKeys.has('time-selection') ? (
            <h3 className="text-2xl font-semibold">
              {format(appointment.date, 'PPPp')}
            </h3>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Choose Date & Time</h3>
            </div>
          )
        }
      >
        <DateSelection
          onConfirm={() => {
            setSelectedKeys(new Set(['doctor-selection']));
          }}
        />
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
        <DoctorSelection />
      </AccordionItem>
    </Accordion>
  );
}
