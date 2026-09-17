import assert from "node:assert/strict";
import test from "node:test";
import { findUnparsedStrong } from "./check-mdx.mjs";

test("括弧の後に日本語が続く強調の不成立を検出する", () => {
  assert.deepEqual(
    findUnparsedStrong(
      "# 見出し\n\nこの二つの判断を分けるのが、**認証（Authentication）**と**認可（Authorization）**です。",
    ),
    [3],
  );
});

test("通常のMarkdown強調とstrong要素は許可する", () => {
  assert.deepEqual(
    findUnparsedStrong(
      "**認証**（Authentication）と<strong>認可（Authorization）</strong>です。",
    ),
    [],
  );
});

test("コード、frontmatter、JSX属性の記号は本文として検出しない", () => {
  assert.deepEqual(
    findUnparsedStrong(
      '---\ntitle: "**記号**"\ndraft: true\n---\n\n`**記号**`\n\n```mdx\n**認証（Authentication）**です。\n```\n\n<ArticlePoint title="**記号**">説明</ArticlePoint>',
    ),
    [],
  );
});

test("表やMDXコンポーネント内の本文も検査する", () => {
  assert.deepEqual(
    findUnparsedStrong(
      "| 説明 |\n| --- |\n| **認証（Authentication）**です。 |\n\n<ArticlePoint>**認可（Authorization）**です。</ArticlePoint>",
    ),
    [3, 5],
  );
});

test("改行直後の強調の不成立を正しい行番号で報告する", () => {
  assert.deepEqual(
    findUnparsedStrong("説明です。<br />\n**認証（Authentication）**です。"),
    [2],
  );
});
