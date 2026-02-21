'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, ScrollShadow } from '@heroui/react';
import { format } from 'date-fns';

import CellValue from '@/components/ui/cell-value';
import { useDrugWithDid } from '@/services/client/drug/drug.query';
import { Drug } from '@/shared';

export default function DrugCard({ unique_id }: { unique_id: string }) {
  const { data } = useDrugWithDid(unique_id);

  const drug: Drug = data as Drug;

  if (!drug) {
    return <div>Drug not found</div>;
  }

  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader className="justify-between px-0">
        <div className="flex flex-col items-start">
          <p className="text-large">Drug Details</p>
          <p className="text-default-500 text-small">View and manage drug details</p>
        </div>
        <Button color="primary" as={Link} href={`/dashboard/drugs/${drug.unique_id}/edit`}>
          Edit
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-0">
        <ScrollShadow className="divide-y pr-4">
          <CellValue label="Brand Name" value={drug.name || '-'} />
          <CellValue label="Generic Name" value={drug.generic_name || '-'} />
          <CellValue label="Manufacturer" value={drug.manufacturer || '-'} />
          <CellValue label="Description" value={drug.description || '-'} />
          <CellValue label="Manufacturer" value={drug.manufacturer || '-'} />
          <CellValue
            label="Created By"
            value={`${drug.createdBy || 'Admin'} on ${format(new Date(drug.createdAt), 'PPPp')}`}
          />
          <CellValue
            label="Updated By"
            value={`${drug.updatedBy || 'Admin'} on ${format(new Date(drug.updatedAt), 'PPPp')}`}
          />
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
