'use server';
import { fetchData } from '.';
import { EmailType } from '@/types/email';

export async function getAllEmails() {
  return await fetchData<EmailType[]>('/emails');
}
