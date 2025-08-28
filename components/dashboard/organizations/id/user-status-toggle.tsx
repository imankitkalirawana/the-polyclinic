'use client';
import { Switch } from '@heroui/react';
import { useUpdateOrganizationUser } from '@/hooks/queries/system/organization';
import { OrganizationType } from '@/types/system/organization';
import { OrganizationUserType } from '@/types/system/organization';

interface UserStatusToggleProps {
  organization: OrganizationType;
  user: OrganizationUserType;
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
