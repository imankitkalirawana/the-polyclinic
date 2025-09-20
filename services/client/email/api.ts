'use server';

import { apiRequest } from '@/lib/axios';

import { EmailType } from '@/services/client/email/types';

export async function getAllEmails() {
  return await apiRequest<EmailType[]>({
    url: '/emails',
  });
}

export async function getEmailWithID(id: string) {
  return await apiRequest<EmailType>({
    url: `/emails/${id}`,
  });
}
