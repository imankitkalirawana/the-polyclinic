'use client';

import React from 'react';
import {
  Button,
  Avatar,
  Image,
  Chip,
  Card,
  Link,
  Tooltip
} from '@nextui-org/react';

import { humanReadableDate } from '@/lib/utility';
import { UserType } from '@/models/User';
import CellValue from '@/components/ui/cell-value';
import { Icon } from '@iconify/react/dist/iconify.js';
import { parseAsInteger, useQueryState } from 'nuqs';
import { cn } from '@/lib/utils';
import ProfileSkeleton from '@/components/skeletons/appointments/profile-skeleton';
import { useQuery } from '@tanstack/react-query';
import { getUserWithUID } from '@/functions/server-actions';

export default React.memo(function PatientProfile() {
  const [uid] = useQueryState('uid');

  const {
    data: user,
    isError,
    isLoading
  } = useQuery<UserType>({
    queryKey: ['user', uid],
    queryFn: () => {
      return getUserWithUID(parseInt(uid as string));
    },
    enabled: !!uid
  });

  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : user ? (
        <Card
          className={cn('w-full space-y-4 p-4', {
            '': step > 0
          })}
        >
          <div
            className={cn('flex justify-between', {
              'flex-col gap-4': step > 0
            })}
          >
            <div className="flex items-center gap-4">
              <Image
                className={cn('h-20 w-20 rounded-full', {
                  'h-12 w-12': step > 0
                })}
                isBlurred
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              />
              <div className="flex flex-col">
                <h2
                  className={cn('text-lg font-semibold', {
                    'text-base': step > 0
                  })}
                >
                  {user.name}
                </h2>
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
            <div
              className={cn('flex items-start gap-2', {
                'flex-col gap-4': step > 0
              })}
            >
              <div className="flex gap-2">
                <Tooltip content="Send an Email">
                  <Button
                    isIconOnly
                    // size={step > 0 ? 'sm' : 'md'}
                    as={Link}
                    target="_BLANK"
                    href={`mailto:${user.email}`}
                    variant="bordered"
                  >
                    <Icon icon="mage:email" width="20" />
                  </Button>
                </Tooltip>
                <Tooltip content="Call Patient">
                  <Button
                    // size={step > 0 ? 'sm' : 'md'}
                    isIconOnly
                    as={Link}
                    target="_BLANK"
                    href={`tel:+91${user.phone}`}
                    variant="bordered"
                  >
                    <Icon icon="mage:mobile-phone" width="20" />
                  </Button>
                </Tooltip>
                <Tooltip content="Send a Message">
                  <Button
                    // size={step > 0 ? 'sm' : 'md'}
                    isIconOnly
                    as={Link}
                    target="_BLANK"
                    href={`https://wa.me/91${user.phone}`}
                    variant="bordered"
                  >
                    <Icon icon="mage:whatsapp" width="20" />
                  </Button>
                </Tooltip>
                <Tooltip content="Edit Patient Profile">
                  <Button
                    // size={step > 0 ? 'sm' : 'md'}
                    isIconOnly
                    as={Link}
                    href={`/dashboard/users/${user.uid}/edit`}
                    variant="bordered"
                  >
                    <Icon icon="mage:edit" width={20} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <h3>Personal Information</h3>
            </div>
            <div
              className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', {
                // 'flex flex-col gap-4': step > 0
              })}
            >
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
          {step === 0 && (
            <div>
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
                {user.address && (
                  <CellValue label="Address" value={user.address} />
                )}
                {user.zipcode && (
                  <CellValue label="Zip Code" value={user.zipcode} />
                )}
              </div>
            </div>
          )}
        </Card>
      ) : (
        'Not Found'
      )}
    </>
  );
});
