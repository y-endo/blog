import type { MDXComponents } from "mdx/types";

import { ArticleImage } from "@/components/article-image";

const components = { ArticleImage } satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
