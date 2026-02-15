export interface Base {
  _id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
