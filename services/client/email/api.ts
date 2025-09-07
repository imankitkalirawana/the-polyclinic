'use server';

import { fetchData } from '../../fetch';

import { EmailType } from '@/services/client/email/types';

export async function getAllEmails() {
  return await fetchData<EmailType[]>('/emails');
}

export async function getEmailWithID(id: string) {
  return await fetchData<EmailType>(`/emails/${id}`);
}
