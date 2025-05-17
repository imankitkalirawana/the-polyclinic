'use client';
import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ScrollShadow,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import AsyncButton from '@/components/ui/buttons/async-button';
import { Title } from '@/components/ui/typography/modal';
import { CellRendererProps, QuickLookProps } from './types';

const CellRenderer: React.FC<CellRendererProps> = ({
  label,
  value,
  icon,
  classNames,
  className,
  cols = 1,
}) => (
  <div className={`p-4 ${cols === 2 ? 'col-span-2' : ''} ${className || ''}`}>
    <div className="flex items-start gap-2 text-sm">
      <div className={`rounded-small p-[5px] ${classNames?.icon || ''}`}>
        <Icon icon={icon} width="24" />
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={`capitalize text-default-400 ${classNames?.label || ''}`}
        >
          {label}
        </span>
        <span className="capitalize text-default-foreground">
          {typeof value === 'string' ? value : value}
        </span>
      </div>
    </div>
  </div>
);

export default function QuickLook<T>({
  selectedItem,
  isOpen,
  onClose,
  selectedKey,
  buttons,
  permissions,
  dropdown,
  sidebarContent,
  content,
}: QuickLookProps<T>): React.ReactElement {
  const { data: session } = useSession();
  const role = useMemo(
    () => session?.user?.role ?? 'user',
    [session?.user?.role]
  );

  const item = useMemo(() => selectedItem || ({} as T), [selectedItem]);
  const availablePermissions = useMemo(
    () => permissions?.[role as keyof typeof permissions] || [],
    [role, permissions]
  );

  const detailsSection = useMemo(
    () => (
      <div className="col-span-2 grid h-fit grid-cols-2 divide-x divide-y divide-divider border-b border-divider">
        <div className="col-span-full h-fit p-4">
          <Title level={2} title="Details" />
        </div>
        {content.map((cell, index) => (
          <CellRenderer
            key={index}
            label={cell.label}
            value={cell.value(item)}
            icon={cell.icon}
            classNames={cell.classNames}
            className={cell.className}
            cols={cell.cols}
          />
        ))}
      </div>
    ),
    [item, content]
  );

  const infoSection = useMemo(
    () => <div className="divide-y divide-divider">{sidebarContent}</div>,
    [item, sidebarContent]
  );

  const leftButtons = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {!!buttons &&
          buttons
            .filter((btn) => {
              const isLeftPosition = btn.position === 'left';
              const isPermission = availablePermissions.includes(btn.key);
              return isLeftPosition && isPermission;
            })
            .map((btn) => (
              <Tooltip
                key={btn.key}
                delay={500}
                isDisabled={!btn.isIconOnly}
                content={btn.children}
              >
                <AsyncButton
                  key={btn.key}
                  {...(({ key, content, ref, children, ...rest }) => rest)(btn)}
                >
                  {btn.isIconOnly ? null : btn.children}
                </AsyncButton>
              </Tooltip>
            ))}
      </div>
    ),
    [buttons, availablePermissions]
  );

  const rightButtons = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {!!buttons &&
          buttons
            .filter((btn) => {
              const isRightPosition = btn.position === 'right';
              const isPermission = availablePermissions.includes(btn.key);
              return isRightPosition && isPermission;
            })
            .map((btn) => (
              <Tooltip
                key={btn.key}
                delay={500}
                isDisabled={!btn.isIconOnly}
                content={btn.children}
              >
                <AsyncButton
                  key={btn.key}
                  {...(({ key, content, ref, children, ...rest }) => rest)(btn)}
                >
                  {btn.isIconOnly ? null : btn.children}
                </AsyncButton>
              </Tooltip>
            ))}
      </div>
    ),
    [buttons, availablePermissions]
  );

  return (
    <>
      <Modal
        size="5xl"
        isOpen={isOpen}
        backdrop="blur"
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalContent className="h-[80vh] overflow-hidden">
          <ModalBody
            as={ScrollShadow}
            className={cn(
              'grid w-full grid-cols-3 gap-0 divide-x divide-divider p-0 scrollbar-hide',
              !sidebarContent && 'grid-cols-2'
            )}
          >
            {detailsSection}
            {sidebarContent && infoSection}
          </ModalBody>
          <ModalFooter className="justify-between border-t border-divider">
            <div className="flex items-center gap-2">{leftButtons}</div>
            <div className="flex items-center gap-2">
              {rightButtons}
              {!!dropdown && (
                <Dropdown placement="top-end">
                  <DropdownTrigger>
                    <Button size="sm" variant="light" isIconOnly>
                      <Icon
                        icon="solar:menu-dots-bold"
                        width="20"
                        className="rotate-90"
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Quick Look Options"
                    className="max-w-[300px]"
                    items={dropdown}
                  >
                    {(item) => <DropdownItem {...item} />}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {selectedKey && buttons?.find((btn) => btn.key === selectedKey)?.content}
    </>
  );
}
