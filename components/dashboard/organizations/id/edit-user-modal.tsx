'use client';
import { useState, useEffect } from 'react';
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
import { useUpdateOrganizationUser } from '@/hooks/queries/system/organization';
import { toast } from 'sonner';
import { OrganizationType } from '@/types/organization';
import { UserType } from '@/types/control-plane';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
  user: UserType;
}

const userRoles = [
  { key: 'admin', label: 'Admin' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'nurse', label: 'Nurse' },
  { key: 'patient', label: 'Patient' },
  { key: 'receptionist', label: 'Receptionist' },
  { key: 'pharmacist', label: 'Pharmacist' },
];

export default function EditUserModal({ isOpen, onClose, organization, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'receptionist' as const,
    image: '',
  });

  const updateUser = useUpdateOrganizationUser();

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        role: user.role || 'receptionist',
        image: user.image || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Only send fields that have changed or are required
      const updateData: any = {};
      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.phone !== user.phone) updateData.phone = formData.phone;
      if (formData.role !== user.role) updateData.role = formData.role;
      if (formData.image !== user.image) updateData.image = formData.image;
      if (formData.password) updateData.password = formData.password;

      await updateUser.mutateAsync({
        organizationId: organization.organizationId,
        userId: user._id,
        data: updateData,
      });

      toast.success('User updated successfully');
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon icon="solar:pen-line-duotone" className="h-5 w-5" />
              <span>Edit User</span>
            </div>
            <p className="text-sm text-default-400">Update user information for {user.name}</p>
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
                label="New Password (leave blank to keep current)"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                  <SelectItem key={role.key}>{role.label}</SelectItem>
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
              isLoading={updateUser.isPending}
              isDisabled={!isFormValid}
            >
              Update User
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
