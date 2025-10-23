'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Image,
  AvatarGroup,
  Avatar,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { useAllDepartments, useDeleteDepartment } from '@/services/client/department/query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { Icon } from '@iconify/react/dist/iconify.js';
import NewDepartment from './new-edit';
import { DepartmentType } from '@/services/client/department';

export default function Departments() {
  const { data: departments, isLoading } = useAllDepartments();
  const deleteDepartment = useDeleteDepartment();
  const newDepartment = useDisclosure();
  const editDepartment = useDisclosure();
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | null>(null);

  const handleDeleteDepartment = async (department: DepartmentType) => {
    if (
      confirm(`Are you sure you want to delete "${department.name}"? This action cannot be undone.`)
    ) {
      await deleteDepartment.mutateAsync(department.did);
    }
  };

  if (isLoading) {
    return <MinimalPlaceholder message="Loading departments..." />;
  }

  if (!departments || departments.length === 0) {
    return <MinimalPlaceholder message="No departments found" isLoading={false} />;
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
              <CardHeader className="absolute top-1 z-10 flex-row items-start justify-between">
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
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button size="sm" variant="flat" isIconOnly>
                      <Icon icon="solar:menu-dots-bold" width="20" className="rotate-90" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="edit"
                      onPress={() => {
                        setSelectedDepartment(department);
                        editDepartment.onOpen();
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      color="danger"
                      onPress={() => handleDeleteDepartment(department)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </CardHeader>
              <Image
                removeWrapper
                alt={department.name}
                className="z-0 h-full w-full object-cover"
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
      {newDepartment.isOpen && <NewDepartment onClose={newDepartment.onClose} mode="create" />}
      {editDepartment.isOpen && (
        <NewDepartment
          onClose={() => {
            editDepartment.onClose();
            setSelectedDepartment(null);
          }}
          department={selectedDepartment}
          mode="edit"
        />
      )}
    </>
  );
}
