'use client';

import { useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import {
  addToast,
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import { getAppointmentStyles } from './appointments';
import { useForm } from './context';

import FixMeModal from '@/components/ui/fix-me/modal';
import { downloadAppointmentReceipt } from '@/functions/client/appointment/receipt';
import { cn } from '@/lib/utils';
import { $FixMe } from '@/types';

interface DropdownItemProps {
  key: string;
  label: string;
  description?: string;
  icon: string;
  color: 'warning' | 'danger' | 'primary' | 'default' | 'secondary' | 'success';
  action?: () => void;
}

export type ActionType = 'reschedule' | 'cancel' | 'download' | 'receipt' | 'proceed';

export default function AppointmentDetailsModal() {
  const { formik, session } = useForm();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<Record<ActionType, boolean>>({
    reschedule: false,
    cancel: false,
    download: false,
    receipt: false,
    proceed: false,
  });

  const roleButton: Record<string, string[]> = {
    user: ['reschedule', 'cancel'],
    doctor: ['reschedule', 'cancel', 'download', 'receipt', 'proceed'],
    admin: ['reschedule', 'cancel', 'download', 'receipt', 'proceed'],
    receptionist: ['reschedule', 'cancel', 'download', 'receipt'],
  };

  const statusButton: Record<string, string[]> = {
    booked: ['reschedule', 'cancel', 'receipt', 'proceed'],
    confirmed: ['reschedule', 'cancel', 'receipt', 'proceed'],
    'in-progress': ['reschedule', 'cancel', 'receipt', 'proceed'],
    completed: ['download', 'receipt'],
    cancelled: ['receipt'],
    overdue: ['reschedule', 'cancel', 'receipt'],
    'on-hold': ['cancel', 'receipt', 'proceed'],
  };

  const dropdownItems: DropdownItemProps[] = [
    {
      key: 'reschedule',
      label: 'Reschedule',
      description: 'Reschedule the appointment',
      icon: 'solar:clock-circle-bold-duotone',
      color: 'warning',
    },

    {
      label: 'Download Report',
      description: 'Download the appointment report',
      icon: 'solar:download-bold-duotone',
      key: 'download',
      color: 'primary',
      action: async () => {
        addToast({
          title: 'Downloading reports',
          description: 'Downloading reports',
          color: 'success',
        });
      },
    },
    {
      label: 'Receipt',
      description: 'Download the appointment receipt',
      icon: 'solar:document-text-bold-duotone',
      key: 'receipt',
      color: 'primary',
      action: async () => {
        setIsLoading((prev) => ({ ...prev, receipt: true }));
        await downloadAppointmentReceipt(formik.values.selected?.aid || 0);
        setIsLoading((prev) => ({ ...prev, receipt: false }));
      },
    },
    {
      label: session?.user?.role === 'user' ? 'Cancel' : 'Decline',
      description:
        session?.user?.role === 'user' ? 'Cancel the appointment' : 'Decline the appointment',
      icon: 'solar:close-circle-bold-duotone',
      key: 'cancel',
      color: 'danger',
    },
    {
      label: 'Proceed',
      description: 'Proceed with the appointment',
      icon: 'solar:arrow-right-up-bold-duotone',
      key: 'proceed',
      color: 'success',
      action: () => {
        router.push(`/appointments/${formik.values.selected?.aid}/proceed`);
      },
    },
  ];

  const [selectedOption, setSelectedOption] = useState(
    () =>
      new Set(
        dropdownItems
          .filter(
            (item) =>
              roleButton[session?.user?.role || '']?.includes(item.key) &&
              statusButton[formik.values.selected?.status || '']?.includes(item.key)
          )
          .map((item) => item.key)
      )
  );
  const selectedOptionValue = Array.from(selectedOption)[0] as ActionType;

  const selectedItem = dropdownItems.find((item) => item.key === selectedOptionValue);

  const modalMap: Record<string, React.ReactNode> = {
    reschedule: <FixMeModal />,
    cancel: <FixMeModal />,
  };

  return (
    <>
      <Modal
        isOpen={formik.values.selected !== null}
        backdrop="blur"
        hideCloseButton
        onClose={() => {
          formik.setFieldValue('selected', null);
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="items-center justify-between">
                <Title title="Appointment Details" />
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button variant="light" isIconOnly size="sm">
                      <Icon icon="entypo:dots-two-vertical" width={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="view"
                      endContent={<Icon icon="solar:arrow-right-up-linear" width={18} />}
                      onPress={() => {
                        router.push(`/appointments/${formik.values.selected?.aid}`);
                      }}
                    >
                      View in detail
                    </DropdownItem>
                    <DropdownItem key="help">Help</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="no-scrollbar py-4 pb-12">
                  <Card className="mt-4 w-full border-small border-divider bg-default-50 shadow-none">
                    <CardBody className="flex-row items-center gap-6 p-4">
                      <Avatar radius="md" src="/assets/placeholder-avatar.jpeg" name="John Doe" />
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-default-700">
                          {formik.values.selected?.patient?.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              'block size-4 rounded-md bg-default-500',
                              getAppointmentStyles(formik.values.selected?.status as $FixMe)
                                .avatarBg
                            )}
                          />
                          <span className="text-small capitalize text-default-700">
                            {formik.values.selected?.status.split('-').join(' ')}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="mt-4 w-full border-small border-divider bg-default-50 shadow-none">
                    <CardBody className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-medium bg-orange-100 p-2 text-orange-500">
                          <Icon icon="solar:hashtag-circle-bold" width="24" />
                        </div>
                        <div className="flex text-[15px] text-default-400">
                          <span className="capitalize">#{formik.values.selected?.aid}</span>
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20" />
                      <div className="flex items-center gap-4">
                        <div className="rounded-medium bg-blue-100 p-2 text-blue-500">
                          <Icon icon="solar:phone-rounded-bold" width="24" />
                        </div>
                        <div className="flex flex-col gap-2 text-[15px] text-default-400">
                          <Link
                            href={`mailto:${formik.values.selected?.patient.email}`}
                            target="_blank"
                            className="text-[15px] text-default-400 hover:text-primary hover:underline"
                          >
                            {formik.values.selected?.patient.email}
                          </Link>
                          {formik.values.selected?.patient?.phone && (
                            <>
                              <div className="h-[1px] w-full bg-gradient-to-r from-divider via-divider to-divider/20" />
                              <Link
                                href={`tel:${formik.values.selected?.patient.phone}`}
                                target="_blank"
                                className="text-[15px] text-default-400 hover:text-primary hover:underline"
                              >
                                {formik.values.selected?.patient?.phone}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20" />
                      <div className="flex items-center gap-4">
                        <div className="rounded-medium bg-primary-100 p-2 text-primary">
                          <Icon icon="solar:clock-circle-bold" width={24} />
                        </div>
                        <div className="flex text-[15px] text-default-400">
                          <span>
                            {format(new Date(formik.values.selected?.date as string), 'hh:mm a')}
                          </span>
                          <Icon icon="mdi:dot" width="24" height="24" />
                          <span>
                            {format(new Date(formik.values.selected?.date as string), 'PP')}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {formik.values.selected?.additionalInfo && (
                    <Card className="mt-4 w-full border-small border-divider bg-default-50 shadow-none">
                      <CardBody className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-medium bg-violet-100 p-2 text-violet-500">
                            <Icon icon="solar:map-point-bold" width="24" />
                          </div>
                          <div className="flex text-[15px] text-default-400">
                            <span>
                              {formik.values.selected?.additionalInfo.type === 'online'
                                ? 'Online'
                                : 'In-Person'}
                            </span>
                          </div>
                        </div>
                        {formik.values.selected?.additionalInfo.notes && (
                          <>
                            <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20" />
                            <div className="flex items-start gap-4">
                              <div className="rounded-medium bg-amber-100 p-2 text-amber-500">
                                <Icon icon="solar:notes-bold" width="24" />
                              </div>
                              <div className="flex text-[15px] text-default-400">
                                <span>{formik.values.selected?.additionalInfo.notes}</span>
                              </div>
                            </div>
                          </>
                        )}
                        {formik.values.selected?.additionalInfo.symptoms && (
                          <>
                            <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20" />
                            <div className="flex items-start gap-4">
                              <div className="rounded-medium bg-red-100 p-2 text-red-500">
                                <Icon icon="solar:health-bold" width="24" />
                              </div>
                              <div className="flex flex-wrap gap-2 text-[15px] text-default-400">
                                {formik.values.selected?.additionalInfo.symptoms
                                  .split(',')
                                  .map((symptom, index) => (
                                    <Chip
                                      key={index}
                                      className="p-5 font-medium capitalize text-default-400"
                                      variant="bordered"
                                      radius="md"
                                    >
                                      {symptom}
                                    </Chip>
                                  ))}
                              </div>
                            </div>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  )}
                </ScrollShadow>
              </ModalBody>
              <ModalFooter className="flex-col-reverse justify-center gap-2 sm:flex-row sm:gap-4">
                <Button
                  radius="lg"
                  variant="flat"
                  onPress={onClose}
                  className="min-w-[50%] p-6 font-medium"
                >
                  Back
                </Button>

                <ButtonGroup fullWidth className="min-w-[50%]" variant="flat">
                  <Button
                    className="p-6 font-medium"
                    variant="flat"
                    color={selectedItem?.color}
                    isLoading={isLoading[selectedOptionValue]}
                    onPress={() => {
                      if (selectedItem?.action) {
                        selectedItem.action();
                      } else {
                        formik.setFieldValue('modal', selectedOptionValue);
                      }
                    }}
                  >
                    {selectedItem?.label}
                  </Button>

                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button
                        className="py-6 font-medium"
                        variant="solid"
                        color={selectedItem?.color}
                        isIconOnly
                      >
                        <Icon icon="mynaui:chevron-down-solid" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      autoFocus={false}
                      aria-label="Appointment Options"
                      className="max-w-[300px]"
                      selectedKeys={[selectedOptionValue]}
                      selectionMode="single"
                      onSelectionChange={(keys) => {
                        setSelectedOption(keys as Set<string>);
                      }}
                      variant="flat"
                    >
                      {dropdownItems
                        .filter(
                          (item) =>
                            roleButton[session?.user?.role || 'user']?.includes(item.key) &&
                            statusButton[formik.values.selected?.status || 'booked']?.includes(
                              item.key
                            )
                        )
                        .map((item) => (
                          <DropdownItem
                            key={item.key}
                            color={item.color}
                            description={item.description}
                            startContent={<Icon icon={item.icon} width={24} />}
                          >
                            {item.label}
                          </DropdownItem>
                        ))}
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {modalMap[formik.values.modal as ActionType]}
    </>
  );
}

export function Title({ title, className }: { title: string; className?: string }) {
  return <h2 className={cn('text-large font-semibold', className)}>{title}</h2>;
}

export function Subtitle({ title, className }: { title: string; className?: string }) {
  return <h2 className={cn('font-semibold text-default-700', className)}>{title}</h2>;
}
