'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
  Link,
  Card,
  CardBody
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Title } from '../compact-view/appointment-details-modal';
import { useForm } from '../compact-view/context';
import AsyncButton from '@/components/ui/buttons/async-button';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'sonner';

export default function CancelModal() {
  const { formik, refetch, session } = useForm();

  return (
    <>
      <Modal
        isOpen
        backdrop="blur"
        onClose={() => formik.setFieldValue('modal', null)}
        hideCloseButton
      >
        <ModalContent>
          <>
            <ModalHeader className="items-center justify-between">
              <Title title="Cancel Appointment?" />
              <Button variant="light" isIconOnly size="sm">
                <Icon icon="entypo:dots-two-vertical" width={18} />
              </Button>
            </ModalHeader>
            <ModalBody className="items-center">
              <Alert
                color="danger"
                title="Are you sure? This can't be undone."
              />
              <Card className="w-full border border-divider bg-default-50 shadow-none">
                <CardBody className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-medium bg-orange-100 p-2 text-orange-500">
                      <Icon icon="solar:hashtag-circle-bold" width="24" />
                    </div>
                    <div className="flex text-[15px] text-default-400">
                      <span className="capitalize">
                        {formik.values.selected?.aid}
                      </span>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-medium bg-blue-100 p-2 text-blue-500">
                      <Icon icon="solar:user-bold" width="24" />
                    </div>
                    <div className="flex gap-2 text-[15px] text-default-400">
                      <span className="capitalize">
                        {formik.values.selected?.patient?.name}
                      </span>
                      {formik.values.selected?.doctor && (
                        <span>with {formik.values.selected?.doctor?.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-medium bg-primary-100 p-2 text-primary">
                      <Icon icon="solar:clock-circle-bold" width={24} />
                    </div>
                    <div className="flex text-[15px] text-default-400">
                      <span>
                        {format(
                          new Date(formik.values.selected?.date as string),
                          'hh:mm a'
                        )}
                      </span>
                      <Icon icon="mdi:dot" width="24" height="24" />
                      <span>
                        {format(
                          new Date(formik.values.selected?.date as string),
                          'PP'
                        )}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter className="flex-col-reverse justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                radius="lg"
                variant="flat"
                className="min-w-[50%] p-6 font-medium"
                onPress={() => formik.setFieldValue('modal', null)}
              >
                Keep
              </Button>
              <AsyncButton
                radius="lg"
                variant="flat"
                className="min-w-[50%] p-6 font-medium"
                color="danger"
                whileSubmitting="Cancelling..."
                fn={async () => {
                  await axios
                    .delete(
                      `/api/v1/appointments/${formik.values.selected?.aid}`
                    )
                    .then(() => {
                      toast('Appointment cancelled');
                      refetch();
                      formik.setFieldValue('selected', null);
                      formik.setFieldValue('modal', null);
                    });
                }}
              >
                Confirm Cancellation
              </AsyncButton>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
