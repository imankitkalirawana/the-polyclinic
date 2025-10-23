'use client';

import Modal from '@/components/ui/modal';
import {
  createDepartmentSchema,
  CreateDepartmentType,
  MAX_DESCRIPTION_LENGTH,
  useCreateDepartment,
} from '@/services/client/department';

import { Button, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function NewDepartment({ onClose }: { onClose: () => void }) {
  const createDepartment = useCreateDepartment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<CreateDepartmentType>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const desciption = watch('description');

  const onSubmit = async (data: CreateDepartmentType) => {
    await createDepartment.mutateAsync(data);
  };

  const renderBody = () => {
    return (
      <div className="space-y-4">
        <Input
          autoFocus
          autoComplete="off"
          autoSave="off"
          label="Department Name"
          placeholder="eg. Cardiology"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="About Department"
          placeholder="eg. Cardiology is the study of the heart and its diseases."
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          description={`${MAX_DESCRIPTION_LENGTH - (desciption?.length || 0)} characters remaining`}
          maxLength={MAX_DESCRIPTION_LENGTH}
          {...register('description')}
        />
        <Input
          label="Thumbnail Image URL"
          placeholder="eg. https://example.com/image.png"
          isInvalid={!!errors.image}
          errorMessage={errors.image?.message}
          {...register('image')}
        />
        {/* Features Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Features</h4>
            <Button
              type="button"
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Icon icon="material-symbols:add" />}
              onPress={() => append({ name: '', description: '' })}
            >
              Add Feature
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <Icon icon="material-symbols:feature-search" className="mx-auto mb-2 text-4xl" />
              <p>No features added yet. Click &ldquo;Add Feature&rdquo; to get started.</p>
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-700">Feature {index + 1}</h5>
                <Button
                  isIconOnly
                  type="button"
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => remove(index)}
                >
                  <Icon icon="material-symbols:delete" />
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  size="sm"
                  className="max-w-64"
                  label="Feature Name"
                  placeholder="eg. Advanced Diagnostics"
                  isInvalid={!!errors.features?.[index]?.name}
                  errorMessage={errors.features?.[index]?.name?.message}
                  {...register(`features.${index}.name`)}
                />
                <Textarea
                  size="sm"
                  label="Feature Description"
                  placeholder="eg. State-of-the-art diagnostic equipment"
                  isInvalid={!!errors.features?.[index]?.description}
                  errorMessage={errors.features?.[index]?.description?.message}
                  {...register(`features.${index}.description`)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen
      size="4xl"
      onClose={onClose}
      title="New Department"
      subtitle="Create a new department to manage your clinical services."
      body={renderBody()}
      submitButton={{
        children: 'Create Department',
        whileSubmitting: 'Creating Department...',
      }}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
