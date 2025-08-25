'use client';

import React from 'react';
import { Accordion, AccordionItem, Button, Chip, ChipProps, Link, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import DataTable from './data-table';
import { CircleChartCard } from './graph';

import Loading from '@/app/loading';
import PriceDisplay from '@/components/helper/display-price';
import NoResults from '@/components/ui/no-results';
import {
  convertMinutesToHoursAndMinutes,
  humanReadableDate,
  humanReadableTime,
} from '@/lib/utility';
import { castData } from '@/lib/utils';
import { useServiceWithUID } from '@/hooks/queries/client/service';
import { ServiceType } from '@/types/client/service';
import { AuthUser } from '@/types/system/control-plane';

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

export default function ServiceViewItem({ uid, session }: { uid: string; session: AuthUser }) {
  const { data, isError, isLoading } = useServiceWithUID(uid);

  const service = castData<ServiceType>(data);

  if (isLoading) {
    return <Loading />;
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
            <p className="text-small italic text-default-400">#{service.uniqueId}</p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{service.name}</h1>
          <h2 className="sr-only">Service information</h2>

          <div className="text-xl font-medium tracking-tight">
            <PriceDisplay price={service.price} />
          </div>

          <div className="mt-6 flex flex-col gap-1">
            {service.duration > 0 && (
              <div className="mb-4 flex items-center gap-2 text-default-700">
                <Icon icon="solar:clock-circle-broken" width={20} />
                <p className="text-small font-medium">
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
                {service.createdBy || 'Admin'} on {humanReadableDate(service.createdAt)} at{' '}
                {humanReadableTime(service.createdAt)}
              </p>
            </AccordionItem>
            <AccordionItem title="Updated By">
              <p className="text-default-500">
                {service.updatedBy || 'Admin'} on {humanReadableDate(service.updatedAt)} at{' '}
                {humanReadableTime(service.updatedAt)}
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
              ['superadmin', 'moderator', 'ops'].includes(session.user.role) && (
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
      <div>{!!service.data && <DataTable data={service.data} />}</div>
    </div>
  );
}
