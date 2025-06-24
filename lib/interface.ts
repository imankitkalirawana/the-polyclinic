export interface Base {
  _id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

export const ServiceTypes = [
  {
    label: 'Medical',
    value: 'medical',
  },
  {
    label: 'Surgical',
    value: 'surgical',
  },
  {
    label: 'Diagnostic',
    value: 'diagnostic',
  },
  {
    label: 'Consultation',
    value: 'consultation',
  },
];

export const ServiceStatuses = [
  {
    label: 'Available',
    value: 'active',
    color: 'success',
  },
  {
    label: 'Unavailable',
    value: 'inactive',
    color: 'danger',
  },
];

export interface MailOptionsProps {
  from: {
    name: string;
    address: string;
  };
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// event type

export interface EventType {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  duration: [number, string];
  busy: boolean;
}

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
  icon?: string;
}
