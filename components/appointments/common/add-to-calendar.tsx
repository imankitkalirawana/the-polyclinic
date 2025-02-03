'use client';
import {
  addToGoogleCalendar,
  addToOutlookCalendar,
  handleAddToCalendar
} from '@/lib/client-functions';
import { EventType } from '@/lib/interface';
import { AppointmentType } from '@/models/Appointment';
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ModalBody,
  ModalHeader
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';

export default function AddtoCalendar({
  appointment
}: {
  appointment: AppointmentType;
}) {
  type ActionType = 'google' | 'outlook' | 'download';

  const [selectedOption, setSelectedOption] = useState(new Set(['google']));
  const selectedOptionValue = Array.from(selectedOption)[0] as ActionType;

  const labelsMap = {
    google: 'Add to Google Calendar',
    outlook: 'Add to Outlook Calendar',
    download: 'Download ICS File'
  };

  const buttonIconMap = {
    google: 'logos:google-calendar',
    outlook: 'vscode-icons:file-type-outlook',
    download: 'solar:download-square-bold'
  };

  const appointmentDate = new Date(appointment.date);
  appointmentDate.setMinutes(appointmentDate.getMinutes() + 15);

  const event: EventType = {
    title: 'Appointment with ' + appointment.name,
    description: 'Appointment with ' + appointment.name,
    location: appointment.type === 'online' ? 'Online' : 'Clinic',
    start: new Date(appointment.date),
    end: new Date(appointmentDate),
    duration: [1, 'hour'],
    busy: true
  };

  const handleSubmit = (action: ActionType) => {
    switch (action) {
      case 'google':
        addToGoogleCalendar(event);
        break;
      case 'outlook':
        addToOutlookCalendar(event);
        break;
      case 'download':
        handleAddToCalendar(event);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ModalHeader className="flex-col items-start gap-2">
        <h2 className="max-w-xs text-center text-base">Add to Calendar</h2>
        <p className="text-sm font-normal text-default-500">
          Add this appointment to your calendar by downloading the{' '}
          <span className="font-medium text-foreground">event file</span> or
          adding it to your{' '}
          <span className="font-medium text-foreground">Google</span> or{' '}
          <span className="font-medium text-foreground">Outlook</span> calendar
        </p>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <ButtonGroup fullWidth variant="flat">
            <Button
              onPress={() => handleSubmit(selectedOptionValue)}
              startContent={<Icon icon={buttonIconMap[selectedOptionValue]} />}
              color="primary"
              variant="flat"
            >
              {labelsMap[selectedOptionValue]}
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button variant="solid" color="primary" isIconOnly>
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
                onSelectionChange={(keys) =>
                  setSelectedOption(keys as Set<string>)
                }
              >
                <DropdownItem key="google">{labelsMap['google']}</DropdownItem>
                <DropdownItem key="outlook">
                  {labelsMap['outlook']}
                </DropdownItem>
                <DropdownItem key="download">
                  {labelsMap['download']}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
      </ModalBody>
    </>
  );
}
