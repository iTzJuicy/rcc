import Project from "../models/Project.js";
import Service from "../models/Service.js";

export async function getSitemapXml(req, res, next) {
  try {
    const baseUrl = process.env.SITE_URL || "https://rccinfrastructure.com";

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

    // Static pages
    for (const r of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${r.loc}</loc>\n`;
      xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
      xml += `    <priority>${r.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic services
    for (const s of services) {
      const lastMod = s.updatedAt ? s.updatedAt.toISOString().split("T")[0] : "";
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/services/${s.slug}</loc>\n`;
      if (lastMod) xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic projects
    for (const p of projects) {
      const lastMod = p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : "";
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/projects/${p.slug}</loc>\n`;
      if (lastMod) xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
}

export default { getSitemapXml };
