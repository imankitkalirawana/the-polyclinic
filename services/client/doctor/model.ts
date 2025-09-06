import mongoose, { Connection } from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, 'User ID is required'],
      unique: [true, 'User ID must be unique'],
    },
    designation: String,
    department: String,
    experience: String,
    education: String,
    biography: String,
    shortbio: String,
    seating: String,
  },
  {
    collection: 'doctor',
  }
);

export const getDoctorModel = (conn: Connection) => {
  return conn.models.doctor || conn.model('doctor', doctorSchema);
};
