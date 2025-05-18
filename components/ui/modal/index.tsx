import {
  Modal as HeroModal,
  ModalProps as HeroModalProps,
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
  primaryButton?: ButtonProps & {
    whileSubmitting?: string;
  };
  secondaryButton?: ButtonProps & {
    whileSubmitting?: string;
  };
  onClose: () => void;
  modalProps?: HeroModalProps;
}

function Modal({
  header,
  body,
  alert,
  primaryButton,
  secondaryButton,
  onClose,
  modalProps,
}: ModalProps) {
  const defaultPrimaryButton: ButtonProps = {
    color: 'primary',
    variant: 'solid',
    fullWidth: true,
    radius: 'lg',
    className: 'p-6 font-medium',
  };

  const defaultSecondaryButton: ButtonProps = {
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
        hideCloseButton
        {...modalProps}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <ModalBody as={ScrollShadow} className="items-center gap-2">
                {alert && <Alert {...alert} />}
                {body}
              </ModalBody>
              <ModalFooter>
                {secondaryButton && (
                  <Button
                    {...(({ ref, children, ...rest }) => rest)(
                      defaultSecondaryButton
                    )}
                    {...(({ ref, children, ...rest }) => rest)(secondaryButton)}
                  >
                    {secondaryButton.isIconOnly
                      ? null
                      : secondaryButton.children}
                  </Button>
                )}
                {primaryButton && (
                  <AsyncButton
                    {...(({ ref, children, onPress, ...rest }) => rest)(
                      defaultPrimaryButton
                    )}
                    {...(({ ref, children, onPress, ...rest }) => rest)(
                      primaryButton
                    )}
                    fn={async () => {
                      if (primaryButton.onPress) {
                        await primaryButton.onPress({} as any);
                      }
                    }}
                    whileSubmitting={primaryButton.whileSubmitting}
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
