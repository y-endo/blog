import type { MDXComponents } from "mdx/types";

import { ArticleImage } from "@/components/article-image";
import { ArticleLink } from "@/components/article-link";
import { ArticlePoint } from "@/components/article-point";
import { ArticleSummary } from "@/components/article-summary";

const components = {
  a: ArticleLink,
  ArticleImage,
  ArticlePoint,
  ArticleSummary,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
