'use client';
import {
  Alert,
  Avatar,
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
import React, { ReactNode } from 'react';

interface DeleteModalProps<T> {
  modalKey: string;
  onClose?: () => void;
  items: Array<T>;
  title?: string;
  deleteFn: () => Promise<any>;
  renderItem?: (item: T) => ReactNode;
  getItemId: (item: T) => string;
  getItemDisplayName: (item: T) => string;
  getItemImage?: (item: T) => string | undefined;
  confirmButtonText?: string;
}

export default function BulkDeleteModal<T>({
  modalKey,
  onClose,
  items,
  title = `Delete the selected ${modalKey}?`,
  deleteFn,
  renderItem,
  getItemId,
  confirmButtonText = 'Confirm Deletion',
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
            <Alert color="danger" title="Are you sure? This can't be undone." />
            <Card className="w-full border border-divider bg-default-50 shadow-none">
              <CardBody
                as={ScrollShadow}
                className="flex max-h-[300px] flex-col gap-2 scrollbar-hide"
              >
                {items.map((item) => {
                  if (renderItem) {
                    return (
                      <div key={`delete-item-${getItemId(item)}`}>
                        {renderItem(item)}
                        <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                      </div>
                    );
                  }

                  // const id = getItemId(item);
                  // const displayName = getItemDisplayName(item);
                  // const image = getItemImage(item);

                  // return (
                  //   <div key={`delete-item-${id}`}>
                  //     <div className="flex items-center justify-between gap-4">
                  //       <div className="flex items-center gap-2">
                  //         <Avatar src={image} name={displayName} />
                  //         <span className="text-sm capitalize text-default-400">
                  //           {displayName}
                  //         </span>
                  //       </div>
                  //       {id && (
                  //         <Chip
                  //           className="px-2"
                  //           variant="flat"
                  //           size="sm"
                  //           startContent={<span>#</span>}
                  //         >
                  //           {id}
                  //         </Chip>
                  //       )}
                  //     </div>
                  //     <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                  //   </div>
                  // );
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
                await deleteFn();
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
