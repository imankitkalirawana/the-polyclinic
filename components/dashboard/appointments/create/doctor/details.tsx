import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';
import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { DoctorType } from '@/services/client/doctor';
import { Card, CardBody, CardHeader, Divider, Chip, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';

export const CreateAppointmentDoctorDetails = ({ doctor }: { doctor?: DoctorType | null }) => {
  if (!doctor)
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-default-50 rounded-full p-3">
              <Icon icon="solar:stethoscope-bold-duotone" className="text-default-400 h-6 w-6" />
            </div>
            <div>
              <p className="text-default-foreground text-medium font-medium">Select a doctor</p>
              <p className="text-default-400 text-small">Choose a doctor to view their details</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );

  return (
    <Card className="flex max-h-full w-full flex-col overflow-hidden shadow-none">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 rounded-full p-2">
              <Icon icon="solar:stethoscope-bold" className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-default-foreground text-large font-semibold">Doctor Details</h3>
              <p className="text-default-400 text-small">
                Professional information and contact details
              </p>
            </div>
          </div>
          <Chip color="primary" radius="sm" variant="flat">
            #{doctor.id}
          </Chip>
        </div>
      </CardHeader>

      <Divider className="shrink-0 border-dashed" />

      <CardBody as={ScrollShadow} className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {/* Profile Section */}
        <RenderUser name={doctor.name} description={doctor.designation} size="lg" />

        {/* Contact Information */}
        <div>
          <h5 className="text-default-foreground text-medium font-medium">Contact Information</h5>
          <div>
            <CellRenderer
              icon="solar:letter-bold-duotone"
              label="Email Address"
              value={doctor.email}
              classNames={{
                icon: 'text-blue-500 bg-blue-100',
              }}
            />
            {doctor.phone && (
              <CellRenderer
                icon="solar:phone-bold-duotone"
                label="Phone Number"
                value={doctor.phone}
                classNames={{
                  icon: 'text-green-500 bg-green-100',
                }}
              />
            )}
          </div>
        </div>

        {/* Professional Information */}
        {(doctor.experience || doctor.education) && (
          <>
            <Divider />
            <div className="space-y-2">
              <h5 className="text-default-foreground text-medium font-medium">
                Professional Information
              </h5>
              <div className="grid gap-3">
                {doctor.experience && (
                  <CellRenderer
                    icon="solar:clock-circle-bold-duotone"
                    label="Experience"
                    value={doctor.experience}
                    classNames={{
                      icon: 'text-orange-500 bg-orange-100',
                    }}
                  />
                )}

                {doctor.education && (
                  <CellRenderer
                    icon="solar:square-academic-cap-bold-duotone"
                    label="Education"
                    value={doctor.education}
                    classNames={{
                      icon: 'text-teal-500 bg-teal-100',
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Practice Information */}
        {doctor.seating && (
          <>
            <Divider />
            <div>
              <h5 className="text-default-foreground text-medium font-medium">
                Practice Information
              </h5>
              <div className="space-y-3">
                {doctor.seating && (
                  <CellRenderer
                    icon="solar:map-point-bold-duotone"
                    label="Seating Location"
                    value={doctor.seating}
                    classNames={{
                      icon: 'text-indigo-500 bg-indigo-100',
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Biography */}
        {doctor.biography && (
          <>
            <Divider />

            {doctor.biography && (
              <div className="bg-default-50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-50 p-2">
                    <Icon icon="solar:document-bold-duotone" className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-default-600 text-small font-medium">Biography</p>
                    <p className="text-default-foreground text-medium leading-relaxed">
                      {doctor.biography}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};
