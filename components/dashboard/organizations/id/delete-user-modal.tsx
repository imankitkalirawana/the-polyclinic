'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDeleteOrganizationUser } from '@/hooks/queries/system/organization';
import { toast } from 'sonner';
import { OrganizationType } from '@/types/system/organization';
import { OrganizationUserType } from '@/types/system/organization';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationType;
  user: OrganizationUserType;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  organization,
  user,
}: DeleteUserModalProps) {
  const deleteUser = useDeleteOrganizationUser();

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync({
        organizationId: organization.organizationId,
        userId: user._id,
      });

      toast.success('User deleted successfully');
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-danger">
            <Icon icon="solar:trash-bin-trash-line-duotone" className="h-5 w-5" />
            <span>Delete User</span>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="text-center">
            <Icon
              icon="solar:warning-circle-line-duotone"
              className="mx-auto mb-4 h-16 w-16 text-warning"
            />
            <h3 className="mb-2 text-lg font-semibold">Are you sure?</h3>
            <p className="mb-4 text-default-400">
              You are about to delete <strong>{user.name}</strong> from{' '}
              <strong>{organization.name}</strong>. This action cannot be undone.
            </p>
            <div className="rounded-lg bg-default-50 p-4">
              <p className="text-sm text-default-600">
                <strong>User Details:</strong>
              </p>
              <p className="text-sm text-default-500">Name: {user.name}</p>
              <p className="text-sm text-default-500">Email: {user.email}</p>
              <p className="text-sm text-default-500">Role: {user.role}</p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={handleDelete} isLoading={deleteUser.isPending}>
            Delete User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
