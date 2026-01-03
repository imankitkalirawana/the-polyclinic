import { CellRenderer } from '@/components/ui/cell-renderer';
import { Card, CardBody, CardHeader, Divider, Chip, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUserWithUID } from '@/services/common/user/user.query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';

export const CreateAppointmentPatientDetails = ({ id }: { id: string }) => {
  const { isLoading, isError, data: user } = useUserWithUID(id);

  if (isLoading) return <MinimalPlaceholder message="Loading patient details..." />;

  if (isError)
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-danger-50 p-3">
              <Icon icon="solar:danger-triangle-bold-duotone" className="h-6 w-6 text-danger" />
            </div>
            <div>
              <p className="font-medium text-default-foreground text-medium">
                Error fetching user data
              </p>
              <p className="text-default-400 text-small">Please try again later</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );

  if (!user)
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-default-50 p-3">
              <Icon icon="solar:user-id-bold-duotone" className="h-6 w-6 text-default-400" />
            </div>
            <div>
              <p className="font-medium text-default-foreground text-medium">Select a patient</p>
              <p className="text-default-400 text-small">Choose a patient to view their details</p>
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
              <Icon icon="solar:user-id-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-default-foreground text-large">Patient Details</h3>
              <p className="text-default-400 text-small">
                Personal information and contact details
              </p>
            </div>
          </div>
          <Chip color="primary" radius="sm" variant="flat">
            #{user.id}
          </Chip>
        </div>
      </CardHeader>

      <Divider className="flex-shrink-0 border-dashed" />

      <CardBody as={ScrollShadow} className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {/* Profile Section */}

        <RenderUser name={user.name} description={user.email} size="lg" />

        {/* Contact Information */}
        <div>
          <h5 className="font-medium text-default-foreground text-medium">Contact Information</h5>
          <div className="grid gap-3">
            <CellRenderer
              icon="solar:letter-bold-duotone"
              label="Email Address"
              value={user.email}
              classNames={{
                icon: 'text-blue-500 bg-blue-100',
              }}
            />
            {!!user.phone && (
              <CellRenderer
                icon="solar:phone-bold-duotone"
                label="Phone Number"
                value={user.phone}
                classNames={{
                  icon: 'text-green-500 bg-green-100',
                }}
              />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
