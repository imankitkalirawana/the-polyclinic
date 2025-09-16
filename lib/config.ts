// export const isCaching = process.env.NODE_ENV === 'production' ? true : false;
export const isCaching = false;
export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
export const DEFAULT_AVATAR = 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_2.png';

export const APP_INFO = {
  name: 'The Polyclinic',
  email: 'admin@divinely.dev',
  url: process.env.NEXTAUTH_URL || '',
  description: `The Polyclinic is a platform for booking appointments with doctors.`,
};

export const rowOptions = [
  {
    label: '10',
    value: 10,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
];

export const TIMINGS = {
  appointment: {
    start: 9,
    end: 17,
    interval: 30,
  },
  booking: {
    maximum: 30,
  },
  holidays: ['weekend', '2025-01-17', '2025-01-26', '2024-03-30', '2024-04-15'],
};

export const CLINIC_INFO = {
  name: 'The Polyclinic',
  phone: '+0000000000000000',
  email: 'contact@divinely.dev',
  website: 'www.polyclinic.com',
  url: 'https://polyclinic.devocode.in/',
  logo: '/logo.png',
  social: {
    facebook: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    twitter: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    instagram: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    linkedin: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    youtube: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  location: {
    coordinates: {
      lat: 0,
      lng: 0,
    },
    address: '123 Main St, Anytown, USA',
    city: 'Anytown',
    state: 'US',
    country: 'USA',
    zip: '12345',
  },
  preferences: {
    currency: {
      symbol: '₹',
      code: 'INR',
    },
    language: 'en',
    timezone: 'Asia/Kolkata',
  },
};

export const APPOINTMENT = {
  isGoogleCalendar: false,
  fees: 500,
  cancellation: {
    allowed: true,
    time: 24,
  },
  reschedule: {
    allowed: true,
    time: 24,
  },
  payment: {
    allowed: true,
    time: 24,
  },
  reminder: {
    allowed: true,
    time: 24,
  },
  paymentMethods: [
    {
      label: 'Credit Card',
      value: 'credit-card',
    },
    {
      label: 'Debit Card',
      value: 'debit-card',
    },
    {
      label: 'Net Banking',
      value: 'net-banking',
    },
    {
      label: 'UPI',
      value: 'upi',
    },
    {
      label: 'Wallet',
      value: 'wallet',
    },
  ],
};

export const WEBSITE_SETTING = {
  status: {
    maintainance: false,
    registration: process.env.NODE_ENV !== 'production',
    login: true,
    email: false,
  },
  appearance: {
    theme: 'light',
    logo: '/images/logo.png',
  },
};

export const MOCK_DATA = {
  users: {
    isMock: false,
    count: 100,
  },
  services: {
    isMock: false,
    count: 100,
  },
  appointments: {
    isMock: false,
    count: 100,
  },
};

export const API_ACTIONS = {
  isDelete: false,
  isUpdate: true,
  isCreate: true,
  isRead: true,
  isAi: false,
};
