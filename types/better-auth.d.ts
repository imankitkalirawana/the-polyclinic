import { NextRequest } from 'next/server';

export interface BetterAuthRequest extends NextRequest {
  auth?: {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      uid: number;
      image?: string;
    };
  };
}
