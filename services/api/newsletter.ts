'use server';
import { NewsletterType } from '@/types/newsletter';

import { fetchData } from '.';

export async function getAllNewsletters() {
  return await fetchData<NewsletterType[]>('/newsletters');
}
