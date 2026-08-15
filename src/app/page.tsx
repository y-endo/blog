import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { HeroCarousel } from "@/app/_components/hero-carousel";
import { ArticleCard } from "@/components/article-card";
import { categories } from "@/lib/categories";
import type { Category } from "@/lib/categories";
import { heroPosts, latestPosts, postTags } from "@/lib/posts";

import styles from "./page.module.scss";

const categoryDescriptions: Readonly<Record<Category, string>> = {
  Projects: "Webサービスと制作記録",
  AI: "AIを使った開発と検証",
  Frontend: "UI実装と技術検証",
  "Backend & Cloud": "AWS、API、認証認可",
  Design: "WebデザインとUI",
  Journal: "食事、子育て、日常",
};

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1 className={styles.visuallyHidden}>
        Web開発、AI、デザインと日々の記録
      </h1>
      {heroPosts.length > 0 ? <HeroCarousel posts={heroPosts} /> : null}
      {postTags.length > 0 ? (
        <nav className={styles.topics} aria-label="記事タグ">
          <strong>TOPICS</strong>
          {postTags.map((tag) => (
            <Link key={tag} href={`/search/?q=${encodeURIComponent(tag)}`}>
              # {tag}
            </Link>
          ))}
        </nav>
      ) : null}
      <section className={styles.section} id="latest">
        <div className={styles.heading}>
          <h2>新着記事</h2>
        </div>
        {latestPosts.length > 0 ? (
          <>
            <div className={styles.grid}>
              {latestPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
            <Link className={styles.primaryLink} href="/search/">
              すべての記事を見る
              <ArrowRight aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p className={styles.emptyMessage}>記事を準備中です。</p>
        )}
      </section>
      <section
        className={styles.searchSection}
        aria-labelledby="home-search-title"
      >
        <div className={styles.searchInner}>
          <div className={styles.searchIntro}>
            <h2 id="home-search-title">気になる技術から探す</h2>
            <p>記事名、概要、カテゴリー、タグから記事を探せます。</p>
          </div>
          <search className={styles.searchPanel}>
            <form className={styles.searchForm} action="/search/" method="get">
              <label className={styles.visuallyHidden} htmlFor="home-search">
                記事を検索
              </label>
              <input
                id="home-search"
                name="q"
                type="search"
                enterKeyHint="search"
                placeholder="例: Next.js、SCSS、日本語"
              />
              <button type="submit" aria-label="記事を検索">
                <Search aria-hidden="true" />
              </button>
            </form>
          </search>
        </div>
      </section>
      <section className={styles.about} id="about">
        <div className={styles.aboutInner}>
          <h2>About</h2>
          <p className={styles.aboutCopy}>
            Webフロントエンドエンジニアとして、実際に試した技術や調べたことを記録しています。最近はAIに関する話題が多めです。ときどき、技術から離れた日常のことも書きます。
          </p>
          <ul className={styles.aboutTopics}>
            {categories.map((category) => (
              <li key={category}>
                <strong>{category}</strong>
                <span>{categoryDescriptions[category]}</span>
              </li>
            ))}
          </ul>
          <Link className={styles.aboutLink} href="/search/">
            記事を探す
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
