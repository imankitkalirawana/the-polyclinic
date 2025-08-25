'use client';
import { useState } from 'react';
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
import { useOrganization, useToggleOrganizationStatus } from '@/hooks/queries/system/organization';
import { toast } from 'sonner';
import { OrganizationUserType } from '@/types/system/organization';
import EditOrganizationModal from './edit-modal';
import AddUserModal from './add-user-modal';
import EditUserModal from './edit-user-modal';
import DeleteUserModal from './delete-user-modal';
import UserStatusToggle from './user-status-toggle';
import { CellRenderer } from '@/components/ui/cell-renderer';

export default function Organization({ id }: { id: string }) {
  const { data, isLoading, error } = useOrganization(id);
  const { organization, users } = data || {};
  const toggleStatus = useToggleOrganizationStatus();
  const editModal = useDisclosure();
  const addUserModal = useDisclosure();
  const editUserModal = useDisclosure();
  const deleteUserModal = useDisclosure();

  const [selectedTab, setSelectedTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<OrganizationUserType | null>(null);

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

  const handleEditUser = (user: OrganizationUserType) => {
    setSelectedUser(user);
    editUserModal.onOpen();
  };

  const handleDeleteUser = (user: OrganizationUserType) => {
    setSelectedUser(user);
    deleteUserModal.onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
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
            <Button
              color="primary"
              variant="flat"
              onPress={() => addUserModal.onOpen()}
              size="sm"
              startContent={<Icon icon="solar:user-plus-line-duotone" />}
            >
              Add User
            </Button>
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
              value={users?.length || 0}
              icon="solar:users-group-rounded-line-duotone"
              classNames={{
                icon: 'text-teal-500 bg-teal-100',
              }}
            />
            <CellRenderer
              label="Active Users"
              value={users?.filter((user) => user.status === 'active').length || 0}
              icon="solar:user-check-line-duotone"
              classNames={{
                icon: 'text-amber-500 bg-amber-100',
              }}
            />
            <CellRenderer
              label="Blocked Users"
              value={users?.filter((user) => user.status === 'inactive').length || 0}
              icon="solar:user-block-line-duotone"
              classNames={{
                icon: 'text-red-500 bg-red-100',
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="w-full"
      >
        <Tab
          key="users"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="solar:users-group-rounded-line-duotone" />
              <span>Users ({users?.length || 0})</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Organization Users</h3>
              <Button
                color="primary"
                variant="flat"
                onPress={() => addUserModal.onOpen()}
                startContent={<Icon icon="solar:user-plus-line-duotone" />}
              >
                Add User
              </Button>
            </div>
            {users?.map((user) => (
              <Card key={user._id}>
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
                          <UserStatusToggle organization={organization} user={user} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        onPress={() => handleEditUser(user)}
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
                        onPress={() => handleDeleteUser(user)}
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
                      <Chip color={getStatusColor(organization.status)}>{organization.status}</Chip>
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
                      <label className="text-sm text-default-400">Two-Factor Authentication</label>
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

      {/* Edit Organization Modal */}
      {editModal.isOpen && (
        <EditOrganizationModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          organization={organization}
        />
      )}

      {/* Add User Modal */}
      {addUserModal.isOpen && (
        <AddUserModal
          isOpen={addUserModal.isOpen}
          onClose={addUserModal.onClose}
          organization={organization}
        />
      )}

      {/* Edit User Modal */}
      {editUserModal.isOpen && selectedUser && (
        <EditUserModal
          isOpen={editUserModal.isOpen}
          onClose={editUserModal.onClose}
          organization={organization}
          user={selectedUser}
        />
      )}

      {/* Delete User Modal */}
      {deleteUserModal.isOpen && selectedUser && (
        <DeleteUserModal
          isOpen={deleteUserModal.isOpen}
          onClose={deleteUserModal.onClose}
          organization={organization}
          user={selectedUser}
        />
      )}
    </div>
  );
}
