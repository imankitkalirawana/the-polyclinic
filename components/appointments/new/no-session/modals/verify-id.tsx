'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  Link,
  InputOtp,
  Button
} from '@heroui/react';
import { useForm } from '../form-context';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function VerifyId() {
  const { formik } = useForm();
  return (
    <>
      <Modal isOpen isDismissable={false} backdrop="blur" hideCloseButton>
        <ModalContent>
          <>
            <ModalHeader className="flex-col items-center">
              <div>
                <Image
                  src="/logo.png"
                  className="p-2"
                  radius="full"
                  width={72}
                />
              </div>
              <h2 className="text-2xl font-semibold">
                Verify{' '}
                {formik.values.id?.includes('@')
                  ? 'Email Address'
                  : 'Phone Number'}
              </h2>
            </ModalHeader>
            <ModalBody className="items-center">
              <p className="text-center">
                Enter the verification code sent to:{' '}
                <strong>
                  {formik.values.id.includes('@')
                    ? formik.values.id
                    : `+91 ${formik.values.id}`}
                </strong>
              </p>
              <InputOtp
                length={4}
                value={formik.values.otp}
                name="otp"
                autoFocus
                onValueChange={(value) => {
                  formik.setFieldValue('otp', value);
                }}
                isInvalid={
                  formik.touched.otp && formik.errors.otp ? true : false
                }
                errorMessage={
                  <div className="flex items-center gap-1">
                    <Icon icon="solar:info-circle-bold" width="14" />
                    <span>{formik.errors.otp}</span>
                  </div>
                }
              />
              <div className="flex items-center gap-2 text-sm">
                <p>Didn't receive the code?</p>
                <Link href="#" isDisabled className="text-sm hover:underline">
                  Resend
                </Link>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center gap-4">
              <Button
                radius="lg"
                fullWidth
                variant="bordered"
                onPress={() => formik.setValues({ ...formik.values, step: 1 })}
              >
                Cancel
              </Button>
              <Button
                radius="lg"
                fullWidth
                color="primary"
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
              >
                Continue
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
