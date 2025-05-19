'use client';

import { apiRequest } from '@/lib/axios';
import { ActivityLogType, Schema } from '@/models/Activity';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ActivityTimeline from './timeline';
import { ScrollShadow } from '@heroui/react';

export default function Activity({ aid }: { aid: number }) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity', 'appointment', aid],
    queryFn: () =>
      apiRequest({
        method: 'GET',
        url: `/api/v1/activity/${aid}`,
      }),
  });

  if (!activities && !isLoading) {
    return <div>No activities found</div>;
  }

  return (
    <ScrollShadow className="flex max-h-[36vh] flex-col gap-2 overflow-auto py-4">
      <ActivityTimeline activities={activities} />
    </ScrollShadow>
  );
}
