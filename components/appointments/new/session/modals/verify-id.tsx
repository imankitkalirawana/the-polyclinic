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
import { useForm } from '../context';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function VerifyId() {
  const { register } = useForm();
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
                {register.values.id?.includes('@')
                  ? 'Email Address'
                  : 'Phone Number'}
              </h2>
            </ModalHeader>
            <ModalBody className="items-center">
              <p className="text-center">
                Enter the verification code sent to:{' '}
                <strong>
                  {register.values.id.includes('@')
                    ? register.values.id
                    : `+91 ${register.values.id}`}
                </strong>
              </p>
              <InputOtp
                length={4}
                value={register.values.otp}
                name="otp"
                autoFocus
                onValueChange={(value) => {
                  register.setFieldValue('otp', value);
                }}
                isInvalid={
                  register.touched.otp && register.errors.otp ? true : false
                }
                errorMessage={
                  <div className="flex items-center gap-1">
                    <Icon icon="solar:info-circle-bold" width="14" />
                    <span>{register.errors.otp}</span>
                  </div>
                }
                onComplete={() => register.handleSubmit()}
              />
              <div className="flex items-center gap-2 text-sm">
                <p>Didn&apos;t receive the code?</p>
                <Link href="#" isDisabled className="text-sm hover:underline">
                  Resend
                </Link>
              </div>
            </ModalBody>
            <ModalFooter className="flex-col-reverse justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                radius="lg"
                fullWidth
                variant="bordered"
                onPress={() =>
                  register.setValues({ ...register.values, step: 1 })
                }
              >
                Cancel
              </Button>
              <Button
                radius="lg"
                fullWidth
                color="primary"
                endContent={<Icon icon="tabler:chevron-right" width={18} />}
                onPress={() => register.handleSubmit()}
                isLoading={register.isSubmitting}
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
