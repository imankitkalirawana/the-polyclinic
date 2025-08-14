import React, { memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Button,
  ButtonGroup,
  cn,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Tooltip,
  User,
} from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import StatusRenderer from './status-renderer';

import AsyncButton from '@/components/ui/buttons/async-button';
import { CellRenderer } from '@/components/ui/cell-renderer';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import useAppointmentButtonsInDrawer from '@/hooks/useAppointmentButton';
import { useIsMobile } from '@/hooks/useMobile';
import { CLINIC_INFO } from '@/lib/config';
import { useAppointmentWithAID } from '@/services/appointment';
import { useAppointmentStore } from '@/store/appointment';
import { AppointmentType } from '@/types/appointment';

const DRAWER_DELAY = 200;

// Memoized subcomponents
const AppointmentHeading = memo(
  ({
    title,
    description,
    className,
  }: {
    title: string;
    description?: string | React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 text-tiny font-medium uppercase tracking-wide text-default-500',
        className
      )}
    >
      <h2>{title}</h2>
      {description}
    </div>
  )
);

AppointmentHeading.displayName = 'AppointmentHeading';

const MeetDirections = memo(
  ({
    icon,
    label,
    description,
    onGetDirections,
    onCopy,
  }: {
    icon: string;
    label: string;
    description: string;
    onGetDirections?: () => void;
    onCopy?: () => void;
  }) => (
    <div className="mb-2 flex w-full items-start gap-4">
      <div className="flex w-full flex-col gap-1">
        <ButtonGroup className="justify-start">
          <Button
            color="primary"
            onPress={onGetDirections}
            startContent={<Icon icon={icon} width={12} />}
            fullWidth
          >
            {label}
          </Button>
          <Button isIconOnly color="primary" variant="flat" onPress={onCopy}>
            <Icon icon="solar:copy-linear" width={18} />
          </Button>
        </ButtonGroup>
        <span className="text-tiny text-default-500">{description}</span>
      </div>
    </div>
  )
);

MeetDirections.displayName = 'MeetDirections';

// Extracted shared content component
const AppointmentContent = memo(({ appointment }: { appointment: AppointmentType }) => {
  const { data: previousAppointment, isLoading } = useAppointmentWithAID(
    appointment?.previousAppointment || 0
  );

  const patientDescription = useMemo(() => {
    const parts = [`Patient • #${appointment.patient.uid}`];

    if (appointment.patient.gender || appointment.patient.age) {
      const details = [appointment.patient.gender, appointment.patient.age]
        .filter(Boolean)
        .join(', ');
      parts.push(details);
    }

    return parts.join(' • ');
  }, [appointment.patient.uid, appointment.patient.gender, appointment.patient.age]);

  const doctorDescription = useMemo(() => {
    if (!appointment.doctor?.uid) return '';

    return [`Doctor • #${appointment.doctor.uid}`, appointment.doctor.seating]
      .filter(Boolean)
      .join(' • ');
  }, [appointment.doctor?.uid, appointment.doctor?.seating]);

  const appointmentModeContent = useMemo(() => {
    const isOnline = appointment.additionalInfo.type === 'online';

    return {
      icon: isOnline ? 'solar:videocamera-bold-duotone' : 'solar:map-bold-duotone',
      label: isOnline ? 'Online' : 'In-Person',
      meetIcon: isOnline ? 'logos:google-meet' : 'logos:google-maps',
      meetLabel: isOnline ? 'Join with Google Meet' : 'Get Directions to Clinic',
      meetDescription: isOnline ? 'meet.google.com/yzg-fdrq-sga' : CLINIC_INFO.location.address,
      iconColor: isOnline ? 'text-primary-500' : '',
    };
  }, [appointment.additionalInfo.type]);

  const hasAdditionalInfo = useMemo(() => {
    const { symptoms, notes, description, instructions } = appointment.additionalInfo;
    return !!(symptoms || notes || description || instructions);
  }, [appointment.additionalInfo]);

  // Event handlers
  const handleGetDirections = useCallback(() => {
    // Implementation for getting directions
    console.log('Get directions');
  }, []);

  const handleCopy = useCallback(() => {
    // Implementation for copying
    console.log('Copy');
  }, []);

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <AppointmentHeading title="PEOPLE" />
        <User
          name={appointment.patient.name}
          avatarProps={{
            src: appointment.patient.image,
            size: 'sm',
            name: appointment.patient.name,
          }}
          classNames={{
            description: 'text-default-400 text-tiny',
          }}
          description={patientDescription}
        />
        {!!appointment.doctor?.uid && (
          <User
            name={appointment.doctor.name}
            avatarProps={{
              src: appointment.doctor.image,
              size: 'sm',
              name: appointment.doctor.name,
            }}
            classNames={{
              description: 'text-default-400 text-tiny',
            }}
            description={doctorDescription}
          />
        )}
        {appointment.previousAppointment && (
          <>
            <AppointmentHeading
              className="mt-2"
              title="LINKED APPOINTMENT"
              description={
                <Link
                  className="flex items-center gap-0.5 underline hover:text-primary"
                  href={`/appointments/${appointment.previousAppointment}`}
                  target="_blank"
                >
                  #{appointment.previousAppointment}
                  <Icon icon="solar:round-arrow-right-up-linear" width={13} />
                </Link>
              }
            />
            {isLoading ? (
              <div className="flex w-full items-center gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              !!previousAppointment && (
                <div className="flex items-center gap-2">
                  {renderChip({
                    item: previousAppointment?.status,
                  })}
                  <span className="text-tiny text-default-500">
                    {format(new Date(previousAppointment?.date || ''), 'EEEE, MMMM d · hh:mm a')}
                  </span>
                </div>
              )
            )}
          </>
        )}
      </div>

      <Divider className="my-2" />

      <div className="flex flex-col items-start gap-1">
        <AppointmentHeading
          title="Appointment Mode"
          description={
            <div className="flex items-center gap-1">
              <Icon
                icon={appointmentModeContent.icon}
                className={appointmentModeContent.iconColor}
                width={12}
              />
              <span className="capitalize">{appointmentModeContent.label}</span>
            </div>
          }
        />
        <MeetDirections
          icon={appointmentModeContent.meetIcon}
          label={appointmentModeContent.meetLabel}
          description={appointmentModeContent.meetDescription}
          onGetDirections={handleGetDirections}
          onCopy={handleCopy}
        />
      </div>

      {hasAdditionalInfo ? (
        <>
          <Divider className="my-2" />
          <div className="flex flex-col items-start gap-1">
            <AppointmentHeading title="Additional Information" />
            {appointment.additionalInfo.symptoms && (
              <CellRenderer
                label="Symptoms"
                icon="solar:heart-pulse-bold-duotone"
                value={appointment.additionalInfo.symptoms}
                className="p-0"
                classNames={{
                  icon: 'text-orange-500 bg-orange-50',
                }}
              />
            )}
            {appointment.additionalInfo.notes && (
              <CellRenderer
                label="Notes"
                icon="solar:notes-bold-duotone"
                value={appointment.additionalInfo.notes}
                className="p-0"
                classNames={{
                  icon: 'text-amber-500 bg-amber-50',
                }}
              />
            )}
            {appointment.additionalInfo.description && (
              <CellRenderer
                label="Description"
                icon="solar:document-text-bold-duotone"
                value={appointment.additionalInfo.description}
                className="p-0"
                classNames={{
                  icon: 'text-pink-500 bg-pink-50',
                }}
              />
            )}
            {appointment.additionalInfo.instructions && (
              <CellRenderer
                label="Instructions"
                icon="solar:document-text-bold-duotone"
                value={appointment.additionalInfo.instructions}
                className="p-0"
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-1">
          <AppointmentHeading title="No Additional Information" />
          <span className="text-tiny text-default-400">
            There are no additional details for this appointment.
          </span>
        </div>
      )}
    </>
  );
});

AppointmentContent.displayName = 'AppointmentContent';

// Shared header component
const AppointmentHeader = memo(
  ({ appointment, onClose }: { appointment: AppointmentType; onClose: () => void }) => {
    const formattedDate = useMemo(
      () => format(new Date(appointment.date), 'EEEE, MMMM d · hh:mm a'),
      [appointment.date]
    );

    return (
      <div className="flex w-full flex-row items-start justify-between gap-8 rounded-none pr-2">
        <div>
          <div className="flex items-center gap-1">
            <h2 className="text-large font-medium capitalize text-primary-foreground">
              #{appointment.aid} - {appointment.type}
            </h2>
            {appointment.type === 'emergency' && (
              <Icon icon="solar:danger-triangle-bold" className="animate-pulse text-warning-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <StatusRenderer status={appointment.status} />
            &middot;
            <span className="text-tiny text-primary-foreground/90">{formattedDate}</span>
          </div>
        </div>

        <div>
          <Tooltip content="Open in new Tab">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              className="text-primary-foreground"
              as={Link}
              href={`/appointments/${appointment.aid}`}
              target="_blank"
            >
              <Icon icon="solar:arrow-right-up-line-duotone" width={18} />
            </Button>
          </Tooltip>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                className="text-primary-foreground"
              >
                <Icon icon="solar:menu-dots-bold" className="rotate-90" width={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="duplicate">Duplicate</DropdownItem>
              <DropdownItem key="share">Share</DropdownItem>
              <DropdownItem key="export">Export</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            className="text-primary-foreground"
            onPress={onClose}
          >
            <Icon icon="solar:close-circle-bold-duotone" className="rotate-90" width={18} />
          </Button>
        </div>
      </div>
    );
  }
);

AppointmentHeader.displayName = 'AppointmentHeader';

// Shared footer component
const AppointmentFooter = memo(({ appointment }: { appointment: AppointmentType }) => {
  const { action } = useAppointmentStore();
  const { data: session } = useSession();
  const buttons = useAppointmentButtonsInDrawer({
    selected: appointment,
    role: session?.user?.role || 'user',
  });

  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      {buttons.map((button) => {
        const isButtonIconOnly = button.isIconOnly || buttons.length > 3;

        return (
          <Tooltip
            key={button.key}
            delay={500}
            content={button.children}
            isDisabled={!isButtonIconOnly}
            color={button.color}
          >
            <AsyncButton
              color={button.color}
              variant={button.variant}
              isIconOnly={isButtonIconOnly}
              fullWidth
              whileSubmitting={button.whileLoading}
              fn={async () => {
                if (button.onPress) {
                  await button.onPress();
                }
              }}
              startContent={button.startContent}
            >
              {isButtonIconOnly ? null : button.children}
            </AsyncButton>
          </Tooltip>
        );
      })}
      {buttons.find((btn) => btn.key === action)?.content}
    </div>
  );
});

AppointmentFooter.displayName = 'AppointmentFooter';

const AppointmentDrawerDesktop = memo(() => {
  const { appointment, setAppointment, isTooltipOpen } = useAppointmentStore();

  if (!appointment) return null;

  return (
    <Drawer
      placement="right"
      shouldBlockScroll
      isOpen={!!appointment}
      onOpenChange={(open) => {
        if (!open && !isTooltipOpen) {
          setTimeout(() => {
            setAppointment(null);
          }, DRAWER_DELAY);
        }
      }}
      hideCloseButton
      scrollBehavior="inside"
    >
      <DrawerContent className="p-0">
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-row items-start justify-between gap-8 rounded-none border-b border-divider bg-primary-500 pr-2 text-primary-foreground">
              <AppointmentHeader appointment={appointment} onClose={onClose} />
            </DrawerHeader>
            <DrawerBody>
              <AppointmentContent appointment={appointment} />
            </DrawerBody>
            <DrawerFooter>
              <AppointmentFooter appointment={appointment} />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
});

AppointmentDrawerDesktop.displayName = 'AppointmentDrawerDesktop';

const AppointmentDrawerMobile = memo(() => {
  const { appointment, setAppointment, isTooltipOpen } = useAppointmentStore();

  if (!appointment) return null;

  return (
    <Modal
      backdrop="blur"
      placement="bottom"
      shouldBlockScroll
      isOpen={!!appointment}
      onOpenChange={(open) => {
        if (!open && !isTooltipOpen) {
          setTimeout(() => {
            setAppointment(null);
          }, DRAWER_DELAY);
        }
      }}
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent className="rounded-b-none p-0 sm:rounded-b-large">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row items-start justify-between gap-8 rounded-t-large border-b border-divider bg-primary-500 pr-2 text-primary-foreground">
              <AppointmentHeader appointment={appointment} onClose={onClose} />
            </ModalHeader>
            <ModalBody>
              <AppointmentContent appointment={appointment} />
            </ModalBody>
            <ModalFooter>
              <AppointmentFooter appointment={appointment} />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

AppointmentDrawerMobile.displayName = 'AppointmentDrawerMobile';

export default function AppointmentDrawer() {
  const isMobile = useIsMobile();

  return isMobile ? <AppointmentDrawerMobile /> : <AppointmentDrawerDesktop />;
}
