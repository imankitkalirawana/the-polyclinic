import { PipelineStage, Connection } from 'mongoose';
import { getAppointmentModel } from './model';

type AppointmentAggregationOptions = {
  conn: Connection;
  query?: Record<string, unknown> | PipelineStage;
  projectExtra?: Record<string, unknown>;
  isStage?: boolean;
};

export const getAppointmentsWithDetails = async ({
  conn,
  query = {},
  projectExtra = {},
  isStage = false,
}: AppointmentAggregationOptions) => {
  const Appointment = getAppointmentModel(conn);
  const pipeline: PipelineStage[] = [];

  if (isStage) {
    pipeline.push(query as PipelineStage);
  } else {
    pipeline.push({ $match: query });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'user',
        localField: 'doctorId',
        foreignField: 'uid',
        as: 'doctor',
      },
    },
    {
      $lookup: {
        from: 'user',
        localField: 'patientId',
        foreignField: 'uid',
        as: 'patient',
      },
    },
    {
      $lookup: {
        from: 'doctor',
        localField: 'doctorId',
        foreignField: 'uid',
        as: 'moreDoctorDetails',
      },
    },
    { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$patient', preserveNullAndEmptyArrays: false } },
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
          name: '$doctor.name',
          email: '$doctor.email',
          uid: '$doctor.uid',
          phone: '$doctor.phone',
          image: '$doctor.image',
          seating: '$moreDoctorDetails.seating',
        },
        patient: {
          name: '$patient.name',
          email: '$patient.email',
          uid: '$patient.uid',
          phone: '$patient.phone',
          image: '$patient.image',
          gender: '$patient.gender',
          age: '$patient.age',
        },
        ...projectExtra,
      },
    }
  );

  return Appointment.aggregate(pipeline);
};
