'use server';

import { apiRequest } from '@/libs/axios';

import { NewsletterType } from '@/services/client/newsletters/newsletter.types';

export async function getAllNewsletters() {
  return await apiRequest<NewsletterType[]>({
    url: '/newsletters',
  });
}
