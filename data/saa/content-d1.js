// SAA-C03 分野1「セキュアなアーキテクチャの設計」の章コンテンツ(全3章)
export const chapters = [
  {
    id: "saa-d1-ch01",
    domain: 1,
    title: "セキュアなアクセス設計 — IAMとマルチアカウント",
    sections: [
      {
        heading: "IAMポリシーの種類と評価ロジック",
        html: `
<p>AWS Identity and Access Management(IAM)は、「誰が(プリンシパル)」「どのリソースに」「何を」できるかをポリシーで制御します。試験では複数のポリシーが重なったときの評価結果が問われるため、まずポリシーの種類を整理します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ポリシーの種類</th><th>アタッチ先</th><th>主な用途</th></tr></thead>
  <tbody>
    <tr><td>アイデンティティベースポリシー</td><td>ユーザー / グループ / ロール</td><td>プリンシパルに権限を付与する基本手段</td></tr>
    <tr><td>リソースベースポリシー</td><td>S3バケット、KMSキー、SQSキューなど</td><td>リソース側で利用者(他アカウント含む)を許可</td></tr>
    <tr><td>サービスコントロールポリシー(SCP)</td><td>Organizationsのアカウント / OU</td><td>アカウントが使える権限の上限(ガードレール)</td></tr>
    <tr><td>アクセス許可境界</td><td>ユーザー / ロール</td><td>そのプリンシパルが持てる権限の上限</td></tr>
  </tbody>
</table>
</div>
<p>評価ロジックの原則は次の3つです。</p>
<ol>
  <li>すべてのリクエストは<strong>デフォルトで拒否</strong>されます(暗黙的な拒否)。</li>
  <li>いずれかのポリシーに<strong>明示的な許可</strong>があれば許可されます。ただしSCPやアクセス許可境界がある場合は、その範囲内でも許可されている必要があります。</li>
  <li><strong>明示的な拒否(Deny)は常に最優先</strong>で、他のどの許可よりも優先されます。</li>
</ol>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「ユーザーに直接アタッチしたポリシーはグループのポリシーより強い」といった優先順位は存在しません。適用されるすべてのポリシーが合算して評価され、明示的な拒否が1つでもあれば必ず拒否されます。</p>
</div>`,
      },
      {
        heading: "IAMロールとSTS — 長期キーを持たない設計",
        html: `
<p><strong>IAMロール</strong>は、パスワードやアクセスキーといった長期認証情報を持たない「引き受け可能なアイデンティティ」です。ロールを引き受けると、<strong>AWS Security Token Service(STS)</strong>が有効期限付きの一時的な認証情報を発行します。認証情報が自動的に失効・更新されるため、漏えいリスクと管理負荷を大幅に減らせます。</p>
<p>試験で問われる代表的なロールの使いどころは次のとおりです。</p>
<ul>
  <li><strong>EC2上のアプリケーション</strong>: ロールをインスタンスプロファイルとしてアタッチし、S3などへアクセスさせる</li>
  <li><strong>AWS Lambda</strong>: 実行ロールで他サービスへのアクセス権限を付与する</li>
  <li><strong>クロスアカウントアクセス</strong>: 別アカウントのロールを sts:AssumeRole で引き受ける</li>
  <li><strong>フェデレーション</strong>: 外部IdPで認証したユーザーに、ロール経由で一時認証情報を発行する</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「アクセスキーをコード・AMI・環境変数に保存する」という選択肢は、ほぼ確実に不正解です。「IAMロール+一時的な認証情報」が正解の方向性だと覚えてください。</p>
</div>`,
      },
      {
        heading: "クロスアカウントアクセスの設計パターン",
        html: `
<p>複数アカウント間のアクセス設計は分野1の最頻出テーマです。基本パターンは「<strong>アクセスされる側にロールを作り、アクセスする側がAssumeRoleする</strong>」です。</p>
<ol>
  <li>アクセスされる側(例: 本番)のアカウントにIAMロールを作成し、必要最小限の権限をアタッチする</li>
  <li>ロールの<strong>信頼ポリシー</strong>で、アクセスする側(例: 開発)のアカウントまたは特定のプリンシパルを信頼する</li>
  <li>アクセスする側のユーザー・ロールに、そのロールへの <strong>sts:AssumeRole</strong> を許可する</li>
</ol>
<p>S3バケットやKMSキーのように<strong>リソースベースポリシー</strong>を持つサービスでは、リソースポリシーで他アカウントのプリンシパルを直接許可する方法もあります。この場合、利用者はロールを切り替えず自アカウントのまま操作できる、という違いがあります。</p>
<h4>サードパーティーへのアクセス委任と外部ID</h4>
<p>監視SaaSなどの第三者に自社アカウントへのアクセスを許可する場合は、クロスアカウントロールの信頼ポリシーで<strong>外部ID(ExternalId)</strong>の一致を条件にします。これにより、攻撃者が別の顧客になりすましてSaaS経由で自社のロールを利用する「<strong>混乱した代理(confused deputy)問題</strong>」を防止できます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「サードパーティーにアクセスを許可する」というシナリオでは、IAMユーザーとアクセスキーの発行ではなく「クロスアカウントロール+外部ID」が正解です。</p>
</div>`,
      },
      {
        heading: "フェデレーションとIAM Identity Center",
        html: `
<p>多数のAWSアカウントに人間のユーザーをアクセスさせる場合、アカウントごとにIAMユーザーを作成するのはアンチパターンです。<strong>AWS IAM Identity Center</strong>を使うと、AWS Organizations内の全アカウントへのシングルサインオン(SSO)と権限(許可セット)を一元管理できます。</p>
<ul>
  <li>アイデンティティソースとして、内蔵ディレクトリ、<strong>Microsoft Active Directory</strong>(AWS Directory ServiceのAD Connector等を経由)、OktaなどのSAML 2.0対応の外部IdPを選択できます</li>
  <li>ユーザー・グループに「どのアカウントで、どの許可セットを使えるか」を割り当てます</li>
  <li>MFAの強制やセッション管理も一元化できます</li>
</ul>
<p>一方、Webやモバイルアプリの<strong>一般利用者(顧客)</strong>の認証にはAmazon Cognitoを使います(第3章で詳述)。「誰のアクセスか」でサービスを選び分けるのが試験の定石です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>誰のアクセスか</th><th>選ぶサービス</th></tr></thead>
  <tbody>
    <tr><td>従業員による複数AWSアカウントへのアクセス(SSO)</td><td>IAM Identity Center</td></tr>
    <tr><td>アプリケーションの一般利用者の認証</td><td>Amazon Cognito</td></tr>
    <tr><td>EC2やLambda上のアプリケーションからのアクセス</td><td>IAMロール</td></tr>
  </tbody>
</table>
</div>`,
      },
      {
        heading: "AWS OrganizationsとSCP、Control Tower",
        html: `
<p><strong>AWS Organizations</strong>は複数のAWSアカウントを組織として一元管理するサービスです。アカウントを組織単位(OU)に階層化し、一括請求とポリシーによる統制を提供します。</p>
<h4>サービスコントロールポリシー(SCP)</h4>
<ul>
  <li>SCPはアカウントが使用できるアクションの<strong>上限(ガードレール)</strong>を定めるもので、<strong>権限を付与するものではありません</strong>。実際のアクセスには別途IAMポリシーの許可が必要です。</li>
  <li>メンバーアカウント内の<strong>すべてのユーザー・ロール(そのアカウントのルートユーザーを含む)</strong>に適用されます。</li>
  <li><strong>管理アカウントには適用されません</strong>。</li>
  <li>典型的な用途: 利用リージョンの制限、特定サービスの禁止、CloudTrail無効化の防止などの組織全体の統制</li>
</ul>
<p><strong>AWS Control Tower</strong>は、Organizations、IAM Identity Center、AWS CloudTrail、AWS Configなどを組み合わせた<strong>ランディングゾーン</strong>(ベストプラクティス準拠のマルチアカウント環境)を自動構築するサービスです。SCPによる<strong>予防的コントロール</strong>とAWS Configルールによる<strong>発見的コントロール</strong>をガードレールとして適用し、Account Factoryで統制の取れた新規アカウントを払い出せます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「マルチアカウント環境を最小の労力でベストプラクティスに沿って構築したい」→ Control Tower、「組織全体で特定の操作を一括して禁止したい」→ SCP、が決め手フレーズです。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d1-ch01-q01",
      "saa-d1-ch01-q02",
      "saa-d1-ch01-q03",
      "saa-d1-ch01-q04",
      "saa-d1-ch01-q05",
      "saa-d1-ch01-q06",
      "saa-d1-ch01-q07",
      "saa-d1-ch01-q08",
      "saa-d1-ch01-q09",
      "saa-d1-ch01-q10",
    ],
  },
  {
    id: "saa-d1-ch02",
    domain: 1,
    title: "データ保護の設計 — 暗号化とシークレット管理",
    sections: [
      {
        heading: "AWS KMSのキー種別とキーポリシー",
        html: `
<p><strong>AWS Key Management Service(KMS)</strong>は暗号化キーの作成・管理を行うマネージドサービスです。試験では「誰がキーを管理し、何を制御できるか」という観点でキー種別を選ばせる問題が頻出します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>キー種別</th><th>管理者</th><th>キーポリシー編集</th><th>ローテーション</th></tr></thead>
  <tbody>
    <tr><td>カスタマーマネージドキー</td><td>利用者</td><td>可能</td><td>任意(自動ローテーションの有効化・期間設定が可能)</td></tr>
    <tr><td>AWSマネージドキー(aws/s3 など)</td><td>AWS</td><td>不可</td><td>1年ごとに自動(変更不可)</td></tr>
    <tr><td>AWS所有キー</td><td>AWS</td><td>不可(利用者からは見えない)</td><td>AWSが管理</td></tr>
  </tbody>
</table>
</div>
<p><strong>キーポリシー</strong>はKMSキーに必ず存在するリソースベースポリシーで、キーの利用者と管理者を制御します。<strong>クロスアカウントでキーを使わせる場合は、キーポリシーでの許可が必須</strong>です(相手アカウントのIAMポリシーだけでは許可できません)。また、キーの使用はすべてAWS CloudTrailに記録されるため、監査要件にも対応できます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「キーの利用者を自社で制御したい」「キーの使用を監査したい」「他アカウントとキーを共有したい」という要件が出たら、カスタマーマネージドキーが正解の方向性です。</p>
</div>`,
      },
      {
        heading: "エンベロープ暗号化の仕組み",
        html: `
<p>KMSは<strong>エンベロープ暗号化</strong>という2段階の方式でデータを保護します。KMSキーで直接暗号化できるデータは4KBまでのため、それより大きなデータは次の流れで暗号化します。</p>
<ol>
  <li>KMSの GenerateDataKey APIで<strong>データキー</strong>(平文と暗号化済みのペア)を取得する</li>
  <li><strong>平文のデータキー</strong>でデータをローカルで暗号化し、平文キーは直ちにメモリから破棄する</li>
  <li><strong>KMSキーで暗号化されたデータキー</strong>を、暗号化済みデータと一緒に保存する</li>
  <li>復号時は、暗号化済みデータキーをKMSで復号し、得られた平文キーでデータを復号する</li>
</ol>
<p>この方式により、大容量データをKMSへ送信せずに暗号化でき、KMSキー自体は決してKMSの外に出ません。Amazon S3、Amazon EBS、Amazon RDSなどのサーバー側暗号化は、内部的にこのエンベロープ暗号化を使用しています。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「データはデータキーで暗号化し、そのデータキーをKMSキーで暗号化して一緒に保存する」という2段構えを押さえれば、エンベロープ暗号化の問題に対応できます。</p>
</div>`,
      },
      {
        heading: "S3・EBS・RDSの暗号化設計",
        html: `
<p>保管中の暗号化はサービスごとに設定方法と制約が異なり、特に「<strong>後から暗号化できるか</strong>」が試験の狙いどころです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>暗号化オプション</th><th>試験で問われるポイント</th></tr></thead>
  <tbody>
    <tr><td>Amazon S3</td><td>SSE-S3(デフォルト)/ SSE-KMS / DSSE-KMS / SSE-C</td><td>監査・キー制御が必要ならSSE-KMS。大量リクエスト時はS3バケットキーでKMSコストを削減</td></tr>
    <tr><td>Amazon EBS</td><td>KMSによるボリューム暗号化</td><td>リージョン単位でデフォルト暗号化を有効化可能。既存の非暗号化ボリュームはスナップショット→暗号化コピー→復元で暗号化</td></tr>
    <tr><td>Amazon RDS</td><td>KMSによるインスタンス暗号化</td><td><strong>作成時のみ有効化可能</strong>。既存DBはスナップショット→暗号化コピー→復元。暗号化DBのバックアップ・レプリカも暗号化される</td></tr>
  </tbody>
</table>
</div>
<p>S3のサーバー側暗号化の使い分けは次のとおりです。</p>
<ul>
  <li><strong>SSE-S3</strong>: S3が管理するキーを使用。新規オブジェクトにはデフォルトで適用され、追加要件がなければ十分</li>
  <li><strong>SSE-KMS</strong>: KMSキーを使用。キーポリシーによるアクセス制御、CloudTrailによる利用監査、キーの無効化が可能</li>
  <li><strong>SSE-C</strong>: 利用者が持ち込むキーを使用。AWSはキーを保存しない(キー管理の負荷は利用者側)</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>既存の非暗号化RDSインスタンスやEBSボリュームを「設定変更でそのまま暗号化」することはできません。「スナップショットの暗号化コピーから作り直す」が正解パターンです。</p>
</div>`,
      },
      {
        heading: "ACMによる転送中の暗号化",
        html: `
<p>転送中の暗号化(TLS/HTTPS)の証明書管理には<strong>AWS Certificate Manager(ACM)</strong>を使います。</p>
<ul>
  <li><strong>パブリック証明書を無料で発行</strong>でき、Elastic Load Balancing(ELB)、Amazon CloudFront、Amazon API Gatewayなどに直接関連付けられます</li>
  <li><strong>DNS検証</strong>を使うと、検証用レコードが維持されている限り有効期限前に<strong>自動更新</strong>され、証明書の更新作業が不要になります(運用負荷が最小)</li>
  <li>パブリック証明書は原則<strong>エクスポート不可</strong>のため、EC2へ直接インストールする用途には向きません(社内向けのプライベート証明書にはAWS Private CAを利用)</li>
  <li>CloudFrontに関連付ける証明書は<strong>バージニア北部(us-east-1)リージョン</strong>で発行する必要があります</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「証明書の更新を自動化したい」「最小の運用負荷でHTTPS化したい」→ ACM+DNS検証が決め手です。エンドツーエンドの暗号化が要件なら、ALBからバックエンドまでの区間にもTLSを構成します。</p>
</div>`,
      },
      {
        heading: "シークレット管理とMacie — Secrets Manager vs Parameter Store",
        html: `
<p>DBパスワードやAPIキーなどのシークレットをコードに埋め込むのはアンチパターンです。保管先は次の2つのサービスから要件で選びます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>AWS Secrets Manager</th><th>SSM Parameter Store</th></tr></thead>
  <tbody>
    <tr><td>主な用途</td><td>DB認証情報・APIキーなどのシークレット</td><td>設定値全般(SecureStringで機密値も可)</td></tr>
    <tr><td>自動ローテーション</td><td><strong>マネージドローテーションを標準搭載</strong>(RDS等と統合)</td><td>なし(必要ならLambdaを自作)</td></tr>
    <tr><td>料金</td><td>シークレットごとに有料</td><td>標準パラメータは追加料金なし</td></tr>
    <tr><td>暗号化</td><td>常にKMSで暗号化</td><td>SecureStringタイプ選択時にKMSで暗号化</td></tr>
  </tbody>
</table>
</div>
<p>決め手は<strong>自動ローテーション</strong>です。「認証情報を定期的に自動ローテーションしたい」→ Secrets Manager、「追加コストなしで設定値を安全に管理したい」→ Parameter Store、と整理して覚えます。</p>
<h4>Amazon Macieによる機密データの検出</h4>
<p><strong>Amazon Macie</strong>は、機械学習とパターンマッチングにより<strong>S3バケット内の個人情報(PII)や機密データを自動検出・分類</strong>するサービスです。「S3のデータに個人情報が含まれていないか継続的に監査したい」という要件が出たらMacieが正解です。脅威検出のGuardDuty、脆弱性管理のInspectorと混同させる出題が定番なので、役割の違いを明確にしておきましょう。</p>`,
      },
    ],
    checkQuestionIds: [
      "saa-d1-ch02-q01",
      "saa-d1-ch02-q02",
      "saa-d1-ch02-q03",
      "saa-d1-ch02-q04",
      "saa-d1-ch02-q05",
      "saa-d1-ch02-q06",
      "saa-d1-ch02-q07",
      "saa-d1-ch02-q08",
      "saa-d1-ch02-q09",
    ],
  },
  {
    id: "saa-d1-ch03",
    domain: 1,
    title: "セキュアなワークロード設計 — ネットワークと境界防御",
    sections: [
      {
        heading: "セキュリティグループとネットワークACL",
        html: `
<p>Amazon VPC内のトラフィック制御の基本は、インスタンス(ENI)レベルの<strong>セキュリティグループ(SG)</strong>と、サブネットレベルの<strong>ネットワークACL(NACL)</strong>です。両者の違いはそのまま出題ポイントになります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>セキュリティグループ</th><th>ネットワークACL</th></tr></thead>
  <tbody>
    <tr><td>適用レベル</td><td>インスタンス(ENI)</td><td>サブネット</td></tr>
    <tr><td>ルール</td><td><strong>許可のみ</strong></td><td><strong>許可と拒否</strong></td></tr>
    <tr><td>状態管理</td><td><strong>ステートフル</strong>(応答は自動許可)</td><td><strong>ステートレス</strong>(往路・復路とも明示的な許可が必要)</td></tr>
    <tr><td>評価方法</td><td>すべてのルールを評価</td><td>ルール番号の小さい順に評価し、最初に一致したルールを適用</td></tr>
  </tbody>
</table>
</div>
<ul>
  <li>SGはインバウンドルールのソースに<strong>別のセキュリティグループIDを指定</strong>でき、Auto Scalingで増減するインスタンス群からの通信を柔軟に許可できます。</li>
  <li><strong>特定IPアドレスからのトラフィック拒否</strong>はSGではできないため、NACLの拒否ルールを使います。</li>
  <li>NACLはステートレスのため、応答トラフィック用に<strong>エフェメラルポート(1024-65535)</strong>の許可が必要です。</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「特定のIPをブロックしたい」→ NACL、「アプリ層からDB層への通信だけを許可したい」→ SGのソースにSGを指定、が決め手です。</p>
</div>`,
      },
      {
        heading: "パブリック/プライベートサブネットの設計",
        html: `
<p>サブネットが「パブリック」か「プライベート」かは、ルートテーブルに<strong>インターネットゲートウェイ(IGW)へのルートがあるかどうか</strong>で決まります。</p>
<ul>
  <li><strong>パブリックサブネット</strong>: 0.0.0.0/0 → IGWのルートを持つ。ALB、NATゲートウェイなど外部公開が必要なリソースのみを配置します</li>
  <li><strong>プライベートサブネット</strong>: IGWへの直接ルートを持たない。アプリケーションサーバーやRDSなどのデータ層はここに配置するのが原則です</li>
</ul>
<p>プライベートサブネットのリソースがOSアップデートや外部API呼び出しのために<strong>アウトバウンドのみ</strong>のインターネット接続を必要とする場合は、パブリックサブネットに<strong>NATゲートウェイ</strong>を配置し、プライベートサブネットのルートテーブルで 0.0.0.0/0 → NATゲートウェイのルートを設定します。NATゲートウェイは外部から開始されるインバウンド接続を通しません。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>NATゲートウェイはAZ単位のリソースです。高可用性が要件の場合は各AZに配置し、AZごとのルートテーブルで同一AZのNATゲートウェイへ向けます。また、サーバーへの管理アクセスには、踏み台サーバーよりもAWS Systems Manager Session Manager(インバウンドポートの開放が不要)が推奨されます。</p>
</div>`,
      },
      {
        heading: "VPCエンドポイントによるプライベート接続",
        html: `
<p>プライベートサブネットからS3などのAWSサービスAPIへアクセスする際、NATゲートウェイ経由ではコストがかさみ、トラフィックもパブリックエンドポイントへ向かいます。<strong>VPCエンドポイント</strong>を使うと、インターネットを経由せずAWSサービスへプライベートに接続できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>ゲートウェイエンドポイント</th><th>インターフェイスエンドポイント(AWS PrivateLink)</th></tr></thead>
  <tbody>
    <tr><td>対応サービス</td><td><strong>S3とDynamoDBのみ</strong></td><td>ほとんどのAWSサービス(S3も対応)</td></tr>
    <tr><td>実体</td><td>ルートテーブルに追加するターゲット</td><td>サブネット内のENI(プライベートIP)</td></tr>
    <tr><td>料金</td><td><strong>追加料金なし</strong></td><td>時間課金+データ処理料金</td></tr>
    <tr><td>オンプレミスからの利用</td><td>不可(そのVPC内からのみ)</td><td>可能(AWS Direct Connect / VPN経由)</td></tr>
  </tbody>
</table>
</div>
<p>エンドポイントには<strong>エンドポイントポリシー</strong>を設定でき、「このエンドポイント経由では特定バケットへのアクセスのみ許可」といった制御が可能です。S3バケットポリシー側でも、aws:SourceVpce条件で特定エンドポイント経由のアクセスに限定できます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「VPC内からS3/DynamoDBへ最もコスト効率よくプライベート接続」→ ゲートウェイ型、「オンプレミスからもプライベートにAWS APIへ接続」→ インターフェイス型、が定番の決め手です。</p>
</div>`,
      },
      {
        heading: "境界防御サービスの使い分け — WAF・Shield・GuardDuty・Inspector",
        html: `
<p>境界防御・脅威対策のサービスは「守る対象」と「防ぐ・検出する脅威」で選び分けます。名前と役割の対応は確実に得点すべきポイントです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>役割</th><th>出題キーワード</th></tr></thead>
  <tbody>
    <tr><td>AWS WAF</td><td>L7(HTTP)リクエストのフィルタリング。CloudFront / ALB / API Gatewayなどに関連付け</td><td>SQLインジェクション、XSS、レートベースルール、マネージドルール</td></tr>
    <tr><td>AWS Shield Standard / Advanced</td><td>DDoS対策。Standardは全利用者に無料で自動適用。AdvancedはSRT支援・拡張検知・コスト保護を追加</td><td>DDoS、大規模攻撃への備え</td></tr>
    <tr><td>Amazon GuardDuty</td><td>CloudTrailイベント・VPCフローログ・DNSログなどを分析する脅威検出(エージェント導入不要)</td><td>不正アクセス、暗号通貨マイニング、異常なAPI呼び出し</td></tr>
    <tr><td>Amazon Inspector</td><td>EC2・ECRイメージ・Lambdaの脆弱性管理と意図しないネットワーク公開の検出</td><td>CVE、脆弱性スキャン、パッチ状況</td></tr>
    <tr><td>Amazon Macie</td><td>S3内の機密データ(PII)の検出・分類</td><td>個人情報、データ分類</td></tr>
  </tbody>
</table>
</div>
<ul>
  <li>複数アカウントのWAFルールやセキュリティグループを一元管理するには<strong>AWS Firewall Manager</strong>、VPC全体のトラフィック検査には<strong>AWS Network Firewall</strong>を使います。</li>
  <li>各サービスの検出結果の集約・可視化には<strong>AWS Security Hub</strong>を使います。</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「SQLi/XSSをブロック」→ WAF、「DDoS」→ Shield、「脅威の検出」→ GuardDuty、「脆弱性のスキャン」→ Inspector、「S3の個人情報」→ Macie。この対応を反射的に答えられるようにしましょう。</p>
</div>`,
      },
      {
        heading: "Cognitoによるアプリケーション利用者の認証",
        html: `
<p>Webアプリやモバイルアプリの<strong>一般利用者(顧客)</strong>向けの認証基盤には<strong>Amazon Cognito</strong>を使います。Cognitoには役割の異なる2つのコンポーネントがあります。</p>
<ul>
  <li><strong>ユーザープール</strong>: サインアップ/サインイン、パスワードポリシー、MFA、GoogleやAppleなどのソーシャルIdP・SAML IdP連携を提供する「認証」の基盤。認証後にJWT(IDトークンなど)を発行し、Amazon API GatewayやALBのリスナー認証と連携できます。</li>
  <li><strong>アイデンティティプール</strong>: 認証済みユーザー(またはゲスト)に<strong>IAMロールに基づく一時的なAWS認証情報</strong>を発行する「認可」の基盤。アプリからS3への直接アップロードやDynamoDBアクセスなどが可能になります。</li>
</ul>
<div class="table-wrap">
<table>
  <thead><tr><th>要件</th><th>使うもの</th></tr></thead>
  <tbody>
    <tr><td>アプリにサインイン機能・ソーシャルログインを追加したい</td><td>Cognitoユーザープール</td></tr>
    <tr><td>認証したユーザーにAWSリソースへの直接アクセスを許可したい</td><td>Cognitoアイデンティティプール</td></tr>
    <tr><td>従業員に複数AWSアカウントへのSSOを提供したい</td><td>IAM Identity Center</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「アプリの利用者」ならCognito、「従業員・社内ユーザー」ならIAM Identity Centerです。利用者ごとにIAMユーザーを作成してアクセスキーを配布する選択肢は常に誤答です。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d1-ch03-q01",
      "saa-d1-ch03-q02",
      "saa-d1-ch03-q03",
      "saa-d1-ch03-q04",
      "saa-d1-ch03-q05",
      "saa-d1-ch03-q06",
      "saa-d1-ch03-q07",
      "saa-d1-ch03-q08",
      "saa-d1-ch03-q09",
      "saa-d1-ch03-q10",
    ],
  },
];
