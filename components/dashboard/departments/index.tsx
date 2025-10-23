'use client';

import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Image,
  AvatarGroup,
  Avatar,
  useDisclosure,
} from '@heroui/react';
import { useAllDepartments } from '@/services/client/department/query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { Icon } from '@iconify/react/dist/iconify.js';
import NewDepartment from './new';

export default function Departments() {
  const { data: departments, isLoading } = useAllDepartments();
  const newDepartment = useDisclosure();

  if (isLoading) {
    return <MinimalPlaceholder message="Loading departments..." />;
  }

  return (
    <>
      <div>
        <div className="flex w-full justify-end">
          <Button color="primary" size="sm" onPress={newDepartment.onOpen}>
            <Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4" />
            New Department
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {departments?.map((department) => (
            <Card key={department.did} isFooterBlurred className="h-[300px] w-full">
              <CardHeader className="absolute top-1 z-10 flex-col items-start">
                <AvatarGroup
                  isBordered={false}
                  max={3}
                  size="sm"
                  renderCount={(count) => (
                    <p className="ms-2 font-medium text-foreground text-small">+{count} others</p>
                  )}
                  total={10}
                >
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                </AvatarGroup>
              </CardHeader>
              <Image
                removeWrapper
                alt={department.name}
                className="z-0 h-full w-full object-cover"
                // TODO: Add default image
                src={
                  department.image ||
                  'https://thepolyclinic.s3.ap-south-1.amazonaws.com/clients/departments/default.jpg'
                }
              />
              <CardFooter className="absolute bottom-0 z-10 justify-between border-t-1 border-divider bg-background/40">
                <div className="flex flex-col">
                  <p className="font-semibold text-default-foreground text-small">
                    {department.name}
                  </p>
                  <p className="line-clamp-2 text-default-500 text-tiny">
                    {department.description}
                  </p>
                </div>
                <div>
                  <Button radius="full" size="sm" color="primary">
                    See Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {newDepartment.isOpen && <NewDepartment onClose={newDepartment.onClose} />}
    </>
  );
}
