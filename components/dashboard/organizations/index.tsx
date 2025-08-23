'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Chip,
} from '@heroui/react';
import { OrganizationType } from '@/types/organization';
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useToggleOrganizationStatus,
} from '@/services/api/organization';
import { toast } from 'sonner';
import { formatDate } from 'date-fns';

export default function OrganizationsDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<OrganizationType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    logoUrl: '',
    status: 'active' as 'active' | 'inactive',
  });

  // React Query hooks
  const { data: organizations = [], isLoading, error } = useOrganizations();
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();
  const deleteOrganization = useDeleteOrganization();
  const toggleStatus = useToggleOrganizationStatus();

  // Handle errors
  if (error) {
    toast.error('Failed to fetch organizations');
  }

  // Create organization
  const handleCreate = async () => {
    try {
      await createOrganization.mutateAsync(formData);
      toast.success('Organization created successfully');
      setIsCreateModalOpen(false);
      setFormData({ name: '', domain: '', logoUrl: '', status: 'active' });
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create organization');
    }
  };

  // Update organization
  const handleUpdate = async () => {
    if (!editingOrganization) return;

    try {
      await updateOrganization.mutateAsync({
        id: editingOrganization._id,
        data: formData,
      });
      toast.success('Organization updated successfully');
      setIsEditModalOpen(false);
      setEditingOrganization(null);
      setFormData({ name: '', domain: '', logoUrl: '', status: 'active' });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update organization');
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
  const openEditModal = (organization: OrganizationType) => {
    setEditingOrganization(organization);
    setFormData({
      name: organization.name,
      domain: organization.domain,
      logoUrl: organization.logoUrl || '',
      status: organization.status,
    });
    setIsEditModalOpen(true);
  };

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
        <Button color="primary" onPress={() => setIsCreateModalOpen(true)}>
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
                    <Button variant="flat" size="sm" onPress={() => openEditModal(org)}>
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

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>Create New Organization</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Organization name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Domain</label>
                <Input
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Logo URL</label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  selectedKeys={[formData.status]}
                  onSelectionChange={(keys) => {
                    const status = Array.from(keys)[0] as 'active' | 'inactive';
                    setFormData({ ...formData, status });
                  }}
                  className="mt-1"
                >
                  <SelectItem key="active">Active</SelectItem>
                  <SelectItem key="inactive">Inactive</SelectItem>
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreate} isLoading={createOrganization.isPending}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>Edit Organization</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Organization name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Domain</label>
                <Input
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Logo URL</label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  selectedKeys={[formData.status]}
                  onSelectionChange={(keys) => {
                    const status = Array.from(keys)[0] as 'active' | 'inactive';
                    setFormData({ ...formData, status });
                  }}
                  className="mt-1"
                >
                  <SelectItem key="active">Active</SelectItem>
                  <SelectItem key="inactive">Inactive</SelectItem>
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdate} isLoading={updateOrganization.isPending}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
