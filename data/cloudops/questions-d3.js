// CloudOps教材 分野3(デプロイ、プロビジョニング、オートメーション)の確認問題
export const questions = [
  // ===== cloudops-d3-ch01: CloudFormation徹底 =====
  {
    id: "cloudops-d3-ch01-q01",
    domain: 3,
    topic: "CloudFormationクロススタック参照",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、ネットワーク用のAWS CloudFormationスタックがVPCとサブネットのIDをOutputsセクションでエクスポートし、複数のアプリケーションスタックがFn::ImportValueで参照しています。ネットワーク構成を作り直すためにこのスタックを削除しようとしたところ、エクスポートされた出力が使用中であるという趣旨のエラーで削除に失敗しました。スタックを削除できるようにするための対応として最も適切なものはどれですか。",
    choices: [
      "参照している側のアプリケーションスタックを先に更新または削除し、インポートをすべて解消してから削除する",
      "スタックの削除保護(termination protection)を無効化してから削除を再実行する",
      "すべてのリソースにDeletionPolicy: Retainを設定してから削除を再実行する",
      "操作者のIAMポリシーにcloudformation:DeleteStack権限を追加してから削除を再実行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。エクスポートされた出力値を他のスタックがFn::ImportValueで参照している間は、エクスポート元の値の変更やスタックの削除はできません。参照している側のスタックを更新してインポートを解消するか、参照元のスタックを削除してから、エクスポート元のスタックを削除します。Bの削除保護が有効な場合は削除操作の開始自体がブロックされるもので、このエラーの原因ではありません。CのDeletionPolicy: Retainはリソースを残したままスタックを削除するための設定で、クロススタック参照による削除失敗は解消できません。Dのような権限不足であればAccessDenied系のエラーになるため、状況と一致しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html",
  },
  {
    id: "cloudops-d3-ch01-q02",
    domain: 3,
    topic: "CloudFormation変更セット",
    type: "single",
    difficulty: "easy",
    question:
      "CloudOpsエンジニアが、本番環境のCloudFormationスタックのテンプレートを修正し、Amazon RDS DBインスタンスの設定を変更しようとしています。更新を適用する前に、この変更によってDBインスタンスが置換(再作成)されてデータが失われるリスクがないかを確認したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "スタックのドリフト検出を実行し、リソースの差分を確認する",
      "変更セットを作成し、各リソースのReplacement属性を確認してから実行を判断する",
      "スタックポリシーを設定し、DBインスタンスへの更新操作を拒否する",
      "aws cloudformation validate-templateコマンドでテンプレートを検証する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。変更セットを作成すると、更新を適用した場合にどのリソースがどう変更されるかの一覧が事前に生成され、Replacement属性がTrueのリソースは置換(削除して再作成)されることが分かります。内容を確認してから実行するか破棄するかを判断できるため、データ損失が許されない本番DBの更新前確認に最適です。Aのドリフト検出はテンプレートと実環境の差分を調べる機能で、これから行う更新の影響は予測できません。Cのスタックポリシーは誤更新からの保護はできますが、影響の有無を確認する手段ではありません。Dのvalidate-templateは構文チェックのみで、リソースへの影響は分かりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html",
  },
  {
    id: "cloudops-d3-ch01-q03",
    domain: 3,
    topic: "CloudFormationサービスロール",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、サービスロールを指定してCloudFormationスタックを作成したところ、VPCリソースがCREATE_FAILEDとなり、ステータス理由に「not authorized to perform: ec2:CreateVpc」という趣旨のエラーが表示されました。スタックの作成を成功させるための対処として最も適切なものはどれですか。",
    choices: [
      "スタック操作を実行したIAMユーザーにec2:CreateVpc権限を追加する",
      "サービスロールにAWSCloudFormationFullAccess管理ポリシーをアタッチする",
      "スタックに指定したサービスロールのポリシーに、ec2:CreateVpcなど必要なリソース操作権限を追加する",
      "スタックポリシーにec2:CreateVpcを許可するステートメントを追加する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。サービスロールを指定したスタックでは、CloudFormationは操作者本人ではなくサービスロールの権限でリソースを作成・更新・削除します。そのため権限不足のエラーは、サービスロールへ必要なリソース操作権限を追加して解消します。Aについて、サービスロールを指定している場合の実行主体はロールであり、操作者本人への権限追加では解決しません。BのAWSCloudFormationFullAccessはCloudFormationのAPI操作を許可するポリシーで、EC2などの個々のリソースを作成する権限は含まれません。Dのスタックポリシーは更新からリソースを保護する仕組みであり、IAM権限を付与するものではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html",
  },
  {
    id: "cloudops-d3-ch01-q04",
    domain: 3,
    topic: "CloudFormationスタックステータス",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが新しいCloudFormationスタックを作成したところ、一部リソースの作成に失敗し、スタックはROLLBACK_COMPLETE状態になりました。テンプレートの誤りを修正し、同じスタックに対して更新を実行して再デプロイしようとしましたが、更新操作を実行できません。最も適切な対処はどれですか。",
    choices: [
      "修正したテンプレートで変更セットを作成し、実行する",
      "ロールバックの続行(ContinueUpdateRollback)を実行する",
      "ドリフト検出を実行し、差分を解消してから更新を再実行する",
      "スタックを削除し、修正したテンプレートで新規にスタックを作成する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。新規作成に失敗してロールバックが完了したROLLBACK_COMPLETE状態のスタックは、正常に作成されたリソースを持たず、更新操作を受け付けません。この状態からはスタックを削除し、修正済みテンプレートで作成し直すしかありません。Aの変更セットの実行も更新操作の一種であるため、この状態のスタックには適用できません。BのContinueUpdateRollbackは、更新失敗後のロールバックに失敗したUPDATE_ROLLBACK_FAILED状態からの復旧操作であり、この状況では使用できません。Cのドリフト検出はテンプレートと実環境の差分を確認するだけの機能で、スタックの状態を回復させる効果はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/troubleshooting.html",
  },
  {
    id: "cloudops-d3-ch01-q05",
    domain: 3,
    topic: "CloudFormationロールバック",
    type: "single",
    difficulty: "hard",
    question:
      "本番環境のCloudFormationスタックの更新が失敗し、続く自動ロールバックも失敗して、スタックがUPDATE_ROLLBACK_FAILED状態になりました。調査の結果、スタック管理下のIAMロールが更新処理の最中に別の管理者によって手動で削除されていたことが原因と分かりました。稼働中のリソースを維持したままスタックを正常な状態へ戻す対応として、最も適切なものはどれですか。",
    choices: [
      "スタックを削除し、最後に成功したテンプレートで新規にスタックを作成し直す",
      "削除されたIAMロールを復元したうえで、ロールバックの続行(ContinueUpdateRollback)を実行する",
      "修正したテンプレートを使用して、再度スタックの更新を実行する",
      "ドリフト検出を実行し、削除されたIAMロールを自動的に再作成する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。UPDATE_ROLLBACK_FAILED状態のスタックは、失敗の原因(この場合は管理下リソースの手動削除)を解消したうえでロールバックの続行(ContinueUpdateRollback)を実行することで、更新前の正常な状態へ復帰できます。復旧が難しいリソースはスキップ対象として指定することも可能です。Aの削除と再作成でも環境は作り直せますが、本番の稼働リソースがすべて失われるため要件に反します。Cについて、UPDATE_ROLLBACK_FAILED状態のスタックには新たな更新操作を実行できません。Dのドリフト検出は差分を検出するだけで、リソースを自動的に再作成・修復する機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html",
  },
  {
    id: "cloudops-d3-ch01-q06",
    domain: 3,
    topic: "CloudFormationトラブルシューティング",
    type: "multiple",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、多数のリソースを含むCloudFormationスタックの作成失敗を調査しています。スタックは自動的にロールバックされ、イベントには多くの失敗レコードが並んでいます。失敗の根本原因を特定するための方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "イベントを時系列で遡り、最初にCREATE_FAILEDになったリソースのステータス理由を確認する",
      "ロールバックを無効化(失敗時にリソースを保持)する設定でスタックを再作成し、失敗時点の状態を直接調査する",
      "スタックのドリフト検出を実行し、MODIFIEDと判定されたリソースを確認する",
      "スタックポリシーの内容を確認し、拒否された更新操作を特定する",
      "AWS Trusted Advisorのチェック結果から、失敗したリソースを特定する",
    ],
    answerIndexes: [0, 1],
    explanation:
      "正解はAとBです。作成失敗時には後続リソースのキャンセルやロールバックのイベントが連鎖的に記録されるため、時系列を遡って最初のCREATE_FAILEDのステータス理由を確認するのが原因特定の基本です。また、失敗時にロールバックさせず成功済みリソースを保持するオプションを使えば、失敗した時点の状態を保ったまま調査できます。Cのドリフト検出は稼働中スタックへの手動変更を調べる機能で、作成失敗の原因調査には使えません。Dのスタックポリシーは更新時の保護設定であり、新規作成の失敗とは無関係です。EのTrusted Advisorはベストプラクティスからの乖離を確認するサービスで、スタック失敗の原因は分かりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/stack-failure-options.html",
  },
  {
    id: "cloudops-d3-ch01-q07",
    domain: 3,
    topic: "CloudFormationドリフト検出",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業で、CloudFormationで管理している本番スタック内のセキュリティグループのルールが、テンプレートの定義と異なっているという報告がありました。スタック管理下のどのリソースがコンソールなどから直接変更されたのかを特定したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "スタックのドリフト検出を実行し、MODIFIEDと判定されたリソースの差分の詳細を確認する",
      "変更セットを作成し、現在のテンプレートとの差分を確認する",
      "AWS Configのマネージドルールでセキュリティグループの設定を評価する",
      "スタックのイベント履歴から、リソースへの変更操作の記録を確認する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ドリフト検出は、スタック管理下のリソースの実際の構成をテンプレートの期待値と比較し、リソースごとにIN_SYNC、MODIFIED、DELETEDなどの判定と差分の詳細を表示します。手動変更の有無と箇所の特定にはこの機能が最適です。Bの変更セットは新しいテンプレートを適用した場合の変更予測を示すもので、実環境への手動変更は検出できません。CのAWS Configルールは定義した基準への準拠を評価する仕組みで、CloudFormationテンプレートとの比較は行いません。Dのイベント履歴にはCloudFormationが実行した操作だけが記録され、コンソールからの直接変更は残りません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html",
  },
  {
    id: "cloudops-d3-ch01-q08",
    domain: 3,
    topic: "DeletionPolicy",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、検証環境のCloudFormationスタックを利用のたびに作成・削除する運用をしています。スタックにはAmazon RDS DBインスタンスが含まれており、スタックの削除後もデータを復元できるようにしたい一方、削除後にDBインスタンスの稼働コストが発生し続けることは避けたいと考えています。テンプレートの設定として最も適切なものはどれですか。",
    choices: [
      "DBインスタンスにDeletionPolicy: Retainを設定する",
      "スタックポリシーでDBインスタンスへの操作を拒否する",
      "DBインスタンスにDeletionPolicy: Snapshotを設定する",
      "スタック削除前に手動でスナップショットを取得する手順を運用ドキュメントに追加する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。DeletionPolicy: Snapshotを設定すると、スタック削除時にDBインスタンスのスナップショットが取得されてからリソースが削除されます。データはスナップショットから復元でき、インスタンス自体は削除されるため稼働コストは発生しません。AのRetainではDBインスタンスがそのまま残り、データは保持できますが稼働コストが発生し続けるため要件に反します。Bのスタックポリシーは更新時にリソースを保護するための仕組みで、削除後のデータ保全とコストの要件は満たせません。Dの手動手順は取得漏れという人為ミスの余地が残り、テンプレートの属性で自動化できるCに比べて確実性で劣ります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html",
  },
  {
    id: "cloudops-d3-ch01-q09",
    domain: 3,
    topic: "CloudFormation StackSets",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業が、AWS Organizationsを使用せずに、セルフマネージド型のアクセス許可でCloudFormation StackSetsを構成し、複数のAWSアカウントへ監査用IAMロールを展開しようとしています。一部のターゲットアカウントでのみスタックインスタンスの作成が失敗しました。原因として最も可能性が高いものはどれですか。",
    choices: [
      "管理アカウントでAWS Organizationsとの信頼されたアクセスが有効化されていない",
      "失敗したターゲットアカウントのCloudFormationスタック数がサービスクォータの上限に達している",
      "テンプレートに展開先リージョンでは利用できないリソースタイプが含まれている",
      "失敗したターゲットアカウントに、管理アカウントから引き受けられる実行ロールが作成されていない",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。セルフマネージド型のStackSetsでは、管理アカウントの管理ロールと各ターゲットアカウントの実行ロール(AWSCloudFormationStackSetExecutionRole)を利用者自身が作成する必要があります。実行ロールが未作成のアカウントへの展開は失敗するため、一部のアカウントだけ失敗する場合の典型的な原因です。Aの信頼されたアクセスの有効化はサービスマネージド型で必要になる設定であり、セルフマネージド型では使用しません。Bのクォータ超過も失敗要因にはなり得ますが、特定アカウントだけ上限に達しているよりロール未作成の可能性が高いです。CのIAMロールはリージョンに依存しないグローバルリソースであり、リージョン差異による失敗は考えにくいです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html",
  },
  // ===== cloudops-d3-ch02: IaCの広がりとイメージ管理 =====
  {
    id: "cloudops-d3-ch02-q01",
    domain: 3,
    topic: "AWS CDK",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がAWS CDK(TypeScript)でインフラを管理しています。CloudOpsエンジニアがcdk deployを実行したところデプロイが途中で失敗したため、どのリソースがなぜ失敗したのかを詳しく調査する必要があります。リソースごとの失敗理由を確認する場所として最も適切なものはどれですか。",
    choices: [
      "CloudFormationコンソールで、対応するスタックのイベントに記録されたステータス理由を確認する",
      "AWS CloudTrailのイベント履歴で、cdkコマンドによるAPI呼び出しの記録を確認する",
      "cdk synthを実行し、合成されたCloudFormationテンプレートの内容を確認する",
      "CloudWatch LogsにCDKが自動作成するデプロイ用ロググループを確認する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CDKはコードからCloudFormationテンプレートを合成し、CloudFormationスタックとしてデプロイします。デプロイの実体はCloudFormationのスタック操作であるため、リソースごとの失敗理由は対応するスタックのイベントのステータス理由で確認するのが最も直接的です。BのCloudTrailにはAPI呼び出しの記録は残りますが、リソース作成失敗の理由を調べるにはスタックイベントの方が適しています。Cのcdk synthはテンプレートを出力する静的な操作で、デプロイ時の失敗理由は分かりません。DについてCDKがデプロイログ用のロググループを自動作成することはなく、確認先として不適切です。",
    reference: "https://docs.aws.amazon.com/cdk/v2/guide/home.html",
  },
  {
    id: "cloudops-d3-ch02-q02",
    domain: 3,
    topic: "cdk bootstrap",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、これまでCDKを使用したことのない新しいAWSアカウントの新しいリージョンへ初めてcdk deployを実行したところ、デプロイに必要なリソースが見つからないという趣旨のエラーで失敗しました。他のアカウントでは同じCDKアプリのデプロイに成功しています。最も適切な対処はどれですか。",
    choices: [
      "cdk synthを実行してCloudFormationテンプレートを再合成してからデプロイする",
      "対象のアカウントとリージョンに対してcdk bootstrapを実行し、ブートストラップスタックを作成してからデプロイする",
      "アセット格納用のAmazon S3バケットを手動で作成し、CDKコードから参照するよう修正する",
      "cdk diffを実行してデプロイ済みスタックとの差分を解消してからデプロイする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CDKでデプロイするには、デプロイ先のアカウントとリージョンの組み合わせごとに、アセット格納用S3バケットやデプロイ用IAMロールなどをまとめたブートストラップスタックが必要です。新しい環境で初めてデプロイする前にcdk bootstrapを実行すれば、この定番エラーは解消します。Aのcdk synthはテンプレートを合成するだけの操作で、デプロイ基盤の不足は解決しません。Cのように必要リソースを手動で作成するのはCDKが期待する構成との整合を保証できず、bootstrapコマンドで作成するのが正しい手順です。Dのcdk diffは差分を表示する読み取り専用のコマンドで、初回デプロイの失敗には対処できません。",
    reference: "https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html",
  },
  {
    id: "cloudops-d3-ch02-q03",
    domain: 3,
    topic: "Terraform",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業では、複数のエンジニアがTerraformで同じAWS環境を管理しており、ステートファイルは各エンジニアのローカル端末に保存されています。先日、2人のエンジニアがほぼ同時にterraform applyを実行した結果、ステートの内容と実際の環境に不整合が発生しました。再発を防ぐための対策として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "ステートファイルをGitリポジトリにコミットし、各エンジニアがプルして使用する",
      "ステートファイルをAmazon S3などのリモートバックエンドへ移行して一元管理する",
      "terraform applyの前に必ずterraform planを実行する運用ルールを定める",
      "ステートロックを有効化し、同時実行によるステート更新の競合を防ぐ",
      "ステートファイルの日次バックアップを取得して保管する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。チームでTerraformを使う場合は、ステートファイルをS3などのリモートバックエンドに置いて全員が常に同じ状態を参照できるようにし、あわせてステートロックを有効化して複数人の同時applyによるステートの競合・破損を防ぐのが定石です。AのGit管理では、コミットやプルのタイミングによって古いステートが使われるうえ、同時実行の制御もできません。Cのplanは差分確認として重要な習慣ですが、同時実行そのものは防げません。Eのバックアップは破損後の復旧には役立つものの、不整合の発生を防ぐ対策にはなりません。",
    reference: "https://aws.amazon.com/jp/what-is/iac/",
  },
  {
    id: "cloudops-d3-ch02-q04",
    domain: 3,
    topic: "IaCとGit",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、CloudFormationテンプレートの変更が各エンジニアのコンソール操作やCLIから直接本番環境に適用されており、いつ誰が何を変更したのか追跡できないうえ、レビューを経ていない変更が反映されるという問題が起きています。インフラ変更の統制を改善する方法として最も適切なものはどれですか。",
    choices: [
      "テンプレートをGitで管理し、プルリクエストのレビューとマージを契機にパイプラインからデプロイする",
      "全エンジニアのIAM権限をCloudFormationの読み取り専用アクセスに変更する",
      "AWS CloudTrailですべての変更操作を記録し、月次で監査を実施する",
      "スタックポリシーで本番スタックのすべてのリソースの更新を禁止する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。テンプレートをGitリポジトリで管理し、ブランチとプルリクエストでレビューを経てマージし、マージを契機にパイプラインが検証・デプロイする運用にすれば、変更履歴・レビュー統制・ロールバック手段が確保され、手作業による直接変更も排除できます。Bの読み取り専用化では正当な変更作業まで行えなくなり、業務が成立しません。CのCloudTrailによる記録は事後の追跡には有効ですが、レビューされていない変更が適用されること自体は防げません。Dのようにすべての更新を禁止すると必要な変更も適用できなくなり、統制の改善ではなく業務の停止につながります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/best-practices.html",
  },
  {
    id: "cloudops-d3-ch02-q05",
    domain: 3,
    topic: "EC2 Image Builder",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、最新のセキュリティパッチを適用した標準AMI(ゴールデンイメージ)を毎月作成し、起動テストを実行したうえで複数のリージョンへ配布しています。現在は担当者の手作業で行っており、作業漏れや属人化が問題になっています。運用負荷を最小限に抑えて自動化する方法として最も適切なものはどれですか。",
    choices: [
      "AWS BackupでAMIのバックアップを毎月取得し、複数リージョンへコピーする",
      "Systems Manager Run Commandで毎月パッチを適用し、担当者がAMIを取得して各リージョンへコピーする",
      "EC2 Image Builderでレシピ・テスト・配布設定を含むイメージパイプラインを作成し、月次スケジュールで実行する",
      "Auto Scalingグループの起動テンプレートにユーザーデータを設定し、インスタンス起動時にパッチを適用する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2 Image Builderは、ベースイメージと適用コンポーネントを定義したレシピ、起動確認などのテストコンポーネント、配布先を定めるディストリビューション設定をイメージパイプラインとしてまとめ、スケジュールに従ってビルドからテスト、複数リージョンへの配布までを自動実行できます。手作業の排除という要件に合致します。AのAWS Backupは既存リソースのバックアップが目的で、パッチ適用やテストは行えません。BはAMI取得と配布が手作業のまま残り、作業漏れの問題を解消できません。Dの起動時パッチ適用は起動時間を延ばすうえ、テスト済みの標準イメージを配布するという運用にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/imagebuilder/latest/userguide/what-is-image-builder.html",
  },
  {
    id: "cloudops-d3-ch02-q06",
    domain: 3,
    topic: "Image Builderディストリビューション設定",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、EC2 Image BuilderのイメージパイプラインでゴールデンAMIを作成しています。パイプラインは毎回正常に完了しますが、災害対策用のリージョンで新しいAMIを利用できないことが分かりました。原因として最も可能性が高いものはどれですか。",
    choices: [
      "レシピに含まれるテストコンポーネントの実行が失敗している",
      "インフラストラクチャ設定で指定したサブネットが災害対策用リージョンに存在しない",
      "パイプラインのスケジュールが依存関係の更新時にのみ実行する設定になっている",
      "ディストリビューション設定に災害対策用リージョンが含まれていない",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Image Builderで完成したイメージをどのリージョン・どのアカウントへ配布するかは、ディストリビューション設定で定義します。パイプラインが正常に完了しているのに特定リージョンでAMIが見つからない場合は、配布先にそのリージョンが含まれていないことをまず確認します。Aのテストコンポーネントが失敗していればパイプラインは正常完了しないため、状況と矛盾します。Bのインフラストラクチャ設定はビルド用の一時インスタンスをどこで動かすかの設定であり、配布先のリージョンとは無関係です。Cのスケジュールは実行契機の設定であり、パイプラインが毎回実行・完了している本件では原因になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/imagebuilder/latest/userguide/what-is-image-builder.html",
  },
  {
    id: "cloudops-d3-ch02-q07",
    domain: 3,
    topic: "Service Catalog",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、AWS Service Catalogで承認済みのCloudFormationテンプレートを製品として開発者へ公開しており、開発者のIAM権限はService Catalogの利用に必要な最小限に絞られています。製品のテンプレートに新しくAmazon ElastiCacheのリソースを追加したところ、開発者がその製品を起動するとリソース作成の権限エラーで失敗するようになりました。統制を維持したまま解決する方法として最も適切なものはどれですか。",
    choices: [
      "開発者のIAMポリシーにElastiCacheリソースの作成権限を追加する",
      "製品の起動制約(Launch Constraint)に指定されているIAMロールへElastiCacheの操作権限を追加する",
      "製品を新しいプロビジョニングアーティファクト(バージョン)として登録し直す",
      "ポートフォリオを開発者のアカウントへ再共有し、アクセス権限を付与し直す",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。起動制約が設定された製品は、起動したユーザー自身の権限ではなく、起動制約に指定されたIAMロールの権限でリソースがプロビジョニングされます。テンプレートに新しいリソースタイプを追加した場合は、そのロールへ対応する権限を追加するのが正しい対処で、開発者の権限を最小限に保ったまま解決できます。Aのように開発者へ直接権限を付与すると、承認された構成以外でもリソースを作成できるようになり統制が崩れます。Cの新バージョン登録はテンプレート変更を配布する手順であり、権限エラーは解消しません。Dの再共有は製品が見えない場合の対処で、起動時の権限不足とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/servicecatalog/latest/adminguide/constraints-launch.html",
  },
  {
    id: "cloudops-d3-ch02-q08",
    domain: 3,
    topic: "AWS RAM",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はマルチアカウント構成を採用しており、ネットワーク専任アカウントがVPCを一元管理しています。複数のアプリケーションアカウントに同一VPC内のサブネットを直接利用させ、アカウントごとのVPC複製やIPアドレス範囲の重複管理を避けたいと考えています。最も適切な方法はどれですか。",
    choices: [
      "各アプリケーションアカウントにVPCを作成し、VPCピアリングで相互接続する",
      "AWS Transit Gatewayを構成し、各アカウントのVPCを接続する",
      "AWS RAMを使用して、ネットワークアカウントのサブネットをアプリケーションアカウントへ共有する",
      "CloudFormation StackSetsで同じ構成のVPCを各アカウントへ展開する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS RAM(Resource Access Manager)を使うと、VPCサブネットを他のアカウントやOU、組織全体へ共有できます。アプリケーションアカウントは共有されたサブネットに自分のリソースを直接起動できるため、VPCを複製する必要がなく、IPアドレス設計や管理もネットワークアカウントに一元化できます(共有VPC構成)。AとBはいずれも各アカウントにVPCを作成して相互接続する方式であり、VPCの複製とアドレス範囲の重複しない設計・管理が残るため要件に反します。DのStackSetsは同一構成の展開を自動化するだけで、まさに避けたいアカウントごとのVPC複製を行うことになります。",
    reference: "https://docs.aws.amazon.com/ja_jp/ram/latest/userguide/what-is.html",
  },
  // ===== cloudops-d3-ch03: Systems Managerと運用の自動化 =====
  {
    id: "cloudops-d3-ch03-q01",
    domain: 3,
    topic: "Systems Managerマネージドノード",
    type: "multiple",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、プライベートサブネットに起動した新しいEC2インスタンス(SSM AgentがプリインストールされたAmazon Linux AMIを使用)をAWS Systems Managerで管理しようとしていますが、フリートマネージャーのマネージドノード一覧に表示されません。原因として考えられるものはどれですか。(2つ選択してください)",
    choices: [
      "インスタンスプロファイルにAmazonSSMManagedInstanceCoreなど、Systems Managerとの通信を許可する権限が付与されていない",
      "インスタンスのセキュリティグループでインバウンドのポート22(SSH)が許可されていない",
      "インスタンスにElastic IPアドレスなどのパブリックIPアドレスが割り当てられていない",
      "サブネットからSystems Managerエンドポイントへ到達するアウトバウンドHTTPS経路(NATゲートウェイまたはインターフェイスVPCエンドポイント)がない",
      "インスタンスの起動時にSSH接続用のキーペアが指定されていない",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。インスタンスがマネージドノードとして認識されるには、SSM Agentの稼働に加え、Systems Managerとの通信を許可するIAM権限を持つインスタンスプロファイルと、エージェントからサービスエンドポイントへのアウトバウンドHTTPS(443)の経路が必要です。プライベートサブネットではNATゲートウェイか、ssm・ssmmessages・ec2messagesのインターフェイスVPCエンドポイントを用意します。SSM Agentはエージェント側から接続するpull型のため、Bのようなインバウンドポートの開放は不要です。CのパブリックIPアドレスも、NATやVPCエンドポイント経由の経路があれば不要です。EのキーペアはSSH接続用であり、Systems Managerの管理要件とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/troubleshooting-managed-instances.html",
  },
  {
    id: "cloudops-d3-ch03-q02",
    domain: 3,
    topic: "Run Command",
    type: "single",
    difficulty: "easy",
    question:
      "セキュリティチームから、特定のタグが付与された数百台のEC2インスタンス(すべてSystems Managerのマネージドノード)に対して、調査用のシェルスクリプトを至急1回だけ実行するよう依頼がありました。インスタンスへのSSH接続は社内規程で禁止されています。運用負荷が最小の方法はどれですか。",
    choices: [
      "Systems Manager Run CommandでAWS-RunShellScriptドキュメントを、タグをターゲットに指定して実行する",
      "Systems Manager State Managerで関連付けを作成し、スクリプトを継続的に適用する",
      "踏み台サーバーを一時的に構築し、SSHで各インスタンスへ順番に接続してスクリプトを実行する",
      "スクリプトをユーザーデータに設定し、対象の全インスタンスを再起動する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Run Commandは、SSHや踏み台サーバーを使わずに多数のマネージドノードへコマンドやスクリプトを一括実行する機能です。ターゲットはタグやリソースグループで指定でき、同時実行数やエラーしきい値による段階的な実行制御も可能なため、単発・至急の一斉実行という要件に最適です。BのState Managerはあるべき状態をスケジュールで継続的に適用する機能であり、1回限りの実行には適しません。Cは規程で禁止されているSSHを使ううえ、数百台への手作業は運用負荷が大きすぎます。Dのユーザーデータは既定では初回起動時にのみ実行され、実行のために全台を再起動するのは影響が大きく不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/execute-remote-commands.html",
  },
  {
    id: "cloudops-d3-ch03-q03",
    domain: 3,
    topic: "State Manager",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、すべてのEC2インスタンスでCloudWatchエージェントが承認済みの設定で稼働していることが求められています。しかし、現場での手動変更によって設定がたびたび書き換えられ、そのたびに監視データが欠落する事象が繰り返し発生しています。あるべき構成を継続的に維持し、逸脱を自動的に是正する方法として最も適切なものはどれですか。",
    choices: [
      "逸脱が発覚するたびに、Run Commandで設定を元に戻すコマンドを実行する",
      "State Managerで関連付けを作成し、タグで指定したターゲットへ設定をスケジュール適用する",
      "インベントリで各ノードの設定情報を収集し、差分をレポートする",
      "メンテナンスウィンドウに設定スクリプトを登録し、四半期ごとに実行する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。State Managerは、あるべき状態を関連付け(Association)として定義し、スケジュールに従って繰り返し適用する機能です。手動変更などで構成が逸脱しても次回の適用時に自動的に是正され、タグでターゲットを指定すれば後から起動したインスタンスにも自動で適用されます。AのRun Commandは単発実行のため、発覚のたびに人が対応することになり、継続的な維持はできません。Cのインベントリはソフトウェアや設定の情報収集のみで、是正は行いません。Dは四半期ごとの実行では逸脱が長期間放置されるうえ、メンテナンスウィンドウは作業時間帯の枠であり、状態を維持する仕組みとしてはState Managerが適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-state.html",
  },
  {
    id: "cloudops-d3-ch03-q04",
    domain: 3,
    topic: "Patch Manager",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がSystems Manager Patch Managerでパッチ運用を構成しました。メンテナンスウィンドウでAWS-RunPatchBaselineドキュメントが毎日正常に実行され、コンプライアンスレポートも更新されていますが、数週間経ってもインスタンスに未適用(Missing)のパッチが残ったままです。原因として最も可能性が高いものはどれですか。",
    choices: [
      "インスタンスにPatch Groupタグが設定されていない",
      "メンテナンスウィンドウの実行時間枠が短すぎて処理が打ち切られている",
      "ドキュメントのOperationパラメータがScanのままで、未適用パッチの検出のみが行われている",
      "パッチベースラインの自動承認ルールの待機日数が長く設定されている",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS-RunPatchBaselineの動作はOperationパラメータで決まり、Scanは未適用パッチの検出とコンプライアンス報告のみを行い、パッチは適用しません。実行が成功しレポートも更新されるのにMissingが解消しない場合は、Installではなく Scanで実行され続けているのが定番の原因です。AのPatch Groupタグが未設定でも、OSに応じた既定のベースラインを使って実行自体は行われるため、この状況の直接の説明になりません。Bの時間枠不足であれば実行の失敗や打ち切りが記録されるはずで、毎日正常に完了している状況と矛盾します。Dの待機日数は承認を一定期間遅らせるだけで、数週間も未適用が続く原因としては不自然です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-patch.html",
  },
  {
    id: "cloudops-d3-ch03-q05",
    domain: 3,
    topic: "パッチベースライン",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、開発環境のEC2インスタンスにはリリースされたセキュリティパッチをすぐに適用し、本番環境のインスタンスにはリリースから7日間の検証期間を置いてから適用する方針です。Systems Manager Patch Managerでこの要件を満たす構成として最も適切なものはどれですか。",
    choices: [
      "1つのパッチベースラインを共用し、環境ごとに別々のメンテナンスウィンドウを設定する",
      "開発環境はOperationをInstall、本番環境はOperationをScanに設定して実行する",
      "本番環境のベースラインで全パッチを拒否リストに登録し、7日経過後に手動で解除する",
      "自動承認の待機日数が異なる2つのパッチベースラインを作成し、Patch Groupタグで環境ごとのインスタンスと関連付ける",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。パッチベースラインの自動承認ルールでは、リリースからの経過日数を条件にパッチを自動承認できます。待機0日のベースラインと7日のベースラインを作成し、Patch Groupタグで開発・本番のインスタンスをそれぞれのベースラインに関連付ければ、環境ごとの承認タイミングを自動で使い分けられます。Aのメンテナンスウィンドウは実行する日時の枠を分けるだけで、どのパッチを承認するかは制御できません。Bでは本番がScan(検出のみ)となり、パッチがいつまでも適用されません。Cの手動解除は運用負荷と解除漏れのリスクが大きく、自動承認ルールで実現できる要件に対して不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-patch.html",
  },
  {
    id: "cloudops-d3-ch03-q06",
    domain: 3,
    topic: "Session Manager",
    type: "multiple",
    difficulty: "medium",
    question:
      "セキュリティ監査で、EC2インスタンスへの管理アクセスについて「インターネットからのSSHポート開放を廃止すること」と「誰がどのコマンドを実行したかの操作ログを保存すること」の2点の是正を求められました。対応として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "Session Managerによるシェルアクセスへ移行し、セキュリティグループのインバウンドSSH許可ルールを削除する",
      "VPCフローログを有効化し、セッション中に実行されたコマンドを記録する",
      "Session Managerのセッションログを、Amazon S3またはCloudWatch Logsへ保存するように設定する",
      "AWS CloudTrailの管理イベントで、セッション中のシェル操作の内容を記録する",
      "踏み台サーバーを構築し、SSH鍵を集中管理する運用へ切り替える",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。Session Managerは、SSM Agentのアウトバウンド接続を利用してブラウザやCLIからシェルアクセスを提供するため、インバウンドポートの開放や踏み台サーバーが不要になり、SSH許可ルールを削除できます。さらにセッションの操作ログをS3またはCloudWatch Logsへ保存するよう設定すれば、監査証跡の要件も満たせます。BのVPCフローログはトラフィックのメタデータ(送信元・宛先・ポートなど)の記録であり、コマンドの内容は記録されません。DのCloudTrailはAPI呼び出しの記録で、セッションの開始は記録できてもシェル操作の中身は残りません。Eの踏み台サーバーはSSHポートの開放と鍵管理の負担が残るため、要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html",
  },
  {
    id: "cloudops-d3-ch03-q07",
    domain: 3,
    topic: "Parameter Store",
    type: "single",
    difficulty: "easy",
    question:
      "あるアプリケーションは、環境ごとのデータベース接続文字列とパスワードを暗号化して保管し、EC2上のアプリケーションから参照する必要があります。認証情報の自動ローテーションは不要で、追加コストを最小限に抑えることが求められています。保管先として最も適切なものはどれですか。",
    choices: [
      "AWS Secrets Managerにシークレットとして保存する",
      "Systems Manager Parameter StoreのSecureStringパラメータとして保存する",
      "SSE-KMSで暗号化したAmazon S3バケットにファイルとして保存する",
      "AMIに設定ファイルとして焼き込み、インスタンスの起動時に読み込む",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Parameter StoreのSecureStringはKMSで暗号化して値を保管でき、標準パラメータであれば追加料金なしで利用できます。階層構造で環境ごとの値を整理でき、自動ローテーションが不要でコストを抑えたいという本要件に最適です。AのSecrets Managerは組み込みの自動ローテーションが強みですが、シークレット単位の保管料金が発生するため、ローテーション不要の要件では過剰です。CのS3への保存は暗号化自体は可能ですが、設定値の参照・変更管理の仕組みとしては煩雑で、アクセス制御の作り込みも必要です。Dは認証情報がイメージに固定されて変更のたびにAMIの再作成が必要になるうえ、漏えいのリスクも高い方法です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-parameter-store.html",
  },
  {
    id: "cloudops-d3-ch03-q08",
    domain: 3,
    topic: "S3イベント通知",
    type: "single",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアがAWS CloudFormationで、S3バケットへのオブジェクト作成を契機にAWS Lambda関数を起動するイベント通知を構成しました。スタックのデプロイは成功しましたが、バケットにファイルをアップロードしても関数は一度も起動しません。関数をコンソールから手動でテスト実行すると正常に動作します。原因として最も可能性が高いものはどれですか。",
    choices: [
      "関数の実行ロールにs3:GetObject権限が付与されていない",
      "関数のタイムアウト値が短すぎて、処理が途中で中断されている",
      "S3からの関数実行を許可するリソースベースポリシー(AWS::Lambda::Permission)がテンプレートに定義されていない",
      "S3バケットのバージョニングが有効化されていない",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。S3イベント通知がLambda関数を直接呼び出すには、関数側のリソースベースポリシーでS3からのlambda:InvokeFunctionを許可する必要があります。コンソールで通知を設定すると自動付与されますが、CloudFormationではAWS::Lambda::Permissionを明示的に定義する必要があり、その定義漏れが「アップロードしても一度も起動しない」場合の定番の原因です。Aの実行ロールの権限不足では、関数は起動したうえでオブジェクト取得の処理が失敗するため、一度も起動しない状況とは一致しません。Bのタイムアウトも起動後の問題であり、起動しない原因にはなりません。Dのバージョニングの有無はイベント通知の発火条件とは無関係です。",
    reference: "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-s3.html",
  },
  {
    id: "cloudops-d3-ch03-q09",
    domain: 3,
    topic: "Amazon ECS",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がAmazon ECS(AWS Fargate)でWebアプリケーションを運用しています。開発チームが不具合修正版のコンテナイメージを同じlatestタグでAmazon ECRへプッシュしましたが、稼働中のサービスのタスクには修正が反映されていません。修正版を稼働中のすべてのタスクへ反映させる方法として最も適切なものはどれですか。",
    choices: [
      "サービスで新しいデプロイの強制(force new deployment)を実行し、タスクを置き換える",
      "Amazon ECRのイメージスキャンを実行し、新しいイメージを検証する",
      "サービスの希望タスク数を増やし、新しいタスクを追加で起動する",
      "ロードバランサーのターゲットグループでヘルスチェックを再実行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ECSのタスクは起動時にイメージを取得するため、同じタグのままイメージの中身だけを更新しても稼働中のタスクには反映されません。新しいデプロイの強制を実行すると、サービスがローリング更新ですべてのタスクを起動し直し、その際に最新のイメージが取得されます。BのイメージスキャンはECR上のイメージの脆弱性を検査する機能で、タスクへの反映とは無関係です。Cの希望タスク数の増加では追加分のタスクだけが新しいイメージで起動し、既存のタスクは古いまま残るため不完全です。Dのヘルスチェックはターゲットの健全性を確認する仕組みであり、タスクのイメージを更新する効果はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/update-service.html",
  },
];
