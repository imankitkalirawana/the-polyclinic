import process from 'process';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    authInterrupts: true,
  },
};

let finalConfig = baseConfig;

if (!isDev) {
  const { withSentryConfig } = await import('@sentry/nextjs');
  finalConfig = withSentryConfig(baseConfig, {
    org: 'devocode',
    project: 'the-polyclinic',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    disableLogger: true,
    automaticVercelMonitors: false,
    telemetry: false,
  });
}

export default finalConfig;
