'use server';

import { fetchData } from '..';

import { NewsletterType } from '@/types/client/newsletter';

export async function getAllNewsletters() {
  return await fetchData<NewsletterType[]>('/newsletters');
}
