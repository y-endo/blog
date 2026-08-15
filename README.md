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

## Article

記事は`content/posts/<記事slug>.mdx`へ追加します。
メイン画像は`public/images/posts/<記事slug>/hero.webp`へ置きます。
TypeScriptへの記事登録は不要です。

執筆中は`draft: true`にし、開発サーバーの`/posts/<記事slug>/`で確認します。
公開時はメイン画像を用意して`draft: false`へ変更します。

開発規約は [`docs/standards/README.md`](docs/standards/README.md) を参照してください。

デプロイ準備は [`docs/deployment.md`](docs/deployment.md) を参照してください。
