import type { MetadataRoute } from "next";

const SITE_URL = "https://envsmith.vercel.app";
const OG_IMAGE = `${SITE_URL}/opengraph-image.png`;

export default function sitemap(): MetadataRoute.Sitemap {
  const images = [OG_IMAGE];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      images,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      images,
    },
  ];
}

