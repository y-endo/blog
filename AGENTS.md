# Repository Instructions

## Standards

- 変更前に [`docs/standards/README.md`](docs/standards/README.md) と、変更対象に対応する規約を読む。
- TypeScript、React、Next.jsの変更では [`docs/standards/coding/typescript.md`](docs/standards/coding/typescript.md) に従う。
- SCSSの変更では [`docs/standards/coding/scss.md`](docs/standards/coding/scss.md) に従う。
- MDXの変更では [`docs/standards/coding/mdx.md`](docs/standards/coding/mdx.md) に従う。
- UIとインタラクションの変更では [`DESIGN.md`](DESIGN.md) に従う。
- ステージングとコミットの前に [`docs/standards/public-repository.md`](docs/standards/public-repository.md) に従う。

## Verification

- コマンドは`mise exec --`を介して実行する。
- 実装後に`mise exec -- pnpm check`と`mise exec -- pnpm build`を実行する。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
