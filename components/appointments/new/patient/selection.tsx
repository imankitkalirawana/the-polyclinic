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

import { removeSelectedDoctor } from '@/store/slices/appointment-slice';
import { useState } from 'react';
import DoctorSelection, { DoctorSelectionTitle } from './doctor-selection';
import UserSelection, { UserSelectionTitle } from './user-selection';
import DateSelection, { DateSelectionTitle } from './date-selection';
import AdditionalDetailsSelection, {
  AdditionalDetailsSelectionTitle
} from './additional-details-selection';
import CellValue from '@/components/ui/cell-value';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import ConfirmationModal from './confirmation-modal';
import axios from 'axios';
import { AppointmentType } from '@/models/Appointment';

export default function Selection({ session }: { session?: any }) {
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

  return (
    <>
      <Accordion
        defaultSelectedKeys={['user']}
        className="divide-y-2 divide-divider border-b border-divider py-4"
        selectedKeys={selectedKeys}
        hideIndicator
        aria-label="User and Doctor Selection"
      >
        <AccordionItem
          key="user"
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
              setSelectedKeys(new Set(['time']));
            }}
          />
        </AccordionItem>
        <AccordionItem
          textValue="Time Selection"
          isDisabled={!appointment.user}
          key="time"
          indicator={
            <Link
              href="#"
              onPress={() => {
                setSelectedKeys(new Set(['time']));
              }}
            >
              Change
            </Link>
          }
          hideIndicator={
            !appointment.date || selectedKeys.has('time') || !appointment.user
          }
          title={<DateSelectionTitle selectedKeys={selectedKeys} />}
        >
          <DateSelection
            onConfirm={() => {
              setSelectedKeys(new Set(['doctor']));
            }}
          />
        </AccordionItem>
        <AccordionItem
          textValue="Doctor Selection"
          isDisabled={!appointment.user || !appointment.date}
          key="doctor"
          indicator={
            <Link
              href="#"
              onPress={() => {
                setSelectedKeys(new Set(['doctor']));
                dispatch(removeSelectedDoctor());
              }}
            >
              Change
            </Link>
          }
          hideIndicator={
            !appointment.doctor ||
            selectedKeys.has('doctor') ||
            !appointment.user
          }
          title={<DoctorSelectionTitle selectedKeys={selectedKeys} />}
        >
          <DoctorSelection
            onConfirm={() => {
              setSelectedKeys(new Set(['additional-details']));
            }}
          />
        </AccordionItem>
        <AccordionItem
          textValue="Additional Details"
          isDisabled={!appointment.user || !appointment.date}
          key="additional-details"
          title={<AdditionalDetailsSelectionTitle />}
        >
          <AdditionalDetailsSelection
            onConfirm={() => {
              summaryModal.onOpenChange();
            }}
          />
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
      <ConfirmationModal
        isOpen={submittionModal.isOpen}
        onOpenChange={submittionModal.onOpenChange}
        appointment={apt}
      />
    </>
  );
}
