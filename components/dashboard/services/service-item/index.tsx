'use client';

import React from 'react';
import { Accordion, AccordionItem, Button, Chip, ChipProps, Link, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import DataTable from './data-table';
import { CircleChartCard } from './graph';

import NoResults from '@/components/ui/no-results';
import { convertMinutesToHoursAndMinutes } from '@/libs/utility';
import { useServiceWithUID } from '@/services/client/service/service.query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { format } from 'date-fns';
import { Role } from '@/services/common/user/user.constants';
import { Session } from '@/types/session';

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  inactive: 'danger',
};

const dummyData = {
  title: 'Traffic Sources',
  categories: ['Total', 'Completed'],
  color: 'warning',
  chartData: [
    { name: 'Total', value: 400 },
    { name: 'Completed', value: 100 },
  ],
};

export default function ServiceViewItem({ uid, session }: { uid: string; session: Session }) {
  const { data: service, isError, isLoading } = useServiceWithUID(uid);

  if (isLoading) {
    return <MinimalPlaceholder message="Loading service..." />;
  }

  if (isError) {
    return <div>Service not found</div>;
  }

  if (!service) {
    return <NoResults message="Service not found" />;
  }

  return (
    <div className="relative flex flex-col gap-12 pb-12">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-8">
        <CircleChartCard
          title={dummyData.title}
          categories={dummyData.categories}
          color="primary"
          chartData={dummyData.chartData}
        />

        <div className="flex flex-col">
          <div className="my-2 flex items-center gap-2">
            <p className="italic text-default-400 text-small">#{service.uniqueId}</p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{service.name}</h1>
          <h2 className="sr-only">Service information</h2>

          <div className="text-xl font-medium tracking-tight">
            <p>Price: {service.price}</p>
          </div>

          <div className="mt-6 flex flex-col gap-1">
            {service.duration > 0 && (
              <div className="mb-4 flex items-center gap-2 text-default-700">
                <Icon icon="solar:clock-circle-broken" width={20} />
                <p className="font-medium text-small">
                  Done in approx. {convertMinutesToHoursAndMinutes(service.duration)}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Chip color={statusColorMap[service.status]} variant="flat" className="capitalize">
                {service.status}
              </Chip>
              {service.type && (
                <Chip color="default" className="capitalize" variant="flat">
                  {service.type}
                </Chip>
              )}
            </div>
          </div>
          <Accordion
            className="-mx-1 mt-2"
            itemClasses={{
              title: 'text-default-400',
              content: 'pt-0 pb-6 text-medium text-default-500',
            }}
          >
            <AccordionItem title="Description">
              <p
                className="text-default-500"
                dangerouslySetInnerHTML={{
                  __html: service.description || 'No Description available',
                }}
              />
            </AccordionItem>
            <AccordionItem title="Test Information">
              <p
                className="text-default-500"
                dangerouslySetInnerHTML={{
                  __html: service.summary || 'No Information available',
                }}
              />
            </AccordionItem>
            <AccordionItem title="Created By">
              <p className="text-default-500">
                {service.createdBy || 'Admin'} on {format(service.createdAt, 'PPPp')} at{' '}
                {format(service.createdAt, 'PPPp')}
              </p>
            </AccordionItem>
            <AccordionItem title="Updated By">
              <p className="text-default-500">
                {service.updatedBy || 'Admin'} on {format(service.updatedAt, 'PPPp')} at{' '}
                {format(service.updatedAt, 'PPPp')}
              </p>
            </AccordionItem>
          </Accordion>
          <div className="mt-2 flex gap-2">
            <Button
              fullWidth
              color="primary"
              startContent={<Icon icon="lets-icons:send" width={24} />}
            >
              Book Appointment
            </Button>
            {session.user?.role &&
              [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT].includes(
                session.user?.role
              ) && (
                <Tooltip content="Edit">
                  <Button
                    isIconOnly
                    className="text-default-600"
                    variant="flat"
                    as={Link}
                    href={`/dashboard/services/${service.uniqueId}/edit`}
                  >
                    <Icon icon="solar:pen-linear" width={16} />
                  </Button>
                </Tooltip>
              )}
          </div>
        </div>
      </div>
      <div>{!!service.fields && <DataTable data={service.fields} />}</div>
    </div>
  );
}
