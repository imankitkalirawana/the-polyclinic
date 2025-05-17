import { UserRole } from '@/models/User';

// Define generic types for the component
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

// Configuration for a button action
export interface ButtonConfig<T> {
  label: string;
  icon: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  isIconOnly?: boolean;
  action: (data: T) => void | Promise<void>;
  content?: React.ReactNode;
}

// Configuration for rendering a detail cell
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
  infoSection: (data: T) => React.ReactNode;
  downloadOptions?: {
    label: string;
    key: string;
    icon: string;
    action: (data: T) => void;
  }[];
  newTabUrl?: (data: T) => string;
}

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
