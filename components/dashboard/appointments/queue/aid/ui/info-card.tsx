'use client';
import { Card, CardBody, Divider, Tabs, Tab } from '@heroui/react';
import { useAppointmentQueueWithAID } from '@/services/client/appointment/queue/queue.query';

export default function AppointmentQueue({ aid }: { aid: string }) {
  const { data: appointment } = useAppointmentQueueWithAID(aid);

  return (
    <main>
      <div>
        <Card className="p-4 shadow-md">
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
              <Tab className="text-base" key="information" title="Information">
                <Divider />
                <CardBody className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Age:</span>
                    <span className="text-foreground-500">{appointment?.patient.age || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Gender:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.gender || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span className="text-foreground-500">{appointment?.patient.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Blood Type:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.bloodType || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Diseases:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.diseases || '-'}
                    </span>
                  </div>
                </CardBody>
              </Tab>
              <Tab key="vitals" title="Vitals">
                <Divider />
                <CardBody className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="font-medium">Height:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.height || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.weight || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Blood Pressure:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.bloodPressure || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Heart Rate:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.heartRate || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Allergy:</span>
                    <span className="text-foreground-500">
                      {appointment?.patient.vitals?.allergies || '-'}
                    </span>
                  </div>
                </CardBody>
              </Tab>
            </Tabs>
          </div>
        </Card>
      </div>
    </main>
  );
}
