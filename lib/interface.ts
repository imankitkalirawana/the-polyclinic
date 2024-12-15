export interface Base {
  _id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ServiceTypes = [
  {
    label: 'Medical',
    value: 'medical'
  },
  {
    label: 'Surgical',
    value: 'surgical'
  },
  {
    label: 'Diagnostic',
    value: 'diagnostic'
  },
  {
    label: 'Consultation',
    value: 'consultation'
  }
];

export const ServiceStatuses = [
  {
    label: 'Available',
    value: 'active',
    color: 'success'
  },
  {
    label: 'Unavailable',
    value: 'inactive',
    color: 'danger'
  }
];

export interface CountryProps {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  iso2: string;
  type: string;
  latitude: string;
  longitude: string;
}

export interface CityProps {
  id: number;
  name: string;
}

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
