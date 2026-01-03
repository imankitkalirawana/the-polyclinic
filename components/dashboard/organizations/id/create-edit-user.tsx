'use client';
import { Input, Select, SelectItem } from '@heroui/react';
import Modal from '@/components/ui/modal';

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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toTitleCase } from '@/lib/utils';
import { useCreateUser, useUpdateUser } from '@/services/common/user/user.query';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUser | UpdateUser>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: user || {
      organization: organization.organizationId,
    },
  });

  const onSubmit = async (values: CreateUser | UpdateUser) => {
    if (isEdit && user) {
      await updateUser.mutateAsync({
        uid: user.uid,
        data: values as UpdateUser,
      });
    } else {
      await createUser.mutateAsync(values as CreateUser);
    }
    onClose();
  };

  const renderBody = () => {
    return (
      <div className="space-y-4">
        <Input
          isRequired
          label="Full Name"
          placeholder="Enter full name"
          startContent={<Icon icon="solar:user-bold-duotone" className="text-default-400" />}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          isRequired
          startContent={<Icon icon="solar:letter-bold-duotone" className="text-default-400" />}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          startContent={<Icon icon="solar:phone-bold-duotone" className="text-default-400" />}
          isInvalid={!!errors.phone}
          errorMessage={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
          type="password"
          placeholder={isEdit ? 'Enter new password' : 'Enter password'}
          isRequired={!isEdit}
          startContent={
            <Icon icon="solar:lock-password-bold-duotone" className="text-default-400" />
          }
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          {...register('password')}
        />

        {!isEdit && (
          <Select
            isRequired
            disallowEmptySelection
            label="Role"
            placeholder="Select user role"
            startContent={<Icon icon="solar:user-id-bold-duotone" className="text-default-400" />}
            isInvalid={!!errors.role}
            errorMessage={errors.role?.message}
            {...register('role')}
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
            disallowEmptySelection
            label="Status"
            placeholder="Select user status"
            startContent={
              <Icon icon="solar:shield-check-bold-duotone" className="text-default-400" />
            }
            isInvalid={'status' in errors && !!errors.status}
            errorMessage={
              'status' in errors && errors.status ? String(errors.status.message) : undefined
            }
            {...register('status')}
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
    );
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit User' : 'Add New User'}
      subtitle={
        isEdit
          ? `Update user information for ${user?.name || 'user'}`
          : `Add a new user to ${organization.name}`
      }
      closeOnSubmit={false}
      body={renderBody()}
      onSubmit={handleSubmit(onSubmit)}
      submitButton={{
        children: isEdit ? 'Update User' : 'Add User',
        whileSubmitting: isEdit ? 'Updating User...' : 'Creating User...',
      }}
    />
  );
}
