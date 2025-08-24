'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Badge,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { getFullOrganization, OrganizationRole } from '@/services/api/organization';
import DashboardDetailsSkeleton from '@/components/skeletons/dashboard-details-skeleton';
import { useInviteMember, useListInvitations } from '@/services/organization';

interface OrganizationProps {
  slug: string;
}

interface Member {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrganizationData {
  id: string;
  name: string;
  slug: string;
  logo: string;
  createdAt: string;
  metadata: string;
  invitations: unknown[];
  members: Member[];
  teams: unknown;
}

export default function Organization({ id }: { id: string }) {
  const {
    data: invitations,
    isLoading: isInvitationsLoading,
    error: isInvitationsError,
  } = useListInvitations(id);
  const { mutateAsync } = useInviteMember();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'member' as OrganizationRole,
  });

  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['organization', id],
    queryFn: async () =>
      await getFullOrganization({
        organizationId: id,
      }),
  });

  const handleInviteMember = async () => {
    await mutateAsync({
      email: inviteForm.email,
      role: inviteForm.role,
      organizationId: id,
    });
    setIsInviteModalOpen(false);
    setInviteForm({ email: '', role: 'member' });
  };

  const handleRemoveMember = async () => {
    // TODO: Implement remove member functionality
    console.log('Removing member:', selectedMember);
    setIsRemoveMemberModalOpen(false);
    setSelectedMember(null);
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    // TODO: Implement update member role functionality
    console.log('Updating member role:', memberId, newRole);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'success';
      case 'admin':
        return 'warning';
      case 'member':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Icon icon="mdi:crown" className="h-4 w-4" />;
      case 'admin':
        return <Icon icon="mdi:shield" className="h-4 w-4" />;
      case 'member':
        return <Icon icon="mdi:account" className="h-4 w-4" />;
      default:
        return <Icon icon="mdi:account" className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <DashboardDetailsSkeleton />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <div className="space-y-4 text-center">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-danger">Error Loading Organization</h2>
            <p className="max-w-md text-default-500">
              We encountered an error while loading the organization details. Please try again
              later.
            </p>
            <Button color="primary" variant="solid" onPress={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!organization) {
    return (
      <Card className="w-full">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <div className="space-y-4 text-center">
            <div className="text-6xl">🔍</div>
            <h2 className="text-2xl font-bold">Organization Not Found</h2>
            <p className="max-w-md text-default-500">
              The organization you&apos;re looking for doesn&apos;t exist or you don&apos;t have
              access to it.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const orgData = organization as unknown as OrganizationData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <Avatar src={orgData.logo} name={orgData.name} size="lg" className="h-16 w-16" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{orgData.name}</h1>
              <div className="flex items-center space-x-2 text-default-500">
                <Icon icon="mdi:office-building" className="h-4 w-4" />
                <span>@{orgData.slug}</span>
                <Badge color="success" variant="flat" size="sm">
                  Active
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              color="primary"
              variant="solid"
              startContent={<Icon icon="mdi:account-plus" className="h-4 w-4" />}
              onPress={() => setIsInviteModalOpen(true)}
            >
              Invite Member
            </Button>
            <Button
              variant="flat"
              startContent={<Icon icon="mdi:cog" className="h-4 w-4" />}
              onPress={() => setIsManageMembersModalOpen(true)}
            >
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:calendar" className="h-5 w-5 text-default-400" />
              <div>
                <p className="text-sm text-default-500">Created</p>
                <p className="font-medium">{formatDate(orgData.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:account-group" className="h-5 w-5 text-default-400" />
              <div>
                <p className="text-sm text-default-500">Members</p>
                <p className="font-medium">{orgData.members.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon icon="mdi:email" className="h-5 w-5 text-default-400" />
              <div>
                <p className="text-sm text-default-500">Invitations</p>
                <p className="font-medium">{orgData.invitations.length}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Members Section */}
      <Card className="w-full">
        <CardBody>
          <div className="space-y-4">
            {orgData.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-default-200 p-4"
              >
                <div className="flex items-center space-x-3">
                  <Avatar name={member.user.name} size="md" />
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-default-500">{member.user.email}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <Chip
                        color={getRoleColor(member.role)}
                        variant="flat"
                        size="sm"
                        startContent={getRoleIcon(member.role)}
                      >
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Chip>
                      <span className="text-xs text-default-400">
                        Joined {formatDate(member.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Tooltip content="Edit role">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setSelectedMember(member);
                        setIsManageMembersModalOpen(true);
                      }}
                    >
                      <Icon icon="mdi:cog" className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  {member.role !== 'owner' && (
                    <Tooltip content="Remove member">
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => {
                          setSelectedMember(member);
                          setIsRemoveMemberModalOpen(true);
                        }}
                      >
                        <Icon icon="mdi:delete" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Invite New Member</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Email Address"
                placeholder="Enter email address"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                type="email"
                required
              />
              <Select
                label="Role"
                placeholder="Select role"
                selectedKeys={[inviteForm.role]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setInviteForm({ ...inviteForm, role: selectedKey as OrganizationRole });
                }}
              >
                <SelectItem key="member">Member</SelectItem>
                <SelectItem key="admin">Admin</SelectItem>
              </Select>
              <Textarea
                label="Message (Optional)"
                placeholder="Add a personal message to your invitation"
                maxRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleInviteMember}>
              Send Invitation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Member Modal */}
      <Modal isOpen={isRemoveMemberModalOpen} onClose={() => setIsRemoveMemberModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Remove Member</ModalHeader>
          <ModalBody>
            <p className="text-center">
              Are you sure you want to remove <strong>{selectedMember?.user.name}</strong> from the
              organization?
            </p>
            <p className="mt-2 text-center text-sm text-default-500">
              This action cannot be undone. The member will lose access to all organization
              resources.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsRemoveMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleRemoveMember}>
              Remove Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Manage Members Modal */}
      <Modal isOpen={isManageMembersModalOpen} onClose={() => setIsManageMembersModalOpen(false)}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>Manage Members</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {orgData.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-default-200 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar name={member.user.name} size="sm" />
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-default-500">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Select
                      size="sm"
                      selectedKeys={[member.role]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        handleUpdateMemberRole(member.id, selectedKey);
                      }}
                      isDisabled={member.role === 'owner'}
                    >
                      <SelectItem key="member">Member</SelectItem>
                      <SelectItem key="admin">Admin</SelectItem>
                      <SelectItem key="owner" isDisabled>
                        Owner
                      </SelectItem>
                    </Select>
                    {member.role !== 'owner' && (
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => {
                          setSelectedMember(member);
                          setIsRemoveMemberModalOpen(true);
                          setIsManageMembersModalOpen(false);
                        }}
                      >
                        <Icon icon="mdi:delete" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setIsManageMembersModalOpen(false)}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
