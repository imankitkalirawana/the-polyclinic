'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  type ListboxProps,
  type ListboxSectionProps,
  type Selection,
} from '@heroui/react';
import { cn, Link, Listbox, ListboxItem, ListboxSection, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Role } from '@/services/common/user/user.constants';

export enum SidebarItemType {
  Nest = 'nest',
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
  roles?: Role[];
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, 'children'> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps['classNames'];
  classNames?: ListboxProps['classNames'];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      defaultSelectedKey,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey);

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, 'w-full', {
        'p-0 max-w-[44px]': isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        'flex flex-col gap-1': isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        'w-11 h-11 gap-0 p-0': isCompact,
      }),
    };

    const renderNestItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

        if (isNestType) {
          // Is a nest type item , so we need to remove the href
          delete item.href;
        }

        return (
          <ListboxItem
            {...item}
            key={item.key}
            classNames={{
              base: cn(
                {
                  'h-auto p-0': !isCompact && isNestType,
                },
                {
                  'inline-block w-11': isCompact && isNestType,
                }
              ),
            }}
            endContent={
              isCompact || isNestType || hideEndContent ? null : (item.endContent ?? null)
            }
            startContent={
              isCompact || isNestType ? null : item.icon ? (
                <Icon
                  className={cn(
                    'text-default-500 group-data-[selected=true]:text-foreground',
                    iconClassName
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            title={isCompact || isNestType ? null : item.title}
            aria-label={item.title}
          >
            {isCompact && isNestType && item.items && item.items.length > 0 ? (
              <Tooltip
                key={`${item.key}-nest-tooltip`}
                placement="right"
                showArrow
                content={
                  <div>
                    <div className="w-full px-2 py-1 text-foreground-500 text-tiny">
                      {item.title}
                    </div>
                    <Listbox aria-label="nested-list" items={item.items} variant="flat">
                      {item.items.map((subItem) => (
                        <ListboxItem
                          key={subItem.key}
                          as={Link}
                          href={subItem.href}
                          startContent={
                            subItem.icon ? <Icon icon={subItem.icon} width={24} /> : null
                          }
                          className="text-default-500"
                        >
                          {subItem.title}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                }
              >
                <div
                  data-testid="sidebar-item-icon"
                  className="flex aspect-square w-full items-center justify-center"
                >
                  {item.icon ? (
                    <Icon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-primary-500',
                        iconClassName
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    (item.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            ) : isCompact ? (
              <Tooltip key={`${item.key}-tooltip`} content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <Icon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-primary-500',
                        iconClassName
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    (item.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            ) : null}
            {!isCompact && isNestType ? (
              <Accordion
                key={`${item.key}-accordion`}
                className="p-0"
                variant="light"
                selectionMode="single"
              >
                <AccordionItem
                  key={item.key}
                  aria-label={item.title}
                  classNames={{
                    heading: 'pr-3',
                    trigger: 'p-0',
                    content: 'py-0 pl-4',
                  }}
                  title={
                    item.icon ? (
                      <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                        <Icon
                          className={cn(
                            'text-default-500 group-data-[selected=true]:text-primary-500',
                            iconClassName
                          )}
                          icon={item.icon}
                          width={24}
                        />
                        <span className="font-medium text-default-500 text-small group-data-[selected=true]:text-primary-500">
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      (item.startContent ?? null)
                    )
                  }
                >
                  {item.items && item.items?.length > 0 ? (
                    <Listbox
                      className="mt-0.5"
                      classNames={{
                        list: cn('border-l border-default-200 pl-4'),
                      }}
                      items={item.items}
                      variant="flat"
                      aria-label="nested-list"
                    >
                      {item.items.map(renderItem)}
                    </Listbox>
                  ) : (
                    renderItem(item)
                  )}
                </AccordionItem>
              </Accordion>
            ) : null}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName, items]
    );

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

        if (isNestType) {
          return renderNestItem(item);
        }

        return (
          <ListboxItem
            {...item}
            as={Link}
            key={item.key}
            endContent={isCompact || hideEndContent ? null : (item.endContent ?? null)}
            startContent={
              isCompact ? null : item.icon ? (
                <Icon
                  className={cn(
                    'text-default-500 group-data-[selected=true]:text-primary-500',
                    iconClassName
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            className="text-default-500"
            title={isCompact ? null : item.title}
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <Icon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-primary-500',
                        iconClassName
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    (item.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            ) : null}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName, itemClasses?.base]
    );

    return (
      <Listbox
        key={isCompact ? 'compact' : 'default'}
        ref={ref}
        hideSelectedIcon
        as="nav"
        className={cn('list-none', className)}
        classNames={{
          ...classNames,
          list: cn('items-center', classNames?.list),
        }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn(
            'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100',
            itemClasses?.base
          ),
          title: cn(
            'text-small font-medium text-default-500 group-data-[selected=true]:text-primary-500',
            itemClasses?.title
          ),
        }}
        items={items}
        selectedKeys={[selected] as unknown as Selection}
        selectionMode="single"
        variant="flat"
        aria-label="sidebar"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];

          setSelected(key as React.Key);
          onSelect?.(key as string);
        }}
        {...props}
      >
        {(item) =>
          item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest ? (
            renderNestItem(item)
          ) : item.items && item.items?.length > 0 ? (
            <ListboxSection
              key={item.key}
              classNames={sectionClasses}
              showDivider={isCompact}
              title={item.title}
              aria-label="section"
            >
              {item.items.map(renderItem)}
            </ListboxSection>
          ) : (
            renderItem(item)
          )
        }
      </Listbox>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
