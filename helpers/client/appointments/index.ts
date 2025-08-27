import Appointment from '@/models/client/Appointment';
import { PipelineStage } from 'mongoose';

type AppointmentAggregationOptions = {
  query?: Record<string, unknown> | PipelineStage;
  projectExtra?: Record<string, unknown>;
  isStage?: boolean;
};

export const getAppointmentsWithDetails = async ({
  query = {},
  projectExtra = {},
  isStage = false,
}: AppointmentAggregationOptions) => {
  const pipeline: PipelineStage[] = [];

  if (isStage) {
    pipeline.push(query as PipelineStage);
  } else {
    pipeline.push({ $match: query });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'doctor',
        foreignField: 'uid',
        as: 'doctorDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'patient',
        foreignField: 'uid',
        as: 'patientDetails',
      },
    },
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctor',
        foreignField: 'uid',
        as: 'moreDoctorDetails',
      },
    },
    { $unwind: { path: '$doctorDetails', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$patientDetails', preserveNullAndEmptyArrays: false } },
    { $unwind: { path: '$moreDoctorDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        date: 1,
        type: 1,
        status: 1,
        additionalInfo: 1,
        aid: 1,
        createdAt: 1,
        updatedAt: 1,
        updatedBy: 1,
        doctor: {
          name: '$doctorDetails.name',
          email: '$doctorDetails.email',
          uid: '$doctorDetails.uid',
          phone: '$doctorDetails.phone',
          image: '$doctorDetails.image',
          seating: '$moreDoctorDetails.seating',
        },
        patient: {
          name: '$patientDetails.name',
          email: '$patientDetails.email',
          uid: '$patientDetails.uid',
          phone: '$patientDetails.phone',
          image: '$patientDetails.image',
          gender: '$patientDetails.gender',
          age: '$patientDetails.age',
        },
        ...projectExtra,
      },
    }
  );

  return Appointment.aggregate(pipeline);
};
