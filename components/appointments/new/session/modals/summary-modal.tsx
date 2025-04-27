'use client';
import { format } from 'date-fns';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useForm } from '../context';

import CellValue from '@/components/ui/cell-value';

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
            <ModalHeader className="flex-col items-center justify-center gap-2">
              <div className="flex w-fit rounded-full bg-primary-100 p-4">
                <Icon
                  icon="solar:list-down-bold"
                  className="text-primary"
                  width="36"
                />
              </div>
              <h3>Appointment Summary</h3>
              <p className="text-center text-xs font-light text-default-500">
                Please check the details below before proceeding.
              </p>
            </ModalHeader>
            <ModalBody>
              <CellValue
                label="Patient"
                value={formik.values.patient?.name || '-'}
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
                variant="bordered"
                onPress={() => formik.setFieldValue('step', 4)}
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
