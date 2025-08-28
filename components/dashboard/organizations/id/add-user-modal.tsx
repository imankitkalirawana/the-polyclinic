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
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCreateOrganizationUser } from '@/hooks/queries/system/organization';
import {
  OrganizationType,
  organizationUserRoles,
  CreateOrganizationUser,
} from '@/types/system/organization';
import { toTitleCase, withZodSchema } from '@/lib/utils';
import { useFormik } from 'formik';
import { createOrganizationUserSchema } from '@/services/organization/validation';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
}

export default function AddUserModal({ isOpen, onClose, organization }: AddUserModalProps) {
  const createUser = useCreateOrganizationUser();

  const { values, handleChange, isSubmitting, errors, touched, handleSubmit } =
    useFormik<CreateOrganizationUser>({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'patient',
        image: '',
      },
      validate: withZodSchema(createOrganizationUserSchema),
      onSubmit: async (values) => {
        await createUser.mutateAsync({
          id: organization.organizationId,
          data: values,
        });
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
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon icon="solar:user-plus-bold-duotone" className="h-5 w-5" />
            <span>Add User to Organization</span>
          </div>
          <p className="text-sm font-normal text-default-400">
            Add a new user to {organization.name}
          </p>
        </ModalHeader>

        <ModalBody as={ScrollShadow}>
          <div className="space-y-4">
            <Input
              isRequired
              label="Full Name"
              name="name"
              placeholder="Enter full name"
              value={values.name}
              onChange={handleChange}
              startContent={<Icon icon="solar:user-bold-duotone" className="text-default-400" />}
              isInvalid={touched.name && !!errors.name}
              errorMessage={errors.name}
            />

            <Input
              isRequired
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={values.email}
              onChange={handleChange}
              startContent={<Icon icon="solar:letter-bold-duotone" className="text-default-400" />}
              isInvalid={touched.email && !!errors.email}
              errorMessage={errors.email}
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              value={values.phone}
              onChange={handleChange}
              isRequired
              startContent={<Icon icon="solar:phone-bold-duotone" className="text-default-400" />}
              isInvalid={touched.phone && !!errors.phone}
              errorMessage={errors.phone}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleChange}
              isRequired
              isInvalid={touched.password && !!errors.password}
              errorMessage={errors.password}
            />

            <Select
              isRequired
              disallowEmptySelection
              label="Role"
              name="role"
              placeholder="Select user role"
              selectedKeys={[values.role]}
              onChange={handleChange}
              startContent={<Icon icon="solar:user-id-bold-duotone" className="text-default-400" />}
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
              label="Profile Image URL"
              name="image"
              placeholder="Enter profile image URL (optional)"
              value={values.image}
              onChange={handleChange}
              startContent={<Icon icon="solar:image-bold-duotone" className="text-default-400" />}
              isInvalid={touched.image && !!errors.image}
              errorMessage={errors.image}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            onPress={() => handleSubmit()}
          >
            Add User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
