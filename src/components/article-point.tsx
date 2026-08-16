import type { ReactNode } from "react";

import styles from "./article-point.module.scss";

type ArticlePointProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

export function ArticlePoint({ title, children }: ArticlePointProps) {
  return (
    <aside className={styles.point} aria-label={`POINT: ${title}`}>
      <span className={styles.label}>POINT</span>
      <strong className={styles.title}>{title}</strong>
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
