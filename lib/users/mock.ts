'use server';

import { Gender } from '@/lib/interface';
import { UserRole, UserType, UserStatus } from '@/types/user';
import { faker } from '@faker-js/faker';

export async function generateUsers({
  count,
  role,
}: {
  count: number;
  role?: UserRole;
}): Promise<UserType[]> {
  const generated: UserType[] = [];

  for (let i = 0; i < count; i++) {
    const user: UserType = {
      uid: faker.number.int({ min: 1000, max: 9999 }),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      role: role
        ? role
        : faker.helpers.arrayElement([
            UserRole.user,
            UserRole.admin,
            UserRole.receptionist,
            UserRole.nurse,
            UserRole.doctor,
            UserRole.pharmacist,
            UserRole.laboratorist,
          ]),
      status: faker.helpers.arrayElement([
        UserStatus.active,
        UserStatus.inactive,
        UserStatus.blocked,
        UserStatus.deleted,
        UserStatus.unverified,
      ]),
      country: faker.location.country(),
      state: faker.location.state(),
      city: faker.location.city(),
      address: faker.location.streetAddress(),
      zipcode: faker.location.zipCode(),
      passwordResetToken: faker.string.uuid(),
      dob: faker.date
        .birthdate({ min: 18, max: 60, mode: 'age' })
        .toISOString(),
      gender: faker.helpers.arrayElement([Gender.male, Gender.female]),
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
