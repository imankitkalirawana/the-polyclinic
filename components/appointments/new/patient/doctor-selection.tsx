'use client';
import {
  Button,
  Card,
  CardBody,
  ScrollShadow,
  Image,
  Input,
  cn
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDoctor } from '@/store/slices/appointment-slice';
import { useQuery } from '@tanstack/react-query';
import { DoctorType } from '@/models/Doctor';
import { getAllDoctors } from '@/functions/server-actions/doctor';
import { useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import NoResults from '@/components/ui/no-results';
import { LoadingUsers } from './loading-user';

export default function DoctorSelection() {
  const dispatch = useDispatch();
  const appointment = useSelector((state: any) => state.appointment);
  const [query, setQuery] = useState('');
  const debounce = useDebounce(query, 500);

  const { data: doctors, isLoading } = useQuery<DoctorType[]>({
    queryKey: ['doctors'],
    queryFn: () => getAllDoctors(),
    enabled: !!appointment.user
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
    appointment.user &&
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
                      'no-scrollbar min-w-80 rounded-xl border border-divider shadow-none',
                      {
                        'border-2 border-primary-400':
                          doctor.uid === appointment.doctor?.uid
                      }
                    )}
                    onPress={() => {
                      dispatch(
                        setSelectedDoctor({
                          ...doctor,
                          createdAt: '',
                          updatedAt: ''
                        })
                      );
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
                        <h2 className="text-center text-lg font-semibold">
                          {doctor.name}
                        </h2>
                        <p className="text-sm font-light text-default-500">
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
                className="w-full max-w-64 xs:w-fit"
                endContent={<Icon icon="tabler:chevron-right" />}
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
