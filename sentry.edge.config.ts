import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://8677dec65dd0d5ba201a557e240ec0e5@o4509429537767424.ingest.us.sentry.io/4509429541502976',
    tracesSampleRate: 1,
    debug: false,
  });
}
