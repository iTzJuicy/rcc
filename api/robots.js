export default function handler(_request, response) {
  const siteUrl =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  if (!siteUrl) {
    return response.status(503).send("Robots configuration is not available.");
  }

  let canonicalOrigin;
  try {
    canonicalOrigin = new URL(siteUrl).origin;
  } catch (error) {
    console.error("SITE_URL is invalid.", error);
    return response.status(500).send("Robots configuration is invalid.");
  }

  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=300");
  return response.status(200).send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${canonicalOrigin}/sitemap.xml\n`
  );
}
