'use client';
import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Switch,
  Avatar,
  Tabs,
  Tab,
  Spinner,
  useDisclosure,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useOrganization, useUpdateOrganization } from '@/services/system/organization/query';
import { OrganizationUser } from '@/services/common/user';
import UserModal from './create-edit-user';
import DeleteUserModal from './delete-user-modal';
import UserStatusToggle from './user-status-toggle';
import CreateEditOrganizationModal from '../create-edit';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

export default function Organization({ id }: { id: string }) {
  const { data, isLoading, error } = useOrganization(id);
  const { organization, users } = data || {};
  const toggleStatus = useUpdateOrganization();
  const editModal = useDisclosure();
  const userModal = useDisclosure();
  const deleteUserModal = useDisclosure();

  const [selectedTab, setSelectedTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create');

  if (isLoading) {
    return <MinimalPlaceholder message="Loading organization..." />;
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
    await toggleStatus.mutateAsync({
      id: organization.organizationId,
      data: { status: newStatus },
    });
  };

  const handleEditUser = (user: OrganizationUser) => {
    setSelectedUser(user);
    setUserModalMode('edit');
    userModal.onOpen();
  };

  const handleDeleteUser = (user: OrganizationUser) => {
    setSelectedUser(user);
    deleteUserModal.onOpen();
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserModalMode('create');
    userModal.onOpen();
  };

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="flex items-center justify-between p-0">
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
              onPress={handleAddUser}
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
              target="_blank"
              // TODO: fix this hardcoded url
              href={`http://${organization.organizationId}.lvh.me:3000`}
              size="sm"
            >
              <Icon icon="solar:arrow-right-up-linear" />
            </Button>
            <Switch
              isReadOnly={toggleStatus.isPending}
              isSelected={organization.status === 'active'}
              onValueChange={handleToggleStatus}
              thumbIcon={toggleStatus.isPending ? <Spinner size="sm" /> : undefined}
            />
          </div>
        </CardHeader>
        <CardBody className="p-0 pt-2">
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
              <ScrollShadow
                hideScrollBar
                className="max-h-[70vh] flex-1 space-y-2 overflow-y-auto p-2 pb-4"
              >
                {users?.map((user) => (
                  <Card key={user.uid}>
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar src={user.image} name={user.name} size="lg" />
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-default-400">{user.email}</p>
                            <div className="mt-1 flex items-center space-x-2">
                              {renderChip({
                                item: user.role,
                              })}
                              {renderChip({
                                item: user.status,
                              })}
                              {user.role !== 'admin' && (
                                <UserStatusToggle organization={organization} user={user} />
                              )}
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
                          {user.role !== 'admin' && (
                            <Button
                              isIconOnly
                              variant="flat"
                              size="sm"
                              color="danger"
                              onPress={() => handleDeleteUser(user)}
                              startContent={<Icon icon="solar:trash-bin-trash-line-duotone" />}
                            />
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </ScrollShadow>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Tabs */}

      {/* Edit Organization Modal */}
      {editModal.isOpen && (
        <CreateEditOrganizationModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          mode="edit"
          organization={organization}
        />
      )}

      {/* User Modal (Create/Edit) */}
      {userModal.isOpen && (
        <UserModal
          isOpen={userModal.isOpen}
          onClose={userModal.onClose}
          organization={organization}
          mode={userModalMode}
          user={userModalMode === 'edit' ? selectedUser || undefined : undefined}
        />
      )}

      {/* Delete User Modal */}
      {deleteUserModal.isOpen && selectedUser && (
        <DeleteUserModal
          isOpen={deleteUserModal.isOpen}
          onClose={deleteUserModal.onClose}
          organization={organization}
          user={selectedUser}
          onSubmit={() => {
            console.log('Deleted');
          }}
        />
      )}
    </>
  );
}
