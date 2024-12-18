'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  CardFooter,
  ScrollShadow
} from '@nextui-org/react';

import CellValue from '../../../ui/cell-value';
import Link from 'next/link';
import { humanReadableDate, humanReadableTime } from '@/lib/utility';
import { UserType } from '@/models/User';

interface UserCardProps {
  user: UserType;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader className="justify-between px-0">
        <div className="no-scrollbar flex flex-col items-start">
          <p className="text-large">Personal Details</p>
          <p className="text-small text-default-500">
            Manage your personal details
          </p>
        </div>
        <Button
          color="primary"
          as={Link}
          href={`/dashboard/users/${user.uid}/edit`}
        >
          Edit
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-0">
        <ScrollShadow className="pr-4">
          <CellValue label="Full Name" value={user.name} />
          <CellValue
            label="Date of Birth"
            value={user.dob ? humanReadableDate(user.dob) : "Have't born yet"}
          />
          <CellValue
            label="Country"
            value={
              user.country ? (
                <div className="flex items-center gap-2">
                  <p>{user.country}</p>
                  <Avatar
                    alt={user.country}
                    className="h-6 w-6"
                    src={`https://flagcdn.com/${user.country.toLowerCase()}.svg`}
                  />
                </div>
              ) : (
                '-'
              )
            }
          />
          <CellValue label="State" value={user.state || '-'} />
          <CellValue label="City" value={user.city || '-'} />
          <CellValue label="Address" value={user.address || '-'} />
          <CellValue label="Zip Code" value={user.zipcode || '-'} />
          <CellValue label="Phone Number" value={user.phone || '-'} />
          <CellValue label="Email" value={user.email || '-'} />
          <CellValue
            label="Status"
            value={<span className="capitalize">{user.status}</span>}
          />
          <CellValue
            label="Role"
            value={<span className="capitalize">{user.role}</span>}
          />
          <CellValue
            label="Created By"
            value={`${user.createdBy || 'Admin'} on ${humanReadableDate(user.createdAt)} at ${humanReadableTime(user.createdAt)}`}
          />
          <CellValue
            label="Updated By"
            value={`${user.updatedBy || 'Admin'} on ${humanReadableDate(user.updatedAt)} at ${humanReadableTime(user.updatedAt)}`}
          />
        </ScrollShadow>
      </CardBody>
      <CardFooter className="justify-end">
        <Button
          as={Link}
          href={`/appointments?uid=${user.uid}`}
          variant="flat"
          color="primary"
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
}
