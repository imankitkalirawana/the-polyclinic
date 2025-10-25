import { CellRenderer } from '@/components/ui/cell-renderer';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { UnifiedUser } from '@/services/common/user';
import { useUserWithUID } from '@/services/common/user/query';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Tooltip,
  User,
  UserProps,
} from '@heroui/react';

export const UserDetailsPopover = (
  user: UserProps & {
    uid: string;
  }
) => {
  const { data } = useUserWithUID(user.uid);

  return (
    <Tooltip
      isDisabled={!data}
      showArrow
      delay={1000}
      content={<UserDetailsPopoverContent user={data} />}
    >
      <User {...user} />
    </Tooltip>
  );
};

const UserDetailsPopoverContent = ({ user }: { user?: UnifiedUser | null }) => {
  if (!user) return <MinimalPlaceholder message="User not found..." isLoading={false} />;

  return (
    <Card className="max-w-[300px] border-none bg-transparent" shadow="none">
      <CardHeader className="justify-between gap-2">
        <div className="flex gap-3">
          <Avatar isBordered radius="full" size="md" src={user.image} />
          <div className="flex flex-col items-start justify-center">
            <h4 className="font-semibold leading-none text-default-600 text-small">{user.name}</h4>
            {renderChip({ item: user.role })}
          </div>
        </div>
        <Button
          color="primary"
          radius="full"
          size="sm"
          as={Link}
          href={`/dashboard/users/${user.uid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-3 py-0">
        <CellRenderer
          className="p-0"
          label="Email"
          value={user.email}
          icon="solar:letter-bold-duotone"
          classNames={{ icon: 'text-blue-500 bg-blue-100' }}
        />
        <CellRenderer
          className="p-0"
          label="Phone"
          value={user.phone}
          icon="solar:phone-bold-duotone"
          classNames={{ icon: 'text-green-500 bg-green-100' }}
        />
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">4</p>
          <p className="text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">97.1K</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};
