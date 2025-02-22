'use client';
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import { signOut } from 'next-auth/react';
import ModeToggle from '../mode-toggle';

export default function ProfileDropdown({ session }: { session: any }) {
  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src="/assets/placeholder-avatar.jpeg"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" href="/profile" className="h-14 gap-2">
            <p className="text-xs text-default-500">Signed in as</p>
            <p className="font-semibold">{session.user.name}</p>
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
          <DropdownItem key="logout" onPress={() => signOut()} color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
