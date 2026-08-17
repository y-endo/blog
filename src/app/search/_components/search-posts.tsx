"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { ArticleCard } from "@/components/article-card";
import type { Post } from "@/lib/post";

import styles from "./search-posts.module.scss";

type SearchPostsProps = Readonly<{
  posts: readonly Post[];
}>;

export function SearchPosts({ posts }: SearchPostsProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  return (
    <SearchPostsContent
      key={initialQuery}
      initialQuery={initialQuery}
      posts={posts}
    />
  );
}

type SearchPostsContentProps = Readonly<{
  initialQuery: string;
  posts: readonly Post[];
}>;

function SearchPostsContent({ initialQuery, posts }: SearchPostsContentProps) {
  const [query, setQuery] = useState(initialQuery);
  const normalizedQuery = query.trim().toLocaleLowerCase("ja");
  const results = normalizedQuery
    ? posts.filter((post) =>
        [post.title, post.description, post.category, ...post.tags]
          .join(" ")
          .toLocaleLowerCase("ja")
          .includes(normalizedQuery),
      )
    : posts;

  return (
    <section className={styles.search} aria-labelledby="search-results">
      <form
        className={styles.form}
        action="/search/"
        method="get"
        role="search"
      >
        <label htmlFor="article-search">キーワード</label>
        <div className={styles.field}>
          <input
            id="article-search"
            name="q"
            type="search"
            value={query}
            enterKeyHint="search"
            placeholder="例： Next.js、AI、AWS"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="記事を検索">
            <Search aria-hidden="true" />
          </button>
        </div>
      </form>
      <div className={styles.summary} aria-live="polite" aria-atomic="true">
        <h2 id="search-results">検索結果</h2>
        <p>{results.length}件の記事</p>
      </div>
      {results.length > 0 ? (
        <div className={styles.grid}>
          {results.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>該当する記事がありません</h2>
          <p>キーワードを短くするか、別のカテゴリーでお試しください。</p>
          <button type="button" onClick={() => setQuery("")}>
            検索条件をクリア
          </button>
        </div>
      )}
    </section>
  );
}
