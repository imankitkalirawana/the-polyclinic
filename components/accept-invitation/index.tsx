'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Avatar, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAcceptInvitation, useGetInvitationById } from '@/services/organization';
import { useRouter } from 'next/navigation';

interface AcceptInvitationProps {
  id: string;
}

export default function AcceptInvitation({ id }: AcceptInvitationProps) {
  const router = useRouter();
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);

  // Fetch invitation details
  const { data: invitation, isLoading, error } = useGetInvitationById(id, 'control-plane');

  // Accept invitation mutation
  const acceptMutation = useAcceptInvitation();

  const handleAccept = async () => {
    setAction('accept');
    try {
      await acceptMutation.mutateAsync({ invitationId: id });
      // Redirect to dashboard after successful acceptance
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setAction(null);
    }
  };

  const handleReject = async () => {
    setAction('reject');
    // For now, just redirect back to home
    // In a real app, you might want to call a reject API
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading invitation details...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="mx-4 w-full max-w-md">
          <CardBody className="py-8 text-center">
            <Icon icon="mdi:close-circle" className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Invitation Not Found
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              This invitation may have expired or doesn&apos;t exist.
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => router.push('/')}
              className="w-full"
            >
              Return Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const isExpired = invitation.expiresAt && new Date(invitation.expiresAt) < new Date();
  const isAccepted = invitation.status === 'accepted';
  const isRejected = invitation.status === 'rejected';

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="mx-4 w-full max-w-md">
          <CardBody className="py-8 text-center">
            <Icon icon="mdi:close-circle" className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Invitation Expired
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              This invitation has expired. Please contact the organization for a new invitation.
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => router.push('/')}
              className="w-full"
            >
              Return Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="mx-4 w-full max-w-md">
          <CardBody className="py-8 text-center">
            <Icon icon="mdi:check-circle" className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Invitation Already Accepted
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              You have already accepted this invitation.
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="mx-4 w-full max-w-md">
          <CardBody className="py-8 text-center">
            <Icon icon="mdi:close-circle" className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Invitation Declined
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              You have declined this invitation.
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => router.push('/')}
              className="w-full"
            >
              Return Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Organization Invitation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You&apos;ve been invited to join an organization
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={undefined}
                name={invitation.organizationName || 'Organization'}
                size="lg"
                className="bg-primary-100 text-primary-600"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {invitation.organizationName || 'Organization'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{invitation.organizationSlug}</p>
              </div>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="space-y-6">
            {/* Invitation Details */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <Icon icon="mdi:account" className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="font-medium capitalize text-gray-900 dark:text-white">
                    {invitation.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <Icon icon="mdi:email" className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Invited Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invitation.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <Icon icon="mdi:calendar" className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Invited On</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {invitation.expiresAt
                      ? new Date(invitation.expiresAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <Icon icon="mdi:shield" className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Chip
                    color={invitation.status === 'pending' ? 'warning' : 'default'}
                    variant="flat"
                    size="sm"
                  >
                    {invitation.status}
                  </Chip>
                </div>
              </div>
            </div>

            {/* Inviter Information */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Invited by</h3>
              <p className="text-gray-700 dark:text-gray-300">{invitation.inviterEmail}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                color="success"
                size="lg"
                className="flex-1"
                onPress={handleAccept}
                isLoading={action === 'accept'}
                startContent={
                  action !== 'accept' ? (
                    <Icon icon="mdi:check-circle" className="h-5 w-5" />
                  ) : undefined
                }
                disabled={action !== null}
              >
                {action === 'accept' ? 'Accepting...' : 'Accept Invitation'}
              </Button>

              <Button
                color="danger"
                variant="flat"
                size="lg"
                className="flex-1"
                onPress={handleReject}
                isLoading={action === 'reject'}
                startContent={
                  action !== 'reject' ? (
                    <Icon icon="mdi:close-circle" className="h-5 w-5" />
                  ) : undefined
                }
                disabled={action !== null}
              >
                {action === 'reject' ? 'Declining...' : 'Decline Invitation'}
              </Button>
            </div>

            {/* Success/Processing Messages */}
            {action === 'accept' && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:check-circle" className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Invitation Accepted!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Redirecting you to the dashboard...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {action === 'reject' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:close-circle" className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">
                      Invitation Declined
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Redirecting you to the home page...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="pt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By accepting this invitation, you&apos;ll become a member of the organization and
                gain access to their services and resources.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
