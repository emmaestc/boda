import type { MetadataRoute } from "next";
import { wedding } from "@/lib/config/wedding";

/**
 * Solo la portada. Las invitaciones personales y la consola quedan fuera a
 * propósito: no deben aparecer en ningún buscador.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: wedding.seo.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
