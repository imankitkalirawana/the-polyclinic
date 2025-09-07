import mongoose, { Connection } from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
        'Email is invalid',
      ],
      unique: true,
    },
    otp: String,
    type: {
      type: String,
      enum: ['register', 'reset-password', 'verify-email'],
      default: 'register',
    },
    count: {
      type: Number,
      default: 1,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      expires: 600,
    },
  },
  { timestamps: true, collection: 'verification' }
);

export const getVerificationModel = (conn: Connection) => {
  return conn.models.Verification || conn.model('verification', verificationSchema);
};
