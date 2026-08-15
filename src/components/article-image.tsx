import Image from "next/image";
import type { StaticImageData } from "next/image";

import styles from "./article-image.module.scss";

type ArticleImageProps = Readonly<{
  src: StaticImageData;
  alt: string;
  caption?: string;
}>;

export function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <figure className={styles.figure}>
      <Image src={src} alt={alt} sizes="(min-width: 768px) 760px, 100vw" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
