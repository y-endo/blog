import { readdir, readFile } from "node:fs/promises";
import { createProcessor } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

// next.config.tsと同じMarkdown構文で、コード以外の本文を検査する。
const processor = createProcessor({
  remarkPlugins: [remarkFrontmatter, remarkGfm],
});

export function findUnparsedStrong(source) {
  const lines = new Set();

  function visit(node) {
    if (node.type === "text" && node.value.includes("**")) {
      const prefix = node.value.slice(0, node.value.indexOf("**"));
      lines.add(node.position.start.line + prefix.split("\n").length - 1);
    }

    for (const child of node.children ?? []) {
      visit(child);
    }
  }

  visit(processor.parse(source));
  return [...lines];
}

if (import.meta.main) {
  const postsDirectory = new URL("../content/posts/", import.meta.url);
  const files = (await readdir(postsDirectory)).filter((file) =>
    file.endsWith(".mdx"),
  );

  for (const file of files) {
    const source = await readFile(new URL(file, postsDirectory), "utf8");

    for (const line of findUnparsedStrong(source)) {
      console.error(
        `content/posts/${file}:${line}: 強調として認識されていない ** があります。<strong>を使い、記号の説明はインラインコードにしてください。`,
      );
      process.exitCode = 1;
    }
  }

  if (!process.exitCode) {
    console.log(`MDXの強調表記: ${files.length}記事を検査しました。`);
  }
}
