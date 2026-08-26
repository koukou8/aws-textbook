// 特設ページ: CloudTrailのイベント種別(マネジメントイベント / データイベント)の使い分け
export const topic = {
  id: "cloudtrail-event-types",
  title: "CloudTrailで「記録されないログ」の正体: マネジメントイベントとデータイベント",
  description:
    "S3のDeleteObjectがCloudTrailに出てこない理由を、4種類のイベント種別・イベント履歴と証跡の違い・有効化の手順から整理します。",
  exam: "SOA-C03 / SAA-C03",
  services: ["AWS CloudTrail", "Amazon S3", "AWS Lambda"],
  createdAt: "2026-08-17",
  source: {
    question:
      "S3バケットのオブジェクトが削除された事象を調査したところ、CloudTrailのイベント履歴にはバケットの作成・削除は記録されていたが、DeleteObjectなどオブジェクトレベルの操作は見つからなかった。今後これらを記録するにはどうすべきか、という趣旨の問題。",
    point:
      "オブジェクトレベルの操作は「データイベント」に分類され、既定では記録されない。証跡でデータイベントを明示的に有効化する必要がある(追加料金あり)。",
  },
  sections: [
    {
      heading: "結論: 「バケットは残る、オブジェクトは残らない」の境界線",
      html: `<p>CloudTrailに関する問題で最も頻出のひっかけが、この「記録されているようで記録されていない」パターンです。判断基準は次の1行に集約できます。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>リソースそのものを操作するAPI(バケットを作る・削除する)はマネジメントイベントで既定オン。リソースの中身を操作するAPI(オブジェクトを読む・書く・消す)はデータイベントで既定オフ。</strong></p></div>
<p>AWSの用語では、前者を<strong>コントロールプレーン操作</strong>、後者を<strong>データプレーン操作</strong>と呼びます。<code>CreateBucket</code> や <code>DeleteBucket</code> はコントロールプレーンなので追加設定なしで記録されますが、<code>GetObject</code> / <code>PutObject</code> / <code>DeleteObject</code> はデータプレーンであり、<strong>証跡(トレイル)またはCloudTrail Lakeのイベントデータストアでデータイベントの記録を明示的に有効化しない限り、どこにも残りません</strong>。</p>
<p>この境界は他のサービスでも同じ考え方です。AWS Lambdaなら、関数を作る <code>CreateFunction</code> はマネジメントイベント、関数を実行する <code>Invoke</code> はデータイベントです。Amazon DynamoDBなら、テーブルを作る <code>CreateTable</code> はマネジメントイベント、項目を読み書きする <code>GetItem</code> / <code>PutItem</code> はデータイベントです。</p>
<figure class="diagram">
<svg viewBox="0 0 700 250" role="img" aria-label="S3・Lambda・DynamoDBそれぞれについて、リソース自体を操作するAPIはマネジメントイベントで既定オン、中身を操作するAPIはデータイベントで既定オフであることを対比した図">
  <text class="d-sub" x="64" y="56" text-anchor="middle">サービス</text>

  <rect class="d-node-ok" x="130" y="28" width="272" height="48" rx="8"/>
  <text class="d-text" x="266" y="48" text-anchor="middle">マネジメントイベント</text>
  <text class="d-sub" x="266" y="65" text-anchor="middle">コントロールプレーン / 既定オン・無料</text>

  <rect class="d-node-ng" x="416" y="28" width="276" height="48" rx="8"/>
  <text class="d-text" x="554" y="48" text-anchor="middle">データイベント</text>
  <text class="d-sub" x="554" y="65" text-anchor="middle">データプレーン / 既定オフ・有料(要有効化)</text>

  <path class="d-boundary" d="M409 20 L409 222"/>

  <text class="d-text" x="64" y="109" text-anchor="middle">Amazon S3</text>
  <rect class="d-node" x="130" y="84" width="272" height="40" rx="8"/>
  <text class="d-mono" x="266" y="109" text-anchor="middle">CreateBucket / DeleteBucket</text>
  <rect class="d-node" x="416" y="84" width="276" height="40" rx="8"/>
  <text class="d-mono" x="554" y="109" text-anchor="middle">GetObject / PutObject / DeleteObject</text>

  <text class="d-text" x="64" y="155" text-anchor="middle">AWS Lambda</text>
  <rect class="d-node" x="130" y="130" width="272" height="40" rx="8"/>
  <text class="d-mono" x="266" y="155" text-anchor="middle">CreateFunction / UpdateFunctionCode</text>
  <rect class="d-node" x="416" y="130" width="276" height="40" rx="8"/>
  <text class="d-mono" x="554" y="155" text-anchor="middle">Invoke(関数の実行)</text>

  <text class="d-text" x="64" y="201" text-anchor="middle">Amazon DynamoDB</text>
  <rect class="d-node" x="130" y="176" width="272" height="40" rx="8"/>
  <text class="d-mono" x="266" y="201" text-anchor="middle">CreateTable / DeleteTable</text>
  <rect class="d-node" x="416" y="176" width="276" height="40" rx="8"/>
  <text class="d-mono" x="554" y="201" text-anchor="middle">GetItem / PutItem / Query</text>

  <text class="d-accent" x="350" y="240" text-anchor="middle">右側は証跡またはCloudTrail Lakeで有効化しない限り、どこにも残らない</text>
</svg>
<figcaption>境界は「リソースそのものを操作するか、リソースの中身を操作するか」です。サービスが変わってもこの線の引き方は同じです。</figcaption>
</figure>
<p>なお、データイベントが既定オフなのは<strong>量とコストの問題</strong>です。オブジェクトの読み書きは1日に数億回発生することもあり、これを全件記録すると保管料もクエリ負荷も跳ね上がります。だからこそAWSはオプトイン方式にしており、試験でも「有効化が必要」という点が繰り返し問われます。</p>`,
    },
    {
      heading: "CloudTrailが記録する4種類のイベント",
      html: `<p>CloudTrailのイベントは現在4種類に分かれています。既定で記録されるのは<strong>マネジメントイベントだけ</strong>で、残り3種類はすべてオプトインかつ追加料金です。</p>
<div class="table-wrap"><table><thead><tr><th>イベント種別</th><th>記録される内容</th><th>既定</th><th>料金</th></tr></thead><tbody>
<tr><td>マネジメントイベント(管理イベント)</td><td>リソースに対する管理操作(コントロールプレーン)。<code>RunInstances</code>、<code>AttachRolePolicy</code>、<code>CreateTrail</code> など。マネジメントコンソールへのサインイン(<code>ConsoleLogin</code>)のようなAPI以外のイベントも含む</td><td>オン</td><td>1つ目のコピーは無料</td></tr>
<tr><td>データイベント</td><td>リソースの中身に対する操作(データプレーン)。S3オブジェクト操作、Lambda関数の <code>Invoke</code>、DynamoDBの項目操作、Amazon SNSの <code>Publish</code>、Amazon SQSのメッセージ操作など</td><td>オフ</td><td>有料</td></tr>
<tr><td>ネットワークアクティビティイベント</td><td>VPCエンドポイント経由でAWSサービスに対して行われたAPI呼び出し。エンドポイント所有者がプライベート経路の利用状況を可視化できる</td><td>オフ</td><td>有料</td></tr>
<tr><td>インサイトイベント</td><td>マネジメントイベントを継続分析し、書き込みAPIの呼び出し量やエラー率の<strong>異常</strong>を検出した記録</td><td>オフ</td><td>有料</td></tr>
</tbody></table></div>
<p>「1つ目のコピーは無料」という表現に注意してください。マネジメントイベントは、1つの証跡に配信する分までがアカウントあたり無料で、2つ目以降の証跡へ同じイベントを重複配信すると課金対象になります。「証跡を作ること自体が有料」ではありません。</p>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>インサイトイベントは「異常な呼び出し<strong>量</strong>」を教えてくれる機能であり、個別の操作履歴を遡って表示するものではありません。「誰がいつ何をしたか」を特定したいシナリオでインサイトを選ぶと誤答になります。</p></div>`,
    },
    {
      heading: "イベント履歴と証跡の違い(ここを混同すると誤答する)",
      html: `<p>もう1つの頻出ポイントが、コンソールの<strong>イベント履歴</strong>と<strong>証跡(トレイル)</strong>の違いです。イベント履歴は「追加設定なしで見られる便利な窓」にすぎず、記録の実体ではありません。</p>
<div class="table-wrap"><table><thead><tr><th>観点</th><th>イベント履歴</th><th>証跡(トレイル)</th></tr></thead><tbody>
<tr><td>対象イベント</td><td>マネジメントイベントのみ</td><td>マネジメント / データ / ネットワークアクティビティ / インサイトを選択</td></tr>
<tr><td>保持期間</td><td>過去90日(変更不可)</td><td>配信先S3バケットの設定次第(実質無期限)</td></tr>
<tr><td>設定</td><td>不要(既定で利用可)</td><td>作成が必要</td></tr>
<tr><td>範囲</td><td>そのリージョン内</td><td>全リージョン・組織全体(Organizations)をまとめられる</td></tr>
<tr><td>分析</td><td>コンソールでの検索・ダウンロード</td><td>Amazon Athenaでのクエリ、CloudWatch Logs連携、EventBridge連携</td></tr>
</tbody></table></div>
<p>この表から、冒頭の問題の誤答が機械的に説明できます。</p>
<ul>
<li><strong>「イベント履歴の保持期間を延長する」</strong> → 90日は固定で延長できません。仮に延ばせたとしても、イベント履歴はマネジメントイベントしか表示しないため、データイベントは永遠に出てきません</li>
<li><strong>「ログファイル整合性検証を有効化する」</strong> → 配信済みログファイルが改ざんされていないかをハッシュとデジタル署名で検証する機能です。<strong>記録される内容は1件も増えません</strong>。「ログが改ざんされていないことを証明したい」という要件のときの正解です</li>
<li><strong>「マネジメントイベントで書き込みを有効化する」</strong> → 「読み取り/書き込み」のフィルターは、あくまでマネジメントイベントを絞り込むためのものです。<code>DeleteObject</code> はそもそもマネジメントイベントに含まれないため、書き込みをオンにしても記録されません。<strong>「書き込み(Write)」と「データイベント」は別の軸</strong>だと理解してください</li>
</ul>`,
    },
    {
      heading: "データイベントの有効化とコストの抑え方",
      html: `<p>実際に有効化するときは、証跡に<strong>イベントセレクター</strong>を設定します。2種類あり、選択できる範囲が異なります。</p>
<ul>
<li><strong>基本イベントセレクター</strong>: 対象は<strong>S3オブジェクト・Lambda関数・DynamoDBテーブル</strong>の3種類に限られます。バケット単位・プレフィックス単位での指定が可能です</li>
<li><strong>高度なイベントセレクター</strong>: すべてのリソースタイプに対応し、<code>eventName</code>(例: <code>DeleteObject</code> だけを記録)、<code>readOnly</code>、<code>resources.ARN</code> といったフィールドで細かくフィルターできます。CloudTrail Lakeのイベントデータストアでは高度なイベントセレクターのみを使用します</li>
</ul>
<p>1つの証跡には基本と高度のどちらか一方しか適用できず、高度なイベントセレクターを設定すると既存の基本イベントセレクターは上書きされます。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>データイベントは高頻度になりがちなので、「監査要件を満たしつつコストを抑えるには」と問われたら、<strong>全バケットを対象にせず、対象バケット・プレフィックスや特定のAPI名に絞る</strong>のが正解方向です。「すべてのS3バケットのすべてのイベントを記録する」という選択肢は、要件を満たしていてもコスト面で不正解になります。</p></div>
<p>ログの反映速度にも差があります。データイベントは約5分ごと、マネジメントイベントは約15分ごとに配信されるため、CloudTrailは<strong>事後調査向け</strong>であり、リアルタイムの処理トリガーには向きません。オブジェクト作成をきっかけに処理を起動したいだけなら、CloudTrailではなくS3イベント通知を使うのが定石です。</p>`,
    },
    {
      heading: "S3サーバーアクセスログとの使い分けと、典型パターン",
      html: `<p>S3のアクセス記録には、CloudTrailデータイベントのほかに<strong>サーバーアクセスログ</strong>という選択肢もあります。両方が選択肢に並んだときの判断材料を整理します。</p>
<div class="table-wrap"><table><thead><tr><th>観点</th><th>CloudTrailデータイベント</th><th>S3サーバーアクセスログ</th></tr></thead><tbody>
<tr><td>料金</td><td>データイベントの記録料金 + 保管料</td><td>S3バケットへの配信は追加料金なし(保管料のみ)</td></tr>
<tr><td>配信の速さ</td><td>約5分ごと</td><td>数時間以内</td></tr>
<tr><td>形式</td><td>JSON</td><td>スペース区切りのテキスト</td></tr>
<tr><td>プレフィックス単位の絞り込み</td><td>可能</td><td>不可(バケット全体)</td></tr>
<tr><td>整合性検証</td><td>あり(ログファイル整合性検証)</td><td>なし</td></tr>
<tr><td>他システムへの連携</td><td>CloudWatch Logs / EventBridge / Athena</td><td>主にAthenaなどでの分析</td></tr>
</tbody></table></div>
<p>要件別の正解パターンは次のとおりです。</p>
<ol>
<li><strong>誰がオブジェクトを削除したかを特定・監査したい</strong> → 証跡でS3データイベントを有効化(<code>DeleteObject</code> に絞ればコストも抑えられます)</li>
<li><strong>90日より前のAPI操作を調べたい</strong> → 証跡が配信したS3上のログをAmazon Athenaでクエリ、またはCloudTrail Lakeでクエリ</li>
<li><strong>ログの改ざんがないことを証明したい</strong> → ログファイル整合性検証を有効化(あわせてS3オブジェクトロックやバケットポリシーで保護)</li>
<li><strong>組織内の全アカウントの操作を一元的に記録したい</strong> → Organizationsの組織証跡を1つ作成</li>
<li><strong>異常なAPI呼び出し量を検知したい</strong> → CloudTrail Insightsを有効化</li>
</ol>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「CloudTrailを有効にしているのに記録がない」というシナリオを見たら、反射的に次の3点を確認してください。<strong>(1) データイベントを有効化しているか、(2) 対象リージョンをカバーする証跡か、(3) 90日を超えていないか</strong>。この3つのどれかが原因であるケースがほとんどです。</p></div>`,
    },
  ],
  references: [
    {
      label: "CloudTrailの概念(イベントの種類・イベント履歴・証跡)",
      url: "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-concepts.html",
    },
    {
      label: "データイベントのログ記録(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html",
    },
    {
      label: "Amazon S3のログ記録オプション(CloudTrailとサーバーアクセスログの比較)",
      url: "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/logging-with-S3.html",
    },
    {
      label: "AWS CloudTrail の料金",
      url: "https://aws.amazon.com/jp/cloudtrail/pricing/",
    },
  ],
};
