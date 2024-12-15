'use client';

import { UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { PhoneInput } from '../phone-input';

import * as React from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  ScrollShadow,
  Textarea,
  Tooltip
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import axios from 'axios';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import { GuestType } from '@/models/Appointment';

interface FormPanelProps {
  user: UserType;
  date: string;
  isLoading?: boolean;
  doctors: DoctorType[];
}

export function FormPanel({ user, date, isLoading }: FormPanelProps) {
  const router = useRouter();
  const [doctors, setDoctors] = React.useState<DoctorType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      await axios.get('/api/doctors').then((res) => {
        setDoctors(res.data);
      });
    };
    fetchData();
  }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name,
      uid: user?.uid,
      phone: user?.phone,
      email: user?.email,
      guests: [] as GuestType[],
      notes: '',
      date: date,
      doctor: ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Name is required')
        .min(3, 'Name is too short')
        .max(50, 'Name is too long'),
      phone: Yup.string().required('Phone number is required')
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('/api/appointments', values).then(() => {
          toast.success('Appointment created successfully');
          router.push('/appointments');
        });
      } catch (error) {
        toast.error('Failed to create appointment');
      }
    }
  });

  const addGuest = () => {
    formik.setFieldValue('guests', [...formik.values?.guests, { email: '' }]);
  };

  const removeGuest = (index: number) => {
    formik.setFieldValue(
      'guests',
      formik.values.guests.filter((_, i) => i !== index)
    );
  };

  const hasGuests = formik.values.guests.length > 0;

  return (
    <form className="flex w-[360px] flex-col gap-5">
      <div className="flex flex-col space-y-1.5">
        <Input
          label="Your Name"
          isRequired
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          isInvalid={formik.touched.name && formik.errors.name ? true : false}
          errorMessage={formik.touched.name && formik.errors.name}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Input
          type="tel"
          name="phone"
          label="Phone Number"
          isRequired
          defaultValue=""
          value={formik.values.phone}
          onChange={formik.handleChange}
          isInvalid={
            formik.touched?.phone && formik.errors?.phone ? true : false
          }
          errorMessage={formik.touched?.phone && formik.errors?.phone}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Input
          name="email"
          label="Email Address"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Autocomplete
          label="Select Doctor"
          name="doctor"
          selectedKey={formik.values.doctor}
          onSelectionChange={(value) => {
            formik.setFieldValue('doctor', value);
          }}
        >
          {doctors.map((doctor) => (
            <AutocompleteItem key={doctor.uid}>{doctor.name}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Textarea
          label="Additional notes"
          placeholder="Please share any additional information that will help us prepare for your appointment."
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
        />
      </div>

      <Card className="rounded-none border-none bg-transparent shadow-none">
        <CardHeader>Guest Information (If any)</CardHeader>
        {hasGuests && (
          <CardBody>
            <ScrollShadow className="no-scrollbar flex max-h-72 flex-col divide-y-1 divide-default-300 border-t border-default-300 p-1">
              {formik.values.guests.map((guest, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-start gap-2 py-2"
                >
                  <div className="flex w-full justify-between">
                    <span>#{index + 1}</span>
                    <Tooltip content="Remove Guest">
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removeGuest(index)}
                      >
                        <Icon icon="tabler:x" />
                      </Button>
                    </Tooltip>
                  </div>
                  <Input
                    label="Guest Name"
                    value={guest.name}
                    name={`guests[${index}].name`}
                    onChange={formik.handleChange}
                  />
                  <Input
                    label="Guest Phone"
                    value={guest.phone}
                    name={`guests[${index}].phone`}
                    onChange={formik.handleChange}
                  />
                  <Input
                    label="Relation with Patient"
                    value={guest?.connection}
                    name={`guests[${index}].connection`}
                    onChange={formik.handleChange}
                  />
                </div>
              ))}
            </ScrollShadow>
          </CardBody>
        )}

        <CardFooter>
          <Button
            type="button"
            variant="light"
            onPress={() => addGuest()}
            className="w-fit"
          >
            <UserPlus className="mr-2 size-4" />
            Add guests
          </Button>
        </CardFooter>
      </Card>

      <p className="text-gray-11 my-4 text-xs">
        By proceeding, you agree to our{' '}
        <span className="text-gray-12">Terms</span> and{' '}
        <span className="text-gray-12">Privacy Policy</span>.
      </p>
      <div className="flex justify-end gap-2">
        <Button
          variant="light"
          onPress={() => {
            router.back();
          }}
          fullWidth
        >
          Back
        </Button>
        <Button
          onPress={() => formik.handleSubmit()}
          isLoading={formik.isSubmitting}
          color="primary"
          fullWidth
          type="button"
          isDisabled={isLoading}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
