'use client';

import { Button } from '@heroui/react';

import { useModal } from '@/components/ui/global-modal';

export default function HomePage() {
  const modal = useModal();
  return (
    <Button
      onPress={() =>
        modal.show({
          body: <div>Hello</div>,
        })
      }
    >
      Open Modal
    </Button>
  );
}
