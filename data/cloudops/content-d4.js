// CloudOps教材 分野4(セキュリティとコンプライアンス)の章コンテンツ
export const chapters = [
  {
    id: "cloudops-d4-ch01",
    domain: 4,
    title: "IAM運用とマルチアカウント統制",
    sections: [
      {
        heading: "IAMポリシーの種類と評価ロジック",
        html: `
<p>AWS Identity and Access Management(IAM)のアクセス制御は、複数種類のポリシーの組み合わせで決まります。運用中の「アクセスできない」トラブルの多くは、どのポリシーが評価に効いているかの見落としが原因です。</p>
<ul>
  <li><strong>アイデンティティベースポリシー</strong>: IAMユーザー・グループ・ロールにアタッチするポリシー</li>
  <li><strong>リソースベースポリシー</strong>: S3バケットポリシーやKMSキーポリシーなど、リソース側に設定するポリシー</li>
  <li><strong>SCP・アクセス許可の境界</strong>: 権限そのものは付与せず、使用できる権限の<strong>上限</strong>を定めるガードレール</li>
</ul>
<p>評価の大原則は2つです。<strong>(1) 明示的なDenyが1つでもあれば必ず拒否される、(2) どこにも明示的なAllowがなければ暗黙的に拒否される</strong>。同一アカウント内へのアクセスはアイデンティティベースかリソースベースのどちらかにAllowがあれば許可されますが、クロスアカウントアクセスでは両側でAllowが必要です。</p>
<h4>試験頻出のグローバル条件キー</h4>
<div class="table-wrap">
<table>
  <thead><tr><th>条件キー</th><th>用途</th></tr></thead>
  <tbody>
    <tr><td>aws:SourceIp</td><td>送信元IPアドレスによる制限</td></tr>
    <tr><td>aws:RequestedRegion</td><td>操作対象リージョンの制限(SCPでのリージョン制限に頻出)</td></tr>
    <tr><td>aws:MultiFactorAuthPresent</td><td>MFA認証済みセッションかどうかの判定</td></tr>
    <tr><td>aws:PrincipalOrgID</td><td>自組織(Organizations)のプリンシパルに限定</td></tr>
    <tr><td>aws:SecureTransport</td><td>HTTPS(TLS)経由のリクエストかどうかの判定</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important"><span class="callout-title">重要</span><p>IAMポリシーでAllowされているのに拒否される場合は、SCP・リソースポリシー・アクセス許可の境界のいずれかにある明示的なDeny、またはクロスアカウント時のリソース側の許可漏れを疑うのが定石です。</p></div>`,
      },
      {
        heading: "「アクセスできない」問題の切り分け",
        html: `
<p>「昨日まで動いていた処理がAccessDeniedになった」という問い合わせは運用の定番です。SOA-C03では、原因調査に使うツールの使い分けが繰り返し問われます。</p>
<ol>
  <li>エラーメッセージから「どのプリンシパルが・どのアクションで・どのリソースに」拒否されたかを読み取る</li>
  <li>AWS CloudTrailで該当のAPI呼び出しを検索し、エラーコード(AccessDeniedなど)と発生時刻・実行者を確認する</li>
  <li>IAMポリシーシミュレーターで、実際のリソースに影響を与えずにポリシー評価を再現する</li>
  <li>IAM Access Analyzerのポリシー検証・外部アクセス検出で、設定ミスや意図しない共有を洗い出す</li>
</ol>
<div class="table-wrap">
<table>
  <thead><tr><th>ツール</th><th>役割</th><th>特徴</th></tr></thead>
  <tbody>
    <tr><td>IAMポリシーシミュレーター</td><td>ポリシー評価の事前検証・再現</td><td>APIを実行せずにAllow/Denyの結果と、拒否したステートメントを特定できる</td></tr>
    <tr><td>IAM Access Analyzer</td><td>外部アクセスの検出とポリシー検証</td><td>信頼ゾーン(アカウント/組織)の外部からアクセス可能なS3・IAMロール・KMSキーなどを継続的に検出</td></tr>
    <tr><td>AWS CloudTrail</td><td>実際に発生した操作の記録</td><td>「誰が・いつ・何を」の事後調査。イベント履歴で確認できるのは過去90日分</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>CloudTrailのイベント履歴は<strong>過去90日分</strong>です。それより古い操作を調査するには、証跡(トレイル)がS3バケットに配信したログファイルをAmazon Athenaなどでクエリします。</p></div>`,
      },
      {
        heading: "パスワードポリシーとMFAによる認証強化",
        html: `
<p>IAMユーザーを利用する環境では、アカウントのパスワードポリシーとMFAが認証強化の基本です。</p>
<ul>
  <li><strong>パスワードポリシー</strong>: 最小文字数、大文字・小文字・数字・記号の必須化、有効期間、再利用の禁止をアカウント単位で設定できます</li>
  <li><strong>MFA</strong>: 仮想MFAデバイス、FIDOセキュリティキー、ハードウェアTOTPトークンをサポートします。ルートユーザーには必ず設定し、アクセスキーは作成しないのが原則です</li>
  <li><strong>認証情報レポート</strong>: 全IAMユーザーのパスワード・アクセスキー・MFAの利用状況をCSVで棚卸しできます</li>
</ul>
<p>API操作のレベルでMFAを強制するには、条件キー<code>aws:MultiFactorAuthPresent</code>を使います。次の例は、MFA未認証のセッションによる削除操作を明示的に拒否します。</p>
<pre><code>{
  "Effect": "Deny",
  "Action": "s3:DeleteObject",
  "Resource": "arn:aws:s3:::secure-bucket/*",
  "Condition": {
    "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }
  }
}</code></pre>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>BoolIfExistsを使うと、MFA情報を持たない(キー自体が存在しない)リクエストも拒否の対象にできます。「機密操作はMFA必須にしたい」という要件が出たらこの条件キーを思い出してください。</p></div>`,
      },
      {
        heading: "OrganizationsとSCP、IAM Identity Centerによるマルチアカウント統制",
        html: `
<p>マルチアカウント環境では、AWS Organizationsで組織単位(OU)の階層を構成し、サービスコントロールポリシー(SCP)でガードレールを敷きます。SCPの性質は試験の頻出論点です。</p>
<ul>
  <li>SCPは<strong>アクセス許可を付与しません</strong>。使用できる権限の上限を定めるフィルタであり、実際の許可はIAMポリシーで別途必要です</li>
  <li>SCPは<strong>管理アカウントのプリンシパルには適用されません</strong>(メンバーアカウントのユーザー・ロールには適用されます)</li>
  <li>デフォルトでは全許可のFullAWSAccessがアタッチされており、そこにDenyステートメントを追加していく拒否リスト方式が一般的です</li>
</ul>
<p>承認済みリージョン以外での操作を禁止するSCPの例です(IAMなどのグローバルサービスは除外します)。</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyOutsideApprovedRegions",
    "Effect": "Deny",
    "NotAction": ["iam:*", "organizations:*", "sts:*", "support:*"],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": { "aws:RequestedRegion": ["ap-northeast-1", "us-east-1"] }
    }
  }]
}</code></pre>
<p>人のアクセスは<strong>AWS IAM Identity Center</strong>で一元管理します。Microsoft Entra IDなどの外部IdPとSAML/SCIMで連携し、<strong>許可セット</strong>を通じて複数アカウントへの一時的なロールベースアクセスを割り当てられるため、アカウントごとにIAMユーザーを作成・管理する必要がなくなります。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「SCPで許可したのに操作できない」→ SCPは許可を付与しない、「管理アカウントで制限が効かない」→ SCPは管理アカウントに適用されない、という2つのひっかけが定番です。</p></div>`,
      },
      {
        heading: "Trusted AdvisorとAWS Configによる継続的監査",
        html: `
<p>設定不備の検出とコンプライアンスの継続評価には、AWS Trusted AdvisorとAWS Configを使い分けます。</p>
<p><strong>Trusted Advisorのセキュリティチェック</strong>は、AWSのベストプラクティスからの乖離を自動検出します。代表的なチェック項目は次のとおりです(利用できる項目数はサポートプランによって異なります)。</p>
<ul>
  <li>オープンアクセスを許可しているS3バケットのアクセス許可</li>
  <li>特定ポートを0.0.0.0/0に開放しているセキュリティグループ</li>
  <li>ルートユーザーのMFA未設定、IAMの使用状況、公開されたアクセスキー</li>
</ul>
<p><strong>AWS Config</strong>は「あるべき構成」への準拠を継続的に評価します。マネージドルール(例: S3バケットの暗号化必須、SSHの無制限開放の禁止)で非準拠リソースを検出し、AWS Systems Manager Automationドキュメントを使った<strong>修復アクション</strong>で自動是正まで構成できます。</p>
<p><strong>コンフォーマンスパック</strong>は、Configルールと修復アクションをひとまとめにしたテンプレートです。「Operational Best Practices」系のサンプルパックをアカウント全体や組織全体に一括デプロイし、準拠状況をコンプライアンススコアとして継続的に追跡できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>要件</th><th>使うサービス</th></tr></thead>
  <tbody>
    <tr><td>既知のリスク設定をベストプラクティスと比較して手軽に確認したい</td><td>Trusted Advisor(セキュリティチェック)</td></tr>
    <tr><td>社内基準への準拠を継続評価し、非準拠を自動修復したい</td><td>AWS Config(ルール+修復アクション)</td></tr>
    <tr><td>多数のルール一式を複数アカウントへまとめて展開したい</td><td>AWS Configコンフォーマンスパック</td></tr>
  </tbody>
</table>
</div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d4-ch01-q01",
      "cloudops-d4-ch01-q02",
      "cloudops-d4-ch01-q03",
      "cloudops-d4-ch01-q04",
      "cloudops-d4-ch01-q05",
      "cloudops-d4-ch01-q06",
      "cloudops-d4-ch01-q07",
      "cloudops-d4-ch01-q08",
      "cloudops-d4-ch01-q09",
      "cloudops-d4-ch01-q10",
    ],
  },
  {
    id: "cloudops-d4-ch02",
    domain: 4,
    title: "データ保護と検出的統制",
    sections: [
      {
        heading: "KMSによる保管時暗号化の設計",
        html: `
<p>保管時の暗号化はAWS Key Management Service(AWS KMS)のKMSキーで実装します。Amazon EBS・Amazon S3・Amazon RDSなど主要サービスはKMSと統合されており、運用者はキーの種類と権限設計を理解しておく必要があります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>AWSマネージドキー(aws/s3 など)</th><th>カスタマーマネージドキー</th></tr></thead>
  <tbody>
    <tr><td>キーポリシーの編集</td><td>不可</td><td>可</td></tr>
    <tr><td>ローテーション</td><td>自動(変更不可)</td><td>自動ローテーションを任意に有効化できる</td></tr>
    <tr><td>クロスアカウント利用</td><td>不可</td><td>可(キーポリシーで許可)</td></tr>
    <tr><td>無効化・削除</td><td>不可</td><td>可(削除には7〜30日の待機期間)</td></tr>
  </tbody>
</table>
</div>
<p>運用上の重要な制約として、RDSインスタンスやEBSボリュームの暗号化は<strong>作成時にのみ</strong>指定できます。既存の非暗号化リソースを暗号化するには、スナップショットを取得して暗号化済みのコピーを作成し、そこから復元します。</p>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>クロスアカウント共有・キーポリシーの制御・無効化や削除の要件が1つでもあれば、カスタマーマネージドキーを選択します。監査でキー利用を追跡したい場合もCloudTrailに記録されるカスタマーマネージドキーが基本です。</p></div>`,
      },
      {
        heading: "KMSの「アクセス拒否」トラブルシューティング",
        html: `
<p>KMS関連のアクセス拒否は分野4で最頻出のトラブルです。典型パターンと対処を押さえます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>事象</th><th>原因</th><th>対処</th></tr></thead>
  <tbody>
    <tr><td>SSE-KMSのS3オブジェクト取得でAccessDenied</td><td>S3権限はあるが、キーに対するkms:Decryptがない</td><td>キーポリシーまたはIAMポリシーでkms:Decryptを許可</td></tr>
    <tr><td>暗号化EBSボリュームを使うインスタンスが起動しない</td><td>キーが無効化または削除保留になっている</td><td>キーを再有効化(削除保留はキャンセル)</td></tr>
    <tr><td>共有した暗号化スナップショットから相手先がボリュームを作成できない</td><td>キーポリシーで共有先アカウントにキーの使用が許可されていない</td><td>キーポリシーにkms:Decrypt・kms:DescribeKey・kms:CreateGrantなどを許可</td></tr>
    <tr><td>IAMポリシーにkms:*があるのにキーを使用できない</td><td>キーポリシーがIAMポリシーへの委任(アカウントrootへの許可)を含んでいない</td><td>キーポリシーを確認・修正</td></tr>
  </tbody>
</table>
</div>
<p>調査の起点はAWS CloudTrailです。kms:Decryptなどの呼び出しのエラーコードとメッセージから、どのポリシーが拒否したかを特定します。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p>キーポリシーはKMS特有のリソースポリシーで、<strong>常に評価されます</strong>。キーポリシーがアカウント(root)へ許可を委任している場合に限り、IAMポリシーでの許可が有効になります。IAM側だけを見ていても原因にたどり着けません。</p></div>
<p>あわせて、AWSマネージドキー(aws/ebs)で暗号化されたスナップショットは他アカウントへ共有できないこと、Auto Scalingのようにサービスがユーザーに代わってキーを使用する場面では<strong>グラント</strong>(一時的な使用許可の委任)が使われることも覚えておきましょう。</p>`,
      },
      {
        heading: "ACMによる転送時暗号化と証明書更新",
        html: `
<p>転送時の暗号化(HTTPS/TLS)にはAWS Certificate Manager(ACM)のパブリック証明書を使うのが基本です。証明書はElastic Load Balancing(ELB)、Amazon CloudFront、Amazon API Gatewayなどに関連付けます。運用で問われるのは<strong>検証方式と自動更新</strong>です。</p>
<ul>
  <li><strong>DNS検証</strong>: 検証用CNAMEレコードをDNSに登録します。レコードが維持され、証明書が使用中である限り、有効期限前に<strong>自動更新</strong>されます(推奨)</li>
  <li><strong>Eメール検証</strong>: ドメイン管理者宛メールの承認が必要で、更新のたびに手作業が発生しやすい方式です</li>
  <li><strong>インポート証明書</strong>: 外部発行の証明書も利用できますが、マネージド更新の対象外で、期限管理と再インポートを自分で行います</li>
</ul>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>CloudFrontに関連付ける証明書は<strong>米国東部(バージニア北部)us-east-1</strong>のACMで発行・インポートされている必要があります。ALB用の証明書はALBと同じリージョンで発行します。</p></div>
<p>期限切れ事故の防止には、AWS Configのマネージドルール<code>acm-certificate-expiration-check</code>による監視や、ACMの有効期限イベントをAmazon EventBridge経由で通知する構成が有効です。「証明書の有効期限警告を受け取った。今後の手作業を減らしたい」というシナリオでは、DNS検証への移行と検証用CNAMEの維持が正答の軸になります。</p>`,
      },
      {
        heading: "Secrets Managerによるシークレット管理とローテーション",
        html: `
<p>データベースパスワードやAPIキーをコード・設定ファイルにハードコードするのはアンチパターンです。AWS Secrets Managerに保存し、IAMで取得を制御し、KMSで暗号化します。</p>
<ul>
  <li><strong>自動ローテーション</strong>: Amazon RDSなどのデータベースには<strong>マネージドローテーション</strong>が用意されており、スケジュールを指定するだけでパスワードの自動更新とシークレットへの反映が行われます。その他のシークレットもLambdaローテーション関数で自動化できます</li>
  <li><strong>取得とキャッシュ</strong>: アプリケーションが起動時に1回だけ取得して保持し続けると、ローテーション後に認証エラーが発生します。認証エラー時の再取得や、キャッシュへの有効期限の設定を実装します</li>
  <li><strong>ネットワーク</strong>: プライベートサブネットからはインターフェイス型VPCエンドポイント経由で取得できます</li>
</ul>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>Secrets Manager</th><th>Systems Manager Parameter Store</th></tr></thead>
  <tbody>
    <tr><td>主な用途</td><td>認証情報・APIキーなどのシークレット専用</td><td>アプリ設定値全般(SecureStringでシークレットも可)</td></tr>
    <tr><td>自動ローテーション</td><td>組み込み(RDS等はマネージドローテーション)</td><td>組み込み機能なし(自作が必要)</td></tr>
    <tr><td>コスト</td><td>シークレット単位で有料</td><td>標準パラメータは追加料金なし</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「自動ローテーションが要件」ならSecrets Manager、「単なる設定値の保管でコスト最小」ならParameter Store、が定番の判断基準です。</p></div>`,
      },
      {
        heading: "検出的統制の役割分担・修復フロー・データ分類",
        html: `
<p>セキュリティ検出系サービスは名前が似ているため、<strong>何を検出するか</strong>で明確に区別します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>検出対象</th></tr></thead>
  <tbody>
    <tr><td>Amazon GuardDuty</td><td>脅威検出。CloudTrail・VPCフローログ・DNSログなどを分析し、不審なAPI呼び出しや暗号通貨マイニング通信などを検出</td></tr>
    <tr><td>Amazon Inspector</td><td>脆弱性管理。EC2・ECRコンテナイメージ・Lambdaのソフトウェア脆弱性(CVE)と意図しないネットワーク露出を継続スキャン</td></tr>
    <tr><td>Amazon Macie</td><td>S3上の機密データ検出。個人情報(PII)などを発見し、データ分類を支援</td></tr>
    <tr><td>AWS Config</td><td>リソース構成の記録と、ルールへの準拠評価</td></tr>
    <tr><td>AWS Security Hub</td><td>各サービスの検出結果の集約と、セキュリティ標準(AWS基礎セキュリティベストプラクティス、CISなど)によるチェック</td></tr>
  </tbody>
</table>
</div>
<h4>検出から修復までの標準フロー</h4>
<ol>
  <li>GuardDuty・Inspector・Configなどが検出結果を生成し、Security Hubに集約する</li>
  <li>Amazon EventBridgeルールで重要度・検出タイプをフィルタする</li>
  <li>AWS Systems Manager AutomationランブックやAWS Lambdaで初動対応(隔離用セキュリティグループへの付け替え、公開設定の是正など)を自動実行する</li>
  <li>Amazon SNSでセキュリティチームへ通知し、根本対応につなげる</li>
</ol>
<p><strong>データ分類</strong>では、機密度(公開・社内限定・機密など)の分類スキームを定義し、リソースタグやMacieの検出結果と対応付けます。そのうえで「機密データはカスタマーマネージドキーで暗号化し、アクセスを限定する」といった統制をAWS Configで継続的に検証します。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「CVE・脆弱性」ならInspector、「S3の個人情報・データ分類」ならMacie、「不審な通信・侵害の兆候」ならGuardDuty、「集約・標準チェック」ならSecurity Hub。検出結果からの自動対応はEventBridgeを起点に組みます。</p></div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d4-ch02-q01",
      "cloudops-d4-ch02-q02",
      "cloudops-d4-ch02-q03",
      "cloudops-d4-ch02-q04",
      "cloudops-d4-ch02-q05",
      "cloudops-d4-ch02-q06",
      "cloudops-d4-ch02-q07",
      "cloudops-d4-ch02-q08",
      "cloudops-d4-ch02-q09",
      "cloudops-d4-ch02-q10",
      "cloudops-d4-ch02-q11",
    ],
  },
];
