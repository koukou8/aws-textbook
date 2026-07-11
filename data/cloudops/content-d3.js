// CloudOps教材 分野3(デプロイ、プロビジョニング、オートメーション)の章コンテンツ
export const chapters = [
  {
    id: "cloudops-d3-ch01",
    domain: 3,
    title: "CloudFormation徹底",
    sections: [
      {
        heading: "テンプレートの構造とスタック操作の基本",
        html: `
<p>AWS CloudFormationは、JSONまたはYAMLで記述したテンプレートからAWSリソースを<strong>スタック</strong>という単位で作成・更新・削除するIaC(Infrastructure as Code)サービスです。テンプレートは複数のセクションで構成され、必須なのは<code>Resources</code>セクションだけです。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>セクション</th><th>役割</th></tr></thead>
  <tbody>
    <tr><td><code>Parameters</code></td><td>スタック作成・更新時に外部から値を渡す(環境ごとの差分を吸収)</td></tr>
    <tr><td><code>Mappings</code></td><td>リージョンや環境名などのキーに応じた固定値の対応表</td></tr>
    <tr><td><code>Conditions</code></td><td>条件によってリソースの作成有無やプロパティを切り替える</td></tr>
    <tr><td><code>Resources</code>(必須)</td><td>作成するAWSリソースの定義本体</td></tr>
    <tr><td><code>Outputs</code></td><td>作成結果の出力。エクスポートすれば他スタックから<code>Fn::ImportValue</code>で参照可能</td></tr>
  </tbody>
</table>
</div>
<p>スタックのライフサイクルは「作成→更新→削除」で、進行状況は<code>CREATE_IN_PROGRESS</code>や<code>UPDATE_COMPLETE</code>などのステータスとイベント履歴で追跡できます。試験では「テンプレートを再利用して環境差分をParametersで吸収する」「スタック間の依存はOutputsのエクスポートで受け渡す」といった設計判断が問われます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>エクスポートされた値を他のスタックが参照している間は、エクスポート元の値の変更やスタック削除はできません。クロススタック参照は依存関係を生むことを覚えておきましょう。</p>
</div>`,
      },
      {
        heading: "変更セットによる安全な更新",
        html: `
<p>稼働中のスタックを更新する方法には、<strong>直接更新</strong>と<strong>変更セット(Change Set)</strong>の2つがあります。直接更新はすぐに変更を適用しますが、変更セットは「適用したらどのリソースがどう変わるか」の一覧を事前に生成し、内容を確認してから実行できます。</p>
<p>更新時のリソースへの影響は3種類に分類されます。</p>
<ul>
  <li><strong>中断を伴わない更新</strong>: 稼働に影響なくプロパティが変わる(例: EC2インスタンスのタグ変更)</li>
  <li><strong>一時中断を伴う更新</strong>: リソースは維持されるが一時的に利用不可になる(例: インスタンスタイプ変更に伴う再起動)</li>
  <li><strong>置換(Replacement)</strong>: リソースが新規作成され、古いものは削除される。<strong>物理IDが変わり、データが失われる可能性がある</strong>(例: RDS DBインスタンスの識別子変更)</li>
</ul>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>「本番スタックの更新前に、リソースが置換されるかどうかを確認したい」という要件が出たら、答えはほぼ変更セットです。変更セットの<code>Replacement</code>属性がTrueのリソースは再作成されるため、データベースやストレージでは特に注意が必要です。</p>
</div>
<p>なお、変更セットを作成しただけではスタックは変更されません。内容を確認し、実行(Execute)して初めて更新が始まります。複数の変更セットを作って比較し、不要なものは破棄することもできます。</p>`,
      },
      {
        heading: "ロールバックとデプロイ失敗の原因特定",
        html: `
<p>スタックの作成・更新中にいずれかのリソースで失敗すると、CloudFormationは既定で<strong>自動ロールバック</strong>し、変更前の状態に戻そうとします。失敗調査の第一歩は、コンソールの<strong>イベントタブで最初に<code>CREATE_FAILED</code>(または<code>UPDATE_FAILED</code>)になったリソースとステータス理由を確認する</strong>ことです。後続の失敗はロールバックの連鎖であることが多いためです。</p>
<h4>よくある失敗原因</h4>
<ul>
  <li><strong>権限不足</strong>: CloudFormationは既定では操作を実行したIAMプリンシパルの権限で、<strong>サービスロール</strong>を指定した場合はそのロールの権限でリソースを操作します。「not authorized to perform」というエラーは、この実行主体の権限不足が原因です</li>
  <li><strong>リソースの競合</strong>: S3バケット名など一意であるべき名前の重複(already exists)、同名リソースの手動作成との衝突</li>
  <li><strong>クォータ超過</strong>: EC2インスタンス数やEIP数などのサービスクォータ到達</li>
  <li><strong>依存関係・外部変更</strong>: スタック管理下のリソースが手動で削除・変更されていて更新に失敗する</li>
</ul>
<h4>失敗後のステータスと対処</h4>
<div class="table-wrap">
<table>
  <thead><tr><th>ステータス</th><th>意味と対処</th></tr></thead>
  <tbody>
    <tr><td><code>ROLLBACK_COMPLETE</code></td><td>新規作成の失敗後にロールバック完了。<strong>このスタックは更新できず、削除して作り直すしかない</strong></td></tr>
    <tr><td><code>UPDATE_ROLLBACK_COMPLETE</code></td><td>更新失敗後に元の状態へ復帰。原因を修正して再更新できる</td></tr>
    <tr><td><code>UPDATE_ROLLBACK_FAILED</code></td><td>ロールバック自体が失敗。原因(手動変更・権限など)を解消して<strong>ロールバックの続行(ContinueUpdateRollback)</strong>を実行する。問題リソースのスキップ指定も可能</td></tr>
    <tr><td><code>DELETE_FAILED</code></td><td>削除失敗(中身の残るS3バケットなどが典型)。原因を解消して再削除するか、対象リソースを保持(スキップ)して削除する</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-important">
  <span class="callout-title">重要</span>
  <p>デバッグ目的で「失敗時にロールバックさせず、成功済みリソースを保持したまま原因調査したい」場合は、スタック作成時にロールバックを無効化(失敗時に保持)するオプションを使います。</p>
</div>`,
      },
      {
        heading: "ドリフト検出とDeletionPolicy",
        html: `
<p>スタック管理下のリソースがコンソールやCLIで直接変更されると、テンプレートと実際の構成に差分(<strong>ドリフト</strong>)が生じます。<strong>ドリフト検出</strong>を実行すると、スタック全体またはリソース単位で、期待される構成との差分を確認できます。判定結果は<code>IN_SYNC</code>(一致)、<code>MODIFIED</code>(変更あり)、<code>DELETED</code>(削除済み)などで示されます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「誰かが手動でセキュリティグループを変更したらしく、テンプレートと実環境が合っているか確認したい」という設問はドリフト検出が答えです。ドリフトは検出のみで、自動修復はしません(修復はテンプレート値へ戻す更新や手動対応で行います)。</p>
</div>
<p><strong>DeletionPolicy属性</strong>は、スタック削除時(またはリソースがスタック管理から外れるとき)にそのリソースをどう扱うかをリソース単位で指定します。</p>
<ul>
  <li><code>Delete</code>: リソースを削除する(多くのリソースの既定値)</li>
  <li><code>Retain</code>: リソースを削除せず残す。スタックは削除されてもデータは保持される</li>
  <li><code>Snapshot</code>: 削除前にスナップショットを取得する(EBSボリューム、RDS DBインスタンス/DBクラスター、ElastiCache、Redshiftなど対応リソースのみ)</li>
</ul>
<p>更新時の置換で古いリソースがどう扱われるかは、類似の<code>UpdateReplacePolicy</code>属性で制御します。「スタックを削除してもデータベースのデータを失いたくない」という要件では、<code>Retain</code>か<code>Snapshot</code>をDBリソースに指定するのが定石です。</p>`,
      },
      {
        heading: "StackSetsによるマルチアカウント・マルチリージョン展開",
        html: `
<p><strong>CloudFormation StackSets</strong>は、1つのテンプレートから<strong>複数のAWSアカウント・複数のリージョン</strong>へスタック(スタックインスタンス)を一括展開する機能です。管理アカウントで作成したスタックセットが、ターゲットアカウントの各リージョンにスタックを配布します。全アカウント共通のIAMロール、AWS Config設定、監視基盤などの「ベースライン展開」が典型的な用途です。</p>
<h4>2つのアクセス許可モデル</h4>
<div class="table-wrap">
<table>
  <thead><tr><th>モデル</th><th>特徴</th></tr></thead>
  <tbody>
    <tr><td>セルフマネージド型</td><td>管理アカウントに管理ロール、<strong>各ターゲットアカウントに実行ロールを自分で作成</strong>する必要がある。アカウントIDを指定して展開</td></tr>
    <tr><td>サービスマネージド型</td><td>AWS Organizationsと統合し、必要なロールは自動管理。<strong>OU単位で展開でき、自動デプロイを有効にするとOUに新規参加したアカウントへも自動展開</strong>される</td></tr>
  </tbody>
</table>
</div>
<p>展開時には<strong>オペレーション設定</strong>として、同時に展開するリージョン数・アカウント数(同時実行数)や、何アカウント失敗したら操作を止めるかの<strong>障害許容数</strong>を指定でき、大規模展開時の影響範囲を制御できます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「組織の全アカウント(今後追加されるものも含む)に共通リソースを展開したい」→ サービスマネージド型+自動デプロイ、「Organizationsを使わず特定アカウントだけに展開したい」→ セルフマネージド型(管理ロール・実行ロールの事前作成が必要)、という使い分けが頻出です。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d3-ch01-q01",
      "cloudops-d3-ch01-q02",
      "cloudops-d3-ch01-q03",
      "cloudops-d3-ch01-q04",
      "cloudops-d3-ch01-q05",
      "cloudops-d3-ch01-q06",
      "cloudops-d3-ch01-q07",
      "cloudops-d3-ch01-q08",
      "cloudops-d3-ch01-q09",
    ],
  },
  {
    id: "cloudops-d3-ch02",
    domain: 3,
    title: "IaCの広がりとイメージ管理",
    sections: [
      {
        heading: "AWS CDKの概念とCloudFormationとの関係",
        html: `
<p><strong>AWS CDK(Cloud Development Kit)</strong>は、TypeScriptやPythonなどの<strong>汎用プログラミング言語でインフラを定義する</strong>IaCフレームワークで、SOA-C03で新たに試験範囲に加わりました。最大のポイントは、CDKが独自のデプロイ基盤を持つのではなく、<strong>コードからCloudFormationテンプレートを合成(synthesize)し、CloudFormationスタックとしてデプロイする</strong>ことです。つまりCDKで作った環境の実体はCloudFormationスタックであり、デプロイの進行やエラーはCloudFormationのイベントで追跡できます。</p>
<p>CDKアプリは<strong>コンストラクト</strong>という部品を組み合わせて記述します。単一リソースに1対1対応する低レベルのL1、適切なデフォルト値を備えた高レベルのL2、複数リソースをパターン化したL3があり、少ないコードでベストプラクティス構成を表現できます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>コマンド</th><th>役割</th></tr></thead>
  <tbody>
    <tr><td><code>cdk synth</code></td><td>コードからCloudFormationテンプレートを合成して出力する</td></tr>
    <tr><td><code>cdk diff</code></td><td>デプロイ済みスタックとコードの差分を表示する(適用前の影響確認)</td></tr>
    <tr><td><code>cdk deploy</code></td><td>テンプレートを合成し、CloudFormation経由でスタックをデプロイする</td></tr>
    <tr><td><code>cdk bootstrap</code></td><td>デプロイ先のアカウント×リージョンに、アセット格納用S3バケットやIAMロールなどの基盤(ブートストラップスタック)を作成する</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning">
  <span class="callout-title">試験での注意</span>
  <p>新しいアカウントやリージョンへ初めてCDKでデプロイする前には<code>cdk bootstrap</code>が必要です。「初回のcdk deployがブートストラップ関連のエラーで失敗した」→ 対象環境でbootstrapを実行する、が定番パターンです。</p>
</div>`,
      },
      {
        heading: "TerraformとGitによるデプロイ自動化",
        html: `
<p>試験ガイドは、サードパーティツールによるデプロイ自動化として<strong>Terraform</strong>と<strong>Git</strong>を明示しています。Terraformは HashiCorp社のIaCツールで、HCLという独自言語で構成を記述し、<strong>plan(差分確認)→ apply(適用)</strong>という流れでリソースを管理します。AWS以外のクラウドやSaaSも同じワークフローで扱える点が特徴です。</p>
<p>CloudFormationとの最大の違いは<strong>状態管理</strong>です。CloudFormationはスタックの状態をサービス側が管理しますが、Terraformは<strong>ステートファイル</strong>に管理対象の状態を記録します。チームで使う場合はステートファイルをS3などのリモートバックエンドに置き、<strong>ステートロック</strong>を有効にして同時実行による破損を防ぐのが定石です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>CloudFormation / CDK</th><th>Terraform</th></tr></thead>
  <tbody>
    <tr><td>状態管理</td><td>AWSサービス側で管理</td><td>ステートファイル(リモートバックエンド推奨)</td></tr>
    <tr><td>記述言語</td><td>JSON / YAML(CDKは汎用言語)</td><td>HCL</td></tr>
    <tr><td>対象</td><td>AWS中心</td><td>マルチクラウド・SaaS</td></tr>
  </tbody>
</table>
</div>
<p><strong>Git</strong>はテンプレートやCDKコードのバージョン管理の中核です。変更をブランチで作成してレビュー(プルリクエスト)を経てマージし、<strong>マージを契機にパイプラインがテンプレートを検証・デプロイする</strong>流れにすることで、手作業のコンソール変更を排除し、変更履歴・ロールバック手段・レビュー統制を確保できます。「インフラ変更の履歴が追えない」「手動変更で環境差分が生じた」という課題への解答が、Gitを起点としたIaC運用です。</p>`,
      },
      {
        heading: "EC2 Image BuilderによるAMI・コンテナイメージ管理",
        html: `
<p><strong>EC2 Image Builder</strong>は、<strong>AMIとコンテナイメージの作成・テスト・配布を自動化する</strong>フルマネージドサービスです。パッチ適用済みの標準イメージ(ゴールデンイメージ)を手作業で作っていると、適用漏れや属人化が起きがちです。Image Builderは次の要素を<strong>イメージパイプライン</strong>としてまとめ、スケジュールまたは依存更新を契機に自動実行します。</p>
<ul>
  <li><strong>レシピ</strong>: ベースイメージと適用する<strong>コンポーネント</strong>(ビルド手順・テスト手順)の組み合わせ。AMI用の<strong>イメージレシピ</strong>と、ECRへ出力する<strong>コンテナレシピ</strong>がある</li>
  <li><strong>インフラストラクチャ設定</strong>: ビルドに使う一時インスタンスのタイプやサブネットなど</li>
  <li><strong>ディストリビューション設定</strong>: 完成したイメージを<strong>どのリージョン・どのアカウントに配布するか</strong>。AMIの共有やECRリポジトリへのプッシュ先を定義</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「毎月最新パッチを適用したAMIを自動作成し、複数リージョンへ配布したい」はImage Builderの定番シナリオです。パイプラインは成功したのに他リージョンでイメージが見つからない場合は、ディストリビューション設定に対象リージョンが含まれているかを確認します。</p>
</div>
<p>ビルド後には<strong>テストコンポーネント</strong>で起動確認や検証を自動実行でき、問題のあるイメージの配布を未然に防げます。コンテナレシピを使えば、DockerfileベースのビルドとECRへの配布まで同じパイプラインで管理できます。</p>`,
      },
      {
        heading: "AWS RAMとService Catalogによる共有・統制",
        html: `
<p>マルチアカウント運用では「リソースそのものを共有する」仕組みと「承認済み構成だけを使わせる」仕組みが必要になります。前者が<strong>AWS RAM(Resource Access Manager)</strong>、後者が<strong>AWS Service Catalog</strong>です。</p>
<h4>AWS RAM</h4>
<p>RAMは、自アカウントのリソースを<strong>他のAWSアカウント、OU、組織全体と共有する</strong>サービスです。共有できる代表例は<strong>VPCサブネット</strong>、Transit Gateway、Route 53 Resolverルール、ライセンス設定などです。ネットワーク専任アカウントでVPCを一元管理し、サブネットをアプリケーションアカウント群へ共有する「共有VPC」構成が典型で、リソースを複製せずに済むためIPアドレス管理や運用が簡素化されます。組織内共有を有効にすれば、招待の承諾なしに共有できます。</p>
<h4>AWS Service Catalog</h4>
<p>Service Catalogは、管理者がCloudFormationテンプレートを<strong>製品</strong>として登録し、<strong>ポートフォリオ</strong>にまとめて利用者へ公開するサービスです。利用者はセルフサービスで承認済み構成をプロビジョニングできます。重要なのが<strong>起動制約(Launch Constraint)</strong>で、製品の起動時にはユーザー自身の権限ではなく<strong>起動制約に指定したIAMロールの権限</strong>でリソースが作成されます。利用者に広いIAM権限を与えることなく、標準化された構成だけを展開させられます。</p>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>「サブネットやTransit Gatewayを複数アカウントで使い回したい」→ RAM、「開発者に承認済み構成だけをセルフサービスで作らせたい(広い権限は渡さない)」→ Service Catalog+起動制約、という使い分けを押さえましょう。</p>
</div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d3-ch02-q01",
      "cloudops-d3-ch02-q02",
      "cloudops-d3-ch02-q03",
      "cloudops-d3-ch02-q04",
      "cloudops-d3-ch02-q05",
      "cloudops-d3-ch02-q06",
      "cloudops-d3-ch02-q07",
      "cloudops-d3-ch02-q08",
    ],
  },
];
