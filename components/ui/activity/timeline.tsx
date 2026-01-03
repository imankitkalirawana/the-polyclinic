'use client';

import React, { useState } from 'react';
import { Avatar, ScrollShadow } from '@heroui/react';
import { format, isToday, isYesterday } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import type { $FixMe } from '@/types';
import { ActivityLogType, Schema } from '@/services/common/activity/activity.types';
import MinimalPlaceholder from '../minimal-placeholder';

const isDate = (value: $FixMe) =>
  value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));

const getActivityIcon = (type: Schema) => {
  switch (type) {
    case 'appointment':
      return 'solar:calendar-bold-duotone';
    case 'user':
      return 'solar:users-group-rounded-bold-duotone';
    case 'drug':
      return 'solar:pills-bold-duotone';
    case 'service':
      return 'solar:test-tube-minimalistic-bold-duotone';
    default:
      return 'solar:menu-dots-bold';
  }
};

const getActivityColor = (type: Schema) => {
  switch (type) {
    case 'appointment':
      return 'bg-blue-200';
    case 'user':
      return 'bg-amber-200';
    case 'drug':
      return 'bg-purple-200';
    case 'service':
      return 'bg-orange-200';
    default:
      return 'bg-gray-200';
  }
};

export default function ActivityTimeline() {
  const [activities] = useState<Array<ActivityLogType>>([]);

  if (activities.length === 0) {
    return <MinimalPlaceholder message="Loading activity timeline..." />;
  }

  return (
    <ScrollShadow className="flex max-h-[32vh] flex-col gap-2 overflow-auto px-2 py-4 pb-12">
      <ul className="relative">
        <div className="absolute bottom-0 left-4 top-5 w-px bg-gradient-to-b from-divider via-divider to-transparent" />

        {activities?.map((activity) => (
          <ActivityTimelineItem key={activity.id} activity={activity} />
        ))}
      </ul>
    </ScrollShadow>
  );
}

function ActivityTimelineItem({ activity }: { activity: ActivityLogType }) {
  const [visibleFields, setVisibleFields] = useState<number>(2);

  return (
    <li key={activity.id} className="relative pb-4 pl-14 last:pb-0">
      <div
        className={`absolute left-0 top-0 flex size-8 items-center justify-center rounded-full ${getActivityColor(activity.schema)} z-10`}
      >
        <Icon icon={getActivityIcon(activity.schema)} width={18} />
      </div>

      <div>
        <div className="text-default-400 text-tiny">
          {isToday(new Date(activity?.createdAt))
            ? `Today ${format(new Date(activity?.createdAt), 'HH:mm a')}`
            : isYesterday(new Date(activity?.createdAt))
              ? `Yesterday ${format(new Date(activity?.createdAt), 'HH:mm a')}`
              : format(new Date(activity?.createdAt), 'dd/MM/yyyy')}
        </div>
        <h3 className="mb-1 font-medium text-default-800 text-small">{activity.title}</h3>

        {activity.metadata && (
          <ul className="mt-1 text-default-500">
            {activity.metadata.fields?.slice(0, visibleFields).map((field) => (
              <li key={field} className="text-tiny">
                <div className="absolute left-4 h-5 w-8 -translate-y-1/2 rounded-bl-2xl border-b border-l border-divider" />
                <div className="line-clamp-1 hover:line-clamp-none">
                  <span className="capitalize">{field.split('.').join(' ')}</span> :{' '}
                  <span className="capitalize text-danger-300 line-through">
                    {isDate(activity.metadata?.diff?.[field]?.old)
                      ? format(new Date(activity.metadata?.diff?.[field]?.old), 'PPp')
                      : activity.metadata?.diff?.[field]?.old}
                  </span>{' '}
                  &rarr;{' '}
                  <span className="capitalize text-success-300">
                    {isDate(activity.metadata?.diff?.[field]?.new)
                      ? format(new Date(activity.metadata?.diff?.[field]?.new), 'PPp')
                      : activity.metadata?.diff?.[field]?.new}
                  </span>
                </div>
              </li>
            ))}
            {activity.metadata?.fields &&
              activity.metadata?.fields?.length > 2 &&
              visibleFields < activity.metadata?.fields?.length && (
                <button
                  onClick={() => setVisibleFields(activity.metadata?.fields?.length || 2)}
                  className="flex items-center text-primary-500 text-tiny hover:underline"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full">
                    <Icon icon="solar:menu-dots-circle-bold-duotone" width={18} />
                  </div>
                  <span>
                    Show {activity.metadata?.fields?.length - visibleFields} similar activities
                  </span>
                </button>
              )}
          </ul>
        )}

        {activity.by && visibleFields >= (activity.metadata?.fields?.length ?? 0) && (
          <div className="mt-1 flex items-center overflow-hidden text-default-500 text-tiny">
            <Avatar
              src={activity.by.image}
              className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-default-300"
            />
            <span>{activity.by.name}</span>
            {activity.by.email && (
              <>
                <span className="mx-0.5">@</span>
                <span>{activity.by.email}</span>
              </>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
