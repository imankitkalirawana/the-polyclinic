'use client';

import { Input } from '@heroui/react';
import Modal from '@/components/ui/modal';
import {
  CreateOrganizationType,
  OrganizationType,
  useCreateOrganization,
  useUpdateOrganization,
  createOrganizationSchema,
} from '@/services/system/organization';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  organization?: OrganizationType | null;
}

/**
 * Generates a URL-friendly organization ID from the organization name
 * @param name - The organization name
 * @returns A slugified organization ID
 */
const generateOrganizationId = (name: string): string => {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export default function CreateEditOrganizationModal({
  isOpen,
  onClose,
  mode,
  organization,
}: CreateEditModalProps) {
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateOrganizationType>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: organization ?? {},
  });

  const organizationName = watch('name');

  useEffect(() => {
    if (mode === 'create' && organizationName) {
      const generatedId = generateOrganizationId(organizationName);
      setValue('organizationId', generatedId);
    }
  }, [organizationName, mode, setValue]);

  const onSubmit = async (values: CreateOrganizationType) => {
    if (mode === 'create') {
      await createOrganization.mutateAsync(values);
    } else {
      if (organization) {
        await updateOrganization.mutateAsync({
          id: organization.organizationId,
          data: values,
        });
      }
    }
    onClose();
  };

  const renderBody = () => {
    return (
      <div className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="Organization name"
          className="mt-1"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        {mode === 'create' && (
          <Input
            label="Organization ID"
            placeholder="example-organization-id"
            description="This cannot be changed later"
            className="mt-1"
            isInvalid={!!errors.organizationId}
            errorMessage={errors.organizationId?.message}
            {...register('organizationId')}
          />
        )}
        <Input
          label="Logo URL"
          placeholder="https://example.com/logo.png"
          className="mt-1"
          isInvalid={!!errors.logoUrl}
          errorMessage={errors.logoUrl?.message}
          {...register('logoUrl')}
        />
        <Input
          label="Location"
          placeholder="https://maps.app.goo.gl/U3FhzYTscMsYY5Vf8"
          className="mt-1"
          isInvalid={!!errors.organizationDetails?.location}
          errorMessage={errors.organizationDetails?.location?.message}
          {...register('organizationDetails.location')}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      hideCloseButton
      closeOnSubmit={false}
      title={mode === 'create' ? 'Create New Organization' : 'Edit Organization'}
      body={renderBody()}
      submitButton={{
        children: mode === 'create' ? 'Create' : 'Update',
        whileSubmitting:
          mode === 'create' ? 'Creating Organization...' : 'Updating Organization...',
      }}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
