'use client';
import { Switch } from '@heroui/react';
import { useUpdateOrganizationUser } from '@/services/organization';
import { toast } from 'sonner';
import { OrganizationType } from '@/types/organization';
import { UserType } from '@/types/control-plane';

interface UserStatusToggleProps {
  organization: OrganizationType;
  user: UserType;
}

export default function UserStatusToggle({ organization, user }: UserStatusToggleProps) {
  const updateUser = useUpdateOrganizationUser();

  const handleStatusToggle = async (isActive: boolean) => {
    try {
      await updateUser.mutateAsync({
        organizationId: organization.organizationId,
        userId: user._id,
        data: {
          status: isActive ? 'active' : 'inactive',
        },
      });

      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
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
