import type { MetadataRoute } from "next";
import { SEO_FOOD_TEMPLATES } from "@/data/seo-templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://nutrilabel-eu.vercel.app";

  const programmaticRoutes: MetadataRoute.Sitemap = SEO_FOOD_TEMPLATES.map(
    (tpl) => ({
      url: `${baseUrl}/for/${tpl.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/elabel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...programmaticRoutes,
  ];
}
