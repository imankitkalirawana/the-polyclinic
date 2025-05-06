'use client';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { Subtitle, Title } from '@/components/ui/typography/modal';
import { AppointmentType } from '@/models/Appointment';
import {
  addToast,
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ScrollShadow,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { useMemo, useCallback } from 'react';
import CellRenderer from './cell-renderer';
import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import RescheduleModal from '@/components/ui/appointments/reschedule-modal';
import { UserRole } from '@/models/User';
import { ActionType, ButtonConfig } from './types';
import CancelModal from '@/components/ui/appointments/cancel-modal';
import AsyncButton from '@/components/ui/buttons/async-button';
import { useAppointmentStore } from './store';
import { avatars } from '@/lib/avatar';

// Moved outside component to prevent recreation on each render
const permissions: Record<UserRole, Array<ActionType>> = {
  doctor: ['cancel', 'reschedule', 'reminder'],
  user: ['cancel', 'reschedule'],
  admin: ['cancel', 'delete', 'edit', 'reschedule', 'reminder'],
  nurse: ['cancel', 'reschedule'],
  receptionist: ['cancel', 'reschedule', 'reminder'],
  pharmacist: ['cancel', 'reschedule'],
  laboratorist: ['cancel', 'reschedule'],
};

const downloadOptions = [
  {
    label: 'Download Invoice',
    key: 'invoice',
    icon: 'solar:file-download-bold-duotone',
    action: () => {
      console.log('invoice');
    },
  },
  {
    label: 'Download Reports',
    key: 'reports',
    icon: 'solar:download-twice-square-bold-duotone',
    action: () => {
      console.log('invoice');
    },
  },
  {
    label: 'Download Prescription',
    key: 'prescription',
    icon: 'solar:notes-bold-duotone',
    action: () => {
      console.log('prescription');
    },
  },
];

function QuickLook(): React.ReactElement {
  const { selected, action, setSelected, setAction } = useAppointmentStore();
  const { data: session } = useSession();

  const appointment: AppointmentType = selected || ({} as AppointmentType);

  // Use session role or fallback to admin for demo
  const role = useMemo(
    () => session?.user?.role ?? 'admin',
    [session?.user?.role]
  );

  const ButtonMap: Record<ActionType, ButtonConfig> = useMemo(
    () => ({
      addToCalendar: {
        label: 'Add to Calendar',
        icon: 'solar:calendar-bold-duotone',
        color: 'warning',
        variant: 'flat',
        action: () => {
          console.log('addToCalendar');
        },
        content: (
          <AddToCalendar
            appointment={appointment}
            onClose={() => setAction(null)}
          />
        ),
      },
      reschedule: {
        label: 'Reschedule',
        icon: 'solar:calendar-bold-duotone',
        color: 'warning',
        variant: 'flat',
        action: () => {
          setAction('reschedule');
        },
        content: (
          <RescheduleModal
            appointment={appointment}
            onClose={() => setAction(null)}
          />
        ),
      },
      cancel: {
        label: 'Cancel',
        icon: 'solar:close-circle-bold-duotone',
        color: 'danger',
        variant: 'flat',
        action: () => {
          setAction('cancel');
        },
        content: (
          <CancelModal
            appointment={appointment}
            onClose={() => setAction(null)}
          />
        ),
      },
      delete: {
        label: 'Delete',
        icon: 'solar:trash-bin-minimalistic-bold-duotone',
        color: 'danger',
        variant: 'light',
        isIconOnly: true,
        action: () => {
          setAction('delete');
        },
        content: (
          <CancelModal
            appointment={appointment}
            onClose={() => setAction(null)}
            type="delete"
          />
        ),
      },
      edit: {
        label: 'Edit',
        icon: 'solar:pen-bold-duotone',
        variant: 'flat',
        action: () => {
          console.log('edit');
        },
      },
      reminder: {
        label: 'Send a Reminder to Patient',
        icon: 'solar:bell-bold-duotone',
        variant: 'flat',
        isIconOnly: true,
        action: async () => {
          // dummy 2 second delay
          await new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
            addToast({
              title: 'Reminder Sent',
              description: 'Reminder sent to patient',
              color: 'success',
            });
          });
        },
      },
    }),
    [appointment]
  );

  // Memoize available permissions for the current role
  const availablePermissions = useMemo(() => {
    return permissions[role as keyof typeof permissions] || [];
  }, [role]);

  // Memoize the action handling
  const handleAction = useCallback(
    (actionType: ActionType) => {
      ButtonMap[actionType].action(appointment);
    },
    [ButtonMap, appointment]
  );

  // Memoize the doctor and patient information sections
  const patientInfoSection = useMemo(
    () => (
      <div className="divide-y divide-divider">
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar
            src={
              appointment.patient.image ||
              avatars.memoji[Math.floor(Math.random() * avatars.memoji.length)]
            }
            size="lg"
          />
          <div className="flex flex-col items-center">
            <h6 className="font-medium capitalize">
              {appointment.patient.name}
            </h6>
            <p className="text-sm capitalize text-default-500">
              {appointment.patient.gender}, {appointment.patient.age} Years
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              color="primary"
              variant="flat"
              startContent={<Icon icon="solar:phone-bold-duotone" width="20" />}
              size="sm"
            >
              Call
            </Button>
            <Button
              size="sm"
              variant="bordered"
              startContent={
                <Icon icon="solar:chat-round-line-bold-duotone" width="20" />
              }
            >
              Message
            </Button>
            <Dropdown placement="bottom-end" aria-label="Patient actions">
              <DropdownTrigger>
                <Button size="sm" variant="bordered" isIconOnly>
                  <Icon
                    icon="solar:menu-dots-bold"
                    width="20"
                    className="rotate-90"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem
                  color="danger"
                  className="text-danger-500"
                  key="delete"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <Subtitle level={4} title="Patient Details" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="rounded-medium bg-orange-200 p-[5px] text-orange-400">
                  <Icon icon="solar:hashtag-circle-bold" width="24" />
                </div>
                <span className="capitalize text-default-400">UID</span>
              </div>
              <span className="capitalize text-default-foreground">
                {appointment.patient.uid}
              </span>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="rounded-medium bg-pink-200 p-[5px] text-pink-400">
                  <Icon icon="material-symbols:abc-rounded" width="24" />
                </div>
                <span className="capitalize text-default-400">Name</span>
              </div>
              <span className="capitalize text-default-foreground">
                {appointment.patient.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    [appointment.patient]
  );

  // Memoize the appointment details section
  const appointmentDetailsSection = useMemo(
    () => (
      <div className="col-span-2 grid h-fit grid-cols-2 divide-x divide-y divide-divider border-b border-divider">
        <div className="col-span-full h-fit p-4">
          <Title level={2} title="Appointment Details" />
        </div>
        <CellRenderer
          label="Appointment ID"
          value={appointment.aid}
          icon="solar:hashtag-circle-bold-duotone"
          classNames={{
            icon: 'text-purple-500 bg-purple-50',
          }}
        />
        <CellRenderer
          label="Appointment Status"
          value={renderChip({ item: appointment.status })}
          icon="solar:watch-square-minimalistic-bold-duotone"
          classNames={{
            icon: 'text-purple-500 bg-purple-50',
            label: 'mb-1',
          }}
        />
        <CellRenderer
          label="Email"
          value={appointment.patient.email}
          icon="solar:letter-bold-duotone"
          classNames={{
            icon: 'text-blue-500 bg-blue-50',
          }}
        />
        <CellRenderer
          label="Phone"
          value={appointment.patient.phone || 'N/A'}
          icon="solar:phone-bold-duotone"
          classNames={{
            icon: 'text-green-500 bg-green-50',
          }}
        />
        <CellRenderer
          label="Date & Time"
          value={format(new Date(appointment.date), 'MMM d, yyyy - h:mm a')}
          icon="solar:calendar-bold-duotone"
          classNames={{
            icon: 'text-yellow-500 bg-yellow-50',
          }}
        />
        <CellRenderer
          label="Mode"
          value={
            appointment.additionalInfo.type === 'online'
              ? 'Online'
              : 'In Clinic'
          }
          icon="solar:map-point-bold-duotone"
          classNames={{
            icon: 'text-teal-500 bg-teal-50',
          }}
        />
        <CellRenderer
          label="Doctor"
          value={
            appointment.doctor?.name ? (
              <div className="flex items-center gap-1">
                <Image
                  src={appointment.doctor?.image}
                  width={24}
                  height={24}
                  className="rounded-full bg-purple-200"
                />
                <span>{appointment.doctor?.name}</span>
              </div>
            ) : (
              'Not Assigned'
            )
          }
          icon="solar:stethoscope-bold-duotone"
          classNames={{
            icon: 'text-purple-500 bg-purple-50',
          }}
          className={!appointment.doctor?.name ? 'bg-danger-50/50' : ''}
          cols={2}
        />
        {appointment.additionalInfo.symptoms && (
          <CellRenderer
            label="Symptoms"
            value={appointment.additionalInfo.symptoms}
            icon="solar:notes-bold-duotone"
            classNames={{
              icon: 'text-orange-500 bg-orange-50',
            }}
            cols={2}
          />
        )}
        {appointment.additionalInfo.notes && (
          <CellRenderer
            label="Notes"
            value={appointment.additionalInfo.notes}
            icon="solar:notes-bold-duotone"
            classNames={{
              icon: 'text-amber-500 bg-amber-50',
            }}
            cols={2}
          />
        )}
        {appointment.additionalInfo.description && (
          <CellRenderer
            label="Description"
            value={appointment.additionalInfo.description}
            icon="solar:document-text-bold-duotone"
            classNames={{
              icon: 'text-pink-500 bg-pink-50',
            }}
            cols={2}
          />
        )}
      </div>
    ),
    [appointment]
  );

  // Memoize action buttons
  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {availablePermissions
          .filter((btn) => !['delete', 'edit'].includes(btn))
          .map((btn) => (
            <Tooltip
              key={btn}
              delay={500}
              isDisabled={!ButtonMap[btn].isIconOnly}
              content={ButtonMap[btn].label}
              color={ButtonMap[btn].color}
            >
              <AsyncButton
                variant={ButtonMap[btn].variant}
                startContent={<Icon icon={ButtonMap[btn].icon} width="20" />}
                onPress={() => handleAction(btn)}
                color={ButtonMap[btn].color}
                isIconOnly={ButtonMap[btn].isIconOnly}
                fn={async () => ButtonMap[btn].action(appointment)}
              >
                {ButtonMap[btn].isIconOnly ? null : ButtonMap[btn].label}
              </AsyncButton>
            </Tooltip>
          ))}
      </div>
    ),
    [availablePermissions, ButtonMap, handleAction, appointment]
  );

  return (
    <>
      <Modal
        size="5xl"
        isOpen
        backdrop="blur"
        scrollBehavior="inside"
        onClose={() => setSelected(null)}
      >
        <ModalContent className="h-[80vh] overflow-hidden">
          <ModalBody
            as={ScrollShadow}
            className="grid w-full grid-cols-3 gap-0 divide-x divide-divider p-0 scrollbar-hide"
          >
            {appointmentDetailsSection}
            {patientInfoSection}
          </ModalBody>
          <ModalFooter className="justify-between border-t border-divider">
            <div className="flex items-center gap-2">
              <Tooltip delay={500} content="Open in new tab">
                <Button
                  variant="flat"
                  startContent={
                    <Icon icon="solar:arrow-right-up-line-duotone" width="20" />
                  }
                  onPress={() => {
                    window.open(
                      `${window.location.hostname}/dashboard/appointments/${appointment.aid}`,
                      '_blank'
                    );
                  }}
                  isIconOnly
                ></Button>
              </Tooltip>
              {['doctor', 'user'].includes(role) && (
                <Button
                  variant="bordered"
                  startContent={<Icon icon="solar:calendar-bold" />}
                  onPress={() => {
                    setAction('addToCalendar');
                  }}
                >
                  Add to Calendar
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {actionButtons}

              <Dropdown placement="top-end">
                <DropdownTrigger>
                  <Button size="sm" variant="light" isIconOnly>
                    <Icon
                      icon="solar:menu-dots-bold"
                      width="20"
                      className="rotate-90"
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Download options"
                  className="max-w-[300px]"
                >
                  {downloadOptions.map((item) => (
                    <DropdownItem
                      key={item.key}
                      startContent={<Icon icon={item.icon} width="20" />}
                      onPress={() => item.action()}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                  {
                    availablePermissions
                      .filter(
                        (btn) =>
                          !['cancel', 'reschedule', 'reminder'].includes(btn)
                      )
                      .reverse()
                      .map((btn) => (
                        <DropdownItem
                          key={btn}
                          startContent={
                            <Icon icon={ButtonMap[btn].icon} width="20" />
                          }
                          color={ButtonMap[btn].color}
                          onPress={() => handleAction(btn)}
                        >
                          {ButtonMap[btn].label}
                        </DropdownItem>
                      )) as any
                  }
                </DropdownMenu>
              </Dropdown>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {action && ButtonMap[action]?.content}
    </>
  );
}

export default React.memo(QuickLook);
