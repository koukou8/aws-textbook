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
  {
    id: "cloudops-d3-ch03",
    domain: 3,
    title: "Systems Managerと運用の自動化",
    sections: [
      {
        heading: "Systems Managerの基盤とマネージドノードの前提条件",
        html: `
<p>AWS Systems Managerは、EC2インスタンスやオンプレミスサーバーを<strong>マネージドノード</strong>として登録し、コマンド実行・パッチ適用・構成管理・リモートアクセスまでを一元化する運用サービス群です。分野3では「既存リソースの管理の自動化」の中核として、各機能の使い分けと、セットアップのトラブルシューティングが問われます。</p>
<p>インスタンスがマネージドノードとして認識されるには、次の<strong>3つの条件</strong>がすべて満たされている必要があります。</p>
<ol>
  <li><strong>SSM Agentが導入・起動されている</strong>(Amazon LinuxやWindows Serverなど多くのAWS提供AMIにはプリインストール済み)</li>
  <li><strong>インスタンスプロファイル(IAMロール)</strong>に、Systems Managerとの通信を許可する権限(AmazonSSMManagedInstanceCore管理ポリシーが代表)が付与されている</li>
  <li>エージェントから<strong>Systems Managerエンドポイントへのアウトバウンド HTTPS(443)の経路</strong>がある。プライベートサブネットではNATゲートウェイ、またはssm・ssmmessages・ec2messagesの<strong>インターフェイスVPCエンドポイント</strong>を用意する</li>
</ol>
<p>SSM Agentは<strong>エージェント側からAWSへ接続するpull型</strong>のため、インバウンドポートの開放は一切不要です。この性質が、後述するSession Managerのセキュリティ上の利点にもつながります。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「インスタンスがマネージドノードの一覧に表示されない」原因は、(1)エージェント未稼働、(2)インスタンスプロファイルの権限不足、(3)エンドポイントへの経路なし、の3点を順に確認します。インバウンドSSHの許可やパブリックIPアドレスは必須条件ではありません。</p></div>`,
      },
      {
        heading: "Run Command・State Manager・インベントリの使い分け",
        html: `
<p><strong>Run Command</strong>は、SSHや踏み台サーバーを使わずに、多数のマネージドノードへコマンドやスクリプトを一括実行する機能です。実行内容はAWS-RunShellScript(Linux)やAWS-RunPowerShellScript(Windows)などの<strong>SSMドキュメント</strong>で定義し、ターゲットはインスタンスID・<strong>タグ</strong>・リソースグループで指定します。<strong>同時実行数(レート制御)とエラーしきい値</strong>を設定して段階的に実行でき、出力はS3やCloudWatch Logsへ保存できます。</p>
<p><strong>State Manager</strong>は「あるべき状態」を<strong>関連付け(Association)</strong>として定義し、スケジュールに従って繰り返し適用する機能です。タグでターゲットを指定すれば後から起動したインスタンスにも自動適用され、手動変更などで構成が逸脱しても次回の適用時に是正されます。<strong>インベントリ</strong>は、ノードのOS・インストール済みアプリケーション・ネットワーク設定などのメタデータを収集し、ソフトウェア資産の把握やコンプライアンス確認に使います。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>要件</th><th>使う機能</th></tr></thead>
  <tbody>
    <tr><td>1回限りのコマンドを多数のノードへ一斉実行したい</td><td>Run Command</td></tr>
    <tr><td>構成を継続的に維持し、逸脱を自動的に是正したい</td><td>State Manager</td></tr>
    <tr><td>複数ステップの修復・運用ワークフローを実行したい</td><td>Automationランブック(分野1で詳述)</td></tr>
    <tr><td>インストール済みソフトウェアの情報を収集したい</td><td>インベントリ</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「至急・1回だけ」ならRun Command、「常にこの状態を保ちたい」ならState Managerです。設問の時間軸(単発か継続か)が選択の決め手になります。</p></div>`,
      },
      {
        heading: "Patch Managerによるパッチ運用の自動化",
        html: `
<p><strong>Patch Manager</strong>は、OSパッチの適用状況の確認(スキャン)と適用(インストール)を自動化します。構成要素は次の3つです。</p>
<ul>
  <li><strong>パッチベースライン</strong>: どのパッチを承認するかのルール。分類や重要度による<strong>自動承認ルール</strong>(例: リリースから7日経過で自動承認)と、明示的な承認・拒否リストを定義できます</li>
  <li><strong>パッチグループ</strong>: 「Patch Group」タグでインスタンスをグループ化し、ベースラインと関連付けます。本番と開発で異なるベースラインを使い分ける場合の仕組みです</li>
  <li><strong>メンテナンスウィンドウ</strong>: パッチ適用などの作業を実行してよい時間帯・頻度・同時実行数を定義するスケジュール枠です</li>
</ul>
<p>実際のスキャン・適用は<strong>AWS-RunPatchBaseline</strong>ドキュメントの実行で行われ、<strong>Operationパラメータ</strong>で動作が決まります。<strong>Scanは未適用パッチの検出とコンプライアンス報告のみ</strong>で、パッチは適用しません。<strong>Install</strong>は承認済みパッチを適用し、必要に応じてインスタンスを再起動します。結果はコンプライアンスとして集計され、未適用(Missing)パッチが残るインスタンスを特定できます。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「スキャンは毎日実行されているのにパッチが適用されない」という設問の答えは、OperationがScanのままでInstallが実行されていない、が定番です。ScanとInstallの違いは必ず押さえましょう。</p></div>`,
      },
      {
        heading: "Session ManagerとParameter Store",
        html: `
<p><strong>Session Manager</strong>は、マネジメントコンソール(ブラウザ)やCLIからマネージドノードへの対話型シェルアクセスを提供します。SSM Agentがアウトバウンド接続で通信するため、<strong>インバウンドポートの開放・踏み台サーバー・SSH鍵の管理がすべて不要</strong>になります。アクセス可否はIAMポリシーで制御でき(タグによる対象ノードの限定も可能)、<strong>セッションの操作ログをS3またはCloudWatch Logsへ保存</strong>できるため、「ポート22を閉じたい」「操作の監査証跡を残したい」という要件への定番解です。詳細は<a href="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html" target="_blank" rel="noopener noreferrer">Session Managerのドキュメント</a>を参照してください。</p>
<p><strong>Parameter Store</strong>は、設定値や接続文字列を階層構造(/prod/db/url など)で保管するサービスです。パラメータの種類はString、StringList、そしてKMSで暗号化される<strong>SecureString</strong>の3つで、標準パラメータは追加料金なしで利用できます。CloudFormation、Lambda、ECSタスク定義などから参照でき、環境ごとの設定の一元管理に適しています。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>観点</th><th>Parameter Store</th><th>Secrets Manager</th></tr></thead>
  <tbody>
    <tr><td>主な用途</td><td>設定値全般+シークレット(SecureString)</td><td>シークレット専用</td></tr>
    <tr><td>自動ローテーション</td><td>組み込み機能なし(自作が必要)</td><td><strong>組み込みで対応</strong>(RDSなどと統合)</td></tr>
    <tr><td>料金</td><td>標準パラメータは追加料金なし</td><td>シークレット単位+APIコールで課金</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「自動ローテーションが必須」ならSecrets Manager、「暗号化して保管できれば十分・低コスト優先」ならParameter StoreのSecureString、が使い分けの決め手です。</p></div>`,
      },
      {
        heading: "イベント駆動の自動化とECS/EKSデプロイの基礎",
        html: `
<p>運用の自動化は「イベントを起点に処理をつなぐ」ことで人手の作業を排除します。<strong>S3イベント通知</strong>は、オブジェクトの作成・削除などを契機に<strong>Lambda、SQS、SNS</strong>へ通知でき、EventBridgeへの送信を有効化すれば、より柔軟なフィルタリングと複数ターゲットへのルーティングも可能です。プレフィックス・サフィックス(例: uploads/ と .jpg)で対象オブジェクトを絞り込めます。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p>S3イベント通知がLambda関数を直接呼び出すには、関数側の<strong>リソースベースポリシー</strong>でS3からの実行(lambda:InvokeFunction)を許可する必要があります。コンソールで設定すると自動付与されますが、CloudFormationやCLIで構成する場合はAWS::Lambda::Permissionの定義漏れが「アップロードしても関数が起動しない」原因の定番です。</p></div>
<p><strong>Amazon EventBridge</strong>は、AWSサービスのイベントやスケジュール(cron/rate式)をルールで受け取り、Lambda・SSM Automation・SQSなどのターゲットを起動します。「夜間に開発環境のインスタンスを停止する」「特定のAPI呼び出しを検知して修復処理を走らせる」など、スケジュール駆動・イベント駆動どちらの自動化でも中心になるサービスです。</p>
<h4>ECS/EKSデプロイの基礎</h4>
<p>Amazon ECSでは、コンテナイメージやCPU・メモリ設定を<strong>タスク定義</strong>のリビジョンとして登録し、<strong>サービス</strong>を新しいリビジョンへ更新すると<strong>ローリング更新</strong>でタスクが順次置き換わります。置き換えの幅はminimumHealthyPercentとmaximumPercentで制御します。タスクは<strong>起動時にイメージを取得する</strong>ため、同じタグ(latestなど)のまま中身だけ更新しても稼働中のタスクには反映されず、<strong>「新しいデプロイの強制(force new deployment)」</strong>か、一意なタグを使った新リビジョンの登録が必要です。イメージの保管はAmazon ECRが担い、Amazon EKSではマニフェストの適用によりKubernetesが同様のローリング更新を行います。</p>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「latestタグを上書きしたのに反映されない」→ 新しいデプロイの強制、が定番パターンです。運用上はコミットIDなど一意のイメージタグを使うと、変更履歴の追跡とロールバックも容易になります。</p></div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d3-ch03-q01",
      "cloudops-d3-ch03-q02",
      "cloudops-d3-ch03-q03",
      "cloudops-d3-ch03-q04",
      "cloudops-d3-ch03-q05",
      "cloudops-d3-ch03-q06",
      "cloudops-d3-ch03-q07",
      "cloudops-d3-ch03-q08",
      "cloudops-d3-ch03-q09",
    ],
  },
];
