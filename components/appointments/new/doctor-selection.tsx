'use client';
import { getAllDoctors } from '@/functions/server-actions';
import { humanReadableDate } from '@/lib/utility';
import { DoctorType } from '@/models/Doctor';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input
} from '@nextui-org/react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

export default function DoctorSelection() {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(0));
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [did, setDIDParam] = useQueryState('did');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctors = await getAllDoctors();
        setDoctors(doctors);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex flex-col items-start gap-4">
        {step === 2 && (
          <Button
            fullWidth
            color="primary"
            endContent={<Icon icon={'tabler:arrow-right'} />}
            onPress={() => setStep(step + 1)}
            isDisabled={!did}
          >
            Proceed
          </Button>
        )}
        <h2>Doctors</h2>

        <Input
          placeholder="Search by UID, Name, Email and Phone"
          endContent={
            <Button isIconOnly variant="light">
              <Icon icon="tabler:search" width="24" height="24" />
            </Button>
          }
        />
      </div>
      <div>
        <div className={'flex flex-col gap-2'}>
          <div
            className={
              'no-scrollbar grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 overflow-scroll transition-all'
            }
          >
            {doctors.map((user) => (
              <Card
                isHoverable
                isPressable
                key={user.uid}
                className={cn(
                  'flex flex-row justify-between rounded-2xl border p-3 shadow-none transition-all',
                  {
                    'border-2 border-primary-400': user.uid.toString() === did
                  }
                )}
                onPress={() => {
                  setDIDParam(user.uid.toString());
                }}
              >
                <div className="flex max-w-[75%] flex-col items-start justify-between gap-4 overflow-hidden">
                  <div className="flex flex-col items-start">
                    <h3 className="line-clamp-1">{user.name}</h3>
                    <p
                      title={user.email}
                      className="line-clamp-1 text-sm text-default-500"
                    >
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm text-default-500">
                    <p>{humanReadableDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <Dropdown size="sm" placement="bottom-end">
                    <DropdownTrigger>
                      <Button isIconOnly variant="light" size="sm">
                        <Icon icon="tabler:dots" width="16" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="edit">Edit</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
