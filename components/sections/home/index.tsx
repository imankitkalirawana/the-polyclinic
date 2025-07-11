'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Image } from '@heroui/react';

const CompanyLogo = ({
  src,
  alt,
  width = 100,
  height = 24,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) => (
  <Image
    src={src || '/logo.png'}
    alt={alt}
    width={width}
    height={height}
    className="grayscale"
  />
);

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between gap-12">
            <div className="max-w-lg">
              <h1 className="text-brand-dark text-5xl font-bold leading-tight md:text-6xl">
                Build the best teams at the world's best price.
              </h1>
              <p className="text-brand-gray mt-6 text-lg">
                Skip the hassle of opening additional entities and decoding
                local labor laws. RemoFirst handles all of your employment needs
                for global employees and contractors — quickly and compliantly.
                Available in 185+ countries. Ready to employ the best talent
                worldwide?
              </p>
              <Button size="lg" color="primary" className="mt-8">
                Book a demo
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/assets/home/banner.png"
                alt="Team member"
                width={600}
                height={400}
                className="inset-0 aspect-video w-full object-cover"
                isBlurred
              />
              <div className="absolute bottom-5 left-5 z-10 aspect-video w-20 rounded-medium bg-white"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-brand-dark text-4xl font-bold">
            They saved. So can you.
          </h2>
          <p className="text-brand-gray mx-auto mt-4 max-w-3xl">
            Discover how we help startups to Fortune 500 companies save on costs
            while maintaining local compliance, payroll, and more. Join them to
            bring your hiring costs down.
          </p>
          <div className="mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <CompanyLogo src="/assets/home/banner.jpg" alt="Osome" />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Twilio"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="QED Investors"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Kota"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Labster"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Family"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Locals"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="PandaDoc"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Mastercard"
            />
            <CompanyLogo
              src="/placeholder.svg?width=120&height=30"
              alt="Microsoft"
            />
            <CompanyLogo src="/placeholder.svg?width=120&height=30" alt="DSM" />
            <CompanyLogo src="/placeholder.svg?width=120&height=30" alt="BCG" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <h2 className="text-brand-dark text-5xl font-bold leading-tight">
                International talent, secured. Global payroll, sorted.
              </h2>
              <p className="text-brand-gray mt-6 text-lg">
                Employing remote teams shouldn't be difficult. That's why
                RemoFirst is the best platform to manage your international HR
                and help you employ global talent.
              </p>
              <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/4 rounded-2xl bg-white p-6 shadow-2xl">
                <p className="font-semibold">Payroll expenses</p>
                <p className="text-brand-dark mt-1 text-3xl font-bold">
                  $380,043.47
                </p>
                <p className="text-sm text-green-500">(+12%) vs last month</p>
                <Image
                  src="/placeholder.svg?width=350&height=100"
                  alt="Payroll chart"
                  width={350}
                  height={100}
                  className="mt-4"
                />
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p>United Kingdom</p>
                    <p className="font-medium">$81,233.45</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Spain</p>
                    <p className="font-medium">$52,794.37</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Brazil</p>
                    <p className="font-medium">$87,523.61</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] lg:h-[600px]">
              <div className="absolute inset-0 -rotate-6 transform rounded-3xl bg-gray-200" />
              <Image
                src="/placeholder.svg?width=500&height=600"
                alt="Man with headphones"
                className="relative rounded-3xl object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold">
                Global Employer of Record (EOR)
              </h3>
              <p className="text-brand-gray mt-2">
                Save months and tens of thousands of dollars setting-up a local
                entity. RemoFirst employs your international talent on your
                behalf in 180+ countries.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">International Contractors</h3>
              <p className="text-brand-gray mt-2">
                Navigate international contractor compliance with ease and team
                up with top-notch contractors worldwide. No red tape, just
                smooth sailing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">Fast Onboarding</h3>
              <p className="text-brand-gray mt-2">
                Save hours on admin and paperwork. We'll get your international
                team ready to go, with 24/5 customer service.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button className="bg-brand-green mx-auto flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              <Icon icon="mdi:plus" className="h-5 w-5" />
              Learn more
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-white py-20">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold leading-snug">
              "RemoFirst enables me to work remotely and stay compliant in my
              home country. It's also very helpful for submitting and managing
              expenses, making it a great addition to my primary HR platform
              with its simple, intuitive, and easy to navigate, with more than
              adequate admin features. The platform is simple, intuitive, and
              easy to navigate, with more than adequate functionality for
              getting things done efficiently."
            </h2>
            <p className="mt-8 font-semibold">
              Martin P. - Head of Marketing @ BetVictor
            </p>
          </div>
          <button className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border bg-white p-3 shadow-md hover:bg-gray-100">
            <Icon icon="mdi:arrow-left" className="text-brand-gray h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border bg-white p-3 shadow-md hover:bg-gray-100">
            <Icon icon="mdi:arrow-right" className="text-brand-gray h-6 w-6" />
          </button>
          <div className="mt-8 flex justify-center gap-2">
            <div className="bg-brand-dark h-2.5 w-2.5 rounded-full" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-5xl font-bold">
              Where you pay less, and get so much more.
            </h2>
            <p className="text-brand-gray mt-4">
              Get international HR, compliance and payroll in 3 simple steps:
            </p>
          </div>
          <div className="mt-16 grid items-start gap-8 lg:grid-cols-3">
            <div className="relative pt-12">
              <Image
                src="/placeholder.svg?width=400&height=300"
                alt="Find talent"
                width={400}
                height={300}
                className="rounded-2xl object-cover grayscale"
              />
              <div className="relative mx-4 -mt-16 rounded-2xl bg-white p-8 shadow-xl">
                <div className="bg-brand-green absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mt-4 text-2xl font-bold">
                  Find your global talent
                </h3>
                <p className="text-brand-gray mt-2">
                  You've sourced a full-time employee or contractor located in a
                  country where your company is not incorporated.
                </p>
              </div>
            </div>
            <div className="bg-brand-green rounded-2xl p-8 text-white shadow-xl lg:mt-20">
              <div className="text-brand-green flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-bold">
                2
              </div>
              <h3 className="mt-4 text-2xl font-bold">
                The best price guaranteed
              </h3>
              <p className="mt-2 opacity-80">
                Pass us the details of your candidate and we will let you know
                exactly what it costs to employ your candidate in that country.
              </p>
            </div>
            <div className="relative pt-12">
              <Image
                src="/placeholder.svg?width=400&height=300"
                alt="Employ talent"
                width={400}
                height={300}
                className="rounded-2xl object-cover grayscale"
              />
              <div className="relative mx-4 -mt-16 rounded-2xl bg-white p-8 shadow-xl">
                <div className="bg-brand-green absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mt-4 text-2xl font-bold">Employ talent</h3>
                <p className="text-brand-gray mt-2">
                  We handle all the paperwork and compliance for you, so you can
                  focus on what you do best.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
