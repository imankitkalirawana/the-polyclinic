'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
  SelectItemProps,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';

import QuillInput from '@/components/ui/quill-input';
import { getServiceWithUID, verifyUID } from '@/functions/server-actions';
import { ServiceStatuses, ServiceTypes } from '@/lib/interface';
import { serviceValidationSchema } from '@/lib/validation';
import { ServiceType } from '@/models/Service';

export default function EditService({ uid }: { uid: string }) {
  const {
    data: service,
    isError,
    refetch,
  } = useQuery<ServiceType>({
    queryKey: ['service', uid],
    queryFn: () => getServiceWithUID(uid),
  });

  const router = useRouter();
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

  const formik = useFormik({
    initialValues: {
      service: service as ServiceType,
    },
    validationSchema: serviceValidationSchema,
    onSubmit: async (values) => {
      try {
        await axios.put(
          `/api/v1/services/${values.service._id}`,
          values.service
        );
        addToast({
          title: 'Updated Successfully',
          color: 'success',
        });
        refetch();
        router.push(`/dashboard/services/${values.service.uniqueId}`);
      } catch (error) {
        addToast({
          title: 'Error',
          description: 'Failed to update service',
          color: 'danger',
        });
        console.error(error);
      }
    },
  });

  const [numRows, setNumRows] = useState(
    Math.max(
      ...Object.keys(formik.values.service.data).map((key) =>
        parseInt(key.split('-')[1])
      )
    ) + 1
  );

  const [numCols, setNumCols] = useState(
    Math.max(
      ...Object.keys(formik.values.service.data).map((key) =>
        parseInt(key.split('-')[2])
      )
    ) + 1
  );

  if (isError) {
    return <div>Service not found</div>;
  }

  const handleInputChange = (key: string, value: string) => {
    formik.setFieldValue(`service.data.${key}`, value);
  };

  const handleAddRow = (rowIndex: number) => {
    const newValues = { ...formik.values.service.data };
    for (let row = numRows; row > rowIndex; row--) {
      for (let col = 0; col < numCols; col++) {
        newValues[`cell-${row}-${col}`] = newValues[`cell-${row - 1}-${col}`];
      }
    }

    for (let col = 0; col < numCols; col++) {
      newValues[`cell-${rowIndex}-${col}`] = '';
    }

    setNumRows(numRows + 1);
    formik.setFieldValue('service.data', newValues);
  };

  const handleAddColumn = (colIndex: number) => {
    const newValues = { ...formik.values.service.data };
    for (let row = 0; row < numRows; row++) {
      for (let col = numCols; col > colIndex; col--) {
        newValues[`cell-${row}-${col}`] = newValues[`cell-${row}-${col - 1}`];
      }
    }

    for (let row = 0; row < numRows; row++) {
      newValues[`cell-${row}-${colIndex}`] = '';
    }

    setNumCols(numCols + 1);
    formik.setFieldValue('service.data', newValues);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newValues = { ...formik.values.service.data };
    for (let col = 0; col < numCols; col++) {
      delete newValues[`cell-${rowIndex}-${col}`];
    }

    for (let row = rowIndex + 1; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        newValues[`cell-${row - 1}-${col}`] = newValues[`cell-${row}-${col}`];
        delete newValues[`cell-${row}-${col}`];
      }
    }

    setNumRows(numRows - 1);
    formik.setFieldValue('service.data', newValues);
  };

  const handleDeleteColumn = (colIndex: number) => {
    const newValues = { ...formik.values.service.data };
    for (let row = 0; row < numRows; row++) {
      delete newValues[`cell-${row}-${colIndex}`];
    }

    for (let col = colIndex + 1; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        newValues[`cell-${row}-${col - 1}`] = newValues[`cell-${row}-${col}`];
        delete newValues[`cell-${row}-${col}`];
      }
    }

    setNumCols(numCols - 1);
    formik.setFieldValue('service.data', newValues);
  };

  return (
    <>
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
            Edit Service
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-default-500">
            Edit the service details below.
          </p>
        </CardHeader>
        <CardBody className="px-0" as={ScrollShadow}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Input
                label="Unique ID"
                name="service.uniqueId"
                value={formik.values.service.uniqueId}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                onBlur={async () => {
                  const uid = formik.values.service.uniqueId;
                  if (await verifyUID(uid, service?._id)) {
                    formik.setErrors({
                      service: {
                        uniqueId: 'This Unique ID is already taken',
                      },
                    });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">#</span>
                  </div>
                }
                isInvalid={formik.errors.service?.uniqueId ? true : false}
                errorMessage={formik.errors.service?.uniqueId}
              />
            </div>
            <div>
              <Input
                label="Name"
                name="service.name"
                value={formik.values.service.name}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.service?.name && formik.errors.service?.name
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.service?.name && formik.errors.service?.name
                }
              />
            </div>
            <div>
              <Input
                label="Price"
                value={
                  formik.values.service.price !== undefined
                    ? String(formik.values.service.price)
                    : ''
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue)) {
                    formik.setFieldValue(
                      'service.price',
                      inputValue ? Number(inputValue) : 0
                    );
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">₹</span>
                  </div>
                }
                isInvalid={
                  formik.touched.service?.price && formik.errors.service?.price
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.service?.price && formik.errors.service?.price
                }
                min={1}
                type="number"
              />
            </div>
            <div>
              <Input
                label="Duration"
                value={
                  formik.values.service.duration !== undefined
                    ? String(formik.values.service.duration)
                    : ''
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue)) {
                    formik.setFieldValue(
                      'service.duration',
                      inputValue ? Number(inputValue) : 0
                    );
                  }
                }}
                min={1}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">min(s)</span>
                  </div>
                }
                isInvalid={
                  formik.touched.service?.duration &&
                  formik.errors.service?.duration
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.service?.duration &&
                  formik.errors.service?.duration
                }
                type="number"
              />
            </div>

            <div className="col-span-full">
              <QuillInput
                label="Description"
                value={formik.values.service.description}
                onChange={(value) =>
                  formik.setFieldValue('service.description', value)
                }
                description="This information will be displayed on the report before the table."
              />
            </div>
            <div className="col-span-full">
              {/* <Textarea
              label="Test Information"
              description="This information will be displayed on the report after the table."
              value={formik.values.service.summary}
              onChange={(e) =>
                formik.setFieldValue('service.summary', e.target.value)
              }
              isInvalid={
                formik.touched.service?.summary &&
                formik.errors.service?.summary
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.service?.summary &&
                formik.errors.service?.summary
              }
            /> */}
              <QuillInput
                label="Test Information"
                value={formik.values.service.summary}
                onChange={(value) =>
                  formik.setFieldValue('service.summary', value)
                }
                description="This information will be displayed on the report after the table."
              />
            </div>

            <div>
              <Select
                aria-label="Type"
                label="Type"
                name="service.type"
                selectedKeys={[formik.values.service.type]}
                onChange={formik.handleChange}
              >
                {ServiceTypes.map((service) => (
                  <SelectItem color="primary" key={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Select
                aria-label="Status"
                label="Status"
                name="service.status"
                selectedKeys={[formik.values.service.status]}
                onChange={formik.handleChange}
              >
                {ServiceStatuses.map((status) => (
                  <SelectItem
                    color={status.color as SelectItemProps['color']}
                    key={status.value}
                  >
                    {status.value}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="col-span-full mt-4">
              <div className="flex min-h-[6rem] min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top">
                <div className="overflow-x-auto md:w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-y-0">
                        {Array.from({ length: numCols }).map((_, colIndex) => (
                          <th
                            className="text-center"
                            key={colIndex}
                            onMouseEnter={() => setHoveredColIndex(colIndex)}
                            onMouseLeave={() => setHoveredColIndex(null)}
                          >
                            <div
                              className={cn(
                                'flex flex-row-reverse justify-between opacity-0',
                                {
                                  'opacity-100': hoveredColIndex === colIndex,
                                }
                              )}
                            >
                              {numCols > 1 && (
                                <Tooltip
                                  className="justify-self-center"
                                  content="Delete Column"
                                  color="danger"
                                  size="sm"
                                  showArrow
                                >
                                  <Button
                                    onPress={() => handleDeleteColumn(colIndex)}
                                    isIconOnly
                                    radius="full"
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                  >
                                    <Icon icon="solar:close-circle-bold-duotone" />
                                  </Button>
                                </Tooltip>
                              )}
                              <Tooltip
                                content="Add Column (Before)"
                                size="sm"
                                color="primary"
                                showArrow
                              >
                                <Button
                                  onPress={() => handleAddColumn(colIndex)}
                                  isIconOnly
                                  radius="full"
                                  color="primary"
                                  variant="light"
                                  size="sm"
                                >
                                  <Icon icon="tabler:circle-plus-filled" />
                                </Button>
                              </Tooltip>
                            </div>
                          </th>
                        ))}
                        <th>
                          <Tooltip
                            size="sm"
                            placement="left"
                            content="Add Column (End)"
                            color="primary"
                            showArrow
                          >
                            <Button
                              size="sm"
                              type="button"
                              isIconOnly
                              radius="full"
                              color="primary"
                              variant="light"
                              onPress={() => handleAddColumn(numCols)}
                            >
                              <Icon icon="tabler:circle-plus-filled" />
                            </Button>
                          </Tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {Array.from({ length: numRows }).map((_, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="group w-full space-x-1 border-y-0"
                        >
                          {Array.from({ length: numCols }).map(
                            (_, colIndex) => (
                              <td
                                key={colIndex}
                                onMouseEnter={() =>
                                  setHoveredColIndex(colIndex)
                                }
                                onMouseLeave={() => setHoveredColIndex(null)}
                                className="max-w-48 whitespace-nowrap py-0"
                              >
                                <ReactQuill
                                  theme="snow"
                                  value={
                                    formik.values.service.data[
                                      `cell-${rowIndex}-${colIndex}`
                                    ] || ''
                                  }
                                  onChange={(value) =>
                                    handleInputChange(
                                      `cell-${rowIndex}-${colIndex}`,
                                      value
                                    )
                                  }
                                  formats={[
                                    'bold',
                                    'italic',
                                    'underline',
                                    'strike',
                                  ]}
                                  className={cn('w-full overflow-hidden', {
                                    'rounded-tl-xl':
                                      rowIndex === 0 && colIndex === 0,
                                    'rounded-tr-xl':
                                      rowIndex === 0 &&
                                      colIndex === numCols - 1,
                                    'rounded-bl-xl':
                                      rowIndex === numRows - 1 &&
                                      colIndex === 0,
                                    'rounded-br-xl':
                                      rowIndex === numRows - 1 &&
                                      colIndex === numCols - 1,
                                  })}
                                />
                              </td>
                            )
                          )}
                          <td className="w-[40px] opacity-0 transition-all group-hover:opacity-100">
                            <div className="flex flex-col-reverse items-center gap-1">
                              {numRows > 1 && (
                                <Tooltip
                                  content="Delete Row"
                                  placement="left"
                                  color="danger"
                                  size="sm"
                                  showArrow
                                >
                                  <Button
                                    onPress={() => handleDeleteRow(rowIndex)}
                                    isIconOnly
                                    radius="full"
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                  >
                                    <Icon icon="solar:close-circle-bold-duotone" />
                                  </Button>
                                </Tooltip>
                              )}
                              <Tooltip
                                content="Add Row (Above)"
                                placement="left"
                                color="warning"
                                size="sm"
                                showArrow
                              >
                                <Button
                                  onPress={() => handleAddRow(rowIndex)}
                                  isIconOnly
                                  radius="full"
                                  color="warning"
                                  variant="light"
                                  size="sm"
                                >
                                  <Icon icon="tabler:circle-plus-filled" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end">
                <Tooltip
                  size="sm"
                  placement="left"
                  content="Add Row (End)"
                  color="warning"
                  showArrow
                >
                  <Button
                    size="sm"
                    type="button"
                    isIconOnly
                    radius="full"
                    color="warning"
                    variant="light"
                    onPress={() => handleAddRow(numRows)}
                  >
                    <Icon icon="tabler:circle-plus-filled" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="mt-8 flex items-center justify-end">
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
    </>
  );
}
