'use client';
import { useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import GridHero from '../landing-page/grid-hero';
import { MarqueeContainer } from '../landing-page/marquee';
import { ContainerScroll } from '../ui/landing-page/container-scroll-animation';

export default function Homepage() {
  const { theme } = useTheme();
  const [src, setSrc] = React.useState<string | undefined>();

  useEffect(() => {
    if (theme === 'dark') {
      setSrc('/assets/dark-scroll-img.png');
    } else {
      setSrc('/assets/light-scroll-img.png');
    }
  }, [theme]);

  return (
    <>
      <GridHero />
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold">
              Scroll Through <br />
              <span className="mt-1 text-4xl font-bold leading-none text-primary md:text-[6rem]">
                Vital Insights
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={src || '/assets/light-scroll-img.png'}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto h-full rounded-2xl object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <MarqueeContainer />
    </>
  );
}
