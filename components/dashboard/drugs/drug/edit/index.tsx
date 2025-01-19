'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  CardFooter,
  Button,
  ScrollShadow
} from "@heroui/react";

import { DrugType } from '@/models/Drug';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'sonner';
import { Icon } from '@iconify/react/dist/iconify.js';
import { drugValidationSchema } from '@/lib/validation';

interface UserCardProps {
  drug: DrugType;
}

export default function EditDrug({ drug }: UserCardProps) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      drug: drug
    },
    validationSchema: drugValidationSchema,
    onSubmit: async (values) => {
      try {
        await axios.put(`/api/drugs/did/${drug.did}`, values.drug);
        toast.success('Service updated successfully');
        router.push(`/dashboard/drugs/${values.drug.did}`);
      } catch (error) {
        toast.error('Failed to update service');
        console.error(error);
      }
    }
  });

  return (
    <Card
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
      className="bg-transparent shadow-none"
    >
      <CardHeader className="flex-col items-start p-0">
        <h3 className="text-base font-semibold leading-7 text-default-900">
          Edit Drug
        </h3>
        <p className="max-w-2xl text-sm leading-6 text-default-500">
          Update drug details
        </p>
      </CardHeader>
      <CardBody className="space-y-2 px-0" as={ScrollShadow}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Drug ID"
              name="drug.did"
              value={
                formik.values.drug.did !== undefined
                  ? String(formik.values.drug.did)
                  : ''
              }
              placeholder="e.g. 1, 2, etc."
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={async () => {
                const did = formik.values.drug.did;
              }}
              min={1}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">#</span>
                </div>
              }
              isInvalid={formik.errors.drug?.did ? true : false}
              errorMessage={formik.errors.drug?.did}
            />
          </div>
          <div>
            <Input
              label="Brand Name"
              name="drug.brandName"
              value={formik.values.drug.brandName}
              placeholder="e.g. Panadol, Disprin, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.brandName && formik.errors.drug?.brandName
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.brandName && formik.errors.drug?.brandName
              }
            />
          </div>
          <div>
            <Input
              label="Generic Name"
              name="drug.genericName"
              value={formik.values.drug.genericName}
              placeholder="e.g. Paracetamol, Aspirin, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.genericName &&
                formik.errors.drug?.genericName
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.genericName &&
                formik.errors.drug?.genericName
              }
            />
          </div>
          <div>
            <Input
              label="Manufacturer"
              name="drug.manufacturer"
              value={formik.values.drug.manufacturer}
              placeholder='e.g. "Pfizer", "Cipla", etc.'
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.manufacturer &&
                formik.errors.drug?.manufacturer
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.manufacturer &&
                formik.errors.drug?.manufacturer
              }
            />
          </div>
          <div className="col-span-2">
            <Textarea
              label="Description"
              name="drug.description"
              value={formik.values.drug.description}
              placeholder="e.g. Used to relieve pain and reduce fever, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.description &&
                formik.errors.drug?.description
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.description &&
                formik.errors.drug?.description
              }
            />
          </div>
          <div>
            <Input
              label="Price"
              name="drug.price"
              value={
                formik.values.drug.price !== undefined
                  ? String(formik.values.drug.price)
                  : ''
              }
              placeholder="e.g. 500, 1000, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.price && formik.errors.drug?.price
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.price && formik.errors.drug?.price
              }
            />
          </div>
          <div>
            <Input
              label="Dosage"
              name="drug.dosage"
              value={formik.values.drug.dosage}
              placeholder="e.g. 500mg, 1mg, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.dosage && formik.errors.drug?.dosage
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.dosage && formik.errors.drug?.dosage
              }
            />
          </div>
          <div>
            <Input
              label="Drug Form"
              name="drug.form"
              value={formik.values.drug.form}
              placeholder="e.g. Tablet, Capsule, Syrup, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.form && formik.errors.drug?.form
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.form && formik.errors.drug?.form
              }
            />
          </div>
          <div>
            <Input
              label="Frequency"
              name="drug.frequency"
              value={formik.values.drug.frequency}
              placeholder="e.g. 1-0-1, 1-1-1,Once daily, Twice daily etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.frequency && formik.errors.drug?.frequency
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.frequency && formik.errors.drug?.frequency
              }
            />
          </div>
          <div>
            <Input
              label="Strength"
              name="drug.strength"
              value={
                formik.values.drug.strength !== undefined
                  ? String(formik.values.drug.strength)
                  : ''
              }
              placeholder="e.g. 500, 1000, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.strength && formik.errors.drug?.strength
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.strength && formik.errors.drug?.strength
              }
            />
          </div>
          <div>
            <Input
              label="Quantity"
              name="drug.quantity"
              value={
                formik.values.drug.quantity !== undefined
                  ? String(formik.values.drug.quantity)
                  : ''
              }
              placeholder="e.g. 500, 1000, etc."
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.drug?.quantity && formik.errors.drug?.quantity
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.drug?.quantity && formik.errors.drug?.quantity
              }
            />
          </div>
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button
          color="primary"
          isLoading={formik.isSubmitting}
          type="submit"
          startContent={
            <Icon
              icon={'tabler:check'}
              className={formik.isSubmitting ? 'hidden' : ''}
              fontSize={18}
            />
          }
        >
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
