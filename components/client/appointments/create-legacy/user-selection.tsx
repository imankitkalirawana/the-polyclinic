import { useState } from 'react';
import { Button, Card, CardBody, cn, Image, Input, Link, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import NoResults from '../../ui/no-results';
import Skeleton from '../../ui/skeleton';

import { CreateAppointmentType } from '@/components/appointments/create/types';
import { DoctorType } from '@/types/client/doctor';
import { UserType } from '@/types/system/control-plane';
import { useDebounce } from '@/hooks/useDebounce';

const SizeMap = {
  sm: {
    card: 'w-48',
    image: 80,
    name: 'text-large font-medium',
  },
  md: {
    card: 'w-64',
    image: 100,
    name: 'text-large font-semibold',
  },
  lg: {
    card: 'w-72',
    image: 120,
    name: 'text-large font-semibold',
  },
};

export default function UserSelection({
  id,
  users,
  isLoading,
  selectedUser,
  size = 'md',
  onSelectionChange,
}: {
  id: string;
  users: (UserType | DoctorType)[];
  isLoading?: boolean;
  selectedUser: CreateAppointmentType['patient'] | CreateAppointmentType['doctor'];
  size?: 'sm' | 'md' | 'lg';
  onSelectionChange: (uid: number) => void;
}) {
  const [query, setQuery] = useState('');
  const debounce = useDebounce(query, 500);

  if (!users) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="xs:max-w-xs">
        <Input
          placeholder={`Search for a ${id}`}
          startContent={<Icon icon="fluent:search-24-regular" width={18} />}
          className="w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isDisabled={isLoading}
        />
      </div>
      {isLoading ? (
        <LoadingUsers size={size} />
      ) : (
        <div className="flex gap-4">
          <Card
            isPressable
            className={cn(
              'no-scrollbar aspect-square rounded-medium border-small border-divider shadow-none',
              SizeMap[size].card
            )}
          >
            <CardBody className="items-center justify-center gap-4">
              <div>
                <Icon
                  icon="solar:add-circle-line-duotone"
                  width={60}
                  height={60}
                  className="text-default-500"
                />
              </div>
              <div>
                <h2 className="text-center text-large font-semibold text-primary">New Patient</h2>
              </div>
            </CardBody>
          </Card>
          <ScrollShadow orientation="horizontal" className="flex gap-4">
            {users.filter((user) => user.name.toLowerCase().includes(debounce.toLowerCase()))
              .length < 1 ? (
              <div className="flex justify-center">
                {/* TODO: This needs to be a changed */}
                <NoResults message="No User Found" />
              </div>
            ) : (
              users
                .sort((a, b) => a.name.localeCompare(b.name || '') || 0)
                .map((user) => (
                  <Card
                    isPressable
                    key={user.uid}
                    className={cn(
                      'no-scrollbar rounded-medium border-small border-divider shadow-none',
                      SizeMap[size].card,
                      {
                        'border-medium border-primary-400': user.uid === selectedUser,
                      }
                    )}
                    onPress={() => onSelectionChange(user.uid)}
                  >
                    <CardBody className="group relative items-center justify-center gap-4 overflow-hidden p-6 hover:bg-default-50">
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          isIconOnly
                          variant="light"
                          className="absolute right-1 top-1"
                          radius="full"
                          size="sm"
                          as={Link}
                          href={`/users/${user.uid}`}
                        >
                          <Icon icon="solar:pen-new-round-line-duotone" width={18} />
                        </Button>
                      </div>
                      <div>
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={SizeMap[size].image}
                          height={SizeMap[size].image}
                          className="rounded-full bg-primary-200"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <h2 className={cn('text-center', SizeMap[size].name)}>{user?.name}</h2>
                        <p className="block text-center text-small font-light text-default-500">
                          #{user?.uid}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))
            )}
          </ScrollShadow>
        </div>
      )}
    </div>
  );
}

function LoadingUsers({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className={cn(
            'flex flex-row justify-between rounded-medium border-small border-divider p-3 shadow-none',
            SizeMap[size].card
          )}
        >
          <CardBody className="items-center gap-2 overflow-hidden p-4">
            <div>
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
