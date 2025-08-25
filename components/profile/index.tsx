'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import {
  addToast,
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelf } from '@/hooks/queries/client/user';
import { UserType } from '@/types/system/control-plane';

export default function Profile() {
  const { data } = useSelf();

  const self: UserType = data || ({} as UserType);

  const formik = useFormik({
    initialValues: {
      name: self.name,
      email: self.email,
      phone: self.phone,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await axios
        .put('/api/users/self', values)
        .then((res) => {
          addToast({
            title: 'Success',
            description: res.data.message,
            color: 'success',
          });
        })
        .catch((err) => {
          console.error(err);
          addToast({
            title: 'Error',
            description: err.response.data.message,
            color: 'danger',
          });
        });
    },
  });

  return (
    <div>
      <div className="space-y-12">
        <form className="border-b border-default-900/10 pb-12" onSubmit={formik.handleSubmit}>
          <h2 className="font-semibold">Personal Information</h2>
          <p className="mt-1 text-small/6 text-default-600">
            This information can be used to identify you in the system.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-2">
              <Input
                label="Name"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                isDisabled
                value={formik.values.email}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Phone"
                id="phone"
                name="phone"
                type="tel"
                isDisabled
                value={formik.values.phone}
              />
            </div>
            <div className="col-span-full">
              <Textarea
                label="About"
                id="about"
                name="about"
                rows={3}
                description="Write a few sentences about yourself."
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-4">
            <Button type="submit" variant="shadow" color="primary" isLoading={formik.isSubmitting}>
              Update
            </Button>
          </div>
        </form>

        <PasswordForm email={self.email} />
        <DeleteAccountForm email={self.email} />
      </div>
    </div>
  );
}

function PasswordForm({ email }: { email: string }) {
  const formik = useFormik({
    initialValues: {
      email,
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      password: Yup.string().required('New password is required'),
      confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      await axios
        .patch('/api/auth/update-password', values)
        .then((res) => {
          addToast({
            title: 'Success',
            description: res.data.message,
            color: 'success',
          });
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status === 400) {
            formik.setFieldError('currentPassword', err.response.data.message);
            return;
          }
          addToast({
            title: 'Error',
            description: err.response.data.message,
            color: 'danger',
          });
        });
    },
  });

  return (
    <form className="border-b border-default-900/10 pb-12" onSubmit={formik.handleSubmit}>
      <h2 className="font-semibold">Security</h2>
      <p className="mt-1 text-small/6 text-default-600">Manage your account security settings.</p>

      <div className="mt-10 flex flex-col gap-4">
        <div className="max-w-sm">
          <Input
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.currentPassword && formik.errors.currentPassword)}
            errorMessage={formik.errors.currentPassword}
          />
        </div>
        <div className="max-w-sm">
          <Input
            label="New Password"
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            errorMessage={formik.errors.password}
          />
        </div>
        <div className="max-w-sm">
          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
            errorMessage={formik.errors.confirmPassword}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Button type="submit" variant="shadow" color="primary" isLoading={formik.isSubmitting}>
          Update
        </Button>
      </div>
    </form>
  );
}

function DeleteAccountForm({ email }: { email: string }) {
  const deleteModal = useDisclosure();

  const formik = useFormik({
    initialValues: {
      email,
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      await axios
        .delete(`/api/v1/users/${email}`, { data: values })
        .then(async (res) => {
          await signOut();
          addToast({
            title: 'Success',
            description: res.data.message,
            color: 'success',
          });
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status === 400) {
            formik.setFieldError('password', err.response.data.message);
            return;
          }
          addToast({
            title: 'Error',
            description: err.response.data.message,
            color: 'danger',
          });
        });
    },
  });

  return (
    <>
      <div className="border-b border-default-900/10 pb-12">
        <h2 className="font-semibold">Danger Zone</h2>
        <p className="mt-1 text-small/6 text-default-600">
          Delete your account and all associated data.
        </p>
        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button color="danger" onPress={deleteModal.onOpen}>
            Delete Account
          </Button>
        </div>
      </div>
      <Modal isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange}>
        <ModalContent
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="leading-medium text-large font-medium text-default-900">
                  Delete Account
                </h3>
                <p className="mt-2 text-medium font-normal text-default-500">
                  Your account will be deleted, along with all of its data.
                </p>
                <Alert
                  description="This action is not reversible. Please be certain."
                  title="Warning"
                  color="danger"
                  variant="flat"
                />
              </ModalHeader>
              <ModalBody>
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  className="sr-only"
                  autoComplete="email"
                />
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  autoFocus
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.touched.password && formik.errors.password)}
                  description="Please enter your password to confirm the deletion of your account."
                  errorMessage={formik.errors.password}
                />
              </ModalBody>
              <ModalFooter>
                <Button fullWidth type="button" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="shadow"
                  color="danger"
                  isLoading={formik.isSubmitting}
                  onPress={() => formik.handleSubmit()}
                >
                  Delete Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
