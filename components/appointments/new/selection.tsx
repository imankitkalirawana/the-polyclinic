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
import DoctorSelection, {
  DoctorSelectionTitle
} from './patient/doctor-selection';
import UserSelection, { UserSelectionTitle } from './patient/user-selection';
import DateSelection, { DateSelectionTitle } from './patient/date-selection';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle
} from './patient/additional-details-selection';
import CellValue from '@/components/ui/cell-value';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { AppointmentType } from '@/models/Appointment';
import { useForm } from './context';
import ConfirmationModal from './modals/confirmation-modal';
import SummaryModal from './modals/summary-modal';

export default function Selection({ session }: { session?: any }) {
  const { formik } = useForm();

  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);
  const [selectedKeys, setSelectedKeys] = useState(new Set(['user']));
  const [apt, setApt] = useState<AppointmentType>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const summaryModal = useDisclosure();
  const submittionModal = useDisclosure();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await axios
      .post('/api/appointments', {
        uid: appointment.user.uid,
        name: appointment.user.name,
        phone: appointment.user.phone,
        email: appointment.user.email,
        date: appointment.date,
        notes: appointment.additionalInfo.notes,
        symptoms: appointment.additionalInfo.symptoms,
        type: appointment.additionalInfo.type,
        doctor: appointment.doctor.uid
      })
      .then((res) => {
        console.log(res.data);
        setApt(res.data);
        summaryModal.onClose();
        submittionModal.onOpenChange();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

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
      <Modal
        isOpen={summaryModal.isOpen}
        onOpenChange={summaryModal.onOpenChange}
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-xl font-semibold">Appointment Summary</h3>
              </ModalHeader>
              <ModalBody>
                <CellValue
                  label="Patient"
                  value={appointment?.user?.name || '-'}
                />
                <CellValue
                  label="Date & Time"
                  value={format(appointment?.date, 'PPPp') || '-'}
                />
                <CellValue
                  label="Doctor"
                  value={appointment?.doctor?.name || '-'}
                />
                <CellValue
                  label="Appointment Type"
                  value={
                    appointment?.additionalInfo?.type === 'online'
                      ? 'Online'
                      : 'Clinic'
                  }
                />
                <CellValue
                  label="Symptoms"
                  value={appointment?.additionalInfo?.symptoms || '-'}
                />
                <CellValue
                  label="Notes"
                  value={appointment?.additionalInfo?.notes || '-'}
                />
              </ModalBody>
              <ModalFooter className="flex-col-reverse sm:flex-row">
                <Button fullWidth onPress={onClose} variant="bordered">
                  Cancel
                </Button>
                <Button
                  fullWidth
                  color="primary"
                  endContent={<Icon icon="tabler:chevron-right" />}
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                >
                  Proceed
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {ModalMap[formik.values.step]}
    </>
  );
}
