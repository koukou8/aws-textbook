// SAA-C03 分野2「レジリエントなアーキテクチャの設計」章コンテンツ
export const chapters = [
  {
    id: "saa-d2-ch01",
    domain: 2,
    title: "疎結合アーキテクチャの設計",
    sections: [
      {
        heading: "なぜ疎結合にするのか",
        html: `
<p>コンポーネント同士が直接・同期的に依存し合う<strong>密結合</strong>なシステムでは、1つのコンポーネントの障害や遅延が全体に波及します。たとえばWebサーバーがバックエンドを同期呼び出ししていると、バックエンドの過負荷がそのままユーザーへのエラーになります。</p>
<p><strong>疎結合(loose coupling)</strong>は、コンポーネント間にキューやトピック、ロードバランサーなどの仲介層を挟み、互いの実装や稼働状況への依存を減らす設計です。疎結合化には次の利点があります。</p>
<ul>
  <li><strong>障害の分離</strong>: 受信側が停止してもメッセージは仲介層に保持され、復旧後に処理を再開できます</li>
  <li><strong>スパイクの吸収</strong>: 急激なリクエスト増をキューがバッファし、処理側は自分のペースで消費できます</li>
  <li><strong>独立したスケーリング</strong>: 送信側と受信側を別々にスケールできます(キューの深さに応じたAuto Scalingが定番)</li>
  <li><strong>独立した変更・デプロイ</strong>: マイクロサービスごとに開発・更新できます</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>試験では「処理の急増を取りこぼさない」「コンポーネント間の依存を減らす」「非同期に処理したい」という表現が出たら、まずAmazon SQSやAmazon SNSなどのメッセージングによる疎結合化を検討します。</p>
</div>`,
      },
      {
        heading: "Amazon SQS: 標準キューとFIFOキュー、DLQ",
        html: `
<p><strong>Amazon SQS</strong>は、フルマネージドのメッセージキューイングサービスです。送信側(プロデューサー)がキューにメッセージを送り、受信側(コンシューマー)が<strong>ポーリング(プル型)</strong>で取り出して処理します。キューの種類は2つあり、要件で使い分けます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>標準キュー</th><th>FIFOキュー</th></tr></thead>
  <tbody>
    <tr><td>配信保証</td><td>少なくとも1回(まれに重複あり)</td><td>厳密に1回(重複排除あり)</td></tr>
    <tr><td>順序</td><td>ベストエフォート(入れ替わる可能性)</td><td>メッセージグループID単位で厳密に保証</td></tr>
    <tr><td>スループット</td><td>ほぼ無制限</td><td>制限あり(バッチ処理や高スループットモードで拡張可)</td></tr>
    <tr><td>典型的な用途</td><td>大量ジョブの非同期処理</td><td>取引処理など順序と一意性が必須の処理</td></tr>
  </tbody>
</table>
</div>
<p>運用上の重要な仕組みも頻出です。</p>
<ul>
  <li><strong>可視性タイムアウト</strong>: 受信中のメッセージを他のコンシューマーから一定時間見えなくする仕組み。<strong>処理時間より短いと同じメッセージが重複処理される</strong>ため、処理時間より長く設定します</li>
  <li><strong>デッドレターキュー(DLQ)</strong>: 最大受信数を超えて処理に失敗し続けたメッセージを隔離するキュー。問題のあるメッセージが本流を妨げるのを防ぎ、後から分析できます</li>
  <li><strong>ロングポーリング</strong>: 空応答を減らしてAPIコール数(コスト)を下げる受信方法です</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「順序どおりに1回だけ処理」→FIFOキュー、「重複処理が発生している」→可視性タイムアウトの見直し、「失敗メッセージの隔離」→DLQ、という対応づけが定番です。</p>
</div>`,
      },
      {
        heading: "SNSファンアウトとEventBridge",
        html: `
<p><strong>Amazon SNS</strong>は、パブリッシュ/サブスクライブ(Pub/Sub)型の通知サービスです。トピックにパブリッシュされたメッセージは、サブスクライバー(SQSキュー、AWS Lambda、HTTPエンドポイント、Eメールなど)へ<strong>プッシュ型</strong>で配信されます。</p>
<p>定番構成が<strong>ファンアウト</strong>です。SNSトピックに複数のSQSキューをサブスクライブさせると、1つのイベントを複数のシステムがそれぞれのキューから独立したペースで並列処理できます。SQSが加わることで、受信側が一時的に停止してもメッセージが失われません。</p>
<p><strong>Amazon EventBridge</strong>は、イベントバスを介してイベントをルーティングするサービスです。SNSと似ていますが、次の特徴で使い分けます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>モデル</th><th>得意な場面</th></tr></thead>
  <tbody>
    <tr><td>Amazon SQS</td><td>キュー(プル)</td><td>スパイク吸収、非同期ジョブ、1対1の処理</td></tr>
    <tr><td>Amazon SNS</td><td>Pub/Sub(プッシュ)</td><td>1対多の即時配信、ファンアウト、通知</td></tr>
    <tr><td>Amazon EventBridge</td><td>イベントバス</td><td>AWSサービス/SaaSのイベント集約、内容ベースの高度なルーティング、スケジュール実行</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「サードパーティSaaSからのイベントを受け取る」「イベント内容に応じて複数のターゲットへ振り分ける」「cron式でスケジュール起動する」はEventBridgeが決め手になるキーワードです。</p>
</div>`,
      },
      {
        heading: "API GatewayとStep Functions",
        html: `
<p><strong>Amazon API Gateway</strong>は、REST/HTTP/WebSocket APIを公開するフルマネージドの「フロントドア」です。バックエンド(AWS Lambda、EC2、任意のHTTPエンドポイント)を保護するための機能が試験で問われます。</p>
<ul>
  <li><strong>スロットリング</strong>: リクエストレートとバーストを制限し、バックエンドの過負荷を防ぎます</li>
  <li><strong>使用量プランとAPIキー</strong>: 利用者(顧客)ごとにレート制限やクォータを適用できます</li>
  <li><strong>キャッシュ</strong>: レスポンスをキャッシュしてバックエンド呼び出しを削減します</li>
</ul>
<p><strong>AWS Step Functions</strong>は、複数のAWSサービスやLambda関数を<strong>ステートマシン</strong>として編成(オーケストレーション)するサービスです。各ステップの状態管理、エラー時の再試行、条件分岐、並列実行、失敗時の補償処理をJSONベースの定義で宣言でき、自前の制御コードが不要になります。注文処理のような多段ワークフローや、人手の承認を挟む長時間処理に適しています。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「複数のLambda関数を順序立てて実行し、再試行や状態管理をコードなしで行いたい」→Step Functions、「イベントの配信・ルーティングだけしたい」→EventBridge/SNS、と役割で選び分けます。</p>
</div>`,
      },
      {
        heading: "マイクロサービスとイベント駆動アーキテクチャ",
        html: `
<p>マイクロサービスは、機能ごとに独立してデプロイ・スケールできる小さなサービス群でアプリケーションを構成する設計です。各サービスはAPI(API Gateway)やメッセージング(SQS/SNS/EventBridge)で連携し、AWS LambdaやAWS Fargate、Amazon ECS/EKSで実行するのが典型です。</p>
<p>疎結合とスケーラビリティの前提になるのが<strong>ステートレス設計</strong>です。セッション情報などの状態をサーバー内に持つ(ステートフル)と、スケールインやインスタンス障害でユーザーのセッションが失われます。状態は次のような外部ストアに退避します。</p>
<ul>
  <li>セッション情報: <strong>Amazon ElastiCache</strong>や<strong>Amazon DynamoDB</strong></li>
  <li>共有ファイル: Amazon EFSやAmazon S3</li>
</ul>
<p><strong>イベント駆動型アーキテクチャ</strong>は、「注文が作成された」などのイベントの発生をきっかけに後続処理を起動する方式です。ポーリング不要で、コンポーネント間の結合をさらに弱められます。なお、オンプレミスからの移行でApache ActiveMQやRabbitMQなど<strong>既存のメッセージブローカーのプロトコル(JMS、AMQPなど)をそのまま使いたい</strong>場合は、SQSではなく<strong>Amazon MQ</strong>を選びます。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「アプリケーションを書き換えずに既存ブローカーから移行」→Amazon MQ、「新規開発でスケーラブルなキュー」→Amazon SQS。この対比は頻出です。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d2-ch01-q01",
      "saa-d2-ch01-q02",
      "saa-d2-ch01-q03",
      "saa-d2-ch01-q04",
      "saa-d2-ch01-q05",
      "saa-d2-ch01-q06",
      "saa-d2-ch01-q07",
      "saa-d2-ch01-q08",
      "saa-d2-ch01-q09",
      "saa-d2-ch01-q10",
    ],
  },
  {
    id: "saa-d2-ch02",
    domain: 2,
    title: "高可用性とスケーラビリティの設計",
    sections: [
      {
        heading: "マルチAZ設計と単一障害点の排除",
        html: `
<p>AWSの<strong>リージョン</strong>は、複数の<strong>アベイラビリティーゾーン(AZ)</strong>で構成されます。各AZは電源・ネットワークが独立した1つ以上のデータセンター群で、AZ間は低レイテンシの回線で接続されています。<strong>高可用性設計の第一歩は、リソースを複数のAZへ冗長配置すること</strong>です。</p>
<p>設計をレビューするときは「この要素が壊れたら全体が止まらないか」を問い、<strong>単一障害点(SPOF: Single Point of Failure)</strong>を1つずつ排除します。試験で定番のSPOFと対策は次のとおりです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>単一障害点</th><th>対策</th></tr></thead>
  <tbody>
    <tr><td>単一のEC2インスタンス</td><td>ELB+複数AZにまたがるAuto Scalingグループ</td></tr>
    <tr><td>単一のNATゲートウェイ</td><td>各AZにNATゲートウェイを配置し、AZごとのルートテーブルで自AZのものを経由</td></tr>
    <tr><td>単一のDBインスタンス</td><td>RDSマルチAZ配置(スタンバイへの自動フェイルオーバー)</td></tr>
    <tr><td>サーバー内のセッション状態</td><td>ElastiCacheやDynamoDBへ外部化(ステートレス化)</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>ELBやAuto Scalingを使っていても、インスタンスが1つのAZに集中していればAZ障害で全停止します。「複数のAZにまたがっているか」を最初に確認するのが鉄則です。NATゲートウェイが<strong>AZ単位のリソース</strong>である点も頻出の落とし穴です。</p>
</div>`,
      },
      {
        heading: "Elastic Load Balancingの使い分け",
        html: `
<p><strong>Elastic Load Balancing(ELB)</strong>は、複数のターゲット(EC2、コンテナ、IPアドレス、Lambda)へトラフィックを分散し、<strong>ヘルスチェック</strong>に失敗したターゲットを自動的に切り離します。種類ごとの使い分けが頻出です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>種類</th><th>レイヤー</th><th>特徴</th><th>決め手のキーワード</th></tr></thead>
  <tbody>
    <tr><td>Application Load Balancer(ALB)</td><td>L7(HTTP/HTTPS)</td><td>パスやホストヘッダーに基づくルーティング、AWS WAF連携、Lambdaターゲット</td><td>「URLパスで振り分け」「マイクロサービス」</td></tr>
    <tr><td>Network Load Balancer(NLB)</td><td>L4(TCP/UDP/TLS)</td><td>超低レイテンシで大量リクエストを処理、AZごとに静的IP/Elastic IPを割り当て可能</td><td>「固定IPが必要」「UDP」「極めて高い性能」</td></tr>
    <tr><td>Gateway Load Balancer(GWLB)</td><td>L3</td><td>ファイアウォールやIDS/IPSなどサードパーティー仮想アプライアンスを透過的に挿入</td><td>「セキュリティアプライアンスの冗長化」</td></tr>
  </tbody>
</table>
</div>
<ul>
  <li><strong>ヘルスチェック</strong>: 正常なターゲットにのみトラフィックを送ります。Auto Scalingと連携させると、アプリケーションレベルの異常検知による自動置き換えができます</li>
  <li><strong>クロスゾーン負荷分散</strong>: AZをまたいで全ターゲットへ均等に分散する機能です。ALBではデフォルトで有効、NLBではデフォルトで無効です</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>ELB自体を複数AZに配置してこそ高可用性になります。ALBかNLBかで迷ったら、HTTPの内容を見て振り分ける必要があるか(→ALB)、固定IP・非HTTPプロトコル・極端な性能要件か(→NLB)で判断します。</p>
</div>`,
      },
      {
        heading: "Amazon EC2 Auto Scalingによる伸縮性",
        html: `
<p><strong>Amazon EC2 Auto Scaling</strong>は、Auto Scalingグループ(ASG)内のインスタンス数を<strong>最小・希望・最大キャパシティ</strong>の範囲で自動調整します。複数AZへバランスよく起動し、異常インスタンスを自動で置き換えるため、スケーラビリティと可用性の両方の中核です。スケーリングポリシーの選び分けが頻出です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ポリシー</th><th>動作</th><th>適する場面</th></tr></thead>
  <tbody>
    <tr><td>ターゲット追跡</td><td>指標(平均CPU使用率など)を目標値に保つよう自動増減</td><td>「平均CPUを50%に維持」。最も簡単で第一候補</td></tr>
    <tr><td>ステップスケーリング</td><td>アラームの超過幅に応じて段階的に増減</td><td>負荷レベルごとに増減量を細かく制御したい場合</td></tr>
    <tr><td>スケジュールに基づくスケーリング</td><td>指定した日時にキャパシティを変更</td><td>営業時間やセール開始など負荷が予見できる場合</td></tr>
    <tr><td>予測スケーリング</td><td>過去の傾向を機械学習して先回りで増減</td><td>周期的なパターンを持つワークロード</td></tr>
  </tbody>
</table>
</div>
<p>ヘルスチェックはデフォルトで<strong>EC2ステータスチェック</strong>のみを参照します。アプリケーションのハングなどOSより上の異常で置き換えるには、<strong>ELBヘルスチェックをASGのヘルスチェックタイプに追加</strong>します。</p>
<p>疎結合アーキテクチャとの組み合わせでは、SQSキューの未処理メッセージ数(ApproximateNumberOfMessagesVisible)をインスタンス数で割ったカスタム指標を使い、<strong>キューの深さに応じてコンシューマーをスケール</strong>させる構成が定番です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「指標を一定に保ちたい」→ターゲット追跡、「負荷増が事前にわかっている」→スケジュール/予測スケーリング、「ALBには異常と映るのに壊れたインスタンスが残る」→ELBヘルスチェックの追加、が定番の対応づけです。</p>
</div>`,
      },
      {
        heading: "Amazon Route 53によるルーティングとDNSフェイルオーバー",
        html: `
<p><strong>Amazon Route 53</strong>は、DNSレベルでトラフィックの向き先を制御します。<strong>ヘルスチェック</strong>と<strong>ルーティングポリシー</strong>を組み合わせると、リージョンをまたぐ高可用性を実現できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ルーティングポリシー</th><th>動作・用途</th></tr></thead>
  <tbody>
    <tr><td>シンプル</td><td>単一リソースへの標準的な応答(ヘルスチェックを関連付けられない)</td></tr>
    <tr><td>フェイルオーバー</td><td>プライマリのヘルスチェック失敗時にセカンダリへ切替(アクティブ/パッシブ)</td></tr>
    <tr><td>加重</td><td>指定した比率で振り分け。段階的な移行やA/Bテスト</td></tr>
    <tr><td>レイテンシー</td><td>ユーザーにとって最も遅延が小さいリージョンへ誘導</td></tr>
    <tr><td>位置情報</td><td>ユーザーの地理的な場所で振り分け。地域限定コンテンツやコンプライアンス</td></tr>
    <tr><td>複数値回答</td><td>正常なレコードを複数返す簡易なDNSレベルの分散</td></tr>
  </tbody>
</table>
</div>
<p><strong>フェイルオーバールーティング</strong>の定番構成では、プライマリにALBなどの本番系を、セカンダリに<strong>Amazon S3の静的ウェブサイト</strong>やCloudFront配信の軽量ページを指定し、障害時にも最低限の案内表示を継続します。ALB・CloudFront・S3などのAWSリソースを指す場合は<strong>エイリアスレコード</strong>を使います(ゾーン頂点のドメイン名にも設定できます)。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「アクティブ/パッシブのDR切替」→フェイルオーバー、「最も近い(速い)リージョンへ」→レイテンシー、「トラフィックの10%だけ新環境へ」→加重、と要件の言い回しからポリシーを特定できるようにしておきましょう。</p>
</div>`,
      },
      {
        heading: "RDSの高可用性・RDS Proxy・サービスクォータ",
        html: `
<p>データベース層では、<strong>RDSマルチAZ配置</strong>と<strong>リードレプリカ</strong>の役割の違いが最頻出です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>マルチAZ配置</th><th>リードレプリカ</th></tr></thead>
  <tbody>
    <tr><td>目的</td><td>高可用性(障害対策)</td><td>読み取り性能のスケール</td></tr>
    <tr><td>レプリケーション</td><td>同期</td><td>非同期</td></tr>
    <tr><td>障害時</td><td>スタンバイへ自動フェイルオーバー(DNS切替でアプリ変更不要)</td><td>手動で昇格</td></tr>
    <tr><td>読み取り利用</td><td>スタンバイは読み取り不可(マルチAZ DBインスタンス構成の場合)</td><td>読み取り専用エンドポイントとして利用可</td></tr>
  </tbody>
</table>
</div>
<p><strong>Amazon RDS Proxy</strong>は、アプリケーションとRDS/Auroraの間に入るフルマネージドのデータベースプロキシです。接続を<strong>プーリングして共有</strong>するため、AWS Lambdaのように大量の短命な接続を作るクライアントでも接続の枯渇を防げます。フェイルオーバー時間の短縮にも寄与し、アプリケーション側は<strong>接続先をプロキシのエンドポイントに変えるだけ</strong>で済みます。</p>
<p>最後に<strong>サービスクォータ</strong>です。AWSの各サービスにはアカウント×リージョン単位の上限があり、たとえばオンデマンドEC2のvCPUクォータに達するとAuto Scalingのスケールアウトが失敗します。引き上げ可能なクォータは<strong>Service Quotas</strong>コンソールから申請でき、大規模イベントの前には<strong>事前の引き上げ申請</strong>が推奨されます。APIのスロットリングには、エクスポネンシャルバックオフによる再試行で対処します。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「フェイルオーバーしたい」→マルチAZ、「読み取り負荷を下げたい」→リードレプリカ、「Lambdaからの接続が枯渇」→RDS Proxy。クォータは自動では増えないため、需要増が確実な場面では事前申請が正解になります。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d2-ch02-q01",
      "saa-d2-ch02-q02",
      "saa-d2-ch02-q03",
      "saa-d2-ch02-q04",
      "saa-d2-ch02-q05",
      "saa-d2-ch02-q06",
      "saa-d2-ch02-q07",
      "saa-d2-ch02-q08",
      "saa-d2-ch02-q09",
    ],
  },
  {
    id: "saa-d2-ch03",
    domain: 2,
    title: "災害対策(DR)とバックアップ戦略",
    sections: [
      {
        heading: "RTOとRPO: DR要件を数値で語る",
        html: `
<p>災害対策(DR: Disaster Recovery)の設計は、2つの目標値を定めることから始まります。</p>
<ul>
  <li><strong>RTO(目標復旧時間 / Recovery Time Objective)</strong>: 障害発生からサービスを復旧させるまでに許容される時間。「どれだけ早く戻すか」</li>
  <li><strong>RPO(目標復旧時点 / Recovery Point Objective)</strong>: 障害発生時点からどれだけ遡った時点までのデータ損失を許容するか。「どれだけデータを失ってよいか」</li>
</ul>
<p>たとえば「RPO 1時間」なら、少なくとも1時間ごとのバックアップまたは継続的なレプリケーションが必要です。「RTO 30分」なら、30分以内に代替環境を稼働させられる仕組みを平常時から用意しておく必要があります。<strong>RTO・RPOが厳しい(短い)ほど、平常時に維持するリソースが増えてコストが上がる</strong>——このトレードオフがDR戦略選択の軸です。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>試験ではRTO/RPOの数値条件が提示され、「要件を満たす最も低コストな戦略」を選ばせるのが定番です。目安として「時間単位→バックアップ&リストア、数十分→パイロットライト、数分→ウォームスタンバイ、ほぼゼロ→マルチサイト アクティブ/アクティブ」に当てはめます。</p>
</div>`,
      },
      {
        heading: "4つのDR戦略の比較",
        html: `
<p>AWSはDR戦略を、復旧の速さとコストのトレードオフで4つに整理しています。下の表で下へ行くほどRTO/RPOが短くなり、平常時のコストが上がります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>戦略</th><th>DRリージョンの状態</th><th>RTO/RPOの目安</th><th>相対コスト</th></tr></thead>
  <tbody>
    <tr><td>バックアップ&リストア</td><td>バックアップデータのみ保管。リソースは稼働しない</td><td>時間単位</td><td>最小</td></tr>
    <tr><td>パイロットライト</td><td>データは継続レプリケーションで常に最新。アプリケーションサーバーは停止(テンプレートのみ用意)</td><td>数十分</td><td>低</td></tr>
    <tr><td>ウォームスタンバイ</td><td>縮小構成ながら全システムが稼働し、即座にリクエストを処理できる</td><td>数分</td><td>中</td></tr>
    <tr><td>マルチサイト アクティブ/アクティブ</td><td>複数リージョンでフル(準フル)稼働し、常時トラフィックを処理</td><td>ほぼゼロ</td><td>最大</td></tr>
  </tbody>
</table>
</div>
<ul>
  <li><strong>バックアップ&リストア</strong>: スナップショットやAWS BackupのデータをDRリージョンへコピーし、障害時にインフラを再構築して復元します</li>
  <li><strong>パイロットライト</strong>: 「種火」の意味です。データベースのレプリケーションだけを動かし、AMIやCloudFormationテンプレートを整備しておき、障害時にサーバーを起動してスケールします</li>
  <li><strong>ウォームスタンバイ</strong>: 縮小版の本番環境を常時稼働させ、障害時はスケールアウトして本番容量へ拡大します</li>
  <li><strong>マルチサイト アクティブ/アクティブ</strong>: Route 53で複数リージョンへトラフィックを振り分け、データ層もDynamoDBグローバルテーブルなどで多重化します</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>パイロットライトとウォームスタンバイの違いは「<strong>DRサイトが今すぐリクエストを処理できるか</strong>」です。パイロットライトは起動作業が完了するまで処理できません。ウォームスタンバイは縮小容量ながら即座に処理できます。この区別を問う問題が頻出です。</p>
</div>`,
      },
      {
        heading: "AWS Backupによるバックアップの一元管理",
        html: `
<p><strong>AWS Backup</strong>は、複数のAWSサービスのバックアップを<strong>ポリシーベースで一元管理</strong>するフルマネージドサービスです。EC2、EBS、RDS、Aurora、DynamoDB、EFS、FSx、Storage Gateway、S3などを1つの仕組みでバックアップできます。</p>
<ul>
  <li><strong>バックアッププラン</strong>: 取得スケジュールと保持期間をポリシーとして定義し、タグやリソースIDで対象を割り当てます。サービスごとの個別スクリプトが不要になります</li>
  <li><strong>クロスリージョンコピー</strong>: バックアップを別リージョンへ自動コピーし、リージョン障害やDRに備えます</li>
  <li><strong>クロスアカウント管理</strong>: AWS Organizationsと連携し、組織全体へバックアップポリシーを一括適用・監視できます</li>
  <li><strong>バックアップボールトとVault Lock</strong>: バックアップはボールトに保存されます。Vault Lockを使うと<strong>WORM(一度書き込んだら変更・削除不可)</strong>で保護でき、ランサムウェアや誤削除への耐性が高まります</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「複数サービスのバックアップを最小の運用負荷で一元管理」「別リージョンへの自動コピー」「バックアップの削除・改ざん防止」というキーワードはAWS Backup(+Vault Lock)が決め手です。Lambdaと自作スクリプトによる方法は運用負荷の観点で誤答になります。</p>
</div>`,
      },
      {
        heading: "グローバルデータベース: Aurora Global DatabaseとDynamoDBグローバルテーブル",
        html: `
<p>リージョン規模の障害に備えるデータ層の選択肢として、2つのグローバル構成を区別します。</p>
<p><strong>Amazon Aurora Global Database</strong>は、1つのプライマリリージョンと複数のセカンダリリージョンで構成されます。ストレージレベルの専用レプリケーションにより遅延は通常1秒未満で、セカンダリリージョンは読み取り専用として利用できます。リージョン障害時にはセカンダリを昇格させ、<strong>RPO 1秒程度・RTO 1分未満</strong>を目安とした復旧が可能です。</p>
<p><strong>Amazon DynamoDBグローバルテーブル</strong>は、複数リージョンに<strong>マルチアクティブ</strong>なレプリカを持ち、どのリージョンでも読み書きできます。書き込みは他リージョンへ自動的に伝播し、競合は結果的に解決されます(最終更新者勝ち)。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>Aurora Global Database</th><th>DynamoDBグローバルテーブル</th></tr></thead>
  <tbody>
    <tr><td>データモデル</td><td>リレーショナル</td><td>キーバリュー/ドキュメント</td></tr>
    <tr><td>書き込み可能リージョン</td><td>プライマリの1リージョン(障害時にセカンダリを昇格)</td><td>すべてのリージョン(アクティブ/アクティブ)</td></tr>
    <tr><td>典型ユースケース</td><td>RDBのクロスリージョンDR、グローバルな低遅延読み取り</td><td>グローバルアプリの低遅延読み書き、リージョン間の継続稼働</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「リレーショナルデータベースを秒未満の遅延で別リージョンへ複製」→Aurora Global Database、「世界中のユーザーがどのリージョンでも読み書き」→DynamoDBグローバルテーブル、が定番の対応づけです。</p>
</div>`,
      },
      {
        heading: "DR設計の実践ポイント",
        html: `
<p>DR戦略を実装するときは、データ・インフラ・切り替えの3点をそれぞれ準備します。</p>
<ul>
  <li><strong>データの複製</strong>: Amazon S3のクロスリージョンレプリケーション(CRR)、EBSスナップショットやAMIのリージョン間コピー、AWS Backupのクロスリージョンコピーを、要件(RPO)に応じて選びます</li>
  <li><strong>インフラの再現</strong>: AWS CloudFormationや起動テンプレートで環境をコード化しておくと、DRリージョンに同じ構成を迅速かつ確実に再構築できます(イミュータブルインフラストラクチャの考え方)</li>
  <li><strong>切り替え</strong>: Amazon Route 53のフェイルオーバールーティングとヘルスチェックで、DNSレベルの自動切替を構成します</li>
  <li><strong>定期的なDRテスト</strong>: 復旧手順は訓練しなければ機能しません。定期的にフェイルオーバー演習を実施し、RTO/RPOを実測して検証します</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p><strong>レプリケーションはバックアップの代替になりません。</strong>誤削除やランサムウェアによる破損は即座にレプリカへも伝播するためです。「レプリケーションで常に最新を保つ」仕組みと「ポイントインタイムのバックアップで過去時点へ戻せる」仕組みの両方が揃って、初めてデータ保護が完成します。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d2-ch03-q01",
      "saa-d2-ch03-q02",
      "saa-d2-ch03-q03",
      "saa-d2-ch03-q04",
      "saa-d2-ch03-q05",
      "saa-d2-ch03-q06",
      "saa-d2-ch03-q07",
      "saa-d2-ch03-q08",
      "saa-d2-ch03-q09",
    ],
  },
];
