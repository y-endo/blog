import Image from "next/image";
import Link from "next/link";

import { siteLogoPath, siteName } from "@/lib/site";

import styles from "./site-footer.module.scss";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/">
          <Image src={siteLogoPath} alt={siteName} width={1808} height={191} />
        </Link>
        <div className={styles.rail}>
          <nav aria-label="フッターナビゲーション">
            <ul>
              <li>
                <Link href="/#latest">新着記事</Link>
              </li>
              <li>
                <Link href="/search/">検索</Link>
              </li>
              <li>
                <Link href="/#about">About</Link>
              </li>
            </ul>
          </nav>
          <small className={styles.copyright}>© 2026 {siteName}</small>
        </div>
      </div>
    </footer>
  );
}
