import { ExternalLink } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { siteUrl } from "@/lib/site";

import styles from "./article-link.module.scss";

type ArticleLinkProps = Readonly<ComponentPropsWithoutRef<"a">>;

export function ArticleLink({
  children,
  className,
  href,
  rel,
  target,
  ...props
}: ArticleLinkProps) {
  const url = new URL(href ?? "", siteUrl);
  const isExternal =
    (url.protocol === "http:" || url.protocol === "https:") &&
    url.origin !== siteUrl.origin;

  return (
    <a
      {...props}
      className={
        isExternal
          ? [styles.externalLink, className].filter(Boolean).join(" ")
          : className
      }
      href={href}
      rel={isExternal ? "noopener noreferrer" : rel}
      target={isExternal ? "_blank" : target}
    >
      {children}
      {isExternal ? (
        <>
          <ExternalLink className={styles.externalIcon} aria-hidden="true" />
          <span className={styles.visuallyHidden}>
            （新しいタブで開きます）
          </span>
        </>
      ) : null}
    </a>
  );
}
