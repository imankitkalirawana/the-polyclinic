'use client';

import Modal from '@/components/ui/modal';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  CreateDepartmentType,
  UpdateDepartmentType,
  MAX_DESCRIPTION_LENGTH,
  useCreateDepartment,
  useUpdateDepartment,
  DepartmentType,
} from '@/services/client/department';

import { Button, Input, Textarea } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Icon } from '@iconify/react/dist/iconify.js';

interface DepartmentModalProps {
  onClose: () => void;
  department?: DepartmentType | null;
  mode?: 'create' | 'edit';
}

export default function DepartmentModal({
  onClose,
  department,
  mode = 'create',
}: DepartmentModalProps) {
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment(department?.did || '');

  const isEdit = mode === 'edit' && department?.did;
  const schema = isEdit ? updateDepartmentSchema : createDepartmentSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<CreateDepartmentType | UpdateDepartmentType>({
    resolver: zodResolver(schema),
    defaultValues: department ?? {
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const desciption = watch('description');

  const onSubmit = async (data: CreateDepartmentType | UpdateDepartmentType) => {
    if (isEdit) {
      await updateDepartment.mutateAsync(data as UpdateDepartmentType);
    } else {
      await createDepartment.mutateAsync(data as CreateDepartmentType);
    }
    onClose();
  };

  const renderAddFeatureButton = () => {
    return (
      <Button
        type="button"
        size="sm"
        color="primary"
        variant="flat"
        startContent={<Icon icon="material-symbols:add" />}
        onPress={() => append({ name: '', description: '' })}
      >
        Add a new feature
      </Button>
    );
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
            <h4 className="font-medium text-large">Features</h4>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-large border border-divider p-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-default-700">Feature {index + 1}</h5>
                <Button
                  isIconOnly
                  type="button"
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => remove(index)}
                >
                  <Icon icon="solar:trash-bin-minimalistic-bold-duotone" width={18} />
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

          {fields.length === 0 ? (
            <div className="flex flex-col gap-2 py-8 text-center text-default-500">
              <Icon icon="material-symbols:feature-search" className="mx-auto mb-2 text-4xl" />
              <p>No features added yet</p>
              <div>{renderAddFeatureButton()}</div>
            </div>
          ) : (
            renderAddFeatureButton()
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen
      size="4xl"
      onClose={onClose}
      title={isEdit ? 'Edit Department' : 'New Department'}
      subtitle={
        isEdit
          ? 'Update department information and features.'
          : 'Create a new department to manage your clinical services.'
      }
      body={renderBody()}
      submitButton={{
        children: isEdit ? 'Update Department' : 'Create Department',
        whileSubmitting: isEdit ? 'Updating Department...' : 'Creating Department...',
        isLoading: createDepartment.isPending || updateDepartment.isPending,
      }}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
