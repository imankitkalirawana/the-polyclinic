import { API_BASE_URL } from '@/lib/config';
import { sendHTMLMail } from '@/lib/functions';
import { EmailType } from '@/models/Email';
import { Button, Chip, Input } from '@heroui/react';
import axios from 'axios';
import { format } from 'date-fns';
import { Clock, Link2, Maximize2, Plus, Send, X } from 'lucide-react';
import { cookies } from 'next/headers';
import { toast } from 'sonner';

async function getData(id: string) {
  try {
    const res = await axios.get(`${API_BASE_URL}api/emails/${id}`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const email: EmailType = await getData(params.id);
  return (
    <>
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b p-4">
          <h1
            title={email.subject}
            className="line-clamp-1 text-lg font-medium"
          >
            {email.subject}
          </h1>
          <span
            title={format(email.createdAt as Date, 'PPp')}
            className="line-clamp-1 text-xs text-default-500"
          >
            {format(email.createdAt as Date, 'PPp')}
          </span>
        </div>

        {/* Email Form */}
        <div className="space-y-4 p-4">
          {/* Recipients */}
          <div className="space-y-4">
            <div className="flex items-center gap-8">
              <span className="w-8 text-sm text-default-500">From:</span>
              <Chip variant="flat">
                <span className="text-sm">{email.from}</span>
              </Chip>
            </div>
            <div className="flex items-center gap-8">
              <span className="w-8 text-sm text-default-500">To:</span>
              <Chip variant="flat">
                <span className="text-sm">{email.to}</span>
              </Chip>
            </div>
          </div>

          {/* Message Body */}
          <div
            className="rounded-xl bg-default-50 p-4 py-8"
            dangerouslySetInnerHTML={{ __html: email.message }}
          />
        </div>
      </div>
    </>
  );
}
