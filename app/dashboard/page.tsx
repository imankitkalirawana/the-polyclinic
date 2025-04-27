'use client';

import { Button } from "@heroui/react";
import { toast } from 'sonner';

export default function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-10 gap-2">
        <Button
          onPress={() => {
            toast.success('Hello WOrld', {
              description: 'This is a toast message'
            });
          }}
        >
          Toast
        </Button>
        <Button
          color="primary"
          onPress={() => {
            toast.success('Hello WOrld', {
              description: 'This is a toast message'
            });
          }}
        >
          Primary
        </Button>
        <Button
          color="secondary"
          onPress={() => {
            toast.success('Hello WOrld', {
              description: 'This is a toast message'
            });
          }}
        >
          Secondary
        </Button>
        <Button
          color="success"
          onPress={() => {
            toast.success('Hello WOrld', {
              description: 'This is a toast message'
            });
          }}
        >
          success
        </Button>
        <Button
          color="warning"
          onPress={() => {
            toast.warning('Hello WOrld', {
              description: 'This is a toast message'
            });
          }}
        >
          warning
        </Button>
        <Button
          color="danger"
          onPress={() => {
            toast.error('Hello WOrld', {
              description: 'This is a toast message'
            });
          }}
        >
          danger
        </Button>
      </div>
    </div>
  );
}
