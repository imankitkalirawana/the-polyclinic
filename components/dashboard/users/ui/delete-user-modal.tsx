import Modal from '@/components/ui/modal';
import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { useDeleteUser, useUserWithID } from '@/services/common/user/user.query';
import { Card, CardBody } from '@heroui/react';

export default function DeleteUserModal({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
}) {
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { data: user } = useUserWithID(userId);

  const onSubmit = async () => {
    if (userId) {
      await deleteUser(userId);
      onClose();
    }
  };

  const renderBody = () => {
    return (
      <div className="flex flex-col gap-4">
        <Card radius="md">
          <CardBody>
            <RenderUser name={user?.name} description={user?.email} />
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User"
      subtitle="Are you sure you want to delete this user?"
      body={renderBody()}
      submitButton={{
        children: 'Delete User',
        whileSubmitting: 'Deleting user...',
        color: 'danger',
      }}
      onSubmit={onSubmit}
    />
  );
}
