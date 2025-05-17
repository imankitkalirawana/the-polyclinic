import { UserRole } from '@/models/User';
import { ButtonProps, DropdownItemProps } from '@heroui/react';
import { ReactNode } from 'react';

// Primitive types
export type ActionType =
  | 'reschedule'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'reminder'
  | 'add-to-calendar'
  | 'bulk-cancel'
  | 'bulk-delete'
  | 'new-tab';

export type ButtonVariant = 'solid' | 'flat' | 'bordered' | 'light';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'default';

export interface CellRendererProps {
  label: string;
  value: string | React.ReactNode;
  icon: string;
  classNames?: {
    icon?: string;
    label?: string;
  };
  className?: string;
  cols?: number;
}

export interface QuickLookProps<T> {
  data: T | null;
  config: QuickLookConfig<T>;
  isOpen: boolean;
  onClose: () => void;
  setAction: (action: ActionType | null) => void;
  action: ActionType | null;
}

export interface CellRenderConfig<T> {
  label: string;
  value: (data: T) => string | React.ReactNode;
  icon: string;
  classNames?: {
    icon?: string;
    label?: string;
  };
  className?: string;
  cols?: number;
}

export interface QuickLookConfig<T> {
  permissions: Record<UserRole, ActionType[]>;
  buttons: Array<
    Omit<ButtonProps, 'content' | 'key'> & {
      key: ActionType;
      content?: React.ReactNode;
      position?: 'left' | 'right';
    }
  >;
  detailsSection: (data: T) => CellRenderConfig<T>[];
  infoSection?: (data: T) => React.ReactNode;
  dropdownOptions?: Array<DropdownItemProps>;
  newTabUrl?: (data: T) => string;
}
