export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  subItems?: SubItems[];
  thumbnail?: string;
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
}
