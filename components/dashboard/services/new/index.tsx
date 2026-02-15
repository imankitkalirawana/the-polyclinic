'use client';

import { useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button, cn, Input, Select, SelectItem, SelectItemProps, Tooltip } from '@heroui/react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';

import Editor from '@/components/ui/text-editor/editor';
import { ServiceStatuses, ServiceTypes } from '@/libs/interface';
import { serviceValidationSchema } from '@/libs/validation';
import { useCreateService } from '@/services/client/service/service.query';
import { ServiceType } from '@/services/client/service/service.types';

export default function NewService() {
  const router = useRouter();
  const createService = useCreateService();

  const formik = useFormik({
    initialValues: {
      fields: {
        'cell-0-0': '',
        'cell-0-1': '',
      } as ServiceType['fields'],
    } as ServiceType,

    validationSchema: serviceValidationSchema,
    onSubmit: async (values) => {
      await createService.mutateAsync(values).then(() => {
        router.push(`/dashboard/services/${values.uniqueId}`);
      });
    },
  });

  const [numRows, setNumRows] = useState(
    Math.max(...Object.keys(formik.values.fields).map((key) => parseInt(key.split('-')[1]))) + 1
  );

  const [numCols, setNumCols] = useState(
    Math.max(...Object.keys(formik.values.fields).map((key) => parseInt(key.split('-')[2]))) + 1
  );

  const handleInputChange = (key: string, value: string) => {
    formik.setFieldValue(`fields.${key}`, value);
  };

  const handleAddRow = (rowIndex: number) => {
    const newValues = { ...formik.values.fields };
    for (let row = numRows; row > rowIndex; row--) {
      for (let col = 0; col < numCols; col++) {
        newValues[`cell-${row}-${col}`] = newValues[`cell-${row - 1}-${col}`];
      }
    }

    for (let col = 0; col < numCols; col++) {
      newValues[`cell-${rowIndex}-${col}`] = '';
    }

    setNumRows(numRows + 1);
    formik.setFieldValue('fields', newValues);
  };

  const handleAddColumn = (colIndex: number) => {
    const newValues = { ...formik.values.fields };
    for (let row = 0; row < numRows; row++) {
      for (let col = numCols; col > colIndex; col--) {
        newValues[`cell-${row}-${col}`] = newValues[`cell-${row}-${col - 1}`];
      }
    }

    for (let row = 0; row < numRows; row++) {
      newValues[`cell-${row}-${colIndex}`] = '';
    }

    setNumCols(numCols + 1);
    formik.setFieldValue('fields', newValues);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newValues = { ...formik.values.fields };
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
    formik.setFieldValue('fields', newValues);
  };

  const handleDeleteColumn = (colIndex: number) => {
    const newValues = { ...formik.values.fields };
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
    formik.setFieldValue('fields', newValues);
  };

  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

  return (
    <div className="pb-12">
      <div className="mt-4 px-4 sm:px-0">
        <h3 className="leading-large text-medium font-semibold text-gray-900">Add New Service</h3>
        <p className="leading-medium text-small max-w-2xl text-gray-500">
          Fill in the form below to add a new service.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Unique ID"
              name="uniqueId"
              value={formik.values.uniqueId}
              onChange={formik.handleChange}
              onBlur={() => {
                // TODO: Implement unique ID verification
              }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">#</span>
                </div>
              }
              isInvalid={!!formik.errors.uniqueId}
              errorMessage={formik.errors.uniqueId}
            />
          </div>
          <div>
            <Input
              label="Name"
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue('name', e.target.value)}
              isInvalid={!!(formik.touched.name && formik.errors.name)}
              errorMessage={formik.touched.name && formik.errors.name}
            />
          </div>
          <div>
            <Input
              label="Price"
              value={formik.values.price !== undefined ? String(formik.values.price) : ''}
              min={1}
              type="number"
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  formik.setFieldValue('price', inputValue ? Number(inputValue) : 0);
                }
              }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₹</span>
                </div>
              }
              isInvalid={!!(formik.touched.price && formik.errors.price)}
              errorMessage={formik.touched.price && formik.errors.price}
            />
          </div>
          <div>
            <Input
              label="Duration"
              type="number"
              value={formik.values.duration !== undefined ? String(formik.values.duration) : ''}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  formik.setFieldValue('duration', inputValue ? Number(inputValue) : 0);
                }
              }}
              min={1}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">min(s)</span>
                </div>
              }
              isInvalid={!!(formik.touched.duration && formik.errors.duration)}
              errorMessage={formik.touched.duration && formik.errors.duration}
            />
          </div>

          <div className="col-span-full">
            <Editor
              content={formik.values.description}
              onChange={(html) => formik.setFieldValue('description', html)}
            />
          </div>
          <div className="col-span-full">
            <Editor
              content={formik.values.summary}
              onChange={(html) => formik.setFieldValue('summary', html)}
            />
          </div>

          <div>
            <Select
              aria-label="Type"
              label="Type"
              name="type"
              selectedKeys={[formik.values.type]}
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
              name="status"
              selectedKeys={[formik.values.status]}
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.status && formik.errors.status)}
              errorMessage={formik.touched.status && formik.errors.status}
            >
              {ServiceStatuses.map((status) => (
                <SelectItem
                  color={status.color as SelectItemProps['color']}
                  key={status.value}
                  className="capitalize"
                >
                  {status.value}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="col-span-full mt-4">
            <div className="flex min-h-24 min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top">
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
                            className={cn('flex flex-row-reverse justify-between opacity-0', {
                              'opacity-100': hoveredColIndex === colIndex,
                            })}
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
                  <tbody>
                    {Array.from({ length: numRows }).map((_, rowIndex) => (
                      <tr key={rowIndex} className="group w-full space-x-1 border-y-0">
                        {Array.from({ length: numCols }).map((_, colIndex) => (
                          <td
                            key={colIndex}
                            onMouseEnter={() => setHoveredColIndex(colIndex)}
                            onMouseLeave={() => setHoveredColIndex(null)}
                            className="max-w-48 py-0 whitespace-nowrap"
                          >
                            <Editor
                              content={formik.values.fields[`cell-${rowIndex}-${colIndex}`] || ''}
                              onChange={(html) =>
                                handleInputChange(`cell-${rowIndex}-${colIndex}`, html)
                              }
                            />
                          </td>
                        ))}
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
              <Tooltip size="sm" placement="left" content="Add Row (End)" color="warning" showArrow>
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
        <div className="mt-8 flex items-center justify-end">
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
        </div>
      </form>
    </div>
  );
}
