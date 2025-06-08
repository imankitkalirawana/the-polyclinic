import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { UserType } from '@/models/User';
import { User } from '@heroui/react';

export function ModalCellRenderer({ user }: { user: UserType }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <User
        name={user.name}
        avatarProps={{
          src: user.image,
          size: 'sm',
          name: user.name,
        }}
        classNames={{
          description: 'text-default-400 text-tiny',
        }}
        description={`#${user.uid} - ${user.email}`}
      />
      {renderChip({ item: user.role })}
    </div>
  );
}
