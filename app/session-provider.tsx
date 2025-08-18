'use client';

import React, { createContext, useContext } from 'react';
import { Session, User } from 'better-auth';

type SessionContextType = {
  session?: Session;
  user?: User & {
    role?: string;
  };
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
  session,
  user,
}: {
  children: React.ReactNode;
  session?: Session;
  user?: User & {
    role?: string;
  };
}) => {
  return <SessionContext.Provider value={{ session, user }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
