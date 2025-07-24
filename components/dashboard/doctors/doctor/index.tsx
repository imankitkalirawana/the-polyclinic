'use client';

import Loading from '@/app/loading';
import { CellRenderer } from '@/components/ui/cell-renderer';
import { castData } from '@/lib/utils';
import { useDoctor } from '@/services/doctor';
import { DoctorType } from '@/types/doctor';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Link,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Appointments from './appointments';
import AppointmentSlots from './appointment-slots';

type ListItem = {
  label: string;
  value: keyof Pick<
    DoctorType,
    | 'email'
    | 'phone'
    | 'gender'
    | 'specialization'
    | 'department'
    | 'designation'
    | 'experience'
    | 'education'
    | 'biography'
    | 'shortbio'
  >;
  icon: string;
  classNames?: {
    icon?: string;
  };
};

const listItems: ListItem[] = [
  {
    label: 'Email',
    value: 'email',
    icon: 'solar:letter-bold-duotone',
    classNames: {
      icon: 'bg-violet-100 text-violet-500',
    },
  },
  {
    label: 'Phone',
    value: 'phone',
    icon: 'solar:phone-bold-duotone',
    classNames: {
      icon: 'bg-blue-100 text-blue-500',
    },
  },
  {
    label: 'Gender',
    value: 'gender',
    icon: 'solar:women-bold-duotone',
    classNames: {
      icon: 'bg-pink-100 text-pink-500',
    },
  },
  {
    label: 'Specialization',
    value: 'specialization',
    icon: 'solar:stethoscope-bold-duotone',
    classNames: {
      icon: 'bg-rose-100 text-rose-500',
    },
  },
  {
    label: 'Department',
    value: 'department',
    icon: 'solar:buildings-bold-duotone',
    classNames: {
      icon: 'bg-emerald-100 text-emerald-500',
    },
  },
  {
    label: 'Experience',
    value: 'experience',
    icon: 'solar:suitcase-tag-bold-duotone',
    classNames: {
      icon: 'bg-amber-100 text-amber-500',
    },
  },
  {
    label: 'Education',
    value: 'education',
    icon: 'solar:book-bookmark-bold-duotone',
    classNames: {
      icon: 'bg-indigo-100 text-indigo-500',
    },
  },
  {
    label: 'Short Bio',
    value: 'shortbio',
    icon: 'solar:book-bold-duotone',
    classNames: {
      icon: 'bg-orange-100 text-orange-500',
    },
  },
  {
    label: 'Biography',
    value: 'biography',
    icon: 'solar:book-bookmark-bold-duotone',
    classNames: {
      icon: 'bg-indigo-100 text-indigo-500',
    },
  },
];

export default function DashboardDoctor({ uid }: { uid: number }) {
  const { data, isError, isLoading } = useDoctor(uid);

  const doctor = castData<DoctorType>(data);

  if (isError) {
    return <p>Error fetching doctor data</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!doctor) {
    return <p>Doctor not found</p>;
  }

  return (
    <div className="flex h-full gap-4">
      <Card className="flex-1 gap-4 p-4">
        {/* image and name */}
        <div className="flex gap-4">
          <div>
            <Image
              isBlurred
              width={200}
              height={200}
              alt="doctor"
              src="/assets/placeholders/doctor-male.png"
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <Chip color="success" size="sm" variant="flat">
                  Available
                </Chip>
                <Button isIconOnly radius="full" variant="flat">
                  <Icon icon="solar:pen-2-linear" width={18} />
                </Button>
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                  <h2 className="text-xl font-medium">{doctor.name}</h2>
                  <p className="text-sm text-default-500">
                    {doctor.specialization ||
                      doctor.department ||
                      doctor.department}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="flat" color="primary">
                Book Appointment
              </Button>
              <Button
                isIconOnly
                variant="bordered"
                radius="full"
                as={Link}
                href={`tel:${doctor.phone}`}
                isDisabled={!doctor.phone}
              >
                <Icon icon="solar:phone-rounded-outline" width={18} />
              </Button>
              <Button isIconOnly variant="bordered" radius="full">
                <Icon icon="solar:chat-line-linear" width={18} />
              </Button>
            </div>
          </div>
        </div>
        <ScrollShadow className="flex flex-col gap-2 overflow-auto py-2 pr-2">
          {listItems.map((item) => (
            <CellRenderer
              key={item.label}
              label={item.label}
              value={doctor[item.value] || '-'}
              icon={item.icon}
              direction="horizontal"
              classNames={item.classNames}
            />
          ))}
        </ScrollShadow>
      </Card>
      <div className="grid flex-1 grid-cols-3 grid-rows-4 gap-2">
        <Card className="justify-between p-4">
          <h3 className="text-lg font-medium">Patients</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-small bg-blue-100 p-1 text-blue-500">
                <Icon
                  icon="solar:users-group-two-rounded-bold-duotone"
                  width={32}
                />
              </div>
              <p className="text-2xl font-medium text-default-500">100</p>
            </div>
            <p className="text-tiny text-default-500">
              <span className="text-success">3.5%</span> Have increased from
              yesterday
            </p>
          </div>
        </Card>
        <Card className="justify-between p-4">
          <h3 className="text-lg font-medium">Appointments</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-small bg-purple-100 p-1 text-purple-500">
                <Icon icon="solar:calendar-date-bold-duotone" width={32} />
              </div>
              <p className="text-2xl font-medium text-default-500">100</p>
            </div>
            <p className="text-tiny text-default-500">
              <span className="text-success">1.5%</span> Have increased from
              yesterday
            </p>
          </div>
        </Card>
        <Card className="justify-between p-4">
          <h3 className="text-lg font-medium">Reviews</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-small bg-amber-100 p-1 text-amber-500">
                <Icon icon="solar:star-bold-duotone" width={32} />
              </div>
              <p className="text-2xl font-medium text-default-500">
                4.5<span className="text-base text-default-400">/5.0</span>
              </p>
            </div>
            <p className="text-tiny text-default-500">
              Based on 120 reviews from patients.
            </p>
          </div>
        </Card>
        <Appointments />
        <AppointmentSlots uid={uid} />
      </div>
    </div>
  );
}
