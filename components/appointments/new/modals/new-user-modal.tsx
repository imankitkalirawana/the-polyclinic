'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Divider,
  Chip,
  Image,
  Link,
  Input,
  ScrollShadow
} from '@heroui/react';
import { useForm } from '../session/context';
import { Icon } from '@iconify/react/dist/iconify.js';
import AsyncButton from '@/components/ui/buttons/async-button';
import { downloadAppointmentReceipt } from '@/functions/client/appointment/receipt';

export default function NewUserModal() {
  const { formik, register, session } = useForm();

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
          register.resetForm();
        }}
      >
        <ModalContent className="px-4">
          <>
            <ModalHeader className="flex-col items-center justify-center gap-2">
              <div className="flex w-fit rounded-full bg-success-50 p-4">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-success"
                  width="36"
                />
              </div>
              <h3>Register New Patient</h3>
              <p className="text-center text-xs font-light text-default-500">
                Please enter details to continue appointment
              </p>
            </ModalHeader>
            <ModalBody>
              <ScrollShadow className="grid grid-cols-6 gap-4 p-2">
                <Input
                  label="First Name"
                  value={register.values.firstName}
                  name="firstName"
                  onChange={register.handleChange}
                  className="col-span-3"
                  isInvalid={
                    register.touched.firstName && register.errors.firstName
                      ? true
                      : false
                  }
                  errorMessage={
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:info-circle-bold" width="14" />
                      <span>{register.errors.firstName}</span>
                    </div>
                  }
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={register.values.lastName}
                  onChange={register.handleChange}
                  className="col-span-3"
                />
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={
                    register.values.age !== undefined
                      ? String(register.values.age)
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || !isNaN(Number(value))) {
                      register.setFieldValue(
                        'age',
                        value === '' ? '' : Number(value)
                      );
                    }
                  }}
                  max={120}
                  className="col-span-3"
                />
                <Divider className="my-2 border-dashed border-divider" />
              </ScrollShadow>
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
