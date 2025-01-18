import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card, CardBody, Chip } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

export default function AppointmentPreview() {
  return (
    <>
      <div className="w-full px-[5%] py-8">
        <div className="flex w-full flex-col overflow-hidden rounded-2xl shadow-lg">
          <div className="w-full bg-foreground px-4 py-2 text-background">
            <h3>This is a preview.</h3>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <h4>Personal Details</h4>
              <Card className="rounded-xl border shadow-none">
                <CardBody className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={'/assets/placeholder-avatar.jpeg'}
                      alt="Profile picture"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold">
                        Jerome Bellingham
                      </h2>
                      <div className="flex flex-col gap-2 text-sm text-default-500 sm:flex-row sm:gap-4">
                        <div className="flex items-center gap-1">
                          <Icon icon="solar:phone-rounded-linear" width={18} />
                          <span>+91 9876543210</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon icon="iconoir:mail" width={18} />
                          <span>jeromebellingham93@mail.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg bg-default-100 p-2">
                    <h3 className="font-medium">Appointment Note</h3>
                    <p className="text-sm text-default-500">
                      Eating sweet foods, not brushing your teeth regularly.
                      often drink cold water when eating food that is still hot.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Symptoms</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {['Headache', 'Fever', 'Cough', 'Sore throat'].map(
                          (symptom) => (
                            <Chip
                              key={symptom}
                              size="sm"
                              radius="sm"
                              className="capitalize"
                            >
                              {symptom}
                            </Chip>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Symptoms</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {['Headache', 'Fever', 'Cough', 'Sore throat'].map(
                          (symptom) => (
                            <Chip
                              key={symptom}
                              size="sm"
                              radius="sm"
                              className="capitalize"
                            >
                              {symptom}
                            </Chip>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="flex flex-col gap-2">
              <h4>Appointment Details</h4>
              <Card className="rounded-xl border shadow-none">
                <CardBody className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Date & Time</h3>
                      <div className="flex flex-col text-sm">
                        <span>Monday, 15th March 2021</span>
                        <span>10:00 AM</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Doctor</h3>
                      <div>
                        <Button
                          variant="bordered"
                          radius="sm"
                          size="sm"
                          as={Link}
                          target="_blank"
                          href="/doctors/1"
                          className="capitalize"
                          endContent={<Icon icon="fluent:open-20-filled" />}
                        >
                          Dr. Kitti
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg bg-default-100 p-2">
                      <h3 className="font-medium">Appointment Mode</h3>
                      <Chip
                        variant="bordered"
                        radius="sm"
                        className="capitalize"
                      >
                        In-person
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
