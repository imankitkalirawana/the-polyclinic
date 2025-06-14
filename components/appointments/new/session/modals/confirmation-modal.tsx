'use client';
import { format } from 'date-fns/format';
import {
  Button,
  Chip,
  Divider,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useForm } from '../context';

import AsyncButton from '@/components/ui/buttons/async-button';
import CellValue from '@/components/ui/cell-value';
import { downloadAppointmentReceipt } from '@/functions/client/appointment/receipt';
import { ChipColorMap } from '@/lib/maps';

export default function ConfirmationModal() {
  const { formik, session } = useForm();

  return (
    <>
      <Modal
        isOpen
        isDismissable={false}
        backdrop="blur"
        hideCloseButton={session.user?.role === 'user'}
        isKeyboardDismissDisabled
        scrollBehavior="inside"
        onClose={() => {
          formik.resetForm();
        }}
      >
        <ModalContent className="px-4">
          <>
            <ModalHeader className="w-full flex-col items-center justify-center gap-2">
              <div className="flex w-fit rounded-full bg-success-50 p-4">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-success"
                  width="36"
                />
              </div>
              <h3>Appointment Booked!</h3>
              <p className="text-center text-tiny font-light text-default-500">
                Confirmation email has been sent to:{' '}
                <strong>{formik.values.patient?.email}</strong>
              </p>
            </ModalHeader>
            <ModalBody className="gap-0 rounded-medium bg-default-100">
              <CellValue
                label="Appointment ID"
                value={`#${formik.values.appointment?.aid}`}
              />
              <CellValue
                label="Date & Time"
                value={
                  (formik.values.date &&
                    format(formik.values.date as Date, 'PPPp')) ||
                  '-'
                }
              />
              <CellValue
                label="Status"
                value={
                  <Chip
                    color={ChipColorMap[formik.values.appointment?.status]}
                    radius="sm"
                    variant="flat"
                    className="capitalize"
                  >
                    {formik.values.appointment?.status}
                  </Chip>
                }
              />
              <Divider className="my-2 border-dashed border-divider" />
              <CellValue label="Patient" value={formik.values.patient?.name} />
              <CellValue
                label="Phone Number"
                value={formik.values.patient?.phone || '-'}
              />
              <CellValue
                label="Doctor"
                value={formik.values.doctor?.name || '-'}
              />
              <Divider className="my-2 border-dashed border-divider" />
              <CellValue
                label="Booked On"
                value={format(formik.values.appointment?.createdAt, 'PPPp')}
              />
              <div className="mt-4 flex justify-center">
                <Image
                  className="rounded-none"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${process.env.NEXT_PUBLIC_URL}formik.values.appointment?s/${formik.values.appointment?.aid}`}
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex-col-reverse px-0 sm:flex-row">
              <AsyncButton
                fullWidth
                variant="flat"
                startContent={
                  <Icon icon="solar:download-minimalistic-bold" width={18} />
                }
                fn={async () => {
                  await downloadAppointmentReceipt(
                    formik.values.appointment?.aid
                  );
                }}
                whileSubmitting="Downloading..."
              >
                Download Receipt
              </AsyncButton>
              <Button
                fullWidth
                color="primary"
                endContent={<Icon icon="tabler:arrow-up-right" width={18} />}
                as={Link}
                href={`/appointments/${formik.values.appointment?.aid}`}
              >
                Track Appointment
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
