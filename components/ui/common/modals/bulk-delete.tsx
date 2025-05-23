'use client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import AsyncButton from '@/components/ui/buttons/async-button';
import { Title } from '@/components/ui/typography/modal';
import React, { ReactNode } from 'react';

interface DeleteModalProps<T> {
  modalKey: string;
  onClose?: () => void;
  items: Array<T>;
  title?: string;
  onDelete: () => Promise<any>;
  renderItem: (item: T) => ReactNode;
  confirmButtonText?: string;
  canUndo?: boolean;
}

export default function BulkDeleteModal<T>({
  modalKey,
  onClose,
  items,
  title = `Delete the selected ${modalKey}?`,
  onDelete,
  renderItem,
  confirmButtonText = 'Confirm Deletion',
  canUndo = false,
}: DeleteModalProps<T>) {
  return (
    <Modal isOpen backdrop="blur" onClose={onClose} hideCloseButton>
      <ModalContent>
        <>
          <ModalHeader className="items-center justify-between">
            <Title title={title} />
            <Button variant="light" isIconOnly size="sm">
              <Icon icon="entypo:dots-two-vertical" width={18} />
            </Button>
          </ModalHeader>
          <ModalBody className="items-center">
            <Alert
              color="danger"
              title={
                canUndo
                  ? 'Are you sure?'
                  : "Are you sure? This can't be undone."
              }
            />
            <Card className="w-full border border-divider bg-default-50 shadow-none">
              <CardBody
                as={ScrollShadow}
                className="flex max-h-[300px] flex-col gap-2 scrollbar-hide"
              >
                {items.map((item, index) => {
                  return (
                    <div key={`delete-${modalKey}-item-${index}`}>
                      {renderItem(item)}
                      <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter className="flex-col-reverse justify-center gap-2 sm:flex-row sm:gap-4">
            <Button
              radius="lg"
              variant="flat"
              className="min-w-[50%] p-6 font-medium"
              onPress={onClose}
            >
              Keep
            </Button>
            <AsyncButton
              radius="lg"
              variant="flat"
              className="min-w-[50%] p-6 font-medium"
              color="danger"
              whileSubmitting="Deleting..."
              fn={async () => {
                await onDelete();
              }}
            >
              {confirmButtonText}
            </AsyncButton>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
