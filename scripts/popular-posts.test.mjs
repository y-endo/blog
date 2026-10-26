import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { getPopularPosts } from "../src/app/_lib/popular-posts.ts";

const originalEnvironment = {
  GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID,
  GA4_ACCESS_TOKEN: process.env.GA4_ACCESS_TOKEN,
};
const posts = [
  { slug: "newest", publishedAt: "2026-10-26" },
  { slug: "recent", publishedAt: "2026-10-20" },
  { slug: "oldest", publishedAt: "2026-01-01" },
  { slug: "middle", publishedAt: "2026-06-01" },
  { slug: "old-c", publishedAt: "2026-02-01" },
  { slug: "old-b", publishedAt: "2026-02-01" },
  { slug: "draft", publishedAt: "2025-01-01", draft: true },
].map((post) => ({
  title: post.slug,
  description: "テスト記事",
  category: "Projects",
  tags: [],
  draft: false,
  image: null,
  imageAlt: "テスト画像",
  ...post,
}));

beforeEach(() => {
  process.env.GA4_PROPERTY_ID = "123456";
  process.env.GA4_ACCESS_TOKEN = "test-token";
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("GAの3件を優先し、重複や下書きを含めず古い記事で5件に補う", async (t) => {
  const originalOrder = posts.map((post) => post.slug);
  const views = [
    ["newest", 30],
    ["oldest", 20],
    ["middle", 10],
    ["draft", 100],
    ["deleted", 100],
  ];
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      rowCount: views.length,
      rows: views.map(([slug, count]) => ({
        dimensionValues: [{ value: `/posts/${slug}/` }],
        metricValues: [{ value: String(count) }],
      })),
    }),
  );

  const result = await getPopularPosts(posts, "example.com");

  assert.deepEqual(
    result.map((post) => post.slug),
    ["newest", "oldest", "middle", "old-b", "old-c"],
  );
  assert.deepEqual(
    posts.map((post) => post.slug),
    originalOrder,
  );
});

test("GAが0件でも公開日の古い順で5件を表示する", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({}));

  const result = await getPopularPosts(posts, "example.com");

  assert.deepEqual(
    result.map((post) => post.slug),
    ["oldest", "old-b", "old-c", "middle", "recent"],
  );
});

test("GAが5件以上あれば閲覧数上位5件だけを表示する", async (t) => {
  const slugs = ["recent", "newest", "middle", "old-c", "old-b", "oldest"];
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      rowCount: slugs.length,
      rows: slugs.map((slug, index) => ({
        dimensionValues: [{ value: `/posts/${slug}/` }],
        metricValues: [{ value: String(slugs.length - index) }],
      })),
    }),
  );

  const result = await getPopularPosts(posts, "example.com");

  assert.deepEqual(
    result.map((post) => post.slug),
    slugs.slice(0, 5),
  );
});

test("GA未設定のローカル環境では通信せず古い公開記事を表示する", async (t) => {
  delete process.env.GA4_PROPERTY_ID;
  delete process.env.GA4_ACCESS_TOKEN;
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("GAへ通信しないこと");
  });

  const result = await getPopularPosts(posts, "example.com");

  assert.deepEqual(
    result.map((post) => post.slug),
    ["oldest", "old-b", "old-c", "middle", "recent"],
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("公開記事が5件未満なら全件を表示し、公開記事がなければ空にする", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({}));

  const result = await getPopularPosts(posts.slice(4), "example.com");

  assert.deepEqual(
    result.map((post) => post.slug),
    ["old-b", "old-c"],
  );
  assert.deepEqual(await getPopularPosts([], "example.com"), []);
});

test("認証・通信エラーを記事の補完で隠さない", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 403 }),
  );

  await assert.rejects(getPopularPosts(posts, "example.com"), /HTTP 403/);
  delete process.env.GA4_ACCESS_TOKEN;
  await assert.rejects(
    getPopularPosts(posts, "example.com"),
    /GA4_PROPERTY_ID/,
  );
});

test("欠落したGAの応答を記事の補完で隠さない", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ rowCount: 1, rows: [] }),
  );

  await assert.rejects(getPopularPosts(posts, "example.com"), /全件取得/);
});
