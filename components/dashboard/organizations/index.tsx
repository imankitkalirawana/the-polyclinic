'use client';

import { Button, Card, CardBody, Switch, useDisclosure } from '@heroui/react';
import { OrganizationType } from '@/types/organization';
import {
  useOrganizations,
  useDeleteOrganization,
  useToggleOrganizationStatus,
} from '@/hooks/queries/system/organization';
import { toast } from 'sonner';
import { formatDate } from 'date-fns';
import CreateEditModal from './create-edit';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

export default function OrganizationsDashboard() {
  const createModal = useDisclosure();

  const { data: organizations = [], isLoading, error } = useOrganizations();

  if (error) {
    toast.error('Failed to fetch organizations');
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading organizations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Button color="primary" onPress={() => createModal.onOpen()}>
          Create Organization
        </Button>
      </div>

      <div className="grid gap-4">
        {organizations.length === 0 ? (
          <Card>
            <CardBody className="flex h-32 items-center justify-center">
              <p className="text-default-400">No organizations found</p>
            </CardBody>
          </Card>
        ) : (
          organizations.map((org) => <OrganizationCard key={org._id} org={org} />)
        )}
      </div>

      {createModal.isOpen && (
        <CreateEditModal isOpen={createModal.isOpen} onClose={createModal.onClose} mode="create" />
      )}
    </div>
  );
}

function OrganizationCard({ org }: { org: OrganizationType }) {
  const editModal = useDisclosure();
  const toggleStatus = useToggleOrganizationStatus();
  const deleteOrganization = useDeleteOrganization();
  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await toggleStatus.mutateAsync({ id, status: newStatus as 'active' | 'inactive' });
      toast.success(
        `Organization ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Delete organization
  const handleDelete = async (id: string) => {
    try {
      await deleteOrganization.mutateAsync(id);
      toast.success('Organization deleted successfully');
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete organization');
    }
  };

  return (
    <>
      <Card key={org._id}>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {org.logoUrl && (
                <img
                  src={org.logoUrl}
                  alt={org.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {org.name}
                  <span className="ml-1 text-xs font-normal italic text-default-400">
                    (#{org.organizationId})
                  </span>
                </h3>
                <p className="text-sm text-default-400">{org.domain} </p>
                <p className="text-xs text-default-400">
                  Created: {formatDate(org.createdAt, 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                isReadOnly={toggleStatus.isPending}
                isSelected={org.status === 'active'}
                onValueChange={() => handleToggleStatus(org.organizationId, org.status)}
              />
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                as={Link}
                href={`/dashboard/organizations/${org.organizationId}`}
              >
                <Icon icon="solar:settings-line-duotone" width={18} />
              </Button>
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                as={'a'}
                href={`http://${org.organizationId}.lvh.me:3000/`}
                target="_blank"
              >
                <Icon icon="solar:arrow-right-up-linear" width={18} />
              </Button>
              <Button
                variant="flat"
                size="sm"
                onPress={() => {
                  editModal.onOpen();
                }}
              >
                Edit
              </Button>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => handleDelete(org.organizationId)}
                isLoading={deleteOrganization.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      {editModal.isOpen && (
        <CreateEditModal
          isOpen={editModal.isOpen}
          onClose={() => {
            editModal.onClose();
          }}
          mode="edit"
          organization={org}
        />
      )}
    </>
  );
}
