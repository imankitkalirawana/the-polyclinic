'use client';
import { Accordion, AccordionItem, Link } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';

import { removeSelectedDoctor } from '@/store/slices/appointment-slice';
import { useState } from 'react';
import DoctorSelection, { DoctorSelectionTitle } from './doctor-selection';
import UserSelection, { UserSelectionTitle } from './user-selection';
import DateSelection, { DateSelectionTitle } from './date-selection';

export default function Selection({ session }: { session?: any }) {
  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);
  const [selectedKeys, setSelectedKeys] = useState(new Set(['user-selection']));

  const accordions = [
    {
      key: 'user-selection',
      textValue: 'User Selection',
      title: (
        <UserSelectionTitle
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          session={session}
        />
      ),
      component: (
        <UserSelection
          session={session}
          onConfirm={() => {
            setSelectedKeys(new Set(['time-selection']));
          }}
        />
      )
    },
    {
      key: 'time-selection',
      title: 'Time Selection',
      component: DateSelection,
      onConfirm: () => {
        setSelectedKeys(new Set(['doctor-selection']));
      }
    },
    {
      key: 'doctor-selection',
      title: 'Doctor Selection',
      component: DoctorSelection
    }
  ];

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
          <UserSelectionTitle
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            session={session}
          />
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
        isDisabled={!appointment.user}
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
        title={<DateSelectionTitle selectedKeys={selectedKeys} />}
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
        title={<DoctorSelectionTitle selectedKeys={selectedKeys} />}
      >
        <DoctorSelection />
      </AccordionItem>
    </Accordion>
  );
}
