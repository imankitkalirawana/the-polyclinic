import mongoose from 'mongoose';

import { Base } from '@/lib/interface';
export enum EmailStatus {
  active = 'active',
  inactive = 'inactive',
}

export interface EmailType extends Base {
  from: string;
  to: string;
  subject: string;
  message: string;
  status: EmailStatus;
  image?: string;
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
    image: String,
    status: {
      type: String,
      enum: EmailStatus,
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.models.emails || mongoose.model('emails', EmailSchema);

export default Email;
