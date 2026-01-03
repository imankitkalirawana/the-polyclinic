'use client';
import { OrganizationType } from '@/services/system/organization/organization.types';
import { OrganizationUser } from '@/services/common/user';
import { useDeleteUser } from '@/services/common/user/user.query';
import Modal from '@/components/ui/modal';
import { Alert } from '@heroui/react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
  user: OrganizationUser;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  organization,
  user,
}: DeleteUserModalProps) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    await deleteUser.mutateAsync({ uid: user.uid, organization: organization.organizationId });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Delete User"
      subtitle="This will delete the user from the organization."
      body={
        <div>
          <p className="text-sm text-default-500">Name: {user.name}</p>
          <p className="text-sm text-default-500">Email: {user.email}</p>
          <p className="text-sm text-default-500">Role: {user.role}</p>
          <Alert title="This action cannot be undone." color="danger" />
        </div>
      }
      onSubmit={handleDelete}
      submitButton={{
        children: 'Delete User',
        whileSubmitting: 'Deleting...',
        color: 'danger',
      }}
    />
  );
}
