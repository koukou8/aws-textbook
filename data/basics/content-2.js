// AWS基礎 後半(第7〜12章)の章コンテンツ
export const chapters = [
  {
    id: "basics-ch07",
    domain: null,
    title: "RDS・Aurora・DynamoDB — データベースの基礎",
    sections: [
      {
        heading: "Amazon RDSとは — マネージドリレーショナルデータベース",
        html: `
<p><strong>Amazon RDS(Relational Database Service)</strong>は、リレーショナルデータベースをマネージドサービスとして提供するものです。MySQL、PostgreSQL、MariaDB、Oracle、SQL Serverなどのエンジンを選択でき、データベースソフトウェアのインストール・パッチ適用・バックアップといった定型的な運用作業をAWSに任せられます。</p>
<p>EC2に自分でデータベースをインストールする方法と比べると、担当範囲は次のように変わります。</p>
<ul>
  <li><strong>AWSが担当</strong>: ハードウェア管理、OS・DBエンジンのパッチ適用、自動バックアップ、フェイルオーバーの仕組み</li>
  <li><strong>利用者が担当</strong>: スキーマ設計、クエリのチューニング、インスタンスサイズやパラメータの選定、アクセス制御</li>
</ul>
<p>自動バックアップを有効にすると、保持期間内の任意の時点へ復元する<strong>ポイントインタイムリカバリ</strong>が利用できます。「運用負荷を減らしてリレーショナルデータベースを使いたい」という要件では、EC2への自前構築ではなくRDSを選ぶのが基本です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>試験で「最小の運用負荷」が問われたら、自前構築よりマネージドサービス(RDSやAurora)を優先して選びます。</p>
</div>`,
      },
      {
        heading: "マルチAZ配置 — 高可用性のための仕組み",
        html: `
<p><strong>マルチAZ配置</strong>は、RDSの可用性を高めるオプションです。プライマリDBインスタンスとは別のアベイラビリティーゾーン(AZ)に<strong>スタンバイレプリカ</strong>が作成され、データは<strong>同期レプリケーション</strong>で常に複製されます。</p>
<p>プライマリに障害が発生したり、AZ全体が使えなくなったりすると、<strong>自動フェイルオーバー</strong>によってスタンバイが新しいプライマリに昇格します。接続先のDNSエンドポイントは変わらないため、アプリケーション側の接続文字列を書き換える必要はありません。</p>
<ul>
  <li>目的は<strong>高可用性</strong>(障害時のダウンタイム最小化)</li>
  <li>スタンバイは通常時、読み取りクエリの処理には使えない(待機専用)</li>
  <li>性能(読み取りスループット)は向上しない</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「マルチAZ=可用性対策」であり、読み取り性能の改善策ではありません。性能目的の選択肢としてマルチAZが出てきたら誤答です。なお、リーダブルスタンバイを2つ持つ「マルチAZ DBクラスター」という発展形もありますが、まずは基本形(スタンバイ1台・読み取り不可)を確実に押さえましょう。</p>
</div>`,
      },
      {
        heading: "リードレプリカ — 読み取りのスケーリング",
        html: `
<p><strong>リードレプリカ</strong>は、プライマリDBの複製を作り、<strong>読み取り専用クエリをオフロード</strong>するための仕組みです。レプリケーションは<strong>非同期</strong>で行われるため、プライマリとの間にわずかな遅延(レプリカラグ)が生じる可能性があります。レポート集計や分析クエリなど、読み取り負荷が本体の性能を圧迫する場合に有効です。</p>
<p>リードレプリカは専用のエンドポイントを持ち、アプリケーションが読み取り先として明示的に指定します。別リージョンへの作成(クロスリージョンリードレプリカ)も可能で、災害対策やグローバル展開の読み取り拠点としても使えます。障害時には手動で昇格させてスタンドアロンのDBにできます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>比較項目</th><th>マルチAZ配置</th><th>リードレプリカ</th></tr></thead>
  <tbody>
    <tr><td>目的</td><td>高可用性(フェイルオーバー)</td><td>読み取り性能のスケール</td></tr>
    <tr><td>レプリケーション</td><td>同期</td><td>非同期</td></tr>
    <tr><td>読み取りへの利用</td><td>不可(スタンバイは待機専用)</td><td>可(専用エンドポイント)</td></tr>
    <tr><td>障害時</td><td>自動フェイルオーバー</td><td>手動で昇格</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「フェイルオーバーしたい(可用性)」ならマルチAZ、「読み取り負荷を下げたい(性能)」ならリードレプリカ。この対比は両試験で最頻出です。</p>
</div>`,
      },
      {
        heading: "Amazon Auroraの特徴",
        html: `
<p><strong>Amazon Aurora</strong>は、AWSがクラウド向けに設計したリレーショナルデータベースで、<strong>MySQLおよびPostgreSQLと互換性</strong>があります。既存アプリケーションのドライバやSQLをほぼそのまま使いながら、標準的な構成より高いスループットを得られるとされています。</p>
<p>アーキテクチャ上の特徴は次のとおりです。</p>
<ul>
  <li><strong>ストレージの自動レプリケーション</strong>: データを<strong>3つのAZに合計6つ</strong>複製して保存し、高い耐久性を実現</li>
  <li><strong>ストレージの自動拡張</strong>: 事前のサイズ指定が不要で、使用量に応じて自動的に拡張</li>
  <li><strong>最大15個のAuroraレプリカ</strong>: 読み取りをスケールしつつ、フェイルオーバー先としても機能</li>
  <li><strong>Aurora Serverless</strong>: 負荷に応じて容量を自動調整する構成。断続的・予測しにくいワークロードに適する</li>
  <li><strong>Aurora Global Database</strong>: 複数リージョンにまたがる構成で、リージョン障害への備えや海外拠点からの低レイテンシ読み取りに使える</li>
</ul>
<p>「MySQL互換のまま可用性と性能を高めたい」「ストレージ管理の手間をなくしたい」という要件が出たら、Auroraが有力な選択肢になります。</p>`,
      },
      {
        heading: "DynamoDBとElastiCache — NoSQLとインメモリキャッシュ",
        html: `
<p><strong>Amazon DynamoDB</strong>は、フルマネージドの<strong>NoSQL(キーバリュー)データベース</strong>です。サーバーのプロビジョニングが不要で、規模にかかわらず<strong>1桁ミリ秒</strong>の応答時間を実現します。ゲームのユーザーデータ、セッション情報、IoTデバイスのデータ、ショッピングカートなど、「キーを指定して高速に読み書きする」ワークロードに適しています。有効期限切れの項目を自動削除するTTLや、リクエスト数に応じて課金されるオンデマンドキャパシティモードも特徴です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>RDS / Aurora</th><th>DynamoDB</th></tr></thead>
  <tbody>
    <tr><td>データモデル</td><td>リレーショナル(表・結合)</td><td>キーバリュー</td></tr>
    <tr><td>得意なクエリ</td><td>複雑なSQL・集計・トランザクション処理全般</td><td>キー指定の高速な読み書き</td></tr>
    <tr><td>スケール</td><td>インスタンスサイズ変更やレプリカ追加</td><td>自動で水平スケール</td></tr>
    <tr><td>典型例</td><td>会計・在庫・基幹系</td><td>セッション、IoT、ゲーム</td></tr>
  </tbody>
</table>
</div>
<p><strong>Amazon ElastiCache</strong>は、Valkey・Memcached・Redis OSS互換の<strong>インメモリキャッシュ</strong>サービスです。データベースの手前にキャッシュ層として置き、同じ読み取りクエリの結果をメモリから返すことで、データベースの負荷軽減と応答の高速化を図ります。セッションストアやランキング(リーダーボード)にもよく使われます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>ElastiCacheは永続的なデータの保管場所ではなく「読み取りを速くする補助層」です。データベース本体の代わりにはなりません。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch07-q01",
      "basics-ch07-q02",
      "basics-ch07-q03",
      "basics-ch07-q04",
      "basics-ch07-q05",
      "basics-ch07-q06",
    ],
  },
  {
    id: "basics-ch08",
    domain: null,
    title: "ELBとAuto Scaling — 負荷分散とスケーリング",
    sections: [
      {
        heading: "Elastic Load Balancingの役割と種類",
        html: `
<p><strong>Elastic Load Balancing(ELB)</strong>は、受信したトラフィックを複数のターゲット(EC2インスタンス、コンテナ、IPアドレスなど)に自動で振り分けるサービスです。1台に負荷が集中するのを防ぎ、複数AZにまたがる冗長構成の入口になります。主なロードバランサーは次の3種類です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>種類</th><th>動作レイヤー</th><th>特徴・使いどころ</th></tr></thead>
  <tbody>
    <tr><td>Application Load Balancer(ALB)</td><td>L7(HTTP/HTTPS)</td><td>パスやホスト名に基づくルーティング、WebアプリやAPI、コンテナとの相性がよい</td></tr>
    <tr><td>Network Load Balancer(NLB)</td><td>L4(TCP/UDP)</td><td>超低レイテンシ・大量トラフィック、AZごとの固定IPアドレスを持てる</td></tr>
    <tr><td>Gateway Load Balancer(GWLB)</td><td>L3</td><td>ファイアウォールなどのネットワーク仮想アプライアンスへの振り分け</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「URLのパスごとに振り分けたい」「HTTPヘッダーで判断したい」ならALB、「TCP/UDPをさばきたい」「固定IPが必要」「ミリ秒未満の低レイテンシ」ならNLB。この使い分けが定番の出題ポイントです。</p>
</div>`,
      },
      {
        heading: "ターゲットグループとヘルスチェック",
        html: `
<p>ELBは、振り分け先を<strong>ターゲットグループ</strong>という単位で管理します。ターゲットグループには<strong>ヘルスチェック</strong>を設定でき、指定したパス(例: /health)への応答を定期的に確認して、各ターゲットを正常(healthy)・異常(unhealthy)と判定します。</p>
<ul>
  <li>ロードバランサーは<strong>正常なターゲットだけ</strong>にリクエストを送る</li>
  <li>異常と判定されたターゲットは振り分け対象から自動的に外れる</li>
  <li>復帰してヘルスチェックに合格すると、再び振り分け対象に戻る</li>
</ul>
<p>ALBのリスナーには「どのポートで受けて、どのターゲットグループへ転送するか」というルールを定義します。パスベースルーティング(例: /api/* はAPI用グループへ、/img/* は画像配信用グループへ)を使うと、1つのALBで複数のサービスを振り分けられます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>ELBのヘルスチェックは「異常なターゲットへ送らない」仕組みであり、異常なインスタンスを修復・交換する機能はありません。交換まで自動化するには、次に学ぶAuto Scalingグループと組み合わせます。</p>
</div>`,
      },
      {
        heading: "Auto Scalingグループの基礎",
        html: `
<p><strong>Amazon EC2 Auto Scaling</strong>は、EC2インスタンスの台数を需要に合わせて自動調整するサービスです。インスタンスの集合を<strong>Auto Scalingグループ(ASG)</strong>として管理し、起動テンプレートに定義したAMI・インスタンスタイプ・セキュリティグループなどを使って同じ構成のインスタンスを起動します。</p>
<p>台数は次の3つの値で制御します。</p>
<ul>
  <li><strong>最小キャパシティ(min)</strong>: 下回らない台数。可用性の下限</li>
  <li><strong>希望キャパシティ(desired)</strong>: 現在維持したい台数</li>
  <li><strong>最大キャパシティ(max)</strong>: 上限。コストの歯止め</li>
</ul>
<p>ASGには2つの重要な働きがあります。1つは<strong>スケーリング</strong>(需要に応じた増減)、もう1つは<strong>自己修復</strong>です。ヘルスチェックに失敗したインスタンスを自動的に終了し、新しいインスタンスに置き換えて希望台数を維持します。ELBと連携させると、ELBのヘルスチェック結果をASGの判定に使うこともできます。複数AZにまたがってインスタンスを分散配置するのが基本形です。</p>`,
      },
      {
        heading: "スケーリングポリシーの使い分け",
        html: `
<p>台数をいつ増減させるかは<strong>スケーリングポリシー</strong>で決めます。代表的な方式と使いどころは次のとおりです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>方式</th><th>動き</th><th>向いている場面</th></tr></thead>
  <tbody>
    <tr><td>ターゲット追跡スケーリング</td><td>指標(例: 平均CPU使用率50%)を目標値に保つよう自動調整</td><td>最も簡単で汎用的。まず検討する方式</td></tr>
    <tr><td>ステップスケーリング</td><td>アラームの超過幅に応じて段階的に増減</td><td>増減量を細かく制御したい場合</td></tr>
    <tr><td>スケジュールされたスケーリング</td><td>指定した日時に台数を変更</td><td>営業開始時刻やセール開始など、需要の変化が事前にわかる場合</td></tr>
    <tr><td>予測スケーリング</td><td>過去の傾向を機械学習で分析し先回りして増減</td><td>周期的なパターンがあるワークロード</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「平均CPU使用率を50%程度に保ちたい」のような要件には、最小の設定で済むターゲット追跡が正解になりやすいです。「毎週月曜9時にアクセスが急増するとわかっている」なら、スケジュールされたスケーリングで事前に台数を増やしておくのが定石です。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch08-q01",
      "basics-ch08-q02",
      "basics-ch08-q03",
      "basics-ch08-q04",
      "basics-ch08-q05",
      "basics-ch08-q06",
    ],
  },
  {
    id: "basics-ch09",
    domain: null,
    title: "Route 53とCloudFront — DNSとコンテンツ配信",
    sections: [
      {
        heading: "Route 53の基礎とホストゾーン",
        html: `
<p><strong>Amazon Route 53</strong>は、可用性の高いマネージドDNSサービスです。ドメイン名の登録、DNSレコードの管理、ヘルスチェックによる死活監視の3つの機能を持ちます。</p>
<p>DNSレコードは<strong>ホストゾーン</strong>という単位で管理します。</p>
<ul>
  <li><strong>パブリックホストゾーン</strong>: インターネット上の名前解決に応答する(例: example.com を公開サイトのIPへ)</li>
  <li><strong>プライベートホストゾーン</strong>: 関連付けた<strong>VPC内からの問い合わせにのみ</strong>応答する。社内システムの内部ドメインなどに使う</li>
</ul>
<p>レコードにはAレコード(名前→IPv4アドレス)、CNAMEレコード(名前→別の名前)などの標準タイプに加えて、Route 53独自の<strong>エイリアスレコード</strong>があります。エイリアスレコードは、ALBやCloudFront、S3の静的ウェブサイトといった<strong>AWSリソースを直接指し示せる</strong>レコードです。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>CNAMEレコードはゾーン頂点(example.com のようなドメインそのもの)には設定できません。ゾーン頂点からALBなどへ向けたい場合はエイリアスレコードを使います。</p>
</div>`,
      },
      {
        heading: "主要ルーティングポリシーの使い分け",
        html: `
<p>Route 53は、同じ名前への問い合わせにどう応答するかを<strong>ルーティングポリシー</strong>で制御できます。要件のキーワードとポリシーを対応付けて覚えるのが近道です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ポリシー</th><th>動き</th><th>典型的な要件</th></tr></thead>
  <tbody>
    <tr><td>シンプル</td><td>固定の値を返す</td><td>単一リソースへの基本的な名前解決</td></tr>
    <tr><td>加重(Weighted)</td><td>指定した比率で複数リソースに振り分け</td><td>新バージョンへ10%だけ流すカナリアリリース、A/Bテスト</td></tr>
    <tr><td>レイテンシー</td><td>利用者にとって遅延が最小のリージョンへ誘導</td><td>複数リージョン展開で応答速度を最優先</td></tr>
    <tr><td>フェイルオーバー</td><td>ヘルスチェック失敗時にセカンダリへ切り替え</td><td>プライマリ/スタンバイ構成の災害対策</td></tr>
    <tr><td>位置情報(Geolocation)</td><td>利用者の地理的な場所で応答を変える</td><td>国ごとにコンテンツや規制対応を変えたい</td></tr>
    <tr><td>複数値回答</td><td>正常な複数のIPをランダムに返す</td><td>簡易な負荷分散と死活確認の組み合わせ</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「遅延が最小」ならレイテンシー、「比率を指定」なら加重、「プライマリ障害時に切り替え」ならフェイルオーバー、「国・地域で出し分け」なら位置情報。問題文の要件語からポリシーを即断できるようにしましょう。</p>
</div>`,
      },
      {
        heading: "CloudFrontの仕組み",
        html: `
<p><strong>Amazon CloudFront</strong>は、世界中の<strong>エッジロケーション</strong>からコンテンツを配信するCDN(コンテンツ配信ネットワーク)です。利用者は最寄りのエッジロケーションに接続するため、オリジンサーバーが遠いリージョンにあっても低レイテンシで応答を受け取れます。</p>
<p>基本的な構成要素は次のとおりです。</p>
<ul>
  <li><strong>ディストリビューション</strong>: CloudFrontの設定単位。ドメイン名が割り当てられる</li>
  <li><strong>オリジン</strong>: 配信元。S3バケット、ALB、任意のHTTPサーバーなどを指定できる</li>
  <li><strong>キャッシュビヘイビア</strong>: パスパターンごとにキャッシュの規則や転送先オリジンを設定</li>
</ul>
<p>S3をオリジンにする場合は、<strong>オリジンアクセスコントロール(OAC)</strong>を設定することで、S3バケットへの直接アクセスを禁止し、CloudFront経由のアクセスだけを許可できます。また、署名付きURL・署名付きCookieを使えば、会員限定コンテンツのようなプライベートな配信も可能です。</p>`,
      },
      {
        heading: "エッジキャッシュの動作とTTL",
        html: `
<p>CloudFrontの性能を左右するのが<strong>キャッシュヒット率</strong>です。エッジロケーションにキャッシュがあればそのまま返し(ヒット)、なければオリジンへ取りに行きます(ミス)。ヒット率が高いほど応答は速くなり、オリジンの負荷と転送コストも下がります。</p>
<p>キャッシュの保持時間は<strong>TTL(Time to Live)</strong>で制御します。更新頻度が低い静的コンテンツはTTLを長く、頻繁に変わるものは短くするのが基本です。公開済みのファイルを今すぐ差し替えたい場合は、<strong>キャッシュの無効化(Invalidation)</strong>を実行するか、ファイル名にバージョンを付けて新しいURLで配信します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>比較項目</th><th>CloudFront</th><th>AWS Global Accelerator</th></tr></thead>
  <tbody>
    <tr><td>方式</td><td>エッジでの<strong>キャッシュ配信</strong></td><td>AWSのネットワーク網経由の<strong>経路最適化</strong>(キャッシュなし)</td></tr>
    <tr><td>対象</td><td>HTTP/HTTPSコンテンツ</td><td>TCP/UDPアプリケーション全般</td></tr>
    <tr><td>IPアドレス</td><td>ドメイン名でアクセス</td><td>固定のエニーキャストIPを提供</td></tr>
    <tr><td>典型用途</td><td>静的コンテンツ・動画・Webサイト配信</td><td>ゲーム、VoIP、固定IPが必要なAPI</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「キャッシュして配信を速くする」ならCloudFront、「キャッシュできないTCP/UDP通信を速くする・固定IPが欲しい」ならGlobal Acceleratorです。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch09-q01",
      "basics-ch09-q02",
      "basics-ch09-q03",
      "basics-ch09-q04",
      "basics-ch09-q05",
      "basics-ch09-q06",
    ],
  },
  {
    id: "basics-ch10",
    domain: null,
    title: "CloudWatch・CloudTrail・Config — 運用と監視の基礎",
    sections: [
      {
        heading: "CloudWatchメトリクスとアラーム",
        html: `
<p><strong>Amazon CloudWatch</strong>は、AWSリソースとアプリケーションを監視するサービスです。中心となるのが<strong>メトリクス</strong>で、EC2のCPU使用率やELBのリクエスト数など、多くのサービスが標準で数値データを送信します。EC2の標準メトリクスは5分間隔で、<strong>詳細モニタリング</strong>を有効にすると1分間隔になります。</p>
<p>注意したいのは、<strong>メモリ使用率やディスク使用率はEC2の標準メトリクスに含まれない</strong>ことです。これらはOSの内部情報のため、<strong>CloudWatchエージェント</strong>をインスタンスに導入してカスタムメトリクスとして送信します。</p>
<p>メトリクスに対しては<strong>アラーム</strong>を設定できます。アラームはOK・ALARM・INSUFFICIENT_DATA(データ不足)の3状態を持ち、しきい値超過が続いたときに次のようなアクションを実行します。</p>
<ul>
  <li>Amazon SNSトピックへの通知(メールなどで運用チームへ連絡)</li>
  <li>EC2アクション(再起動・停止・復旧)</li>
  <li>Auto Scalingアクション(台数の増減)</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「しきい値を超えたら通知して自動対応する」という監視の基本形は、メトリクス→アラーム→アクション(SNS通知・EC2アクション・Auto Scaling)の流れで構成します。</p>
</div>`,
      },
      {
        heading: "CloudWatch Logsとダッシュボード",
        html: `
<p><strong>CloudWatch Logs</strong>は、ログを集約・保管・検索するサービスです。アプリケーションログ、Lambdaの実行ログ、VPCフローログなどを<strong>ロググループ</strong>に集め、保持期間を設定して管理します。EC2やオンプレミスのサーバーからは、CloudWatchエージェント経由でログを送信します。</p>
<ul>
  <li><strong>Logs Insights</strong>: 専用のクエリ言語でログを検索・集計できる分析機能。障害調査で「特定のエラーメッセージを含む行を数える」といった用途に便利</li>
  <li><strong>メトリクスフィルター</strong>: ログ中の特定パターン(例: ERROR)の出現回数をメトリクス化し、アラームにつなげられる</li>
  <li><strong>ダッシュボード</strong>: 複数のメトリクスやグラフを1画面に並べ、システム全体の状態を一目で把握できる</li>
</ul>
<p>「各サーバーにログインしてログファイルを見る」運用から、「ログを1か所に集めて検索し、異常をアラームで検知する」運用へ移行することが、クラウドでの監視の基本です。</p>`,
      },
      {
        heading: "CloudTrail — 誰が・いつ・何をしたか",
        html: `
<p><strong>AWS CloudTrail</strong>は、AWSアカウント内の<strong>API呼び出しを記録</strong>するサービスです。マネジメントコンソールの操作、CLIやSDKからの呼び出しはすべてAPIとして実行されるため、CloudTrailを見れば「<strong>誰が・いつ・どこから・何をしたか</strong>」を追跡できます。監査やセキュリティ調査(例: 誰がこのインスタンスを削除したのか)の基盤です。</p>
<ul>
  <li><strong>イベント履歴</strong>: 過去<strong>90日分</strong>の管理イベントを追加設定なしで確認できる</li>
  <li><strong>証跡(Trail)</strong>: イベントをS3バケットへ継続的に配信する設定。90日を超える長期保管や、CloudWatch Logsと連携した分析・アラートに使う</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>イベント履歴だけでは90日で消えてしまいます。「1年間の監査ログを保管せよ」のようなコンプライアンス要件が出たら、証跡を作成してS3へ配信するのが正解パターンです。</p>
</div>`,
      },
      {
        heading: "AWS Config — 構成の記録と評価",
        html: `
<p><strong>AWS Config</strong>は、AWSリソースの<strong>設定(構成)の状態と変更履歴を記録</strong>するサービスです。セキュリティグループのルール、S3バケットの公開設定、EBSの暗号化有無といった「リソースが今どう設定されているか」を継続的に記録し、「いつ・どのように変わったか」を時系列でたどれます。</p>
<p>さらに<strong>Configルール</strong>を使うと、望ましい設定をルールとして定義し、リソースが<strong>準拠(compliant)か非準拠(non-compliant)か</strong>を自動評価できます。</p>
<ul>
  <li>例: 「S3バケットはパブリックアクセス禁止であること」「EBSボリュームは暗号化されていること」</li>
  <li>非準拠のリソースを一覧で把握し、通知や自動修復アクションにつなげられる</li>
</ul>
<p>「構成変更の追跡」「設定のコンプライアンス監査」というキーワードが出たら、AWS Configを思い浮かべてください。</p>`,
      },
      {
        heading: "3サービスの役割の整理",
        html: `
<p>CloudWatch・CloudTrail・Configは名前も役割も混同しやすいため、「答える質問」で区別するのが確実です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>答える質問</th><th>記録するもの</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>Amazon CloudWatch</td><td>システムは<strong>今どう動いているか</strong></td><td>メトリクス・ログ・イベント</td><td>性能監視、アラーム、ログ分析</td></tr>
    <tr><td>AWS CloudTrail</td><td><strong>誰が何をしたか</strong></td><td>API呼び出しの履歴</td><td>操作の監査、セキュリティ調査</td></tr>
    <tr><td>AWS Config</td><td>リソースは<strong>どう設定されているか</strong></td><td>構成の状態と変更履歴</td><td>構成監査、コンプライアンス評価</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「CPU使用率の急上昇を検知」→CloudWatch、「誰がセキュリティグループを変更したか」→CloudTrail、「全バケットが非公開設定かを継続監査」→Config。この3つの言い分けは試験で何度も問われます。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch10-q01",
      "basics-ch10-q02",
      "basics-ch10-q03",
      "basics-ch10-q04",
      "basics-ch10-q05",
      "basics-ch10-q06",
    ],
  },
  {
    id: "basics-ch11",
    domain: null,
    title: "Lambdaとコンテナ入門",
    sections: [
      {
        heading: "AWS Lambdaの実行モデル",
        html: `
<p><strong>AWS Lambda</strong>は、サーバーを管理せずにコードを実行できる<strong>サーバーレスコンピューティング</strong>サービスです。コード(関数)をアップロードしておくと、<strong>イベントをきっかけ(トリガー)</strong>に実行されます。実行基盤の確保、OSの管理、負荷に応じたスケールはすべてAWSが行います。</p>
<ul>
  <li><strong>代表的なトリガー</strong>: S3へのファイルアップロード、API Gateway経由のHTTPリクエスト、EventBridgeのスケジュール、SQSのメッセージ到着など</li>
  <li><strong>課金</strong>: リクエスト数と実行時間(確保したメモリ量に比例)に対する従量課金。<strong>待機中は課金されない</strong></li>
  <li><strong>制約</strong>: 1回の実行は<strong>最大15分</strong>。メモリ量は設定で選択し、CPU性能もメモリ量に連動する</li>
  <li><strong>実行ロール</strong>: 関数が他のAWSサービスへアクセスするには、IAMロール(実行ロール)で権限を与える</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>リクエストが増えれば自動で並列実行され、ゼロなら費用もほぼゼロ。「たまにしか動かない処理」「負荷の波が大きい処理」との相性が抜群です。</p>
</div>`,
      },
      {
        heading: "Lambdaの代表的なユースケースと限界",
        html: `
<p>Lambdaがよく使われる場面を押さえましょう。</p>
<ul>
  <li><strong>イベント駆動の処理</strong>: S3に画像がアップロードされたらサムネイルを自動生成する、など</li>
  <li><strong>WebアプリのAPIバックエンド</strong>: Amazon API Gateway + Lambda + DynamoDBのサーバーレス3点セット</li>
  <li><strong>定期実行ジョブ</strong>: EventBridgeのスケジュールで毎晩レポートを作成するなど、cronサーバーの置き換え</li>
  <li><strong>他サービスの「のり付け」</strong>: 通知の加工、データの変換、運用の自動化スクリプト</li>
</ul>
<p>一方で、Lambdaに向かない処理もあります。</p>
<ul>
  <li><strong>15分を超える長時間処理</strong>: 動画の一括変換や大規模バッチはコンテナ(ECS/Fargate)やAWS Batchを検討</li>
  <li><strong>常時稼働・常時接続が前提の処理</strong>: 常に高負荷ならEC2やコンテナのほうがコスト効率がよい場合がある</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「実行時間が数時間かかる」という条件が出たらLambdaは選べません。実行時間の上限(15分)は試験でも実務でも重要な判断基準です。</p>
</div>`,
      },
      {
        heading: "コンテナサービスの全体像 — ECS・EKS・Fargate・ECR",
        html: `
<p>コンテナはアプリケーションと依存関係をひとまとめにして「どこでも同じように動かす」技術です。AWSのコンテナ関連サービスは、役割で整理すると理解しやすくなります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>役割</th><th>特徴</th></tr></thead>
  <tbody>
    <tr><td>Amazon ECS</td><td>オーケストレーター(コンテナの配置・管理)</td><td>AWS独自方式。シンプルで他のAWSサービスとの統合が容易</td></tr>
    <tr><td>Amazon EKS</td><td>オーケストレーター</td><td>Kubernetes互換。既存のKubernetes資産・ノウハウを活かせる</td></tr>
    <tr><td>AWS Fargate</td><td>実行基盤(起動タイプ)</td><td>サーバーレスでコンテナを実行。EC2インスタンスの管理が不要。ECSとEKSの両方で利用可能</td></tr>
    <tr><td>Amazon ECR</td><td>コンテナイメージのレジストリ</td><td>Dockerイメージを保存・共有するマネージドリポジトリ</td></tr>
  </tbody>
</table>
</div>
<p>つまり「<strong>何を動かすか</strong>(イメージ)はECRに置き、<strong>どう並べるか</strong>はECSまたはEKSが決め、<strong>どこで動かすか</strong>はEC2(自分で管理)かFargate(おまかせ)を選ぶ」という関係です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>Kubernetesを使う理由(既存資産・マルチクラウド方針)がなければECS、インスタンス管理をなくしたければFargate、が入門時の目安です。</p>
</div>`,
      },
      {
        heading: "サーバーレスの利点と選択基準",
        html: `
<p>Lambda・Fargateに共通する<strong>サーバーレス</strong>の利点は次のとおりです。</p>
<ul>
  <li>サーバーのプロビジョニング・パッチ適用・容量管理が不要になり、<strong>運用負荷が下がる</strong></li>
  <li>需要に応じて<strong>自動でスケール</strong>する</li>
  <li>使った分だけの<strong>従量課金</strong>で、アイドル時の無駄が少ない</li>
</ul>
<p>コンピューティングの選択は、要件から次のように絞り込めます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>要件</th><th>有力な選択肢</th></tr></thead>
  <tbody>
    <tr><td>イベント駆動・短時間(15分以内)の処理を最小の運用負荷で</td><td>AWS Lambda</td></tr>
    <tr><td>コンテナを使いたいがサーバー管理はしたくない</td><td>AWS Fargate(ECS/EKS)</td></tr>
    <tr><td>OSレベルの制御・特殊なライセンス・GPUなど細かい要件</td><td>Amazon EC2(またはECS on EC2)</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>試験のキーフレーズ「最小の運用負荷(LEAST operational overhead)」は、サーバーレス(Lambda、Fargate)を選ばせる合図であることが非常に多いです。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch11-q01",
      "basics-ch11-q02",
      "basics-ch11-q03",
      "basics-ch11-q04",
      "basics-ch11-q05",
      "basics-ch11-q06",
    ],
  },
  {
    id: "basics-ch12",
    domain: null,
    title: "課金・サポート・Well-Architected",
    sections: [
      {
        heading: "従量課金モデルと無料利用枠",
        html: `
<p>AWSの料金の基本は<strong>従量課金(pay-as-you-go)</strong>です。初期費用や長期契約なしで使い始められ、<strong>使った分だけ</strong>支払います。やめればその時点で課金も止まるため、需要が読めない新規事業や検証にも向いています。</p>
<p>一方、使用量が安定しているワークロードでは、EC2の<strong>リザーブドインスタンス</strong>や<strong>Savings Plans</strong>のように、1年または3年の利用を約束する代わりに大幅な割引を受ける選択肢があります。中断されてもよい処理には、空きキャパシティを格安で使う<strong>スポットインスタンス</strong>も有効です。</p>
<p>学習や試用のためには<strong>無料利用枠</strong>が用意されています。従来は「12か月無料」「常時無料」「短期トライアル」の3種類で構成されてきました(なお2025年7月以降の新規アカウントでは、クレジット付与型の無料プランへの移行が進んでいます)。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「定常稼働ならSavings Plans/リザーブド、中断可能ならスポット、読めない需要はオンデマンド」という購入オプションの使い分けは、コスト最適化の定番論点です。</p>
</div>`,
      },
      {
        heading: "コスト管理ツール — Cost Explorer・Budgets ほか",
        html: `
<p>コストの「見える化」と「歯止め」のために、AWSは複数のツールを提供しています。それぞれの役割を区別して覚えましょう。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ツール</th><th>役割</th><th>典型的な使い方</th></tr></thead>
  <tbody>
    <tr><td>AWS Cost Explorer</td><td>コストの<strong>可視化・分析</strong></td><td>過去のコスト推移をサービス別・タグ別にグラフ化し、増加要因を調べる。将来の予測も表示</td></tr>
    <tr><td>AWS Budgets</td><td>予算の<strong>設定とアラート</strong></td><td>「月10万円」の予算を設定し、実績や予測が超過しそうなときに通知する</td></tr>
    <tr><td>コスト配分タグ</td><td>コストの<strong>内訳の分類</strong></td><td>リソースにプロジェクト名などのタグを付け、部門別・案件別に集計する</td></tr>
    <tr><td>AWS Pricing Calculator</td><td>導入<strong>前</strong>の見積もり</td><td>構成を入力して月額料金を試算する</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「過去のコストを分析したい」→Cost Explorer、「しきい値を超えたら通知したい」→Budgets、「利用開始前に見積もりたい」→Pricing Calculator。目的語の違いで確実に選び分けられるようにしましょう。</p>
</div>`,
      },
      {
        heading: "サポートプランとTrusted Advisor",
        html: `
<p>AWSのサポートプランは段階制で、上位プランほど対応範囲と速度が広がります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>プラン</th><th>主な内容</th><th>想定ユーザー</th></tr></thead>
  <tbody>
    <tr><td>ベーシック</td><td>無料。アカウント・請求の問い合わせとドキュメント類のみ(技術サポートなし)</td><td>すべてのアカウント</td></tr>
    <tr><td>デベロッパー</td><td>営業時間内のメールによる技術サポート</td><td>開発・検証段階</td></tr>
    <tr><td>ビジネス</td><td><strong>24時間365日</strong>の電話・チャット・メール。本番システム障害は1時間以内の応答目標</td><td>本番ワークロードの運用</td></tr>
    <tr><td>エンタープライズ On-Ramp / エンタープライズ</td><td>ミッションクリティカル向け。最上位は15分以内の応答目標と専任のテクニカルアカウントマネージャー(TAM)</td><td>大規模・重要システム</td></tr>
  </tbody>
</table>
</div>
<p><strong>AWS Trusted Advisor</strong>は、アカウントの状況を<strong>コスト最適化・セキュリティ・耐障害性・パフォーマンス・サービスクォータ</strong>などの観点で自動チェックし、推奨事項を提示するツールです。低使用率のEC2インスタンスや無制限に開いたセキュリティグループなどを指摘してくれます。チェック項目の全体はビジネス以上のプランで利用できます。</p>`,
      },
      {
        heading: "Well-Architectedフレームワークの6本の柱",
        html: `
<p><strong>AWS Well-Architectedフレームワーク</strong>は、クラウド上でシステムを設計・運用するためのベストプラクティス集です。次の<strong>6本の柱</strong>で構成され、設計をレビューする共通の観点として使われます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>柱</th><th>問いかけ</th><th>代表的なプラクティス</th></tr></thead>
  <tbody>
    <tr><td>運用上の優秀性</td><td>運用を改善し続けられるか</td><td>IaCによる自動化、小さく頻繁な変更、失敗からの学習</td></tr>
    <tr><td>セキュリティ</td><td>データとシステムを守れているか</td><td>最小権限、多層防御、保存時・転送時の暗号化、追跡可能性</td></tr>
    <tr><td>信頼性</td><td>障害から回復できるか</td><td>マルチAZ、自動復旧、単一障害点の排除、復旧手順のテスト</td></tr>
    <tr><td>パフォーマンス効率</td><td>リソースを効率的に使えているか</td><td>適切なサービス選定、キャッシュ、需要に応じたスケール</td></tr>
    <tr><td>コスト最適化</td><td>無駄な支出がないか</td><td>従量課金の活用、適切なサイズ選定、購入オプションの使い分け</td></tr>
    <tr><td>持続可能性</td><td>環境への影響を減らせているか</td><td>使用率の最大化、効率のよいリージョン・サービスの選択</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>試験問題の多くは「コスト」「信頼性(可用性)」「セキュリティ」「パフォーマンス」「運用負荷」のどれを最適化したいかを問うています。6本の柱はそのまま問題文の観点の一覧表になっています。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "basics-ch12-q01",
      "basics-ch12-q02",
      "basics-ch12-q03",
      "basics-ch12-q04",
      "basics-ch12-q05",
      "basics-ch12-q06",
    ],
  },
];
