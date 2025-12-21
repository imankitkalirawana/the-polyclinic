'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardFooter, CardHeader, ScrollShadow } from '@heroui/react';

import CellValue from '@/components/ui/cell-value';

import { castData } from '@/lib/utils';
import { useUserWithUID } from '@/services/common/user/query';
import { OrganizationUser, UnifiedUser } from '@/services/common/user';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { format } from 'date-fns';

export default function UserCard({ uid }: { uid: string }) {
  const { data, isError, isLoading } = useUserWithUID(uid);

  const user = castData<UnifiedUser>(data);

  if (isError) {
    return <p>Error fetching user data</p>;
  }

  if (isLoading) {
    return <MinimalPlaceholder message="Loading user..." />;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  const actionButton: Record<OrganizationUser['role'], React.ReactNode> = {
    admin: null,
    receptionist: null,
    nurse: null,
    pharmacist: null,
    patient: (
      <Button as={Link} href={`/appointments?uid=${user.uid}`} variant="flat" color="secondary">
        Book Appointment
      </Button>
    ),
    doctor: (
      <Button as={Link} href={`/dashboard/doctors/${user.uid}`} variant="flat" color="secondary">
        View Doctor
      </Button>
    ),
  };
  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader className="justify-between px-0">
        <div className="flex flex-col items-start scrollbar-hide">
          <p className="text-large">Personal Details</p>
          <p className="text-default-500 text-small">Manage your personal details</p>
        </div>
        <Button as={Link} href={`/dashboard/users/${user.uid}/edit`}>
          Edit
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-0">
        <ScrollShadow hideScrollBar className="pb-4 pr-4">
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
      <CardFooter className="justify-end">
        {actionButton[user.role as OrganizationUser['role']]}
      </CardFooter>
    </Card>
  );
}
