import type { ReactNode } from "react";

import { ArticleLink } from "@/components/article-link";

import styles from "./article-summary.module.scss";

type ArticleSummaryItem = Readonly<{
  label: string;
  value: ReactNode;
  href?: string;
}>;

type ArticleSummaryProps = Readonly<{
  items: readonly ArticleSummaryItem[];
}>;

export function ArticleSummary({ items }: ArticleSummaryProps) {
  return (
    <aside className={styles.summary} aria-label="この記事について">
      <span className={styles.heading}>この記事について</span>
      <dl className={styles.list}>
        {items.map(({ label, value, href }) => (
          <div className={styles.item} key={label}>
            <dt className={styles.term}>{label}</dt>
            <dd className={styles.description}>
              {href ? <ArticleLink href={href}>{value}</ArticleLink> : value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
