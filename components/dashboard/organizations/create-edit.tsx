'use client';

import { useCreateOrganization, useUpdateOrganization } from '@/services/organization';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Organization } from 'better-auth/plugins';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const formSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  slug: Yup.string().min(1, 'Slug is required').required('Slug is required'),
  logo: Yup.string().optional(),
});

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  organization?: Organization | null;
}

export default function CreateEditModal({
  isOpen,
  onClose,
  mode,
  organization,
}: CreateEditModalProps) {
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();

  const formik = useFormik({
    initialValues: {
      name: organization?.name || '',
      slug: organization?.slug || '',
      logo: organization?.logo || '',
      metadata: {},
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        if (mode === 'create') {
          await createOrganization.mutateAsync(values);
        } else {
          if (organization) {
            await updateOrganization.mutateAsync({
              organizationId: organization?.id,
              data: values,
            });
          }
        }
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} backdrop="blur" onClose={handleClose} size="2xl">
      <ModalContent>
        <ModalHeader className="w-full">
          {mode === 'create' ? 'Create New Organization' : 'Edit Organization'}
        </ModalHeader>
        <ModalBody className="w-full">
          <div className="space-y-4">
            <Input
              label="Organization Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Organization name"
              className="mt-1"
              isRequired
              isInvalid={formik.touched.name && !!formik.errors.name}
              errorMessage={formik.errors.name}
            />
            <Input
              label="Slug"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              placeholder="example.com"
              className="mt-1"
              isRequired
              isInvalid={formik.touched.slug && !!formik.errors.slug}
              errorMessage={formik.errors.slug}
            />
            <Input
              label="Logo URL"
              name="logo"
              value={formik.values.logo}
              onChange={formik.handleChange}
              placeholder="https://example.com/logo.png"
              className="mt-1"
              isInvalid={formik.touched.logo && !!formik.errors.logo}
              errorMessage={formik.errors.logo}
            />
          </div>
        </ModalBody>
        <ModalFooter className="w-full">
          <Button variant="flat" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={formik.isSubmitting}
            onPress={() => formik.handleSubmit()}
          >
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
