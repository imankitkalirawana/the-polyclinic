'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  Link,
  Button,
  Divider,
  Chip
} from '@heroui/react';
import { useForm } from '../context';
import { Icon } from '@iconify/react/dist/iconify.js';
import CellValue from '@/components/ui/cell-value';
import { format } from 'date-fns';
import Skeleton from '@/components/ui/skeleton';
import { getDoctorWithUID } from '@/functions/server-actions';
import { useEffect, useState } from 'react';
import { AppointmentType } from '@/models/Appointment';
import AsyncButton from '@/components/ui/buttons/async-button';

export default function SummaryModal() {
  const { formik } = useForm();

  return (
    <>
      <Modal
        isOpen
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled
        scrollBehavior="inside"
      >
        <ModalContent>
          <>
            <ModalHeader>
              <h3 className="text-xl font-semibold">Appointment Summary</h3>
            </ModalHeader>
            <ModalBody>
              <CellValue
                label="Patient"
                value={formik.values.user?.name || '-'}
              />
              <CellValue
                label="Date & Time"
                value={format(formik.values.date, 'PPPp') || '-'}
              />
              <CellValue
                label="Doctor"
                value={formik.values.doctor?.name || '-'}
              />
              <CellValue
                label="Appointment Type"
                value={
                  formik.values.additionalInfo?.type === 'online'
                    ? 'Online'
                    : 'Clinic'
                }
              />
              <CellValue
                label="Symptoms"
                value={formik.values.additionalInfo?.symptoms || '-'}
              />
              <CellValue
                label="Notes"
                value={formik.values.additionalInfo?.notes || '-'}
              />
            </ModalBody>
            <ModalFooter className="flex-col-reverse sm:flex-row">
              <Button
                fullWidth
                //    onPress={onClose}
                variant="bordered"
              >
                Cancel
              </Button>
              <Button
                fullWidth
                color="primary"
                endContent={<Icon icon="tabler:chevron-right" />}
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
              >
                Proceed
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
