'use client';

import CommandMenu from '@/components/command-menu';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';

export default function Dashboard() {
  return (
    <div>
      <Button
        onPress={() => {
          toast.success('Hello WOrld', {
            description: 'This is a toast message'
          });
        }}
      >
        Toast
      </Button>
    </div>
  );
}
