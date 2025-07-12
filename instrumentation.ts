import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV !== 'development'
  ) {
    await import('./sentry.server.config');
  }

  if (
    process.env.NEXT_RUNTIME === 'edge' &&
    process.env.NODE_ENV !== 'development'
  ) {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
