'use client';

import { apiRequest } from '@/lib/axios';
import { UserType } from '@/models/User';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';
import { renderChip } from '../data-table/cell-renderers';

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
        <div>
          <p className="text-large font-medium">{user.name}</p>
          <p className="max-w-[90%] text-small text-default-400">
            {user.email} {user.phone ? `| ${user.phone}` : ''}
          </p>
          <div className="flex gap-2 pb-1 pt-2">
            {renderChip({ item: user.role })}
            {renderChip({ item: user.status })}
          </div>
          <p className="py-2 text-small text-foreground">{user.address}</p>
        </div>
      </CardBody>
    </Card>
  );
}
