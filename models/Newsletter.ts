import mongoose from 'mongoose';
import { Newsletter as INewsletter } from '@/lib/interface';

const NewsletterSchema = new mongoose.Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const Newsletter =
  mongoose.models.newsletters ||
  mongoose.model('newsletters', NewsletterSchema);

export default Newsletter;
