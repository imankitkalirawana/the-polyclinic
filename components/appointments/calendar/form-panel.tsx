'use client';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';

import { UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { PhoneInput } from '../phone-input';

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { User } from '@/lib/interface';
import { getUserWithUID } from '@/functions/server-actions';

type Guest = {
  email: string;
};

export function FormPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  const formik = useFormik({
    initialValues: {
      user: {} as User,
      guests: [] as Guest[],
      notes: ''
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  React.useEffect(() => {
    const fetchData = async () => {
      if (!uid) return;
      const user = await getUserWithUID(parseInt(uid));
      formik.setFieldValue('user', user);
    };
    fetchData();
  }, [uid]);

  const addGuest = () => {
    formik.setFieldValue('guests', [...formik.values.guests, { email: '' }]);
  };

  const removeGuest = (index: number) => {
    formik.setFieldValue(
      'guests',
      formik.values.guests.filter((_, i) => i !== index)
    );
  };

  const handleChange = (index: number, email: string) => {
    formik.setFieldValue(
      'guests',
      formik.values.guests.map((guest, i) => (i === index ? { email } : guest))
    );
  };

  const hasGuests = formik.values.guests.length > 0;

  return (
    <form className="flex w-[360px] flex-col gap-5">
      <div className="flex flex-col space-y-1.5">
        <Input
          label="Your Name"
          isRequired
          name="user.name"
          value={formik.values.user.name}
          onChange={formik.handleChange}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Input
          name="user.email"
          label="Email Address"
          isRequired
          type="email"
          value={formik.values.user.email}
          onChange={formik.handleChange}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Input
          type="tel"
          name="user.phone"
          label="Phone Number"
          isRequired
          defaultValue=""
          value={formik.values.user.phone}
          onChange={formik.handleChange}
        />
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
      {hasGuests && (
        <>
          <Label htmlFor="email">Add guests</Label>
          <div className="flex flex-col gap-1">
            {formik.values.guests.map((guest, index) => (
              <div key={index} className="relative flex items-center space-x-2">
                <Input
                  id="guest"
                  type="email"
                  placeholder="Email"
                  value={guest.email}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <X
                      className="absolute right-2 top-1/2 size-4 -translate-y-1/2 transform cursor-pointer"
                      onClick={() => removeGuest(index)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Remove email</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </>
      )}
      <Button
        type="button"
        variant="light"
        onClick={() => addGuest()}
        className="w-fit"
      >
        <UserPlus className="mr-2 size-4" />
        Add guests
      </Button>
      <p className="text-gray-11 my-4 text-xs">
        By proceeding, you agree to our{' '}
        <span className="text-gray-12">Terms</span> and{' '}
        <span className="text-gray-12">Privacy Policy</span>.
      </p>
      <div className="flex justify-end gap-2">
        <Button
          variant="light"
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
        <Button color="primary" type="button">
          Continue
        </Button>
      </div>
    </form>
  );
}
