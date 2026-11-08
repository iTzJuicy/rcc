import * as Sentry from "@sentry/node";

export function initSentry(app) {
  const dsn = process.env.SENTRY_DSN;

  if (dsn && dsn.trim() !== "") {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: 0.1, // 10% sampling to conserve free plan quota
    });
    console.log("[Monitoring] Sentry error tracking initialized (10% sampling).");
  } else {
    console.log("[Monitoring] Sentry DSN not provided; running in local monitoring mode.");
  }
}

export function captureException(err, context = {}) {
  console.error("[Logged Exception]", err);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err, { extra: context });
  }
}

export default { initSentry, captureException };
