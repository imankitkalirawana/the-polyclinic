import mongoose from 'mongoose';

import { Base } from '@/lib/interface';

export interface EmailType extends Base {
  from: string;
  to: string;
  subject: string;
  message: string;
  status: string;
}

const EmailSchema = new mongoose.Schema<EmailType>(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.models.emails || mongoose.model('emails', EmailSchema);

export default Email;
