// CloudOps教材 分野2(信頼性と事業の継続性)の章コンテンツ
export const chapters = [
  {
    id: "cloudops-d2-ch01",
    domain: 2,
    title: "スケーラビリティと伸縮性の実装",
    sections: [
      {
        heading: "Auto Scalingグループの構成要素と設定",
        html: `
<p>Amazon EC2 Auto Scalingは、需要に応じてEC2インスタンスの台数を自動調整する仕組みです。運用エンジニアが最初に押さえるべきは、<strong>Auto Scalingグループ(ASG)</strong>を構成する3つのキャパシティ値です。</p>
<ul>
  <li><strong>最小キャパシティ(Min)</strong>: どれだけスケールインしても維持する台数</li>
  <li><strong>希望キャパシティ(Desired)</strong>: ASGが維持しようとする現在の目標台数</li>
  <li><strong>最大キャパシティ(Max)</strong>: スケールアウトの上限台数</li>
</ul>
<p>インスタンスの起動設定は<strong>起動テンプレート</strong>で定義します(旧来の起動設定は非推奨)。AMI、インスタンスタイプ、セキュリティグループ、ユーザーデータなどをバージョン管理でき、テンプレートを更新して<strong>インスタンスの更新(インスタンスリフレッシュ)</strong>を実行すると、稼働中のインスタンスを段階的に新しい設定へ置き換えられます。</p>
<p>ヘルスチェックのタイプも重要な設定です。デフォルトの<strong>EC2ヘルスチェック</strong>はインスタンスのステータスチェックのみを見ますが、<strong>ELBヘルスチェック</strong>を有効にすると、ロードバランサーが異常と判定したインスタンスもASGが置き換え対象にします。アプリケーション層の障害を検知して自動復旧させたい場合はELBヘルスチェックを有効化するのが定石です。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「インスタンスが起動直後に異常判定されて終了と起動を繰り返す」というシナリオでは、<strong>ヘルスチェックの猶予期間(HealthCheckGracePeriod)</strong>が短すぎることが典型的な原因です。アプリケーションの起動に時間がかかる場合は猶予期間を延長します。</p>
</div>`,
      },
      {
        heading: "スケーリングポリシーの使い分けとトラブルシュート",
        html: `
<p>スケーリングポリシーは要件によって使い分けます。試験では「どの要件のときにどのポリシーか」が問われます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ポリシー</th><th>動作</th><th>適する要件</th></tr></thead>
  <tbody>
    <tr><td>ターゲット追跡</td><td>指定メトリクス(平均CPU使用率など)を目標値に保つよう自動調整</td><td>「CPU使用率を50%前後に維持」など。設定が最も簡単で運用負荷が最小</td></tr>
    <tr><td>ステップスケーリング</td><td>アラームの超過量に応じて段階的に台数を増減</td><td>負荷の大きさに応じて追加台数を変えたい場合</td></tr>
    <tr><td>簡易スケーリング</td><td>アラーム1つに対し固定数を増減(クールダウン待ちあり)</td><td>レガシーな構成。新規では原則ステップ以上を推奨</td></tr>
    <tr><td>スケジュールスケーリング</td><td>指定日時にキャパシティを変更</td><td>「毎週月曜9時にアクセス急増」など時刻が確定しているパターン</td></tr>
    <tr><td>予測スケーリング</td><td>過去の履歴を機械学習で分析し、需要を先読みして事前にスケールアウト</td><td>周期的な負荷パターンがあり、起動完了までの時間も見込みたい場合</td></tr>
  </tbody>
</table>
</div>
<p>「スケールアウトしない」という問い合わせを受けたら、次の順で切り分けます。</p>
<ol>
  <li>希望キャパシティが<strong>最大キャパシティに到達していないか</strong>(最頻出の原因)</li>
  <li>アカウントの<strong>EC2オンデマンドインスタンスのクォータ(vCPU制限)</strong>に達していないか</li>
  <li>対象AZに指定インスタンスタイプの<strong>キャパシティ不足</strong>がないか</li>
  <li>スケーリングポリシーの根拠となる<strong>CloudWatchアラームが正しく発報しているか</strong></li>
</ol>
<p>スケーリングの履歴と失敗理由は、ASGの<strong>アクティビティ履歴</strong>で確認できます。トラブルシュートの起点として必ず参照しましょう。</p>`,
      },
      {
        heading: "ライフサイクルフックとウォームアップ",
        html: `
<p><strong>ライフサイクルフック</strong>を使うと、インスタンスの起動時・終了時に一時停止状態を挟み、カスタム処理を実行できます。</p>
<ul>
  <li><code>autoscaling:EC2_INSTANCE_LAUNCHING</code>: 起動時にフック。ソフトウェアの初期化や設定投入が完了してからサービスインさせる</li>
  <li><code>autoscaling:EC2_INSTANCE_TERMINATING</code>: 終了時にフック。<strong>ログの回収</strong>や接続のドレイン(排出)を終了前に実行する</li>
</ul>
<p>フック中のインスタンスは待機状態(Pending:Wait / Terminating:Wait)になり、処理完了後に <code>complete-lifecycle-action</code> を呼び出して続行させます。タイムアウト(デフォルト1時間、最大48時間)を過ぎると既定のアクションが実行されます。フックの通知先にはAmazon EventBridge、Amazon SNS、Amazon SQSを指定できます。</p>
<p>また、ターゲット追跡や予測スケーリングでは<strong>デフォルトインスタンスウォームアップ</strong>を設定できます。起動直後でメトリクスが安定しないインスタンスをスケーリング判断から一時的に除外し、過剰なスケールアウト(いわゆる二重発火)を防ぎます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「終了するインスタンスからログを退避したい」→ 終了時ライフサイクルフック、「起動直後の不安定なメトリクスで余分にスケールしてしまう」→ ウォームアップ(または猶予期間)の調整、という対応関係を覚えておきましょう。</p>
</div>`,
      },
      {
        heading: "キャッシングによるスケーラビリティ向上(ElastiCache / CloudFront)",
        html: `
<p>スケールアウトだけが伸縮性の手段ではありません。<strong>キャッシュ層の追加</strong>は、バックエンドの負荷そのものを減らす基本戦略です。</p>
<h4>Amazon ElastiCache</h4>
<p>データベースの手前に置くインメモリキャッシュです。読み取りが集中するRDSの負荷軽減に効果的で、エンジンは2種類から選びます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>Redis系(Valkey / Redis OSS)</th><th>Memcached</th></tr></thead>
  <tbody>
    <tr><td>データ構造</td><td>リスト・ソート済みセットなど豊富</td><td>シンプルなキーバリューのみ</td></tr>
    <tr><td>高可用性</td><td>レプリケーションと自動フェイルオーバーに対応</td><td>レプリケーションなし</td></tr>
    <tr><td>永続化・バックアップ</td><td>スナップショット対応</td><td>非対応</td></tr>
    <tr><td>適する用途</td><td>セッションストア、ランキング、Pub/Sub</td><td>シンプルなキャッシュをマルチスレッドで大量処理</td></tr>
  </tbody>
</table>
</div>
<h4>Amazon CloudFront</h4>
<p>エッジロケーションで静的・動的コンテンツをキャッシュ配信するCDNです。オリジン(S3やALB)への到達リクエスト数を減らし、オリジン側のスケーリング要求そのものを緩和します。運用では<strong>キャッシュヒット率</strong>が重要な指標で、ヒット率が低い場合はTTLの延長や、キャッシュキーに含めるクエリ文字列・Cookie・ヘッダーを必要最小限に絞ることを検討します。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「読み取り負荷でDBが限界」という問題への解は、リードレプリカの追加とキャッシュ層(ElastiCache)の追加が二本柱です。Multi-AZ化は可用性対策であり、読み取り性能は向上しない点を混同しないようにしましょう。</p>
</div>`,
      },
      {
        heading: "データベースのスケーリング(RDS / Aurora / DynamoDB)",
        html: `
<p>マネージドデータベースのスケーリング手段は、リレーショナルとNoSQLで整理して覚えます。</p>
<h4>Amazon RDSとAmazon Aurora</h4>
<ul>
  <li><strong>リードレプリカ</strong>: 読み取りトラフィックを分散します。RDSは非同期レプリケーションで、レプリカ遅延(ReplicaLag)の監視が運用ポイントです。Auroraは共有ストレージにより遅延が小さく、最大15個のレプリカを<strong>リーダーエンドポイント</strong>で負荷分散できます</li>
  <li><strong>垂直スケーリング</strong>: インスタンスクラスの変更。変更適用時に短時間の停止が発生します(Multi-AZならフェイルオーバーで短縮可能)</li>
  <li><strong>ストレージ</strong>: RDSはストレージの自動スケーリングに対応。Auroraは10GB単位で自動拡張します</li>
  <li><strong>Aurora Serverless v2</strong>: 負荷に応じてキャパシティ(ACU)を秒単位で自動調整。断続的・予測困難なワークロードに適します</li>
</ul>
<h4>Amazon DynamoDB</h4>
<p>キャパシティモードの選択が最重要ポイントです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>モード</th><th>特徴</th><th>適するワークロード</th></tr></thead>
  <tbody>
    <tr><td>オンデマンド</td><td>事前設定不要でリクエストに応じ即座にスケール。リクエスト単位課金</td><td>トラフィックが予測不能・急激なスパイクがある</td></tr>
    <tr><td>プロビジョンド</td><td>RCU/WCUを事前に確保。Auto Scalingで目標使用率に追従可能</td><td>トラフィックが安定的・予測可能でコストを最適化したい</td></tr>
  </tbody>
</table>
</div>
<p>プロビジョンドモードで<strong>スロットリング(ProvisionedThroughputExceededException)</strong>が頻発する場合は、Auto Scalingの上限見直しか、オンデマンドモードへの切り替えを検討します。さらに読み取りがミリ秒未満で必要なら、インメモリキャッシュの<strong>DynamoDB Accelerator(DAX)</strong>を追加します。</p>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d2-ch01-q01",
      "cloudops-d2-ch01-q02",
      "cloudops-d2-ch01-q03",
      "cloudops-d2-ch01-q04",
      "cloudops-d2-ch01-q05",
      "cloudops-d2-ch01-q06",
      "cloudops-d2-ch01-q07",
      "cloudops-d2-ch01-q08",
      "cloudops-d2-ch01-q09",
    ],
  },
  {
    id: "cloudops-d2-ch02",
    domain: 2,
    title: "高可用性と耐障害性の実装",
    sections: [
      {
        heading: "Elastic Load Balancingの種類と基本設定",
        html: `
<p>Elastic Load Balancing(ELB)は、複数のターゲットへトラフィックを分散し、単一障害点をなくす中核サービスです。運用エンジニアはまず種類ごとの特性を押さえます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>種類</th><th>レイヤー</th><th>特徴・適する要件</th></tr></thead>
  <tbody>
    <tr><td>Application Load Balancer(ALB)</td><td>L7(HTTP/HTTPS)</td><td>パス・ホストベースのルーティング、リダイレクト、認証連携。Webアプリの標準</td></tr>
    <tr><td>Network Load Balancer(NLB)</td><td>L4(TCP/UDP/TLS)</td><td>超低レイテンシ・大量接続、AZごとの<strong>固定IP(Elastic IP)</strong>割り当てが可能</td></tr>
    <tr><td>Gateway Load Balancer(GWLB)</td><td>L3</td><td>ファイアウォールなどセキュリティアプライアンスへの透過的な振り分け</td></tr>
  </tbody>
</table>
</div>
<p>運用上よく調整する設定は次のとおりです。</p>
<ul>
  <li><strong>クロスゾーン負荷分散</strong>: 有効にすると全AZの全ターゲットへ均等に分散します。ALBは常時有効、NLBはデフォルト無効です。AZ間でターゲット台数が不均等なときに負荷の偏りを解消できます</li>
  <li><strong>スティッキーセッション</strong>: 同一クライアントを同じターゲットへ固定します。セッション情報をローカルに持つ既存アプリの応急対応に使いますが、根本対応はElastiCacheなどへのセッション外部化です</li>
  <li><strong>Connection Draining(登録解除の遅延)</strong>: 登録解除するターゲットへの新規リクエストを止めつつ、処理中のリクエストの完了を待ちます</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「固定IPアドレスが必要」「毎秒数百万リクエストのTCP通信」はNLB、「URLパスでルーティング」「HTTPヘッダーで判断」はALB、という切り分けが定番です。</p>
</div>`,
      },
      {
        heading: "ターゲットグループとヘルスチェックのトラブルシュート",
        html: `
<p>ELBは<strong>ターゲットグループ</strong>単位でヘルスチェックを実行し、正常なターゲットにのみトラフィックを送ります。「全ターゲットがunhealthyになった」「503が返る」といった障害対応は分野2の頻出シナリオです。</p>
<h4>unhealthy時の切り分け手順</h4>
<ol>
  <li><strong>セキュリティグループ</strong>: ターゲットのセキュリティグループが、ALB/NLBからの<strong>ヘルスチェックポートへのインバウンド</strong>を許可しているか。インスタンスへ直接アクセスすると正常なのにELB経由で異常になる場合の典型原因です</li>
  <li><strong>ヘルスチェックパスと成功コード</strong>: 指定パス(例: <code>/health</code>)が存在し、期待する成功コード(デフォルト200)を返しているか。アプリがリダイレクト(301/302)を返している場合、成功コード(Matcher)の設定と一致せず異常判定になります</li>
  <li><strong>タイムアウトとしきい値</strong>: アプリの応答がヘルスチェックのタイムアウト内に収まっているか。非正常のしきい値(UnhealthyThresholdCount)に達すると切り離されます</li>
  <li><strong>ネットワークACL・ルート</strong>: サブネットのNACLがELBノードとの通信を許可しているか</li>
</ol>
<h4>HTTPエラーコードからの推測</h4>
<ul>
  <li><strong>502 Bad Gateway</strong>: ターゲットからの応答が不正、または接続が拒否された</li>
  <li><strong>503 Service Unavailable</strong>: 登録済みの正常なターゲットが存在しない</li>
  <li><strong>504 Gateway Timeout</strong>: ターゲットがアイドルタイムアウト内に応答しない(重いクエリ、アプリのハングなど)</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「一部のターゲットだけ異常」ならターゲット固有の問題(プロセス停止・リソース枯渇)、「全ターゲットが一斉に異常」なら共通設定(セキュリティグループ、ヘルスチェックパス、成功コード)を疑う、という視点で選択肢を絞り込めます。</p>
</div>`,
      },
      {
        heading: "Route 53ヘルスチェックとDNSフェイルオーバー",
        html: `
<p>Amazon Route 53の<strong>ヘルスチェック</strong>は、エンドポイントの死活をDNSレベルで監視し、<strong>フェイルオーバールーティングポリシー</strong>と組み合わせてサイト全体の切り替えを自動化します。リージョン障害対策の基本部品です。</p>
<h4>アクティブ/パッシブフェイルオーバーの構成手順</h4>
<ol>
  <li>プライマリエンドポイントを監視するヘルスチェックを作成する</li>
  <li>プライマリのレコードをフェイルオーバータイプ「プライマリ」で作成し、ヘルスチェックを関連付ける</li>
  <li>セカンダリ(待機系)のレコードをフェイルオーバータイプ「セカンダリ」で作成する</li>
</ol>
<p>プライマリのヘルスチェックが失敗すると、Route 53はセカンダリのレコードを返すようになります。ヘルスチェックには次の種類があります。</p>
<ul>
  <li><strong>エンドポイント監視</strong>: HTTP/HTTPS/TCPで直接監視。世界中のヘルスチェッカーから実行され、しきい値(デフォルト3回)連続で失敗すると異常と判定</li>
  <li><strong>計算されたヘルスチェック</strong>: 複数のヘルスチェック結果をAND/OR条件で集約</li>
  <li><strong>CloudWatchアラームの状態監視</strong>: プライベートサブネット内など、外部から直接到達できないリソースの監視に使用</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>ELBなどAWSリソースへの<strong>エイリアスレコード</strong>では、ヘルスチェックを別途作成する代わりに<strong>「ターゲットのヘルスの評価(Evaluate Target Health)」を有効化</strong>することで、リソース自体のヘルス状態をDNS応答に反映できます。追加料金なしで運用負荷も最小です。</p>
</div>
<p>なお、DNSフェイルオーバーはクライアント側のDNSキャッシュの影響を受けるため、レコードの<strong>TTLを短く</strong>(例: 60秒)しておくことが切り替え時間の短縮につながります。</p>`,
      },
      {
        heading: "マルチAZ構成の設計と運用",
        html: `
<p>AZ障害に耐える構成の基本は、<strong>ステートレスなアプリケーション層を複数AZに分散し、その前段にELBを置く</strong>ことです。運用エンジニアが確認すべきチェックポイントを整理します。</p>
<ul>
  <li><strong>ELBのサブネット</strong>: 複数AZのサブネットを有効化しているか(ALBは2つ以上のAZが必須)</li>
  <li><strong>Auto Scalingグループのサブネット</strong>: 複数AZのサブネットを指定しているか。ASGはAZ間で台数が均等になるよう起動し、偏りが生じると<strong>AZリバランス</strong>で自動的に再配置します</li>
  <li><strong>データ層</strong>: RDSのマルチAZ配置、ElastiCacheのレプリカのAZ分散、EFSなどAZに依存しない共有ストレージの利用</li>
  <li><strong>単一AZリソースの把握</strong>: EBSボリュームやNATゲートウェイは<strong>AZ単位のリソース</strong>です。NATゲートウェイは各AZに配置し、ルートテーブルを分けることでAZ障害の巻き添えを防ぎます</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「同一AZ内でインスタンスを増やす」はAZ障害への対策になりません。可用性の問題では「複数AZへの分散」が含まれる選択肢を優先し、スケーラビリティの問題(性能不足)と区別して読み分けましょう。</p>
</div>
<p>また、静的安定性(障害時に新規リソースの起動に頼らず耐えられる設計)の観点から、ミッションクリティカルな環境では「1AZ分のキャパシティを失っても残りのAZで処理できる台数」をあらかじめ確保しておく考え方も重要です。</p>`,
      },
      {
        heading: "RDSマルチAZ配置とフェイルオーバーの挙動",
        html: `
<p>Amazon RDSの<strong>マルチAZ配置(Multi-AZ DBインスタンス)</strong>は、別AZのスタンバイへ<strong>同期レプリケーション</strong>を行い、障害時に自動フェイルオーバーする高可用性機能です。スタンバイは通常時にアクセスできず、読み取り性能の向上には寄与しません(リードレプリカとの最大の違い)。</p>
<h4>フェイルオーバーが発生する主な契機</h4>
<ul>
  <li>プライマリDBインスタンスまたはそのAZの障害</li>
  <li>DBインスタンスクラス変更やOSパッチ適用などのメンテナンス</li>
  <li>手動での再起動時に「フェイルオーバーで再起動」を選択した場合</li>
</ul>
<h4>フェイルオーバー時の挙動と運用上の注意</h4>
<ul>
  <li>フェイルオーバーは通常1〜2分程度で完了し、<strong>DBエンドポイントのDNSレコードがスタンバイ側を指すよう自動更新</strong>されます。接続文字列の変更は不要です</li>
  <li>アプリケーション側がDNSの結果を長時間キャッシュしている(JVMのデフォルト設定など)と、旧プライマリへ接続し続けて障害が長引きます。<strong>DNSキャッシュのTTLを短く設定</strong>し、接続の再試行を実装しておくことが重要です</li>
  <li>フェイルオーバーの発生はイベント通知(Amazon SNS)やEventBridgeで検知できます</li>
</ul>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>マルチAZ配置</th><th>リードレプリカ</th></tr></thead>
  <tbody>
    <tr><td>目的</td><td>高可用性(自動フェイルオーバー)</td><td>読み取りスケーリング</td></tr>
    <tr><td>レプリケーション</td><td>同期</td><td>非同期</td></tr>
    <tr><td>通常時のアクセス</td><td>スタンバイへは不可</td><td>読み取り専用エンドポイントとして利用可</td></tr>
    <tr><td>昇格</td><td>自動</td><td>手動昇格(DR用途にも使える)</td></tr>
  </tbody>
</table>
</div>
<p>なお、<strong>マルチAZ DBクラスター</strong>構成(1プライマリ+2つの読み取り可能スタンバイ)や、Amazon Auroraでは読み取りレプリカがフェイルオーバー先を兼ねるため、可用性と読み取りスケールを同時に実現できます。Auroraのフェイルオーバーは通常30秒程度と高速です。</p>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d2-ch02-q01",
      "cloudops-d2-ch02-q02",
      "cloudops-d2-ch02-q03",
      "cloudops-d2-ch02-q04",
      "cloudops-d2-ch02-q05",
      "cloudops-d2-ch02-q06",
      "cloudops-d2-ch02-q07",
      "cloudops-d2-ch02-q08",
      "cloudops-d2-ch02-q09",
    ],
  },
];
