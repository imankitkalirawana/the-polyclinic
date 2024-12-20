'use client';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation';
import QuillInput from '@/components/ui/quill-input';
import { AppointmentType } from '@/models/Appointment';
import { DrugType } from '@/models/Drug';
import { cn } from '@/lib/utils';

export default function CompleteAppointment({
  appointment,
  drugs
}: {
  appointment: AppointmentType;
  drugs: DrugType[];
}) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      appointment: {
        aid: appointment.aid,
        name: appointment.name,
        phone: appointment.phone,
        email: appointment.email,
        date: appointment.date,
        type: appointment.type,
        status: appointment.status,
        description: appointment.description,
        instructions: appointment.instructions,
        data: {
          headers: [
            { label: 'Drug', key: 'drug' },
            { label: 'Generic Name', key: 'genericName' },
            { label: 'Frequency', key: 'frequency' },
            { label: 'Duration', key: 'duration' }
          ],
          rows: Array(1).fill({
            drug: '',
            genericName: '',
            frequency: '',
            duration: ''
          }) // Empty rows
        }
      }
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  const handleDrugChange = (rowIndex: number, drugId: number) => {
    const selectedDrug = drugs.find((drug) => drug.did === drugId);
    if (selectedDrug) {
      const updatedRows = [...formik.values.appointment.data.rows];
      updatedRows[rowIndex] = {
        drug: selectedDrug.brandName,
        genericName: selectedDrug.genericName,
        frequency: selectedDrug.frequency,
        duration: ''
      };
      formik.setFieldValue('appointment.data.rows', updatedRows);
    }
  };

  const handleAddRow = (rowIndex: number) => {
    const newRow = {
      drug: '',
      genericName: '',
      frequency: '',
      duration: ''
    };
    const updatedRows = [...formik.values.appointment.data.rows];
    updatedRows.splice(rowIndex + 1, 0, newRow); // Insert new row after the current row
    formik.setFieldValue('appointment.data.rows', updatedRows);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedRows = formik.values.appointment.data.rows.filter(
      (_, index) => index !== rowIndex
    );
    formik.setFieldValue('appointment.data.rows', updatedRows);
  };

  return (
    <>
      <div className="pb-12">
        <div className="mt-4 px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Complete Appointment
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Fill in the form below to complete the appointment.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Input
                label="Unique ID"
                name="appointment.aid"
                value={
                  formik.values.appointment.aid !== undefined
                    ? String(formik.values.appointment.aid)
                    : ''
                }
                onChange={formik.handleChange}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">#</span>
                  </div>
                }
                isInvalid={formik.errors.appointment?.aid ? true : false}
                errorMessage={formik.errors.appointment?.aid}
              />
            </div>
            <div>
              <Input
                label="Name"
                value={formik.values.appointment.name}
                onChange={(e) =>
                  formik.setFieldValue('appointment.name', e.target.value)
                }
                isInvalid={
                  formik.touched.appointment?.name &&
                  formik.errors.appointment?.name
                    ? true
                    : false
                }
                errorMessage={
                  formik.touched.appointment?.name &&
                  formik.errors.appointment?.name
                }
              />
            </div>

            <div className="col-span-full">
              {/* <QuillInput
                label="Description"
                value={formik.values.appointment.description}
                onChange={(value) =>
                  formik.setFieldValue('appointment.description', value)
                }
                description="This information will be displayed on the report before the table."
              /> */}
            </div>
            <div className="col-span-full">
              {/* <QuillInput
                label="Test Information"
                value={formik.values.appointment.instructions}
                onChange={(value) =>
                  formik.setFieldValue('appointment.instructions', value)
                }
                description="This information will be displayed on the report before the table."
              /> */}
            </div>

            <div className="col-span-full mt-4">
              <div className="flex min-h-[6rem] min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top">
                <div className="overflow-x-auto md:w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-y-0">
                        {formik.values.appointment.data.headers.map(
                          (header, index) => (
                            <th
                              className={cn(
                                'bg-default-200 px-4 py-2 text-start',
                                {
                                  'rounded-tl-xl': index === 0,
                                  'rounded-tr-xl':
                                    index ===
                                    formik.values.appointment.data.headers
                                      .length -
                                      1
                                }
                              )}
                              key={index}
                            >
                              {header.label}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.appointment.data.rows.map(
                        (row, rowIndex) => {
                          return (
                            <tr
                              key={rowIndex}
                              className="group w-full space-x-1 border-y-0"
                            >
                              <td className="whitespace-nowrap bg-default-100 px-4 py-2">
                                <Autocomplete
                                  aria-label="Select a drug"
                                  placeholder="Select a drug"
                                  defaultItems={drugs}
                                  onSelectionChange={(value) => {
                                    console.log(value);
                                    handleDrugChange(
                                      rowIndex,
                                      parseInt(value as string)
                                    );
                                  }}
                                >
                                  {(drug) => (
                                    <AutocompleteItem
                                      key={drug.did}
                                      value={drug.did.toString()}
                                    >
                                      {drug.brandName}
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                              </td>
                              <td className="whitespace-nowrap bg-default-100 px-4 py-2">
                                {row.genericName || '-'}
                              </td>
                              <td className="whitespace-nowrap bg-default-100 px-4 py-2">
                                {row.frequency || '-'}
                              </td>
                              <td className="whitespace-nowrap bg-default-100 px-4 py-2">
                                <Input
                                  placeholder="Enter duration"
                                  value={row.duration}
                                  onChange={(e) => {
                                    const updatedRows = [
                                      ...formik.values.appointment.data.rows
                                    ];
                                    updatedRows[rowIndex].duration =
                                      e.target.value;
                                    formik.setFieldValue(
                                      'appointment.data.rows',
                                      updatedRows
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <Button
                                  isIconOnly
                                  radius="full"
                                  size="sm"
                                  variant="light"
                                  color="primary"
                                  onPress={() => handleAddRow(rowIndex)}
                                >
                                  <Icon icon="tabler:plus" />
                                </Button>
                                <Button
                                  isIconOnly
                                  radius="full"
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => handleDeleteRow(rowIndex)}
                                >
                                  <Icon icon="tabler:x" />
                                </Button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
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
                  icon={'tabler:check'}
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
    </>
  );
}
