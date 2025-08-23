'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Chip, useDisclosure } from '@heroui/react';
import { OrganizationType } from '@/types/organization';
import {
  useOrganizations,
  useDeleteOrganization,
  useToggleOrganizationStatus,
} from '@/services/api/organization';
import { toast } from 'sonner';
import { formatDate } from 'date-fns';
import CreateEditModal from './create-edit';

export default function OrganizationsDashboard() {
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [editingOrganization, setEditingOrganization] = useState<OrganizationType | null>(null);

  const { data: organizations = [], isLoading, error } = useOrganizations();

  const deleteOrganization = useDeleteOrganization();
  const toggleStatus = useToggleOrganizationStatus();

  if (error) {
    toast.error('Failed to fetch organizations');
  }

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

  // Open edit modal

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
          organizations.map((org) => (
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
                      <h3 className="text-lg font-semibold">{org.name}</h3>
                      <p className="text-sm text-default-400">{org.domain}</p>
                      <p className="text-xs text-default-400">
                        Created: {formatDate(org.createdAt, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Chip
                      color={org.status === 'active' ? 'success' : 'danger'}
                      variant="flat"
                      className="capitalize"
                    >
                      {org.status}
                    </Chip>
                    <Button
                      variant="flat"
                      size="sm"
                      onPress={() => handleToggleStatus(org._id, org.status)}
                      isLoading={toggleStatus.isPending}
                    >
                      {org.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setEditingOrganization(org);
                        editModal.onOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      onPress={() => handleDelete(org._id)}
                      isLoading={deleteOrganization.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {createModal.isOpen && (
        <CreateEditModal isOpen={createModal.isOpen} onClose={createModal.onClose} mode="create" />
      )}

      {editModal.isOpen && (
        <CreateEditModal
          isOpen={editModal.isOpen}
          onClose={() => {
            editModal.onClose();
            setEditingOrganization(null);
          }}
          mode="edit"
          organization={editingOrganization}
        />
      )}
    </div>
  );
}
