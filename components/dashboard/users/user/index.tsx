'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardFooter, CardHeader, ScrollShadow } from '@heroui/react';

import CellValue from '@/components/ui/cell-value';

import { castData } from '@/libs/utils';
import { useUserWithID } from '@/services/common/user/user.query';
import { User, UserRole } from '@/shared';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { format } from 'date-fns';

export default function UserCard({ id }: { id: string }) {
  const { data, isError, isLoading } = useUserWithID(id);

  const user = castData<User>(data);

  if (isError) {
    return <p>Error fetching user data</p>;
  }

  if (isLoading) {
    return <MinimalPlaceholder message="Loading user..." />;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  const actionButton: Record<UserRole, React.ReactNode> = {
    [UserRole.SUPER_ADMIN]: null,
    [UserRole.MODERATOR]: null,
    [UserRole.OPS]: null,
    [UserRole.GUEST]: null,
    [UserRole.ADMIN]: null,
    [UserRole.RECEPTIONIST]: null,
    [UserRole.NURSE]: null,
    [UserRole.PATIENT]: (
      <Button as={Link} href={`/appointments?id=${user.id}`} variant="flat" color="secondary">
        Book Appointment
      </Button>
    ),
    [UserRole.DOCTOR]: (
      <Button as={Link} href={`/dashboard/doctors/${user.id}`} variant="flat" color="secondary">
        View Doctor
      </Button>
    ),
  };
  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader className="justify-between px-0">
        <div className="scrollbar-hide flex flex-col items-start">
          <p className="text-large">Personal Details</p>
          <p className="text-default-500 text-small">Manage your personal details</p>
        </div>
        <Button as={Link} href={`/dashboard/users/${user.id}/edit`}>
          Edit
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-0">
        <ScrollShadow hideScrollBar className="pr-4 pb-4">
          <CellValue label="Full Name" value={user.name} />
          <CellValue label="Phone Number" value={user.phone || '-'} />
          <CellValue label="Email" value={user.email || '-'} />
          <CellValue label="Status" value={<span className="capitalize">{user.status}</span>} />
          <CellValue label="Role" value={<span className="capitalize">{user.role}</span>} />
          <CellValue
            label="Created By"
            value={`${user.createdBy || 'Admin'} on ${format(user.createdAt, 'PPPp')}`}
          />
          <CellValue
            label="Updated By"
            value={`${user.updatedBy || 'Admin'} on ${format(user.updatedAt, 'PPPp')}`}
          />
        </ScrollShadow>
      </CardBody>
      <CardFooter className="justify-end">{actionButton[user.role as UserRole]}</CardFooter>
    </Card>
  );
}
