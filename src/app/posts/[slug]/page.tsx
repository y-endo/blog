import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleTableOfContents } from "@/app/posts/[slug]/_components/article-table-of-contents";
import { formatPublishedAt, postImageSize } from "@/lib/post";
import { getPost, getPostTableOfContents, postSlugs } from "@/lib/posts";
import { getAbsoluteUrl, openGraphImage, siteName } from "@/lib/site";

import styles from "./page.module.scss";

type PostPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  const canonicalPath = `/posts/${post.slug}/`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description: post.description,
    openGraph: {
      description: post.description,
      images: [openGraphImage],
      locale: "ja_JP",
      modifiedTime: post.updatedAt ?? post.publishedAt,
      publishedTime: post.publishedAt,
      siteName,
      tags: [...post.tags],
      title: post.title,
      type: "article",
      url: canonicalPath,
    },
    title: post.title,
    twitter: {
      card: "summary_large_image",
      description: post.description,
      images: [openGraphImage],
      title: post.title,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const { default: PostContent } = await import(
    `../../../../content/posts/${slug}.mdx`
  );

  const tableOfContents = getPostTableOfContents(slug);
  const canonicalUrl = getAbsoluteUrl(`/posts/${post.slug}/`);
  const categoryPath = `/search/?q=${encodeURIComponent(post.category)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      dateModified: post.updatedAt ?? post.publishedAt,
      datePublished: post.publishedAt,
      description: post.description,
      headline: post.title,
      image: getAbsoluteUrl(openGraphImage.url),
      inLanguage: "ja-JP",
      keywords: post.tags.join(", "),
      mainEntityOfPage: {
        "@id": canonicalUrl,
        "@type": "WebPage",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: getAbsoluteUrl("/"),
          name: "ホーム",
          position: 1,
        },
        {
          "@type": "ListItem",
          item: getAbsoluteUrl(categoryPath),
          name: post.category,
          position: 2,
        },
        {
          "@type": "ListItem",
          name: post.title,
          position: 3,
        },
      ],
    },
  ];

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
          }}
        />
        <header className={styles.articleHeader}>
          <nav className={styles.breadcrumbs} aria-label="パンくず">
            <ol>
              <li>
                <Link href="/">ホーム</Link>
              </li>
              <li>
                <Link href={categoryPath}>{post.category}</Link>
              </li>
              <li>
                <span aria-current="page">{post.title}</span>
              </li>
            </ol>
          </nav>
          <span className={styles.category}>{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <div className={styles.meta}>
            <time dateTime={post.publishedAt}>
              {formatPublishedAt(post.publishedAt)}
            </time>
          </div>
        </header>
        {post.image ? (
          <figure className={styles.hero}>
            <Image
              src={post.image}
              alt={post.imageAlt}
              {...postImageSize}
              sizes="(min-width: 1024px) 960px, 100vw"
              loading="eager"
              preload
            />
          </figure>
        ) : null}
        <ArticleTableOfContents sections={tableOfContents} />
        <div className={styles.body}>
          <PostContent />
          <div className={styles.tags} aria-label="タグ">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/search/?q=${encodeURIComponent(tag)}`}>
                # {tag}
              </Link>
            ))}
          </div>
          <Link className={styles.searchLink} href="/search/">
            ほかの記事を探す
          </Link>
        </div>
      </article>
    </main>
  );
}
