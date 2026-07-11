// CloudOps教材 分野4(セキュリティとコンプライアンス)の確認問題
export const questions = [
  // ===== cloudops-d4-ch01: IAM運用とマルチアカウント統制 =====
  {
    id: "cloudops-d4-ch01-q01",
    domain: 4,
    topic: "IAMポリシー評価",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のCloudOpsエンジニアが、Amazon EC2上のアプリケーションからAmazon S3バケットのオブジェクト取得がAccessDeniedエラーで失敗するという報告を受けました。インスタンスにはIAMロールが割り当てられ、ロールにはs3:GetObjectとs3:ListBucketを許可するポリシーがアタッチされており、アプリケーションはロールの一時認証情報を正常に取得できています。最も可能性が高い原因はどれですか。",
    choices: [
      "バケットでS3ブロックパブリックアクセスが有効になっているため",
      "バケットポリシーまたはSCPに、条件に一致しないアクセスを拒否する明示的なDenyが存在するため",
      "ロールの信頼ポリシーでec2.amazonaws.comからの引き受けが許可されていないため",
      "バケットのバージョニングが一時停止されているため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。IAMのポリシー評価では、アイデンティティベースポリシーのAllowよりも、バケットポリシーやSCPなどのどこかに存在する明示的なDenyが常に優先されます。ロール側で許可されているのに拒否される場合は、リソースポリシーやSCPのDeny条件(特定のVPCエンドポイントや送信元IP以外を拒否する設定など)を疑うのが定石です。Aのブロックパブリックアクセスは匿名・パブリックなアクセスを制御する機能で、IAMロールによる認証済みアクセスは拒否しません。Cは、一時認証情報を取得できている時点でロールの引き受けは成功しており、原因になりません。Dのバージョニングはアクセス可否とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
  },
  {
    id: "cloudops-d4-ch01-q02",
    domain: 4,
    topic: "IAMポリシーシミュレーター",
    type: "single",
    difficulty: "easy",
    question:
      "CloudOpsエンジニアが、新しく作成したIAMポリシーを適用した複数のIAMロールについて「必要な操作が拒否される」という報告を受けました。本番リソースに対して実際のAPIリクエストを発行せずに、どのアクションがどのポリシーによって拒否されるのかを特定したいと考えています。最も適切なツールはどれですか。",
    choices: [
      "AWS Configの設定タイムラインでポリシー変更の履歴を確認する",
      "AWS CloudTrailのイベント履歴で拒否されたAPI呼び出しを検索する",
      "IAMポリシーシミュレーターで対象ロールのアクションを評価する",
      "AWS Trusted Advisorのセキュリティチェックを実行する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。IAMポリシーシミュレーターを使うと、実際のAWSリソースにリクエストを送らずに、指定したユーザーやロールに対するポリシー評価(許可/拒否の結果と、拒否の原因になったステートメント)を検証できます。適用前のポリシーの動作確認にも使えます。AのAWS Configはリソース構成の記録と準拠評価のサービスで、ポリシー評価の再現はできません。BのCloudTrailは実際に発生したAPI呼び出しの記録であり、検証のために実リクエストを発行する必要があります。DのTrusted Advisorはベストプラクティスからの乖離を確認するサービスで、個別アクションのアクセス可否は検証できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_testing-policies.html",
  },
  {
    id: "cloudops-d4-ch01-q03",
    domain: 4,
    topic: "CloudTrail",
    type: "single",
    difficulty: "medium",
    question:
      "セキュリティ監査で、本番環境のセキュリティグループに0.0.0.0/0からのSSH接続を許可するルールが約4か月前に追加されていたことが判明しました。組織では全リージョンを対象とする証跡が構成され、ログはS3バケットに配信されています。しかし、CloudTrailコンソールのイベント履歴には該当のイベントが表示されません。変更の実行者と日時を特定する方法として最も適切なものはどれですか。",
    choices: [
      "証跡がS3バケットに配信したログファイルをAmazon Athenaでクエリする",
      "CloudTrail Insightsを有効化して過去の異常なAPIアクティビティを分析する",
      "VPCフローログを分析して変更操作の送信元を特定する",
      "IAM認証情報レポートを生成してユーザーの操作履歴を確認する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CloudTrailコンソールのイベント履歴で確認できるのは過去90日分の管理イベントのみです。約4か月前の操作を調べるには、証跡(トレイル)がS3バケットに配信したログファイルをAmazon Athenaでテーブルとして定義し、クエリで検索するのが定番の方法です。BのCloudTrail Insightsは異常なAPI呼び出し量を検出する機能で、過去の個別イベントを遡って表示するものではありません。CのVPCフローログはネットワークトラフィックの記録であり、API操作は記録されません。DのIAM認証情報レポートはパスワードやアクセスキーなど認証情報の状態一覧で、操作履歴は含まれません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
  },
  {
    id: "cloudops-d4-ch01-q04",
    domain: 4,
    topic: "IAM Access Analyzer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のセキュリティ監査で、組織外部のAWSアカウントやインターネットからアクセス可能な状態になっているS3バケット・IAMロール・KMSキーを網羅的に洗い出し、今後も新たな外部共有を継続的に検出できる仕組みを整備するよう求められました。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "AWS CloudTrailのログを毎日レビューして外部アカウントからのアクセスを確認する",
      "IAMポリシーシミュレーターですべてのリソースポリシーを定期的に検証する",
      "Amazon Inspectorでリソースのネットワーク到達可能性をスキャンする",
      "IAM Access Analyzerで組織を信頼ゾーンとするアナライザーを作成し、検出結果をモニタリングする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。IAM Access Analyzerの外部アクセスアナライザーは、S3バケット・IAMロール・KMSキーなどのリソースポリシーを論理的に分析し、信頼ゾーン(アカウントまたは組織)の外部からアクセス可能なリソースを検出結果として継続的に報告します。一度作成すれば自動で分析が続くため、運用負荷が最小です。AのCloudTrailレビューは実際に発生したアクセスの事後確認であり、共有状態の網羅的な棚卸しには向かず手作業も膨大です。Bのポリシーシミュレーターは特定プリンシパルの評価検証が目的で、全リソースの外部共有の洗い出しには不向きです。CのInspectorはソフトウェア脆弱性やネットワーク露出を扱うもので、リソースポリシーの共有分析は行いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/what-is-access-analyzer.html",
  },
  {
    id: "cloudops-d4-ch01-q05",
    domain: 4,
    topic: "IAM条件キー(MFA)",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、機密データを保存するAmazon S3バケットに対するオブジェクト削除操作を、MFA認証を完了したプリンシパルにのみ許可することがセキュリティ基準で定められています。IAMポリシーで実現する方法として最も適切なものはどれですか。",
    choices: [
      "アカウントのパスワードポリシーで、削除操作の実行前にMFAを要求するよう設定する",
      "aws:SecureTransport条件キーがtrueの場合のみ削除操作を許可する条件を設定する",
      "aws:MultiFactorAuthPresent条件キーがtrueの場合のみ削除操作を許可する条件を設定する",
      "SCPですべてのIAMユーザーにMFAデバイスの登録を強制する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。IAMポリシーの条件キーaws:MultiFactorAuthPresentを使うと、MFA認証済みの一時認証情報によるリクエストかどうかで許可・拒否を制御できます。MFA済みの場合のみ削除を許可する、またはMFA未認証の削除を明示的に拒否するのが定番パターンです。Aのパスワードポリシーはサインインパスワードの文字数や有効期間を定める機能で、個別のAPI操作の条件にはできません。Bのaws:SecureTransportはリクエストがHTTPS(TLS)経由かどうかを判定する条件キーで、MFAとは無関係です。DのSCPはAPIアクションの上限を定めるガードレールであり、MFAデバイスの登録自体を強制する機能ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements_condition.html",
  },
  {
    id: "cloudops-d4-ch01-q06",
    domain: 4,
    topic: "パスワードポリシーとMFA",
    type: "multiple",
    difficulty: "easy",
    question:
      "セキュリティ監査で、IAMユーザーのパスワードが短く単純で、同じパスワードが再利用されていることが指摘されました。CloudOpsエンジニアがIAMの機能を用いて認証を強化する方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "アカウントのパスワードポリシーで最小文字数・文字種の必須化・再利用の禁止を設定する",
      "SCPでIAMユーザーのパスワードの複雑さ要件を設定する",
      "Amazon GuardDutyでパスワードの強度を継続的に評価する",
      "すべてのIAMユーザーにMFAデバイスを登録させ、サインインにMFAを適用する",
      "チーム共用のIAMユーザーに集約してパスワード管理を一元化する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。IAMのアカウントパスワードポリシーでは、最小文字数・大文字小文字や数字記号の必須化・再利用の禁止・有効期間などを設定でき、指摘事項に直接対応できます。加えて、全IAMユーザーへのMFA(仮想MFAデバイスやFIDOセキュリティキーなど)の適用は認証強化の基本です。BのSCPはAPIアクションを制限するガードレールで、パスワードの品質を設定する機能はありません。CのGuardDutyは脅威検出サービスであり、パスワード強度の評価は行いません。Eの共用IAMユーザーは誰が操作したかの追跡可能性を失わせるアンチパターンで、監査上むしろ問題になります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html",
  },
  {
    id: "cloudops-d4-ch01-q07",
    domain: 4,
    topic: "SCP",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Organizations配下のメンバーアカウントで、AdministratorAccessポリシーがアタッチされたIAMロールを使用するCloudOpsエンジニアが、ap-southeast-1リージョンでEC2インスタンスを起動しようとしたところ、UnauthorizedOperationエラーが発生しました。ap-northeast-1リージョンでは同じ操作が成功します。最も可能性が高い原因はどれですか。",
    choices: [
      "アカウントがEC2のサービスクォータ(実行中インスタンス数)の上限に達しているため",
      "OUにアタッチされたSCPが、承認済みリージョン以外でのAPI操作を拒否しているため",
      "IAMポリシーはリージョンごとに作成する必要があり、ap-southeast-1用のポリシーがないため",
      "ap-southeast-1がオプトインリージョンであり、アカウントで有効化されていないため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。管理者権限のIAMポリシーを持っていても、OrganizationsのSCPで拒否された操作は実行できません。特定リージョンでのみ失敗する場合は、aws:RequestedRegion条件で承認済みリージョン以外の操作を拒否するSCP(リージョンガードレール)が典型的な原因です。SCPはIAMポリシーのAllowより優先して権限の上限を定めます。Aのサービスクォータ超過の場合は権限エラーではなく上限超過を示すエラーになります。CのIAMポリシーは通常すべてのリージョンに対して評価され、リージョンごとの作成は不要です。Dのap-southeast-1(シンガポール)はデフォルトで有効なリージョンであり、有効化の作業は不要です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "cloudops-d4-ch01-q08",
    domain: 4,
    topic: "SCP",
    type: "single",
    difficulty: "hard",
    question:
      "AWS Organizationsの管理者が、メンバーアカウントの開発者にAmazon S3の利用を許可するため、s3:*をAllowするSCPを開発者のアカウントが属するOUにアタッチしました。しかし、開発者のIAMユーザーはS3バケットを一覧表示できません。このユーザーにはIAMポリシーが1つもアタッチされていません。原因はどれですか。",
    choices: [
      "SCPはメンバーアカウントには適用されず、管理アカウントにのみ適用されるため",
      "SCPはIAMロールにのみ適用され、IAMユーザーには適用されないため",
      "デフォルトのFullAWSAccessポリシーをOUからデタッチしていないため",
      "SCPはアクセス許可を付与せず、IAMポリシーによる明示的な許可が別途必要であるため",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。SCPはアカウント内のプリンシパルが使用できる権限の上限を定めるガードレールであり、それ自体がアクセス許可を付与することはありません。SCPでs3:*が許可されていても、実際に操作するにはユーザーやロールにIAMポリシーで明示的なAllowが必要です。本ケースではIAMポリシーが何もアタッチされていないため、暗黙的な拒否になります。Aは逆で、SCPが適用されないのは管理アカウントであり、メンバーアカウントには適用されます。BのSCPはメンバーアカウント内のIAMユーザーとロールの両方に適用されます。CのFullAWSAccessは上限として全操作を許可するデフォルトSCPで、デタッチする必要はなく、外すとかえって操作が拒否されます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "cloudops-d4-ch01-q09",
    domain: 4,
    topic: "IAM Identity Center",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では従業員が10個のAWSアカウントを日常的に利用しており、現在はアカウントごとにIAMユーザーを作成しているため、パスワードとアクセス権の管理が煩雑になっています。社内のIDプロバイダーとしてMicrosoft Entra IDを利用中です。すべてのアカウントへのシングルサインオンを最小の運用負荷で実現する方法はどれですか。",
    choices: [
      "AWS IAM Identity CenterをEntra IDと連携させ、許可セットで各アカウントへのアクセスを割り当てる",
      "各アカウントにSAML IDプロバイダーを個別に設定し、フェデレーション用IAMロールをアカウントごとに管理する",
      "全アカウントに共通のIAMユーザーを作成し、同一のパスワードを設定して運用する",
      "Amazon Cognitoユーザープールを作成し、従業員のサインインを一元管理する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS IAM Identity Centerは、組織内の複数アカウントへの人のアクセスを一元管理するサービスです。Microsoft Entra IDなどの外部IdPとSAML/SCIMで連携し、許可セットを使って各アカウントへの一時的なロールベースアクセスを割り当てられるため、アカウントごとのIAMユーザーと長期認証情報の管理が不要になります。Bの各アカウントへの個別フェデレーション設定も技術的には可能ですが、アカウント数に比例して設定と保守の負荷が増え、要件に反します。Cの共用IAMユーザーとパスワードの使い回しは追跡可能性を失うアンチパターンです。DのCognitoはアプリケーションのエンドユーザー認証向けのサービスで、従業員のAWSアカウントアクセス管理には適しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/what-is.html",
  },
  {
    id: "cloudops-d4-ch01-q10",
    domain: 4,
    topic: "Trusted AdvisorとConfig",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が年次セキュリティ監査を控えています。CloudOpsエンジニアは、公開状態のS3バケットや0.0.0.0/0で開放されたセキュリティグループなどの既知のリスク設定を確認して是正するとともに、社内セキュリティ基準への準拠状況を今後も継続的に評価できるようにしたいと考えています。適切な方法はどれですか。(2つ選択してください)",
    choices: [
      "AWS CloudTrail Insightsを有効化して異常なAPIアクティビティを検出する",
      "AWS Trusted Advisorのセキュリティチェックの結果を確認し、指摘された項目を修復する",
      "AWS X-Rayでサービス間の通信を可視化して異常を分析する",
      "Amazon Detectiveで検出結果の調査グラフを作成する",
      "AWS Configのコンフォーマンスパックをデプロイして準拠状況を継続的に評価する",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。Trusted Advisorのセキュリティチェックは、オープンアクセスを許可するS3バケットや特定ポートを0.0.0.0/0に開放したセキュリティグループ、ルートユーザーのMFA未設定などの既知のリスクを自動検出するため、監査前の確認と是正に適します。また、AWS Configのコンフォーマンスパックは、Configルールと修復アクションをまとめてデプロイし、社内基準への準拠を継続評価・スコア化できます。AのCloudTrail Insightsは異常なAPI呼び出し量の検出が目的で、設定不備の評価はできません。CのX-Rayは分散トレーシングのサービスです。DのDetectiveは検出結果の根本原因を調査するためのサービスで、準拠状況の継続評価には使いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/conformance-packs.html",
  },

  // ===== cloudops-d4-ch02: データ保護と検出的統制 =====
  {
    id: "cloudops-d4-ch02-q01",
    domain: 4,
    topic: "KMS",
    type: "single",
    difficulty: "medium",
    question:
      "あるアプリケーションが、SSE-KMS(カスタマーマネージドキー)で暗号化されたAmazon S3オブジェクトのダウンロード時にAccessDeniedエラーを受け取ります。アプリケーションのIAMロールにはs3:GetObjectとs3:ListBucketが許可されており、同じバケット内の暗号化されていないオブジェクトは正常に取得できます。最も可能性が高い原因はどれですか。",
    choices: [
      "ロールにs3:GetObjectVersion権限が不足しているため",
      "バケットポリシーのaws:SecureTransport条件によってリクエストが拒否されているため",
      "暗号化に使用されたKMSキーに対するkms:Decryptがロールに許可されていないため",
      "オブジェクトの所有者が別のアカウントであり、アクセス許可が付与されていないため",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。SSE-KMSで暗号化されたオブジェクトの取得には、s3:GetObjectに加えて、暗号化に使用されたKMSキーに対するkms:Decrypt権限が必要です。暗号化されていないオブジェクトは取得できていることから、S3側の権限は満たされており、KMS権限の不足が原因と切り分けられます。AのGetObjectVersionは特定バージョンを指定して取得するための権限で、この事象とは無関係です。Bのaws:SecureTransport条件による拒否であれば、暗号化の有無に関係なくすべての取得が失敗するはずです。Dのオブジェクト所有者の問題も同様に、未暗号化オブジェクトの取得が成功している事実と矛盾します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/UsingKMSEncryption.html",
  },
  {
    id: "cloudops-d4-ch02-q02",
    domain: 4,
    topic: "KMS(スナップショット共有)",
    type: "single",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアが、本番アカウントでカスタマーマネージドキーにより暗号化されたAmazon EBSスナップショットをDR用アカウントに共有しました。DRアカウント側でスナップショットは一覧に表示されますが、そこからボリュームを作成しようとすると失敗します。適切な解決策はどれですか。",
    choices: [
      "スナップショットを暗号化なしの状態でコピーしてから再共有する",
      "暗号化に使用したカスタマーマネージドキーのキーポリシーで、DRアカウントにキーの使用を許可する",
      "DRアカウントでEBSのデフォルト暗号化を有効化する",
      "DRアカウントで同じキーマテリアルを持つKMSキーを新規作成する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。暗号化スナップショットを共有しても、共有先がボリュームを作成するには、暗号化に使われたカスタマーマネージドキーのキーポリシーで共有先アカウントにキーの使用(kms:Decrypt、kms:DescribeKey、kms:CreateGrantなど)を許可する必要があります。スナップショットの共有設定とキーの使用許可は別々に構成します。Aの暗号化なしのコピーはデータ保護要件に反し、根本対処ではありません。CのDRアカウント側のデフォルト暗号化設定は、共有元キーを使用できるかどうかとは無関係です。Dのように別アカウントでキーを新規作成しても、スナップショットは元のキーを参照しているため復号できません。なお、AWSマネージドキー(aws/ebs)で暗号化されたスナップショットはそもそも共有できない点も重要です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-policies.html",
  },
  {
    id: "cloudops-d4-ch02-q03",
    domain: 4,
    topic: "KMS(キーの状態)",
    type: "single",
    difficulty: "medium",
    question:
      "暗号化されたEBSルートボリュームを持つAmazon EC2インスタンスを起動すると、インスタンスがすぐに停止してしまいます。AWS CloudTrailを確認すると、ボリュームの暗号化に使用されているKMSキーに関連するAPI呼び出しがエラーになっていました。最も可能性が高い原因はどれですか。",
    choices: [
      "インスタンスプロファイルのIAMロールにkms:Decrypt権限がないため",
      "ボリュームのIOPSがベースライン上限に達しているため",
      "AMIが別リージョンのKMSキーを参照しているため",
      "ボリュームの暗号化に使用されたKMSキーが無効化または削除保留になっているため",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。EBSボリュームの暗号化に使用したKMSキーが無効化または削除保留になると、EBSはデータキーを復号できなくなり、暗号化ボリュームを使用するインスタンスの起動やボリュームのアタッチが失敗します。CloudTrailにKMS関連のエラーが記録されている点も裏付けです。対処はキーの再有効化(削除保留の場合はキャンセル)です。Aについて、EBSの暗号化・復号はEC2サービスがグラント経由でキーを使用する仕組みのため、インスタンスプロファイルの権限は関与しません。BのIOPS上限は性能低下の原因にはなっても、起動直後の停止やKMSのエラーにはつながりません。Cは同一リージョン内の既存ボリュームから起動している限り該当しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-state.html",
  },
  {
    id: "cloudops-d4-ch02-q04",
    domain: 4,
    topic: "KMS(キーポリシーとグラント)",
    type: "multiple",
    difficulty: "hard",
    question:
      "セキュリティチームが管理するカスタマーマネージドキーの使用時にアクセス拒否が発生しており、別チームのアプリケーション(Amazon EC2上でIAMロールを使用)がこのキーで暗号化・復号できるようにアクセス許可を構成する必要があります。有効な方法はどれですか。(2つ選択してください)",
    choices: [
      "キーポリシーにアプリケーションのIAMロールをプリンシパルとして追加し、必要なKMSアクションを許可する",
      "S3バケットポリシーにkms:Decryptを許可するステートメントを追加する",
      "対象キーに対するグラントを作成し、IAMロールにキーの使用を委任する",
      "IAMロールにAdministratorAccess管理ポリシーをアタッチする",
      "AWS RAMを使用してKMSキーを別チームのIAMロールと共有する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。カスタマーマネージドキーの使用許可は、(1)キーポリシーに対象プリンシパルと許可アクション(kms:Encrypt、kms:Decryptなど)を直接記述する方法と、(2)グラントを作成して一時的な使用許可を委任する方法で構成できます。キーポリシーがアカウントへの委任を含む場合はIAMポリシーの併用も可能です。BのS3バケットポリシーにはS3のアクションしか記述できず、KMSの権限は付与できません。Dは、キーポリシーがIAMポリシーへの委任を許可していなければAdministratorAccessでもキーを使用できず、過剰権限のアンチパターンでもあります。EのAWS RAMはサブネットやライセンスなどの共有サービスで、KMSキーの共有はサポートしていません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/grants.html",
  },
  {
    id: "cloudops-d4-ch02-q05",
    domain: 4,
    topic: "ACM(証明書更新)",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、Application Load Balancerで使用中のACMパブリック証明書について、有効期限が近づいているという通知を受け取りました。この証明書はEメール検証で発行されたものです。今後、証明書更新に伴う手作業を最小化する方法として最も適切なものはどれですか。",
    choices: [
      "DNS検証で証明書を再発行し、検証用CNAMEレコードをDNSに維持したままALBに関連付ける",
      "有効期限前に送信される検証Eメールを承認する運用を継続する",
      "外部認証局の証明書を購入してACMにインポートする",
      "AWS Configのacm-certificate-expiration-checkルールで期限を監視し、期限が近づいたら手動で再発行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ACMのマネージド更新では、DNS検証の証明書であれば、検証用CNAMEレコードがDNSに残っていて証明書がALBなどのサービスで使用中である限り、有効期限前に自動で更新されます。Eメール検証からDNS検証へ移行することで、更新時の手作業を実質的になくせます。BのEメール承認の継続は毎回の手作業が残り、承認漏れによる期限切れリスクも解消できません。Cのインポート証明書はマネージド更新の対象外で、かえって手動での再インポートが必要になります。DのConfigルールは期限切れの検出には有効ですが、更新作業自体は手動のままで、手作業の最小化という要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/managed-renewal.html",
  },
  {
    id: "cloudops-d4-ch02-q06",
    domain: 4,
    topic: "ACM(CloudFront)",
    type: "single",
    difficulty: "easy",
    question:
      "CloudOpsエンジニアが、Amazon CloudFrontディストリビューションに独自ドメインのHTTPSを設定するため、ap-northeast-1リージョンのACMで発行した証明書を関連付けようとしましたが、証明書の選択リストに表示されません。原因はどれですか。",
    choices: [
      "証明書のキーアルゴリズムがCloudFrontでサポートされていないため",
      "CloudFrontに関連付ける証明書はus-east-1リージョンのACMで発行する必要があるため",
      "CloudFrontはACM証明書をサポートしておらず、IAMサーバー証明書が必要なため",
      "ワイルドカードドメインの証明書はCloudFrontで使用できないため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudFrontはグローバルサービスであり、ディストリビューションに関連付けるACM証明書は米国東部(バージニア北部)us-east-1リージョンで発行またはインポートされている必要があります。東京リージョンで発行した証明書は選択リストに表示されないため、us-east-1で再発行します。一方、ALBに使う証明書はALBと同じリージョンで発行します。Aについて、ACMが発行するパブリック証明書はCloudFrontでサポートされており、リストに表示されない直接の原因はリージョンです。CはACM証明書がCloudFrontで推奨される方式であり、事実と逆です。Dのワイルドカード証明書はCloudFrontでも問題なく使用できます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html",
  },
  {
    id: "cloudops-d4-ch02-q07",
    domain: 4,
    topic: "Secrets Manager",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のアプリケーションでは、Amazon RDS for MySQLの認証情報が設定ファイルにハードコードされています。監査で、認証情報を安全に保管し、90日ごとに自動でローテーションすることが求められました。最小の運用負荷で実現する方法はどれですか。",
    choices: [
      "Systems Manager Parameter StoreのSecureStringに保存し、ローテーション用のLambda関数を自作して定期実行する",
      "AWS KMSで暗号化してS3バケットに保存し、ライフサイクルルールで定期的に更新する",
      "暗号化した認証情報をコードリポジトリで管理し、デプロイ時に環境変数として注入する",
      "AWS Secrets Managerに保存し、マネージドローテーションを90日スケジュールで有効化する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS Secrets ManagerはAmazon RDSなどのデータベース認証情報向けにマネージドローテーションを提供しており、スケジュールを指定するだけでデータベース側のパスワード変更とシークレット値の更新が自動で行われます。安全な保管・自動ローテーション・最小の運用負荷という要件をすべて満たします。AのParameter StoreのSecureStringは安全な保管はできますが、組み込みのローテーション機能がなく、Lambda関数の自作と保守という運用負荷が発生します。BのS3ライフサイクルルールはオブジェクトの移行・削除の仕組みであり、パスワードの更新はできません。Cのリポジトリ管理は暗号化してもアクセス統制と自動更新が難しく、漏えいリスクが残ります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/rotating-secrets.html",
  },
  {
    id: "cloudops-d4-ch02-q08",
    domain: 4,
    topic: "Secrets Manager(ローテーション)",
    type: "single",
    difficulty: "hard",
    question:
      "AWS Secrets ManagerでRDSデータベース認証情報の自動ローテーションを有効化して以降、ローテーションが実行されるたびに一部のアプリケーションがデータベース認証エラーを起こすようになりました。該当アプリケーションは起動時にシークレットを1回だけ取得し、メモリ上に保持し続けています。根本的な解決策はどれですか。",
    choices: [
      "自動ローテーションを無効化して固定パスワードに戻す",
      "ローテーションのスケジュール間隔を短くして影響時間を減らす",
      "認証エラー時にシークレットを再取得するようアプリケーションを修正し、キャッシュに有効期限を設ける",
      "ステージングラベルAWSPREVIOUSの値を参照するようアプリケーションを変更する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。アプリケーションがシークレットを起動時に1回だけ取得して保持し続けると、ローテーションでデータベース側のパスワードが変わった後も古い値を使い続けるため、認証エラーが発生します。認証エラー時にSecrets Managerから最新値(AWSCURRENT)を再取得する、またはキャッシュに有効期限を設けて定期的に更新するのが正攻法です。Aのローテーション無効化はエラーは防げますが、監査要件である自動ローテーションを放棄することになります。Bの間隔短縮はパスワード変更の頻度を上げるため、エラーの発生機会がむしろ増えます。DのAWSPREVIOUSはローテーション前の古い値を指すラベルであり、参照しても根本解決になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/retrieving-secrets.html",
  },
  {
    id: "cloudops-d4-ch02-q09",
    domain: 4,
    topic: "GuardDuty",
    type: "single",
    difficulty: "easy",
    question:
      "AWS Security Hubのコンソールで、CryptoCurrency:EC2/BitcoinTool.B!DNSという検出結果が確認されました。これはAmazon EC2インスタンスが暗号通貨マイニングに関連するドメイン名を問い合わせていることを示しています。この検出結果を生成したサービスはどれですか。",
    choices: [
      "Amazon GuardDuty",
      "Amazon Inspector",
      "Amazon Macie",
      "AWS Config",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CryptoCurrency:EC2で始まる検出結果タイプは、EC2インスタンスが暗号通貨マイニングに関連する通信を行っていることを示すAmazon GuardDutyの脅威検出結果です。GuardDutyはCloudTrailイベント・VPCフローログ・DNSログなどを分析して不審なアクティビティを検出し、結果をSecurity Hubに集約できます。BのAmazon InspectorはEC2・ECRコンテナイメージ・Lambdaのソフトウェア脆弱性(CVE)や意図しないネットワーク露出を検出するサービスです。CのAmazon MacieはS3バケット内の個人情報などの機密データを検出・分類するサービスです。DのAWS Configはリソース構成のルール準拠を評価するもので、脅威検出は行いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.html",
  },
  {
    id: "cloudops-d4-ch02-q10",
    domain: 4,
    topic: "GuardDuty(自動修復)",
    type: "multiple",
    difficulty: "medium",
    question:
      "Amazon GuardDutyがEC2インスタンスの侵害を示す重要度の高い検出結果を生成した場合に備えて、CloudOpsエンジニアは、対象インスタンスをネットワーク隔離する初動対応の自動化と、セキュリティチームへの即時通知を構成したいと考えています。有効な方法はどれですか。(2つ選択してください)",
    choices: [
      "AWS Configの修復アクションでGuardDutyの検出結果を自動修復する",
      "Amazon EventBridgeルールで検出結果をフィルタし、Systems Manager AutomationまたはLambdaで隔離用セキュリティグループに付け替える",
      "AWS Trusted Advisorのセキュリティチェック通知でセキュリティチームに連絡する",
      "Amazon EventBridgeルールのターゲットにSNSトピックを設定してセキュリティチームへ通知する",
      "CloudWatchアラームのEC2復旧アクションでインスタンスを自動復旧する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。GuardDutyの検出結果はEventBridgeにイベントとして配信されるため、重要度や検出タイプでフィルタするルールを作成し、ターゲットにSystems Manager AutomationランブックやLambda関数を指定すれば、隔離用セキュリティグループへの付け替えなどの初動対応を自動化できます。同様にターゲットへAmazon SNSトピックを設定すれば即時通知も実現できます。AのConfig修復アクションはConfigルールの非準拠リソースに対する仕組みで、GuardDutyの検出結果をトリガーにはできません。CのTrusted AdvisorはGuardDutyの検出結果を通知しません。EのEC2復旧アクションはシステムステータスチェック失敗時の復旧機能で、セキュリティ侵害の隔離には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.html",
  },
  {
    id: "cloudops-d4-ch02-q11",
    domain: 4,
    topic: "Macie(データ分類)",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では数百のAmazon S3バケットに顧客データを保存しています。コンプライアンス対応として、個人情報(PII)を含むオブジェクトを自動的に検出して機密度に応じたデータ分類を行い、結果をAWS Security Hubで一元的に確認したいと考えています。最小の運用負荷で実現する方法はどれですか。",
    choices: [
      "Amazon InspectorでS3バケットの脆弱性スキャンを構成する",
      "AWS Glue DataBrewでデータセットをプロファイリングする",
      "S3インベントリとAmazon Athenaで正規表現による検索処理を構築する",
      "Amazon Macieで機密データ検出ジョブを実行し、検出結果を連携する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Amazon Macieは機械学習とパターンマッチングによってS3バケット内の個人情報(PII)などの機密データを自動検出し、機密度に基づくデータ分類を支援するマネージドサービスです。検出結果はSecurity HubやEventBridgeに連携できるため、最小の運用負荷で要件を満たします。AのAmazon InspectorはEC2・ECR・Lambdaを対象とする脆弱性管理サービスで、S3オブジェクトの内容は分析しません。BのGlue DataBrewはデータ分析前のデータ準備・プロファイリング用ツールで、継続的なセキュリティ統制としてのPII検出には適しません。Cの自作の検索処理は構築・保守の運用負荷が大きく、検出精度の維持も困難です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/macie/latest/user/what-is-macie.html",
  },
];
