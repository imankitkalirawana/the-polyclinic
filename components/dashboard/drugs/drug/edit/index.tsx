'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  ScrollShadow,
  Textarea,
} from '@heroui/react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';

import NoResults from '@/components/ui/no-results';
import { drugValidationSchema } from '@/libs/validation';
import { useDrugWithDid, useUpdateDrug } from '@/services/client/drug/drug.query';
import { DrugType } from '@/services/client/drug/drug.types';

export default function EditDrug({ did }: { did: number }) {
  const router = useRouter();
  const { data } = useDrugWithDid(did);
  const drug: DrugType = data as DrugType;
  const updateDrug = useUpdateDrug();

  const formik = useFormik({
    initialValues: drug,
    validationSchema: drugValidationSchema,
    onSubmit: async (values) => {
      await updateDrug.mutateAsync(values).then(() => {
        router.push(`/dashboard/drugs/${did}`);
      });
    },
  });

  if (!drug) {
    return <NoResults message="Drug not found" />;
  }

  return (
    <Card
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
      className="rounded-none bg-transparent shadow-none"
    >
      <CardHeader className="flex-col items-start p-0">
        <h3 className="leading-large font-semibold text-default-900 text-medium">Edit Drug</h3>
        <p className="leading-medium max-w-2xl text-default-500 text-small">Update drug details</p>
      </CardHeader>
      <CardBody className="space-y-2 px-0" as={ScrollShadow}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Drug ID"
              name="did"
              value={formik.values.did !== undefined ? String(formik.values.did) : ''}
              placeholder="e.g. 1, 2, etc."
              onChange={(e) => {
                formik.handleChange(e);
              }}
              min={1}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">#</span>
                </div>
              }
              isInvalid={!!formik.errors.did}
              errorMessage={formik.errors.did}
            />
          </div>
          <div>
            <Input
              label="Brand Name"
              name="brandName"
              value={formik.values.brandName}
              placeholder="e.g. Panadol, Disprin, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.brandName && formik.errors.brandName)}
              errorMessage={formik.touched.brandName && formik.errors.brandName}
            />
          </div>
          <div>
            <Input
              label="Generic Name"
              name="genericName"
              value={formik.values.genericName}
              placeholder="e.g. Paracetamol, Aspirin, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.genericName && formik.errors.genericName)}
              errorMessage={formik.touched.genericName && formik.errors.genericName}
            />
          </div>
          <div>
            <Input
              label="Manufacturer"
              name="manufacturer"
              value={formik.values.manufacturer}
              placeholder='e.g. "Pfizer", "Cipla", etc.'
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.manufacturer && formik.errors.manufacturer)}
              errorMessage={formik.touched.manufacturer}
            />
          </div>
          <div className="col-span-2">
            <Textarea
              label="Description"
              name="description"
              value={formik.values.description}
              placeholder="e.g. Used to relieve pain and reduce fever, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.description && formik.errors.description)}
              errorMessage={formik.touched.description && formik.errors.description}
            />
          </div>
          <div>
            <Input
              label="Price"
              name="price"
              value={formik.values.price !== undefined ? String(formik.values.price) : ''}
              placeholder="e.g. 500, 1000, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.price && formik.errors.price)}
              errorMessage={formik.touched.price && formik.errors.price}
            />
          </div>
          <div>
            <Input
              label="Dosage"
              name="dosage"
              value={formik.values.dosage}
              placeholder="e.g. 500mg, 1mg, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.dosage && formik.errors.dosage)}
              errorMessage={formik.touched.dosage && formik.errors.dosage}
            />
          </div>
          <div>
            <Input
              label="Drug Form"
              name="form"
              value={formik.values.form}
              placeholder="e.g. Tablet, Capsule, Syrup, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.form && formik.errors.form)}
              errorMessage={formik.touched.form && formik.errors.form}
            />
          </div>
          <div>
            <Input
              label="Frequency"
              name="frequency"
              value={formik.values.frequency}
              placeholder="e.g. 1-0-1, 1-1-1,Once daily, Twice daily etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.frequency && formik.errors.frequency)}
              errorMessage={formik.touched.frequency && formik.errors.frequency}
            />
          </div>
          <div>
            <Input
              label="Strength"
              name="strength"
              value={formik.values.strength !== undefined ? String(formik.values.strength) : ''}
              placeholder="e.g. 500, 1000, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.strength && formik.errors.strength)}
              errorMessage={formik.touched.strength && formik.errors.strength}
            />
          </div>
          <div>
            <Input
              label="Quantity"
              name="quantity"
              value={formik.values.quantity !== undefined ? String(formik.values.quantity) : ''}
              placeholder="e.g. 500, 1000, etc."
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.quantity && formik.errors.quantity)}
              errorMessage={formik.touched.quantity && formik.errors.quantity}
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
              icon="tabler:check"
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
