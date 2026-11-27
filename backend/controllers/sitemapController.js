import Project from "../models/Project.js";
import Service from "../models/Service.js";

const CACHE_TTL_MS = 60 * 60 * 1000;
let cachedSitemap = null;
let cachedAt = 0;
let sitemapPromise = null;

export async function getSitemapXml(req, res, next) {
  try {
    if (cachedSitemap && Date.now() - cachedAt < CACHE_TTL_MS) {
      res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=3600");
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      return res.status(200).send(cachedSitemap);
    }

    if (!sitemapPromise) {
      sitemapPromise = (async () => {
        if (process.env.NODE_ENV === "production" && !process.env.SITE_URL) {
          throw new Error("SITE_URL must be configured in production before generating a sitemap.");
        }
        const baseUrl = process.env.SITE_URL
          ? new URL(process.env.SITE_URL).origin
          : new URL(`${req.protocol}://${req.get("host")}`).origin;
        const staticRoutes = [
          { loc: "/", changefreq: "weekly", priority: "1.0" },
          { loc: "/about", changefreq: "monthly", priority: "0.8" },
          { loc: "/services", changefreq: "weekly", priority: "0.9" },
          { loc: "/projects", changefreq: "weekly", priority: "0.9" },
          { loc: "/expertise", changefreq: "monthly", priority: "0.7" },
          { loc: "/process", changefreq: "monthly", priority: "0.7" },
          { loc: "/contact", changefreq: "monthly", priority: "0.8" },
          { loc: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
          { loc: "/terms-and-conditions", changefreq: "yearly", priority: "0.4" },
        ];

        const [services, projects] = await Promise.all([
          Service.find({ isActive: true }).select("slug updatedAt"),
          Project.find().select("slug updatedAt"),
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        for (const route of staticRoutes) {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}${route.loc}</loc>\n`;
          xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
          xml += `    <priority>${route.priority}</priority>\n`;
          xml += `  </url>\n`;
        }

        for (const service of services) {
          const lastMod = service.updatedAt ? service.updatedAt.toISOString().split("T")[0] : "";
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/services/${service.slug}</loc>\n`;
          if (lastMod) xml += `    <lastmod>${lastMod}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.8</priority>\n`;
          xml += `  </url>\n`;
        }

        for (const project of projects) {
          const lastMod = project.updatedAt ? project.updatedAt.toISOString().split("T")[0] : "";
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/projects/${project.slug}</loc>\n`;
          if (lastMod) xml += `    <lastmod>${lastMod}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.8</priority>\n`;
          xml += `  </url>\n`;
        }

        return xml + `</urlset>`;
      })();
    }

    const xml = await sitemapPromise;
    sitemapPromise = null;
    cachedSitemap = xml;
    cachedAt = Date.now();
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=3600");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (error) {
    sitemapPromise = null;
    next(error);
  }
}

export default { getSitemapXml };
