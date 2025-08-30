import { CellRenderer } from '@/components/ui/cell-renderer';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { cn } from '@/lib/utils';
import { useUserWithUID } from '@/services/common/user/query';
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Chip,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { $FixMe } from '@/types';

export const CreateAppointmentPatientDetails = ({ uid }: { uid: string }) => {
  // TODO: Fix this once the user details are fetched from the backend
  const { isLoading, isError } = useUserWithUID(uid);
  const user = {} as $FixMe;

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner color="primary" size="lg" />
      </div>
    );

  if (isError)
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-danger-50 p-3">
              <Icon icon="solar:danger-triangle-bold-duotone" className="h-6 w-6 text-danger" />
            </div>
            <div>
              <p className="text-medium font-medium text-default-foreground">
                Error fetching user data
              </p>
              <p className="text-small text-default-400">Please try again later</p>
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
              <p className="text-medium font-medium text-default-foreground">Select a patient</p>
              <p className="text-small text-default-400">Choose a patient to view their details</p>
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
              <h3 className="text-large font-semibold text-default-foreground">Patient Details</h3>
              <p className="text-small text-default-400">
                Personal information and contact details
              </p>
            </div>
          </div>
          <Chip color="primary" radius="sm" variant="flat">
            #{user.uid}
          </Chip>
        </div>
      </CardHeader>

      <Divider className="flex-shrink-0 border-dashed" />

      <CardBody as={ScrollShadow} className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {/* Profile Section */}
        <div className="flex items-start gap-4">
          <Avatar
            src={user.image || '/assets/placeholder-avatar.jpeg'}
            alt={user.name}
            className="h-16 w-16 flex-shrink-0"
            showFallback
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary">
                <Icon icon="solar:user-bold" className="h-6 w-6" />
              </div>
            }
          />
          <div className="flex flex-1 flex-col gap-2">
            <div>
              <h4 className="text-large font-medium">{user.name}</h4>
              <p className="text-small text-default-400">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {renderChip({ item: user.status, size: 'sm' })}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h5 className="text-medium font-medium text-default-foreground">Contact Information</h5>
          <div className="grid gap-3">
            <CellRenderer
              icon="solar:letter-bold-duotone"
              label="Email Address"
              value={user.email}
              classNames={{
                icon: 'text-blue-500 bg-blue-100',
                value: 'text-black',
              }}
            />
            <CellRenderer
              icon="solar:phone-bold-duotone"
              label="Phone Number"
              value={user.phone}
              classNames={{
                icon: 'text-green-500 bg-green-100',
                value: 'text-black',
              }}
            />
          </div>
        </div>

        {(user.dob || user.gender) && (
          <>
            <Divider />
            <div className="space-y-2">
              <h5 className="text-medium font-medium text-default-foreground">
                Personal Information
              </h5>
              <div className="grid gap-3">
                {user.dob && (
                  <CellRenderer
                    icon="solar:calendar-bold-duotone"
                    label="Date of Birth"
                    value={user.dob}
                    classNames={{
                      icon: 'text-rose-500 bg-rose-100',
                    }}
                  />
                )}

                {user.gender && (
                  <CellRenderer
                    icon="solar:users-group-rounded-bold-duotone"
                    label="Gender"
                    value={user.gender}
                    classNames={{
                      icon: cn('text-purple-500 bg-purple-100', {
                        'text-blue-500 bg-blue-100': user.gender === 'male',
                        'text-pink-500 bg-pink-100': user.gender === 'female',
                      }),
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Address Information */}
        {(user.address || user.city || user.state || user.country) && (
          <>
            <Divider />
            <div>
              <h5 className="text-medium font-medium text-default-foreground">
                Address Information
              </h5>
              <div className="space-y-3">
                {user.address && (
                  <CellRenderer
                    icon="solar:map-point-bold-duotone"
                    label="Address"
                    value={user.address}
                    classNames={{
                      icon: 'text-orange-500 bg-orange-100',
                    }}
                  />
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {user.city && (
                    <CellRenderer
                      icon="solar:buildings-bold-duotone"
                      label="City"
                      value={user.city}
                      classNames={{
                        icon: 'text-teal-500 bg-teal-100',
                      }}
                    />
                  )}

                  {user.state && (
                    <CellRenderer
                      icon="solar:map-point-line-duotone"
                      label="State"
                      value={user.state}
                      classNames={{
                        icon: 'text-indigo-500 bg-indigo-100',
                      }}
                    />
                  )}

                  {user.country && (
                    <CellRenderer
                      icon="solar:flag-bold-duotone"
                      label="Country"
                      value={user.country}
                      classNames={{
                        icon: 'text-cyan-500 bg-cyan-100',
                      }}
                    />
                  )}
                </div>

                {user.zipcode && (
                  <CellRenderer
                    icon="solar:point-on-map-perspective-bold-duotone"
                    label="Zip Code"
                    value={user.zipcode}
                    classNames={{
                      icon: 'text-violet-500 bg-violet-100',
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};
