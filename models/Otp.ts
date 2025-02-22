import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  id: String,
  otp: {
    type: Number
  },
  otpCount: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600
  }
});

const Otp = mongoose.models.otps || mongoose.model('otps', otpSchema);
export default Otp;
