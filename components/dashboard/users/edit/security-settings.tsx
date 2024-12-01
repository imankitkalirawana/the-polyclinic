'use client';

import type { CardProps } from '@nextui-org/react';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Spacer,
  Image,
  Input,
  ModalHeader,
  CardFooter,
  Divider
} from '@nextui-org/react';
import { Icon } from '@iconify/react';

import SwitchCell from './switch-cell';
import CellWrapper from './cell-wrapper';

export default function Component(props: CardProps) {
  const editEmailModal = useDisclosure();
  return (
    <>
      <Card className="w-full max-w-lg p-2" {...props}>
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Security Settings</p>
          <p className="text-small text-default-500">
            Manage your security preferences
          </p>
        </CardHeader>
        <CardBody className="space-y-2">
          {/* Email */}
          <CellWrapper>
            <div>
              <p>Email Address</p>
              <p className="text-small text-default-500">
                The email address associated with your account.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
              <div className="flex flex-col items-end">
                <p>john.doe@mail.com</p>
                <p className="text-small text-success">Verified</p>
              </div>
              <Button
                endContent={<Icon icon="solar:pen-2-linear" />}
                radius="full"
                variant="bordered"
                onClick={editEmailModal.onOpen}
              >
                Edit
              </Button>
            </div>
          </CellWrapper>
          <CellWrapper>
            <div>
              <p>Password</p>
              <p className="text-small text-default-500">
                Set a unique password to protect your account.
              </p>
            </div>
            <Button radius="full" variant="bordered">
              Change
            </Button>
          </CellWrapper>
          {/* Two-Factor Authentication */}
          <SwitchCell
            defaultSelected
            description="Add an extra layer of security to your account."
            label="Two-Factor Authentication"
          />
          {/* Password Reset Protection */}
          <SwitchCell
            description="Require additional information to reset your password."
            label="Password Reset Protection"
          />
          {/* Require Pin */}
          <SwitchCell
            defaultSelected
            description="Require a pin to access your account."
            label="Require Pin"
          />
          {/* Deactivate Account */}
          <CellWrapper>
            <div>
              <p>Deactivate Account</p>
              <p className="text-small text-default-500">
                Deactivate your account and delete all your data.
              </p>
            </div>
            <Button radius="full" variant="bordered">
              Deactivate
            </Button>
          </CellWrapper>
          {/* Delete Account */}
          <CellWrapper>
            <div>
              <p>Delete Account</p>
              <p className="text-small text-default-500">
                Delete your account and all your data.
              </p>
            </div>
            <Button color="danger" radius="full" variant="flat">
              Delete
            </Button>
          </CellWrapper>
        </CardBody>
      </Card>
      <Modal
        isOpen={editEmailModal.isOpen}
        onClose={editEmailModal.onClose}
        backdrop="blur"
        className="w-[420px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="px-6 pb-0 pt-6">
                <div className="flex flex-col items-start">
                  <h4 className="text-large">Email</h4>
                  <p className="text-small font-normal text-default-400">
                    Update your email address
                  </p>
                </div>
              </ModalHeader>
              <Spacer y={2} />
              <ModalBody className="px-3 pb-1">
                <Input
                  isClearable
                  type="email"
                  label="Email Address"
                  maxLength={50}
                  // value={orgName}
                  // onValueChange={setOrgName}
                />
              </ModalBody>
              <Spacer y={2} />
              <Divider />
              <ModalFooter className="flex-wrap-reverse justify-between gap-2 px-4 md:flex-wrap">
                <p className="text-small text-default-400">
                  Max. 50 characters.{' '}
                  {/* <span className="text-default-500">{orgName.length}/50</span> */}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="bordered" onClick={editEmailModal.onClose}>
                    Cancel
                  </Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
