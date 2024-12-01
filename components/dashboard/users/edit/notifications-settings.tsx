'use client';

import type { CardProps } from '@nextui-org/react';

import React from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';

import SwitchCell from './switch-cell';

export default function Component(props: CardProps) {
  return (
    <Card className="w-full max-w-lg p-2" {...props}>
      <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
        <p className="text-large">Notification Settings</p>
        <p className="text-small text-default-500">
          Manage your notification preferences
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <SwitchCell
            description="Temporarily pause all notifications"
            label="Pause all"
          />
          <SwitchCell
            defaultSelected
            description="Get notified when someone follows you"
            label="Followers"
          />
          <SwitchCell
            defaultSelected
            description="Get notified when someone likes your post"
            label="Likes"
          />
          <SwitchCell
            description="Get notified when someone comments on your post"
            label="Comments"
          />
          <SwitchCell
            defaultSelected
            description="Get notified when someone mentions you in a post"
            label="Mentions"
          />
          <SwitchCell
            defaultSelected
            description="Get notified when someone sends you a message"
            label="Messages"
          />
          <SwitchCell
            description="Get notified when someone sends you a friend request"
            label="Friend Requests"
          />
          <div className="flex w-full justify-end gap-2 pt-4">
            <Button variant="bordered">Reset to Default</Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
