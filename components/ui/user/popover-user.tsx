'use client';

import { apiRequest } from '@/lib/axios';
import { UserType } from '@/models/User';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Link,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';
import { renderChip } from '../data-table/cell-renderers';

// TODO: Add a loading skeleton and remove this line after done

export default function PopoverCard({ uid }: { uid: number }) {
  const { data: user } = useQuery<UserType>({
    queryKey: ['user', uid],
    queryFn: () =>
      apiRequest({
        method: 'GET',
        url: `/api/v1/users/${uid}`,
      }),
  });

  if (!user) return null;

  return (
    <Card className="w-[400px]">
      <CardBody className="gap-4">
        <div>
          <Avatar src={user.image} name={user.name} size="lg" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-large font-medium">{user.name}</div>
          <Link
            href={`mailto:${user.email}`}
            className="flex items-center gap-1 text-small text-default-400"
          >
            <Icon icon="solar:letter-bold-duotone" width={16} />
            <span className="hover:text-primary">{user.email}</span>
          </Link>
          {user.phone && (
            <Link
              href={`tel:${user.phone}`}
              className="flex items-center gap-1 text-small text-default-400"
            >
              <Icon icon="solar:phone-bold-duotone" width={16} />
              <span className="hover:text-primary">{user.phone}</span>
            </Link>
          )}
          {user.address && (
            <div className="flex items-center gap-1 text-small text-default-400">
              <Icon icon="solar:map-point-bold-duotone" width={16} />
              <span>{user.address}</span>
            </div>
          )}
          <div className="flex gap-2">
            {renderChip({ item: user.role, richColor: true })}
            {renderChip({ item: user.status, richColor: true })}
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          as={Link}
          target="_blank"
          href={`/dashboard/users/${user.uid}`}
          variant="bordered"
          fullWidth
          color="default"
        >
          <Icon icon="solar:arrow-right-up-line-duotone" width={18} />
          <span>View Profile</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
