'use client';

import { ActivityLogType, Schema } from '@/models/Activity';
import { Avatar } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format, isToday, isYesterday } from 'date-fns';

// function to check if a value is a date
const isDate = (value: any) => {
  return (
    value instanceof Date ||
    (typeof value === 'string' && !isNaN(Date.parse(value)))
  );
};

export default function ActivityTimeline({
  activities,
}: {
  activities: ActivityLogType[];
}) {
  // Function to get the appropriate icon based on activity type
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

  // Function to get the appropriate background color based on activity type
  const getActivityColor = (type: Schema) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-500 text-white';
      case 'user':
        return 'bg-amber-400';
      case 'drug':
        return 'bg-purple-500 text-white';
      case 'service':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="w-full">
      <ul className="relative">
        {/* Vertical line connecting all events */}
        <div className="absolute bottom-0 left-5 top-5 w-px bg-gradient-to-b from-divider via-divider to-transparent"></div>

        {activities?.map((activity) => (
          <li key={activity.id} className="relative pb-8 pl-14 last:pb-0">
            {/* Activity icon */}
            <div
              className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(activity.schema)} z-10`}
            >
              <Icon icon={getActivityIcon(activity.schema)} width={18} />
            </div>

            {/* Activity content */}
            <div>
              <div className="text-xs text-default-400">
                {isToday(new Date(activity?.createdAt))
                  ? `Today ${format(new Date(activity?.createdAt), 'HH:mm')}`
                  : isYesterday(new Date(activity?.createdAt))
                    ? `Yesterday ${format(new Date(activity?.createdAt), 'HH:mm')}`
                    : format(new Date(activity?.createdAt), 'dd/MM/yyyy')}
              </div>
              <h3 className="mb-1 text-sm font-medium text-default-800">
                {activity.title}
              </h3>

              {activity.metadata && (
                <ul className="mt-1 text-default-500">
                  {activity.metadata.fields?.map((field) => (
                    <li key={field} className="text-xs">
                      <div className="absolute left-5 h-5 w-8 -translate-y-1/2 rounded-bl-3xl border-b border-l border-divider"></div>
                      <div className="line-clamp-1 hover:line-clamp-none">
                        <span className="capitalize">
                          {field.split('.').join(' ')}
                        </span>{' '}
                        :{' '}
                        <span className="capitalize text-danger-300 line-through">
                          {isDate(activity.metadata?.diff?.[field]?.old)
                            ? format(
                                new Date(activity.metadata?.diff?.[field]?.old),
                                'PPp'
                              )
                            : activity.metadata?.diff?.[field]?.old}
                        </span>{' '}
                        &rarr;{' '}
                        <span className="capitalize text-success-300">
                          {isDate(activity.metadata?.diff?.[field]?.new)
                            ? format(
                                new Date(activity.metadata?.diff?.[field]?.new),
                                'PPp'
                              )
                            : activity.metadata?.diff?.[field]?.new}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {activity.by && (
                <div className="mt-1 flex items-center overflow-hidden text-xs text-default-500">
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

              {/* Manually set indicator */}
              {/* {activity.manuallySet && (
                <div className="mt-1 text-default-500">
                  <span>Manually Set</span>
                </div>
              )} */}
            </div>

            {/* {index === 2 && !showSimilar && (
              <button
                onClick={() => setShowSimilar(true)}
                className="mt-4 flex items-center text-primary hover:underline"
              >
                <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Icon
                    icon="solar:menu-dots-bold"
                    className="h-4 w-4 text-white"
                  />
                </div>
                <span>Show 3 similar activities</span>
              </button>
            )} */}
          </li>
        ))}
      </ul>
    </div>
  );
}
