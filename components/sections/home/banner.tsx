import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import AppScreenshot from './app-screenshot';

export default function Banner() {
  return (
    <main className="flex flex-col items-center rounded-2xl px-3 md:rounded-3xl md:px-0">
      <section className="z-20 my-14 flex flex-col items-center justify-center gap-[18px] sm:gap-6">
        <Button
          className="h-9 overflow-hidden border-1 border-default-100 bg-default-50 px-[18px] py-2 text-small font-normal leading-5 text-default-500"
          endContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:arrow-right-linear"
              width={20}
            />
          }
          radius="full"
          variant="bordered"
        >
          New onboarding experience
        </Button>
        <div className="text-center text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]">
          <div className="bg-gradient-to-r from-secondary to-secondary/40 bg-clip-text text-transparent">
            Easiest way to <br /> power global teams.
          </div>
        </div>
        <p className="text-center font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]">
          Acme makes running global teams simple. HR, Payroll, International Employment, contractor
          management and more.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Button color="secondary" className="px-8 py-2.5" radius="full" size="lg">
            Get Started
          </Button>
          <Button
            className="border-1 border-divider px-8 py-2.5"
            endContent={
              <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-default-100">
                <Icon
                  className="text-default-500 [&>path]:stroke-[1.5]"
                  icon="solar:arrow-right-linear"
                  width={16}
                />
              </span>
            }
            radius="full"
            variant="bordered"
            size="lg"
          >
            See our plans
          </Button>
        </div>
      </section>
      <div className="z-20 mt-auto w-[calc(100%-calc(theme(spacing.4)*2))] max-w-6xl overflow-hidden rounded-tl-2xl rounded-tr-2xl border-1 border-b-0 border-[#FFFFFF1A] bg-background bg-opacity-0 p-4">
        <AppScreenshot />
      </div>
    </main>
  );
}
