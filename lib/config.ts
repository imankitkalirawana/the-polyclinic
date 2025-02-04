// export const isCaching = process.env.NODE_ENV === 'production' ? true : false;
export const isCaching = false;
export const API_BASE_URL = process.env.NEXTAUTH_URL;

export const rowOptions = [
  {
    label: '20',
    value: 20
  },
  {
    label: '50',
    value: 50
  },
  {
    label: '100',
    value: 100
  },
  {
    label: '1000',
    value: 1000
  }
];

export const TIMINGS = {
  appointment: {
    start: 9,
    end: 17
  },
  booking: {
    maximum: 30 // in days
  },
  holidays: ['2025-01-17', '2025-01-26', '2024-03-30', '2024-04-15']
};

export const CLINIC_INFO = {
  name: 'The Poly Clinic',
  phone: '+0000000000000000',
  email: 'contact@divinely.dev',
  website: 'www.polyclinic.com',
  logo: '/logo.png',
  social: {
    facebook: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    twitter: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    instagram: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    linkedin: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    youtube: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  location: {
    coordinates: {
      lat: 0,
      lng: 0
    },
    address: '123 Main St, Anytown, USA',
    city: 'Anytown',
    state: 'US',
    country: 'USA',
    zip: '12345'
  }
};

export const APPOINTMENT = {
  fees: 500,
  duration: 30,
  cancellation: {
    allowed: true,
    time: 24
  },
  reschedule: {
    allowed: true,
    time: 24
  },
  payment: {
    allowed: true,
    time: 24
  },
  reminder: {
    allowed: true,
    time: 24
  },
  paymentMethods: [
    {
      label: 'Credit Card',
      value: 'credit-card'
    },
    {
      label: 'Debit Card',
      value: 'debit-card'
    },
    {
      label: 'Net Banking',
      value: 'net-banking'
    },
    {
      label: 'UPI',
      value: 'upi'
    },
    {
      label: 'Wallet',
      value: 'wallet'
    }
  ]
};

export const WEBSITE_SETTING = {
  status: {
    maintainance: false,
    registration: false,
    login: true
  },
  appearance: {
    theme: 'light',
    logo: '/images/logo.png'
  }
};
