import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { createProcessor } from "@mdx-js/mdx";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { isCategory } from "@/lib/categories";
import type {
  Post,
  TableOfContentsItem,
  TableOfContentsSection,
} from "@/lib/post";
import { postModules } from "@/lib/post-modules";

const contentDirectory = join(process.cwd(), "content/posts");
const postImagesDirectory = join(process.cwd(), "public/images/posts");

type PostSource = Readonly<{
  post: Post;
  tableOfContents: readonly TableOfContentsSection[];
}>;

function parseTableOfContents(source: string, fileName: string) {
  const tree = createProcessor().parse(source);
  const slugger = new GithubSlugger();
  const sections: Array<
    TableOfContentsItem & { children: TableOfContentsItem[] }
  > = [];

  for (const node of tree.children) {
    if (node.type !== "heading") continue;

    const title = toString(node).trim();
    if (!title) throw new Error(`${fileName}: 空の見出しは使用できません。`);

    const item = { id: slugger.slug(title), title };
    if (node.depth === 2) {
      sections.push({ ...item, children: [] });
    } else if (node.depth === 3) {
      const section = sections.at(-1);
      if (!section) {
        throw new Error(`${fileName}: H3の前にH2が必要です。`);
      }
      section.children.push(item);
    }
  }

  return sections;
}

function parseList(value: string) {
  if (!value.startsWith("[") || !value.endsWith("]")) {
    throw new Error("tagsは角括弧の配列で指定してください。");
  }

  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
}

function parseBoolean(value: string, field: string, fileName: string) {
  if (value !== "true" && value !== "false") {
    throw new Error(`${fileName}: ${field}は真偽値で指定してください。`);
  }

  return value === "true";
}

function readPost(fileName: string): PostSource {
  const source = readFileSync(join(contentDirectory, fileName), "utf8");
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/.exec(source);

  if (!match?.[1] || match[2] === undefined) {
    throw new Error(`${fileName}: Frontmatterがありません。`);
  }

  const requiredFields = [
    "title",
    "description",
    "publishedAt",
    "tags",
    "draft",
    "category",
    "imageAlt",
  ] as const;
  const allowedFields = new Set<string>([...requiredFields, "updatedAt"]);
  const fields: Record<string, string> = {};

  for (const line of match[1].replace(/\n {2,}/g, " ").split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) {
      throw new Error(`${fileName}: Frontmatterが不正です。`);
    }

    const field = line.slice(0, separator);
    if (!allowedFields.has(field)) {
      throw new Error(`${fileName}: 未知の項目「${field}」があります。`);
    }
    if (field in fields) {
      throw new Error(`${fileName}: ${field}が重複しています。`);
    }

    fields[field] = line.slice(separator + 1).trim();
  }

  for (const field of requiredFields) {
    if (!fields[field]) throw new Error(`${fileName}: ${field}がありません。`);
  }

  const getField = (field: (typeof requiredFields)[number]) => {
    const value = fields[field];
    if (!value) throw new Error(`${fileName}: ${field}がありません。`);
    return value;
  };
  const title = getField("title");
  const description = getField("description");
  const publishedAt = getField("publishedAt");
  const updatedAt = fields.updatedAt || undefined;
  const tags = getField("tags");
  const draft = parseBoolean(getField("draft"), "draft", fileName);
  const category = getField("category");
  const imageAlt = getField("imageAlt");
  const slug = fileName.replace(/\.mdx$/, "");
  const image = `/images/posts/${slug}/hero.webp`;
  const imageFile = join(postImagesDirectory, slug, "hero.webp");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    throw new Error(
      `${fileName}: publishedAtはYYYY-MM-DD形式で指定してください。`,
    );
  }
  if (updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(updatedAt)) {
    throw new Error(
      `${fileName}: updatedAtはYYYY-MM-DD形式で指定してください。`,
    );
  }
  if (updatedAt && updatedAt < publishedAt) {
    throw new Error(`${fileName}: updatedAtはpublishedAt以降にしてください。`);
  }
  if (!isCategory(category)) {
    throw new Error(`${fileName}: 未知のカテゴリー「${category}」です。`);
  }

  const hasImage = existsSync(imageFile);
  if (!draft && !hasImage) {
    throw new Error(`${fileName}: ${image}がありません。`);
  }

  return {
    post: {
      slug,
      title,
      description,
      publishedAt,
      updatedAt,
      tags: parseList(tags),
      draft,
      category,
      image: hasImage ? image : null,
      imageAlt,
    },
    tableOfContents: parseTableOfContents(match[2], fileName),
  };
}

const postSources = Object.keys(postModules)
  .map((postPath) => basename(postPath))
  .map(readPost)
  .sort((left, right) =>
    right.post.publishedAt.localeCompare(left.post.publishedAt),
  );
const publishedPostSources = postSources.filter(({ post }) => !post.draft);

export const posts = publishedPostSources.map(({ post }) => post);
const generatedPostSources =
  process.env.NODE_ENV === "production" ? publishedPostSources : postSources;
// Static Export requires one generated parameter even before the first article is published.
export const postSlugs =
  generatedPostSources.length > 0
    ? generatedPostSources.map(({ post }) => post.slug)
    : ["__no-published-posts__"];
export const postTags = [...new Set(posts.flatMap(({ tags }) => tags))];

export const heroPosts = posts.slice(0, 3);
export const latestPosts = posts.slice(0, 5);
export const popularPosts = ["building-blog-with-ai", "building-portfolio"]
  .map((slug) => posts.find((post) => post.slug === slug))
  .filter((post) => post !== undefined);

function getPostSource(slug: string) {
  const source = postSources.find(({ post }) => post.slug === slug);
  if (source?.post.draft && process.env.NODE_ENV === "production") {
    return undefined;
  }

  return source;
}

export function getPost(slug: string) {
  return getPostSource(slug)?.post;
}

export function getPostTableOfContents(slug: string) {
  return getPostSource(slug)?.tableOfContents ?? [];
}
