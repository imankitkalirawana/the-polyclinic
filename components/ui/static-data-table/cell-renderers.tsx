'use client';

import {
  Button,
  Chip,
  ChipProps,
  cn,
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import { format } from 'date-fns';
import type React from 'react';
import { Icon } from '@iconify/react';

import { CopyText } from '@/components/ui/copy';
import { chipColorMap, ChipColorType } from '@/libs/chip';
import Avatar from 'boring-avatars';
import { Role } from '@/services/common/user/user.constants';

/**
 * @deprecated Avoid using this .
 * Use the `CopyText` component instead.
 */
export const renderCopyableText = (text: string | null | undefined) => <CopyText>{text}</CopyText>;

export const RenderUser = ({
  name,
  size = 'md',
  variant = 'marble',
  description,
  isCompact,
  classNames,
}: {
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'bauhaus' | 'beam' | 'geometric' | 'marble' | 'pixel' | 'ring' | 'sunset' | 'abstract';
  description?: string | number | React.ReactNode;
  isCompact?: boolean;
  classNames?: {
    name?: string;
    description?: string;
    avatar?: string;
  };
}) => {
  const sizeClass: Record<
    typeof size,
    {
      avatar: string;
      gap: string;
    }
  > = {
    sm: {
      avatar: 'size-8',
      gap: 'gap-0',
    },
    md: {
      avatar: 'size-9',
      gap: 'gap-0.5',
    },
    lg: {
      avatar: 'size-11',
      gap: 'gap-0.5',
    },
    xl: {
      avatar: 'size-12',
      gap: 'gap-1',
    },
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar
        name={name ?? 'Unknown User'}
        className={cn(classNames?.avatar, sizeClass[size].avatar)}
        variant={variant}
      />
      {!isCompact && (
        <div className={cn('flex flex-col items-start', sizeClass[size].gap)}>
          <h4 className={cn('text-default-foreground text-small text-nowrap', classNames?.name)}>
            {name}
          </h4>
          <div className={cn('text-default-500 text-tiny text-nowrap', classNames?.description)}>
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

export const renderDate = ({ date, isTime = false }: { date: Date | string; isTime?: boolean }) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className="flex flex-col">
      <p className="text-default-foreground text-small text-nowrap capitalize">
        {format(dateObj, 'PP')}
      </p>
      {isTime && (
        <p className="text-default-500 text-tiny text-nowrap capitalize">{format(dateObj, 'p')}</p>
      )}
    </div>
  );
};

export const renderCountry = (name: string, icon: React.ReactNode) => (
  <div className="flex items-center gap-2">
    <div className="h-[16px] w-[16px]">{icon}</div>
    <p className="text-default-foreground text-small text-nowrap">{name}</p>
  </div>
);

export const renderChip = ({ item, size }: { item: ChipColorType; size?: ChipProps['size'] }) => (
  <Chip
    className={cn('flex w-fit items-center', chipColorMap[item])}
    radius="full"
    variant="flat"
    size={size}
  >
    <span className="capitalize">{item?.replace(/[_-]/g, ' ').toLowerCase()}</span>
  </Chip>
);

export const renderChips = (items: string[]) => (
  <div className="float-start flex gap-1">
    {items.map((item, index) => {
      if (index < 3) {
        return (
          <Chip
            key={item}
            className="rounded-small bg-default-100 text-default-800 px-[6px] capitalize"
            size="sm"
            variant="flat"
          >
            {item}
          </Chip>
        );
      }
      if (index === 3) {
        return (
          <Chip key={item} className="text-default-500" size="sm" variant="flat">
            {`+${items.length - 3}`}
          </Chip>
        );
      }

      return null;
    })}
  </div>
);

export type DropdownItemWithSection = DropdownItemProps & {
  section?: string;
  roles?: Role[];
  isHidden?: boolean;
};

function groupBy<T extends DropdownItemWithSection>(
  array: T[],
  key: 'section'
): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = item[key] ?? '';
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

// filter the dropdown items by the user's roles
const filterDropdownItems = (items: DropdownItemWithSection[], userRole: Role | undefined) => {
  return items.filter((item) => {
    if (item.isHidden && userRole) {
      return !item.isHidden;
    }
    if (item.roles && userRole) {
      return item.roles.includes(userRole);
    }

    return true;
  });
};

export const renderDropdownMenu = (
  items: DropdownItemWithSection[],
  useRole?: Role | undefined
) => {
  const filteredItems = filterDropdownItems(items, useRole);
  const groupedItems = groupBy(filteredItems, 'section');
  const itemsWithoutSection = groupedItems[''] ?? [];
  const sections = Object.entries(groupedItems).filter(([key]) => key !== '');
  const hasSections = sections.length > 0;
  const shouldWrapInDefaultSection = hasSections && itemsWithoutSection.length > 0;

  return (
    <Dropdown aria-label="Actions" placement="bottom-end">
      <DropdownTrigger>
        <Button variant="light" isIconOnly>
          <Icon icon="solar:menu-dots-bold" width={18} className="rotate-90" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <>
          {shouldWrapInDefaultSection ? (
            <DropdownSection key="actions" showDivider>
              {itemsWithoutSection.map((item) => {
                const { key, section, ...rest } = item;
                return <DropdownItem key={key} {...rest} />;
              })}
            </DropdownSection>
          ) : (
            itemsWithoutSection.map((item) => {
              const { key, section, ...rest } = item;
              return <DropdownItem key={key} {...rest} />;
            })
          )}
          {sections.map(([sectionName, sectionItems], index) => (
            <DropdownSection
              key={sectionName}
              title={sectionName}
              showDivider={index !== sections.length - 1}
            >
              {sectionItems.map((item) => {
                const { key, section, ...rest } = item;
                return <DropdownItem key={key} {...rest} />;
              })}
            </DropdownSection>
          ))}
        </>
      </DropdownMenu>
    </Dropdown>
  );
};
