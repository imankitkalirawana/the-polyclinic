import { NewsletterType } from '@/types/newsletter';
import mongoose from 'mongoose';

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
