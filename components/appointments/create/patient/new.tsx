import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  DatePicker,
  Textarea,
  Divider,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useFormikContext } from 'formik';

import { Genders } from '@/lib/options';
import { CreateAppointmentFormValues } from '../types';
import { $FixMe } from '@/types';
import { NewPatientFormValues } from '@/types/patient';
import { useCreatePatient } from '@/services/patient';

// Extended validation schema for new patient creation
const newPatientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(50, 'Name is too long'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  gender: Yup.string().required('Gender is required'),
});

export default function CreateAppointmentPatientNew() {
  const { setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const { mutateAsync } = useCreatePatient();

  const formik = useFormik<NewPatientFormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      address: '',
      city: '',
      state: '',
      country: 'IN', // Default to India
      zipcode: '',
    },
    validationSchema: newPatientValidationSchema,
    onSubmit: async (values) => {
      try {
        const res = await mutateAsync(values);
        if (res.success) {
          setFieldValue('appointment.patient', res.data.uid);
        }

        setFieldValue('meta.createNewPatient', false);

        // Reset form
        formik.resetForm();
      } catch (error) {
        console.error('Error creating patient:', error);
      }
    },
  });

  const handleClose = () => {
    setFieldValue('meta.createNewPatient', false);
    formik.resetForm();
  };

  return (
    <Modal isOpen backdrop="blur" scrollBehavior="inside" size="2xl" onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary-50 p-2">
              <Icon icon="solar:user-plus-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-large font-semibold">Create New Patient</h2>
              <p className="text-small font-normal text-default-400">
                Add a new patient to the system
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody as={ScrollShadow} className="gap-0">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-medium font-medium text-default-foreground">
                  Personal Information
                </h3>
                <span className="text-small text-default-400">
                  Fields with <span className="text-danger">*</span> are required
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Enter patient's full name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                  errorMessage={formik.touched.name && formik.errors.name}
                  startContent={
                    <Icon icon="solar:user-bold" className="h-4 w-4 text-default-400" />
                  }
                  isRequired
                />

                <Input
                  label="Email Address"
                  placeholder="Enter email address"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                  errorMessage={formik.touched.email && formik.errors.email}
                  startContent={
                    <Icon icon="solar:letter-bold" className="h-4 w-4 text-default-400" />
                  }
                  isRequired
                />

                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phone && !!formik.errors.phone}
                  errorMessage={formik.touched.phone && formik.errors.phone}
                  startContent={
                    <Icon icon="solar:phone-bold" className="h-4 w-4 text-default-400" />
                  }
                  isRequired
                />

                <Select
                  isRequired
                  disallowEmptySelection
                  label="Gender"
                  placeholder="Select gender"
                  name="gender"
                  selectedKeys={formik.values.gender ? [formik.values.gender] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue('gender', value);
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.gender && !!formik.errors.gender}
                  errorMessage={formik.touched.gender && formik.errors.gender}
                  startContent={
                    <Icon
                      icon="solar:users-group-rounded-bold"
                      className="h-4 w-4 text-default-400"
                    />
                  }
                >
                  {Genders.map((gender) => (
                    <SelectItem key={gender.value}>{gender.label}</SelectItem>
                  ))}
                </Select>

                <div className="sm:col-span-2">
                  <I18nProvider locale="en-US">
                    <DatePicker
                      label="Date of Birth"
                      placeholder="Select date of birth"
                      // @ts-expect-error - value is not typed
                      value={formik.values.dob ? parseDate(formik.values.dob) : null}
                      onChange={(value) => {
                        const dob = new Date(value as $FixMe).toISOString().split('T')[0];
                        formik.setFieldValue('dob', dob);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.dob && !!formik.errors.dob}
                      errorMessage={formik.touched.dob && formik.errors.dob}
                      startContent={
                        <Icon icon="solar:calendar-bold" className="h-4 w-4 text-default-400" />
                      }
                      maxValue={today(getLocalTimeZone())}
                      showMonthAndYearPickers
                    />
                  </I18nProvider>
                </div>
              </div>
            </div>

            <Divider />

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-medium font-medium text-default-foreground">
                Address Information
              </h3>
              <div className="space-y-4">
                <Textarea
                  label="Address"
                  placeholder="Enter full address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.address && !!formik.errors.address}
                  errorMessage={formik.touched.address && formik.errors.address}
                  startContent={
                    <Icon icon="solar:map-point-bold" className="h-4 w-4 text-default-400" />
                  }
                  minRows={2}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="City"
                    placeholder="Enter city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startContent={
                      <Icon icon="solar:buildings-bold" className="h-4 w-4 text-default-400" />
                    }
                  />

                  <Input
                    label="State"
                    placeholder="Enter state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startContent={
                      <Icon
                        icon="solar:map-point-line-duotone"
                        className="h-4 w-4 text-default-400"
                      />
                    }
                  />

                  <Input
                    label="Country"
                    placeholder="Enter country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    startContent={
                      <Icon icon="solar:flag-bold" className="h-4 w-4 text-default-400" />
                    }
                  />
                </div>

                <Input
                  label="Zip Code"
                  placeholder="Enter zip code"
                  name="zipcode"
                  value={formik.values.zipcode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  startContent={
                    <Icon icon="solar:postcard-bold" className="h-4 w-4 text-default-400" />
                  }
                  className="max-w-xs"
                />
              </div>
            </div>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onPress={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
            startContent={<Icon icon="solar:user-plus-bold" className="h-4 w-4" />}
            isDisabled={!formik.isValid || formik.isSubmitting}
          >
            Create Patient
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
