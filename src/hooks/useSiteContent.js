import { useState, useEffect } from "react";
import api from "../services/api";
import { DEFAULT_CONTENT } from "../../backend/shared/contentDefaults.js";

export const CONTENT_FALLBACKS = DEFAULT_CONTENT;

// This module cache is client-only; replace it with a server-aware cache before adding SSR.
let cachedSiteContent = null;
let contentPromise = null;

export function updateCachedSiteContent(key, value) {
  cachedSiteContent = {
    ...(cachedSiteContent || CONTENT_FALLBACKS),
    [key]: value,
  };
}

export function useSiteContent() {
  const [content, setContent] = useState(cachedSiteContent || CONTENT_FALLBACKS);
  const [loading, setLoading] = useState(!cachedSiteContent);

  useEffect(() => {
    let isMounted = true;

    if (cachedSiteContent) {
      setContent(cachedSiteContent);
      setLoading(false);
      return;
    }

    if (!contentPromise) {
      contentPromise = api
        .get("/public/content")
        .then((res) => {
          if (!res?.data) throw new Error("Public site content response did not include data.");
          cachedSiteContent = { ...CONTENT_FALLBACKS, ...res.data };
          return cachedSiteContent;
        })
        .catch((error) => {
          console.error("Failed to load public site content; using shared defaults.", error);
          cachedSiteContent = CONTENT_FALLBACKS;
          return cachedSiteContent;
        })
        .finally(() => {
          contentPromise = null;
        });
    }

    contentPromise.then((data) => {
      if (isMounted) {
        setContent(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { content, loading };
}

export default useSiteContent;
