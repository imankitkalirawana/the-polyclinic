import mongoose from 'mongoose';

import { Base } from '@/lib/interface';

export interface NewsletterType extends Base {
  email: string;
}

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

const Newsletter =
  mongoose.models.newsletters ||
  mongoose.model('newsletters', NewsletterSchema);

export default Newsletter;
