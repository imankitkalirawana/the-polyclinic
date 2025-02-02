'use client';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@heroui/react';

export default function Header({ session }: { session?: any }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-divider py-2">
        <h2 className="text-2xl font-semibold text-default-900">
          New Appointment
        </h2>
        <div className="flex items-center gap-2">
          <h3 className="text-small font-light text-default-500">
            {session.user.name}
          </h3>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                src="/assets/placeholder-avatar.jpeg"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="dashboard" href="/dashboard">
                My Dashboard
              </DropdownItem>
              <DropdownItem key="appointments" href="/appointments">
                My Appointments
              </DropdownItem>

              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
