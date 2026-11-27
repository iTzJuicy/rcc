export default async function handler(_request, response) {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return response.status(503).send("Sitemap proxy is not configured.");
  }

  try {
    const backendOrigin = new URL(backendUrl);
    if (backendOrigin.protocol !== "https:") {
      return response.status(500).send("Sitemap backend must use HTTPS.");
    }

    const sitemapUrl = new URL("/api/public/sitemap.xml", backendOrigin);
    const upstream = await fetch(sitemapUrl, { signal: AbortSignal.timeout(15_000) });
    if (!upstream.ok) {
      console.error(`Sitemap backend returned HTTP ${upstream.status}.`);
      return response.status(502).send("Sitemap is temporarily unavailable.");
    }

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response.status(200).send(await upstream.text());
  } catch (error) {
    console.error("Failed to proxy the dynamic sitemap.", error);
    return response.status(502).send("Sitemap is temporarily unavailable.");
  }
}
