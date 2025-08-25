'use client';
import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUpdateOrganization } from '@/hooks/queries/system/organization';
import { OrganizationType, UpdateOrganizationType } from '@/types/organization';
import { toast } from 'sonner';

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
}

export default function EditOrganizationModal({
  isOpen,
  onClose,
  organization,
}: EditOrganizationModalProps) {
  const updateOrganization = useUpdateOrganization();
  const [formData, setFormData] = useState<UpdateOrganizationType>({
    name: organization.name,
    domain: organization.domain,
    logoUrl: organization.logoUrl,
    status: organization.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateOrganization.mutateAsync({
        id: organization.organizationId,
        data: formData,
      });
      toast.success('Organization updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update organization');
    }
  };

  const handleInputChange = (field: keyof UpdateOrganizationType, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center space-x-2">
              <Icon icon="solar:pen-line-duotone" />
              <span>Edit Organization</span>
            </div>
          </ModalHeader>
          <ModalBody className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-default-400">
                  Organization Name
                </label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter organization name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-default-400">Domain</label>
                <Input
                  value={formData.domain || ''}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  placeholder="Enter domain"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-default-400">Logo URL</label>
                <Input
                  value={formData.logoUrl || ''}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  placeholder="Enter logo URL (optional)"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-default-400">Status</label>
                <div className="flex items-center space-x-2">
                  <Switch
                    isSelected={formData.status === 'active'}
                    onValueChange={(checked) =>
                      handleInputChange('status', checked ? 'active' : 'inactive')
                    }
                  />
                  <span className="text-sm">
                    {formData.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={updateOrganization.isPending}>
              Update Organization
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
