import { ArrowRight } from "lucide-react";
import Link from "next/link";

import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div className={styles.inner}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1>ページが見つかりません</h1>
        <p className={styles.description}>
          URLが変更されたか、ページが削除された可能性があります。
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryLink} href="/">
            トップページへ戻る
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className={styles.secondaryLink} href="/search/">
            記事を探す
          </Link>
        </div>
      </div>
    </main>
  );
}
