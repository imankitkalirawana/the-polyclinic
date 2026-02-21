import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';
import { renderChip, RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useUserProfileByID } from '@/services/common/user/user.query';
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Tooltip } from '@heroui/react';
import { User } from '@repo/store';

export const UserDetailsPopover = ({
  name,
  description,
  id,
}: {
  name: string;
  description: string;
  id: string;
}) => {
  const { data } = useUserProfileByID(id);

  return (
    <Tooltip
      isDisabled={!data}
      showArrow
      delay={1000}
      content={<UserDetailsPopoverContent user={data?.user} />}
    >
      <span className="inline-block cursor-pointer">
        <RenderUser name={name} description={description} size="sm" />
      </span>
    </Tooltip>
  );
};

const UserDetailsPopoverContent = ({ user }: { user?: User | null }) => {
  if (!user) return <MinimalPlaceholder message="User not found..." isLoading={false} />;

  return (
    <Card className="max-w-[300px] border-none bg-transparent" shadow="none">
      <CardHeader className="justify-between gap-2">
        <RenderUser name={user.name} size="md" description={renderChip({ item: user.role })} />
        <Button
          color="primary"
          radius="full"
          size="sm"
          as={Link}
          href={`/dashboard/users/${user.id}`}
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
          <p className="text-default-600 text-small font-semibold">4</p>
          <p className="text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="text-default-600 text-small font-semibold">97.1K</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};
