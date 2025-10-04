import { UnifiedUser } from '@/services/common/user';

export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  subItems?: SubItems[];
  thumbnail?: string;
  roles?: readonly UnifiedUser['role'][];
}

export interface SubItems {
  title?: string;
  items: SubItem[];
}

export interface SubItem {
  name: string;
  href: string;
  description?: string;
  icon?: string;
  roles?: readonly UnifiedUser['role'][];
}
