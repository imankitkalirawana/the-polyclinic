'use client';

import { Chip } from '@heroui/react';
import { format } from 'date-fns';

import NoResults from '@/components/ui/no-results';
import { castData } from '@/libs/utils';
import { useEmailWithID } from '@/services/client/email/email.query';
import { EmailType } from '@/services/client/email/email.types';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

export default function Email({ id }: { id: string }) {
  const { data, isLoading, isError } = useEmailWithID(id);

  const email = castData<EmailType>(data);

  if (isLoading) {
    return <MinimalPlaceholder message="Loading email..." />;
  }

  if (isError) {
    return <NoResults message="Error fetching email" />;
  }

  if (!email) {
    return <NoResults message="Email not found" />;
  }

  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b p-4">
        <h1 title={email?.subject} className="line-clamp-1 font-medium text-large">
          {email?.subject}
        </h1>
        <span
          title={format(email?.createdAt as Date, 'PPp')}
          className="line-clamp-1 text-default-500 text-tiny"
        >
          {format(email?.createdAt as Date, 'PPp')}
        </span>
      </div>

      {/* Email Form */}
      <div className="space-y-4 p-4">
        {/* Recipients */}
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <span className="w-8 text-default-500 text-small">From:</span>
            <Chip variant="flat">
              <span className="text-small">{email?.from}</span>
            </Chip>
          </div>
          <div className="flex items-center gap-8">
            <span className="w-8 text-default-500 text-small">To:</span>
            <Chip variant="flat">
              <span className="text-small">{email?.to}</span>
            </Chip>
          </div>
        </div>

        {/* Message Body */}
        <div
          className="rounded-medium bg-default-50 p-4 py-8"
          dangerouslySetInnerHTML={{ __html: email.message }}
        />
      </div>
    </div>
  );
}
