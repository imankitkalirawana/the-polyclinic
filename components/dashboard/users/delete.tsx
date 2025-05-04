'use client';
import {
  addToast,
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
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
import React from 'react';
import { UserType } from '@/models/User';

type ItemType = UserType;

interface DeleteModalProps {
  modalKey: string;
  onClose?: () => void;
  onDelete?: () => void;
  items: ItemType[];
  title?: string;
  deleteFn: () => Promise<any>;
}

export default function DeleteModal({
  modalKey,
  onClose,
  onDelete,
  items,
  title = 'Delete the selected items?',
  deleteFn,
}: DeleteModalProps) {
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
            <Alert color="danger" title="Are you sure? This can't be undone." />
            <Card className="w-full border border-divider bg-default-50 shadow-none">
              <CardBody
                as={ScrollShadow}
                className="flex max-h-[300px] flex-col gap-2 scrollbar-hide"
              >
                {items.map((item) => {
                  const id = item.uid;
                  const title = item.name;
                  return (
                    <div key={`delete-item-${id}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-medium bg-default-200 p-2 text-default-400">
                            <Icon icon="solar:hashtag-circle-bold" width="24" />
                          </div>
                          <span className="text-sm capitalize text-default-400">
                            {title}
                          </span>
                        </div>
                        {id && (
                          <Chip
                            className="px-2"
                            variant="flat"
                            size="sm"
                            startContent={<span>#</span>}
                          >
                            {id}
                          </Chip>
                        )}
                      </div>
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
                try {
                  const res = await deleteFn();

                  if (res.success) {
                    addToast({
                      title: res.message,
                      color: 'success',
                    });
                    onDelete?.();
                  } else {
                    addToast({
                      title: res.message || 'Something went wrong.',
                      color: 'danger',
                    });
                  }
                } catch (error: any) {
                  addToast({
                    title: error.message,
                    color: 'danger',
                  });
                  console.error('Delete error:', error);
                }
              }}
            >
              Confirm Cancellation
            </AsyncButton>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
