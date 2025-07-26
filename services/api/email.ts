'use server';
import { EmailType } from '@/types/email';

import { fetchData } from '.';

export async function getAllEmails() {
  return await fetchData<EmailType[]>('/emails');
}

export async function getEmailWithID(id: string) {
  return await fetchData<EmailType>(`/emails/${id}`);
}
