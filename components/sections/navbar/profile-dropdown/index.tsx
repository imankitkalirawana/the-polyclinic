import ModeToggle from '@/components/mode-toggle';
import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { useSession } from '@/libs/providers/session-provider';
import { useLogout } from '@/services/common/auth/auth.query';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function ProfileDropdown() {
  const { user } = useSession();
  const { mutateAsync } = useLogout();

  return (
    <Dropdown size="sm" placement="bottom-end">
      <DropdownTrigger>
        <Button
          aria-label="Profile"
          className="bg-default-200 pl-1 pr-2"
          startContent={<RenderUser isCompact name={user?.name} size="sm" />}
          endContent={<Icon icon="solar:alt-arrow-down-linear" width={18} />}
        >
          {user?.name}
        </Button>
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
            await mutateAsync(undefined);
          }}
          color="danger"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
