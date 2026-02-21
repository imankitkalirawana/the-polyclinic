import React, { memo, useMemo } from 'react';
import { useSession } from '@/libs/providers/session-provider';
import {
  addToast,
  Alert,
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
  Link,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  DropdownMenu,
} from '@heroui/react';
import { formatDate } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import AsyncButton from '@/components/ui/buttons/async-button';
import useAppointmentButtonsInDrawer from '@/services/client/appointment/hooks/useAppointmentButton';
import { useIsMobile } from '@/hooks/useMobile';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { AppointmentQueue, PaymentMode, QueueStatus } from '@repo/store';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useClipboard } from '@/hooks/useClipboard';
import { UserDetailsPopover } from './user-details-popover';
import { UserRole } from '@repo/store';
import { useAppointmentQueueWithAID } from '@/services/client/appointment/queue/queue.query';
import RenderChip from '@/components/ui/new-data-table/cell-renderer/render-chip';

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
        'text-default-500 text-tiny flex w-full items-center justify-between gap-2 font-medium tracking-wide uppercase',
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
        <span className="text-default-500 text-tiny">{description}</span>
      </div>
    </div>
  )
);

MeetDirections.displayName = 'MeetDirections';

// Extracted shared content component
// TODO: FIX THIS
const AppointmentContent = memo(({ appointment }: { appointment: AppointmentQueue }) => {
  const clipboard = useClipboard({ timeout: 3000 });
  const { organization } = useSession();
  const location = organization?.organizationDetails?.location || '';

  const patientDescription = useMemo(() => {
    const parts = [`Patient • #${appointment.patient.name}`];

    if (appointment.patient.gender || appointment.patient.age) {
      const details = [appointment.patient.gender, appointment.patient.age]
        .filter(Boolean)
        .join(', ');
      parts.push(details);
    }

    return parts.join(' • ');
  }, [appointment.patient.name, appointment.patient.gender, appointment.patient.age]);

  const doctorDescription = useMemo(() => {
    if (!appointment.doctor?.name) return '';

    return [`Doctor • #${appointment.doctor.name}`, appointment.doctor.seating]
      .filter(Boolean)
      .join(' • ');
  }, [appointment.doctor?.name, appointment.doctor?.seating]);

  const appointmentModeContent = useMemo(() => {
    const isOnline = appointment.paymentMode === PaymentMode.RAZORPAY;

    return {
      isOnline,
      icon: isOnline ? 'solar:videocamera-bold-duotone' : 'solar:map-bold-duotone',
      label: isOnline ? 'Online' : 'In-Person',
      meetIcon: isOnline ? 'logos:google-meet' : 'logos:google-maps',
      meetLabel: isOnline ? 'Join with Google Meet' : 'Get Directions to Clinic',
      meetDescription: isOnline ? 'meet.google.com/yzg-fdrq-sga' : location,
      iconColor: isOnline ? 'text-primary-500' : '',
    };
  }, [appointment.paymentMode]);

  // Event handlers
  const handleGetDirections = () => {
    if (location) {
      window.open(location, '_blank');
    }
  };

  const handleCopy = () => {
    if (location) {
      clipboard.copy(location);
      addToast({
        title: 'Location copied to clipboard',
        color: 'success',
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <AppointmentHeading title="PEOPLE" />
        <UserDetailsPopover
          id={appointment.patient.user_id}
          name={appointment.patient.name}
          description={patientDescription}
        />
        {!!appointment.doctor?.id && (
          <UserDetailsPopover
            id={appointment.doctor.user_id}
            name={appointment.doctor.name}
            description={doctorDescription}
          />
        )}
      </div>

      {[QueueStatus.BOOKED, QueueStatus.CALLED, QueueStatus.IN_CONSULTATION].includes(
        appointment.status
      ) && (
        <>
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
            {!appointmentModeContent.isOnline && organization?.organizationDetails?.location && (
              <MeetDirections
                icon={appointmentModeContent.meetIcon}
                label={appointmentModeContent.meetLabel}
                description={appointmentModeContent.meetDescription}
                onGetDirections={handleGetDirections}
                onCopy={handleCopy}
              />
            )}
          </div>
        </>
      )}
    </>
  );
});

AppointmentContent.displayName = 'AppointmentContent';

// Shared header component
const AppointmentHeader = memo(
  ({ appointment, onClose }: { appointment: AppointmentQueue; onClose: () => void }) => {
    return (
      <div className="flex w-full flex-row items-start justify-between gap-8 rounded-none pr-2">
        <div>
          <div className="flex items-center gap-1">
            <h2
              className={cn('text-primary-foreground text-large font-medium capitalize', {
                'line-through': appointment.status === QueueStatus.CANCELLED,
              })}
            >
              {appointment.aid}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <RenderChip value={appointment.status} />
            <span className="text-primary-foreground/90 text-tiny">
              {formatDate(new Date(appointment.appointmentDate), 'EE, MMMM d')}
            </span>
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
const AppointmentFooter = memo(({ appointment }: { appointment: AppointmentQueue }) => {
  const { action } = useAppointmentStore();
  const { user } = useSession();
  const buttons = useAppointmentButtonsInDrawer({
    selected: appointment,
    role: user?.role as UserRole,
  });

  return appointment.status === QueueStatus.CANCELLED && user?.role === UserRole.PATIENT ? (
    <Alert
      color="warning"
      title="Cancelled"
      description={
        <>
          <p>This appointment has been cancelled.</p>
        </>
      }
    />
  ) : (
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
              onPress={async () => {
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

type AppointmentDrawerProps = {
  aid: string | null;
  setAid: (aid: string | null) => void;
  isTooltipOpen: boolean;
};

const AppointmentDrawerDesktop = memo(({ aid, setAid, isTooltipOpen }: AppointmentDrawerProps) => {
  const { data: appointment, isLoading } = useAppointmentQueueWithAID(aid);

  return (
    <Drawer
      placement="right"
      shouldBlockScroll
      isOpen={!!aid}
      onOpenChange={(open) => {
        if (!open && !isTooltipOpen) {
          setTimeout(() => {
            setAid(null);
          }, DRAWER_DELAY);
        }
      }}
      hideCloseButton
      scrollBehavior="inside"
    >
      <DrawerContent className="p-0">
        {(onClose) => (
          <>
            {isLoading ? (
              <MinimalPlaceholder message="Loading appointment..." />
            ) : (
              appointment && (
                <>
                  <DrawerHeader className="border-divider bg-primary-500 text-primary-foreground flex flex-row items-start justify-between gap-8 rounded-none border-b pr-2">
                    <AppointmentHeader appointment={appointment} onClose={onClose} />
                  </DrawerHeader>
                  <DrawerBody>
                    <AppointmentContent appointment={appointment} />
                  </DrawerBody>
                  <DrawerFooter>
                    <AppointmentFooter appointment={appointment} />
                  </DrawerFooter>
                </>
              )
            )}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
});

AppointmentDrawerDesktop.displayName = 'AppointmentDrawerDesktop';

const AppointmentDrawerMobile = memo(({ aid, setAid, isTooltipOpen }: AppointmentDrawerProps) => {
  const { data: appointment, isLoading } = useAppointmentQueueWithAID(aid);

  return (
    <Modal
      backdrop="blur"
      placement="bottom"
      shouldBlockScroll
      isOpen={!!aid}
      onOpenChange={(open) => {
        if (!open && !isTooltipOpen) {
          setTimeout(() => {
            setAid(null);
          }, DRAWER_DELAY);
        }
      }}
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent className="sm:rounded-b-large rounded-b-none p-0">
        {(onClose) => (
          <>
            {isLoading ? (
              <MinimalPlaceholder message="Loading appointment..." />
            ) : (
              appointment && (
                <>
                  <ModalHeader className="rounded-t-large border-divider bg-primary-500 text-primary-foreground flex flex-row items-start justify-between gap-8 border-b pr-2">
                    <AppointmentHeader appointment={appointment} onClose={onClose} />
                  </ModalHeader>
                  <ModalBody>
                    <AppointmentContent appointment={appointment} />
                  </ModalBody>
                  <ModalFooter>
                    <AppointmentFooter appointment={appointment} />
                  </ModalFooter>
                </>
              )
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

AppointmentDrawerMobile.displayName = 'AppointmentDrawerMobile';

export default function AppointmentDrawer() {
  const { aid, setAid, isTooltipOpen } = useAppointmentStore();
  const isMobile = useIsMobile();

  return isMobile ? (
    <AppointmentDrawerMobile aid={aid} setAid={setAid} isTooltipOpen={isTooltipOpen} />
  ) : (
    <AppointmentDrawerDesktop aid={aid} setAid={setAid} isTooltipOpen={isTooltipOpen} />
  );
}
