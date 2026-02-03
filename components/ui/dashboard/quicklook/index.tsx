'use client';

import React, { useCallback, useMemo } from 'react';
import { useSession } from '@/libs/providers/session-provider';
import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  // eslint-disable-next-line no-restricted-imports
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ScrollShadow,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { QuickLookProps } from './types';

import AsyncButton from '@/components/ui/buttons/async-button';
import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';
import { Title } from '@/components/ui/typography/modal';
import { $FixMe } from '@/types';

export default function QuickLook<T, A extends string = string, D extends string = string>({
  selectedItem,
  isOpen,
  onClose,
  selectedKey,
  buttons,
  permissions,
  dropdown,
  sidebarContent,
  content,
}: QuickLookProps<T, A, D>): React.ReactElement<$FixMe> {
  const session = useSession();
  const role = useMemo(() => session?.user?.role ?? 'user', [session?.user?.role]);

  const item = useMemo(() => selectedItem || ({} as T), [selectedItem]);
  const availablePermissions = useMemo(() => {
    const rolePermissions = permissions?.[role as keyof typeof permissions];
    if (rolePermissions === 'all') return 'all';
    if (rolePermissions === 'none') return [];
    return rolePermissions || [];
  }, [role, permissions]);

  const filteredButtons = useCallback(
    (position: 'left' | 'right') =>
      !buttons
        ? []
        : buttons.filter((btn) => {
            const isLeftPosition = btn.position === position;
            const isPermission =
              availablePermissions === 'all' || availablePermissions.includes(btn.key as A);
            return isLeftPosition && isPermission && !btn.isHidden;
          }),
    [buttons, availablePermissions]
  );

  const filteredDropdown = useMemo(
    () =>
      dropdown?.filter((item) => {
        const isPermission =
          availablePermissions === 'all' || availablePermissions.includes(item.key as unknown as A);
        return isPermission && !item.isHidden;
      }),
    [dropdown, availablePermissions]
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
        {!!filteredButtons('left') &&
          filteredButtons('left').map((btn) => (
            <Tooltip
              key={btn.key}
              delay={1000}
              isDisabled={!btn.isIconOnly}
              content={btn.children}
              color={btn.color}
            >
              <AsyncButton
                key={btn.key}
                {...(({ key, content, ref, onPress, children, ...rest }) => rest)(btn)}
                onPress={async () => {
                  if (btn.onPress) {
                    await btn.onPress({} as $FixMe);
                  }
                }}
              >
                {btn.isIconOnly ? null : btn.children}
              </AsyncButton>
            </Tooltip>
          ))}
      </div>
    ),
    [filteredButtons]
  );

  const rightButtons = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {!!filteredButtons('right') &&
          filteredButtons('right').map((btn) => (
            <Tooltip
              key={btn.key}
              delay={500}
              isDisabled={!btn.isIconOnly}
              content={btn.children}
              color={btn.color}
            >
              <AsyncButton
                key={btn.key}
                {...(({ key, content, ref, onPress, children, whileLoading, ...rest }) => rest)(
                  btn
                )}
                whileSubmitting={btn.whileLoading}
                onPress={async () => {
                  if (btn.onPress) {
                    await btn.onPress({} as $FixMe);
                  }
                }}
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
      <Modal size="5xl" isOpen={isOpen} backdrop="blur" scrollBehavior="inside" onClose={onClose}>
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
              {!!filteredDropdown && filteredDropdown.length > 0 && (
                <Dropdown placement="top-end">
                  <DropdownTrigger>
                    <Button size="sm" variant="light" isIconOnly>
                      <Icon icon="solar:menu-dots-bold" width="20" className="rotate-90" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Quick Look Options"
                    className="max-w-[300px]"
                    items={filteredDropdown}
                  >
                    {(item) => (
                      <DropdownItem
                        key={item.key as D}
                        {...(({ content, ...rest }) => rest)(item)}
                      />
                    )}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {selectedKey &&
        (buttons?.find((btn) => btn.key === selectedKey)?.content ||
          dropdown?.find((item) => item.key === (selectedKey as unknown as D))?.content ||
          null)}
    </>
  );
}
