'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';

import Skeleton from '../ui/skeleton';

export default function DashboardDetailsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </CardHeader>
      <CardBody className="grid gap-4">
        {[
          'Full Name',
          'Date of Birth',
          'Country',
          'State',
          'City',
          'Address',
          'Zip Code',
          'Phone Number',
          'Email',
          'Status',
          'Role',
        ].map((label, index) => (
          <div key={index} className="grid grid-cols-2 items-center gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
