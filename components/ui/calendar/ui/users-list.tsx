import { UserType } from '@/models/User';
import { useLinkedUsers } from '@/services/user';
import { Button, Card, CardBody, cn, Image, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

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

export default function UsersList({
  selectedUser,
  size,
  onSelectionChange,
}: {
  selectedUser: UserType;
  size?: 'sm' | 'md' | 'lg';
  onSelectionChange: (user: UserType) => void;
}) {
  const { data: linkedUsers, isLoading } = useLinkedUsers();

  // TODO: Add a loading state
  if (isLoading) return <div>Loading...</div>;

  if (!linkedUsers) return null;

  return (
    <div>
      <div className="mt-8 flex gap-4">
        <Card
          isPressable
          className={cn(
            'no-scrollbar aspect-square rounded-medium border-small border-divider shadow-none',
            SizeMap[size ?? 'sm'].card
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
              <h2 className="text-center text-large font-semibold text-primary">
                New Patient
              </h2>
            </div>
          </CardBody>
        </Card>
        <ScrollShadow orientation="horizontal" className="flex gap-4">
          {linkedUsers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((user) => (
              <Card
                isPressable
                key={user.uid}
                className={cn(
                  'no-scrollbar rounded-medium border-small border-divider shadow-none',
                  SizeMap[size ?? 'sm'].card,
                  {
                    'border-medium border-primary-400':
                      user.uid === selectedUser.uid,
                  }
                )}
                onPress={() => onSelectionChange(user)}
              >
                <CardBody className="group relative items-center gap-4 overflow-hidden p-6">
                  <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      isIconOnly
                      variant="light"
                      className="absolute right-1 top-1"
                      radius="full"
                      size="sm"
                    >
                      <Icon
                        icon="solar:pen-new-round-line-duotone"
                        width={18}
                      />
                    </Button>
                  </div>
                  <div>
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={SizeMap[size ?? 'sm'].image}
                      height={SizeMap[size ?? 'sm'].image}
                      className="rounded-full bg-primary-200"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <h2
                      className={cn('text-center', SizeMap[size ?? 'sm'].name)}
                    >
                      {user.name}
                    </h2>
                    <p className="block text-center text-small font-light text-default-500">
                      #{user.uid}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
