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
  Select,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCreateOrganizationUser } from '@/services/organization';
import { toast } from 'sonner';
import { OrganizationType } from '@/types/organization';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
}

const userRoles = [
  { key: 'admin', label: 'Admin' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'nurse', label: 'Nurse' },
  { key: 'patient', label: 'Patient' },
  { key: 'receptionist', label: 'Receptionist' },
  { key: 'pharmacist', label: 'Pharmacist' },
];

export default function AddUserModal({ isOpen, onClose, organization }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'receptionist' as const,
    image: '',
  });

  const createUser = useCreateOrganizationUser();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser.mutateAsync({
        id: organization.organizationId,
        data: formData,
      });

      toast.success('User added successfully to organization');
      onClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'receptionist',
        image: '',
      });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const isFormValid = formData.name && formData.email && formData.phone && formData.password;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon icon="solar:user-plus-line-duotone" className="h-5 w-5" />
              <span>Add User to Organization</span>
            </div>
            <p className="text-sm text-default-400">Add a new user to {organization.name}</p>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isRequired
                startContent={<Icon icon="solar:user-line-duotone" className="text-default-400" />}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                isRequired
                startContent={
                  <Icon icon="solar:letter-line-duotone" className="text-default-400" />
                }
              />

              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                isRequired
                startContent={<Icon icon="solar:phone-line-duotone" className="text-default-400" />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                isRequired
                startContent={
                  <Icon icon="solar:lock-password-line-duotone" className="text-default-400" />
                }
              />

              <Select
                label="Role"
                placeholder="Select user role"
                selectedKeys={[formData.role]}
                onChange={(e) => handleInputChange('role', e.target.value)}
                isRequired
                startContent={
                  <Icon icon="solar:user-id-line-duotone" className="text-default-400" />
                }
              >
                {userRoles.map((role) => (
                  <SelectItem key={role.key} value={role.key}>
                    {role.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Profile Image URL"
                placeholder="Enter profile image URL (optional)"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                startContent={<Icon icon="solar:image-line-duotone" className="text-default-400" />}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={createUser.isPending}
              isDisabled={!isFormValid}
            >
              Add User
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
