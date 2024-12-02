'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Button, Avatar } from '@nextui-org/react';

import CellValue from './cell-value';
import Link from 'next/link';
import { User } from '@/lib/interface';
import { humanReadableDate, humanReadableTime } from '@/lib/utility';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  console;
  return (
    <Card className="bg-transparent p-2 shadow-none">
      <CardHeader className="justify-between px-4">
        <div className="flex flex-col items-start">
          <p className="text-large">Personal Details</p>
          <p className="text-small text-default-500">
            Manage your personal details
          </p>
        </div>
        <Button
          color="primary"
          as={Link}
          href={`/dashboard/users/${user._id}/edit`}
        >
          Edit
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-6">
        {/* First Name */}
        <CellValue label="Full Name" value={user.name} />
        {/* Birthday */}
        <CellValue
          label="Date of Birth"
          value={user.dob ? humanReadableDate(user.dob) : "Have't born yet"}
        />
        {/* Country */}
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
        {/* State */}
        <CellValue label="State" value={user.state || '-'} />
        {/* City */}
        <CellValue label="City" value={user.city || '-'} />
        {/* Address */}
        <CellValue label="Address" value={user.address || '-'} />
        {/* Zip Code */}
        <CellValue label="Zip Code" value={user.zipcode || '-'} />
        {/* Phone Number */}
        <CellValue label="Phone Number" value={user.phone || '-'} />
        {/* Email */}
        <CellValue label="Email" value={user.email || '-'} />
        {/* Status */}
        <CellValue
          label="Status"
          value={<span className="capitalize">{user.status}</span>}
        />
        {/* Role */}
        <CellValue
          label="Role"
          value={<span className="capitalize">{user.role}</span>}
        />
        {/* Created by */}
        <CellValue
          label="Created By"
          value={`${user.createdBy || 'Admin'} on ${humanReadableDate(user.createdAt)} at ${humanReadableTime(user.createdAt)}`}
        />
        {/* Updated by */}
        <CellValue
          label="Updated By"
          value={`${user.updatedBy || 'Admin'} on ${humanReadableDate(user.updatedAt)} at ${humanReadableTime(user.updatedAt)}`}
        />
      </CardBody>
    </Card>
  );
}
