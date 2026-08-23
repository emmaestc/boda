import type { MetadataRoute } from "next";
import { wedding } from "@/lib/config/wedding";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/i/", "/consola", "/consola/"],
    },
    sitemap: `${wedding.seo.url}/sitemap.xml`,
  };
}
