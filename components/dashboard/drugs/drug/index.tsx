'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  ScrollShadow
} from '@heroui/react';

import Link from 'next/link';
import { humanReadableDate, humanReadableTime } from '@/lib/utility';
import { DrugType } from '@/models/Drug';
import CellValue from '@/components/ui/cell-value';

interface Props {
  drug: DrugType;
}

export default function DrugCard({ drug }: Props) {
  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader className="justify-between px-0">
        <div className="flex flex-col items-start">
          <p className="text-large">Drug Details</p>
          <p className="text-small text-default-500">
            View and manage drug details
          </p>
        </div>
        <Button
          color="primary"
          as={Link}
          href={`/dashboard/drugs/${drug.did}/edit`}
        >
          Edit
        </Button>
      </CardHeader>
      <CardBody className="space-y-2 px-0">
        <ScrollShadow className="divide-y-1 pr-4">
          <CellValue label="Brand Name" value={drug.brandName || '-'} />
          <CellValue label="Generic Name" value={drug.genericName || '-'} />
          <CellValue label="Manufacturer" value={drug.manufacturer || '-'} />
          <CellValue label="Description" value={drug.description || '-'} />
          <CellValue label="Dosage" value={drug.dosage || '-'} />
          <CellValue label="Form" value={drug.form || '-'} />
          <CellValue label="Strength" value={drug.strength || '-'} />
          <CellValue label="Quantity" value={drug.quantity || '-'} />
          <CellValue label="Price" value={drug.price || '-'} />
          <CellValue
            label="Frequency"
            value={<span className="capitalize">{drug.frequency}</span>}
          />

          <CellValue
            label="Created By"
            value={`${drug.createdBy || 'Admin'} on ${humanReadableDate(drug.createdAt as Date)} at ${humanReadableTime(drug.createdAt as Date)}`}
          />
          <CellValue
            label="Updated By"
            value={`${drug.updatedBy || 'Admin'} on ${humanReadableDate(drug.updatedAt as Date)} at ${humanReadableTime(drug.updatedAt as Date)}`}
          />
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
