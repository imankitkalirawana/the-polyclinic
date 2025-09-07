'use server';

import { fetchData } from '../../fetch';

import { NewsletterType } from '@/services/client/newsletters/types';

export async function getAllNewsletters() {
  return await fetchData<NewsletterType[]>('/newsletters');
}
