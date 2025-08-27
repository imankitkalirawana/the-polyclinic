'use client';

import React from 'react';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spacer,
  useDisclosure,
} from '@heroui/react';
import axios from 'axios';
import { useFormik } from 'formik';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';

import CellWrapper from './cell-wrapper';
import SwitchCell from './switch-cell';

import { UserRoles } from '@/lib/options';
import { SystemUserType } from '@/types/system/control-plane';

export default function SecuritySettings({
  user,
  refetch,
}: {
  user: SystemUserType;
  refetch: () => void;
}) {
  const editEmailModal = useDisclosure();
  const editPasswordModal = useDisclosure();
  const deactivateModal = useDisclosure();
  const deleteModal = useDisclosure();

  const mailOptions: MailOptions = {
    from: {
      name: 'The Polyclinic - Devocode',
      address: 'contact@divinely.dev',
    },
    to: user?.email,
    subject: 'Email Verification',
    text: 'Your OTP is 123456',
  };

  const emailFormik = useFormik({
    initialValues: {
      user,
      email: user?.email,
      isSent: false,
      otp: '',
      isResending: false,
      isUpdatingRole: false,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Please enter a valid Email.').required('Please enter your Email.'),
    }),
    onSubmit: async (values) => {
      mailOptions.to = values.email;
      if (values.email === user?.email) {
        emailFormik.setFieldError('email', 'Please enter a different email.');
        return;
      }
      //  TODO: Implement verify OTP
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters.')
        .required('Please enter your password.'),
      confirmPassword: Yup.string()
        // @ts-expect-error - Yup.ref is not typed
        .oneOf([Yup.ref('password'), null], 'Passwords must match.')
        .required('Please confirm your password.'),
    }),
    onSubmit: async () => {
      // TODO: Implement password change
    },
  });

  const deactivateFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Please enter a valid Email.').required('Please enter your Email.'),
    }),
    onSubmit: async (values) => {
      if (user?.email === 'contact@divinely.dev') {
        deactivateFormik.setFieldError('email', 'You cannot deactivate this account.');
        return;
      }
      if (values.email !== user?.email) {
        deactivateFormik.setFieldError('email', 'The email addresses do not match.');
        return;
      }
      await axios
        .put(`/api/v1/users/uid/${user?.uid}`, {
          status: user.status === 'active' ? 'inactive' : 'active',
        })
        .then(() => {
          refetch();
          addToast({
            title: `Account ${
              user.status === 'inactive' ? 'activated' : 'deactivated'
            } successfully.`,
            color: 'success',
          });
          deactivateFormik.resetForm();
          deactivateModal.onClose();
        })
        .catch((err) => {
          addToast({
            title: 'Error',
            description: err.message,
            color: 'danger',
          });
        });
    },
  });

  const deleteFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Please enter a valid Email.').required('Please enter your Email.'),
    }),
    onSubmit: async (values) => {
      if (values.email !== user?.email) {
        deleteFormik.setFieldError('email', 'The email addresses do not match.');
        return;
      }
      await axios
        .put(`/api/v1/users/uid/${user.uid}`, {
          status: user.status === 'active' ? 'deleted' : 'active',
        })
        .then(() => {
          refetch();
          addToast({
            title: `Account ${user.status === 'blocked' ? 'recovered' : 'deleted'} successfully.`,
            color: 'success',
          });
          deleteModal.onClose();
        })
        .catch((err) => {
          addToast({
            title: 'Error',
            description: err.message,
            color: 'danger',
          });
        });
    },
  });

  return (
    <>
      <Card className="bg-transparent p-2 shadow-none">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Security Settings</p>
          <p className="text-small text-default-500">Manage your security preferences</p>
        </CardHeader>
        <CardBody className="space-y-2">
          {/* Email */}
          <CellWrapper>
            <div>
              <p>Email Address</p>
              <p className="text-small text-default-500">
                The email address associated with this account.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
              <div className="flex flex-col items-end">
                <p>{user.email || '-'}</p>
                {user.email && <p className="text-small text-success">Verified</p>}
              </div>
              <Button
                endContent={<Icon icon="solar:pen-2-linear" />}
                radius="full"
                variant="bordered"
                onPress={editEmailModal.onOpen}
              >
                Edit
              </Button>
            </div>
          </CellWrapper>
          <CellWrapper>
            <div>
              <p>Phone Number</p>
              <p className="text-small text-default-500">
                The phone number associated this this account.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
              <div className="flex flex-col items-end">
                <p>{user.phone || '-'}</p>
                {user.phone && <p className="text-small text-success">Verified</p>}
              </div>
              <Button
                endContent={<Icon icon="solar:pen-2-linear" />}
                radius="full"
                variant="bordered"
                onPress={() => {
                  addToast({
                    title: "This feature isn't available yet.",
                    color: 'warning',
                  });
                }}
              >
                Edit
              </Button>
            </div>
          </CellWrapper>
          <CellWrapper>
            <div>
              <p>Password</p>
              <p className="text-small text-default-500">
                Set a unique password to protect this account.
              </p>
            </div>
            <Button radius="full" variant="bordered" onPress={editPasswordModal.onOpen}>
              Change
            </Button>
          </CellWrapper>
          <CellWrapper>
            <div>
              <p>UserType Role</p>
              <p className="text-small text-default-500 sm:whitespace-nowrap">
                The role assigned to this account.
              </p>
            </div>
            <div className="flex w-full items-center justify-end gap-6">
              <Select
                aria-label="User Role"
                variant="bordered"
                isLoading={emailFormik.values.isUpdatingRole}
                radius="full"
                className="max-w-36"
                selectedKeys={[emailFormik?.values?.user?.role] as string[]}
                onSelectionChange={async (value) => {
                  emailFormik.setFieldValue('isUpdatingRole', true);
                  const selectedValue = Array.from(value)[0];
                  emailFormik.setFieldValue('user.role', selectedValue);
                  await axios
                    .put(`/api/v1/users/uid/${user.uid}`, {
                      role: selectedValue,
                    })
                    .then(() => {
                      refetch();
                      addToast({
                        title: 'Role updated successfully',
                        color: 'success',
                      });
                    })
                    .catch((err) => {
                      addToast({
                        title: 'Error',
                        description: err.message,
                        color: 'danger',
                      });
                    });
                  emailFormik.setFieldValue('isUpdatingRole', false);
                }}
              >
                {UserRoles.map((role) => (
                  <SelectItem key={role.value}>{role.label}</SelectItem>
                ))}
              </Select>
            </div>
          </CellWrapper>

          {/* Password Reset Protection */}
          <SwitchCell
            description="Require additional information to reset your password."
            label="Password Reset Protection"
            isDisabled
          />
          {/* Require Pin */}
          <SwitchCell
            description="Require a pin to access your account."
            label="Require Pin"
            isDisabled
          />
          {/* Deactivate Account */}
          <CellWrapper>
            <div>
              <p>{user.status === 'active' ? 'Deactivate' : 'Activate'}</p>
              <p className="text-small text-default-500">
                {user.status === 'active' ? 'Deactivate' : 'Activate'} your account and delete all
                your data.
              </p>
            </div>
            <Button radius="full" variant="bordered" onPress={deactivateModal.onOpen}>
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </CellWrapper>
          {/* Delete Account */}
          <CellWrapper>
            <div>
              <p>{user.status === 'blocked' ? 'Recover' : 'Delete'} Account</p>
              <p className="text-small text-default-500">
                {user.status === 'blocked' ? 'Recover' : 'Delete'} your account and all your data.
              </p>
            </div>
            <Button
              color={user.status === 'blocked' ? 'success' : 'danger'}
              radius="full"
              variant="flat"
              onPress={deleteModal.onOpen}
            >
              {user.status === 'blocked' ? 'Recover' : 'Delete'}
            </Button>
          </CellWrapper>
        </CardBody>
      </Card>
      <EditModal
        header={{
          title: 'Email',
          subtitle: "Update user's email address",
        }}
        editEmailModal={editEmailModal}
        button={
          <Button
            color="primary"
            fullWidth
            onPress={() => emailFormik.handleSubmit()}
            isLoading={emailFormik.isSubmitting}
          >
            {emailFormik.values.isSent ? 'Verify OTP' : 'Send OTP'}
          </Button>
        }
        secondaryButton={
          emailFormik.values.isSent && (
            <Button
              color="default"
              variant="bordered"
              fullWidth
              isDisabled={emailFormik.isSubmitting}
              isLoading={emailFormik.values.isResending}
              onPress={async () => {
                // TODO: Implement resend OTP
              }}
            >
              Resend OTP
            </Button>
          )
        }
        content={
          emailFormik.values.isSent ? (
            <Input
              type="number"
              label="OTP"
              maxLength={4}
              name="otp"
              value={emailFormik.values.otp}
              onChange={emailFormik.handleChange}
              isInvalid={!!(emailFormik.touched.otp && emailFormik.errors.otp)}
              errorMessage={emailFormik.touched.otp && emailFormik.errors.otp}
            />
          ) : (
            <Input
              type="email"
              label="Email Address"
              maxLength={50}
              name="email"
              value={emailFormik.values.email}
              onChange={(e) => {
                emailFormik.setFieldValue('email', e.target.value);
              }}
              isInvalid={!!(emailFormik.touched.email && emailFormik.errors.email)}
              errorMessage={emailFormik.touched.email && emailFormik.errors.email}
            />
          )
        }
      />

      <EditModal
        header={{
          title: 'Password',
          subtitle: "Update user's password",
        }}
        editEmailModal={editPasswordModal}
        button={
          <Button
            color="primary"
            fullWidth
            onPress={() => passwordFormik.handleSubmit()}
            isLoading={passwordFormik.isSubmitting}
          >
            Change Password
          </Button>
        }
        content={
          <>
            <Input
              type="email"
              id="email"
              label="Email Address"
              maxLength={50}
              name="email"
              className="sr-only"
              hidden
            />
            <Input
              type="password"
              label="New Password"
              name="password"
              value={passwordFormik.values.password}
              onChange={passwordFormik.handleChange}
              isInvalid={!!(passwordFormik.touched.password && passwordFormik.errors.password)}
              errorMessage={passwordFormik.touched.password && passwordFormik.errors.password}
            />
            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={passwordFormik.values.confirmPassword}
              onChange={passwordFormik.handleChange}
              isInvalid={
                !!(passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword)
              }
              errorMessage={
                passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword
              }
            />
          </>
        }
      />

      <EditModal
        header={{
          title: user.status === 'active' ? 'Deactivate' : 'Activate',
          subtitle: (
            <>
              Enter the email address <strong>{user.email}</strong> to continue:
            </>
          ),
        }}
        editEmailModal={deactivateModal}
        button={
          <Button
            color={user.status === 'active' ? 'danger' : 'success'}
            fullWidth
            onPress={() => deactivateFormik.handleSubmit()}
            isLoading={deactivateFormik.isSubmitting}
            isDisabled={deactivateFormik.values.email !== user.email}
          >
            {user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
          </Button>
        }
        content={
          <Input
            type="email"
            id="email"
            label="Email Address"
            maxLength={50}
            name="email"
            value={deactivateFormik.values.email}
            onChange={deactivateFormik.handleChange}
            isInvalid={!!(deactivateFormik.touched.email && deactivateFormik.errors.email)}
            errorMessage={deactivateFormik.touched.email && deactivateFormik.errors.email}
          />
        }
      />

      <EditModal
        header={{
          title: user.status === 'blocked' ? 'Recover' : 'Delete',
          subtitle: (
            <>
              Enter the email address <strong>{user.email}</strong> to continue:
            </>
          ),
        }}
        editEmailModal={deleteModal}
        button={
          <Button
            color={user.status === 'blocked' ? 'success' : 'danger'}
            fullWidth
            onPress={() => deleteFormik.handleSubmit()}
            isLoading={deleteFormik.isSubmitting}
            isDisabled={deleteFormik.values.email !== user.email}
          >
            {user.status === 'blocked' ? 'Recover Account' : 'Delete Account'}
          </Button>
        }
        content={
          <Input
            type="email"
            id="email"
            label="Email Address"
            maxLength={50}
            name="email"
            value={deleteFormik.values.email}
            onChange={deleteFormik.handleChange}
            isInvalid={!!(deleteFormik.touched.email && deleteFormik.errors.email)}
            errorMessage={deleteFormik.touched.email && deleteFormik.errors.email}
          />
        }
      />
    </>
  );
}

interface EditModalProps {
  editEmailModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  onSubmit?: () => void;
  header?: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
  };
  content?: React.ReactNode;
  button?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}

function EditModal({
  editEmailModal,
  onSubmit,
  content,
  button,
  secondaryButton,
  header,
}: EditModalProps) {
  return (
    <Modal
      isOpen={editEmailModal.isOpen}
      onClose={editEmailModal.onClose}
      backdrop="blur"
      className="w-[420px]"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="px-6 pb-0 pt-6">
              <div className="flex flex-col items-start">
                <h4 className="text-large">{header?.title}</h4>
                <p className="text-small font-normal text-default-400">{header?.subtitle}</p>
              </div>
            </ModalHeader>
            <Spacer y={2} />
            <ModalBody className="px-3 pb-1">{content}</ModalBody>
            <Spacer y={2} />
            <Divider />
            <ModalFooter>
              {secondaryButton}
              {button || (
                <Button
                  color="primary"
                  fullWidth
                  onPress={() => {
                    onSubmit?.();
                  }}
                >
                  Send OTP
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
