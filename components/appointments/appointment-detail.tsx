'use client';
import {
  changeAppointmentStatus,
  getDoctorWithUID,
  getUserWithUID
} from '@/functions/server-actions';
import { AppointmentType } from '@/models/Appointment';
import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import {
  Button,
  Link,
  Modal,
  ModalContent,
  Tooltip,
  useDisclosure
} from '@heroui/react';
import { useEffect, useState } from 'react';
import CancelAppointment from './common/cancel-appointement';
import RescheduleAppointment from './common/reschedule-appointment';
import AddtoCalendar from './common/add-to-calendar';
import { toast } from 'sonner';
import CellValue from '../ui/cell-value';
import { genderMap, buttonColorMap } from '@/lib/maps';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import AsyncComponent from '@/hooks/useAsyncLoading';
import Skeleton from '../ui/skeleton';
import html2canvas from 'html2canvas';
import DownloadButton from './buttons/download';

export default function AppointmentDetail({
  appointment,
  setAppointments,
  session
}: {
  appointment: AppointmentType;
  setAppointments: any;
  session: any;
}) {
  const modal = useDisclosure();

  const [user, setUser] = useState<UserType>();
  const [selectedModal, setSelectedModal] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (appointment?.uid) {
        await getUserWithUID(appointment?.uid).then((user) => {
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
    addToCalendar: <AddtoCalendar appointment={appointment} />
  };

  function handleButtonClick(action: string) {
    if (action === 'download') {
      toast.success('Downloading reports');
      return;
    }

    setSelectedModal(action);
    modal.onOpen();
  }

  return (
    <>
      <div className="flex w-full gap-4" id="appointment-detail">
        <div className="hidden min-w-24 max-w-24 flex-col justify-between gap-8 sm:flex sm:min-w-40 sm:max-w-40">
          <CellValue label="Indian Standard Time" value="UTC +05:30" />
          <div className="flex flex-col-reverse gap-2">
            {['booked', 'confirmed', 'in-progress'].includes(
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
              <DownloadButton
                aid={appointment.aid}
                variant="flat"
                startContent={
                  <Icon icon="solar:download-minimalistic-bold" width={18} />
                }
              >
                Receipt
              </DownloadButton>
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
            value={appointment.name}
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
            value={`+91 ${appointment.phone}`}
            className="justify-start gap-4"
          />
          <CellValue
            label="Email"
            value={appointment.email}
            className="justify-start gap-4"
          />
          <CellValue
            label="Doctor"
            value={
              <AsyncComponent
                fetchData={() => getDoctorWithUID(appointment.doctor)}
                fallback={<Skeleton className="h-5 w-20" />}
                render={(doctor) => <span>{doctor?.name || '-'}</span>}
              />
            }
            className="justify-start gap-4"
          />
          <CellValue
            label="Date & Time"
            value={format(appointment.date, 'PPp')}
            className="justify-start gap-4"
          />
          <CellValue
            label="Location"
            value={<p className="capitalize">{appointment.type}</p>}
            className="justify-start gap-4"
          />
          {appointment.notes && (
            <CellValue
              label="Appointment Notes"
              value={appointment?.notes}
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
                'on-hold'
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
                    href={`/appointments/${appointment.uid}/complete`}
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
                          toast.success('Appointment confirmed');
                          setAppointments((prev: AppointmentType[]) => {
                            const updatedAppointments = prev.map((item) => {
                              if (item._id === appointment._id) {
                                return {
                                  ...item,
                                  status: 'confirmed'
                                };
                              }
                              return item;
                            });
                            return updatedAppointments;
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                          toast.error('An error occurred');
                        })
                        .finally(() => {
                          setIsConfirming(false);
                        });
                    }}
                  >
                    Accept
                  </Button>
                )}
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
