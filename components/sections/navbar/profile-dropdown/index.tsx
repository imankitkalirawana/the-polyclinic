import ModeToggle from '@/components/mode-toggle';
import { useSession } from '@/lib/providers/session-provider';
import { useLogout } from '@/services/common/auth/query';
import { Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem } from '@heroui/react';

export default function ProfileDropdown() {
  const { user } = useSession();
  const { mutateAsync } = useLogout();

  return (
    <Dropdown size="sm" placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          size="sm"
          className="bg-primary-200 transition-transform"
          src={user?.image || ''}
          name={user?.name || ''}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" href="/profile" className="h-14 gap-2">
          <p className="font-semibold">{user?.name}</p>
          <p className="capitalize text-default-500 text-tiny">{user?.role}</p>
        </DropdownItem>
        <DropdownItem key="my-profile" href="/profile">
          My Profile
        </DropdownItem>
        <DropdownItem key="dashboard" href="/dashboard">
          My Dashboard
        </DropdownItem>
        <DropdownItem key="appointments" href="/appointments">
          My Appointments
        </DropdownItem>
        <DropdownItem key="theme">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <ModeToggle />
          </div>
        </DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem
          key="logout"
          onPress={async () => {
            await mutateAsync();
          }}
          color="danger"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
