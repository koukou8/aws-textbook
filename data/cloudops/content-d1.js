// CloudOps教材 分野1(モニタリング、ログ記録、分析、修復、パフォーマンスの最適化)の章コンテンツ
export const chapters = [
  {
    id: "cloudops-d1-ch01",
    domain: 1,
    title: "CloudWatch徹底 — メトリクス・ログ・アラーム",
    sections: [
      {
        heading: "標準メトリクスとカスタムメトリクス",
        html: `
<p>Amazon CloudWatchは、AWSリソースとアプリケーションの状態を数値化した<strong>メトリクス</strong>を収集・可視化するサービスです。運用の第一歩は「どのメトリクスが自動で取れて、どれは自分で送る必要があるか」を区別することです。</p>
<ul>
  <li><strong>標準(基本)メトリクス</strong>: AWSがハイパーバイザーレベルで自動収集。EC2ならCPU使用率、ネットワークIn/Out、ディスクI/Oなど。デフォルトは5分間隔です</li>
  <li><strong>詳細モニタリング</strong>: 既存の標準メトリクスの間隔を<strong>1分</strong>に短縮する有料オプション。取得できるメトリクスの種類は増えません</li>
  <li><strong>カスタムメトリクス</strong>: <code>PutMetricData</code> APIやCloudWatchエージェントで自分で送信するメトリクス。標準解像度(1分)と高解像度(1秒)を選べます</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>EC2の<strong>メモリ使用率・ディスク使用率(空き容量)・スワップ使用率</strong>はOS内部の情報のため標準メトリクスには存在しません。詳細モニタリングを有効にしても取得できず、CloudWatchエージェントによるカスタムメトリクス送信が必要です。この区別は試験の超頻出ポイントです。</p>
</div>
<p>アラームやダッシュボードは「名前空間 + メトリクス名 + ディメンション」の組み合わせでメトリクスを特定します。ディメンション(InstanceIdなど)を取り違えるとグラフに何も表示されないため、トラブルシュートではまずこの3点を確認します。</p>`,
      },
      {
        heading: "CloudWatchエージェント(EC2/ECS/EKS対応)",
        html: `
<p><strong>CloudWatchエージェント</strong>は、EC2インスタンスやオンプレミスサーバーからメモリ・ディスク使用率などのシステムレベルメトリクスと、アプリケーションログを収集してCloudWatchへ送信します。SOA-C03では<strong>ECSクラスター・EKSクラスターからの収集</strong>が明示的に試験範囲へ追加されました。</p>
<h4>導入と設定の定石</h4>
<ul>
  <li>エージェントの設定はJSONファイルで定義し、<strong>Systems Manager Parameter Store</strong>に保存して複数インスタンスへ一括配布するのがベストプラクティスです</li>
  <li>インスタンスには<strong>IAMロール</strong>(CloudWatchAgentServerPolicyなど)のアタッチが必要。認証情報のハードコードは誤りです</li>
  <li>エージェントのインストール・起動は<strong>SSM Run Command</strong>(AWS-ConfigureAWSPackage)で多数のインスタンスへ自動化できます</li>
</ul>
<h4>コンテナ環境の監視</h4>
<p>ECS/EKSでは<strong>Container Insights</strong>を有効化すると、クラスター・サービス・タスク(Pod)単位のCPU・メモリ・ネットワークメトリクスとログが収集されます。EKSではCloudWatchエージェントを<strong>DaemonSet</strong>としてデプロイし、ログ収集にFluent Bitを組み合わせる構成が標準です。ECSではクラスター設定でContainer Insightsを有効化します。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「エージェントを入れたのにメトリクスが届かない」場合の原因は、(1) IAMロール・権限の不足、(2) エージェント設定ファイルの誤り、(3) ネットワーク経路(プロキシ・VPCエンドポイント)の問題が定番です。まずIAMロールを疑うのが解答の定石です。</p>
</div>`,
      },
      {
        heading: "CloudWatchアラームと複合アラーム",
        html: `
<p><strong>CloudWatchアラーム</strong>は、メトリクスがしきい値を「評価期間のうち何回」超えたかで <code>OK</code> / <code>ALARM</code> / <code>INSUFFICIENT_DATA</code> の3状態を遷移します。データポイント欠落時の扱い(欠落データの処理)も設定でき、一時的なスパイクによる誤発報は「N個中M個のデータポイント超過」条件で抑制します。</p>
<h4>アラームアクション</h4>
<ul>
  <li><strong>Amazon SNS通知</strong>: 運用チームへのメール・チャット連携の起点</li>
  <li><strong>EC2アクション</strong>: 再起動・停止・終了・復旧(recover)。基盤ホスト障害を示すStatusCheckFailed_Systemには<strong>recover</strong>アクションが定番です</li>
  <li><strong>Auto Scalingアクション</strong>: スケールアウト/イン</li>
  <li><strong>Systems Manager OpsCenterへのOpsItem作成</strong></li>
</ul>
<p><strong>複合アラーム(composite alarm)</strong>は、複数のアラームの状態を <code>AND</code> / <code>OR</code> / <code>NOT</code> で組み合わせた条件で発報します。「CPU高負荷 AND レイテンシー悪化」が同時に成立したときだけ通知することで、<strong>アラーム疲れ(不要な通知の氾濫)を抑制</strong>できます。複合アラームのアクションはSNS通知など限定的で、EC2アクションやAuto Scalingアクションは設定できません。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「複数の条件が同時に満たされたときだけ通知したい」「通知の数を減らしたい」というシナリオが出たら複合アラームが正解の合図です。</p>
</div>`,
      },
      {
        heading: "CloudWatch Logs — Logs Insightsとメトリクスフィルター",
        html: `
<p><strong>CloudWatch Logs</strong>はロググループ/ログストリームの階層でログを保存します。保持期間はロググループ単位で設定でき(デフォルトは無期限)、ログコスト最適化の第一歩は保持期間の設定です。</p>
<h4>ログの分析と活用</h4>
<ul>
  <li><strong>CloudWatch Logs Insights</strong>: 専用クエリ言語でログをアドホックに検索・集計。<code>filter</code>、<code>stats</code>、<code>sort</code> などのコマンドで「特定エラーの件数を時系列で集計」といった調査を追加インフラなしで実行できます</li>
  <li><strong>メトリクスフィルター</strong>: ログ内のパターン(例: "ERROR")の出現回数を<strong>メトリクスに変換</strong>する仕組み。変換したメトリクスにアラームを設定すれば「特定エラーがN回出たら通知」が実現します。<strong>フィルター作成以降のログにのみ適用され、過去ログには遡及しません</strong></li>
  <li><strong>サブスクリプションフィルター</strong>: ログをほぼリアルタイムにAWS Lambda、Amazon Data Firehose、Kinesis Data Streams、OpenSearch Serviceへストリーム配信します</li>
</ul>
<div class="table-wrap">
<table>
  <thead><tr><th>やりたいこと</th><th>使う機能</th></tr></thead>
  <tbody>
    <tr><td>過去ログのアドホック調査・集計</td><td>Logs Insights</td></tr>
    <tr><td>ログ中のエラー回数でアラーム発報</td><td>メトリクスフィルター + アラーム</td></tr>
    <tr><td>ログのリアルタイム外部連携</td><td>サブスクリプションフィルター</td></tr>
    <tr><td>ログの長期アーカイブ(低コスト)</td><td>S3へのエクスポート / Firehose経由配信</td></tr>
  </tbody>
</table>
</div>`,
      },
      {
        heading: "クロスアカウントダッシュボードとSNS連携",
        html: `
<p>複数アカウント・複数リージョンにまたがる運用では、<strong>CloudWatchクロスアカウントオブザーバビリティ</strong>を構成します。監視を集約する<strong>モニタリングアカウント</strong>と、データを共有する<strong>ソースアカウント</strong>をリンクさせると、メトリクス・ログ・トレースを1つのアカウントのダッシュボードから横断的に閲覧できます。ダッシュボードはクロスリージョンのグラフも1画面に並べられるため、「全アカウント・全リージョンの状態を単一画面で見たい」という要件に応えられます。</p>
<h4>SNSによる通知連携</h4>
<ul>
  <li>アラームの通知先は<strong>SNSトピック</strong>。サブスクライバーとしてEメール、SMS、AWS Lambda、Amazon SQS、HTTPSエンドポイントを登録できます</li>
  <li>Eメール/HTTPSサブスクリプションは登録後に<strong>確認(Confirm)</strong>が必要です。「アラームはALARMになるのに通知が来ない」場合、最も多い原因はサブスクリプション未確認です</li>
  <li>KMSで暗号化されたSNSトピックを使う場合、発行元サービス(CloudWatch等)にKMSキーの利用権限が必要です</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>通知トラブルの切り分けは「アラーム状態は遷移したか → SNSトピックへ発行できたか(トピックポリシー・KMS権限) → サブスクリプションは確認済みか」の順に問われます。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d1-ch01-q01",
      "cloudops-d1-ch01-q02",
      "cloudops-d1-ch01-q03",
      "cloudops-d1-ch01-q04",
      "cloudops-d1-ch01-q05",
      "cloudops-d1-ch01-q06",
      "cloudops-d1-ch01-q07",
      "cloudops-d1-ch01-q08",
      "cloudops-d1-ch01-q09",
    ],
  },
  {
    id: "cloudops-d1-ch02",
    domain: 1,
    title: "分析と自動修復",
    sections: [
      {
        heading: "EventBridgeルールとイベントパターン",
        html: `
<p><strong>Amazon EventBridge</strong>は、AWSサービス・独自アプリケーション・SaaSが発行するイベントを受け取り、<strong>ルール</strong>に一致したイベントをターゲットへルーティングするイベントバスです。自動修復・イベント駆動運用の中核を担います。</p>
<ul>
  <li><strong>イベントパターン</strong>: イベントのJSON構造(source、detail-typeなど)に一致条件を書くルール。例: 「EC2インスタンスの状態がstoppedに変化した」</li>
  <li><strong>スケジュール</strong>: cron式・rate式による定期実行(EventBridge Scheduler)</li>
  <li><strong>ターゲット</strong>: AWS Lambda、SSM Automation、SNS、SQS、Step Functions、ECSタスクなど多数</li>
</ul>
<h4>ルールが発火しないときの切り分け</h4>
<ul>
  <li>イベントパターンの<strong>タイプミス・構造違い</strong>(detailの階層やケース)を確認する</li>
  <li>ターゲット呼び出しの<strong>権限不足</strong>(ターゲットのリソースポリシー、またはルールに紐づくIAMロール)を確認する</li>
  <li>ルールが正しい<strong>イベントバス</strong>(デフォルト/カスタム)に作られているか、正しいリージョンかを確認する</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>CloudWatchアラームの状態変化もEventBridgeにイベントとして流れます。そのため「アラーム→EventBridge→任意の自動処理」という柔軟な連携が可能です。</p>
</div>`,
      },
      {
        heading: "Systems Manager Automationランブック",
        html: `
<p><strong>AWS Systems Manager Automation</strong>は、運用手順をYAML/JSONの<strong>ランブック(Automationドキュメント)</strong>として定義し、手動・スケジュール・イベント起点で実行するサービスです。EC2の再起動、AMI作成、セキュリティグループ修正といった定型作業をコード化できます。</p>
<ul>
  <li><strong>事前定義ランブック</strong>: <code>AWS-RestartEC2Instance</code>、<code>AWS-CreateImage</code>、<code>AWSSupport-</code>系のトラブルシュート用など、AWS提供のものをそのまま使えます</li>
  <li><strong>カスタムランブック</strong>: 複数ステップ(aws:executeAwsApi、aws:runCommand、aws:branchなど)を組み合わせて独自手順を定義します</li>
  <li>実行には<strong>サービスロール(AssumeRole)</strong>を指定でき、承認ステップ(aws:approve)を挟めば半自動運用も可能です</li>
</ul>
<p>関連機能との使い分けも頻出です。<strong>Run Command</strong>は「インスタンス内でコマンドを実行する」単発操作、<strong>State Manager</strong>は「構成を継続的に維持する」仕組み、<strong>Automation</strong>は「AWS APIをまたぐ一連の手順を実行する」仕組みと整理しておきましょう。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「運用負荷を最小限にして定型修復を自動化したい」→ 自作スクリプト+cronではなく、SSM Automationランブック(+EventBridge起動)を選ぶのがCloudOps流の正解です。</p>
</div>`,
      },
      {
        heading: "自動修復の3段構成 — アラーム→EventBridge→SSM/Lambda",
        html: `
<p>SOA-C03分野1の最重要パターンが、<strong>「検知 → ルーティング → 修復」の3段構成</strong>による自動修復です。</p>
<ol>
  <li><strong>検知</strong>: CloudWatchアラーム(またはメトリクスフィルター経由)が異常を検知して状態遷移する</li>
  <li><strong>ルーティング</strong>: アラーム状態変化イベントをEventBridgeルールが受け取り、ターゲットを起動する</li>
  <li><strong>修復</strong>: SSM Automationランブック、またはAWS Lambda関数が修復処理(再起動、スケール変更、設定修正など)を実行し、SNSで結果を通知する</li>
</ol>
<div class="table-wrap">
<table>
  <thead><tr><th>シナリオ</th><th>推奨する修復先</th></tr></thead>
  <tbody>
    <tr><td>定型的なAWS操作(再起動・AMI取得・SG修正)</td><td>SSM Automationランブック</td></tr>
    <tr><td>独自ロジックが必要な処理・外部API連携</td><td>AWS Lambda</td></tr>
    <tr><td>基盤ホスト障害からの復旧</td><td>アラームのEC2 recoverアクション(直接)</td></tr>
    <tr><td>人手の承認を挟みたい</td><td>SSM Automation(aws:approveステップ)</td></tr>
  </tbody>
</table>
</div>
<p>単純なEC2再起動・復旧だけならアラームアクションで直接実行できますが、それ以外の柔軟な修復はEventBridge経由で構成します。また、修復の実行主体(Lambda実行ロール、Automationサービスロール)の<strong>IAM権限不足</strong>が「自動修復が動かない」トラブルの最頻出原因です。</p>`,
      },
      {
        heading: "X-RayトレースとPrometheus/Grafana",
        html: `
<p><strong>AWS X-Ray</strong>は、マイクロサービスやサーバーレスアプリケーションのリクエストを分散トレースし、<strong>サービスマップ</strong>で「どのコンポーネントでレイテンシーやエラーが発生しているか」を可視化します。API Gateway→Lambda→DynamoDBのような多段構成で「どこが遅いのか特定したい」場合の第一選択です。アプリケーションにはX-Ray SDK(またはADOT: AWS Distro for OpenTelemetry)を組み込み、EC2ではX-Rayデーモンを実行します。</p>
<h4>オープンソース互換のモニタリング</h4>
<ul>
  <li><strong>Amazon Managed Service for Prometheus</strong>: Prometheus互換のメトリクス収集・保存をフルマネージドで提供。<strong>EKS/ECS上のコンテナワークロード</strong>の既存Prometheusエコシステム(PromQL)をそのまま移行できます</li>
  <li><strong>Amazon Managed Grafana</strong>: Grafanaダッシュボードのマネージド版。CloudWatch、Prometheus、X-Rayなど複数データソースを1つの画面で可視化します</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「既存のPrometheus/Grafanaベースの監視を、サーバー管理なしでAWSへ移行したい」→ Managed Service for Prometheus + Managed Grafanaの組み合わせが正解パターンです。CloudWatchで代替させる選択肢は「既存資産(PromQL・ダッシュボード)を活かす」要件に合いません。</p>
</div>`,
      },
      {
        heading: "CloudTrailによる調査",
        html: `
<p><strong>AWS CloudTrail</strong>は「<strong>誰が・いつ・どのAPIを呼んだか</strong>」を記録する監査サービスです。パフォーマンスメトリクスではなく<strong>操作の証跡</strong>を扱う点でCloudWatchと役割が異なります。「リソースが勝手に変更・削除された。実行者を特定したい」という調査シナリオではCloudTrailが正解です。</p>
<ul>
  <li><strong>イベント履歴</strong>: 過去90日間の管理イベントを追加設定なしでコンソールから検索できます</li>
  <li><strong>証跡(Trail)</strong>: S3バケットへ継続的にログを配信。全リージョン・組織全体(Organizations)の証跡を1つで構成できます。90日を超える保持・分析にはTrailが必須です</li>
  <li><strong>データイベント</strong>: S3オブジェクトレベル操作やLambda呼び出しの記録(デフォルト無効・追加料金)</li>
  <li><strong>分析</strong>: CloudTrailログをCloudWatch Logsへ送ってメトリクスフィルター/アラームと組み合わせるか、<strong>Amazon Athena</strong>でS3上のログをSQL検索します</li>
</ul>
<div class="table-wrap">
<table>
  <thead><tr><th>調べたいこと</th><th>使うサービス</th></tr></thead>
  <tbody>
    <tr><td>リソースの性能・状態の推移</td><td>CloudWatchメトリクス</td></tr>
    <tr><td>アプリケーションのエラーログ</td><td>CloudWatch Logs</td></tr>
    <tr><td>API操作の実行者・日時</td><td>CloudTrail</td></tr>
    <tr><td>リクエストの遅延箇所の特定</td><td>AWS X-Ray</td></tr>
  </tbody>
</table>
</div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d1-ch02-q01",
      "cloudops-d1-ch02-q02",
      "cloudops-d1-ch02-q03",
      "cloudops-d1-ch02-q04",
      "cloudops-d1-ch02-q05",
      "cloudops-d1-ch02-q06",
      "cloudops-d1-ch02-q07",
      "cloudops-d1-ch02-q08",
      "cloudops-d1-ch02-q09",
    ],
  },
  {
    id: "cloudops-d1-ch03",
    domain: 1,
    title: "パフォーマンスの最適化",
    sections: [
      {
        heading: "EBSボリュームタイプの最適化",
        html: `
<p>Amazon EBSの最適化は「ワークロードのI/O特性に合ったボリュームタイプを選び、メトリクスで裏付ける」ことに尽きます。旧分野6から統合されたコスト観点も同時に問われます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>タイプ</th><th>特徴</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>gp3</td><td>汎用SSD。ベースライン3,000 IOPSで、<strong>IOPSとスループットを容量と独立に設定可能</strong>。gp2より約2割安</td><td>ほとんどの汎用ワークロード</td></tr>
    <tr><td>gp2</td><td>旧世代汎用SSD。IOPSが容量に比例(バーストあり)</td><td>gp3への移行が推奨</td></tr>
    <tr><td>io1/io2</td><td>プロビジョンドIOPS SSD。高く安定したIOPS、マルチアタッチ対応</td><td>大規模RDB・レイテンシー要件が厳しいDB</td></tr>
    <tr><td>st1</td><td>スループット最適化HDD。安価・シーケンシャル向き</td><td>ビッグデータ、ログ処理</td></tr>
    <tr><td>sc1</td><td>コールドHDD。最安</td><td>低頻度アクセスの大容量データ</td></tr>
  </tbody>
</table>
</div>
<ul>
  <li>「gp2の性能不足・コスト削減」→ <strong>gp3へ変更しIOPS/スループットを個別設定</strong>が定番解。ボリュームタイプは<strong>稼働中に変更可能</strong>(Elastic Volumes)です</li>
  <li>判断材料のメトリクス: <code>VolumeReadOps/VolumeWriteOps</code>(IOPS消費)、<code>VolumeQueueLength</code>(滞留。高止まりはIOPS不足のサイン)、gp2の<code>BurstBalance</code>(枯渇すると性能低下)</li>
  <li>インスタンス側の<strong>EBS最適化(EBS-optimized)</strong>やインスタンスタイプのEBS帯域上限がボトルネックになる場合もあります</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「BurstBalanceが0に近づき性能が劣化した」というシナリオはgp2のバーストクレジット枯渇が原因で、gp3(または必要ならio2)への変更が正解になります。</p>
</div>`,
      },
      {
        heading: "S3の転送最適化 — Transfer Acceleration・マルチパート・DataSync",
        html: `
<p>Amazon S3への大容量・長距離転送は、要件に応じて手段を使い分けます。</p>
<ul>
  <li><strong>マルチパートアップロード</strong>: 大きなオブジェクトを分割して並列アップロード。<strong>100MB超で推奨</strong>で、一部失敗時も該当パートのみ再送すればよく、信頼性と速度が向上します。CLIの高レベルコマンド(aws s3 cp)は自動で使用します</li>
  <li><strong>S3 Transfer Acceleration</strong>: 世界中のCloudFront<strong>エッジロケーション</strong>経由でAWSの内部ネットワークに乗せ、<strong>地理的に遠いクライアントからの転送</strong>を高速化します。バケット単位で有効化し、専用エンドポイントを使用します</li>
  <li><strong>AWS DataSync</strong>: オンプレミス(NFS/SMB)やファイルシステムとAWSストレージ間の<strong>大規模データ移行・定期同期</strong>をマネージドで実行。スケジュール、帯域制御、整合性検証、差分転送を備えます</li>
  <li>組み合わせ技: 「数百GBを毎晩オンプレからS3へ」→ DataSync、「世界各地のユーザーが大きなファイルをアップロード」→ Transfer Acceleration + マルチパートアップロード</li>
</ul>
<p>読み取り性能では、S3はプレフィックスあたり高いリクエストレートに自動スケールするため、極端に高いリクエストを捌く場合は<strong>プレフィックスの分散</strong>、繰り返し読むデータには<strong>CloudFront</strong>のキャッシュを検討します。あわせて<strong>ライフサイクルポリシー</strong>でアクセス頻度の下がったデータを低コストクラスへ移行するのがコスト最適化の定石です。</p>`,
      },
      {
        heading: "EFS/FSxの選定とライフサイクル",
        html: `
<p>共有ファイルストレージは「プロトコル・OS・性能特性」で選定します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>プロトコル/特徴</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>Amazon EFS</td><td>NFS。Linux向け。複数AZ・複数インスタンスから同時マウント。自動伸縮</td><td>Linuxアプリの共有ストレージ、コンテナの永続化</td></tr>
    <tr><td>FSx for Windows File Server</td><td>SMB。Active Directory統合、NTFS ACL</td><td>Windowsファイルサーバー移行</td></tr>
    <tr><td>FSx for Lustre</td><td>並列高性能ファイルシステム。<strong>S3と連携</strong></td><td>HPC・機械学習・動画処理</td></tr>
    <tr><td>FSx for NetApp ONTAP / OpenZFS</td><td>NFS/SMB/iSCSIマルチプロトコル、スナップショット等</td><td>NetApp/ZFS資産の移行</td></tr>
  </tbody>
</table>
</div>
<ul>
  <li><strong>EFSライフサイクル管理</strong>: 一定期間アクセスのないファイルを<strong>EFS IA(低頻度アクセス)/アーカイブ</strong>ストレージクラスへ自動移行し、コストを大幅削減。アクセスされると自動で戻せます(Intelligent-Tiering)</li>
  <li><strong>EFSスループットモード</strong>: バースト/エラスティック/プロビジョンド。「データ量は小さいのにスループットが足りない」場合はバーストではなくエラスティックまたはプロビジョンドを選択します</li>
  <li>EFSパフォーマンスモード: 汎用(General Purpose)が推奨。Max I/Oは高い並列性が必要な旧来ケース向けでレイテンシーが増加します</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「Windows + SMB + AD」→ FSx for Windows、「HPC/ML + S3のデータ」→ FSx for Lustre、「Linux複数台から共有」→ EFS。この3点セットの識別が最頻出です。</p>
</div>`,
      },
      {
        heading: "RDSの最適化 — Performance InsightsとRDS Proxy",
        html: `
<p>データベース性能問題の調査と改善では、次の2つのマネージド機能が中心になります。</p>
<h4>Performance Insights</h4>
<ul>
  <li>データベース負荷を<strong>DB Load(平均アクティブセッション数)</strong>として可視化し、<strong>待機イベント別・SQL別・ユーザー別</strong>に内訳を分析できます</li>
  <li>「どのSQLがDBを遅くしているのか特定したい」→ Performance Insightsが第一選択。CloudWatchの標準メトリクス(CPU/接続数)では原因のSQLまでは特定できません</li>
  <li>拡張モニタリング(Enhanced Monitoring)はOSレベルのメトリクス(プロセス別CPU等)を秒単位で見る機能で、役割が異なります</li>
</ul>
<h4>RDS Proxy</h4>
<ul>
  <li>アプリケーションとRDS/Auroraの間に入る<strong>フルマネージドの接続プール</strong>。接続の確立・破棄を肩代わりし、DB接続を再利用します</li>
  <li>典型シナリオ: <strong>AWS Lambdaからの大量同時接続で「too many connections」が発生</strong> → RDS Proxyの導入が正解。フェイルオーバー時間の短縮にも寄与します</li>
  <li>認証情報はSecrets Managerに保存したものを使用します</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「接続数の枯渇」→ RDS Proxy、「遅いクエリの特定」→ Performance Insights、「読み取り負荷の分散」→ リードレプリカ。症状と対策の対応付けを混同しないようにしましょう。</p>
</div>`,
      },
      {
        heading: "EC2プレイスメントグループとCompute Optimizer",
        html: `
<p>コンピューティング最適化の仕上げとして、配置戦略とサイジングの見直しを押さえます。</p>
<h4>プレイスメントグループ(3種)</h4>
<div class="table-wrap">
<table>
  <thead><tr><th>戦略</th><th>配置</th><th>用途</th></tr></thead>
  <tbody>
    <tr><td>クラスター</td><td>単一AZ内で近接配置</td><td>ノード間の<strong>低レイテンシー・高スループット</strong>が必要なHPC・分散計算</td></tr>
    <tr><td>スプレッド</td><td>異なるラック(ハードウェア)へ分散。AZあたり7インスタンスまで</td><td>少数の<strong>重要インスタンスの同時障害回避</strong></td></tr>
    <tr><td>パーティション</td><td>パーティション単位でラックを分離</td><td>Hadoop/Kafka/Cassandraなど<strong>大規模分散システム</strong></td></tr>
  </tbody>
</table>
</div>
<p>クラスタープレイスメントグループで容量不足エラーが出た場合は、グループ内のインスタンスを一旦停止してから同時に起動し直す、同一インスタンスタイプに揃えるといった対処が有効です。</p>
<h4>AWS Compute Optimizer</h4>
<ul>
  <li>CloudWatchメトリクスの利用実績を機械学習で分析し、<strong>EC2インスタンスタイプ、Auto Scalingグループ、EBSボリューム、Lambdaメモリ設定</strong>の最適化を推奨します</li>
  <li>「過剰プロビジョニング(オーバープロビジョン)されたインスタンスを特定してコスト削減したい」→ Compute Optimizerが正解。Trusted Advisorのコストチェックより詳細な、ワークロード実績ベースの推奨が得られます</li>
  <li>メモリ使用率まで加味した推奨には、CloudWatchエージェントによるメモリメトリクス収集が必要です</li>
</ul>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d1-ch03-q01",
      "cloudops-d1-ch03-q02",
      "cloudops-d1-ch03-q03",
      "cloudops-d1-ch03-q04",
      "cloudops-d1-ch03-q05",
      "cloudops-d1-ch03-q06",
      "cloudops-d1-ch03-q07",
      "cloudops-d1-ch03-q08",
      "cloudops-d1-ch03-q09",
    ],
  },
];
