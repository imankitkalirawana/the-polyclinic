import { NextRequest } from 'next/server';

declare module 'better-auth' {
  interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
    uid: number;
    role: string;
    banned: boolean | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
  }
}

export interface BetterAuthRequest extends NextRequest {
  auth?: {
    user?: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      image?: string | null | undefined | undefined;
      uid: number;
      role: string;
      banned: boolean | null | undefined;
      banReason?: string | null | undefined;
      banExpires?: Date | null | undefined;
    };
  };
}
