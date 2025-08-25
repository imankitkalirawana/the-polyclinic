import mongoose from 'mongoose';

import { NewsletterType } from '@/types/newsletter';

const NewsletterSchema = new mongoose.Schema<NewsletterType>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.models.newsletters || mongoose.model('newsletters', NewsletterSchema);

export default Newsletter;
