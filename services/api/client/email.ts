'use server';

import { fetchData } from '..';

import { EmailType } from '@/types/client/email';

export async function getAllEmails() {
  return await fetchData<EmailType[]>('/emails');
}

export async function getEmailWithID(id: string) {
  return await fetchData<EmailType>(`/emails/${id}`);
}
