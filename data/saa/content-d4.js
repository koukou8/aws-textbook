// SAA-C03 分野4「コストを最適化したアーキテクチャの設計」(出題比率20%)の章コンテンツ
export const chapters = [
  {
    id: "saa-d4-ch01",
    domain: 4,
    title: "コンピューティングのコスト最適化",
    sections: [
      {
        heading: "EC2購入オプションの全体像",
        html: `
<p>分野4「コストを最適化したアーキテクチャの設計」は出題比率20%を占め、「要件を満たす選択肢のうち、どれが最も安いか」を判断させる問題が中心です。その土台となるのがAmazon EC2の購入オプションです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>購入オプション</th><th>割引率(目安)</th><th>コミット</th><th>向いているワークロード</th></tr></thead>
  <tbody>
    <tr><td>オンデマンド</td><td>なし(基準価格)</td><td>なし。秒単位の従量課金</td><td>短期・予測不能・検証用途</td></tr>
    <tr><td>リザーブドインスタンス(RI)</td><td>最大72%</td><td>1年または3年(インスタンス属性を指定)</td><td>構成が固定された定常稼働</td></tr>
    <tr><td>Savings Plans</td><td>最大72%</td><td>1年または3年(1時間あたりの利用額をコミット)</td><td>定常的なコンピューティング利用全般</td></tr>
    <tr><td>スポットインスタンス</td><td>最大90%</td><td>なし(中断の可能性を許容)</td><td>中断を許容できる処理</td></tr>
  </tbody>
</table>
</div>
<h4>柔軟性と割引率のトレードオフ</h4>
<ul>
  <li><strong>スタンダードRI</strong>: 割引率が最も高い(最大72%)一方、インスタンスファミリーの変更(交換)はできません。</li>
  <li><strong>コンバーティブルRI</strong>: 期間中に同等以上の価値の構成へ交換でき、ファミリー・OS・テナンシーを変更できます。割引率はスタンダードより低め(最大66%)です。</li>
  <li><strong>EC2 Instance Savings Plans</strong>: 特定リージョンの特定インスタンスファミリーに限定される代わりに、RI並みの高い割引率(最大72%)です。</li>
  <li><strong>Compute Savings Plans</strong>: ファミリー・サイズ・リージョン・OSを問わずEC2に適用され、さらに<strong>AWS FargateとAWS Lambda</strong>の使用量にも適用される最も柔軟なプラン(最大66%)です。</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「柔軟性が高いほど割引率は下がる」が原則です。将来のファミリー変更やコンテナ・サーバーレスへの移行の可能性があるならCompute Savings PlansやコンバーティブルRI、構成が固定で最大割引を狙うならEC2 Instance Savings PlansやスタンダードRIを選びます。</p>
</div>`,
      },
      {
        heading: "スポットインスタンスと購入オプションの定番判断",
        html: `
<p><strong>スポットインスタンス</strong>はAWSの未使用キャパシティを利用する購入オプションで、オンデマンド比で最大90%の割引が得られます。ただしEC2がキャパシティを必要とすると、<strong>2分前の中断通知</strong>の後にインスタンスが中断されます。この特性から、適否の判断が試験で繰り返し問われます。</p>
<ul>
  <li><strong>適している</strong>: バッチ処理、画像レンダリング、CI/CD、ビッグデータ分析など、中断・再実行を許容できるステートレスな処理</li>
  <li><strong>適さない</strong>: データベース、ステートフルなアプリケーション、中断できない本番処理、厳格な納期のあるジョブ</li>
</ul>
<div class="table-wrap">
<table>
  <thead><tr><th>問題文のキーフレーズ</th><th>選ぶべき購入オプション</th></tr></thead>
  <tbody>
    <tr><td>「中断されても問題ない」「再実行できる」「フォールトトレラント」</td><td>スポットインスタンス</td></tr>
    <tr><td>「今後1年(3年)継続して稼働する」「定常的な負荷」</td><td>リザーブドインスタンス / Savings Plans</td></tr>
    <tr><td>「使用量が予測できない」「短期間だけ」</td><td>オンデマンド</td></tr>
    <tr><td>「一定のベースライン+一時的なピーク」</td><td>ベースラインはRI / Savings Plans、ピークはAuto Scaling+オンデマンド(中断可ならスポット併用)</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「最もコスト効率が良い」は「最も安い」ではありません。中断できないワークロードにスポットを選ばせる罠選択肢が定番です。まず要件(可用性・中断可否・期間)を満たす選択肢に絞り、その中で最も安いものを選びます。</p>
</div>`,
      },
      {
        heading: "ライトサイジングとAWS Compute Optimizer",
        html: `
<p>クラウドで最もよくある無駄が<strong>過剰プロビジョニング</strong>です。使用状況に合わせてインスタンスタイプ・サイズを適正化することを<strong>ライトサイジング</strong>と呼び、それを支援するツールの使い分けが問われます。</p>
<ul>
  <li><strong>AWS Compute Optimizer</strong>: Amazon CloudWatchの使用履歴を機械学習で分析し、EC2インスタンス、Auto Scalingグループ、EBSボリューム、Lambda関数、Fargate上のECSサービスに対して具体的な変更推奨(ダウンサイジングや別ファミリーへの変更など)を提示します。メモリ使用率を分析に含めるにはCloudWatchエージェントの導入が必要です。</li>
  <li><strong>AWS Trusted Advisor</strong>: 低使用率のEC2インスタンス、未使用のEBSボリュームやElastic IPアドレスなど、コスト最適化のチェック項目を提供します。</li>
  <li><strong>AWS Cost Explorer</strong>: コストの可視化・分析に加えて、ライトサイジング推奨やRI / Savings Plansの購入推奨も確認できます。</li>
</ul>
<h4>「減らす」「止める」の定番手法</h4>
<ul>
  <li>開発・テスト環境は夜間・週末に<strong>停止</strong>する(停止中はインスタンスの実行料金が発生せず、EBSなどのストレージ料金のみ)</li>
  <li>Auto Scalingで需要に追従させる。負荷の変動が時間帯で予測できるなら<strong>スケジュールに基づくスケーリング</strong>を使う</li>
  <li><strong>休止(ハイバネーション)</strong>はRAMの内容をEBSに保存して停止するため、前回の状態から素早く再開したいワークロードの停止運用に有効</li>
  <li>AWS Graviton(Armベース)インスタンスへの移行による価格性能比の改善</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「CPU使用率が常に低い」→ダウンサイジング、「使っていない時間が長い」→停止またはサーバーレス化、が基本の対応です。具体的なサイズ変更の推奨が欲しいという要件なら、機械学習ベースのAWS Compute Optimizerが答えになります。</p>
</div>`,
      },
      {
        heading: "Lambda・Fargate・EC2のコスト特性比較",
        html: `
<p>コンピューティングサービスの選定では、課金モデルの違いがそのままコスト判断の決め手になります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>サービス</th><th>課金モデル</th><th>コスト面で有利なケース</th></tr></thead>
  <tbody>
    <tr><td>Amazon EC2</td><td>インスタンス起動中は常に課金</td><td>24時間365日、高い使用率で稼働する(RI / Savings Plans併用で最安)</td></tr>
    <tr><td>AWS Fargate</td><td>タスクに割り当てたvCPU・メモリに対し、タスク実行中のみ秒単位で課金</td><td>実行頻度・負荷が変動するコンテナ。サーバー管理も不要</td></tr>
    <tr><td>AWS Lambda</td><td>リクエスト数+実行時間(メモリ×秒)。アイドル時は課金なし</td><td>断続的・短時間・イベント駆動の処理</td></tr>
  </tbody>
</table>
</div>
<p>判断の軸は<strong>アイドル時間の割合</strong>です。処理が発生していない時間が長いほど、常時課金のEC2は不利になり、実行中のみ課金されるFargateやLambdaが有利になります。逆に常時高負荷であれば、コミット割引を適用したEC2が最も安くなります。</p>
<ul>
  <li>コンテナで中断を許容できるジョブは<strong>Fargate Spot</strong>でさらに削減できます</li>
  <li>Lambdaはメモリ設定が課金単価に直結するため、Compute Optimizerの推奨などを利用したメモリの適正化が有効です</li>
  <li>Compute Savings PlansはFargate・Lambdaにも適用されるため、EC2からの移行計画があってもコミットが無駄になりません</li>
</ul>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「1日に数回だけ」「不定期に実行」「アイドル時間が大半」というシナリオではLambda / Fargateが、「定常的に高使用率」ならEC2+Savings Plansが正解になりやすいと覚えておきましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d4-ch01-q01",
      "saa-d4-ch01-q02",
      "saa-d4-ch01-q03",
      "saa-d4-ch01-q04",
      "saa-d4-ch01-q05",
      "saa-d4-ch01-q06",
      "saa-d4-ch01-q07",
      "saa-d4-ch01-q08",
      "saa-d4-ch01-q09",
      "saa-d4-ch01-q10",
      "saa-d4-ch01-q11",
    ],
  },
  {
    id: "saa-d4-ch02",
    domain: 4,
    title: "ストレージ・DB・ネットワークのコスト最適化",
    sections: [
      {
        heading: "S3ストレージクラスの選定基準",
        html: `
<p>Amazon S3のストレージクラス選定は分野4で最頻出のテーマです。<strong>アクセス頻度</strong>・<strong>取り出しまでの許容時間</strong>・<strong>最低保存期間</strong>の3点で判断します。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ストレージクラス</th><th>取り出し時間</th><th>最低保存期間</th><th>典型ユースケース</th></tr></thead>
  <tbody>
    <tr><td>S3 Standard</td><td>ミリ秒</td><td>なし</td><td>頻繁にアクセスするデータ</td></tr>
    <tr><td>S3 Standard-IA</td><td>ミリ秒</td><td>30日</td><td>低頻度だが即時アクセスが必要(取り出し料金あり)</td></tr>
    <tr><td>S3 One Zone-IA</td><td>ミリ秒</td><td>30日</td><td>再作成可能な低頻度データ(単一AZ保存)</td></tr>
    <tr><td>S3 Intelligent-Tiering</td><td>ミリ秒</td><td>なし</td><td>アクセスパターンが不明・変化するデータ</td></tr>
    <tr><td>S3 Glacier Instant Retrieval</td><td>ミリ秒</td><td>90日</td><td>四半期に1回程度のアクセスだが即時取り出しが必要なアーカイブ</td></tr>
    <tr><td>S3 Glacier Flexible Retrieval</td><td>数分〜数時間</td><td>90日</td><td>即時性が不要なアーカイブ</td></tr>
    <tr><td>S3 Glacier Deep Archive</td><td>標準12時間</td><td>180日</td><td>年1回アクセスするかどうかの長期保存(最安)</td></tr>
  </tbody>
</table>
</div>
<p><strong>S3 Intelligent-Tiering</strong>はオブジェクトごとのアクセスパターンを監視し、アクセスのないオブジェクトを低頻度アクセス階層やアーカイブインスタントアクセス階層へ自動的に移動します。取り出し料金がなく、少額のモニタリング・オートメーション料金のみで利用できます(128KB未満のオブジェクトは自動階層化の対象外)。「アクセスパターンが不明・変化する」というキーフレーズが出たらIntelligent-Tieringが定番の正解です。</p>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>IA系・Glacier系のクラスには最低保存期間と取り出し料金があります。「頻繁にアクセスするデータをStandard-IAへ移せば削減できる」という選択肢は、取り出し料金でかえって高くつく罠です。なお、リクエスタ支払い(Requester Pays)バケットを使うと、ダウンロードにかかるリクエスト・データ転送のコストをデータ利用者側に負担させることができます。</p>
</div>`,
      },
      {
        heading: "ライフサイクルとEBS・EFSのコスト最適化",
        html: `
<p><strong>S3ライフサイクル設定</strong>では、オブジェクトの経過日数に応じた<strong>移行アクション</strong>(例: 30日後にStandard-IAへ、90日後にGlacier Deep Archiveへ)と、<strong>有効期限アクション</strong>(保持期限を過ぎたオブジェクトの削除)を自動化できます。バージョニング利用時は古い非現行バージョンの移行・削除、さらに<strong>不完全なマルチパートアップロードの中止</strong>もライフサイクルで設定でき、見落とされがちな削減ポイントです。</p>
<h4>EBSのコスト最適化</h4>
<ul>
  <li><strong>gp2からgp3への移行</strong>: gp3はGBあたりの単価がgp2より約20%低く、3,000 IOPS・125MB/秒のベースライン性能を持ち、IOPSとスループットを容量と独立して設定できます。同等性能を維持したままコストを下げる定番手法です。</li>
  <li>スループット重視のシーケンシャルアクセスにはst1、アクセス頻度の低いデータにはsc1といったHDDボリュームも安価な選択肢です(ブートボリュームには使用不可)。</li>
  <li>未使用(未アタッチ)ボリュームの削除や、Amazon Data Lifecycle Managerによるスナップショットの世代管理・自動削除も有効です。</li>
</ul>
<h4>EFSのコスト最適化</h4>
<ul>
  <li><strong>ライフサイクル管理</strong>を有効にすると、指定期間アクセスされていないファイルが低頻度アクセス(IA)ストレージクラスへ自動移行され、共有ファイルシステムとしての透過的なアクセスを保ったままストレージ単価を下げられます。</li>
  <li>可用性要件が緩い用途にはEFS One Zoneストレージクラスも安価です。</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「性能を維持したままEBSを安くしたい」→gp3への移行、「EFSの大部分のファイルがアクセスされていない」→ライフサイクル管理でIAへ、が定番の解答パターンです。</p>
</div>`,
      },
      {
        heading: "RDS・DynamoDBのコスト設計",
        html: `
<p>データベースは稼働時間が長いため、購入オプションと容量モードの選択がコストを大きく左右します。</p>
<h4>RDS / Aurora</h4>
<ul>
  <li><strong>リザーブドDBインスタンス</strong>: 1年・3年の定常稼働が確実な本番DBに適用して割引を受けます。</li>
  <li><strong>開発・テスト環境の停止</strong>: RDSインスタンスは一時停止でき(最大7日で自動的に再起動)、停止中はインスタンス料金が発生しません(ストレージ料金は継続)。</li>
  <li><strong>Amazon Aurora Serverless v2</strong>: 負荷に応じて容量が自動的にスケールし、使用した容量に秒単位で課金されます。断続的・予測不能なワークロードに最適です。</li>
  <li>Multi-AZ配置やリードレプリカはインスタンス数が増える分コストも増えるため、可用性・読み取りスケールの要件がある場合にのみ採用します。自動バックアップの保持期間や手動スナップショットの世代数も定期的に見直します。</li>
</ul>
<h4>DynamoDB</h4>
<ul>
  <li><strong>オンデマンドキャパシティモード</strong>: リクエスト数に応じた課金。トラフィックが予測不能・スパイク型で、アイドル期間が長い場合に有利です。</li>
  <li><strong>プロビジョンドキャパシティモード</strong>: 予測可能で定常的なトラフィックなら単価が安く、Auto Scalingやリザーブドキャパシティと組み合わせてさらに削減できます。</li>
  <li><strong>Standard-IAテーブルクラス</strong>: アクセス頻度が低くストレージ費用が支配的なテーブルで、ストレージ単価を下げられます。</li>
  <li><strong>TTL</strong>: 有効期限を過ぎた項目を追加コストなしで自動削除でき、不要データの保持を防げます。</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「予測できないスパイク」→DynamoDBオンデマンド / Aurora Serverless、「定常的で予測可能」→プロビジョンド+コミット割引、という対応関係はコンピューティングの購入オプションと同じ発想です。</p>
</div>`,
      },
      {
        heading: "ネットワークコストの最適化",
        html: `
<p>データ転送コストは見落とされやすい出題ポイントです。まず次の原則を押さえます。</p>
<ul>
  <li>インターネットからの<strong>受信(イン)は無料</strong>、インターネットへの<strong>送信(アウト)は課金</strong></li>
  <li>同一リージョン内でも<strong>AZをまたぐ通信は双方向に課金</strong>。同一AZ内のプライベートIPアドレス同士の通信は無料</li>
  <li>リージョン間の転送(クロスリージョンレプリケーションなど)は課金対象</li>
</ul>
<h4>NATゲートウェイとVPCエンドポイント</h4>
<p>NATゲートウェイには<strong>時間料金と処理データ量(GBあたり)の料金</strong>がかかります。プライベートサブネットからS3やDynamoDBへ大量のデータを転送している場合、<strong>ゲートウェイVPCエンドポイント</strong>(追加料金なし)への切り替えが最頻出の削減パターンです。その他のAWSサービスへのアクセスは<strong>インターフェイスエンドポイント</strong>(時間+GB課金)で置き換えられ、NATゲートウェイの処理料金より安くなるケースが多くあります。</p>
<h4>CloudFrontによる配信コストの削減</h4>
<p>S3から直接インターネットへ配信する代わりにAmazon CloudFrontを経由させると、<strong>S3からCloudFrontへのオリジン転送は無料</strong>になり、エッジでのキャッシュによってオリジンへのリクエスト数と転送量自体も減少します。世界中のユーザーへの低レイテンシ配信とコスト削減を同時に実現できます。</p>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>「NATゲートウェイ経由でS3に大量のデータを転送している」というシナリオが出たら、ほぼ確実にゲートウェイVPCエンドポイントが正解です。ゲートウェイ型はS3とDynamoDB専用で無料、という点を確実に覚えておきましょう。</p>
</div>`,
      },
      {
        heading: "コスト管理ツールの使い分け",
        html: `
<p>コストの可視化・監視・分析ツールは「何をしたいか」で選ぶものが決まります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ツール</th><th>できること</th><th>典型的な出題キーワード</th></tr></thead>
  <tbody>
    <tr><td>AWS Cost Explorer</td><td>コストと使用量の可視化・分析・将来予測。RI / Savings Plansの購入推奨やライトサイジング推奨</td><td>「サービス別・期間別にコストを分析したい」</td></tr>
    <tr><td>AWS Budgets</td><td>予算を設定し、実績または<strong>予測</strong>がしきい値を超えたらメールやAmazon SNSで通知。予算アクションによる自動対応も可能</td><td>「予算超過(の見込み)を通知したい」</td></tr>
    <tr><td>AWS Cost and Usage Report(CUR)</td><td>最も詳細な課金・使用量データをS3バケットに出力。Amazon Athenaなどで分析</td><td>「最も詳細な明細データが必要」</td></tr>
    <tr><td>コスト配分タグ</td><td>タグ別(部門・プロジェクト別)にコストを分類。請求コンソールでの有効化が必要</td><td>「部門ごとのコスト内訳を把握したい」</td></tr>
    <tr><td>AWS Cost Anomaly Detection</td><td>機械学習で通常と異なる支出を検知して通知</td><td>「想定外のコスト増を自動検知したい」</td></tr>
    <tr><td>AWS Trusted Advisor</td><td>低使用率インスタンスや未使用リソースなどのチェック</td><td>「無駄なリソースを見つけたい」</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「分析・可視化」→Cost Explorer、「しきい値の通知」→Budgets、「生データでの詳細分析」→CUR、という3点セットの使い分けが問われます。コスト配分タグは請求コンソールで<strong>有効化した時点以降</strong>の課金データにのみ反映される点も覚えておきましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "saa-d4-ch02-q01",
      "saa-d4-ch02-q02",
      "saa-d4-ch02-q03",
      "saa-d4-ch02-q04",
      "saa-d4-ch02-q05",
      "saa-d4-ch02-q06",
      "saa-d4-ch02-q07",
      "saa-d4-ch02-q08",
      "saa-d4-ch02-q09",
      "saa-d4-ch02-q10",
      "saa-d4-ch02-q11",
      "saa-d4-ch02-q12",
    ],
  },
];
