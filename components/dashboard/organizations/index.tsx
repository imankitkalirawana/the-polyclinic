'use client';
import { Button, Card, CardBody, CardHeader, Avatar, Divider, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDeleteOrganization, useListOrganizations } from '@/services/organization';
import CreateEditModal from './create-edit';
import { Organization } from 'better-auth/plugins';
import Link from 'next/link';

export default function Organizations() {
  const createModal = useDisclosure();

  const { data: organizations } = useListOrganizations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-default-900">Organizations</h1>
          <p className="text-default-500">Manage your organizations and teams</p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="mdi:plus" className="h-4 w-4" />}
          onPress={createModal.onOpen}
        >
          Create Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((organization) => (
          <OrganizationCard key={organization.id} organization={organization} />
        ))}
      </div>

      {/* Empty State */}
      {(!organizations || organizations.length === 0) && (
        <Card className="py-12 text-center">
          <CardBody>
            <Icon icon="mdi:office-building" className="mx-auto h-12 w-12 text-default-400" />
            <h3 className="mt-2 text-sm font-medium text-default-900">No organizations</h3>
            <p className="mt-1 text-sm text-default-500">
              Get started by creating your first organization.
            </p>
            <div className="mt-6">
              <Button
                color="primary"
                onPress={createModal.onOpen}
                startContent={<Icon icon="mdi:plus" className="h-4 w-4" />}
              >
                Create Organization
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {createModal.isOpen && (
        <CreateEditModal isOpen={createModal.isOpen} onClose={createModal.onClose} mode="create" />
      )}
    </div>
  );
}

function OrganizationCard({ organization }: { organization: Organization }) {
  const editModal = useDisclosure();
  const deleteOrganization = useDeleteOrganization();

  return (
    <>
      <Card isPressable as={Link} href={`/dashboard/organizations/${organization.slug}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                src={organization.logo || undefined}
                name={organization.name}
                className="h-12 w-12"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-default-900">
                  {organization.name}
                </h3>
                <p className="text-sm text-default-500">{organization.slug}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-default-600">
              <Icon icon="mdi:office-building" className="h-4 w-4" />
              <span>Organization ID: {organization.id}</span>
            </div>
            {organization.metadata && Object.keys(organization.metadata).length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-default-600">
                <Icon icon="mdi:globe" className="h-4 w-4" />
                <span>Custom metadata available</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-default-600">
              <Icon icon="mdi:account-group" className="h-4 w-4" />
              <span>Active organization</span>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="bordered"
              color="primary"
              onPress={() => {
                editModal.onOpen();
              }}
              startContent={<Icon icon="mdi:pencil" className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="bordered"
              color="danger"
              isLoading={deleteOrganization.isPending}
              onPress={() => deleteOrganization.mutate({ organizationId: organization.id })}
            >
              Delete
            </Button>
          </div>
        </CardBody>
      </Card>
      {editModal.isOpen && (
        <CreateEditModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          mode="edit"
          organization={organization}
        />
      )}
    </>
  );
}
