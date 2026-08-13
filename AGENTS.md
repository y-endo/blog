# Repository Instructions

## Standards

- 変更前に [`docs/standards/README.md`](docs/standards/README.md) と、変更対象に対応する規約を読む。
- TypeScript、React、Next.jsの変更では [`docs/standards/coding/typescript.md`](docs/standards/coding/typescript.md) に従う。
- SCSSの変更では [`docs/standards/coding/scss.md`](docs/standards/coding/scss.md) に従う。
- MDXの変更では [`docs/standards/coding/mdx.md`](docs/standards/coding/mdx.md) に従う。
- ステージングとコミットの前に [`docs/standards/public-repository.md`](docs/standards/public-repository.md) に従う。

## Verification

- コマンドは`mise exec --`を介して実行する。
- 実装後に`mise exec -- pnpm check`と`mise exec -- pnpm build`を実行する。
