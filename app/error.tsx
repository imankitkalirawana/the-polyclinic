'use client';
import Link from 'next/link';
import { Button, Card, Link as NextLink } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  code?: string;
  title?: string;
  description?: string;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}

export default function Error({
  className,
  code = '404',
  title = 'We lost this page',
  description = "We searched high and low, but couldn't find what you're looking for. Let's find a better place for you to go.",
  primaryButton = (
    <Button
      variant="bordered"
      startContent={<Icon icon="solar:arrow-left-linear" />}
      // go one step back in the browser history
      onPress={() => window.history.back()}
    >
      Go Back
    </Button>
  ),
  secondaryButton = (
    <Button variant="flat" color="primary" as={Link} href="/">
      Take me home
    </Button>
  ),
}: Props) {
  return (
    <>
      <div
        className={cn(
          'container mx-auto flex items-center justify-center px-6 py-12',
          className
        )}
      >
        <div className="w-full">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <p className="text-small font-medium uppercase text-primary">
              {code} error
            </p>
            <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{title}</h1>
            <p className="mt-4 text-foreground-400">{description}</p>
            <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
              {primaryButton}
              {secondaryButton}
            </div>
          </div>

          <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card radius="lg" className="p-6">
              <Icon icon="solar:document-bold-duotone" />

              <h3 className="mt-6 font-medium">Documentation</h3>

              <p className="mt-2">Dive in to learn all about our product.</p>

              <NextLink
                href="/documentation"
                underline="hover"
                color="primary"
                size="sm"
                className="mt-4"
              >
                <span>Start learning</span>
                <Icon icon="solar:arrow-right-linear" />
              </NextLink>
            </Card>

            <Card radius="lg" className="p-6">
              <Icon icon="solar:book-bold-duotone" />

              <h3 className="mt-6 font-medium">Our blog</h3>

              <p className="mt-2">Read the latest posts on our blog.</p>

              <NextLink
                href="#"
                underline="hover"
                color="primary"
                size="sm"
                className="mt-4"
              >
                <span>View latest posts</span>

                <Icon icon="solar:arrow-right-linear" />
              </NextLink>
            </Card>

            <Card radius="lg" className="p-6">
              <Icon icon="solar:chat-line-bold-duotone" />

              <h3 className="mt-6 font-medium">Chat to us</h3>

              <p className="mt-2">
                Can&apos;t find what you&apos;re looking for?
              </p>

              <NextLink
                href="#"
                underline="hover"
                color="primary"
                size="sm"
                className="mt-4"
              >
                <span>Chat to our team</span>

                <Icon icon="solar:arrow-right-linear" />
              </NextLink>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
