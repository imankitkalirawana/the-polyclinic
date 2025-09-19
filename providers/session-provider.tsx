'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Session } from '@/types/session';

const SessionContext = createContext<Session | null | undefined>({ user: null });

interface SessionProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session || { user: null }}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
