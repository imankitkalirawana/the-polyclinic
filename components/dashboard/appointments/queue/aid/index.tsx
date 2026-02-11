'use client';

import { Card, Button, CardBody, Divider, Chip, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppointmentQueueWithAID } from '@/services/client/appointment/queue/queue.query';
import Avatar from 'boring-avatars';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import DashboardFooter from '@/components/ui/dashboard/footer';
import EditModal from './ui/edit-modal';
import InfoCard from './ui/info-card';

export default function AppointmentQueue({ aid }: { aid: string }) {
  const { data: appointment } = useAppointmentQueueWithAID(aid);
  const editPatientModal = useDisclosure();

  return (
    <>
      <main className="bg-foreground-50 min-h-screen p-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="flex flex-col gap-4">
              <Card className="p-4 shadow-md">
                <div className="flex shrink-0 items-center justify-end gap-5">
                  <Button onPress={editPatientModal.onOpen} variant="flat" size="sm" radius="full">
                    Edit
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Avatar size="lg" className="mb-4 h-28 w-28 rounded-3xl" />
                  <h2 className="text-xl font-medium text-gray-900">{appointment?.patient.name}</h2>
                  <p className="mb-4 text-gray-500"> {appointment?.patient.email}</p>
                </div>
              </Card>
              <InfoCard aid={aid} />
            </div>
          </div>
          <div className="col-span-4">
            <div className="flex flex-col gap-4">
              {/* //doctor info card */}
              <Card className="p-4 shadow-md">
                <div className="flex shrink-0 items-center justify-end gap-5">
                  <Chip variant="flat">Room {appointment?.doctor?.seating || '-'}</Chip>
                </div>
                <div className="flex items-center justify-between gap-6 pt-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <Avatar
                        variant="beam"
                        className="h-20 w-20 shrink-0"
                        name={appointment?.doctor?.name || '-'}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col pr-2">
                        <h3 className="text-xl font-medium">{appointment?.doctor?.name || '-'}</h3>
                        <p className="text-default-500">
                          {appointment?.doctor?.specialization || '-'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Icon icon="mdi:phone" className="text-primary h-5 w-5 shrink-0" />
                          <span>{appointment?.doctor?.phone || '-'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Icon icon="mdi:email" className="text-primary h-5 w-5" />
                          <span>{appointment?.doctor?.email || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button color="default" variant="flat" size="sm">
                    View Profile
                  </Button>
                </div>
              </Card>
              {/* //appointment card info */}
              <Card className="p-4 shadow-md">
                <p className="text-foreground-500">Appointment Info</p>
                <Divider />
                <CardBody className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="font-medium">Appointment Id:</span>
                    <span className="text-foreground-500">{appointment?.aid || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Appointment Date:</span>
                    <span className="text-foreground-500">
                      {appointment?.appointmentDate || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <div>{renderChip({ item: appointment?.status || 'completed' })}</div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Mode:</span>
                    <span className="text-foreground-500">{appointment?.paymentMode || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Reason:</span>
                    <span className="text-foreground-500">
                      {/* {appointment?.reason || '-'} */}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="col-span-5">
            <div className="flex flex-col gap-4">
              <Card className="p-4 shadow-md">
                <h3 className="text-foreground-500 text-sm">Test Reports</h3>
                <CardBody className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="solar:document-add-bold-duotone"
                      width="32"
                      height="32"
                      className="text-blue-500"
                    />
                    <div>
                      <h4 className="text-foreground-600 font-semibold">CT Scan -Full Body</h4>
                      <p className="text-foreground-500 text-sm">12th February 2020</p>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="solar:document-add-bold-duotone"
                      width="32"
                      height="32"
                      className="text-yellow-500"
                    />
                    <div>
                      <h4 className="text-foreground-600 font-semibold">Creatine Kinase T</h4>
                      <p className="text-foreground-500 text-sm">12th February 2020</p>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="solar:document-add-bold-duotone"
                      width="32"
                      height="32"
                      className="text-red-500"
                    />
                    <div>
                      <h4 className="text-foreground-600 font-semibold">Eye Fluorescein Test</h4>
                      <p className="text-foreground-500 text-sm">12th February 2020</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card className="p-4 shadow-md">
                <div className="text-foreground-600 grid grid-cols-3 gap-4 py-4 text-sm font-medium">
                  <div>Prescriptions</div>
                  <div>Date</div>
                  <div>Duration</div>
                </div>

                <div className="divide-foreground-200 divide-y">
                  <div className="grid grid-cols-3 items-center gap-4 py-2">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="solar:pill-bold"
                        width="32"
                        height="32"
                        className="text-yellow-500"
                      />
                      <span className="text-base font-medium">Heart Diseases</span>
                    </div>
                    <span className="text-foreground-600">25th Oct 2019</span>
                    <span className="text-foreground-600">3 months</span>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="solar:pill-bold"
                        width="32"
                        height="32"
                        className="text-red-400"
                      />
                      <span className="text-base font-medium">Skin Care</span>
                    </div>
                    <span className="text-foreground-600">8th Aug 2019</span>
                    <span className="text-foreground-600">2 months</span>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="solar:pill-bold"
                        width="32"
                        height="32"
                        className="text-blue-400"
                      />
                      <span className="text-base font-medium">Eye Care</span>
                    </div>
                    <span className="text-foreground-600">16th Mar 2019</span>
                    <span className="text-foreground-600">1 months</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <DashboardFooter>
          <Button color="danger" radius="full" variant="flat">
            Cancel Appointment
          </Button>
          <Button color="warning" radius="full" variant="flat">
            Reschedule Appointment
          </Button>
        </DashboardFooter>
      </main>
      <EditModal aid={aid} isOpen={editPatientModal.isOpen} onClose={editPatientModal.onClose} />
    </>
  );
}
