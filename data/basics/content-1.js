// AWS基礎 前半(第1〜6章)の章コンテンツ
export const chapters = [
  {
    id: "basics-ch01",
    domain: null,
    title: "AWSとグローバルインフラストラクチャ",
    sections: [
      {
        heading: "AWSクラウドの基本的な考え方",
        html: `
<p>AWS(Amazon Web Services)は、サーバー・ストレージ・データベース・ネットワークなどのITリソースを、<strong>必要なときに必要な分だけ</strong>インターネット経由で利用できるクラウドサービスです。物理サーバーの購入や設置は不要で、使った分だけ支払う<strong>従量課金制</strong>が基本です。</p>
<p>オンプレミス(自社運用)と比較したクラウドの利点は、試験でも前提知識として問われます。</p>
<ul>
  <li><strong>初期投資が不要</strong>: 設備投資(固定費)を変動費に置き換えられます</li>
  <li><strong>伸縮性(Elasticity)</strong>: 需要に合わせてリソースを増減でき、キャパシティの見積もりに悩む必要がありません</li>
  <li><strong>スピードと俊敏性</strong>: 数クリック・数分で世界中にリソースを展開できます</li>
  <li><strong>規模の経済</strong>: AWSの大規模運用によるコストメリットを享受できます</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>試験では「最小の運用負荷」「最もコスト効率が良い」といった要件がカギになります。手作業や自前運用よりも、マネージドサービスを活用する選択肢が正解になる傾向を最初に押さえておきましょう。</p>
</div>`,
      },
      {
        heading: "リージョンとアベイラビリティーゾーン(AZ)",
        html: `
<p>AWSのグローバルインフラストラクチャの基本単位が<strong>リージョン</strong>と<strong>アベイラビリティーゾーン(AZ)</strong>です。</p>
<ul>
  <li><strong>リージョン</strong>: 地理的に離れた独立エリア(例: 東京リージョン ap-northeast-1)。データは利用者が明示的に操作しない限り、リージョンの外へ自動的にコピーされません</li>
  <li><strong>AZ</strong>: リージョン内にある1つ以上のデータセンター群。各AZは電源・ネットワークが物理的に分離されつつ、AZ間は低レイテンシの高速回線で接続されています</li>
</ul>
<p>リージョンを選定する際の判断基準は次の4つが定番です。</p>
<ol>
  <li><strong>コンプライアンス</strong>: データを特定の国・地域に保持する法的要件(データレジデンシー)</li>
  <li><strong>レイテンシ</strong>: ユーザーに物理的に近いほど応答が速い</li>
  <li><strong>利用可能なサービス</strong>: 新サービスは一部リージョンから提供が始まる</li>
  <li><strong>料金</strong>: リージョンによって単価が異なる</li>
</ol>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>高可用性設計の基本は「<strong>複数のAZにリソースを分散配置する</strong>」ことです。単一データセンターの障害に耐えるにはマルチAZ、リージョン規模の災害に備えるにはマルチリージョン、と対策のレベルを区別して覚えましょう。</p>
</div>`,
      },
      {
        heading: "エッジロケーションとグローバルサービス",
        html: `
<p><strong>エッジロケーション</strong>は、リージョンよりもはるかに多くの都市に配置された小規模な拠点で、ユーザーの近くでコンテンツを配信・処理するために使われます。代表的な利用サービスは、CDNの<strong>Amazon CloudFront</strong>とDNSの<strong>Amazon Route 53</strong>です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>拠点</th><th>役割</th><th>代表的なサービス</th></tr></thead>
  <tbody>
    <tr><td>リージョン</td><td>リソースの作成・実行の単位</td><td>Amazon EC2、Amazon RDS</td></tr>
    <tr><td>AZ</td><td>リージョン内の冗長化の単位</td><td>マルチAZ配置、Amazon EBS</td></tr>
    <tr><td>エッジロケーション</td><td>ユーザーの近くで配信・応答</td><td>Amazon CloudFront、Amazon Route 53</td></tr>
  </tbody>
</table>
</div>
<p>また、サービスには適用範囲(スコープ)の違いがあります。EC2やVPCは<strong>リージョンサービス</strong>、EBSはAZに紐づくリソース、IAMやRoute 53のように全リージョン共通で機能する<strong>グローバルサービス</strong>もあります。「S3のバケットは特定リージョンに作成されるが、名前はグローバルで一意」といった整理も試験で役立ちます。</p>`,
      },
      {
        heading: "責任共有モデル",
        html: `
<p><strong>責任共有モデル</strong>は、セキュリティに関する責任をAWSと利用者で分担する考え方です。AWSは「クラウド<strong>の</strong>セキュリティ」(Security of the Cloud)、利用者は「クラウド<strong>における</strong>セキュリティ」(Security in the Cloud)に責任を持ちます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>責任の所在</th><th>具体例</th></tr></thead>
  <tbody>
    <tr><td>AWSの責任</td><td>データセンターの物理セキュリティ、ハードウェア、ネットワーク設備、ハイパーバイザー、マネージドサービスの基盤運用</td></tr>
    <tr><td>利用者の責任</td><td>データの管理と暗号化の選択、IAMによるアクセス管理、ゲストOSのパッチ適用(EC2)、セキュリティグループなどネットワーク設定、アプリケーションのセキュリティ</td></tr>
  </tbody>
</table>
</div>
<p>責任の境界はサービスの抽象度によって変わります。EC2ではゲストOSのパッチ適用は利用者の責任ですが、Amazon RDSのようなマネージドサービスではDBエンジンやOSへのパッチ適用はAWSが担います。ただし、どのサービスでも<strong>データそのものとアクセス権の管理は常に利用者の責任</strong>です。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「EC2のOSパッチは誰の責任か」「S3に保存したデータの分類・暗号化設定は誰の責任か」という形式が頻出です。迷ったら「物理・基盤はAWS、データ・設定は利用者」と判断しましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch01-q01",
      "basics-ch01-q02",
      "basics-ch01-q03",
      "basics-ch01-q04",
      "basics-ch01-q05",
    ],
  },
  {
    id: "basics-ch02",
    domain: null,
    title: "IAM — 認証とアクセス管理の基礎",
    sections: [
      {
        heading: "IAMの全体像 — 認証と認可",
        html: `
<p><strong>AWS Identity and Access Management(IAM)</strong>は、「誰が(認証)」「どのリソースに何をできるか(認可)」を制御するサービスです。追加料金なしで利用でき、<strong>グローバルサービス</strong>としてすべてのリージョンに共通で適用されます。</p>
<p>IAMを構成する主な要素は次の4つです。</p>
<ul>
  <li><strong>IAMユーザー</strong>: 人やアプリケーションに与える長期的なID。パスワード(コンソール用)やアクセスキー(CLI/API用)を持ちます</li>
  <li><strong>IAMグループ</strong>: ユーザーの集合。グループにポリシーを付与して権限をまとめて管理します</li>
  <li><strong>IAMロール</strong>: 特定の主体が一時的に引き受ける(AssumeRoleする)ID。長期的な認証情報を持ちません</li>
  <li><strong>IAMポリシー</strong>: 許可・拒否のルールを記述したJSONドキュメント。ユーザー・グループ・ロールにアタッチします</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「認証(Authentication)= 本人確認」「認可(Authorization)= 権限の確認」の区別が出発点です。IAMポリシーは認可を担い、パスワードやMFAは認証を担います。</p>
</div>`,
      },
      {
        heading: "IAMポリシーとグループによる権限管理",
        html: `
<p>IAMポリシーは、<code>Effect</code>(Allow/Deny)、<code>Action</code>(操作)、<code>Resource</code>(対象)を基本要素とするJSONで記述します。</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::example-bucket/*"
    }
  ]
}</code></pre>
<p>ポリシーには、ユーザーやロールなどのIDに付与する<strong>アイデンティティベースのポリシー</strong>と、S3バケットポリシーのようにリソース側に付与する<strong>リソースベースのポリシー</strong>があります。</p>
<p>複数のユーザーに同じ権限を与える場合は、ユーザーへ個別にポリシーを付けるのではなく、<strong>グループにポリシーを付与してユーザーを所属させる</strong>のが定石です。部署異動があってもグループの所属を変えるだけで済み、権限管理の抜け漏れを防げます。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>ポリシー評価では<strong>明示的なDenyが常に最優先</strong>です。デフォルトはすべて暗黙的な拒否(implicit deny)で、Allowがあれば許可されますが、どこかに明示的なDenyが1つでもあれば必ず拒否されます。</p>
</div>`,
      },
      {
        heading: "IAMロール — 一時的な認証情報の使いどころ",
        html: `
<p><strong>IAMロール</strong>は、長期的なアクセスキーの代わりに<strong>一時的な認証情報</strong>(AWS STSが発行)を提供する仕組みです。認証情報が自動的にローテーションされるため、漏えいリスクを大幅に減らせます。試験では「アクセスキーをコードに埋め込む」選択肢は原則誤答で、ロールを使う選択肢が正解になります。</p>
<p>ロールの代表的な使いどころは次のとおりです。</p>
<ul>
  <li><strong>EC2インスタンスからAWSサービスへアクセス</strong>: ロールをインスタンスプロファイルとしてEC2にアタッチします。アプリはキー管理なしでS3などを利用できます</li>
  <li><strong>AWS Lambdaの実行ロール</strong>: 関数がDynamoDBやCloudWatch Logsへアクセスする権限を実行ロールで与えます</li>
  <li><strong>クロスアカウントアクセス</strong>: 別のAWSアカウントのユーザーに、自アカウントのロールを引き受けさせて一時的なアクセスを許可します</li>
  <li><strong>AWSサービス自身への権限付与</strong>: CloudFormationなどのサービスが利用者に代わってリソースを操作するときにサービスロールを使います</li>
</ul>
<p>ロールには「誰がこのロールを引き受けられるか」を定義する<strong>信頼ポリシー</strong>と、「引き受けた主体が何をできるか」を定義する<strong>許可ポリシー</strong>の2種類が設定されます。</p>`,
      },
      {
        heading: "最小権限の原則",
        html: `
<p><strong>最小権限の原則(Principle of Least Privilege)</strong>は、業務に必要な最小限の権限だけを与えるという、AWSセキュリティで最も重要な考え方です。</p>
<ul>
  <li><code>"Action": "*"</code> や <code>"Resource": "*"</code> のような広すぎる許可を避け、必要な操作・対象に絞ります</li>
  <li>まず狭い権限から始め、必要に応じて追加していきます</li>
  <li>AWS管理ポリシー(例: ReadOnlyAccess)は手軽ですが、要件が明確ならカスタマー管理ポリシーで絞り込むほうが最小権限に近づきます</li>
  <li>IAM Access Analyzerなどを使い、使われていない権限や外部公開を検出して削ることも有効です</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>試験で「最小権限の原則に従う」という条件があれば、<strong>AdministratorAccessやワイルドカードを含む選択肢は誤答</strong>です。必要なアクションとリソースだけを列挙した選択肢を選びます。</p>
</div>`,
      },
      {
        heading: "MFAとルートユーザーの保護",
        html: `
<p><strong>ルートユーザー</strong>は、アカウント作成時のメールアドレスでサインインする特別なIDで、すべての操作が可能なうえ権限を制限できません。日常業務では使わず、厳重に保護することがベストプラクティスです。</p>
<ul>
  <li>ルートユーザーに<strong>MFA(多要素認証)を必ず有効化</strong>する</li>
  <li>ルートユーザーの<strong>アクセスキーは作成しない(あれば削除する)</strong></li>
  <li>日常の管理作業は、必要な権限を持つIAMユーザーやIAM Identity Centerのユーザーで行う</li>
  <li>ルートユーザーは、アカウント解約や一部の請求設定など「ルートでしかできない作業」に限定して使う</li>
</ul>
<p><strong>MFA</strong>はパスワード(知識要素)に加えて、認証アプリやセキュリティキー(所持要素)を要求する仕組みで、パスワード漏えい時の不正アクセスを防ぎます。特権を持つIAMユーザーにもMFAを有効化するのが推奨です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「ルートユーザーの保護」と問われたら、<strong>MFA有効化</strong>と<strong>アクセスキーの削除</strong>の2点セットで覚えましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch02-q01",
      "basics-ch02-q02",
      "basics-ch02-q03",
      "basics-ch02-q04",
      "basics-ch02-q05",
      "basics-ch02-q06",
    ],
  },
  {
    id: "basics-ch03",
    domain: null,
    title: "Amazon EC2 — 仮想サーバーの基礎",
    sections: [
      {
        heading: "EC2の基本とAMI",
        html: `
<p><strong>Amazon EC2(Elastic Compute Cloud)</strong>は、クラウド上の仮想サーバー(インスタンス)を数分で起動できるサービスです。OSの選択からネットワーク、ストレージまでを利用者が制御できる、AWSの最も基本的なコンピューティングサービスです。</p>
<p>インスタンスの起動時には<strong>AMI(Amazon Machine Image)</strong>を指定します。AMIはOS・アプリケーション・設定を含むテンプレートで、次の使い方が定番です。</p>
<ul>
  <li>AWSが提供する標準AMI(Amazon Linux、Windows Serverなど)から起動する</li>
  <li>ミドルウェアや設定を済ませたインスタンスから<strong>カスタムAMI(ゴールデンイメージ)</strong>を作成し、同じ構成のインスタンスを素早く複製する</li>
  <li>AMIを他リージョンへコピーして、同一構成をマルチリージョンで展開する</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「同じ構成のインスタンスを大量に、または繰り返し起動したい」「Auto Scalingの起動時間を短縮したい」という要件にはカスタムAMIが有効です。起動のたびにスクリプトで環境構築するより速く、構成のばらつきも防げます。</p>
</div>`,
      },
      {
        heading: "インスタンスタイプの選び方",
        html: `
<p>インスタンスタイプは「<code>m5.large</code>」のように表記され、<strong>ファミリー(用途)</strong>と<strong>サイズ(性能)</strong>の組み合わせで選びます。ワークロードの特性に合ったファミリーを選ぶことが、性能とコストの両立につながります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ファミリー</th><th>特性</th><th>典型的な用途</th></tr></thead>
  <tbody>
    <tr><td>汎用(M、T)</td><td>CPU・メモリのバランス型。Tはバースト可能</td><td>Webサーバー、小規模DB、開発環境</td></tr>
    <tr><td>コンピューティング最適化(C)</td><td>vCPUあたりの処理性能が高い</td><td>バッチ処理、動画エンコード、高負荷API</td></tr>
    <tr><td>メモリ最適化(R、X)</td><td>メモリ容量が大きい</td><td>インメモリキャッシュ、大規模DB、リアルタイム分析</td></tr>
    <tr><td>ストレージ最適化(I、D)</td><td>高速なローカルNVMe/大容量HDD</td><td>NoSQL DB、分散ファイルシステム、ログ処理</td></tr>
    <tr><td>高速コンピューティング(P、G)</td><td>GPUなどのアクセラレータ搭載</td><td>機械学習、グラフィックス処理</td></tr>
  </tbody>
</table>
</div>
<p>T系(バーストパフォーマンスインスタンス)は、CPUクレジットを貯めて一時的な負荷に対応する方式のため、平常時の負荷が低くスパイクが短いワークロードに向きます。継続的に高いCPU負荷がかかる場合はMやC系を選びます。</p>`,
      },
      {
        heading: "購入オプション — コスト最適化の要",
        html: `
<p>EC2の料金は購入オプションで大きく変わり、試験でも「最もコスト効率が良い」問題の頻出テーマです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>購入オプション</th><th>特徴</th><th>向いているワークロード</th></tr></thead>
  <tbody>
    <tr><td>オンデマンド</td><td>秒/時間単位の従量課金。コミットなし</td><td>短期・不定期・予測不能なワークロード、検証</td></tr>
    <tr><td>リザーブドインスタンス</td><td>1年/3年のコミットで大幅割引</td><td>特定のインスタンス構成を長期継続利用</td></tr>
    <tr><td>Savings Plans</td><td>1年/3年で「1時間あたりの利用額」をコミット。柔軟性が高い</td><td>長期継続利用(タイプ変更の可能性あり)</td></tr>
    <tr><td>スポットインスタンス</td><td>未使用キャパシティを最大約90%引きで利用。<strong>中断される可能性あり</strong></td><td>中断に耐えるバッチ処理、CI/CD、ステートレスな並列処理</td></tr>
    <tr><td>Dedicated Hosts</td><td>物理サーバーを専有</td><td>ライセンス要件(BYOL)、コンプライアンス要件</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「中断されても再実行できる」→ スポット、「24時間365日、1年以上の定常稼働」→ Savings Plans/リザーブド、「数週間だけの検証」→ オンデマンド、が定番の対応です。<strong>中断できない本番DBにスポットを使う選択肢は誤答</strong>です。</p>
</div>`,
      },
      {
        heading: "セキュリティグループとキーペア",
        html: `
<p><strong>セキュリティグループ</strong>は、インスタンス(正確にはENI)単位で通信を制御する仮想ファイアウォールです。次の特性を押さえましょう。</p>
<ul>
  <li><strong>許可ルールのみ</strong>を記述できます(拒否ルールは書けません)。デフォルトではインバウンドはすべて拒否、アウトバウンドはすべて許可です</li>
  <li><strong>ステートフル</strong>: 許可した通信への戻りの通信は、ルールに関係なく自動的に許可されます</li>
  <li>送信元にIPアドレス範囲(CIDR)だけでなく<strong>別のセキュリティグループを指定</strong>できます。「ALBのSGからの通信だけをWebサーバーに許可する」といった多層構成が定番です</li>
</ul>
<p>たとえばWebサーバーなら「HTTP(80)/HTTPS(443)は全体(0.0.0.0/0)に許可、SSH(22)は社内の固定IPのみに許可」のように、ポートと送信元を最小限に絞るのが基本です。</p>
<p><strong>キーペア</strong>は、インスタンスへ安全にログインするための公開鍵認証の鍵です。公開鍵はAWS側・インスタンスに配置され、<strong>秘密鍵は利用者が保管</strong>します。秘密鍵を紛失してもAWSは再発行できないため、厳重な管理が必要です。</p>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch03-q01",
      "basics-ch03-q02",
      "basics-ch03-q03",
      "basics-ch03-q04",
      "basics-ch03-q05",
      "basics-ch03-q06",
    ],
  },
  {
    id: "basics-ch04",
    domain: null,
    title: "Amazon VPC — ネットワークの基礎",
    sections: [
      {
        heading: "VPCとサブネット",
        html: `
<p><strong>Amazon VPC(Virtual Private Cloud)</strong>は、AWS内に作成する論理的に分離されたプライベートネットワークです。VPCには<strong>CIDRブロック</strong>(例: 10.0.0.0/16)を割り当て、その中を<strong>サブネット</strong>に分割してリソースを配置します。</p>
<ul>
  <li>VPCは<strong>リージョン</strong>単位、サブネットは<strong>単一のAZ</strong>に属します</li>
  <li>高可用性のため、<strong>複数のAZにまたがって同じ役割のサブネットを用意する</strong>のが定石です(例: パブリック×2AZ、プライベート×2AZ)</li>
</ul>
<p>サブネットは到達性によって2種類に分けて設計します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>種類</th><th>定義</th><th>配置する主なリソース</th></tr></thead>
  <tbody>
    <tr><td>パブリックサブネット</td><td>ルートテーブルにインターネットゲートウェイへのルートがある</td><td>ALB、NATゲートウェイ、踏み台サーバー</td></tr>
    <tr><td>プライベートサブネット</td><td>インターネットゲートウェイへの直接ルートがない</td><td>アプリケーションサーバー、RDSなどのDB</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「パブリック/プライベート」はサブネット自体の属性ではなく、<strong>関連付けられたルートテーブルの内容</strong>で決まります。</p>
</div>`,
      },
      {
        heading: "ルートテーブルとゲートウェイ(IGW/NAT)",
        html: `
<p><strong>ルートテーブル</strong>は「宛先CIDRごとにパケットをどこへ送るか」を定義し、サブネットに関連付けます。VPC内部向けのローカルルートは常に存在し、削除できません。</p>
<p>外部との接続には2種類のゲートウェイを使い分けます。</p>
<ul>
  <li><strong>インターネットゲートウェイ(IGW)</strong>: VPCとインターネットの出入口。パブリックサブネットのリソースは、パブリックIPアドレスとIGWへのルート(0.0.0.0/0 → igw)の両方がそろって初めてインターネットと双方向に通信できます</li>
  <li><strong>NATゲートウェイ</strong>: プライベートサブネットのリソースが<strong>外向き(アウトバウンド)のみ</strong>インターネットへ出るためのマネージドNAT。パッチ取得や外部API呼び出しに使います。インターネット側から内側への接続開始はできません</li>
</ul>
<p>NATゲートウェイは<strong>パブリックサブネットに配置</strong>し、プライベートサブネットのルートテーブルに「0.0.0.0/0 → NATゲートウェイ」のルートを追加します。NATゲートウェイはAZ単位のリソースのため、可用性を高めるには<strong>AZごとに配置</strong>します。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「プライベートサブネットのEC2がインターネットからパッチを取得できない」→ NATゲートウェイとルートの確認、「パブリックサブネットのEC2に接続できない」→ パブリックIPの有無・IGWへのルート・セキュリティグループの確認、が典型的なトラブルシュートの流れです。</p>
</div>`,
      },
      {
        heading: "セキュリティグループとネットワークACLの違い",
        html: `
<p>VPCの通信制御には<strong>セキュリティグループ(SG)</strong>と<strong>ネットワークACL(NACL)</strong>の2層があり、両者の違いは最頻出の比較ポイントです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>セキュリティグループ</th><th>ネットワークACL</th></tr></thead>
  <tbody>
    <tr><td>適用単位</td><td>インスタンス(ENI)単位</td><td>サブネット単位</td></tr>
    <tr><td>ルール</td><td>許可のみ</td><td>許可と<strong>拒否</strong>の両方</td></tr>
    <tr><td>状態管理</td><td><strong>ステートフル</strong>(戻り通信は自動許可)</td><td><strong>ステートレス</strong>(戻り通信も明示的な許可が必要)</td></tr>
    <tr><td>評価方法</td><td>全ルールを評価</td><td>ルール番号の小さい順に評価し、最初に一致したルールを適用</td></tr>
  </tbody>
</table>
</div>
<p>NACLはステートレスのため、インバウンドを許可しただけでは応答が返れません。クライアントが使う<strong>エフェメラルポート(一時ポート、1024〜65535)</strong>のアウトバウンド許可が必要です。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p><strong>特定のIPアドレスからの通信を明示的に拒否(ブロック)したい場合は、拒否ルールを書けるNACLを使います</strong>。SGでは拒否ルールを作成できません。</p>
</div>`,
      },
      {
        heading: "VPCエンドポイント入門",
        html: `
<p>プライベートサブネットのリソースがS3などのAWSサービスへアクセスする場合、NATゲートウェイ経由ではインターネットを通り、処理料金もかかります。<strong>VPCエンドポイント</strong>を使うと、<strong>インターネットを経由せず</strong>AWSネットワーク内で直接サービスに接続できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>種類</th><th>対応サービス</th><th>仕組み</th><th>料金</th></tr></thead>
  <tbody>
    <tr><td>ゲートウェイエンドポイント</td><td><strong>S3とDynamoDBのみ</strong></td><td>ルートテーブルにルートを追加</td><td><strong>無料</strong></td></tr>
    <tr><td>インターフェイスエンドポイント(AWS PrivateLink)</td><td>多数のAWSサービス、SaaS</td><td>サブネットにENI(プライベートIP)を作成</td><td>有料(時間+データ量)</td></tr>
  </tbody>
</table>
</div>
<p>「VPC内のEC2からインターネットを経由せずにS3へアクセスしたい」という要件には、無料の<strong>ゲートウェイエンドポイント</strong>が第一候補です。オンプレミスからの接続や、S3・DynamoDB以外のサービスへの接続には<strong>インターフェイスエンドポイント</strong>を使います。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>NAT経由のS3アクセスをゲートウェイエンドポイントへ切り替えると、セキュリティ向上(インターネット非経由)とNAT処理料金の削減を同時に達成できます。コスト最適化の定番パターンです。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch04-q01",
      "basics-ch04-q02",
      "basics-ch04-q03",
      "basics-ch04-q04",
      "basics-ch04-q05",
      "basics-ch04-q06",
    ],
  },
  {
    id: "basics-ch05",
    domain: null,
    title: "Amazon S3 — オブジェクトストレージ",
    sections: [
      {
        heading: "バケットとオブジェクトの基本",
        html: `
<p><strong>Amazon S3(Simple Storage Service)</strong>は、容量無制限で高い耐久性を持つ<strong>オブジェクトストレージ</strong>です。ファイル(オブジェクト)を<strong>バケット</strong>に格納し、キー(名前)で識別します。HTTPSベースのAPIでアクセスし、OSにマウントして使うブロックストレージとは性質が異なります。</p>
<ul>
  <li>バケット名は<strong>全世界で一意</strong>である必要があります。一方、バケット自体は特定のリージョンに作成されます</li>
  <li>標準クラスはデータを<strong>複数のAZに自動的に冗長化</strong>して保存し、イレブンナイン(99.999999999%)の耐久性を実現します</li>
  <li>1オブジェクトの最大サイズは5TBです。大きなファイルはマルチパートアップロードで分割転送します</li>
</ul>
<p>静的ウェブサイトホスティング、ログやバックアップの保管、データレイクの基盤など、幅広い用途で使われる、試験で最頻出のサービスです。</p>`,
      },
      {
        heading: "ストレージクラスの選び方",
        html: `
<p>S3は<strong>アクセス頻度と取り出し要件</strong>に応じた複数のストレージクラスを提供し、適切に選ぶことで保存コストを大きく削減できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>クラス</th><th>特徴</th><th>典型的な用途</th></tr></thead>
  <tbody>
    <tr><td>S3 Standard</td><td>高頻度アクセス向けの標準クラス</td><td>頻繁に読み書きするデータ</td></tr>
    <tr><td>S3 Intelligent-Tiering</td><td>アクセスパターンに応じて<strong>自動で階層移動</strong>。取り出し料金なし</td><td><strong>アクセスパターンが不明・変化する</strong>データ</td></tr>
    <tr><td>S3 Standard-IA</td><td>低頻度アクセス向け。保存料金が安く、取り出し料金あり</td><td>月1回程度参照するバックアップ</td></tr>
    <tr><td>S3 One Zone-IA</td><td>単一AZ保存でStandard-IAよりさらに安価</td><td>再作成可能な低頻度データ</td></tr>
    <tr><td>S3 Glacier Instant Retrieval</td><td>アーカイブ価格で<strong>ミリ秒アクセス</strong></td><td>四半期に1回程度参照するアーカイブ</td></tr>
    <tr><td>S3 Glacier Flexible Retrieval</td><td>取り出しに数分〜数時間</td><td>即時性が不要なアーカイブ</td></tr>
    <tr><td>S3 Glacier Deep Archive</td><td>最安。取り出しに<strong>12時間以上</strong></td><td>規制対応の長期保管(7〜10年)</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「アクセスパターンが予測できない」→ Intelligent-Tiering、「ほぼアクセスしない長期保管で取り出しは半日待てる」→ Deep Archive、「失っても再生成できる低頻度データ」→ One Zone-IA、が決め手になる定番パターンです。</p>
</div>`,
      },
      {
        heading: "ライフサイクルとバージョニング",
        html: `
<p><strong>ライフサイクルルール</strong>を設定すると、オブジェクトの経過日数に応じてストレージクラスの移行や削除を<strong>自動化</strong>できます。「30日後にStandard-IAへ移行、90日後にGlacier Flexible Retrievalへ移行、365日後に削除」のような段階的な運用を、手作業なしで実現します。</p>
<p><strong>バージョニング</strong>を有効化すると、同じキーへの上書きや削除の際に旧バージョンが保持されます。</p>
<ul>
  <li>誤って上書き・削除しても<strong>以前のバージョンに戻せます</strong>(削除は「削除マーカー」の追加として扱われます)</li>
  <li>一度有効化すると「無効化」はできず、「停止(サスペンド)」のみ可能です</li>
  <li>旧バージョンも保存料金がかかるため、ライフサイクルルールで旧バージョンを一定期間後に削除・移行する設計が定番です</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「誤削除への対策」と問われたらバージョニング(必要ならMFA Delete併用)、「コスト削減の自動化」と問われたらライフサイクルルール、と役割を区別しましょう。</p>
</div>`,
      },
      {
        heading: "暗号化とパブリックアクセスの制御",
        html: `
<p>S3の保存時暗号化(サーバー側暗号化)には主に次の方式があります。現在は<strong>すべての新規オブジェクトがデフォルトで暗号化</strong>されます(既定はSSE-S3)。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>方式</th><th>鍵の管理</th><th>選ぶ場面</th></tr></thead>
  <tbody>
    <tr><td>SSE-S3</td><td>S3が管理する鍵</td><td>特別な要件がない場合の既定</td></tr>
    <tr><td>SSE-KMS</td><td>AWS KMSの鍵(カスタマーマネージドキー可)</td><td><strong>鍵の利用を監査・制御したい</strong>、鍵のローテーションを自分で管理したい</td></tr>
    <tr><td>SSE-C</td><td>利用者が持ち込む鍵</td><td>鍵を自社で完全管理する特殊要件</td></tr>
  </tbody>
</table>
</div>
<p>アクセス制御の中心は<strong>ブロックパブリックアクセス</strong>と<strong>バケットポリシー</strong>です。</p>
<ul>
  <li><strong>ブロックパブリックアクセス</strong>: バケットやアカウント全体で公開設定を強制的に無効化する安全装置。<strong>デフォルトで有効</strong>で、公開が不要なら有効のまま維持します</li>
  <li><strong>バケットポリシー</strong>: バケットに付与するリソースベースのポリシー。特定VPCエンドポイントからのみ許可、HTTPS必須(aws:SecureTransport)などの制御ができます</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「S3バケットの意図しない公開を防ぐ」対策は、<strong>ブロックパブリックアクセスの有効化</strong>と<strong>バケットポリシー/ACLの見直し</strong>が基本セットです。KMS暗号化やバージョニングは公開防止の対策ではない点に注意しましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch05-q01",
      "basics-ch05-q02",
      "basics-ch05-q03",
      "basics-ch05-q04",
      "basics-ch05-q05",
      "basics-ch05-q06",
    ],
  },
  {
    id: "basics-ch06",
    domain: null,
    title: "EBS・EFS・FSx — ブロック/ファイルストレージ",
    sections: [
      {
        heading: "ストレージ3分類とサービスの対応",
        html: `
<p>AWSのストレージは、データの持ち方によって3種類に大別されます。要件からこの分類を判断できることが、ストレージ問題の出発点です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>分類</th><th>特徴</th><th>AWSサービス</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>ブロックストレージ</td><td>OSにディスクとして見える。低レイテンシ</td><td>Amazon EBS、インスタンスストア</td><td>OS起動ボリューム、データベース</td></tr>
    <tr><td>ファイルストレージ</td><td>NFS/SMBで<strong>複数サーバーから共有</strong></td><td>Amazon EFS、Amazon FSx</td><td>共有ディレクトリ、コンテンツ管理</td></tr>
    <tr><td>オブジェクトストレージ</td><td>APIでアクセス。容量無制限</td><td>Amazon S3</td><td>バックアップ、静的コンテンツ、データレイク</td></tr>
  </tbody>
</table>
</div>
<p><strong>インスタンスストア</strong>はホスト物理サーバー内蔵の一時ディスクで、超高速ですが<strong>インスタンスの停止・終了でデータが消えます</strong>。永続化が必要なデータには使わず、キャッシュや一時ファイルに限定します。</p>`,
      },
      {
        heading: "EBSボリュームタイプ",
        html: `
<p><strong>Amazon EBS(Elastic Block Store)</strong>は、EC2にアタッチして使うネットワーク接続型のブロックストレージです。ボリュームは<strong>特定のAZ内</strong>に作成され、<strong>同じAZのインスタンス</strong>にのみアタッチできます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>タイプ</th><th>特徴</th><th>用途</th></tr></thead>
  <tbody>
    <tr><td>gp3(汎用SSD)</td><td>基本性能3,000 IOPSを容量と独立して設定可能(最大16,000 IOPS)。gp2よりコスト効率が良い</td><td>ほとんどのワークロードの第一候補</td></tr>
    <tr><td>io2 Block Express(プロビジョンドIOPS SSD)</td><td>高いIOPSと低レイテンシを保証。Multi-Attach対応</td><td>gp3の上限を超えるIOPSが必要なミッションクリティカルなDB</td></tr>
    <tr><td>st1(スループット最適化HDD)</td><td>大容量シーケンシャル読み書きに強い安価なHDD</td><td>ビッグデータ、ログ処理、DWH</td></tr>
    <tr><td>sc1(Cold HDD)</td><td>最安のHDD</td><td>アクセス頻度の低いデータ</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>迷ったらgp3が基本です。「16,000 IOPSを超える性能が必要」「レイテンシ要件が厳しい基幹DB」のときだけio2を選びます。HDD系(st1/sc1)は起動ボリュームには使えません。</p>
</div>`,
      },
      {
        heading: "スナップショットと暗号化",
        html: `
<p><strong>EBSスナップショット</strong>は、ボリュームのバックアップをS3(AWS管理領域)に保存する機能です。</p>
<ul>
  <li><strong>増分バックアップ</strong>: 初回以降は変更ブロックのみ保存されるため、容量とコストを節約できます</li>
  <li>スナップショットから<strong>別のAZに新しいボリュームを復元</strong>できます。AZ単位のリソースであるEBSをAZ間で移動する標準手段です</li>
  <li>スナップショットを<strong>別リージョンへコピー</strong>すれば、災害対策(DR)にも使えます</li>
  <li>スナップショットからAMIを作成し、同じ構成のインスタンスを展開することもできます</li>
</ul>
<p>EBSは作成時に<strong>KMSによる暗号化</strong>を指定できます。暗号化されたボリュームのスナップショット、そこから復元したボリュームも自動的に暗号化されます。<strong>既存の未暗号化ボリュームを直接暗号化することはできない</strong>ため、スナップショットを取得し、暗号化を有効にしてコピーしてから復元する手順を踏みます。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>定期スナップショットの自動化には、Amazon Data Lifecycle ManagerやAWS Backupを使うのが「最小の運用負荷」の答えです。cronで自前スクリプトを回す選択肢は原則誤答です。</p>
</div>`,
      },
      {
        heading: "EFS — 共有ファイルストレージ",
        html: `
<p><strong>Amazon EFS(Elastic File System)</strong>は、NFSプロトコルで利用するフルマネージドのファイルストレージです。EBSとの最大の違いは<strong>複数のインスタンスから同時にマウントできる</strong>ことです。</p>
<ul>
  <li><strong>Linux専用</strong>(NFS)。Windowsからは利用できません</li>
  <li>複数AZにまたがって冗長化され、<strong>異なるAZのインスタンスからも同じファイルシステムを共有</strong>できます</li>
  <li>容量は自動的に伸縮し、事前のプロビジョニングが不要です</li>
  <li>低頻度アクセス用のストレージクラス(EFS IA)とライフサイクル管理でコストを削減できます</li>
</ul>
<p>「複数のEC2(またはECS/EKSのコンテナ、Lambda)から同じファイルを読み書きしたい」「Auto Scalingで増減するWebサーバー群でコンテンツを共有したい」という要件がEFSの合図です。単一インスタンス専用で低レイテンシが必要ならEBS、と使い分けます。</p>`,
      },
      {
        heading: "FSxファミリーの使い分け",
        html: `
<p><strong>Amazon FSx</strong>は、特定のファイルシステムをフルマネージドで提供するサービス群です。要件のキーワードからどのFSxを選ぶかが試験の定番です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>キーワード</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>FSx for Windows File Server</td><td><strong>SMB、Active Directory連携、Windows</strong></td><td>Windowsアプリの共有ドライブ、ファイルサーバー移行</td></tr>
    <tr><td>FSx for Lustre</td><td><strong>HPC、機械学習、高スループット、S3連携</strong></td><td>大規模並列処理、ML学習データの高速処理</td></tr>
    <tr><td>FSx for NetApp ONTAP</td><td>マルチプロトコル(NFS/SMB/iSCSI)、ONTAP機能</td><td>NetAppからの移行、Linux/Windows混在環境</td></tr>
    <tr><td>FSx for OpenZFS</td><td>ZFS、NFS、低レイテンシ</td><td>ZFSベースのワークロード移行</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>ファイル共有の要件整理は「Linux+NFSの汎用共有 → EFS」「Windows+SMB+AD → FSx for Windows File Server」「HPC/MLの高速処理+S3連携 → FSx for Lustre」の3パターンをまず当てはめるのが鉄則です。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch06-q01",
      "basics-ch06-q02",
      "basics-ch06-q03",
      "basics-ch06-q04",
      "basics-ch06-q05",
      "basics-ch06-q06",
    ],
  },
];
