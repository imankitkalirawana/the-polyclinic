'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Switch,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { formatDate } from 'date-fns';
import { faker } from '@faker-js/faker';
import { useOrganization, useToggleOrganizationStatus } from '@/services/organization';
import { UserType } from '@/types/user';
import { toast } from 'sonner';
import EditOrganizationModal from './edit-modal';
import { CellRenderer } from '@/components/ui/cell-renderer';

// Generate dummy organization users
const generateDummyUsers = (count: number = 15): UserType[] => {
  return Array.from({ length: count }, (_, _index) => ({
    _id: faker.string.uuid(),
    organization: faker.string.uuid(),
    uid: faker.number.int({ min: 1000, max: 9999 }),
    email: faker.internet.email(),
    date: faker.date.past(),
    phone: faker.phone.number(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement([
      'admin',
      'doctor',
      'nurse',
      'receptionist',
      'pharmacist',
      'laboratorist',
      'user',
    ]),
    status: faker.helpers.arrayElement(['active', 'inactive', 'blocked', 'unverified']),
    country: faker.location.country(),
    state: faker.location.state(),
    city: faker.location.city(),
    address: faker.location.streetAddress(),
    zipcode: faker.location.zipCode(),
    passwordResetToken: faker.string.alphanumeric(32),
    dob: faker.date.past({ years: 40 }).toISOString(),
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    image: faker.image.avatar(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    createdBy: faker.string.uuid(),
    updatedBy: faker.string.uuid(),
  }));
};

export default function Organization({ id }: { id: string }) {
  const { data: organization, isLoading, error } = useOrganization(id);
  const toggleStatus = useToggleOrganizationStatus();
  const editModal = useDisclosure();

  const [selectedTab, setSelectedTab] = useState('overview');

  // Generate dummy users for this organization
  const dummyUsers = useMemo(() => generateDummyUsers(15), []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Icon
            icon="solar:warning-circle-line-duotone"
            className="mx-auto h-12 w-12 text-danger"
          />
          <h2 className="mt-4 text-lg font-semibold">Organization not found</h2>
          <p className="text-default-400">
            The organization you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    const newStatus = organization.status === 'active' ? 'inactive' : 'active';
    try {
      await toggleStatus.mutateAsync({ id: organization.organizationId, status: newStatus });
      toast.success(
        `Organization ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error) {
      toast.error('Failed to update organization status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'blocked':
        return 'danger';
      case 'unverified':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'doctor':
        return 'primary';
      case 'nurse':
        return 'secondary';
      case 'receptionist':
        return 'success';
      case 'pharmacist':
        return 'warning';
      case 'laboratorist':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar
              src={organization.logoUrl || ''}
              alt={organization.name}
              className="h-16 w-16"
              name={organization.name}
            />

            <div>
              <h2 className="text-lg font-semibold">{organization.name}</h2>
              <p className="text-default-400">@{organization.organizationId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button isIconOnly variant="flat" onPress={() => editModal.onOpen()} size="sm">
              <Icon icon="solar:pen-line-duotone" />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              as="a"
              href={`http://${organization.domain}`}
              target="_blank"
              size="sm"
            >
              <Icon icon="solar:arrow-right-up-linear" />
            </Button>
            <Switch
              isSelected={organization.status === 'active'}
              onValueChange={handleToggleStatus}
              isReadOnly={toggleStatus.isPending}
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <CellRenderer
              label="Subscription ID"
              value={organization.subscriptionId || 'No subscription'}
              icon="solar:card-2-bold-duotone"
              classNames={{
                icon: 'text-red-500 bg-rose-100',
              }}
            />

            <CellRenderer
              label="Created"
              value={formatDate(organization.createdAt, 'PPP')}
              icon="solar:calendar-line-duotone"
              classNames={{
                icon: 'text-blue-500 bg-blue-100',
              }}
            />
            <CellRenderer
              label="Last Updated"
              value={formatDate(organization.updatedAt, 'PPP')}
              icon="solar:calendar-line-duotone"
              classNames={{
                icon: 'text-green-500 bg-green-100',
              }}
            />
            <CellRenderer
              label="Total Users"
              value={dummyUsers.length}
              icon="solar:users-group-rounded-line-duotone"
              classNames={{
                icon: 'text-teal-500 bg-teal-100',
              }}
            />
            <CellRenderer
              label="Active Users"
              value={dummyUsers.filter((user) => user.status === 'active').length}
              icon="solar:user-check-line-duotone"
              classNames={{
                icon: 'text-amber-500 bg-amber-100',
              }}
            />
            <CellRenderer
              label="Blocked Users"
              value={dummyUsers.filter((user) => user.status === 'blocked').length}
              icon="solar:user-block-line-duotone"
              classNames={{
                icon: 'text-red-500 bg-red-100',
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Card className="h-full">
        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="w-full"
          >
            <Tab
              key="overview"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:chart-line-duotone" />
                  <span>Overview</span>
                </div>
              }
            >
              <div className="space-y-4 overflow-y-auto">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3 rounded-lg bg-default-50 p-3">
                    <Avatar src={faker.image.avatar()} name={faker.person.fullName()} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{faker.person.fullName()}</span> joined the
                        organization
                      </p>
                      <p className="text-xs text-default-400">
                        {faker.date.recent().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Tab>

            <Tab
              key="users"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:users-group-rounded-line-duotone" />
                  <span>Users ({dummyUsers.length})</span>
                </div>
              }
            >
              <div className="space-y-4">
                {dummyUsers.map((user) => (
                  <Card key={user._id} className="transition-shadow hover:shadow-md">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar src={user.image} name={user.name} size="lg" />
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-default-400">{user.email}</p>
                            <div className="mt-1 flex items-center space-x-2">
                              <Chip color={getRoleColor(user.role)} variant="flat" size="sm">
                                {user.role}
                              </Chip>
                              <Chip color={getStatusColor(user.status)} variant="flat" size="sm">
                                {user.status}
                              </Chip>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            startContent={<Icon icon="solar:pen-line-duotone" />}
                          />
                          <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            startContent={<Icon icon="solar:eye-line-duotone" />}
                          />
                          <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            color="danger"
                            startContent={<Icon icon="solar:trash-bin-trash-line-duotone" />}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Tab>

            <Tab
              key="settings"
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:settings-line-duotone" />
                  <span>Settings</span>
                </div>
              }
            >
              <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Organization Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 font-medium">General Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-default-400">Organization Name</label>
                        <p className="font-medium">{organization.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-default-400">Domain</label>
                        <p className="font-medium">{organization.domain}</p>
                      </div>
                      <div>
                        <label className="text-sm text-default-400">Status</label>
                        <div className="flex items-center space-x-2">
                          <Chip color={getStatusColor(organization.status)}>
                            {organization.status}
                          </Chip>
                          <Switch
                            isSelected={organization.status === 'active'}
                            onValueChange={handleToggleStatus}
                            isReadOnly={toggleStatus.isPending}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h4 className="mb-3 font-medium">Subscription & Billing</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-default-400">Subscription ID</label>
                        <p className="font-medium">
                          {organization.subscriptionId || 'No active subscription'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-default-400">Plan</label>
                        <p className="font-medium">Professional Plan</p>
                      </div>
                      <div>
                        <label className="text-sm text-default-400">Next Billing</label>
                        <p className="font-medium">December 15, 2024</p>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h4 className="mb-3 font-medium">Security & Access</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm text-default-400">
                            Two-Factor Authentication
                          </label>
                          <p className="text-xs text-default-400">Require 2FA for all users</p>
                        </div>
                        <Switch defaultSelected />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm text-default-400">Session Timeout</label>
                          <p className="text-xs text-default-400">Auto-logout after inactivity</p>
                        </div>
                        <Switch defaultSelected />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm text-default-400">IP Restrictions</label>
                          <p className="text-xs text-default-400">Limit access to specific IPs</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Edit Organization Modal */}
      {editModal.isOpen && (
        <EditOrganizationModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          organization={organization}
        />
      )}
    </div>
  );
}
