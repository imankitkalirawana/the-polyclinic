import { UserRole } from '@/models/User';
import {
  ButtonProps as HeroButtonProps,
  DropdownItemProps,
} from '@heroui/react';

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

export type ButtonProps = Omit<HeroButtonProps, 'content' | 'key'> & {
  key: ActionType;
  content?: React.ReactNode;
  position?: 'left' | 'right';
};

export type PermissionProps = Partial<Record<UserRole, ActionType[]>>;

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
  /**
   * The currently selected item to display in the quick look modal.
   * This item's data will be used to populate the content cells and sidebar.
   * Can be null when no item is selected.
   */
  selectedItem: T | null;
  /**
   * Controls the visibility of the quick look modal.
   * When true, the modal is displayed. When false, the modal is hidden.
   */
  isOpen: boolean;
  /**
   * Callback function invoked when the modal needs to be closed.
   * This can be triggered by clicking the close button, backdrop, or escape key.
   */
  onClose: () => void;
  /**
   * The currently selected action key from the available actions (reschedule, cancel, etc).
   * Used to determine which action's content to display when a button is clicked.
   * Optional and can be null when no action is selected.
   */
  selectedKey?: ActionType | null;
  /**
   * Array of button configurations to render in the modal footer.
   * Each button can be positioned on the left or right side.
   * Buttons are filtered based on user permissions before being displayed.
   */
  buttons?: Array<ButtonProps>;
  /**
   * Permission configuration mapping user roles to allowed actions.
   * Used to conditionally render buttons based on the current user's role.
   * If not provided, all buttons will be shown regardless of user role.
   */
  permissions?: PermissionProps;
  /**
   * Array of dropdown menu items to be displayed in the overflow menu.
   * Appears as a three-dot menu in the top-right corner of the modal.
   * Each item can have its own click handler and custom rendering.
   */
  dropdown?: Array<DropdownItemProps>;
  /**
   * Optional content to render in the right sidebar of the modal.
   * When provided, the modal uses a 2/3 + 1/3 layout split.
   * When not provided, the modal uses a full-width layout.
   */
  sidebarContent?: React.ReactNode;
  /**
   * Array of cell configurations that define the main content area.
   * Each cell specifies how to render a piece of data from the selected item.
   * Cells are rendered in a grid layout and can span multiple columns.
   */
  content: CellRenderConfig<T>[];
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
