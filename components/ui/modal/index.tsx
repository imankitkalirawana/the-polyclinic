import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonProps,
  AlertProps,
  Alert,
  ScrollShadow,
} from '@heroui/react';
import React from 'react';
import AsyncButton from '../buttons/async-button';

interface ModalProps {
  header?: React.ReactNode;
  alert?: AlertProps;
  body: React.ReactNode;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
  onClose: () => void;
}

function Modal({
  header,
  body,
  alert,
  primaryButton,
  secondaryButton,
  onClose,
}: ModalProps) {
  return (
    <>
      <HeroModal
        isOpen
        backdrop="blur"
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <ModalBody className="gap-2">
                {alert && <Alert {...alert} />}
                <ScrollShadow>{body}</ScrollShadow>
              </ModalBody>
              <ModalFooter>
                {secondaryButton && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    {...secondaryButton}
                  >
                    {secondaryButton.isIconOnly
                      ? null
                      : secondaryButton.children}
                  </Button>
                )}
                {primaryButton && (
                  <AsyncButton
                    {...(({ key, ref, children, ...rest }) => rest)(
                      primaryButton
                    )}
                  >
                    {primaryButton.isIconOnly ? null : primaryButton.children}
                  </AsyncButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </HeroModal>
    </>
  );
}

export default React.memo(Modal);
