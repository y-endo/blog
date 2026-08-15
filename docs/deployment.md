# デプロイ準備

`.github/workflows/deploy.yml`は手動実行だけを許可し、GitHub ActionsのOIDCでAWSへ接続します。
公開記事が0件の場合は、AWSへ接続する前にデプロイを停止します。

## GitHub Environment

`production` Environmentを作成し、必要に応じて承認者を設定します。

次のEnvironment variablesを登録します。

| 名前                         | 内容                                     |
| ---------------------------- | ---------------------------------------- |
| `AWS_ROLE_ARN`               | GitHub Actionsが引き受けるIAM RoleのARN  |
| `AWS_REGION`                 | S3バケットを配置したAWS Region           |
| `S3_BUCKET`                  | 静的ファイル専用S3バケットの名前         |
| `CLOUDFRONT_DISTRIBUTION_ID` | 配信に使用するCloudFront Distribution ID |

## AWS

- S3バケットはこのブログ専用とし、Block Public Accessを有効にします。
- CloudFrontはS3 Website Endpointではなく、通常のS3 OriginへOACで接続します。
- IAM Roleの信頼条件は、このリポジトリの`production` Environmentへ限定します。
- IAM Roleには、対象バケットの同期と対象DistributionのInvalidationに必要な権限だけを付与します。
- `trailingSlash: true`で生成したURLを`index.html`へ解決するViewer request処理をCloudFront Functionへ設定します。
- CloudFrontのカスタムエラーレスポンスで、S3からの`403`と`404`を`/404.html`へ割り当て、レスポンスコードを`404`にします。OACを利用するS3 Originでは、存在しないオブジェクトが`403`になる場合があるため両方を設定します。
- エラーレスポンスのキャッシュ時間は、公開前の確認中は`0`、運用開始後は更新頻度に合わせて短い値へ設定します。

AWSリソース自体は、このスケルトンでは作成しません。
