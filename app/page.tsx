'use client';
import Home from '@/components/sections/home';
import { useModal } from '@/components/ui/global-modal';
import { Button } from '@heroui/react';

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
