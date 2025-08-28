'use client';
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
import {
  OrganizationType,
  organizationUserRoles,
  UpdateOrganizationUser,
} from '@/types/system/organization';
import { OrganizationUserType } from '@/types/system/organization';
import { useFormik } from 'formik';
import { updateOrganizationUserSchema } from '@/services/organization/validation';
import { toTitleCase, withZodSchema } from '@/lib/utils';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
  user: OrganizationUserType;
}

export default function EditUserModal({ isOpen, onClose, organization, user }: EditUserModalProps) {
  const updateUser = useUpdateOrganizationUser();

  const { values, handleSubmit, handleChange, setFieldValue, isSubmitting, errors, touched } =
    useFormik<UpdateOrganizationUser>({
      initialValues: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        status: user.status,
      },
      validate: withZodSchema(updateOrganizationUserSchema),
      onSubmit: async (values) => {
        await updateUser.mutateAsync({
          organizationId: organization.organizationId,
          userId: user.uid,
          data: values,
        });

        onClose();
      },
    });

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        {/* TODO: Fix this layout causing `scrollBehavior` to not work */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="overflow-y-auto"
        >
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon icon="solar:pen-bold-duotone" className="h-5 w-5" />
              <span>Edit User</span>
            </div>
            <p className="text-sm font-normal text-default-400">
              Update user information for {user.name}
            </p>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <Input
                isRequired
                name="name"
                label="Full Name"
                placeholder="Enter full name"
                value={values.name}
                onChange={handleChange}
                startContent={<Icon icon="solar:user-bold-duotone" className="text-default-400" />}
                isInvalid={touched.name && !!errors.name}
                errorMessage={errors.name}
              />

              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Enter email address"
                value={values.email}
                onChange={handleChange}
                isRequired
                startContent={
                  <Icon icon="solar:letter-bold-duotone" className="text-default-400" />
                }
                isInvalid={touched.email && !!errors.email}
                errorMessage={errors.email}
              />

              <Input
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                value={values.phone}
                onChange={handleChange}
                startContent={<Icon icon="solar:phone-bold-duotone" className="text-default-400" />}
                isInvalid={touched.phone && !!errors.phone}
                errorMessage={errors.phone}
              />

              <Input
                name="password"
                label="New Password (leave blank to keep current)"
                type="password"
                placeholder="Enter new password"
                value={values.password}
                onChange={handleChange}
                startContent={
                  <Icon icon="solar:lock-password-bold-duotone" className="text-default-400" />
                }
                isInvalid={touched.password && !!errors.password}
                errorMessage={errors.password}
              />

              <Select
                name="role"
                label="Role"
                placeholder="Select user role"
                selectedKeys={[values.role || '']}
                onChange={(e) => setFieldValue('role', e.target.value)}
                isRequired
                startContent={
                  <Icon icon="solar:user-id-bold-duotone" className="text-default-400" />
                }
                isInvalid={touched.role && !!errors.role}
                errorMessage={errors.role}
              >
                {organizationUserRoles.map((role) => (
                  <SelectItem key={role} textValue={toTitleCase(role)}>
                    {toTitleCase(role)}
                  </SelectItem>
                ))}
              </Select>

              <Input
                name="image"
                label="Profile Image URL"
                placeholder="Enter profile image URL (optional)"
                value={values.image}
                onChange={(e) => setFieldValue('image', e.target.value)}
                startContent={
                  <Icon icon="solar:gallery-circle-bold-duotone" className="text-default-400" />
                }
                isInvalid={touched.image && !!errors.image}
                errorMessage={errors.image}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Update User
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
