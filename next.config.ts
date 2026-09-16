import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      "rehype-slug",
      [
        "@shikijs/rehype",
        {
          theme: "min-light",
          colorReplacements: { "#c2c3c5": "var(--color-text-muted)" },
        },
      ],
    ],
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  },
});

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  trailingSlash: true,
};

export default withMDX(nextConfig);
