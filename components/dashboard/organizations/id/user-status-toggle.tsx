'use client';
import { Switch } from '@heroui/react';
import { useUpdateOrganizationUser } from '@/services/organization/query';
import { OrganizationType } from '@/services/organization/types';
import { OrganizationUser } from '@/services/common/user';

interface UserStatusToggleProps {
  organization: OrganizationType;
  user: OrganizationUser;
}

export default function UserStatusToggle({ organization, user }: UserStatusToggleProps) {
  const updateUser = useUpdateOrganizationUser();

  const handleStatusToggle = async (isActive: boolean) => {
    await updateUser.mutateAsync({
      organizationId: organization.organizationId,
      userId: user.uid,
      data: {
        status: isActive ? 'active' : 'inactive',
      },
    });
  };

  return (
    <Switch
      isSelected={user.status === 'active'}
      onValueChange={handleStatusToggle}
      isReadOnly={updateUser.isPending}
      size="sm"
      color="success"
    />
  );
}
