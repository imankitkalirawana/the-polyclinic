'use client';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import NoResults from '@/components/ui/no-results';
import { useDepartmentByDid } from '@/services/client/department';
import { DoctorType } from '@/services/client/doctor/doctor.types';
import { Avatar, AvatarGroup, Button, Card, Image } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function Department({ did }: { did: string }) {
  const { data: department, isLoading } = useDepartmentByDid(did);

  if (isLoading) {
    return <MinimalPlaceholder message="Loading department..." />;
  }

  if (!department) {
    return <NoResults message="Department not found" />;
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div>
        <Image
          alt="department"
          src={
            department.image ||
            'https://thepolyclinic.s3.ap-south-1.amazonaws.com/clients/departments/default.jpg'
          }
          className="max-h-[300px] w-full object-cover"
          classNames={{
            wrapper: 'w-full max-h-[300px] max-w-full!',
          }}
        />
      </div>
      <div className="space-y-8 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{department.name}</h2>
            <Button isIconOnly variant="flat" size="sm" radius="full">
              <Icon icon="solar:alt-arrow-down-linear" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-default-500 text-small">Team: </span>
            <AvatarGroup
              isBordered={false}
              max={3}
              size="sm"
              renderCount={(count) => (
                <p className="text-foreground text-small ms-2 font-medium">+{count} others</p>
              )}
              total={(department?.team?.length || 0) - 3}
            >
              {department.team?.map((doctor) => <Avatar key={doctor.id} src={doctor.image} />)}
            </AvatarGroup>
          </div>
        </div>
        <div>
          <h3 className="text-default-300 text-2xl font-semibold">About</h3>
          <p className="text-default-500 leading-tight">{department.description}</p>
        </div>
        <div>
          <h3 className="text-default-300 text-2xl font-semibold">Our Treatments</h3>
          <ul className="list-disc space-y-4 pl-6">
            {department?.features?.map((feature) => (
              <li key={feature.name}>
                <h4 className="text-default-500 text-large font-medium">{feature.name}</h4>
                <p className="text-default-400 text-small leading-tight">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 pb-4">
          <h3 className="text-default-300 text-2xl font-semibold">Our Team</h3>
          <div className="flex flex-wrap gap-4">
            {department.team?.map((doctor) => <TeamCard key={doctor.id} doctor={doctor} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  doctor,
}: {
  doctor: Pick<DoctorType, 'id' | 'name' | 'email' | 'phone' | 'image' | 'designation'>;
}) {
  return (
    <Card className="min-w-[200px] items-center p-4">
      <Avatar size="lg" src={doctor.image} />
      <h3 className="text-large font-medium">{doctor.name}</h3>
      <p className="text-default-400 text-small">{doctor.designation}</p>
    </Card>
  );
}
