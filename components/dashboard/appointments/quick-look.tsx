'use client';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { Subtitle, Title } from '@/components/ui/typography/modal';
import { AppointmentType } from '@/models/Appointment';
import {
  Avatar,
  Button,
  ButtonGroup,
  cn,
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
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import CellRenderer from './cell-renderer';
import { buttonConfigByRole } from './config';
import { useQueryState } from 'nuqs';

interface QuickLookProps {
  onClose: () => void;
  item: AppointmentType;
}

export default function QuickLook({ onClose, item }: QuickLookProps) {
  const { data: session } = useSession();
  const [action, setAction] = useQueryState('action');

  // random number between 1 and 35
  const randomNumber = Math.floor(Math.random() * 34) + 1;
  const doctorAvatar = React.useMemo(
    () =>
      `https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_${randomNumber}.png`,
    []
  );
  const patientAvatar = React.useMemo(
    () =>
      `https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_${randomNumber + 1}.png`,
    []
  );

  // const role = session?.user?.role ?? 'user';
  const role = 'doctor';
  const buttons = buttonConfigByRole[role] || [];

  return (
    <Modal
      size="5xl"
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onClose={onClose}
    >
      <ModalContent className="h-[80vh] overflow-hidden">
        <ModalBody
          as={ScrollShadow}
          className="grid w-full grid-cols-3 gap-0 divide-x divide-divider p-0 scrollbar-hide"
        >
          <div className="col-span-2 grid h-fit grid-cols-2 divide-x divide-y divide-divider border-b border-divider">
            <div className="col-span-full h-fit p-4">
              <Title level={2} title="Appointment Details" />
            </div>
            <CellRenderer
              label="Appointment ID"
              value={item.aid}
              icon="solar:hashtag-circle-bold-duotone"
              classNames={{
                icon: 'text-purple-500 bg-purple-50',
              }}
            />
            <CellRenderer
              label="Appointment Status"
              value={renderChip({ item: item.status })}
              icon="solar:watch-square-minimalistic-bold-duotone"
              classNames={{
                icon: 'text-purple-500 bg-purple-50',
                label: 'mb-1',
              }}
            />
            <CellRenderer
              label="Email"
              value={item.patient.email}
              icon="solar:letter-bold-duotone"
              classNames={{
                icon: 'text-blue-500 bg-blue-50',
              }}
            />
            <CellRenderer
              label="Phone"
              value={item.patient.phone || 'N/A'}
              icon="solar:phone-bold-duotone"
              classNames={{
                icon: 'text-green-500 bg-green-50',
              }}
            />
            <CellRenderer
              label="Date & Time"
              value={format(new Date(item.date), 'MMM d, yyyy - h:mm a')}
              icon="solar:calendar-bold-duotone"
              classNames={{
                icon: 'text-yellow-500 bg-yellow-50',
              }}
            />
            <CellRenderer
              label="Mode"
              value={
                item.additionalInfo.type === 'online' ? 'Online' : 'In Clinic'
              }
              icon="solar:map-point-bold-duotone"
              classNames={{
                icon: 'text-teal-500 bg-teal-50',
              }}
            />
            <CellRenderer
              label="Doctor"
              value={
                item?.doctor?.name ? (
                  <div className="flex items-center gap-1">
                    <Image
                      src={doctorAvatar}
                      width={24}
                      height={24}
                      className="rounded-full bg-purple-200"
                    />
                    <span>{item?.doctor?.name}</span>
                  </div>
                ) : (
                  'Not Assigned'
                )
              }
              icon="solar:stethoscope-bold-duotone"
              classNames={{
                icon: 'text-purple-500 bg-purple-50',
              }}
              className={!item.doctor?.name ? 'bg-danger-50/50' : ''}
              cols={2}
            />
            {item.additionalInfo.symptoms && (
              <CellRenderer
                label="Symptoms"
                value={item.additionalInfo.symptoms || 'N/A'}
                icon="solar:notes-bold-duotone"
                classNames={{
                  icon: 'text-orange-500 bg-orange-50',
                }}
                cols={2}
              />
            )}
            {item.additionalInfo.notes && (
              <CellRenderer
                label="Notes"
                value={item.additionalInfo.notes || 'N/A'}
                icon="solar:notes-bold-duotone"
                classNames={{
                  icon: 'text-amber-500 bg-amber-50',
                }}
                cols={2}
              />
            )}
            {item.additionalInfo.description && (
              <CellRenderer
                label="Description"
                value={item.additionalInfo.description || 'N/A'}
                icon="solar:document-text-bold-duotone"
                classNames={{
                  icon: 'text-pink-500 bg-pink-50',
                }}
                cols={2}
              />
            )}
          </div>
          <div className="divide-y divide-divider">
            <div className="flex flex-col items-center gap-2 p-4">
              <Avatar src={patientAvatar} size="lg" className="bg-amber-100" />
              <div className="flex flex-col items-center">
                <h6 className="font-medium capitalize">{item.patient.name}</h6>
                <p className="text-sm capitalize text-default-500">
                  {item.patient.gender}, {item.patient.age} Years
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={
                    <Icon icon="solar:phone-bold-duotone" width="20" />
                  }
                  size="sm"
                >
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  startContent={
                    <Icon
                      icon="solar:chat-round-line-bold-duotone"
                      width="20"
                    />
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
                    {item.patient.uid}
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
                    {item.patient.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
                    `${window.location.hostname}/dashboard/appointments/${item.aid}`,
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
              >
                Add to Calendar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                color={btn.color}
                variant={btn.variant}
                startContent={
                  btn.icon ? <Icon icon={btn.icon} width="20" /> : undefined
                }
                onPress={() => btn.action(item)}
                isIconOnly={btn.isIconOnly}
                aria-label={btn.label}
              >
                {btn.isIconOnly ? null : btn.label}
              </Button>
            ))}
            <DownloadButton />
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DownloadButton() {
  const menuMap = {
    receipt: {
      label: 'Receipt',
      description: 'Download the appointment receipt',
      icon: 'solar:cloud-download-bold-duotone',
      classNames: 'text-blue-500 bg-blue-100',
      action: () => {
        console.log('receipt');
      },
    },
    prescription: {
      label: 'Prescription',
      description: 'Download the appointment prescription',
      icon: 'solar:download-square-bold-duotone',
      classNames: 'text-green-500 bg-green-100',
      action: () => {
        console.log('prescription');
      },
    },
    report: {
      label: 'Report',
      description: 'Download the final appointment report',
      icon: 'solar:file-download-bold-duotone',
      classNames: 'text-teal-500 bg-teal-100',
      action: () => {
        console.log('report');
      },
    },
  };

  return (
    <Dropdown placement="top-end">
      <DropdownTrigger>
        <Button size="sm" variant="light" isIconOnly>
          <Icon icon="solar:menu-dots-bold" width="20" className="rotate-90" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Download options"
        className="max-w-[300px]"
      >
        {Object.entries(menuMap).map(([key, value]) => (
          <DropdownItem
            key={key}
            description={value.description}
            startContent={
              <div
                className={cn(
                  'rounded-medium bg-red-50 p-2 text-red-400',
                  value.classNames
                )}
              >
                <Icon icon={value.icon} width="24" />
              </div>
            }
          >
            {value.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
