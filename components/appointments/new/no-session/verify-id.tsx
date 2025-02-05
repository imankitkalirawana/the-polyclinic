'use client';
import AsyncButton from '@/components/ui/buttons/async-button';
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
import { useState } from 'react';

export default function VerifyId() {
  const [value, setValue] = useState('');
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
              <h2 className="text-2xl font-semibold">Verify Email Address</h2>
            </ModalHeader>
            <ModalBody className="items-center">
              <p className="text-center">
                Enter the verification code sent to:{' '}
                <strong>ankitkalirawana@gmail.com</strong>
              </p>
              <InputOtp length={6} value={value} onValueChange={setValue} />
              <div className="flex items-center gap-2 text-sm">
                <p>Didn't receive the code?</p>
                <Link href="#" isDisabled className="text-sm hover:underline">
                  Resend
                </Link>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center gap-4">
              <Button radius="lg" fullWidth variant="bordered">
                Cancel
              </Button>
              <AsyncButton radius="lg" fullWidth color="primary">
                Continue
              </AsyncButton>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
