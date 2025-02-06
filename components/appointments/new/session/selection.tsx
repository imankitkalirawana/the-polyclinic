'use client';
import {
  Accordion,
  AccordionItem,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';

import { useState } from 'react';
import DoctorSelection, { DoctorSelectionTitle } from './doctor-selection';

import CellValue from '@/components/ui/cell-value';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { AppointmentType } from '@/models/Appointment';
import { useForm } from './context';
import ConfirmationModal from '../modals/confirmation-modal';
import SummaryModal from '../modals/summary-modal';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle
} from './additional-details-selection';
import DateSelection, { DateSelectionTitle } from './date-selection';
import UserSelection, { UserSelectionTitle } from './user-selection';

export default function Selection() {
  const { formik } = useForm();

  const summaryModal = useDisclosure();

  const ModalMap: Record<number, React.ReactNode> = {
    5: <SummaryModal />,
    6: <ConfirmationModal />
  };

  const KeyMap: Record<number, string> = {
    1: 'user',
    2: 'time',
    3: 'doctor',
    4: 'additional-details'
  };

  return (
    <>
      <Accordion
        defaultSelectedKeys={['user']}
        className="divide-y-2 divide-divider border-b border-divider py-4"
        // selectedKeys={selectedKeys}
        selectedKeys={[KeyMap[formik.values.step]]}
        hideIndicator
        aria-label="User and Doctor Selection"
      >
        <AccordionItem
          key="user"
          textValue="User Selection"
          title={<UserSelectionTitle />}
        >
          <UserSelection />
        </AccordionItem>
        <AccordionItem
          textValue="Time Selection"
          isDisabled={formik.values.step < 2}
          key="time"
          indicator={
            <Link
              href="#"
              onPress={() => {
                formik.setFieldValue('step', 2);
              }}
            >
              Change
            </Link>
          }
          hideIndicator={formik.values.step <= 2}
          title={<DateSelectionTitle />}
        >
          <DateSelection />
        </AccordionItem>
        <AccordionItem
          textValue="Doctor Selection"
          isDisabled={formik.values.step < 3}
          key="doctor"
          indicator={
            <Link
              href="#"
              onPress={() => {
                formik.setFieldValue('step', 3);
              }}
            >
              Change
            </Link>
          }
          hideIndicator={formik.values.step <= 3}
          title={<DoctorSelectionTitle />}
        >
          <DoctorSelection />
        </AccordionItem>
        <AccordionItem
          textValue="Additional Details"
          isDisabled={formik.values.step < 4}
          key="additional-details"
          title={<AdditionalDetailsSelectionTitle />}
        >
          <AdditionalDetailsSelection />
        </AccordionItem>
      </Accordion>

      {ModalMap[formik.values.step]}
    </>
  );
}
