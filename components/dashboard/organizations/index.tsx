'use client';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, unknown>;
}

export default function Organizations() {
  // Create modal
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  // Edit modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Delete modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    metadata: {},
  });

  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: organizations, refetch } = authClient.useListOrganizations();

  const handleCreateOrganization = async () => {
    if (!formData.name || !formData.slug) return;

    setIsLoading(true);
    try {
      await authClient.organization.create({
        name: formData.name,
        slug: formData.slug,
        logo: formData.logo || undefined,
        metadata: formData.metadata,
        keepCurrentActiveOrganization: false,
      });

      // Refresh the organizations list
      await refetch();
      onCreateClose();
      setFormData({ name: '', slug: '', logo: '', metadata: {} });
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrganization = async () => {
    if (!editingOrganization || !formData.name || !formData.slug) return;

    setIsLoading(true);
    try {
      await authClient.organization.update({
        organizationId: editingOrganization.id,
        data: {
          name: formData.name,
          slug: formData.slug,
          logo: formData.logo || undefined,
          metadata: formData.metadata,
        },
      });

      // Refresh the organizations list
      await refetch();
      onEditClose();
      setEditingOrganization(null);
      setFormData({ name: '', slug: '', logo: '', metadata: {} });
    } catch (error) {
      console.error('Failed to update organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!deletingOrganization) return;

    setIsLoading(true);
    try {
      await authClient.organization.delete({
        organizationId: deletingOrganization.id,
      });

      // Refresh the organizations list
      await refetch();
      onDeleteClose();
      setDeletingOrganization(null);
    } catch (error) {
      console.error('Failed to delete organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const openEditModal = (organization: Organization) => {
    setEditingOrganization(organization);
    setFormData({
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo || '',
      metadata: organization.metadata || {},
    });
    onEditOpen();
  };

  const openDeleteModal = (organization: Organization) => {
    setDeletingOrganization(organization);
    onDeleteOpen();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-default-900">Organizations</h1>
          <p className="text-default-500">Manage your organizations and teams</p>
        </div>
        <Button
          color="primary"
          onPress={onCreateOpen}
          startContent={<Icon icon="mdi:plus" className="h-4 w-4" />}
        >
          Create Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((organization) => (
          <Card key={organization.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={organization.logo || undefined}
                    name={organization.name}
                    className="h-12 w-12"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-default-900">
                      {organization.name}
                    </h3>
                    <p className="text-sm text-default-500">{organization.slug}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-default-600">
                  <Icon icon="mdi:office-building" className="h-4 w-4" />
                  <span>Organization ID: {organization.id}</span>
                </div>
                {organization.metadata && Object.keys(organization.metadata).length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-default-600">
                    <Icon icon="mdi:globe" className="h-4 w-4" />
                    <span>Custom metadata available</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-default-600">
                  <Icon icon="mdi:account-group" className="h-4 w-4" />
                  <span>Active organization</span>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="flex space-x-2">
                <Button size="sm" variant="bordered" color="primary">
                  View Users
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="bordered" color="primary">
                      Manage
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Organization actions">
                    <DropdownItem
                      key="edit"
                      startContent={<Icon icon="mdi:pencil" className="h-4 w-4" />}
                      onPress={() => openEditModal(organization)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Icon icon="mdi:delete" className="h-4 w-4" />}
                      onPress={() => openDeleteModal(organization)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!organizations || organizations.length === 0) && (
        <Card className="py-12 text-center">
          <CardBody>
            <Icon icon="mdi:office-building" className="mx-auto h-12 w-12 text-default-400" />
            <h3 className="mt-2 text-sm font-medium text-default-900">No organizations</h3>
            <p className="mt-1 text-sm text-default-500">
              Get started by creating your first organization.
            </p>
            <div className="mt-6">
              <Button
                color="primary"
                onPress={onCreateOpen}
                startContent={<Icon icon="mdi:plus" className="h-4 w-4" />}
              >
                Create Organization
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Create Organization Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Create New Organization</h2>
            <p className="text-sm text-default-600">Set up a new organization for your team</p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-default-700">
                  Organization Name *
                </label>
                <Input
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={(e) => {
                    handleInputChange('name', e.target.value);
                    if (e.target.value) {
                      generateSlug(e.target.value);
                    }
                  }}
                  onBlur={() => {
                    if (formData.name && !formData.slug) {
                      generateSlug(formData.name);
                    }
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-default-700">
                  Organization Slug *
                </label>
                <Input
                  placeholder="organization-slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  description="This will be used in URLs and API calls"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-default-700">
                  Logo URL (Optional)
                </label>
                <Input
                  placeholder="https://example.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  description="Direct link to your organization logo"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onCreateClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateOrganization}
              isLoading={isLoading}
              isDisabled={!formData.name || !formData.slug}
            >
              Create Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Organization Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Edit Organization</h2>
            <p className="text-sm text-default-600">Update your organization details</p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-default-700">
                  Organization Name *
                </label>
                <Input
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={(e) => {
                    handleInputChange('name', e.target.value);
                    if (e.target.value) {
                      generateSlug(e.target.value);
                    }
                  }}
                  onBlur={() => {
                    if (formData.name && !formData.slug) {
                      generateSlug(formData.name);
                    }
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-default-700">
                  Organization Slug *
                </label>
                <Input
                  placeholder="organization-slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  description="This will be used in URLs and API calls"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-default-700">
                  Logo URL (Optional)
                </label>
                <Input
                  placeholder="https://example.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  description="Direct link to your organization logo"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onEditClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateOrganization}
              isLoading={isLoading}
              isDisabled={!formData.name || !formData.slug}
            >
              Update Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Organization Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-danger">Delete Organization</h2>
            <p className="text-sm text-default-600">This action cannot be undone</p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Icon icon="mdi:alert-circle" className="h-6 w-6 text-danger" />
                <div>
                  <p className="text-sm text-default-700">
                    Are you sure you want to delete <strong>{deletingOrganization?.name}</strong>?
                  </p>
                  <p className="mt-1 text-xs text-default-500">
                    This will permanently remove the organization and all associated data.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteOrganization} isLoading={isLoading}>
              Delete Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
