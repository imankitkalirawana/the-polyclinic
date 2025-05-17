'use client';
import {
  Button,
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
import React, { useMemo, useCallback } from 'react';
import AsyncButton from '@/components/ui/buttons/async-button';
import { Title } from '@/components/ui/typography/modal';
import { ActionType, CellRendererProps, QuickLookConfig } from './types';

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

// Generic QuickLook component
interface QuickLookProps<T> {
  data: T | null;
  config: QuickLookConfig<T>;
  isOpen: boolean;
  onClose: () => void;
  setAction: (action: ActionType | null) => void;
  action: ActionType | null;
}

export default function QuickLook<T>({
  data,
  config,
  isOpen,
  onClose,
  setAction,
  action,
}: QuickLookProps<T>): React.ReactElement {
  const { data: session } = useSession();
  const role = useMemo(
    () => session?.user?.role ?? 'admin',
    [session?.user?.role]
  );

  const item = useMemo(() => data || ({} as T), [data]);
  const buttonMap = useMemo(
    () => config.buttonMap(item, setAction),
    [item, config, setAction]
  );
  const availablePermissions = useMemo(
    () => config.permissions[role as keyof typeof config.permissions] || [],
    [role, config.permissions]
  );

  const handleAction = useCallback(
    (actionType: ActionType) => {
      buttonMap[actionType]?.action(item);
    },
    [buttonMap, item]
  );

  const detailsSection = useMemo(
    () => (
      <div className="col-span-2 grid h-fit grid-cols-2 divide-x divide-y divide-divider border-b border-divider">
        <div className="col-span-full h-fit p-4">
          <Title level={2} title="Details" />
        </div>
        {config.detailsSection(item).map((cell, index) => (
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
    [item, config]
  );

  const infoSection = useMemo(
    () => (
      <div className="divide-y divide-divider">{config.infoSection(item)}</div>
    ),
    [item, config]
  );

  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {availablePermissions
          .filter((btn) => !['delete', 'edit'].includes(btn))
          .map((btn) => (
            <Tooltip
              key={btn}
              delay={500}
              isDisabled={!buttonMap[btn]?.isIconOnly}
              content={buttonMap[btn]?.label}
              color={buttonMap[btn]?.color}
            >
              <AsyncButton
                variant={buttonMap[btn]?.variant || 'flat'}
                startContent={
                  <Icon icon={buttonMap[btn]?.icon || ''} width="20" />
                }
                onPress={() => handleAction(btn)}
                color={buttonMap[btn]?.color || 'default'}
                isIconOnly={buttonMap[btn]?.isIconOnly}
                fn={async () => buttonMap[btn]?.action(item)}
              >
                {buttonMap[btn]?.isIconOnly ? null : buttonMap[btn]?.label}
              </AsyncButton>
            </Tooltip>
          ))}
      </div>
    ),
    [availablePermissions, buttonMap, handleAction, item]
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
            className="grid w-full grid-cols-3 gap-0 divide-x divide-divider p-0 scrollbar-hide"
          >
            {detailsSection}
            {infoSection}
          </ModalBody>
          <ModalFooter className="justify-between border-t border-divider">
            <div className="flex items-center gap-2">
              {config.newTabUrl && (
                <Tooltip delay={500} content="Open in new tab">
                  <Button
                    variant="flat"
                    startContent={
                      <Icon
                        icon="solar:arrow-right-up-line-duotone"
                        width="20"
                      />
                    }
                    onPress={() => {
                      window.open(config.newTabUrl?.(item), '_blank');
                    }}
                    isIconOnly
                  />
                </Tooltip>
              )}
            </div>
            <div className="flex items-center gap-2">
              {actionButtons}
              {config.downloadOptions && (
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
                    aria-label="Download options"
                    className="max-w-[300px]"
                  >
                    {() => (
                      <>
                        {config.downloadOptions?.map((option) => (
                          <DropdownItem
                            key={option.key}
                            startContent={
                              <Icon icon={option.icon} width="20" />
                            }
                            onPress={() => option.action(item as any)}
                          >
                            {option.label}
                          </DropdownItem>
                        ))}

                        {availablePermissions
                          .filter(
                            (btn) =>
                              !['cancel', 'reschedule', 'reminder'].includes(
                                btn
                              )
                          )
                          .reverse()
                          .map((btn) => (
                            <DropdownItem
                              key={btn}
                              startContent={
                                <Icon
                                  icon={buttonMap[btn]?.icon || ''}
                                  width="20"
                                />
                              }
                              color={buttonMap[btn]?.color}
                              onPress={() => handleAction(btn)}
                            >
                              {buttonMap[btn]?.label}
                            </DropdownItem>
                          ))}
                      </>
                    )}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {action && buttonMap[action]?.content}
    </>
  );
}

// Example configuration for AppointmentType

// export default React.memo(QuickLook);
