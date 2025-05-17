import { UserRole } from '@/models/User';
import { DropdownItemProps } from '@heroui/react';

// Primitive types
export type ActionType =
  | 'reschedule'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'reminder'
  | 'addToCalendar'
  | 'bulk-cancel'
  | 'bulk-delete';

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

// Configuration interfaces
export interface ButtonConfig<T> {
  label: string;
  icon: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  isIconOnly?: boolean;
  onPress?: (data: T) => void | Promise<void>;
  content?: React.ReactNode;
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
  buttonMap: (
    data: T,
    setAction: (action: ActionType | null) => void
  ) => Partial<Record<ActionType, ButtonConfig<T>>>;
  detailsSection: (data: T) => CellRenderConfig<T>[];
  infoSection?: (data: T) => React.ReactNode;
  dropdownOptions?: Array<DropdownItemProps>;
  newTabUrl?: (data: T) => string;
}
