'use client';

import { downloadAppointmentReceipt } from '@/functions/client/appointment/receipt';
import { printAppointmentReceipt } from '@/functions/server-actions/receipt';
import { Button } from '@heroui/react';
import { useState } from 'react';

export default function Page() {
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <Button
      onPress={async () => {
        setIsDownloading(true);
        await downloadAppointmentReceipt(1022);
        setIsDownloading(false);
      }}
      isLoading={isDownloading}
      className="btn btn-primary mt-24"
    >
      Download PDF
    </Button>
  );
}
