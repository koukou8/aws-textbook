// CloudOps問題集 分野4(セキュリティとコンプライアンス)前半: qb-d4-001〜qb-d4-016
export const questions = [
  {
    id: "qb-d4-001",
    domain: 4,
    topic: "IAMポリシー評価",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業の開発者が、Amazon S3バケットのオブジェクトを取得しようとするとAccessDeniedエラーになります。開発者のIAMユーザーにはs3:GetObjectを許可する管理ポリシーがアタッチされていますが、開発者が所属するIAMグループには該当バケットへのs3:*を拒否するポリシーがアタッチされています。この動作の原因として正しいものはどれですか。",
    choices: [
      "グループのポリシーはユーザーのポリシーより後に評価されるため、後から評価された拒否が優先される",
      "バケットポリシーで明示的に許可されていないリクエストは、IAMポリシーの内容にかかわらずすべて拒否される",
      "明示的な拒否はすべての許可より優先されるため、グループポリシーの拒否が適用される",
      "IAMグループにはポリシーをアタッチできないため、設定が無効になり暗黙的な拒否が適用される",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。IAMのポリシー評価では、プリンシパルに適用されるすべてのポリシーが合わせて評価され、1つでも明示的な拒否(Deny)があれば、他にどれだけ許可(Allow)があってもリクエストは拒否されます。Aが誤りである理由は、ポリシーの評価に順序や後勝ちという概念はないためです。Bは同一アカウント内ではアイデンティティベースポリシーの許可のみでアクセス可能であり、バケットポリシーの許可は必須ではないため誤りです。DはIAMグループにも管理ポリシーやインラインポリシーをアタッチできるため誤りです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
  },
  {
    id: "qb-d4-002",
    domain: 4,
    topic: "IAMポリシーシミュレーター",
    type: "single",
    difficulty: "easy",
    question:
      "CloudOpsエンジニアが、IAMユーザーにアタッチされているポリシーの変更を本番環境へ適用する前に、特定のAPIアクションが許可されるか拒否されるかを、実際のリソースに影響を与えずに検証したいと考えています。最も適切なツールはどれですか。",
    choices: [
      "IAM Access Analyzer",
      "IAMポリシーシミュレーター",
      "AWS CloudTrail",
      "Amazon Inspector",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。IAMポリシーシミュレーターを使うと、実際のAWSリクエストを発行せずに、ポリシーが特定のアクションやリソースに対して許可と拒否のどちらを返すかをテストできるため、本番環境に影響を与えずに変更内容を検証できます。Aが誤りである理由は、IAM Access Analyzerは外部と共有されているリソースの検出や未使用アクセスの分析が主目的であるためです。CのCloudTrailは実際に発生したAPI呼び出しを事後に記録するサービスであり、事前の検証はできません。DのAmazon InspectorはEC2やコンテナイメージの脆弱性評価サービスで、ポリシー検証の機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_testing-policies.html",
  },
  {
    id: "qb-d4-003",
    domain: 4,
    topic: "IAM Access Analyzer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のセキュリティチームは、組織外のAWSアカウントやインターネットからアクセス可能になっているS3バケット・IAMロール・KMSキーなどのリソースを継続的に検出し、意図しない共有を特定したいと考えています。最も少ない運用負荷でこの要件を満たす方法はどれですか。",
    choices: [
      "IAM Access Analyzerを有効化し、信頼ゾーン外からアクセス可能なリソースの検出結果を確認する",
      "AWS CloudTrailの全ログを毎日エクスポートし、外部アカウントからのアクセス記録を手動で確認する",
      "Amazon GuardDutyを有効化し、脅威検出結果からリソースの共有設定を推測する",
      "すべてのリソースポリシーを四半期ごとに担当者が手動でレビューする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。IAM Access AnalyzerはS3バケット、IAMロール、KMSキーなどのリソースポリシーを論理的に分析し、信頼ゾーン(アカウントまたは組織)の外部からアクセス可能なリソースを継続的に検出して報告するため、運用負荷を最小にできます。Bが誤りである理由は、CloudTrailは実際に発生したアクセスの記録であり、共有設定そのものを網羅的に検出するには手作業が多く、アクセスが発生するまで気づけないためです。CのGuardDutyは脅威検出サービスであり、リソース共有設定の分析は目的ではありません。Dの手動レビューは継続的な検出にならず、運用負荷も高くなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/what-is-access-analyzer.html",
  },
  {
    id: "qb-d4-004",
    domain: 4,
    topic: "CloudTrail",
    type: "single",
    difficulty: "medium",
    question:
      "あるアプリケーションで断続的にAWS APIのAccessDeniedエラーが発生しています。CloudOpsエンジニアは、どのIAMプリンシパルがどのAPIアクションを呼び出して拒否されたのかを特定する必要があります。最も適切な調査方法はどれですか。",
    choices: [
      "VPCフローログでREJECTと記録されたトラフィックを検索する",
      "IAMクレデンシャルレポートで各ユーザーの認証情報の状態を確認する",
      "CloudWatchの標準メトリクスでAPIエラー数の推移を確認する",
      "CloudTrailのイベント履歴でAccessDeniedのイベントを検索し、userIdentityとeventNameを確認する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。CloudTrailはAWSのAPI呼び出しを記録し、各イベントには呼び出し元プリンシパル(userIdentity)、アクション(eventName)、エラーコードが含まれるため、誰のどの呼び出しが拒否されたかを正確に特定できます。Aが誤りである理由は、VPCフローログはネットワークレベルの通信記録であり、IAMの認可結果(AccessDenied)は含まれないためです。Bのクレデンシャルレポートはアクセスキーの使用状況やMFA設定状況などの一覧であり、個々のAPI呼び出しは記録されません。CのCloudWatchメトリクスではエラー件数の傾向は見えても、プリンシパルやアクションの詳細は特定できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/view-cloudtrail-events.html",
  },
  {
    id: "qb-d4-005",
    domain: 4,
    topic: "IAM条件キー",
    type: "single",
    difficulty: "hard",
    question:
      "あるS3バケットのバケットポリシーには、会社オフィスのパブリックIPアドレス範囲以外からのアクセスをaws:SourceIp条件で拒否するステートメントがあります。VPC内のEC2インスタンスからゲートウェイ型VPCエンドポイント経由でこのバケットにアクセスしたところ、AccessDeniedになりました。最も可能性の高い原因はどれですか。",
    choices: [
      "ゲートウェイ型VPCエンドポイントはAmazon S3へのアクセスをサポートしていないため",
      "VPCエンドポイント経由のリクエストは送信元がプライベートIPアドレスとして評価され、aws:SourceIp条件のパブリックIP範囲に一致しないため",
      "EC2インスタンスのセキュリティグループがHTTPSのアウトバウンド通信を拒否しているため",
      "バケットポリシーはVPC内部からのリクエストには適用されないため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。aws:SourceIp条件は通常パブリックIPアドレスで評価されますが、VPCエンドポイント経由のリクエストは送信元がVPC内のプライベートIPになるため許可条件に一致せず、拒否ステートメントに該当します。この構成ではaws:SourceVpceやaws:SourceVpc条件を併用する必要があります。Aが誤りである理由は、ゲートウェイ型エンドポイントはまさにS3とDynamoDB用の機能であるためです。Cのセキュリティグループで通信が遮断される場合は接続タイムアウトになり、認可エラーであるAccessDeniedにはなりません。Dのバケットポリシーは経路にかかわらずバケットへのすべてのリクエストに適用されます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_condition-keys.html",
  },
  {
    id: "qb-d4-006",
    domain: 4,
    topic: "クロスアカウントアクセス",
    type: "multiple",
    difficulty: "medium",
    question:
      "アカウントAのIAMユーザーが、アカウントBが所有するS3バケットのオブジェクトを取得できるように構成する必要があります。実施すべき設定はどれですか。(2つ選択してください)",
    choices: [
      "アカウントAとアカウントBのVPC間にVPCピアリング接続を作成する",
      "アカウントBのバケットポリシーで、アカウントAのプリンシパルに対してs3:GetObjectを許可する",
      "アカウントBでIAMユーザーを新規作成し、そのアクセスキーをアカウントAの利用者に共有する",
      "アカウントAのIAMユーザーに、対象バケットへのs3:GetObjectを許可するIAMポリシーをアタッチする",
      "対象バケットのブロックパブリックアクセスを無効化し、パブリック読み取りを許可する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。クロスアカウントアクセスでは、リソースを所有する側(アカウントB)のバケットポリシーによる許可と、呼び出す側(アカウントA)のアイデンティティベースポリシーによる許可の両方が必要です。どちらか一方だけではアクセスできません。Aが誤りである理由は、S3へのアクセス認可はIAMポリシーとバケットポリシーで制御され、VPCピアリングというネットワーク接続は無関係のためです。Cのアクセスキーの共有は認証情報管理のベストプラクティスに反します。Eのパブリック公開は特定アカウントへの限定共有という要件を大きく超えるため不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/example-walkthroughs-managing-access.html",
  },
  {
    id: "qb-d4-007",
    domain: 4,
    topic: "IAMロール",
    type: "single",
    difficulty: "easy",
    question:
      "セキュリティ監査で、EC2インスタンス上のアプリケーションがソースコードに埋め込まれたIAMユーザーのアクセスキーを使ってAmazon S3にアクセスしていることが判明しました。最もセキュアな改善方法はどれですか。",
    choices: [
      "アクセスキーを暗号化してアプリケーションの設定ファイルに保存する",
      "アクセスキーを90日ごとに手動でローテーションする運用ルールを定める",
      "必要最小限の権限を持つIAMロールを作成し、インスタンスプロファイルとしてEC2にアタッチして一時的な認証情報を使用する",
      "ルートユーザーのアクセスキーを発行し、パスワードマネージャーで厳重に管理して使用する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2インスタンスにIAMロールをアタッチすると、アプリケーションはインスタンスメタデータサービス経由で自動的にローテーションされる一時的な認証情報を取得できるため、長期的なアクセスキーの保管・漏えいリスクそのものを排除できます。AとBが誤りである理由は、暗号化や定期的なローテーションを行っても、長期認証情報を配布・管理すること自体のリスクが残るためです。Dのルートユーザーのアクセスキーはアカウントで最も強力な認証情報であり、作成しないことがベストプラクティスとされています。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html",
  },
  {
    id: "qb-d4-008",
    domain: 4,
    topic: "MFA",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、IAMユーザーがMFAで認証したセッションからのみ、本番環境のEC2インスタンスの停止・終了操作を実行できるようにしたいと考えています。最も適切な実装方法はどれですか。",
    choices: [
      "aws:MultiFactorAuthPresent条件キーを使用し、MFA認証済みの場合のみ該当アクションを許可するIAMポリシーを適用する",
      "IAMのアカウントパスワードポリシーでMFAの使用を必須に設定する",
      "ルートユーザーにMFAデバイスを設定し、停止・終了操作はルートユーザーのみで実行する運用にする",
      "対象のEC2インスタンスで終了保護を有効化し、すべての終了操作をブロックする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。IAMポリシーのCondition要素でaws:MultiFactorAuthPresent条件キーを使用すると、MFA認証を経た一時的セッションからのリクエストに限定して特定のアクションを許可でき、MFA保護されたAPIアクセスを実現できます。Bが誤りである理由は、パスワードポリシーは文字数や有効期間などパスワード要件を定める機能であり、MFAを強制する設定は含まれないためです。Cのルートユーザーを日常運用に使用することはベストプラクティスに反します。Dの終了保護はMFAの有無にかかわらず終了を一律に防ぐ機能であり、MFA認証済みユーザーには許可するという要件を満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html",
  },
  {
    id: "qb-d4-009",
    domain: 4,
    topic: "パスワードポリシー",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のコンプライアンス要件では、AWSアカウントのIAMユーザーのパスワードについて、最小14文字、大文字・小文字・数字の使用、および過去に使用したパスワードの再利用禁止を強制することが求められています。最も適切な対応はどれですか。",
    choices: [
      "AWS Configルールを作成し、要件を満たさないパスワードを自動的に変更する",
      "AWS Secrets Managerに各ユーザーのパスワードを保存し、自動ローテーションを設定する",
      "パスワード規定を社内ポータルで通知し、各ユーザーに自主的な遵守を依頼する",
      "IAMのアカウント設定でカスタムパスワードポリシーを構成し、要件をアカウント全体に強制する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。IAMのカスタムパスワードポリシーでは、最小文字数、必須の文字種、有効期間、再利用の禁止(記憶する世代数)などを設定でき、アカウント内のすべてのIAMユーザーに要件を強制できます。Aが誤りである理由は、AWS Configは設定の評価や修復アクションの起動はできますが、ユーザーのパスワードの内容を検査・変更することはできないためです。BのSecrets Managerはアプリケーションが使用するシークレットの保管サービスであり、IAMユーザーのサインインパスワードの要件は制御できません。Cは技術的な強制力がなく、コンプライアンス要件の実装とはいえません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html",
  },
  {
    id: "qb-d4-010",
    domain: 4,
    topic: "IAM Identity Center",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Organizationsで複数のAWSアカウントを運用する企業が、既存のMicrosoft Active Directoryの認証情報を使って全アカウントへのシングルサインオンを実現し、アクセス権限を一元管理したいと考えています。最も少ない運用負荷で実現する方法はどれですか。",
    choices: [
      "各アカウントにIAMユーザーを作成し、Active Directoryと同じパスワードを設定して同期を維持する",
      "IAM Identity CenterをActive Directoryに接続してIDソースとし、許可セットで各アカウントへのアクセスを割り当てる",
      "各アカウントで個別にSAML IDプロバイダーを作成し、アカウントごとにフェデレーション用のロールを管理する",
      "全社員にアクセスキーを配布し、AWS CLI経由でのみ各アカウントにアクセスさせる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。IAM Identity CenterはAWS Organizationsと統合されたシングルサインオンサービスで、AD ConnectorやAWS Managed Microsoft ADを介して既存のActive DirectoryをIDソースにでき、許可セットによって複数アカウントへのアクセス権限を一元的に割り当てられます。AとCが誤りである理由は、アカウントごとにユーザー管理やIDプロバイダー設定を行う必要があり、アカウント数に比例して運用負荷と設定漏れのリスクが増えるためです。Dのアクセスキーの配布は長期認証情報の大量管理につながり、シングルサインオンの要件も満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/what-is.html",
  },
  {
    id: "qb-d4-011",
    domain: 4,
    topic: "IDフェデレーション",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、社内で運用しているSAML 2.0対応のIDプロバイダー(IdP)の認証を使って、従業員が一時的な認証情報でAWSマネジメントコンソールにアクセスできるようにしたいと考えています。IAMユーザーは作成しない方針です。必要な構成はどれですか。",
    choices: [
      "従業員ごとにIAMユーザーを作成し、IdPと同じユーザー名とパスワードを設定する",
      "IdPのすべての利用者にIAMアクセスキーを発行し、IdP経由で配布する",
      "IAMでSAML IDプロバイダーを作成し、そのIdPを信頼ポリシーで指定したIAMロールを定義して、従業員が引き受けられるようにする",
      "Amazon Cognitoユーザープールに全従業員を登録し、マネジメントコンソールへのサインインに使用する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。SAML 2.0フェデレーションでは、IAMにIdPのメタデータからSAML IDプロバイダーを登録し、そのIdPを信頼するIAMロールを作成します。従業員はIdPでの認証後にAssumeRoleWithSAMLで一時的な認証情報を取得し、コンソールにアクセスできます。AとBが誤りである理由は、IAMユーザーや長期のアクセスキーを作成する方式であり、IdPの認証と一時的な認証情報を使うという方針に反するためです。DのAmazon Cognitoは主に自社のWebやモバイルアプリケーションに認証機能を組み込むためのサービスであり、マネジメントコンソールへのフェデレーションには使用しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_saml.html",
  },
  {
    id: "qb-d4-012",
    domain: 4,
    topic: "SCP",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はデータレジデンシー要件により、AWS Organizations配下のすべてのメンバーアカウントで、ap-northeast-1(東京)リージョン以外でのリソース作成を組織レベルで防止する必要があります。最も少ない運用負荷で実現する方法はどれですか。",
    choices: [
      "各アカウントのすべてのIAMユーザーとロールに、リージョンを制限するインラインポリシーを個別にアタッチする",
      "AWS Configルールで他リージョンに作成されたリソースを検出し、担当者が手動で削除する",
      "CloudTrailで他リージョンへのAPI呼び出しを監視し、検出時にメールで担当者へ警告する",
      "aws:RequestedRegion条件キーで東京リージョン以外へのリクエストを拒否するSCPを作成し、組織のルートまたはOUにアタッチする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。SCPは組織のルート・OU・アカウントに適用できるガードレールであり、aws:RequestedRegion条件キーを使えば、指定リージョン以外へのAPIリクエストを組織レベルで一元的に拒否できます(IAMなどグローバルサービスの除外設定は必要です)。Aが誤りである理由は、アカウントやユーザーごとの個別設定になり運用負荷が高く、新規ユーザーへの設定漏れも起きやすいためです。BとCは事後の検出・通知であり、リソースの作成自体を防止できないため、防止という要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "qb-d4-013",
    domain: 4,
    topic: "SCP",
    type: "single",
    difficulty: "hard",
    question:
      "AWS Organizationsの新しいメンバーアカウントで、IAMユーザーがAmazon Athenaを使用できません。アカウントに適用されているSCPを確認すると、すべてのサービスを許可するFullAWSAccessポリシーがアタッチされています。最も可能性の高い原因はどれですか。",
    choices: [
      "SCPはアクセス許可を付与しないため、ユーザーにAthenaの使用を許可するIAMポリシーが別途必要である",
      "SCPの変更や適用が反映されるまでには最大24時間かかるため、反映を待つ必要がある",
      "FullAWSAccessポリシーは管理アカウントにのみ適用されるポリシーであるため",
      "メンバーアカウントではAthenaのような分析サービスがデフォルトで無効化されているため",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。SCPはアカウント内のプリンシパルが使用できるアクセス許可の上限(ガードレール)を定義するだけで、それ自体がアクセス許可を付与することはありません。実際にAthenaを使用するには、SCPで許可された範囲内で、IAMポリシーによる明示的な許可をユーザーに与える必要があります。Bが誤りである理由は、SCPの反映に24時間を要するという仕様はないためです。CのFullAWSAccessは組織のルートやOUにデフォルトでアタッチされるSCPであり、管理アカウント専用ではありません。Dのようにメンバーアカウントで特定サービスがデフォルト無効化される仕様は存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "qb-d4-014",
    domain: 4,
    topic: "AWS Organizations",
    type: "multiple",
    difficulty: "medium",
    question:
      "AWS Organizationsのサービスコントロールポリシー(SCP)の仕様として正しい記述はどれですか。(2つ選択してください)",
    choices: [
      "SCPは管理アカウント(management account)のユーザーやロールには適用されない",
      "SCPをアタッチすると、メンバーアカウントのIAMユーザーに自動的にアクセス許可が付与される",
      "SCPを使用するには、組織で「すべての機能」を有効化しておく必要がある",
      "SCPはメンバーアカウントのルートユーザーには適用されない",
      "SCPは組織のルートには直接アタッチできず、OUにのみアタッチできる",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。SCPは一括請求(コンソリデーティッドビリング)のみのモードでは使用できず、組織の「すべての機能」の有効化が前提です。また、管理アカウントのプリンシパルはSCPの制限を受けないため、管理アカウントでワークロードを実行しないことが推奨されます。Bが誤りである理由は、SCPは利用可能な許可の上限を定めるだけで、許可の付与は行わないためです。DのSCPはメンバーアカウントのルートユーザーを含む全プリンシパルに適用されます。EのSCPは組織のルート、OU、個々のアカウントのいずれにもアタッチできます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "qb-d4-015",
    domain: 4,
    topic: "Control Tower",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がAWSでマルチアカウント環境を新規に構築します。ベストプラクティスに沿ったランディングゾーンを短期間でセットアップし、予防的および発見的なガードレール(コントロール)を最初から適用したいと考えています。最も少ない運用負荷で実現できる方法はどれですか。",
    choices: [
      "AWS CloudFormation StackSetsで独自に設計したガードレールを全アカウントへ展開する",
      "AWS Control Towerでランディングゾーンをセットアップし、必要なコントロールを有効化する",
      "AWS Trusted Advisorのチェック結果をもとに、各アカウントを担当者が手動で構成する",
      "AWS Service Catalogでアカウント設定の手順書テンプレートを各チームに配布する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Control TowerはAWS Organizationsを基盤として、マルチアカウント環境のランディングゾーンを自動でセットアップし、SCPによる予防的コントロールとAWS Configルールによる発見的コントロールを最初から適用できるマネージドサービスです。Aが誤りである理由は、StackSetsによる独自実装はガードレールの設計・構築・保守をすべて自前で行う必要があり、運用負荷が大きいためです。CのTrusted Advisorはチェックと推奨事項の提示を行うサービスで、環境の自動セットアップは行いません。DのService Catalogは承認済み製品の配布の仕組みであり、ランディングゾーン全体の構築やガードレールの適用はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/controltower/latest/userguide/what-is-control-tower.html",
  },
  {
    id: "qb-d4-016",
    domain: 4,
    topic: "Trusted Advisor",
    type: "multiple",
    difficulty: "easy",
    question:
      "AWS Trusted Advisorのセキュリティカテゴリで提供されるチェック項目はどれですか。(2つ選択してください)",
    choices: [
      "EC2インスタンスにインストールされたOSパッケージのCVE脆弱性スキャン",
      "特定のポート(SSHなど)への無制限アクセス(0.0.0.0/0)を許可しているセキュリティグループの検出",
      "S3バケット内のオブジェクトに含まれる個人情報(PII)の検出",
      "VPCフローログの機械学習分析による異常な通信の検出",
      "ルートアカウントでMFAが有効化されているかどうかの確認",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。Trusted Advisorのセキュリティカテゴリには、無制限アクセスを許可しているセキュリティグループの検出や、ルートアカウントのMFA有効化状況の確認、S3バケットのアクセス許可の確認などのチェックが含まれます。Aが誤りである理由は、OSパッケージのCVE脆弱性スキャンはAmazon Inspectorの機能であるためです。CのS3内の個人情報検出はAmazon Macieの機能です。Dの機械学習を用いた異常な通信や脅威の検出はAmazon GuardDutyの機能であり、いずれもTrusted Advisorのチェック項目ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awssupport/latest/user/trusted-advisor.html",
  },
];
