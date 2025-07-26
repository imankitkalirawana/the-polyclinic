'use client';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react';

import SwitchCell from './switch-cell';

export default function NotificationsSettings() {
  return (
    <Card className="bg-transparent p-2 shadow-none">
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
