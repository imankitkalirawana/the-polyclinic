'use client';

import { format } from 'date-fns';
import { Chip } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';

import { getEmailWithID } from '@/functions/server-actions/emails';
import { EmailType } from '@/types/email';

export default function Email({ _id }: { _id: string }) {
  const { data } = useQuery<EmailType>({
    queryKey: ['email', _id],
    queryFn: () => getEmailWithID(_id),
  });

  const email = data || ({} as EmailType);

  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b p-4">
        <h1
          title={email?.subject}
          className="line-clamp-1 text-large font-medium"
        >
          {email?.subject}
        </h1>
        <span
          title={format(email?.createdAt as Date, 'PPp')}
          className="line-clamp-1 text-tiny text-default-500"
        >
          {format(email?.createdAt as Date, 'PPp')}
        </span>
      </div>

      {/* Email Form */}
      <div className="space-y-4 p-4">
        {/* Recipients */}
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <span className="w-8 text-small text-default-500">From:</span>
            <Chip variant="flat">
              <span className="text-small">{email?.from}</span>
            </Chip>
          </div>
          <div className="flex items-center gap-8">
            <span className="w-8 text-small text-default-500">To:</span>
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
