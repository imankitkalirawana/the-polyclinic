import { AppointmentType } from '@/types/appointment';
import {
  Button,
  ButtonGroup,
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
  Progress,
  Tooltip,
  User,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { CellRenderer } from '../../cell-renderer';
import { CLINIC_INFO } from '@/lib/config';
import { format } from 'date-fns';
import StatusRenderer from './status-renderer';
import { useIsMobile } from '@/hooks/use-mobile';
import { memo, useMemo, useCallback } from 'react';
import { useCalendarStore } from '../store';
import Link from 'next/link';

const DRAWER_DELAY = 200;

// Memoized subcomponents
const AppointmentHeading = memo(function AppointmentHeading({
  title,
  description,
}: {
  title: string;
  description?: string | React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-2 text-tiny font-medium uppercase tracking-wide text-default-500">
      <h2>{title}</h2>
      {description}
    </div>
  );
});

const MeetDirections = memo(function MeetDirections({
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
}) {
  return (
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
  );
});

// Extracted shared content component
const AppointmentContent = memo(function AppointmentContent({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  const patientDescription = useMemo(() => {
    const parts = [`Patient • #${appointment.patient.uid}`];

    if (appointment.patient.gender || appointment.patient.age) {
      const details = [appointment.patient.gender, appointment.patient.age]
        .filter(Boolean)
        .join(', ');
      parts.push(details);
    }

    return parts.join(' • ');
  }, [
    appointment.patient.uid,
    appointment.patient.gender,
    appointment.patient.age,
  ]);

  const doctorDescription = useMemo(() => {
    if (!appointment.doctor?.uid) return '';

    return [`Doctor • #${appointment.doctor.uid}`, appointment.doctor.sitting]
      .filter(Boolean)
      .join(' • ');
  }, [appointment.doctor?.uid, appointment.doctor?.sitting]);

  const appointmentModeContent = useMemo(() => {
    const isOnline = appointment.additionalInfo.type === 'online';

    return {
      icon: isOnline
        ? 'solar:videocamera-bold-duotone'
        : 'solar:map-bold-duotone',
      label: isOnline ? 'Online' : 'In-Person',
      meetIcon: isOnline ? 'logos:google-meet' : 'logos:google-maps',
      meetLabel: isOnline
        ? 'Join with Google Meet'
        : 'Get Directions to Clinic',
      meetDescription: isOnline
        ? 'meet.google.com/yzg-fdrq-sga'
        : CLINIC_INFO.location.address,
      iconColor: isOnline ? 'text-primary-500' : '',
    };
  }, [appointment.additionalInfo.type]);

  const hasAdditionalInfo = useMemo(() => {
    const { symptoms, notes, description, instructions } =
      appointment.additionalInfo;
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

      {hasAdditionalInfo && (
        <>
          <Divider className="my-2" />
          <div className="flex flex-col items-start gap-1">
            <AppointmentHeading title="Additional Information" />
            {appointment.additionalInfo.symptoms && (
              <CellRenderer
                label="Symptoms"
                icon="solar:notes-bold-duotone"
                value={appointment.additionalInfo.symptoms}
                className="p-0"
                classNames={{
                  icon: 'text-orange-500 bg-orange-50',
                  label: 'text-tiny',
                  value: 'text-tiny',
                }}
              />
            )}
            {appointment.additionalInfo.notes && (
              <CellRenderer
                label="Notes"
                icon="solar:notes-bold-duotone"
                value={appointment.additionalInfo.notes}
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
              />
            )}
          </div>
        </>
      )}
      <Divider className="my-2" />
    </>
  );
});

// Shared header component
const AppointmentHeader = memo(function AppointmentHeader({
  appointment,
  onClose,
}: {
  appointment: AppointmentType;
  onClose: () => void;
}) {
  const formattedDate = useMemo(
    () => format(new Date(appointment.date), 'EEEE, MMMM d · hh:mm a'),
    [appointment.date]
  );

  return (
    <div className="flex w-full flex-row items-start justify-between gap-8 rounded-none bg-primary-500 pr-2 text-primary-foreground">
      <div>
        <h2 className="text-large font-medium capitalize text-primary-foreground">
          #{appointment.aid} - {appointment.type}
        </h2>
        <div className="flex items-center gap-1">
          <StatusRenderer status={appointment.status} />
          &middot;
          <span className="text-tiny text-primary-foreground/90">
            {formattedDate}
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
              <Icon
                icon="solar:menu-dots-bold"
                className="rotate-90"
                width={18}
              />
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
          <Icon
            icon="solar:close-circle-bold-duotone"
            className="rotate-90"
            width={18}
          />
        </Button>
      </div>
    </div>
  );
});

// Shared footer component
const AppointmentFooter = memo(function AppointmentFooter() {
  return (
    <Progress
      showValueLabel
      value={50}
      color="primary"
      size="sm"
      className="mt-2"
      label={<AppointmentHeading title="Progress" />}
      valueLabel={<AppointmentHeading title="50%" />}
    />
  );
});

const AppointmentDrawerDesktop = memo(function AppointmentDrawerDesktop() {
  const { appointment, setAppointment, isTooltipOpen } = useCalendarStore();

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
      hideCloseButton={true}
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
              <AppointmentFooter />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
});

const AppointmentDrawerMobile = memo(function AppointmentDrawerMobile() {
  const { appointment, setAppointment, isTooltipOpen } = useCalendarStore();

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
      hideCloseButton={true}
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
              <AppointmentFooter />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default function AppointmentDrawer() {
  const isMobile = useIsMobile();

  return isMobile ? <AppointmentDrawerMobile /> : <AppointmentDrawerDesktop />;
}
