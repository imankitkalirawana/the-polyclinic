'use client';
import { forwardRef } from 'react';
import {
  Modal as HeroModal,
  ModalProps as HeroModalProps,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ButtonProps,
  ScrollShadow,
} from '@heroui/react';
import AsyncButton from '../buttons/async-button';
import { cn } from '@heroui/react';

const isLargerThan3xl = (size?: string) => /^(5xl|4xl|full)$/.test(size ?? '');

/**
 * Props for the Modal component
 */
type ModalProps = Omit<HeroModalProps, 'children' | 'classNames'> & {
  /**
   * Whether to hide the cancel button in the modal footer
   * @default false
   */
  hideCancelButton?: boolean;

  /**
   * The title displayed in the modal header
   * Can be a string or React node
   */
  title?: React.ReactNode;

  /**
   * The subtitle displayed below the title in the modal header
   * Can be a string or React node
   */
  subtitle?: React.ReactNode;

  /**
   * The main content body of the modal
   * Can be a string or React node
   */
  body?: React.ReactNode;

  /**
   * Configuration for the submit button
   * Extends ButtonProps but excludes onPress (handled internally)
   */
  submitButton?: Omit<ButtonProps, 'onPress'> & {
    /**
     * Text to display on the submit button while the async operation is in progress
     */
    whileSubmitting?: string;
  };

  /**
   * Configuration for the cancel button
   * Extends ButtonProps but excludes onPress (handled internally)
   */
  cancelButton?: Omit<ButtonProps, 'onPress'>;

  /**
   * Async function called when the submit button is pressed
   * Can return a Promise or void
   */
  onSubmit?: () => Promise<void> | void;

  /**
   * Whether to automatically close the modal after successful submission
   * @default true
   */
  closeOnSubmit?: boolean;

  classNames?: HeroModalProps['classNames'] & {
    header?: string;
    body?: string;
    footer?: string;
  };
};

/**
 * A customizable modal component built on top of HeroUI Modal
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Confirm Action"
 *   subtitle="This action cannot be undone"
 *   body={<p>Are you sure you want to proceed?</p>}
 *   onSubmit={async () => {
 *     await handleSubmit();
 *   }}
 *   submitButton={{
 *     children: "Confirm",
 *     whileSubmitting: "Processing..."
 *   }}
 * />
 * ```
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      title,
      subtitle,
      body,
      submitButton,
      cancelButton,
      hideCancelButton = false,
      hideCloseButton = true,
      onSubmit,
      closeOnSubmit = false,
      classNames,
      size,
      ...rest
    },
    ref
  ) => {
    const isLargeModal = isLargerThan3xl(size);
    return (
      <HeroModal
        ref={ref}
        hideCloseButton={hideCloseButton}
        backdrop="blur"
        scrollBehavior="inside"
        classNames={classNames}
        size={size}
        {...rest}
      >
        <ModalContent className="overflow-hidden">
          {(onClose) => (
            <>
              {!!title && (
                <ModalHeader
                  className={cn(
                    'border-divider flex flex-col border-b font-semibold',
                    classNames?.header
                  )}
                >
                  <h2>{title}</h2>
                  {!!subtitle && (
                    <p className="text-default-500 text-small font-normal">{subtitle}</p>
                  )}
                </ModalHeader>
              )}
              {!!body && (
                <ModalBody as={ScrollShadow} className={cn('bg-default-50 p-4', classNames?.body)}>
                  {body}
                </ModalBody>
              )}

              <ModalFooter
                className={cn(
                  'rounded-b-large border-divider justify-between gap-0 overflow-hidden border-t p-0',
                  {
                    'border-t-0': hideCancelButton,
                    'justify-end gap-4 p-2': isLargeModal,
                  },
                  classNames?.footer
                )}
              >
                {!hideCancelButton && (
                  <Button
                    variant="flat"
                    radius={isLargeModal ? 'md' : 'none'}
                    onPress={onClose}
                    className={cn(
                      'max-w-sm',
                      {
                        'w-full': !isLargeModal,
                      },
                      cancelButton?.className
                    )}
                    {...cancelButton}
                  >
                    {cancelButton?.children || 'Cancel'}
                  </Button>
                )}
                {!!onSubmit && (
                  <AsyncButton
                    radius={isLargeModal ? 'md' : 'none'}
                    onPress={async () => {
                      try {
                        await onSubmit();
                        if (closeOnSubmit) {
                          onClose();
                        }
                      } catch (error) {
                        // Don't close modal on error - let the error be handled by the parent
                        throw error;
                      }
                    }}
                    variant="flat"
                    color="primary"
                    whileSubmitting={submitButton?.whileSubmitting}
                    className={cn(
                      'max-w-sm',
                      {
                        'w-full': !isLargeModal,
                      },
                      submitButton?.className
                    )}
                    {...submitButton}
                  >
                    {submitButton?.children}
                  </AsyncButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </HeroModal>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
