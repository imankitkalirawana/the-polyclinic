'use client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { CreateOrganizationType, OrganizationType } from '@/types/system/organization';
import { useCreateOrganization, useUpdateOrganization } from '@/services/organization/query';
import { useFormik } from 'formik';
import { withZodSchema } from '@/lib/utils';
import { createOrganizationSchema } from '@/services/organization/validation';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  organization?: OrganizationType | null;
}

export default function CreateEditOrganizationModal({
  isOpen,
  onClose,
  mode,
  organization,
}: CreateEditModalProps) {
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();

  const formik = useFormik<CreateOrganizationType>({
    initialValues: {
      name: organization?.name || '',
      domain: organization?.domain || '',
      logoUrl: organization?.logoUrl || '',
    },
    validate: withZodSchema(createOrganizationSchema),
    onSubmit: async (values) => {
      try {
        if (mode === 'create') {
          await createOrganization.mutateAsync(values);
        } else {
          if (organization) {
            await updateOrganization.mutateAsync({
              id: organization?.organizationId,
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
    <Modal isOpen={isOpen} backdrop="blur" onClose={handleClose} size="2xl" hideCloseButton>
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
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
                label="Domain"
                name="domain"
                value={formik.values.domain}
                onChange={formik.handleChange}
                placeholder="example.com"
                className="mt-1"
                isRequired
                isInvalid={formik.touched.domain && !!formik.errors.domain}
                errorMessage={formik.errors.domain}
              />
              <Input
                label="Logo URL"
                name="logoUrl"
                value={formik.values.logoUrl}
                onChange={formik.handleChange}
                placeholder="https://example.com/logo.png"
                className="mt-1"
                isInvalid={formik.touched.logoUrl && !!formik.errors.logoUrl}
                errorMessage={formik.errors.logoUrl}
              />
            </div>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button type="button" variant="flat" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={formik.isSubmitting}
              onPress={() => formik.handleSubmit()}
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
