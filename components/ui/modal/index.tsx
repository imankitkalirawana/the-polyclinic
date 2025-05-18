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
  const defaultPrimaryButton: ButtonProps = {
    color: 'primary',
    variant: 'solid',
    fullWidth: true,
    radius: 'lg',
    className: 'p-6 font-medium',
  };

  const defaultSecondaryButton: ButtonProps = {
    color: 'danger',
    variant: 'flat',
    fullWidth: true,
    onPress: onClose,
    radius: 'lg',
    className: 'p-6 font-medium',
  };

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
                    {...(({ ref, children, ...rest }) => rest)(secondaryButton)}
                    {...(({ ref, children, ...rest }) => rest)(
                      defaultSecondaryButton
                    )}
                  >
                    {secondaryButton.isIconOnly
                      ? null
                      : secondaryButton.children}
                  </Button>
                )}
                {primaryButton && (
                  <AsyncButton
                    {...(({ ref, children, onPress, ...rest }) => rest)(
                      primaryButton
                    )}
                    {...(({ ref, children, onPress, ...rest }) => rest)(
                      defaultPrimaryButton
                    )}
                    fn={async () => {
                      if (primaryButton.onPress) {
                        await primaryButton.onPress({} as any);
                      }
                    }}
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
