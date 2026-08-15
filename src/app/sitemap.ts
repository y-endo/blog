import type { MetadataRoute } from "next";

import { posts } from "@/lib/posts";
import { getAbsoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: getAbsoluteUrl("/"),
    },
    ...posts.map((post) => ({
      changeFrequency: "monthly" as const,
      lastModified: post.updatedAt ?? post.publishedAt,
      priority: 0.8,
      url: getAbsoluteUrl(`/posts/${post.slug}/`),
    })),
  ];
}
