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
];
