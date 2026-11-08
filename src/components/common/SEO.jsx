import { useEffect } from "react";

export default function SEO({
  title = "RCC Infrastructure | Quality Construction & Development",
  description = "RCC Infrastructure delivers dependable construction and development solutions in Mangalore, Karnataka. Built with quality, integrity, and precision.",
  ogImage = "/images/impact.webp",
  canonicalUrl,
}) {
  useEffect(() => {
    // Title
    const formattedTitle = title.includes("RCC Infrastructure")
      ? title
      : `${title} | RCC Infrastructure`;
    document.title = formattedTitle;

    // Meta helper
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const fullOgImage = ogImage.startsWith("http")
      ? ogImage
      : `https://rccinfrastructure.com${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

    setMeta("name", "description", description);
    setMeta("property", "og:title", formattedTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", fullOgImage);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "RCC Infrastructure");

    // Canonical link
    const currentUrl = canonicalUrl || window.location.href;
    setMeta("property", "og:url", currentUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);
  }, [title, description, ogImage, canonicalUrl]);

  return null;
}
