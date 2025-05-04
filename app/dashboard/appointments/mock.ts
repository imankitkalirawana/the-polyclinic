'use server';

import { Gender } from '@/lib/interface';
import {
  AppointmentMode,
  AppointmentStatus,
  AppointmentType,
  AType,
} from '@/models/Appointment';
import { faker } from '@faker-js/faker';

export async function generateAppointments(count: number) {
  const generated: AppointmentType[] = [];

  for (let i = 0; i < count; i++) {
    const includeDoctor = faker.datatype.boolean(); // randomly true or false

    const appointment: AppointmentType = {
      aid: faker.number.int({ min: 1000, max: 9999 }),
      date: faker.date.recent().toISOString(),
      patient: {
        uid: faker.number.int({ min: 1000, max: 9999 }),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        age: faker.number.int({ min: 18, max: 80 }),
      },
      ...(includeDoctor && {
        doctor: {
          uid: faker.number.int({ min: 1000, max: 9999 }),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          sitting: String(faker.number.int({ min: 100, max: 300 })),
        },
      }),
      status: faker.helpers.arrayElement([
        AppointmentStatus.booked,
        AppointmentStatus.confirmed,
        AppointmentStatus['in-progress'],
        AppointmentStatus.completed,
        AppointmentStatus.cancelled,
        AppointmentStatus.overdue,
        AppointmentStatus['on-hold'],
      ]),
      additionalInfo: {
        notes: faker.lorem.paragraph(),
        symptoms: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(Object.values(AppointmentMode)),
        description: faker.lorem.paragraph(),
        instructions: faker.lorem.lines(3),
      },
      type: faker.helpers.arrayElement(Object.values(AType)),
      progress: faker.number.int({ min: 0, max: 100 }),
      data: Object.fromEntries(
        Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => [
          faker.lorem.slug(),
          faker.lorem.words(),
        ])
      ),
      createdAt: faker.date.recent(),
      _id: faker.string.uuid(),
      createdBy: faker.string.uuid(),
      updatedBy: faker.string.uuid(),
      updatedAt: faker.date.recent(),
    };

    generated.push(appointment);
  }

  return generated;
}
