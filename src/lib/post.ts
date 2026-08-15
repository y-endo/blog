import type { Category } from "@/lib/categories";

export const postImageSize = {
  height: 1080,
  width: 1440,
} as const;

export type Post = Readonly<{
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: Category;
  tags: readonly string[];
  draft: boolean;
  image: string | null;
  imageAlt: string;
}>;

export type TableOfContentsItem = Readonly<{
  id: string;
  title: string;
}>;

export type TableOfContentsSection = TableOfContentsItem &
  Readonly<{
    children: readonly TableOfContentsItem[];
  }>;

export function formatPublishedAt(publishedAt: string) {
  return publishedAt.replaceAll("-", ".");
}
