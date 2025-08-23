'use client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@heroui/react';
import { OrganizationType } from '@/types/organization';
import { useCreateOrganization, useUpdateOrganization } from '@/services/api/organization';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const formSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  domain: Yup.string()
    .min(1, 'Domain is required')
    .matches(
      /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/,
      'Please enter a valid domain'
    )
    .required('Domain is required'),
  logoUrl: Yup.string().optional(),
  status: Yup.string().oneOf(['active', 'inactive'], 'Status is required'),
});

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  organization?: OrganizationType | null;
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
      domain: organization?.domain || '',
      logoUrl: organization?.logoUrl || '',
      status: organization?.status || 'active',
    },
    validationSchema: formSchema,
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
            <Select
              isRequired
              disallowEmptySelection
              label="Status"
              selectedKeys={[formik.values.status]}
              onSelectionChange={(keys) => {
                const status = Array.from(keys)[0] as 'active' | 'inactive';
                formik.setFieldValue('status', status);
              }}
              className="mt-1"
              isInvalid={formik.touched.status && !!formik.errors.status}
              errorMessage={formik.errors.status}
            >
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
            </Select>
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
