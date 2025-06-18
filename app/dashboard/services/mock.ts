'use server';

import { ServiceStatus, ServiceType, ServiceTypes } from '@/types/service';
import { faker } from '@faker-js/faker';

export async function generateServices(count: number) {
  const services: ServiceType[] = [];

  for (let i = 0; i < count; i++) {
    const service: ServiceType = {
      _id: faker.string.uuid(),
      uniqueId: faker.number.int({ min: 1000, max: 9999 }).toString(),
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      summary: faker.lorem.sentence(),
      price: faker.number.int({ min: 100, max: 9999 }),
      duration: faker.number.int({ min: 1, max: 72 }),
      status: faker.helpers.arrayElement([
        ServiceStatus.active,
        ServiceStatus.inactive,
      ]),
      type: faker.helpers.arrayElement([
        ServiceTypes.medical,
        ServiceTypes.surgical,
        ServiceTypes.diagnostic,
        ServiceTypes.consultation,
      ]),
      data: {},
      createdBy: faker.string.uuid(),
      updatedBy: faker.string.uuid(),
      createdAt: faker.date.past({
        refDate: new Date('2025-01-01'),
      }),
      updatedAt: faker.date.past({
        refDate: new Date('2025-01-01'),
      }),
    };

    services.push(service);
  }

  return services;
}
