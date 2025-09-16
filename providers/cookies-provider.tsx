'use client';

import { createContext, useContext } from 'react';

export interface CookieItem {
  name: string;
  value: string;
}
const CookiesContext = createContext<Record<string, string> | null>(null);

export const CookiesProvider = ({
  children,
  cookieStore,
}: {
  children: React.ReactNode;
  cookieStore: CookieItem[];
}) => {
  // convert the array in object
  const cookieStoreObject = cookieStore.reduce(
    (acc, item) => {
      acc[item.name] = item.value;
      return acc;
    },
    {} as Record<string, string>
  );

  return <CookiesContext.Provider value={cookieStoreObject}>{children}</CookiesContext.Provider>;
};

export const useCookies = () => {
  const context = useContext(CookiesContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookiesProvider');
  }
  return context;
};
