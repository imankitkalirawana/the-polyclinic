'use client';

import { createContext, useContext, useState, useCallback } from 'react';

export interface CookieItem {
  name: string;
  value: string;
}

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface CookiesContextType {
  cookies: Record<string, string>;
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  getCookie: (name: string) => string | undefined;
  removeCookie: (name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) => void;
}

const CookiesContext = createContext<CookiesContextType | null>(null);

export const CookiesProvider = ({
  children,
  cookieStore,
}: {
  children: React.ReactNode;
  cookieStore: CookieItem[];
}) => {
  // convert the array in object
  const initialCookies = cookieStore.reduce(
    (acc, item) => {
      acc[item.name] = item.value;
      return acc;
    },
    {} as Record<string, string>
  );

  const [cookies, setCookies] = useState<Record<string, string>>(initialCookies);

  const setCookie = useCallback((name: string, value: string, options: CookieOptions = {}) => {
    // Update state
    setCookies((prev) => ({ ...prev, [name]: value }));

    // Set cookie in browser
    let cookieString = `${name}=${value}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge !== undefined) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    // Default to root path if not specified
    const path = options.path || '/';
    cookieString += `; path=${path}`;

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.httpOnly) {
      cookieString += `; httpOnly`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }, []);

  const getCookie = useCallback(
    (name: string): string | undefined => {
      return cookies[name];
    },
    [cookies]
  );

  const removeCookie = useCallback(
    (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}) => {
      // Update state
      setCookies((prev) => {
        const newCookies = { ...prev };
        delete newCookies[name];
        return newCookies;
      });

      // Remove cookie from browser by setting it to expire in the past
      let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      if (options.path) {
        cookieString += `; path=${options.path}`;
      }

      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }

      document.cookie = cookieString;
    },
    []
  );

  const contextValue: CookiesContextType = {
    cookies,
    setCookie,
    getCookie,
    removeCookie,
  };

  return <CookiesContext.Provider value={contextValue}>{children}</CookiesContext.Provider>;
};

export const useCookies = () => {
  const context = useContext(CookiesContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookiesProvider');
  }
  return context;
};
