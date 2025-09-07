'use client';
import { Spinner, Switch } from '@heroui/react';
import { OrganizationType } from '@/services/system/organization/types';
import { OrganizationUser } from '@/services/common/user';
import { useUpdateUser } from '@/services/common/user/query';

interface UserStatusToggleProps {
  organization: OrganizationType;
  user: OrganizationUser;
}

export default function UserStatusToggle({ organization, user }: UserStatusToggleProps) {
  const updateUser = useUpdateUser();

  const handleStatusToggle = async (isActive: boolean) => {
    await updateUser.mutateAsync({
      uid: user.uid,
      data: {
        organization: organization.organizationId,
        status: isActive ? 'active' : 'inactive',
      },
    });
  };

  return (
    <Switch
      isSelected={user.status === 'active'}
      onValueChange={handleStatusToggle}
      isReadOnly={updateUser.isPending}
      thumbIcon={updateUser.isPending ? <Spinner size="sm" /> : undefined}
      size="sm"
      color="success"
    />
  );
}
