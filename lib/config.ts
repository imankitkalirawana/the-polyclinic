// export const isCaching = process.env.NODE_ENV === 'production' ? true : false;
export const isCaching = false;
export const API_BASE_URL = process.env.NEXTAUTH_URL;
export const VIDEOMAXSIZE = 10 * 1024 * 1024;
export const PHOTOMAXSIZE = 1 * 1024 * 1024;

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
