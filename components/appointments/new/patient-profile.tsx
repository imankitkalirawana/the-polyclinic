'use client';

import React from 'react';
import { Button, Avatar, Image, Chip } from '@nextui-org/react';

import Link from 'next/link';
import { humanReadableDate, humanReadableTime } from '@/lib/utility';
import { UserType } from '@/models/User';
import CellValue from '@/components/ui/cell-value';
import { Icon } from '@iconify/react/dist/iconify.js';
import { parseAsInteger, useQueryState } from 'nuqs';

export default function PatientProfile({ user }: { user: UserType }) {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));
  return (
    user && (
      <div className="space-y-4 px-0">
        <div className="flex items-center justify-between rounded-2xl border border-default-300 p-4">
          <div className="flex items-center gap-4">
            <Image
              className="h-20 w-20 rounded-full"
              isBlurred
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <div className="flex items-center gap-2">
                <Chip size="sm" className="capitalize">
                  {user.role}
                </Chip>
                <Chip
                  size="sm"
                  className="capitalize"
                  color={user.status === 'active' ? 'success' : 'danger'}
                >
                  {user.status}
                </Chip>
              </div>
            </div>
          </div>
          <Button
            color="primary"
            variant="flat"
            endContent={<Icon icon={'tabler:arrow-right'} />}
            onPress={() => setStep(1)}
          >
            Proceed
          </Button>
        </div>
        <div className="rounded-2xl border border-default-300 p-4">
          <div className="mb-4">
            <h3>Personal Information</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CellValue
              className="flex-col"
              label="Full Name"
              value={user.name}
            />
            <CellValue
              className="flex-col"
              label="Email Address"
              value={user.email}
            />
            <CellValue
              className="flex-col"
              label="Phone Number"
              value={`+91 ${user.phone}`}
            />
            {user.dob && (
              <CellValue
                className="flex-col"
                label="Date of Birth"
                value={humanReadableDate(user.dob)}
              />
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-default-300 p-4">
          <div className="mb-4">
            <h3>Address</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.country && (
              <CellValue
                label="Country"
                value={
                  <div className="flex items-center gap-2">
                    <p>{user.country}</p>
                    <Avatar
                      alt={user.country}
                      className="h-6 w-6"
                      src={`https://flagcdn.com/${user.country.toLowerCase()}.svg`}
                    />
                  </div>
                }
              />
            )}
            {user.state && <CellValue label="State" value={user.state} />}
            {user.city && <CellValue label="City" value={user.city} />}
            {user.address && <CellValue label="Address" value={user.address} />}
            {user.zipcode && (
              <CellValue label="Zip Code" value={user.zipcode} />
            )}
          </div>
        </div>
      </div>
    )
  );
}
