'use client';

import DashboardTableSkeleton from '@/components/skeletons/dashboard-table-skeleton';
import FormSkeleton from '@/components/skeletons/form-skeleton';
import ListSkeleton from '@/components/skeletons/list-skeleton';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';

export default function Dashboard() {
  return (
    <div>
      <Button
        onPress={() => {
          toast.success('Hello WOrld', {
            description: 'This is a toast message'
          });
        }}
      >
        Toast
      </Button>
    </div>
  );
}
