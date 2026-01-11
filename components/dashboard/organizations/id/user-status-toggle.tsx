'use client';
import { Spinner, Switch } from '@heroui/react';
import { OrganizationType } from '@/services/system/organization/organization.types';
import { UserType } from '@/services/common/user/user.types';
import { useUpdateUser } from '@/services/common/user/user.query';
import { UserStatus } from '@/services/common/user/user.constants';

interface UserStatusToggleProps {
  organization: OrganizationType;
  user: UserType;
}

export default function UserStatusToggle({ organization, user }: UserStatusToggleProps) {
  const updateUser = useUpdateUser();

  const handleStatusToggle = async (isActive: boolean) => {
    await updateUser.mutateAsync({
      id: user.id,
      data: {
        organization: organization.organizationId,
        status: isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      },
    });
  };

  return (
    <Switch
      isSelected={user.status === UserStatus.ACTIVE}
      onValueChange={handleStatusToggle}
      isReadOnly={updateUser.isPending}
      thumbIcon={updateUser.isPending ? <Spinner size="sm" /> : undefined}
      size="sm"
      color="success"
    />
  );
}
