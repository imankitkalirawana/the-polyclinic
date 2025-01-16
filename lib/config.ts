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
