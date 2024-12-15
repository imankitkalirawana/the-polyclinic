'use client';
import { calculateAge } from '@/lib/client-functions';
import { UserType } from '@/models/User';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  Image,
  Link,
  Tooltip
} from '@nextui-org/react';

const genderMap: Record<string, string> = {
  male: 'fluent-emoji:male-sign',
  female: 'fluent-emoji:female-sign',
  other: 'fluent-emoji:transgender-symbol'
};

export const imageMap: Record<string, string> = {
  male: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
  female: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  other: 'https://i.pravatar.cc/150?u=a04258a2462d826712d'
};

export default function Profile({ user }: { user: UserType }) {
  return (
    <Card className="group relative flex h-52 w-52 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 p-4 shadow-sm transition-all duration-300">
      <Tooltip content="Edit User" delay={1000}>
        <Button
          as={Link}
          className="absolute right-3 top-3 bg-background/50 text-default-500"
          radius="full"
          size="sm"
          variant="light"
          isIconOnly
          href={`/dashboard/users/${user.uid}/edit`}
        >
          <Icon icon="hugeicons:edit-user-02" className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Avatar
        alt={user.name}
        src={
          user.image ||
          imageMap[user.gender] ||
          'https://nextui.org/images/hero-card.jpeg'
        }
        name={user.name}
        radius="full"
        className="h-16 w-16"
      />
      <div className="mt-2 flex flex-col items-center justify-center">
        <h3 className="flex items-center gap-2 font-sans font-semibold text-foreground">
          <Tooltip content={user.gender} className="capitalize">
            <Icon icon={genderMap[user.gender]} className="h-4 w-4" />
          </Tooltip>
          {user.name}
        </h3>
        <p className="text-muted-foreground text-sm font-light">
          {user.phone ? `+91 ${user.phone}` : user.uid}
        </p>
      </div>
      <div className="mt-2 flex w-full justify-evenly rounded-3xl bg-background/50 p-1 text-sm text-foreground backdrop-blur-md">
        <span>{calculateAge(user.dob)}Y</span>
        <Divider orientation="vertical" className="w-[1px]" />
        <Tooltip content={user.email}>
          <span className="max-w-[50%] overflow-hidden overflow-ellipsis">
            {user.email}
          </span>
        </Tooltip>
      </div>
    </Card>
  );
}
