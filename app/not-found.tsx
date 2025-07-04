'use client';
import Link from 'next/link';
import { Button, Card, Link as NextLink } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function NotFound() {
  return (
    <>
      <section>
        <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full">
            <div className="mx-auto flex max-w-lg flex-col items-center text-center">
              <p className="text-small font-medium text-primary">404 error</p>
              <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
                We lost this page
              </h1>
              <p className="mt-4 text-foreground-400">
                We searched high and low, but couldn&apos;t find what
                you&apos;re looking for.Let&apos;s find a better place for you
                to go.
              </p>

              <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
                <Button
                  variant="bordered"
                  as={Link}
                  href="/"
                  startContent={<Icon icon="solar:arrow-left-linear" />}
                >
                  Go Back
                </Button>

                <Button variant="flat" color="primary" as={Link} href="/">
                  Take me home
                </Button>
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
      </section>
    </>
  );
}
