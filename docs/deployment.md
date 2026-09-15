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

## GA4による人気記事の更新

GitHub Actionsの「Deploy」を`main`ブランチで手動実行すると、GA4から人気記事を取得してサイト全体をビルドし、配信します。
実行時点の`main`にある公開記事やコード変更も配信対象になります。
定期実行はありません。

### GitHubの変数

Settings → Secrets and variables → Actions → Variablesに、次のRepository variablesを登録します。

| 名前                             | 内容                                         |
| -------------------------------- | -------------------------------------------- |
| `GA4_PROPERTY_ID`                | GA4の数字のみのプロパティID                  |
| `GCP_PROJECT_ID`                 | Google CloudのプロジェクトID                 |
| `GCP_SERVICE_ACCOUNT`            | GA4を読むサービスアカウントのメールアドレス  |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Providerの完全なリソース名 |

Google CloudではGoogle Analytics Data APIを有効にし、サービスアカウントをGA4の対象プロパティへ「閲覧者」として追加します。
Workload Identity Federationは、このリポジトリの`main`からサービスアカウントを利用できるように設定します。
認証には`analytics.readonly`スコープの一時アクセストークンを使います。
秘密鍵ファイルは不要です。

### 集計条件と失敗時の動作

- 集計期間はGA4プロパティのタイムゾーンで前日までの30日間です。
- `src/lib/site.ts`のホスト名に一致する記事URLの閲覧数（`screenPageViews`）を集計します。
- URLのクエリ文字列は集計に含めず、末尾スラッシュの有無は合算します。
- 現在公開している記事から閲覧数順に最大5件を表示します。同数の場合はslug順です。
- 削除した記事、下書き、閲覧数0の記事は表示しません。
- 認証失敗、通信失敗、不正な応答、公開記事の閲覧データが0件の場合はビルドを失敗させ、S3への配信を止めます。公開中のサイトはそのまま残ります。
- 記事URLが10,000行を超えて全件取得できない場合も更新を止めます。その規模になった時点でページ分割取得を追加します。

通常のローカル開発とCIではGA4の認証情報を使わず、「よく読まれている記事」を省略します。

初回配信では、ActionsのGoogle認証とビルドの成功を確認し、公開トップページの「よく読まれている記事」を確認します。
認証設定の反映には最大5分程度かかる場合があります。

参考: [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)、[Google認証用Action](https://github.com/google-github-actions/auth)。
