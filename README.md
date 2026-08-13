# Blog

Next.jsのStatic Exportで生成し、Amazon S3とCloudFrontで配信する技術ブログです。

## Development

Node.jsとpnpmはmiseで管理します。

```bash
mise trust
mise install
git config core.hooksPath .githooks
pnpm install
pnpm dev
```

検証には次のコマンドを使用します。

```bash
pnpm verify
```

開発規約は [`docs/standards/README.md`](docs/standards/README.md) を参照してください。

デプロイ準備は [`docs/deployment.md`](docs/deployment.md) を参照してください。
