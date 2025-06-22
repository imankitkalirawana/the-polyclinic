'use server';

import { Gender } from '@/lib/interface';
import {
  AppointmentMode,
  AppointmentStatus,
  AppointmentType,
  AType,
} from '@/types/appointment';
import { faker } from '@faker-js/faker';
import { addDays, subDays } from 'date-fns';
import { TIMINGS } from '../config';

export async function generateAppointments({
  count,
  status,
}: {
  count: number;
  status?: AppointmentStatus;
}) {
  const generated: AppointmentType[] = [];

  for (let i = 0; i < count; i++) {
    const includeDoctor = faker.datatype.boolean(); // randomly true or false
    const sex = faker.person.sexType();

    const appointment: AppointmentType = {
      aid: faker.number.int({ min: 1000, max: 9999 }),
      date: (() => {
        const date = faker.date.between({
          from: subDays(new Date(), 365),
          to: addDays(new Date(), 365),
        });
        date.setHours(
          faker.number.int({
            min: TIMINGS.appointment.start,
            max: TIMINGS.appointment.end,
          })
        );
        date.setMinutes(faker.helpers.arrayElement([0, 15, 30, 45]));
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
      })(),
      patient: {
        uid: faker.number.int({ min: 1000, max: 9999 }),
        name: faker.person.fullName({ sex }),
        phone: faker.phone.number({ style: 'national' }),
        email: faker.internet.email(),
        gender: sex as Gender,
        age: faker.number.int({ min: 18, max: 80 }),
        image: faker.image.personPortrait({ size: 256, sex }),
      },
      ...(includeDoctor && {
        doctor: {
          uid: faker.number.int({ min: 1000, max: 9999 }),
          name: faker.person.fullName({ sex: 'male' }),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: 'national' }),
          sitting: String(faker.number.int({ min: 100, max: 300 })),
          image: faker.image.personPortrait({ size: 256, sex: 'male' }),
        },
      }),
      status: status
        ? status
        : faker.helpers.arrayElement([
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
