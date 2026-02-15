'use client';

import React, { useState } from 'react';
import { cn, ScrollShadow, Tooltip } from '@heroui/react';
import { format, isToday, isYesterday } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import Avatar from 'boring-avatars';

import {
  ActivityAction,
  ActivityLogResponse,
  ActorType,
} from '@/services/common/activity/activity.types';
import { formatLabel } from '@/libs/utils';

const getActivityIcon = (action: ActivityAction) => {
  switch (action) {
    case ActivityAction.CREATED:
      return 'solar:stars-minimalistic-bold-duotone';
    case ActivityAction.UPDATED:
      return 'solar:refresh-circle-bold-duotone';
    case ActivityAction.STATUS_CHANGED:
      return 'solar:translation-bold-duotone';
    case ActivityAction.SOFT_DELETED:
      return 'solar:clipboard-remove-bold-duotone';
    case ActivityAction.DELETED:
      return 'solar:trash-bin-trash-bold-duotone';
    default:
      return 'solar:menu-dots-circle-bold-duotone';
  }
};

const getActivityColor = (action: ActivityAction) => {
  switch (action) {
    case ActivityAction.CREATED:
      return 'bg-success-100 text-success-500';
    case ActivityAction.UPDATED:
      return 'bg-blue-100 text-blue-500';
    case ActivityAction.STATUS_CHANGED:
      return 'bg-indigo-100 text-indigo-500';
    case ActivityAction.SOFT_DELETED:
      return 'bg-warning-100 text-warning-700';
    case ActivityAction.DELETED:
      return 'bg-danger-100 text-danger-500';
    default:
      return 'bg-primary-100 text-primary-500';
  }
};

export default function ActivityTimeline({ activities }: { activities: ActivityLogResponse[] }) {
  return (
    <div className="h-full overflow-hidden py-4 pl-2">
      <h2 className="text-default-800 text-small pb-4 font-medium">Activity Logs</h2>
      <ScrollShadow className="flex h-full flex-col gap-2 pb-16" hideScrollBar>
        <ul className="relative flex flex-col gap-4">
          <div className="from-divider via-divider absolute top-5 bottom-0 left-4 w-px bg-linear-to-b to-transparent" />

          {activities?.map((activity) => (
            <ActivityTimelineItem key={activity.id} activity={activity} />
          ))}
        </ul>
      </ScrollShadow>
    </div>
  );
}

function ActivityTimelineItem({ activity }: { activity: ActivityLogResponse }) {
  const [visibleFields, setVisibleFields] = useState<number>(2);

  return (
    <li key={activity.id} className="relative pb-4 pl-14 last:pb-0">
      <Tooltip content={formatLabel(activity.action)}>
        <div
          className={cn(
            'absolute top-0 left-0 z-10 flex size-9 items-center justify-center rounded-full',
            getActivityColor(activity.action)
          )}
        >
          <Icon icon={getActivityIcon(activity.action)} width={20} />
        </div>
      </Tooltip>

      <div>
        <div className="text-default-400 text-tiny">
          {isToday(new Date(activity?.createdAt))
            ? `Today ${format(new Date(activity?.createdAt), 'HH:mm a')}`
            : isYesterday(new Date(activity?.createdAt))
              ? `Yesterday ${format(new Date(activity?.createdAt), 'HH:mm a')}`
              : format(new Date(activity?.createdAt), 'dd/MM/yyyy')}
        </div>
        <h3 className="text-default-800 text-small mb-1 font-medium">{activity.description}</h3>

        {activity.changedFields && (
          <ul className="text-default-500 mt-1">
            {Object.keys(activity.changedFields)
              .slice(0, visibleFields)
              .map((field) => (
                <li key={field} className="text-tiny">
                  <div className="border-divider absolute left-4 h-5 w-8 -translate-y-1/2 rounded-bl-2xl border-b border-l" />
                  <div className="line-clamp-1 hover:line-clamp-none">
                    <span className="capitalize">{field}</span> : {/* show previus value here */}
                    <span className="text-danger-300 capitalize line-through">
                      {activity?.changedFields?.[field]?.before}
                    </span>{' '}
                    &rarr;{' '}
                    <span className="text-success-300 capitalize">
                      {activity?.changedFields?.[field]?.after}
                    </span>
                  </div>
                </li>
              ))}
            {!!activity.changedFields &&
              visibleFields < Object.keys(activity.changedFields).length && (
                <button
                  onClick={() => setVisibleFields(Object.keys(activity.changedFields ?? {}).length)}
                  className="text-primary-500 text-tiny flex items-center hover:underline"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full">
                    <Icon icon="solar:menu-dots-circle-bold-duotone" width={18} />
                  </div>
                  <span>
                    Show {Object.keys(activity.changedFields).length - visibleFields} similar
                    activities
                  </span>
                </button>
              )}
          </ul>
        )}

        {activity.actor.type === ActorType.USER && (
          <div className="text-default-500 text-tiny mt-1 flex items-center overflow-hidden">
            <Avatar
              name={activity.actor.name}
              className="bg-default-300 mr-2 h-5 w-5 shrink-0 rounded-full"
            />
            <span>{activity.actor.name}</span>
          </div>
        )}
      </div>
    </li>
  );
}
