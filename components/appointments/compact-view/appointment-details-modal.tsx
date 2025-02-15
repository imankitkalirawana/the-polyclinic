'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  Card,
  CardBody,
  Avatar,
  Button,
  Chip,
  ScrollShadow,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  ButtonGroup,
  DropdownTrigger,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useForm } from './context';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import RescheduleModal from '../modals/reschedule-modal';

interface DropdownItemProps {
  key: string;
  label: string;
  description?: string;
  icon: string;
  color: 'warning' | 'danger' | 'primary' | 'default' | 'secondary' | 'success';
  action?: () => void;
}

export type ActionType = 'reschedule' | 'decline' | 'download' | 'receipt';

export default function AppointmentDetailsModal() {
  const { formik } = useForm();

  const dropdownItems: DropdownItemProps[] = [
    {
      key: 'reschedule',
      label: 'Reschedule',
      description: 'Reschedule the appointment',
      icon: 'solar:clock-circle-bold-duotone',
      color: 'warning'
    },

    {
      label: 'Download Report',
      description: 'Download the appointment report',
      icon: 'solar:download-bold-duotone',
      key: 'download',
      color: 'primary',
      action: () => {
        toast('Download');
      }
    },
    {
      label: 'Receipt',
      description: 'Download the appointment receipt',
      icon: 'solar:document-text-bold-duotone',
      key: 'receipt',
      color: 'primary',
      action: () => {
        toast('Receipt');
      }
    },
    {
      label: 'Decline',
      description: 'Decline the appointment',
      icon: 'solar:close-circle-bold-duotone',
      key: 'decline',
      color: 'danger',
      action: () => {
        toast('Decline');
      }
    }
  ];

  const [selectedOption, setSelectedOption] = useState(new Set(['reschedule']));
  const selectedOptionValue = Array.from(selectedOption)[0] as ActionType;
  const selectedItem = dropdownItems.find(
    (item) => item.key === selectedOptionValue
  );

  useEffect(() => {
    if (formik.values.selected) {
      if (
        new Date(formik.values.selected.date) < new Date() &&
        formik.values.selected.status !== 'completed'
      ) {
        setSelectedOption(new Set(['reschedule']));
      } else if (new Date(formik.values.selected.date) > new Date()) {
        setSelectedOption(new Set(['decline']));
      } else if (formik.values.selected.status === 'completed') {
        setSelectedOption(new Set(['download']));
      } else if (formik.values.selected.status === 'cancelled') {
        setSelectedOption(new Set(['reschedule']));
      }
    }
  }, [formik.values.selected?.aid]);

  const modalMap: Record<ActionType, React.ReactNode> = {
    reschedule: <RescheduleModal />,
    decline: <RescheduleModal />,
    download: <RescheduleModal />,
    receipt: <RescheduleModal />
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
                <Button variant="light" isIconOnly size="sm">
                  <Icon icon="entypo:dots-two-vertical" width={18} />
                </Button>
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="no-scrollbar py-4 pb-12">
                  <Card className="min-h-20 border-2 border-divider shadow-none">
                    <CardBody className="flex-row items-center gap-6 p-4">
                      <Avatar
                        radius="md"
                        src="/assets/placeholder-avatar.jpeg"
                        name="John Doe"
                      />
                      <div className="flex flex-col gap-0">
                        <h3 className="font-semibold text-default-700">
                          {formik.values.selected?.patient?.name}
                        </h3>
                        <p className="text-sm capitalize text-default-400">
                          {formik.values.selected?.status}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="mt-4 flex flex-col">
                    <Subtitle title="Appointment info" />
                    <div className="mt-4 flex flex-col gap-4">
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
                      <div className="flex items-center gap-4">
                        <div className="rounded-medium bg-blue-100 p-2 text-blue-500">
                          <Icon icon="solar:tag-bold" width="24" height="24" />
                        </div>
                        <div className="flex text-[15px] text-default-400">
                          <span className="capitalize">
                            {formik.values.selected?.type}
                          </span>
                          <Icon icon="mdi:dot" width="24" height="24" />
                          <span>
                            {formik.values.selected?.additionalInfo.type ===
                            'online'
                              ? 'Online'
                              : 'In-person'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {formik.values.selected?.additionalInfo.notes && (
                    <div className="mt-4 flex flex-col">
                      <Subtitle title="Patient notes" />
                      <p className="mt-2 text-[15px] text-default-400">
                        {formik.values.selected?.additionalInfo.notes}
                      </p>
                    </div>
                  )}
                  {formik.values.selected?.additionalInfo.symptoms && (
                    <div className="mt-4 flex flex-col">
                      <Subtitle title="Symptoms" />
                      <div className="mt-4 flex gap-2">
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
                  Cancel
                </Button>

                <ButtonGroup fullWidth className="min-w-[50%]" variant="flat">
                  <Button
                    className="p-6 font-medium"
                    variant="flat"
                    color={selectedItem?.color}
                    onPress={() => {
                      formik.setFieldValue('modal', selectedOptionValue);
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
                      selectedKeys={selectedOption}
                      selectionMode="single"
                      onSelectionChange={(keys) => {
                        setSelectedOption(keys as Set<string>);
                      }}
                      variant="flat"
                    >
                      {dropdownItems.map((item) => (
                        <DropdownItem
                          color={item.color}
                          description={item.description}
                          startContent={<Icon icon={item.icon} width={24} />}
                          key={item.key}
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

export function Title({
  title,
  className
}: {
  title: string;
  className?: string;
}) {
  return (
    <>
      <h2 className={cn('text-lg font-semibold', className)}>{title}</h2>
    </>
  );
}

export function Subtitle({
  title,
  className
}: {
  title: string;
  className?: string;
}) {
  return (
    <>
      <h2 className={cn('font-semibold text-default-700', className)}>
        {title}
      </h2>
    </>
  );
}
