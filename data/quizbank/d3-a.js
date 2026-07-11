// CloudOps問題集 分野3(デプロイ、プロビジョニング、オートメーション)前半 qb-d3-001〜qb-d3-022
export const questions = [
  {
    id: "qb-d3-001",
    domain: 3,
    topic: "CloudFormation変更セット",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のCloudOpsエンジニアが、本番環境で稼働中のCloudFormationスタックのテンプレートを修正しました。更新を適用する前に、どのリソースが変更されるか、また置換(Replacement)が発生するかを確認したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "スタックのドリフト検出を実行して差分を確認する",
      "aws cloudformation validate-templateコマンドでテンプレートを検証する",
      "変更セットを作成し、変更内容を確認してから実行する",
      "別のリージョンに同じテンプレートをデプロイして動作を確認する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。変更セットを作成すると、テンプレートの変更を実際に適用する前に、どのリソースが追加・変更・削除されるか、また置換が発生するかを一覧で確認でき、問題がなければそのまま実行できます。Aのドリフト検出は「現在のテンプレートと実リソースの差分」を調べる機能であり、これから適用する変更の影響は確認できません。Bのvalidate-templateは構文の検証のみで、リソースへの影響は分かりません。Dの別リージョンへのデプロイは動作確認にはなりますが、稼働中スタックの現在の状態に対する変更内容や置換の有無を正確に把握する方法ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html",
  },
  {
    id: "qb-d3-002",
    domain: 3,
    topic: "CloudFormationトラブルシューティング",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが新しいCloudFormationスタックの作成をテストしていますが、EC2インスタンス上のセットアップ処理でスタック作成が失敗するたびに、ロールバックによってリソースがすべて削除されてしまいます。失敗の原因を調査するため、失敗時点までに作成されたリソースを残したいと考えています。どうすべきですか。",
    choices: [
      "スタックの終了保護(削除保護)を有効化してから作成を再実行する",
      "失敗時にプロビジョニング済みリソースを保持するオプション(ロールバックの無効化)を指定して作成する",
      "スタックポリシーですべてのリソースの削除アクションを拒否してから作成する",
      "変更セットを作成し、変更セットの実行としてスタックを作成する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。スタック作成時にロールバックを無効化する(CLIでは--disable-rollback、コンソールではスタック障害時のオプションで正常にプロビジョニングされたリソースを保持)と、作成が失敗してもリソースが削除されずに残るため、EC2インスタンスにログインしてログを確認するなどの原因調査ができます。Aの終了保護はスタックに対する削除操作を防ぐ機能であり、作成失敗時のロールバックによる削除は防げません。Cのスタックポリシーはスタック更新時にリソースを保護する機能で、ロールバック動作には影響しません。Dの変更セットは変更内容の事前確認のための機能で、失敗時のロールバック動作は変わりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/troubleshooting.html",
  },
  {
    id: "qb-d3-003",
    domain: 3,
    topic: "CloudFormationリソースインポート",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、以前に手動で作成したAmazon S3バケットとAmazon DynamoDBテーブルを、今後はCloudFormationのInfrastructure as Codeで一元管理したいと考えています。いずれも稼働中のリソースであり、データを保持したまま削除や再作成を伴わずにスタックの管理下へ取り込む必要があります。最も適切な方法はどれですか。",
    choices: [
      "対象リソースをテンプレートに定義してDeletionPolicyを付与し、リソースのインポート(IMPORTタイプの変更セット)を実行してスタックに取り込む",
      "対象リソースを一度削除し、同じ構成のテンプレートでスタックを新規作成して作り直す",
      "空のスタックを作成後にドリフト検出を実行し、既存リソースを自動的にスタックへ追加する",
      "StackSetsを使用して、既存リソースを複製したスタックインスタンスを作成する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CloudFormationのリソースインポートでは、取り込む各リソースをテンプレートに定義してDeletionPolicy属性を付与し、IMPORTタイプの変更セット(インポート操作)を実行することで、リソースを削除・再作成せずに既存リソースをスタックの管理下へ取り込めます。Bは削除と再作成を伴うためデータ損失やダウンタイムが発生し、要件に反します。Cのドリフト検出はテンプレートと実リソースの差分を報告する機能であり、リソースをスタックに追加する機能ではありません。DのStackSetsは複数アカウント・リージョンへ新しいスタックを展開する仕組みで、既存リソースを管理下へ取り込む用途には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/resource-import.html",
  },
  {
    id: "qb-d3-004",
    domain: 3,
    topic: "CloudFormationロールバックトリガー",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、本番CloudFormationスタックの更新後にアプリケーションのエラー率が上昇する事象が時折発生しています。CloudOpsエンジニアは、スタックの更新中および更新直後の一定時間に特定のCloudWatchアラームがALARM状態になった場合、その更新を自動的にロールバックさせたいと考えています。最も適切な方法はどれですか。",
    choices: [
      "スタック操作のロールバック設定(ロールバックトリガー)で、監視するCloudWatchアラームと監視時間を指定する",
      "EC2インスタンスのCreationPolicyにCloudWatchアラームを指定し、更新の完了を制御する",
      "スタックポリシーに、アラーム発生時にリソースの更新を拒否するステートメントを追加する",
      "更新が失敗した後にContinueUpdateRollbackを実行して、手動でロールバックする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ロールバック設定(ロールバックトリガー)では、スタックの作成・更新時に監視するCloudWatchアラーム(最大5個)と、操作完了後に監視を継続する時間(最大180分)を指定できます。指定したアラームが操作中または監視時間内にALARM状態になると、CloudFormationはスタック操作全体を自動的にロールバックします。BのCreationPolicyはリソース作成時に成功シグナルの受信を待機する属性で、アラームに基づく更新のロールバックには使えません。Cのスタックポリシーは更新から特定リソースを保護する仕組みで、アラームを監視する機能はありません。DのContinueUpdateRollbackはUPDATE_ROLLBACK_FAILED状態からの手動復旧操作であり、自動ロールバックの仕組みではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-rollback-triggers.html",
  },
  {
    id: "qb-d3-005",
    domain: 3,
    topic: "CloudFormation DeletionPolicy",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業の本番CloudFormationスタックにはAmazon RDS DBインスタンスが含まれています。環境の廃止時にはスタックを削除しますが、その際にデータベースのデータを失わないようにテンプレートを構成する必要があります。有効な方法はどれですか。(2つ選択してください)",
    choices: [
      "スタックの終了保護を有効化して削除操作をブロックする",
      "DBインスタンスにDeletionPolicy: Snapshotを設定して削除時にスナップショットを作成する",
      "DBインスタンスにUpdateReplacePolicy: Deleteを設定する",
      "DBインスタンスにDeletionPolicy: Retainを設定してリソース自体を保持する",
      "スタックポリシーでDBインスタンスに対する更新アクションを拒否する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。DeletionPolicy: Snapshotを設定すると、スタック削除時にDBインスタンスの最終スナップショットが作成され、後からデータを復元できます。DeletionPolicy: Retainを設定すると、スタックを削除してもDBインスタンス自体が削除されずに残ります。Aの終了保護はスタックの削除そのものを防ぐ機能であり、スタックを削除するという運用の要件を満たせません。CのUpdateReplacePolicyは更新でリソースが置換される際の古いリソースの扱いを決める属性で、スタック削除時には適用されません。Eのスタックポリシーが保護するのは更新操作であり、スタック削除時のデータ保持には機能しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html",
  },
  {
    id: "qb-d3-006",
    domain: 3,
    topic: "CloudFormation StackSets",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Organizationsで数十のAWSアカウントを管理しています。全メンバーアカウントの複数リージョンに標準のIAMロールとモニタリング設定をデプロイし、組織に新しく追加されたアカウントにも自動的に適用されるようにしたいと考えています。最も運用負荷が低い方法はどれですか。",
    choices: [
      "各アカウントに個別にサインインし、リージョンごとにCloudFormationスタックを手動で作成する",
      "サービスマネージド型アクセス許可のCloudFormation StackSetsを組織を対象に構成し、自動デプロイを有効化する",
      "テンプレートをAWS RAMで全アカウントに共有し、各アカウントの管理者に各自でのデプロイを依頼する",
      "管理アカウントのEventBridgeルールとLambda関数で、各アカウントにスタックを作成する仕組みを自作する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。StackSetsをサービスマネージド型アクセス許可で構成するとAWS Organizationsと統合され、必要なIAMロールが自動的に用意されたうえで、組織やOUを対象に複数アカウント・複数リージョンへ一括デプロイできます。さらに自動デプロイを有効化すれば、新規アカウントが組織に追加された際にもスタックが自動的に展開されます。Aの手動作成はアカウント数とリージョン数に比例して運用負荷が増大します。CのAWS RAMはサブネットなどの対応リソースを共有するサービスで、テンプレートの配布やデプロイの自動化はできません。Dの自作の仕組みはStackSetsと同等の機能を独自開発・保守することになり、運用負荷が高くなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html",
  },
  {
    id: "qb-d3-007",
    domain: 3,
    topic: "CloudFormation cfn-signal",
    type: "multiple",
    difficulty: "hard",
    question:
      "CloudFormationテンプレートでEC2インスタンスを作成し、ユーザーデータスクリプトでアプリケーションをインストールしています。アプリケーションのインストールが正常に完了した場合のみスタック作成を成功として扱い、失敗した場合はスタックをロールバックさせる必要があります。組み合わせて使用すべき要素はどれですか。(2つ選択してください)",
    choices: [
      "EC2インスタンスのリソースにCreationPolicy属性を設定し、タイムアウトと必要なシグナル数を指定する",
      "EC2インスタンスのリソースにUpdatePolicy属性を設定する",
      "ユーザーデータスクリプトの最後でcfn-signalヘルパースクリプトを実行し、処理の成否を通知する",
      "DependsOn属性を使用してアプリケーションのインストール完了を待機させる",
      "ロールバックトリガーとしてCloudWatchアラームをスタックに設定する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。CreationPolicy属性を設定すると、CloudFormationは指定された数の成功シグナルを受信するか、タイムアウトに達するまでリソースの作成完了を待機します。ユーザーデータの最後でcfn-signalを実行してインストールの成否を通知すれば、成功時のみスタック作成が完了し、失敗やタイムアウトの場合はロールバックされます。BのUpdatePolicyはAuto Scalingグループの更新動作などを制御する属性で、作成完了の待機には使いません。DのDependsOnはリソースの作成順序を制御するだけで、インスタンス内部の処理完了は検知できません。Eのロールバックトリガーはアラーム状態を監視する仕組みで、インストール完了のシグナルを待機する要件は満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/cfn-helper-scripts-reference.html",
  },
  {
    id: "qb-d3-008",
    domain: 3,
    topic: "CloudFormation IAMケイパビリティ",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、カスタム名を指定したIAMロールを含むCloudFormationテンプレートをAWS CLIからデプロイしたところ、InsufficientCapabilitiesExceptionエラーで失敗しました。このエラーを解決する方法はどれですか。",
    choices: [
      "create-stackコマンドに--capabilities CAPABILITY_NAMED_IAMを追加して、IAMリソースの作成を明示的に承認する",
      "デプロイを実行するIAMユーザーにAdministratorAccessポリシーを付与する",
      "テンプレートからIAMロールの定義を削除し、ロールは事前に手動で作成しておく",
      "CloudFormationのサービスロールにiam:CreateRole権限を追加する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。IAMリソースを作成するテンプレートをデプロイするには、セキュリティへの影響を理解したことを示すケイパビリティの承認が必要であり、カスタム名付きのIAMリソースを含む場合はCAPABILITY_NAMED_IAMの指定が必須です。このエラーは実行者の権限不足ではなく、承認パラメータの不足が原因です。BのAdministratorAccessの付与は原因への対処になっておらず、過剰な権限付与にもなります。Cのように手動作成へ切り替えるとIaCで管理する利点が失われ、根本解決になりません。Dについて、サービスロールの権限が不足している場合はリソース作成時のエラーになるため、このエラーの解決策ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-iam-template.html",
  },
  {
    id: "qb-d3-009",
    domain: 3,
    topic: "CloudFormationロールバック復旧",
    type: "single",
    difficulty: "hard",
    question:
      "本番のCloudFormationスタックの更新が失敗し、さらに自動ロールバックにも失敗して、スタックがUPDATE_ROLLBACK_FAILED状態になりました。調査の結果、ロールバック対象のリソースの1つがスタック管理外で手動変更されていたことが原因と判明しました。稼働中のリソースへの影響を最小限に抑えながらスタックを操作可能な状態に戻す方法はどれですか。",
    choices: [
      "スタックを削除し、同じテンプレートでスタックを作成し直す",
      "修正済みテンプレートで新しい変更セットを作成して実行する",
      "失敗の原因を解消したうえで、ContinueUpdateRollback(更新ロールバックの続行)を実行する",
      "ドリフト検出を実行して、変更されたリソースをテンプレートの定義に自動修復する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。UPDATE_ROLLBACK_FAILED状態のスタックは、手動変更などの失敗原因を解消してからContinueUpdateRollbackを実行することで、ロールバックを再開してUPDATE_ROLLBACK_COMPLETE状態に復旧できます。復旧を妨げているリソースをスキップする指定も可能です。Aのスタック削除は稼働中のリソースをすべて失うことになり、本番環境への影響が大きすぎます。Bについて、この状態のスタックは更新や変更セットの実行を受け付けないため、先にロールバックを完了させる必要があります。Dのドリフト検出は差分を検出して報告するだけの機能であり、リソースを自動的に修復することはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html",
  },
  {
    id: "qb-d3-010",
    domain: 3,
    topic: "CloudFormationスタックポリシー",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業の本番CloudFormationスタックには、重要なデータを保持するAmazon RDS DBインスタンスが含まれています。運用チームは、スタックの更新操作の際にこのDBインスタンスが誤って置換や削除されることを防ぎたいと考えています。ただし、スタック内の他のリソースは通常どおり更新できる必要があります。どうすべきですか。",
    choices: [
      "スタックの終了保護を有効化して、スタックへの操作を制限する",
      "DBインスタンスにDeletionPolicy: Retainを設定して、リソースが失われないようにする",
      "運用チームのIAMポリシーでcloudformation:UpdateStackアクションを拒否する",
      "DBインスタンスの論理IDに対する更新アクションを拒否するスタックポリシーを適用する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。スタックポリシーを使用すると、スタック更新時に特定のリソース(論理IDで指定)への変更・置換・削除を拒否しつつ、それ以外のリソースの更新は許可できます。保護対象を意図的に更新する場合は一時的なポリシーの上書きという明示的な操作が必要になるため、誤操作を防止できます。Aの終了保護はスタック全体の削除を防ぐ機能で、更新時のリソース置換は防げません。BのDeletionPolicy: Retainは削除時に実リソースを残す設定であり、更新による置換の発生自体は防止できません。CのようにUpdateStackを一律拒否すると、他のリソースの更新もできなくなり要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html",
  },
  {
    id: "qb-d3-011",
    domain: 3,
    topic: "AWS CDK CLI",
    type: "single",
    difficulty: "easy",
    question:
      "開発チームはAWS CDKを使用してTypeScriptでインフラストラクチャを定義しています。セキュリティチームは、デプロイを実行する前に、CDKコードから生成されるCloudFormationテンプレートの内容をレビューしたいと考えています。テンプレートを生成して確認するために実行すべきコマンドはどれですか。",
    choices: [
      "cdk bootstrap",
      "cdk synth",
      "cdk deploy",
      "cdk init",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。cdk synthはCDKアプリケーションのコードを合成(synthesize)し、生成されるCloudFormationテンプレートを出力するコマンドです。デプロイを実行せずにテンプレートの内容を確認できるため、事前レビューの用途に適しています。Aのcdk bootstrapは、アセット保存用のS3バケットやデプロイ用IAMロールなど、デプロイに必要なリソースを対象環境に準備するコマンドです。Cのcdk deployはテンプレートの合成に加えて実際のデプロイまで実行するため、デプロイ前にレビューするという要件に合いません。Dのcdk initは新しいCDKプロジェクトの雛形を作成するコマンドであり、テンプレートの生成とは無関係です。",
    reference: "https://docs.aws.amazon.com/cdk/v2/guide/cli.html",
  },
  {
    id: "qb-d3-012",
    domain: 3,
    topic: "AWS CDK bootstrap",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、既存のAWSアカウントで運用しているAWS CDKアプリケーションを、新しく作成したAWSアカウントの新しいリージョンにデプロイしようとしました。しかしcdk deployを実行すると、デプロイ先の環境がブートストラップされていない旨のエラーが発生して失敗します。最初に実行すべき操作はどれですか。",
    choices: [
      "cdk synthを実行してCloudFormationテンプレートを再生成する",
      "新しいアカウントでCloudFormationのサービスクォータの引き上げを申請する",
      "対象のアカウントとリージョンを指定してcdk bootstrapを実行する",
      "CDKアプリケーションを最新バージョンのCDKライブラリに移行する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。CDKでアセット(Lambdaのコードなど)を含むスタックをデプロイするには、アカウントとリージョンの組み合わせ(環境)ごとに、事前にcdk bootstrapを実行してブートストラップスタック(アセット保存用のS3バケットやデプロイ用のIAMロールなど)を作成しておく必要があります。新しい環境ではこれが未実施のためエラーになります。Aのcdk synthはテンプレートを合成するだけで、デプロイ先環境の準備は行いません。Bのサービスクォータはこのエラーの原因ではありません。Dのライブラリ移行も無関係であり、既存アカウントで動作している以上、アプリケーション自体に問題はありません。",
    reference: "https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html",
  },
  {
    id: "qb-d3-013",
    domain: 3,
    topic: "AWS CDK",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がインフラストラクチャ管理へのAWS CDKの導入を検討しており、CloudOpsエンジニアがチームにCDKの仕組みを説明することになりました。AWS CDKとAWS CloudFormationの関係について、正しい説明はどれですか。",
    choices: [
      "CDKはプログラミング言語のコードからCloudFormationテンプレートを合成し、リソースはCloudFormationスタックとしてデプロイ・管理される",
      "CDKはCloudFormationを使用せず、独自のプロビジョニングエンジンでAWSリソースを直接作成する",
      "CDKはリソースの状態をローカルの独自stateファイルで管理するため、CloudFormationスタックは作成されない",
      "CDKで作成したリソースは、CloudFormationの変更セットやドリフト検出の対象外になる",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS CDKはTypeScriptやPythonなどのプログラミング言語でインフラを定義し、そのコードからCloudFormationテンプレートを合成するフレームワークです。デプロイはCloudFormationスタックとして実行されるため、スタックの状態管理やロールバックなどの仕組みをそのまま利用できます。BとCが誤りである理由は、CDKは独自のプロビジョニングエンジンやstateファイルを持たず、実際のリソース作成と状態管理はCloudFormationが担うためです。Dも誤りで、CDKでデプロイしたスタックも通常のスタックと同様に変更セットやドリフト検出を利用できます。",
    reference: "https://docs.aws.amazon.com/cdk/v2/guide/home.html",
  },
  {
    id: "qb-d3-014",
    domain: 3,
    topic: "Terraform",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業は、AWSインフラストラクチャをTerraformで管理しており、コードはGitリポジトリで共有しています。複数のエンジニアが同時に作業するようになってから、stateファイルの上書きや競合が発生しています。stateを安全にチームで運用するために推奨される方法はどれですか。(2つ選択してください)",
    choices: [
      "stateファイルをGitリポジトリにコミットして、コードと一緒にバージョン管理する",
      "各エンジニアのローカルにあるstateファイルを、定期的に手動でマージする",
      "Amazon S3バケットをリモートバックエンドとして構成し、stateを一元管理する",
      "terraform applyを常に-auto-approveオプション付きで実行して適用時間を短縮する",
      "Amazon DynamoDBテーブルによるstateロックを構成して同時実行を防止する",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。S3バケットをリモートバックエンドとして構成するとstateが一元管理され、チーム全員が常に同じ最新のstateを参照できます。さらにDynamoDBテーブルによるstateロックを構成すると、複数人が同時にapplyを実行してstateが破損することを防げます。AのGitへのコミットは、stateの更新とコミットのタイミングのずれによる競合を解決できず、stateに含まれる機密情報が漏えいするリスクもあるため推奨されません。Bの手動マージは確実性がなく、運用負荷も高くなります。Dの-auto-approveは適用前の確認プロンプトを省略するオプションであり、stateの競合防止とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/introduction.html",
  },
  {
    id: "qb-d3-015",
    domain: 3,
    topic: "EC2 Image Builderパイプライン",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、毎月のOSパッチを適用した社内標準AMI(ゴールデンAMI)を運用担当者が手動で作成しており、作業ミスと運用負荷が課題になっています。AMIのビルド、テスト、配布のプロセスを最小限の運用負荷で自動化する方法はどれですか。",
    choices: [
      "AWS Backupのバックアッププランを構成して、毎月AMIを自動作成する",
      "AWS Systems Manager Run Commandで毎月パッチ適用を実行し、その後手動でAMIを作成する",
      "EC2 Auto Scalingグループの起動テンプレートを、毎月新しいバージョンに手動で更新する",
      "EC2 Image Builderでイメージパイプラインを作成し、ビルドスケジュールを毎月に設定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。EC2 Image Builderは、ベースイメージへのパッチ適用やソフトウェアのインストール(ビルドコンポーネント)、作成したイメージのテスト、対象先への配布までをイメージパイプラインとして定義し、スケジュールに従って自動実行できるマネージドサービスです。毎月のゴールデンAMI作成を人手を介さずに自動化でき、運用負荷を最小化できます。AのAWS Backupは既存リソースのバックアップを取得するサービスで、パッチを適用した新しいイメージのビルドやテストはできません。BはRun Commandでパッチ適用を自動化しても、AMI作成以降の工程が手動のまま残ります。Cの起動テンプレートの更新は新しいAMIを参照させる作業にすぎず、AMI自体の作成は自動化されません。",
    reference:
      "https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html",
  },
  {
    id: "qb-d3-016",
    domain: 3,
    topic: "EC2 Image Builderコンポーネント",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はEC2 Image BuilderのパイプラインでカスタムAMIを毎週作成しています。先週、必須のセキュリティエージェントが正常に起動しないAMIがそのまま配布され、障害につながりました。問題のあるAMIが今後配布される前に検出できるようにする方法はどれですか。",
    choices: [
      "配布後に起動したインスタンスをAWS Configルールで評価し、非準拠を検出する",
      "イメージレシピにテストコンポーネントを追加し、ビルド後のイメージでエージェントの起動を検証する",
      "Amazon CloudWatch Syntheticsのカナリアを作成して、エージェントの状態を監視する",
      "AMIにビルド日時のタグを付与し、配布前の手動確認を運用ルールとして定める",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EC2 Image Builderのパイプラインでは、ビルドフェーズの後にテストフェーズが実行され、テストコンポーネントを定義しておくと、作成したイメージから起動したインスタンス上で検証を行えます。エージェントの起動確認をテストコンポーネントにすれば、テストに失敗したイメージは配布されないため、問題のあるAMIの流出を防げます。AのAWS Configによる評価は配布後・起動後の検出であり、配布そのものを防げません。CのSyntheticsはエンドポイントの外形監視を行う機能で、AMIの配布前検証には適しません。Dの手動確認は作業ミスの余地が残り、自動化による再発防止になりません。",
    reference:
      "https://docs.aws.amazon.com/imagebuilder/latest/userguide/how-image-builder-works.html",
  },
  {
    id: "qb-d3-017",
    domain: 3,
    topic: "EC2 Image Builder配布設定",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、EC2 Image Builderのパイプラインで作成するゴールデンAMIを、組織内の複数のAWSアカウントと3つのリージョンで利用しています。現在はビルドが完了するたびに手動でAMIをコピーし、共有設定を行っているため、これを自動化したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "ビルド完了イベントを契機にCopyImage APIを呼び出すLambda関数を自作する",
      "AMIを利用する各アカウント・各リージョンで、同じレシピのパイプラインを個別に実行する",
      "パイプラインのディストリビューション設定で、配布先のリージョンと共有先のアカウントを指定する",
      "AWS RAMのリソース共有にAMIを追加して、組織全体と共有する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2 Image Builderのディストリビューション設定では、作成したイメージの配布先リージョンと、起動許可を付与または配布する対象のAWSアカウントを指定でき、パイプラインが実行されるたびにコピーと共有が自動的に行われます。Aの自作Lambda関数でも実現は可能ですが、同等の標準機能が存在するため、開発・保守の負荷が無駄になります。Bのようにアカウントごとにパイプラインを実行すると、ビルドが重複するうえ、イメージの一貫性を保ちにくくなります。DのAWS RAMではAMI自体を共有リソースとして追加することはできず、AMIの共有は起動許可の仕組みで行います。",
    reference:
      "https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-distribution-settings.html",
  },
  {
    id: "qb-d3-018",
    domain: 3,
    topic: "AMI管理",
    type: "single",
    difficulty: "easy",
    question:
      "CloudOpsエンジニアが、東京リージョンで作成したカスタムAMIを使用して大阪リージョンでEC2インスタンスを起動しようとしましたが、大阪リージョンのAMI一覧に該当のAMIが表示されません。大阪リージョンでこのAMIからインスタンスを起動するにはどうすべきですか。",
    choices: [
      "AMIを大阪リージョンにコピーし、コピーで作成された新しいAMI IDを使用してインスタンスを起動する",
      "AMIの起動許可の設定に大阪リージョンを追加する",
      "AMIをパブリックに公開して、すべてのリージョンから参照できるようにする",
      "AMIの基になったEBSスナップショットを大阪リージョンから直接参照してインスタンスを起動する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AMIはリージョン単位のリソースであり、作成したリージョン内でのみ使用できます。別のリージョンで使用するには、CopyImage(AMIのコピー)で対象リージョンへコピーし、コピー先で発行された新しいAMI IDを指定してインスタンスを起動します。Bの起動許可は、AMIを共有する相手のAWSアカウントを制御する仕組みであり、リージョンを追加する設定は存在しません。Cのようにパブリックに公開しても、公開されるのは同じリージョン内であり、他のリージョンから使用できるようにはなりません。Dについて、EBSスナップショットも同様にリージョン単位のリソースであり、別リージョンから直接参照することはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/CopyingAMIs.html",
  },
  {
    id: "qb-d3-019",
    domain: 3,
    topic: "AMIクロスアカウント共有",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業のCloudOpsエンジニアが、カスタマーマネージドAWS KMSキーで暗号化されたEBSスナップショットに基づくカスタムAMIを、同一リージョンの別のAWSアカウントで利用できるようにする必要があります。実行すべき操作はどれですか。(2つ選択してください)",
    choices: [
      "AMIの起動許可に利用側アカウントのアカウントIDを追加する",
      "AMIとその基になるスナップショットをパブリックに公開する",
      "スナップショットの暗号化キーをAWSマネージドキー(aws/ebs)に変更してから共有する",
      "暗号化に使用したKMSキーのキーポリシーで、利用側アカウントにキーの使用を許可する",
      "CopyImage APIを使用して、利用側アカウントにAMIを直接コピーする",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。暗号化されたAMIを別のアカウントと共有するには、AMIの起動許可に対象アカウントIDを追加することに加えて、ボリュームの復号に必要なKMSキーの使用をキーポリシー(またはグラント)で対象アカウントに許可する必要があります。どちらか一方だけではインスタンスを起動できません。Bについて、暗号化されたスナップショットに基づくAMIはパブリックに公開できず、要件に対して過剰な共有にもなります。CのAWSマネージドキーは他のアカウントに使用を許可できないため、共有の用途には使えません。EのCopyImageは自アカウント内でコピーを作成する操作であり、他のアカウントへ直接コピーすることはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/sharingamis-explicit.html",
  },
  {
    id: "qb-d3-020",
    domain: 3,
    topic: "AWS RAM",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Organizationsを使用しており、ネットワークチームが一元管理するVPCのサブネット上に、複数のメンバーアカウントがそれぞれのEC2インスタンスを起動できるようにしたいと考えています。各アカウントにVPCやサブネットを重複して作成せずに実現する方法はどれですか。",
    choices: [
      "各アカウントに同一CIDRのVPCを作成し、VPCピアリングで相互に接続する",
      "AWS Transit Gatewayを構成して、各アカウントのVPCを相互に接続する",
      "AWS PrivateLinkを使用して、ネットワークアカウントのサービスを各アカウントに公開する",
      "AWS RAMを使用して、対象のサブネットをメンバーアカウントと共有する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS RAMによるVPC共有では、VPCを所有するアカウントがサブネットを組織内の他のアカウントと共有でき、共有先のアカウントは自分のリソース(EC2インスタンスなど)をそのサブネット内に直接起動できます。VPCを一元管理しながら、アカウントごとのVPCの重複を排除できます。AとBはいずれも各アカウントに別のVPCを作成して接続する方式であり、同一のサブネット上に起動するという要件を満たしません(そもそも同一CIDRのVPC同士はピアリングできません)。CのPrivateLinkは特定のサービスエンドポイントを他のVPCに公開する仕組みであり、サブネットそのものを共有することはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-sharing.html",
  },
  {
    id: "qb-d3-021",
    domain: 3,
    topic: "Service Catalog起動制約",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業では、開発者が承認済みのCloudFormationテンプレートから標準環境をセルフサービスでプロビジョニングできるようにしたいと考えています。ただし、セキュリティ要件により、開発者自身にはEC2やRDSなどの基盤リソースを直接作成するIAM権限を付与できません。どうすべきですか。",
    choices: [
      "開発者にPowerUserAccessを付与し、Service Control Policy(SCP)で作成可能なリソースを制限する",
      "AWS Service Catalogの製品としてテンプレートを登録し、プロビジョニング用IAMロールを指定した起動制約を設定して開発者にアクセスを許可する",
      "開発者にCloudFormationスタックの作成権限と必要なリソースの作成権限を直接付与し、CloudTrailで操作を監査する",
      "CloudFormation StackSetsを使用して、管理者が各開発者のアカウントへ標準環境を一括デプロイする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Service Catalogでは、承認済みテンプレートを製品としてポートフォリオに登録し、起動制約でプロビジョニング用のIAMロールを指定できます。製品の起動時はこのロールの権限でリソースが作成されるため、開発者には製品を起動する権限だけを与えればよく、基盤リソースを直接作成する権限は不要になります。AとCはいずれも開発者自身に広範なリソース作成権限を付与する方式であり、直接の作成権限を与えられないという要件に反します。DのStackSetsは管理者主導の一括デプロイの仕組みであり、開発者が必要なタイミングで自ら環境を起動するセルフサービスの要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/servicecatalog/latest/adminguide/constraints-launch.html",
  },
  {
    id: "qb-d3-022",
    domain: 3,
    topic: "Service Catalogポートフォリオ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のプラットフォームチームは、社内標準のアーキテクチャを定義したCloudFormationテンプレート群を整備し、AWS Organizations内の複数アカウントの利用者に提供したいと考えています。テンプレートのバージョンを管理し、利用者が起動できる製品を統制する必要があります。最も適切な方法はどれですか。",
    choices: [
      "テンプレートをAmazon S3で公開し、各利用者がCloudFormationコンソールから手動でデプロイする",
      "AWS Configのコンフォーマンスパックとして標準テンプレートを全アカウントに配布する",
      "AWS Service Catalogでポートフォリオを作成して製品とバージョンを管理し、組織内のアカウントと共有する",
      "AWS RAMのリソース共有を使用して、CloudFormationテンプレートを各アカウントに配布する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Service Catalogは、CloudFormationテンプレートなどを製品としてカタログ化し、ポートフォリオ単位のアクセス制御、製品バージョンの管理、AWS Organizations内のアカウントへのポートフォリオ共有ができるサービスであり、標準化と統制の要件に合致します。AのS3での公開は配布はできても、利用できる製品やバージョンの統制ができません。BのAWS Configコンフォーマンスパックは、リソースの準拠状況を評価するConfigルール群を配布する仕組みであり、環境をプロビジョニングするテンプレートの提供には使えません。DのAWS RAMはサブネットなどの対応リソースを共有するサービスで、CloudFormationテンプレートの配布には対応していません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/servicecatalog/latest/adminguide/introduction.html",
  },
];
