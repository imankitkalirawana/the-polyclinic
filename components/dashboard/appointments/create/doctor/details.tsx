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
            <div className="rounded-full bg-default-50 p-3">
              <Icon icon="solar:stethoscope-bold-duotone" className="h-6 w-6 text-default-400" />
            </div>
            <div>
              <p className="font-medium text-default-foreground text-medium">Select a doctor</p>
              <p className="text-default-400 text-small">Choose a doctor to view their details</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );

  return (
    <Card className="flex max-h-full w-full flex-col overflow-hidden shadow-none">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-50 p-2">
              <Icon icon="solar:stethoscope-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-default-foreground text-large">Doctor Details</h3>
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

      <Divider className="flex-shrink-0 border-dashed" />

      <CardBody as={ScrollShadow} className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {/* Profile Section */}
        <RenderUser name={doctor.name} description={doctor.designation} size="lg" />

        {/* Contact Information */}
        <div>
          <h5 className="font-medium text-default-foreground text-medium">Contact Information</h5>
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
        {(doctor.specialization || doctor.experience || doctor.education) && (
          <>
            <Divider />
            <div className="space-y-2">
              <h5 className="font-medium text-default-foreground text-medium">
                Professional Information
              </h5>
              <div className="grid gap-3">
                {doctor.specialization && (
                  <CellRenderer
                    icon="solar:medical-cross-bold-duotone"
                    label="Specialization"
                    value={doctor.specialization}
                    classNames={{
                      icon: 'text-purple-500 bg-purple-100',
                    }}
                  />
                )}

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
              <h5 className="font-medium text-default-foreground text-medium">
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
              <div className="rounded-lg bg-default-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-50 p-2">
                    <Icon icon="solar:document-bold-duotone" className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-default-600 text-small">Biography</p>
                    <p className="leading-relaxed text-default-foreground text-medium">
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
