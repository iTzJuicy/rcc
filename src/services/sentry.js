import * as Sentry from "@sentry/react";

let initialized = false;

export function initFrontendMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const consent = localStorage.getItem("rcc_cookie_consent");

  if (!dsn || consent !== "accepted" || initialized) {
    return;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    tracePropagationTargets: ["localhost", apiBaseUrl].filter(Boolean),
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE || "production",
  });
  initialized = true;
  console.info("[RCC Monitoring] Sentry initialized with user consent.");
}

if (typeof window !== "undefined") {
  window.addEventListener("rcc_cookie_consent_updated", () => {
    initFrontendMonitoring();
  });
}

export function captureException(error, context = {}) {
  const consent = localStorage.getItem("rcc_cookie_consent");
  if (consent === "accepted" && initialized) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("[RCC App Error]:", error, context);
  }
}

export default {
  init: initFrontendMonitoring,
  captureException,
};
