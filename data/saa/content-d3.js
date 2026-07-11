// SAA-C03 分野3「高パフォーマンスなアーキテクチャの設計」章コンテンツ
export const chapters = [
  {
    id: "saa-d3-ch01",
    domain: 3,
    title: "高パフォーマンスなストレージの選定",
    sections: [
      {
        heading: "オブジェクト・ファイル・ブロックの選定基準",
        html: `
<p>ストレージ選定の問題では、まず<strong>ワークロードがどのアクセス方式を必要とするか</strong>を見極めます。AWSの主要ストレージは次の3タイプに分類できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>タイプ</th><th>代表サービス</th><th>アクセス方式</th><th>典型ワークロード</th></tr></thead>
  <tbody>
    <tr><td>オブジェクト</td><td>Amazon S3</td><td>HTTP API(GET/PUT)</td><td>静的コンテンツ、ログ、データレイク、バックアップ</td></tr>
    <tr><td>ファイル</td><td>Amazon EFS、Amazon FSx</td><td>NFS / SMBでマウント</td><td>複数サーバーからの共有アクセス、CMS、ホームディレクトリ</td></tr>
    <tr><td>ブロック</td><td>Amazon EBS</td><td>OSにディスクとしてアタッチ</td><td>データベース、ブートボリューム、低レイテンシI/O</td></tr>
  </tbody>
</table>
</div>
<p>試験での読み分けはシンプルです。「<strong>複数のEC2インスタンスから同時に共有したい</strong>」ならファイルストレージ、「<strong>単一インスタンスに低レイテンシのディスクが必要</strong>」(データベースなど)ならブロックストレージ、「<strong>HTTP経由で事実上無制限に保存したい</strong>」「データレイクを作りたい」ならオブジェクトストレージが第一候補です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>EBSは基本的に単一インスタンス専用(io1/io2のマルチアタッチは例外的機能)、EFSは数千クライアントから同時マウント可能、S3はサーバーにマウントせずAPIでアクセスする、という前提を押さえると選択肢を素早く絞れます。</p>
</div>`,
      },
      {
        heading: "S3のパフォーマンス最適化とストレージクラス",
        html: `
<p>Amazon S3は<strong>プレフィックス(キーの先頭部分)ごと</strong>に、少なくとも毎秒3,500回の書き込み(PUT/COPY/POST/DELETE)と5,500回の読み取り(GET/HEAD)をサポートします。プレフィックスを分けて並列にアクセスすれば、この性能は<strong>プレフィックス数に比例してスケール</strong>します。大量リクエストで性能が頭打ちになるシナリオでは「プレフィックスを分散して並列化する」が定番の解答です。</p>
<h4>転送の高速化</h4>
<ul>
  <li><strong>マルチパートアップロード</strong>: 大きなオブジェクトを分割して並列アップロード。100MB超で推奨、5GBを超える場合は必須(単一PUTの上限は5GB)</li>
  <li><strong>S3 Transfer Acceleration</strong>: 世界中のエッジロケーションを入口にしてAWSのバックボーン経由で転送。<strong>遠隔地から単一バケットへのアップロード</strong>を高速化</li>
  <li><strong>バイトレンジフェッチ</strong>: オブジェクトの一部を並列ダウンロードして読み取りを高速化</li>
</ul>
<h4>ストレージクラスと取り出し性能</h4>
<p>どのクラスも耐久性は同等(イレブンナイン)で、違いは<strong>コストと取り出し時間</strong>です。パフォーマンス観点では取り出しレイテンシに注目します。</p>
<ul>
  <li>Standard / Standard-IA / Intelligent-Tiering / One Zone-IA: <strong>ミリ秒アクセス</strong></li>
  <li>Glacier Instant Retrieval: アーカイブ価格ながら<strong>ミリ秒アクセス</strong>(四半期に1回程度のアクセス)</li>
  <li>Glacier Flexible Retrieval: 数分〜数時間 / Glacier Deep Archive: 12時間以上</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「アーカイブしたいが、必要なときは即座(ミリ秒)に取り出したい」とあればGlacier Instant Retrievalです。「アクセスパターンが不明・変化する」ならIntelligent-Tieringを選びます。</p>
</div>`,
      },
      {
        heading: "EBSボリュームタイプの選定(gp3 / io2)",
        html: `
<p>Amazon EBSはSSD系(トランザクション処理向け)とHDD系(スループット重視・低コスト)に大別されます。IOPS要件の数値が決め手になる頻出テーマです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>タイプ</th><th>特徴</th><th>選定の決め手</th></tr></thead>
  <tbody>
    <tr><td>gp3(汎用SSD)</td><td>ベースライン3,000 IOPS・125MB/sを容量と独立にプロビジョニング可能。最大16,000 IOPS・1,000MB/s</td><td>ほとんどのワークロードの第一候補。gp2よりGBあたり安価</td></tr>
    <tr><td>io2 Block Express(プロビジョンドIOPS SSD)</td><td>最大256,000 IOPS、サブミリ秒レイテンシ、99.999%の耐久性</td><td>gp3の上限(16,000 IOPS)を超えるIOPSが必要なミッションクリティカルDB</td></tr>
    <tr><td>st1(スループット最適化HDD)</td><td>低コスト・高スループット</td><td>ビッグデータ、ログ処理などシーケンシャルアクセス</td></tr>
    <tr><td>sc1(Cold HDD)</td><td>最安のEBS</td><td>アクセス頻度の低いデータ</td></tr>
  </tbody>
</table>
</div>
<p>gp2はバースト方式でIOPSが容量に比例するため、現在は<strong>性能を容量と独立に指定できるgp3への移行</strong>が推奨です。また、EBS性能をフルに引き出すには<strong>EBS最適化インスタンス</strong>(Nitroベースではデフォルト有効)を使い、インスタンス側の帯域がボトルネックにならないようにします。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「16,000 IOPSを超える」「サブミリ秒レイテンシ」「99.999%の耐久性」というキーワードが出たらio2、それ以下の要件でコスト効率を求められたらgp3が定石です。HDD系(st1/sc1)はブートボリュームに使えない点も覚えておきましょう。</p>
</div>`,
      },
      {
        heading: "EFSとFSxファミリーの使い分け",
        html: `
<p><strong>Amazon EFS</strong>はLinux(POSIX)向けのフルマネージドNFSファイルシステムで、数千のクライアントから同時アクセスでき、容量は自動で伸縮します。複数AZのEC2やLambda、コンテナから共有できるのが強みです。</p>
<h4>EFSのパフォーマンスモード</h4>
<ul>
  <li><strong>汎用(General Purpose)</strong>: デフォルト。最も低いレイテンシ。ほとんどのワークロードに推奨</li>
  <li><strong>最大I/O(Max I/O)</strong>: レイテンシは増えるが、数百〜数千クライアントの高度な並列アクセスで<strong>より高い集計スループット</strong>にスケール(ビッグデータ分析、メディア処理など)</li>
</ul>
<p>スループットはエラスティック/プロビジョンド/バーストの各モードから選べ、アクセス頻度の低いファイルを自動階層化するEFS IA/Archiveストレージクラスもあります。</p>
<h4>FSxファミリー: 4つのファイルシステム</h4>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>プロトコル</th><th>決め手キーワード</th></tr></thead>
  <tbody>
    <tr><td>FSx for Windows File Server</td><td>SMB</td><td>Windowsアプリ、<strong>Active Directory統合</strong>、NTFS ACL</td></tr>
    <tr><td>FSx for Lustre</td><td>Lustre(POSIX)</td><td><strong>HPC・機械学習・動画処理</strong>。サブミリ秒レイテンシ、数百GB/s。<strong>S3とネイティブ連携</strong>(S3のデータをファイルとして処理)</td></tr>
    <tr><td>FSx for NetApp ONTAP</td><td>NFS / SMB / iSCSI</td><td>マルチプロトコル、オンプレNetAppからの移行、スナップショット・重複排除</td></tr>
    <tr><td>FSx for OpenZFS</td><td>NFS</td><td>ZFSベースの低レイテンシNFS、オンプレZFS/NFSサーバーからの移行</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「Linuxで共有」→EFS、「WindowsでSMB・AD連携」→FSx for Windows、「HPC/MLでS3のデータを高速処理」→FSx for Lustre、という3つの対応づけは分野3の最頻出パターンです。</p>
</div>`,
      },
      {
        heading: "AWS Storage Gatewayによるハイブリッドストレージ",
        html: `
<p><strong>AWS Storage Gateway</strong>は、オンプレミスのアプリケーションからAWSのストレージを利用するためのハイブリッドサービスです。「オンプレミスの既存アプリを変更せずにクラウドストレージを使いたい」「<strong>頻繁に使うデータには低レイテンシでアクセスしたい</strong>」という要件で登場します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ゲートウェイ</th><th>プロトコル</th><th>ユースケース</th></tr></thead>
  <tbody>
    <tr><td>S3 File Gateway</td><td>NFS / SMB</td><td>ファイルをオブジェクトとしてS3に保存。頻繁にアクセスするデータは<strong>ローカルにキャッシュ</strong></td></tr>
    <tr><td>FSx File Gateway</td><td>SMB</td><td>オンプレからFSx for Windows File Serverへの低レイテンシアクセス(2024年10月以降、新規利用は不可)</td></tr>
    <tr><td>Volume Gateway(キャッシュ型)</td><td>iSCSI(ブロック)</td><td>データ本体はS3、よく使うデータのみローカルキャッシュ</td></tr>
    <tr><td>Volume Gateway(保管型)</td><td>iSCSI(ブロック)</td><td>データ全体をローカルに保持し、非同期でS3へスナップショットをバックアップ</td></tr>
    <tr><td>Tape Gateway</td><td>iSCSI VTL</td><td>物理テープ運用を仮想テープに置き換え、S3/Glacierへ保存</td></tr>
  </tbody>
</table>
</div>
<p>選定の軸は2つです。第一に<strong>プロトコル</strong>(ファイル共有ならFile Gateway、ブロックならVolume Gateway、テープバックアップソフトの置き換えならTape Gateway)。第二に<strong>データの主置き場所</strong>で、キャッシュ型は「本体はクラウド・ローカルはキャッシュ」、保管型は「本体はローカル・クラウドはバックアップ」です。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>一括大量移行にはAWS DataSyncやAWS Snowファミリーが適し、Storage Gatewayは「移行後も継続的にオンプレからアクセスし続ける」シナリオで選びます。この対比も頻出です。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d3-ch01-q01",
      "saa-d3-ch01-q02",
      "saa-d3-ch01-q03",
      "saa-d3-ch01-q04",
      "saa-d3-ch01-q05",
      "saa-d3-ch01-q06",
      "saa-d3-ch01-q07",
      "saa-d3-ch01-q08",
      "saa-d3-ch01-q09",
      "saa-d3-ch01-q10",
    ],
  },
  {
    id: "saa-d3-ch02",
    domain: 3,
    title: "コンピューティングとデータベースの選定",
    sections: [
      {
        heading: "EC2インスタンスファミリーとプレイスメントグループ",
        html: `
<p>Amazon EC2のインスタンスタイプは、<strong>ワークロードのボトルネックがどのリソースか</strong>で選びます。ファミリーの頭文字と用途の対応を押さえましょう。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ファミリー</th><th>分類</th><th>典型ワークロード</th></tr></thead>
  <tbody>
    <tr><td>M系</td><td>汎用</td><td>Webサーバー、小中規模DBなどバランス型</td></tr>
    <tr><td>C系</td><td>コンピューティング最適化</td><td>バッチ処理、動画エンコード、高性能Webサーバー</td></tr>
    <tr><td>R系 / X系</td><td>メモリ最適化</td><td>インメモリDB・キャッシュ、リアルタイムビッグデータ分析</td></tr>
    <tr><td>I系 / D系</td><td>ストレージ最適化</td><td>高IOPSのNoSQL、分散ファイルシステム(ローカルNVMe)</td></tr>
    <tr><td>P系 / G系</td><td>高速コンピューティング</td><td>機械学習トレーニング、GPUレンダリング</td></tr>
    <tr><td>T系</td><td>バースト可能</td><td>負荷が断続的な開発環境・小規模サイト</td></tr>
  </tbody>
</table>
</div>
<p>配置戦略としては<strong>プレイスメントグループ</strong>も問われます。<strong>クラスター</strong>は単一AZ内でインスタンスを近接配置し、ノード間の<strong>低レイテンシ・高スループット通信</strong>(HPCなど)を実現します。<strong>パーティション</strong>は大規模分散システム(Hadoop、Kafka)向けにラック単位で分離し、<strong>スプレッド</strong>は少数の重要インスタンスを別々のハードウェアに分散して同時障害を防ぎます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「ノード間通信のレイテンシを最小化」ならクラスタープレイスメントグループ+拡張ネットワーキングが定番です。可用性を高める配置(スプレッド)とはトレードオフになる点に注意してください。</p>
</div>`,
      },
      {
        heading: "Lambda・Fargate・EC2・AWS Batchの使い分け",
        html: `
<p>コンピューティングの選定は「<strong>実行時間・実行モデル・管理負荷</strong>」の3軸で判断します。</p>
<ul>
  <li><strong>AWS Lambda</strong>: イベント駆動・短時間処理の第一候補。最大実行時間は<strong>15分</strong>、メモリは最大10,240MBで、<strong>メモリ量に比例してCPU性能も増加</strong>します。サーバー管理は不要</li>
  <li><strong>AWS Fargate</strong>: ECS/EKSのコンテナを<strong>サーバーレス</strong>で実行。15分を超える処理や常駐サービスをコンテナで動かしたいが、EC2クラスターは管理したくない場合に選択</li>
  <li><strong>Amazon EC2</strong>: OSレベルの制御、GPUや特殊ハードウェア、ライセンス要件など、細かな制御が必要な場合。管理負荷は最大</li>
  <li><strong>AWS Batch</strong>: <strong>大量のバッチジョブ</strong>をキューイングし、ジョブの依存関係を管理しながら、最適なコンピューティングリソース(EC2/スポット/Fargate)を自動プロビジョニングして実行</li>
</ul>
<p>Lambdaのパフォーマンス設計では、コールドスタート対策として<strong>プロビジョニングされた同時実行(Provisioned Concurrency)</strong>で初期化済みの実行環境を確保できます。「Lambdaの処理が遅い」場合の対策はメモリ割り当ての増加(=CPU増強)が第一手です。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「15分を超える可能性のある処理」はLambda単体では不適切で、FargateやAWS Batch、AWS Step Functionsによる分割が正解方向です。また「数十万件のシミュレーションを夜間に一括実行」「ジョブ間に依存関係」とあればAWS Batchを選びます。</p>
</div>`,
      },
      {
        heading: "RDSとAuroraの高パフォーマンス設計",
        html: `
<p>リレーショナルDBの性能問題では、<strong>読み取りスケーリングと高可用性を混同させる</strong>選択肢が定番です。役割を明確に区別してください。</p>
<ul>
  <li><strong>リードレプリカ</strong>: 非同期レプリケーションで<strong>読み取り専用</strong>の複製を作り、参照クエリをオフロード。クロスリージョンにも作成可能。<strong>読み取り性能の向上</strong>が目的</li>
  <li><strong>マルチAZ配置</strong>: 同期レプリケーションのスタンバイへ自動フェイルオーバー。<strong>可用性の向上</strong>が目的で、スタンバイは通常アクセス不可</li>
</ul>
<p><strong>Amazon Aurora</strong>はMySQL/PostgreSQL互換のクラウドネイティブDBで、ストレージ層を3AZ・6コピーで共有します。パフォーマンス面の特長は次のとおりです。</p>
<ul>
  <li>最大<strong>15個のAuroraレプリカ</strong>を追加でき、<strong>リーダーエンドポイント</strong>が読み取り接続を自動で負荷分散。レプリカのオートスケーリングも可能</li>
  <li><strong>Aurora Global Database</strong>: 通常1秒未満のラグでセカンダリリージョンへレプリケートし、グローバルユーザーに低レイテンシの読み取りを提供</li>
  <li><strong>Aurora Serverless v2</strong>: 負荷に応じてキャパシティ(ACU)を自動増減。変動が大きい・予測不能なワークロード向け</li>
</ul>
<p><strong>Amazon RDS Proxy</strong>は接続プーリングのマネージドプロキシです。<strong>Lambdaのような大量の短命接続</strong>でDBの接続数が枯渇する問題を、アプリケーションの大きな変更なしに解決し、フェイルオーバー時間も短縮します。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「読み取り負荷を下げたい」→リードレプリカ、「フェイルオーバーしたい」→マルチAZ、「接続が枯渇する」→RDS Proxy。この3つの対応づけを問題文の要件から即座に引けるようにしましょう。</p>
</div>`,
      },
      {
        heading: "DynamoDBの性能設計とDAX",
        html: `
<p><strong>Amazon DynamoDB</strong>は、規模によらず<strong>一桁ミリ秒</strong>のレイテンシを提供するフルマネージドNoSQL(キーバリュー)データベースです。「ミリ秒レイテンシ」「事実上無制限のスケール」「サーバーレス」がキーワードなら第一候補になります。</p>
<h4>キャパシティモードの選定</h4>
<ul>
  <li><strong>プロビジョンドモード</strong>: RCU/WCUを事前指定。<strong>トラフィックが予測可能</strong>ならコスト効率が高い。Auto Scalingで目標使用率に追従させるのが定石</li>
  <li><strong>オンデマンドモード</strong>: リクエスト単位の課金で、<strong>予測不能・急激なスパイク</strong>のあるワークロードでもキャパシティ管理なしで即応</li>
</ul>
<p>キャパシティユニットの目安も出題されます。<strong>1 RCU</strong>=秒あたり強力な整合性のある読み込み1回(結果整合性なら2回、最大4KB)、<strong>1 WCU</strong>=秒あたり書き込み1回(最大1KB)です。また、特定のパーティションにアクセスが集中しない<strong>パーティションキー設計</strong>(カーディナリティの高いキーを選ぶ)が性能の前提になります。</p>
<h4>DAX(DynamoDB Accelerator)</h4>
<p><strong>DAX</strong>はDynamoDB専用のインメモリキャッシュで、読み取りレイテンシをミリ秒から<strong>マイクロ秒</strong>に短縮します。DynamoDB APIと互換性があり、<strong>アプリケーションコードの変更を最小限</strong>にキャッシュ層を追加できるのが決め手です。読み取り中心で同じ項目への参照が繰り返されるワークロード(商品カタログ、ゲームのランキング参照など)に適します。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「マイクロ秒の読み取り」「コード変更を最小限にキャッシュ導入」ならDAX。汎用的なキャッシュやセッションストアが必要な場合はElastiCache(次章)と使い分けます。</p>
</div>`,
      },
      {
        heading: "データベースエンジンの選定基準",
        html: `
<p>分野3では「要件に対して<strong>最も高いパフォーマンスを発揮するデータベース</strong>はどれか」という選定問題が頻出です。データモデルとアクセスパターンから絞り込みます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>要件キーワード</th><th>選定</th></tr></thead>
  <tbody>
    <tr><td>複雑なJOIN・トランザクション・既存SQLアプリ</td><td>Amazon RDS / Amazon Aurora</td></tr>
    <tr><td>キーバリューアクセス・一桁ミリ秒・無制限スケール</td><td>Amazon DynamoDB</td></tr>
    <tr><td>マイクロ秒の読み取りキャッシュ</td><td>DAX / Amazon ElastiCache</td></tr>
    <tr><td>ペタバイト級の分析(DWH)・列指向</td><td>Amazon Redshift</td></tr>
    <tr><td>グラフ構造(SNSの友人関係、レコメンド)</td><td>Amazon Neptune</td></tr>
    <tr><td>MongoDB互換のドキュメントDB</td><td>Amazon DocumentDB</td></tr>
  </tbody>
</table>
</div>
<p>RDSのエンジン選定では、商用ライセンスからの脱却やコスト最適化の文脈でMySQL/PostgreSQLといったオープンソースエンジン、その性能を高めたい場合にAuroraへの移行が正解になりやすい構図です。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「リレーショナルである必要がない」「スキーマが柔軟」「ミリ秒レイテンシでスケール」と明示されたらDynamoDBが正解方向です。逆に集計・JOINが多い分析用途にDynamoDBを選ばせる誤答が混ざるので注意してください。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d3-ch02-q01",
      "saa-d3-ch02-q02",
      "saa-d3-ch02-q03",
      "saa-d3-ch02-q04",
      "saa-d3-ch02-q05",
      "saa-d3-ch02-q06",
      "saa-d3-ch02-q07",
      "saa-d3-ch02-q08",
      "saa-d3-ch02-q09",
      "saa-d3-ch02-q10",
    ],
  },
  {
    id: "saa-d3-ch03",
    domain: 3,
    title: "キャッシュ・ネットワーク・データ取り込み",
    sections: [
      {
        heading: "ElastiCacheによるキャッシュ戦略(Redis vs Memcached)",
        html: `
<p><strong>Amazon ElastiCache</strong>はインメモリキャッシュのマネージドサービスで、データベースの読み取り負荷を下げ、レイテンシをマイクロ秒〜ミリ秒に短縮します。エンジンの使い分けが最頻出ポイントです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>Redis</th><th>Memcached</th></tr></thead>
  <tbody>
    <tr><td>データ構造</td><td>リスト、ハッシュ、<strong>ソート済みセット</strong>など豊富(ランキングに最適)</td><td>シンプルなキーバリューのみ</td></tr>
    <tr><td>高可用性</td><td><strong>レプリケーション+マルチAZ自動フェイルオーバー</strong></td><td>なし(ノード障害でデータ消失)</td></tr>
    <tr><td>永続化・バックアップ</td><td>スナップショット可</td><td>不可</td></tr>
    <tr><td>その他</td><td>Pub/Sub、地理空間、クラスターモードで書き込みもスケール</td><td><strong>マルチスレッド</strong>で、ノード追加によるシンプルな水平分割</td></tr>
  </tbody>
</table>
</div>
<p>「ゲームの<strong>リーダーボード(ランキング)</strong>」「フェイルオーバーが必要」「セッションの永続化」ならRedis、「<strong>できるだけシンプルな</strong>キャッシュ」「マルチスレッドで大きなノードを活用」ならMemcachedです。</p>
<p>キャッシュ戦略では、読み取り時にキャッシュミスならDBから取得して格納する<strong>遅延読み込み(Lazy Loading)</strong>と、書き込み時に常にキャッシュも更新する<strong>ライトスルー</strong>を組み合わせ、TTLで古いデータを失効させるのが基本形です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>DynamoDB専用のキャッシュはDAX、RDBやアプリ全般の汎用キャッシュ・セッションストアはElastiCacheという線引きも頻出です。</p>
</div>`,
      },
      {
        heading: "CloudFront vs Global Accelerator",
        html: `
<p>グローバルユーザーへの低レイテンシ配信では、この2つのエッジサービスの対比が定番です。どちらもエッジロケーションを利用しますが、仕組みが根本的に異なります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>Amazon CloudFront</th><th>AWS Global Accelerator</th></tr></thead>
  <tbody>
    <tr><td>方式</td><td>CDN。<strong>コンテンツをエッジにキャッシュ</strong></td><td>エッジからAWSグローバルネットワークへ<strong>経路を最適化</strong>(キャッシュしない)</td></tr>
    <tr><td>プロトコル</td><td>HTTP / HTTPS</td><td><strong>TCP / UDP全般</strong></td></tr>
    <tr><td>IPアドレス</td><td>ドメイン名(IPは変動)</td><td><strong>2つの静的エニーキャストIP</strong></td></tr>
    <tr><td>典型ユースケース</td><td>静的コンテンツ、動画配信、API・動的コンテンツの高速化</td><td>オンラインゲーム(UDP)、VoIP、IoT、<strong>高速なリージョン間フェイルオーバー</strong></td></tr>
  </tbody>
</table>
</div>
<p>決め手フレーズは、「<strong>キャッシュ可能なコンテンツ</strong>」「HTTP(S)」ならCloudFront、「<strong>HTTP以外(TCP/UDP)</strong>」「<strong>固定IPアドレスが必要</strong>(ファイアウォールの許可リスト登録など)」「即時のフェイルオーバー」ならGlobal Acceleratorです。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>CloudFrontはS3オリジンをOAC(オリジンアクセスコントロール)で保護し、署名付きURL/Cookieで限定配信もできます。「動画をグローバルに配信」はCloudFront、「UDPのゲームサーバーを高速化」はGlobal Acceleratorと即断できるようにしましょう。</p>
</div>`,
      },
      {
        heading: "ハイブリッド接続とPrivateLink",
        html: `
<p>オンプレミスとAWSの接続は「帯域・安定性」と「構築スピード・コスト」のトレードオフで選びます。</p>
<ul>
  <li><strong>AWS Direct Connect</strong>: 専用線接続。インターネットを経由しないため<strong>一貫した低レイテンシと大帯域</strong>(1Gbps/10Gbpsなど)が得られる。構築には数週間〜が必要。デフォルトでは暗号化されない</li>
  <li><strong>AWS Site-to-Site VPN</strong>: インターネット経由のIPsec暗号化トンネル。<strong>短期間・低コスト</strong>で構築できるが、レイテンシはインターネット品質に依存。1トンネルあたり最大約1.25Gbps</li>
  <li>定番構成: <strong>Direct Connectをメイン、VPNをバックアップ</strong>にして可用性と性能を両立。さらに高い回復性が必要なら複数のDirect Connect</li>
</ul>
<p><strong>AWS PrivateLink</strong>(インターフェイスVPCエンドポイント)は、サービスへの通信を<strong>インターネットに出さずに</strong>VPC内のENI経由で行う仕組みです。自社のサービスを<strong>エンドポイントサービス</strong>として公開すれば、数百の顧客VPCから<strong>VPC全体を接続することなく特定サービスだけ</strong>を利用させられます。<strong>CIDRが重複していても接続できる</strong>点がVPCピアリングとの大きな違いです。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「S3/DynamoDBへVPC内からプライベート接続」は無料のゲートウェイエンドポイント、「その他のAWSサービスやSaaSへ」「オンプレからも」はインターフェイスエンドポイント(PrivateLink)。「多数のVPC同士を相互接続」はTransit Gatewayです。</p>
</div>`,
      },
      {
        heading: "ストリーミングデータの取り込み: Kinesis vs Firehose",
        html: `
<p>ストリーミングデータの設計問題は「<strong>リアルタイムかニアリアルタイムか</strong>」で二分されます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>Amazon Kinesis Data Streams</th><th>Amazon Data Firehose</th></tr></thead>
  <tbody>
    <tr><td>処理タイミング</td><td><strong>リアルタイム</strong>(ミリ秒〜秒)</td><td><strong>ニアリアルタイム</strong>(バッファリングして配信)</td></tr>
    <tr><td>データの行き先</td><td>カスタムコンシューマ(Lambda、Managed Service for Apache Flinkなど)で自由に処理</td><td>S3、Redshift、OpenSearch Service、Splunk等へ<strong>コードなしで自動配信</strong></td></tr>
    <tr><td>データ保持・再処理</td><td>保持期間内(デフォルト24時間、最大365日)なら<strong>複数コンシューマが同じデータを再読み取り可能</strong></td><td>保持なし(配信のみ)</td></tr>
    <tr><td>スケーリング</td><td>シャード管理(オンデマンドモードあり)</td><td>フルマネージドで自動</td></tr>
  </tbody>
</table>
</div>
<p>「クリックストリームを<strong>リアルタイムに分析</strong>し、複数のアプリケーションで利用する」ならKinesis Data Streams、「ログを<strong>S3に貯めるだけ</strong>・変換してデータレイクへ・運用負荷最小」ならData Firehoseです。Firehoseは配信時にLambdaでの変換や<strong>Parquet/ORCへの形式変換</strong>も行えます。ストリームに対するSQL分析にはAmazon Managed Service for Apache Flinkを組み合わせます。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>旧称「Kinesis Data Firehose」は現在<strong>Amazon Data Firehose</strong>です。また「複数のコンシューマが独立して読む」「データの再処理(リプレイ)」という要件はData Streamsにしかない機能なので決め手になります。</p>
</div>`,
      },
      {
        heading: "分析サービスの選定: Athena・Glue・EMR",
        html: `
<p>データ分析・変換の選定は「<strong>サーバーレスで済むか、クラスター制御が必要か</strong>」が軸です。</p>
<ul>
  <li><strong>Amazon Athena</strong>: <strong>S3上のデータを標準SQLで直接クエリ</strong>するサーバーレスサービス。インフラ管理ゼロで、スキャンしたデータ量に課金。アドホックなログ分析の第一候補</li>
  <li><strong>AWS Glue</strong>: サーバーレスの<strong>ETL</strong>サービス。クローラがS3等のスキーマを検出して<strong>データカタログ</strong>に登録し、Sparkベースのジョブで変換(CSV→Parquetなど)を実行</li>
  <li><strong>Amazon EMR</strong>: Apache Spark/Hadoop/Hive等の<strong>ビッグデータフレームワークをクラスターで実行</strong>。既存のSpark/Hadoopジョブの移行や、クラスター構成を細かく制御したいペタバイト級処理に。タスクノードにスポットインスタンスを使うとコスト効率も向上</li>
</ul>
<p>Athenaのクエリパフォーマンス改善は頻出で、対策は<strong>スキャン量を減らすこと</strong>に尽きます。</p>
<ul>
  <li>データを<strong>Parquet/ORCなどの列指向形式</strong>に変換する(Glueで変換)</li>
  <li><strong>パーティション分割</strong>(日付など)でクエリ対象を絞る</li>
  <li>データを圧縮し、小さすぎるファイルは適度なサイズにまとめる</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「S3のログをSQLで手軽に分析」→Athena、「データレイクの変換・カタログ化」→Glue、「既存のHadoop/Sparkワークロード」→EMR。可視化はAmazon QuickSight、リアルタイム全文検索はOpenSearch Serviceが担当という役割分担も整理しておきましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d3-ch03-q01",
      "saa-d3-ch03-q02",
      "saa-d3-ch03-q03",
      "saa-d3-ch03-q04",
      "saa-d3-ch03-q05",
      "saa-d3-ch03-q06",
      "saa-d3-ch03-q07",
      "saa-d3-ch03-q08",
      "saa-d3-ch03-q09",
      "saa-d3-ch03-q10",
    ],
  },
];
