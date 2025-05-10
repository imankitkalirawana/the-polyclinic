'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  addToast,
  Button,
  Link,
  Modal,
  ModalContent,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import AsyncButton from '../../ui/buttons/async-button';
import CellValue from '../../ui/cell-value';
import AddtoCalendar from '../../ui/appointments/add-to-calendar';
import CancelAppointment from '../common/cancel-appointement';
import RescheduleAppointment from '../common/reschedule-appointment';

import { downloadAppointmentReceipt } from '@/functions/client/appointment/receipt';
import {
  changeAppointmentStatus,
  getUserWithUID,
} from '@/functions/server-actions';
import { buttonColorMap, genderMap } from '@/lib/maps';
import { AppointmentType } from '@/models/Appointment';
import { UserType } from '@/models/User';

export default function AppointmentDetail({
  appointment,
  setAppointments,
  session,
}: {
  appointment: AppointmentType;
  setAppointments?: any;
  session: any;
}) {
  const modal = useDisclosure();

  const [user, setUser] = useState<UserType>();
  const [selectedModal, setSelectedModal] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (appointment?.patient?.uid) {
        await getUserWithUID(appointment?.patient.uid).then((user) => {
          setUser(user as UserType);
        });
      }
    };
    fetchData();
  }, []);

  const modalMap: Record<string, JSX.Element> = {
    cancel: (
      <CancelAppointment
        appointment={appointment}
        modal={modal}
        setAppointments={setAppointments}
      />
    ),
    download: <div>Download</div>,
    reschedule: (
      <RescheduleAppointment
        appointment={appointment}
        modal={modal}
        setAppointments={setAppointments}
      />
    ),
    addToCalendar: (
      <AddtoCalendar
        appointment={appointment}
        onClose={() => modal.onClose()}
      />
    ),
  };

  function handleButtonClick(action: string) {
    if (action === 'download') {
      addToast({
        title: 'Downloading reports',
        description: 'Downloading reports',
        color: 'success',
      });
      return;
    }

    setSelectedModal(action);
    modal.onOpen();
  }

  return (
    <>
      <div className="flex w-full gap-4">
        <div className="hidden min-w-24 max-w-24 flex-col justify-between gap-8 sm:flex sm:min-w-40 sm:max-w-40">
          <CellValue label="Indian Standard Time" value="UTC +05:30" />
          <div className="flex flex-col-reverse gap-2">
            {new Date() < new Date(appointment.date) &&
              ['booked', 'confirmed', 'in-progress'].includes(
                appointment.status
              ) &&
              ['doctor', 'user'].includes(session.user.role) && (
                <Button
                  color="secondary"
                  variant="bordered"
                  onPress={() => handleButtonClick('addToCalendar')}
                  startContent={<Icon icon="solar:calendar-bold" />}
                >
                  Add to Calendar
                </Button>
              )}
            {!['completed'].includes(appointment.status) && (
              <AsyncButton
                variant="flat"
                startContent={
                  <Icon icon="solar:download-minimalistic-bold" width={18} />
                }
                fn={async () => {
                  await downloadAppointmentReceipt(appointment.aid);
                }}
                whileSubmitting="Downloading..."
              >
                Receipt
              </AsyncButton>
            )}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 flex-col gap-x-4 border-l-divider sm:border-l sm:pl-4 md:grid-cols-2">
          <CellValue
            label="Appointment ID"
            value={`#${appointment.aid}`}
            className="justify-start gap-4"
          />
          <CellValue
            label="Patient"
            value={appointment.patient.name}
            className="justify-start gap-4"
          />
          <CellValue
            label="Gender"
            value={
              <div className="flex items-center gap-1">
                <Icon icon={genderMap[user?.gender || 'male']} />
                <span className="capitalize">{user?.gender}</span>
              </div>
            }
            className="justify-start gap-4"
          />
          <CellValue
            label="Phone"
            value={
              appointment.patient?.phone
                ? `+91 ${appointment.patient.phone}`
                : 'N/A'
            }
            className="justify-start gap-4"
          />
          <CellValue
            label="Email"
            value={appointment.patient.email}
            className="justify-start gap-4"
          />
          <CellValue
            label="Doctor"
            value={appointment.doctor?.name || 'N/A'}
            className="justify-start gap-4"
          />
          <CellValue
            label="Date & Time"
            value={format(appointment.date, 'PPp')}
            className="justify-start gap-4"
          />
          <CellValue
            label="Location"
            value={
              <p className="capitalize">{appointment.additionalInfo.type}</p>
            }
            className="justify-start gap-4"
          />
          {appointment.additionalInfo.notes && (
            <CellValue
              label="Appointment Notes"
              value={appointment?.additionalInfo.notes}
              className="items-start justify-start gap-4"
            />
          )}
          <CellValue
            label={`Booked on: ${format(appointment?.createdAt as Date, 'PPp')}`}
            value={null}
          />
          <div className="col-span-full flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex w-full items-center gap-2">
              {['booked', 'confirmed', 'overdue'].includes(
                appointment.status
              ) && (
                <Button
                  color={buttonColorMap['reschedule']}
                  onPress={() => handleButtonClick('reschedule')}
                  variant="flat"
                  className="w-full sm:w-fit"
                  startContent={<Icon icon="solar:calendar-bold" />}
                >
                  Reschedule
                </Button>
              )}
              {['booked', 'confirmed', 'in-progress'].includes(
                appointment.status
              ) &&
                ['doctor', 'user'].includes(session.user.role) && (
                  <div className="sm:hidden">
                    <Tooltip content="Add to Calendar" color="secondary">
                      <Button
                        color="secondary"
                        variant="bordered"
                        onPress={() => handleButtonClick('addToCalendar')}
                        startContent={<Icon icon="solar:calendar-bold" />}
                        isIconOnly
                      />
                    </Tooltip>
                  </div>
                )}
            </div>
            <div className="flex w-full items-center gap-2 sm:w-fit">
              {['completed'].includes(appointment.status) && (
                <Button
                  className="w-full sm:w-fit"
                  variant="bordered"
                  color={buttonColorMap['download']}
                >
                  <Icon icon="solar:download-minimalistic-bold" />
                  Download
                </Button>
              )}
              {[
                'booked',
                'overdue',
                'confirmed',
                'in-progress',
                'on-hold',
              ].includes(appointment.status) && (
                <Button
                  className="w-full sm:w-fit"
                  color={buttonColorMap['cancel']}
                  onPress={() => handleButtonClick('cancel')}
                  variant="bordered"
                  startContent={<Icon icon="tabler:x" />}
                >
                  Cancel
                </Button>
              )}
              {['in-progress', 'confirmed', 'on-hold'].includes(
                appointment.status
              ) &&
                ['doctor', 'admin'].includes(session.user.role) && (
                  <Button
                    className="w-full sm:w-fit"
                    color={buttonColorMap['complete']}
                    variant="flat"
                    as={Link}
                    href={`/appointments/${appointment.patient.uid}/complete`}
                    endContent={<Icon icon="tabler:arrow-right" />}
                  >
                    Proceed
                  </Button>
                )}

              {['booked'].includes(appointment.status) &&
                ['doctor', 'admin'].includes(session.user.role) && (
                  <Button
                    className="w-full sm:w-fit"
                    color={buttonColorMap['accept']}
                    variant="flat"
                    isLoading={isConfirming}
                    startContent={<Icon icon="tabler:check" />}
                    onPress={async () => {
                      setIsConfirming(true);
                      await changeAppointmentStatus(
                        appointment._id,
                        'confirmed'
                      )
                        .then(() => {
                          addToast({
                            title: 'Appointment confirmed',
                            description: 'The appointment has been confirmed',
                            color: 'success',
                          });
                          setAppointments((prev: AppointmentType[]) => {
                            const updatedAppointments = prev.map((item) => {
                              if (item._id === appointment._id) {
                                return {
                                  ...item,
                                  status: 'confirmed',
                                };
                              }
                              return item;
                            });
                            return updatedAppointments;
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                          addToast({
                            title: 'Error',
                            description: 'An error occurred',
                            color: 'danger',
                          });
                        })
                        .finally(() => {
                          setIsConfirming(false);
                        });
                    }}
                  >
                    Accept
                  </Button>
                )}
              <div className="sm:hidden">
                {!['completed'].includes(appointment.status) && (
                  <Tooltip content="Download Receipt">
                    <AsyncButton
                      variant="flat"
                      startContent={
                        <Icon
                          icon="solar:download-minimalistic-bold"
                          width={18}
                        />
                      }
                      fn={async () => {
                        await downloadAppointmentReceipt(appointment.aid);
                      }}
                      isIconOnly
                    />
                  </Tooltip>
                )}
              </div>
              <Tooltip content="View">
                <Button
                  as={Link}
                  href={`/appointments/${appointment.aid}`}
                  variant="flat"
                  startContent={<Icon icon="tabler:arrow-up-right" />}
                  isIconOnly
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <Modal
        scrollBehavior="inside"
        backdrop="blur"
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
      >
        <ModalContent className="w-full">
          {modalMap[selectedModal] || <></>}
        </ModalContent>
      </Modal>
    </>
  );
}
