'use server';

import { fetchData } from '../../fetch';

import { NewsletterType } from '@/types/client/newsletter';

export async function getAllNewsletters() {
  return await fetchData<NewsletterType[]>('/newsletters');
}
