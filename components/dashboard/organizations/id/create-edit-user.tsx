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
import { OrganizationType } from '@/services/system/organization';
import {
  CreateUser,
  createUserSchema,
  ORGANIZATION_USER_ROLES,
  OrganizationUser,
  UpdateUser,
  updateUserSchema,
} from '@/services/common/user';
import { useFormik } from 'formik';
import { toTitleCase, withZodSchema } from '@/lib/utils';
import { useCreateUser, useUpdateUser } from '@/services/common/user/query';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
  mode: 'create' | 'edit';
  user?: OrganizationUser;
}

export default function UserModal({ isOpen, onClose, organization, mode, user }: UserModalProps) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isEdit = mode === 'edit';

  const createFormik = useFormik<CreateUser>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'patient' as const,
      organization: organization.organizationId,
    },
    validate: withZodSchema(createUserSchema),
    onSubmit: async (values) => {
      await createUser.mutateAsync(values);
      onClose();
    },
  });

  const editFormik = useFormik<UpdateUser>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'patient',
      status: user?.status || 'active',
      password: '',
      organization: organization.organizationId,
    },
    validate: withZodSchema(updateUserSchema),
    onSubmit: async (values) => {
      if (user) {
        await updateUser.mutateAsync({
          uid: user.uid,
          data: values,
        });
      }
      onClose();
    },
  });

  const formik = isEdit ? editFormik : createFormik;
  const { values, handleSubmit, handleChange, setFieldValue, isSubmitting, errors, touched } =
    formik;

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
            <Icon
              icon={isEdit ? 'solar:pen-bold-duotone' : 'solar:user-plus-bold-duotone'}
              className="h-5 w-5"
            />
            <span>{isEdit ? 'Edit User' : 'Add User to Organization'}</span>
          </div>
          <p className="text-sm font-normal text-default-400">
            {isEdit
              ? `Update user information for ${user?.name || 'user'}`
              : `Add a new user to ${organization.name}`}
          </p>
        </ModalHeader>

        <ModalBody as={ScrollShadow}>
          <div className="space-y-4">
            <Input
              isRequired
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              value={values.name || ''}
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
              value={values.email || ''}
              onChange={handleChange}
              isRequired
              startContent={<Icon icon="solar:letter-bold-duotone" className="text-default-400" />}
              isInvalid={touched.email && !!errors.email}
              errorMessage={errors.email}
            />

            <Input
              name="phone"
              label="Phone Number"
              placeholder="Enter phone number"
              value={values.phone || ''}
              onChange={handleChange}
              startContent={<Icon icon="solar:phone-bold-duotone" className="text-default-400" />}
              isInvalid={touched.phone && !!errors.phone}
              errorMessage={errors.phone}
            />

            <Input
              name="password"
              label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
              type="password"
              placeholder={isEdit ? 'Enter new password' : 'Enter password'}
              value={values.password || ''}
              onChange={handleChange}
              isRequired={!isEdit}
              startContent={
                <Icon icon="solar:lock-password-bold-duotone" className="text-default-400" />
              }
              isInvalid={touched.password && !!errors.password}
              errorMessage={errors.password}
            />

            {!isEdit && (
              <Select
                name="role"
                label="Role"
                placeholder="Select user role"
                selectedKeys={[values.role || '']}
                onChange={(e) => setFieldValue('role', e.target.value)}
                isRequired
                disallowEmptySelection={!isEdit}
                startContent={
                  <Icon icon="solar:user-id-bold-duotone" className="text-default-400" />
                }
                isInvalid={touched.role && !!errors.role}
                errorMessage={errors.role}
              >
                {Object.values(ORGANIZATION_USER_ROLES).map((role) => (
                  <SelectItem key={role} textValue={toTitleCase(role)}>
                    {toTitleCase(role)}
                  </SelectItem>
                ))}
              </Select>
            )}

            {isEdit && (
              <Select
                name="status"
                label="Status"
                placeholder="Select user status"
                selectedKeys={[(editFormik.values as UpdateUser).status || '']}
                onChange={(e) => editFormik.setFieldValue('status', e.target.value)}
                startContent={
                  <Icon icon="solar:shield-check-bold-duotone" className="text-default-400" />
                }
                isInvalid={editFormik.touched.status && !!editFormik.errors.status}
                errorMessage={editFormik.errors.status}
              >
                <SelectItem key="active" textValue="Active">
                  Active
                </SelectItem>
                <SelectItem key="inactive" textValue="Inactive">
                  Inactive
                </SelectItem>
              </Select>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" isLoading={isSubmitting} onPress={() => handleSubmit()}>
            {isEdit ? 'Update User' : 'Add User'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
