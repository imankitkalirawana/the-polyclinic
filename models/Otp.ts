import mongoose, { Connection } from 'mongoose';

const otpSchema = new mongoose.Schema({
  id: String,
  otpCount: {
    type: Number,
    default: 1,
    max: 3,
  },
  token: String,
  type: {
    type: String,
    enum: ['register', 'reset-password', 'verify-email'],
    default: 'register',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const Otp = mongoose.models.Otp || mongoose.model('otp', otpSchema);
export default Otp;

export const getOtpModel = (conn: Connection) => {
  return conn.models.Otp || conn.model('otp', otpSchema);
};
