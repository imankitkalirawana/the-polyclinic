'use server';

import { faker } from '@faker-js/faker';

import { $FixMe } from '@/types';

export async function generateUsers({
  count,
  role,
}: {
  count: number;
  role?: $FixMe['role'];
}): Promise<$FixMe[]> {
  const generated: $FixMe[] = [];

  for (let i = 0; i < count; i++) {
    const user: $FixMe = {
      uid: faker.number.int({ min: 1000, max: 9999 }),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      role:
        role ||
        faker.helpers.arrayElement([
          'user',
          'admin',
          'receptionist',
          'nurse',
          'doctor',
          'pharmacist',
          'laboratorist',
        ]),
      status: faker.helpers.arrayElement(['active', 'inactive', 'blocked']),
      country: faker.location.country(),
      state: faker.location.state(),
      city: faker.location.city(),
      address: faker.location.streetAddress(),
      zipcode: faker.location.zipCode(),
      passwordResetToken: faker.string.uuid(),
      dob: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString(),
      gender: faker.person.sexType(),
      image: faker.image.avatar(),
      createdAt: faker.date.recent(),
      _id: faker.string.uuid(),
      createdBy: faker.string.uuid(),
      updatedBy: faker.string.uuid(),
      updatedAt: faker.date.recent(),
      date: faker.date.recent().toISOString(),
    };

    generated.push(user);
  }

  return generated;
}
