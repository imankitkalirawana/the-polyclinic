'use server';

import { fetchData } from '.';

import { NewsletterType } from '@/types/newsletter';

export async function getAllNewsletters() {
  return await fetchData<NewsletterType[]>('/newsletters');
}
