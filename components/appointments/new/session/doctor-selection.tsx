'use client';
import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  cn,
  Image,
  Input,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQuery } from '@tanstack/react-query';

import { useForm } from './context';
import { LoadingUsers } from './loading-user';

import NoResults from '@/components/ui/no-results';
import { getAllDoctors } from '@/functions/server-actions/doctor';
import { DoctorType } from '@/types/doctor';
import { useDebounce } from 'react-haiku';

export default function DoctorSelection() {
  const { formik } = useForm();
  const [query, setQuery] = useState('');
  const debounce = useDebounce(query, 500);

  const { data: doctors, isLoading } = useQuery<DoctorType[]>({
    queryKey: ['doctors'],
    queryFn: () => getAllDoctors(),
    enabled: !!formik.values.patient?.uid,
  });

  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter((doctor) => {
      if (query === '') return true;
      return (
        doctor?.name?.toLowerCase().includes(query.toLowerCase()) ||
        doctor?.email?.toLowerCase().includes(query.toLowerCase()) ||
        doctor?.phone?.toLowerCase().includes(query.toLowerCase()) ||
        doctor.uid.toString().includes(query.toLowerCase())
      );
    });
  }, [debounce, doctors]);

  return (
    formik.values.doctor &&
    (isLoading ? (
      <div className="flex gap-4 overflow-hidden">
        <LoadingUsers />
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        <div className="xs:max-w-sm">
          <Input
            placeholder="Search for a doctor"
            // icon={<Icon icon="tabler:search" />}
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {!isLoading && filteredDoctors.length < 1 ? (
          <div className="flex justify-center">
            <NoResults message="No Doctors Found" />
          </div>
        ) : (
          <>
            <ScrollShadow orientation="horizontal" className="mt-8 flex gap-4">
              {filteredDoctors
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((doctor) => (
                  <Card
                    isPressable
                    key={doctor.uid}
                    className={cn(
                      'no-scrollbar min-w-64 rounded-medium border-small border-divider shadow-none sm:min-w-72',
                      {
                        'border-medium border-primary-400':
                          doctor.uid === formik.values.doctor?.uid,
                      }
                    )}
                    onPress={() => {
                      if (formik.values.doctor?.uid === doctor.uid) {
                        formik.setFieldValue('doctor', {});
                      } else {
                        formik.setFieldValue('doctor', doctor);
                      }
                    }}
                  >
                    <CardBody className="items-center gap-4 p-8">
                      <div>
                        <Image
                          src="/assets/placeholder-avatar.jpeg"
                          alt="User"
                          width={80}
                          height={80}
                          className="rounded-full"
                          isBlurred
                        />
                      </div>
                      <div>
                        <h2 className="text-center text-large font-semibold">
                          {doctor.name}
                        </h2>
                        <p className="text-small font-light text-default-500">
                          {doctor.email}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </ScrollShadow>
            <div className="mt-4">
              <Button
                color="primary"
                radius="lg"
                className="w-full xs:w-fit"
                endContent={<Icon icon="tabler:chevron-right" />}
                onPress={() => {
                  if (!formik.values.doctor?.uid) {
                    formik.setFieldValue('doctor', {
                      uid: 0,
                    });
                  }
                  formik.setFieldValue('step', 4);
                }}
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    ))
  );
}

export function DoctorSelectionTitle({ doctor }: { doctor: DoctorType }) {
  return doctor.uid ? (
    <h3 className="text-2xl font-semibold">
      {doctor?.uid === 0 ? 'No Doctor Selected' : doctor?.name}
    </h3>
  ) : (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Choose a doctor (Optional)</h3>
    </div>
  );
}
