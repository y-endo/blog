import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/post";
import { formatPublishedAt, postImageSize } from "@/lib/post";

import styles from "./article-card.module.scss";

type ArticleCardProps = Readonly<{
  post: Post;
}>;

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link className={styles.card} href={`/posts/${post.slug}/`}>
      <div className={styles.media}>
        {post.image ? (
          <Image
            src={post.image}
            alt=""
            {...postImageSize}
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : null}
      </div>
      <div className={styles.dateLine}>
        <time dateTime={post.publishedAt}>
          {formatPublishedAt(post.publishedAt)}
        </time>
      </div>
      <div className={styles.body}>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <span className={styles.category}>{post.category}</span>
        <ul className={styles.tags} aria-label="タグ">
          {post.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
