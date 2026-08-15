import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchPosts } from "@/app/search/_components/search-posts";
import { posts } from "@/lib/posts";

import styles from "./page.module.scss";

export const metadata: Metadata = {
  alternates: {
    canonical: "/search/",
  },
  description: "タイトル、概要、カテゴリー、タグから記事を検索できます。",
  robots: {
    follow: true,
    index: false,
  },
  title: "記事を検索",
};

export default function SearchPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.header}>
        <h1>記事を検索</h1>
        <p>タイトル、概要、カテゴリー、タグから記事を探せます。</p>
      </header>
      <Suspense>
        <SearchPosts posts={posts} />
      </Suspense>
    </main>
  );
}
