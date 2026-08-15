import { ChevronDown } from "lucide-react";

import type { TableOfContentsSection } from "@/lib/post";

import styles from "./article-table-of-contents.module.scss";

type ArticleTableOfContentsProps = Readonly<{
  sections: readonly TableOfContentsSection[];
}>;

export function ArticleTableOfContents({
  sections,
}: ArticleTableOfContentsProps) {
  const headingCount = sections.reduce(
    (count, section) => count + section.children.length + 1,
    0,
  );

  if (headingCount < 2) return null;

  return (
    <details className={styles.tableOfContents}>
      <summary>
        <span>目次</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <nav aria-label="目次">
        <ol>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
              {section.children.length > 0 && (
                <ol>
                  {section.children.map((child) => (
                    <li key={child.id}>
                      <a href={`#${child.id}`}>{child.title}</a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
