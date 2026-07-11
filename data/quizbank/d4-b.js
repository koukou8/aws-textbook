// CloudOps問題集 分野4(セキュリティとコンプライアンス)後半: qb-d4-017〜qb-d4-032
export const questions = [
  {
    id: "qb-d4-017",
    domain: 4,
    topic: "AWS Config",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、S3バケットのブロックパブリックアクセス設定が誤って無効化された場合に、非準拠として自動的に検出し、人手を介さずに設定を元に戻したいと考えています。最も少ない運用負荷で実現する方法はどれですか。",
    choices: [
      "AWS CloudTrailで設定変更のAPI呼び出しを記録し、週次の監査で確認して修正する",
      "Amazon Inspectorのスキャン結果からパブリックなバケットを特定し、手動で修正する",
      "AWS Configのマネージドルールでバケット設定を評価し、非準拠リソースへの修復アクションとしてSSM Automationランブックを自動実行する",
      "全バケットの設定を毎日確認する自作スクリプトをEC2インスタンスのcronで実行する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Configにはs3-bucket-level-public-access-prohibitedなどのマネージドルールがあり、非準拠と判定されたリソースに対してSSM Automationランブックを修復アクションとして関連付けることで、検出から修復までを完全に自動化できます。Aが誤りである理由は、週次の監査では検出も修復も自動化されず、非準拠の状態が長時間放置されるためです。BのAmazon InspectorはEC2やコンテナイメージの脆弱性評価が目的で、S3バケット設定のコンプライアンス評価は行いません。DのEC2上の自作スクリプトはインスタンスやコードの維持管理が必要になり、運用負荷が最小とはいえません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/remediation.html",
  },
  {
    id: "qb-d4-018",
    domain: 4,
    topic: "コンフォーマンスパック",
    type: "single",
    difficulty: "medium",
    question:
      "セキュリティチームは、業界標準に対応した数十個のAWS Configルールと修復アクションのセットを、AWS Organizations配下のすべてのアカウントに一括でデプロイし、準拠状況をまとめて管理したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "コンフォーマンスパックを使用し、ルールと修復アクションのセットをテンプレートとして組織全体に一括デプロイする",
      "各アカウントの管理者にルールの一覧を配布し、それぞれのアカウントで個別に作成してもらう",
      "AWS Trusted Advisorのチェック項目をカスタマイズして、全アカウントに適用する",
      "Amazon EventBridgeルールを各アカウントに手動で作成し、設定変更を監視する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。コンフォーマンスパックは複数のAWS Configルールと修復アクションを1つのテンプレートにまとめてデプロイできる機能で、AWS Organizationsと統合すれば組織全体への一括デプロイと準拠状況の集約管理が可能です。Bが誤りである理由は、アカウントごとの手動作成では設定のばらつきや漏れが発生し、一括管理の要件を満たさないためです。CのTrusted Advisorはあらかじめ用意されたチェックを提供するサービスで、Configルールセットの代替やチェック内容の自由なカスタマイズはできません。DのEventBridgeルールはイベントのルーティングの仕組みであり、コンプライアンスの評価や修復の管理は行えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/conformance-packs.html",
  },
  {
    id: "qb-d4-019",
    domain: 4,
    topic: "CloudTrailとConfig",
    type: "single",
    difficulty: "easy",
    question:
      "セキュリティ監査への対応として、(1)「誰がいつどのAPIを呼び出したか」という証跡の記録と、(2)「リソースの設定が時間とともにどう変化し、社内ルールに準拠しているか」という評価が求められています。それぞれの要件に最も適したサービスの組み合わせはどれですか。",
    choices: [
      "(1) AWS Config、(2) AWS CloudTrail",
      "(1) AWS CloudTrail、(2) AWS Config",
      "(1) Amazon CloudWatch、(2) Amazon Inspector",
      "(1) Amazon GuardDuty、(2) AWS Security Hub",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudTrailはAPI呼び出しの履歴(呼び出し元、日時、アクション)を証跡として記録する監査向けのサービスであり、AWS Configはリソースの設定変更の履歴を追跡し、ルールに照らして準拠状況を継続的に評価するサービスです。Aは両サービスの役割が逆になっています。Cが誤りである理由は、CloudWatchはメトリクスやログによるモニタリング、InspectorはEC2などの脆弱性評価が目的であり、API証跡の記録や設定準拠の評価の専用機能ではないためです。DのGuardDutyは脅威検出、Security Hubは検出結果の集約が目的であり、2つの要件には直接対応しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/WhatIsConfig.html",
  },
  {
    id: "qb-d4-020",
    domain: 4,
    topic: "リソースポリシー",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、中央のログ保管用S3バケットへのアクセスを、AWS Organizationsの自社組織に所属するアカウントのプリンシパルのみに限定したいと考えています。アカウントは頻繁に追加されるため、追加のたびにポリシーを修正しなくても新しいアカウントに自動的に適用される必要があります。最も適切な方法はどれですか。",
    choices: [
      "バケットポリシーにすべてのアカウントIDをリストで記載し、アカウント追加時に手動で更新する",
      "各メンバーアカウントとVPCピアリング接続を作成し、ネットワーク経路を持つアカウントのみ許可する",
      "S3バケットのACLで自社ドメインのメールアドレスを持つAWSアカウントを許可する",
      "バケットポリシーでaws:PrincipalOrgID条件キーを使用し、自社の組織IDに一致するプリンシパルのみアクセスを許可する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。aws:PrincipalOrgID条件キーをバケットポリシーで使用すると、リクエストするプリンシパルが所属するAWS Organizationsの組織IDを条件にでき、組織へのアカウントの追加・削除にポリシーの修正なしで自動的に追従します。Aが誤りである理由は、アカウントが追加されるたびに手動更新が必要で、更新漏れによるアクセス障害や過剰許可のリスクがあるためです。BのVPCピアリングはネットワーク接続の仕組みであり、S3へのアクセス認可の制御にはなりません。CのACLに組織やメールドメインを条件とする機能はなく、現在はACL自体の使用が非推奨とされています。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_condition-keys.html",
  },
  {
    id: "qb-d4-021",
    domain: 4,
    topic: "KMSキーポリシー",
    type: "single",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアが、アプリケーション用のIAMロールにKMSカスタマーマネージドキーでのkms:Decryptを許可するIAMポリシーをアタッチしましたが、復号リクエストはAccessDeniedのままです。このキーのキーポリシーはデフォルトから変更されており、セキュリティチームのロールへの許可ステートメントのみが含まれています。最も可能性の高い原因はどれですか。",
    choices: [
      "キーポリシーにアカウントへのアクセス制御を委任するステートメント(rootプリンシパルへの許可)がないため、IAMポリシーの許可だけではキーを使用できない",
      "kms:Decryptを許可するポリシーには、同時にkms:Encryptの許可も含める必要があるため",
      "カスタマーマネージドキーはIAMユーザー専用であり、IAMロールからは使用できないため",
      "KMSのキーポリシーは作成後に変更できないため、新しいキーを作成する必要があるため",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。KMSキーへのアクセスは第一にキーポリシーで制御されます。デフォルトキーポリシーに含まれるアカウントのrootプリンシパルへの許可ステートメントは、IAMポリシーによるキーへのアクセス制御を有効化する役割を持ち、これが削除されているとIAMポリシーでいくら許可してもアクセスできません。キーポリシー自体でロールを許可するか、rootへの委任ステートメントを戻す必要があります。Bが誤りである理由は、復号にkms:Encryptの許可は不要なためです。CのKMSキーはIAMロールを含む任意のプリンシパルに許可できます。Dのキーポリシーは作成後もPutKeyPolicyで変更可能です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-policies.html",
  },
  {
    id: "qb-d4-022",
    domain: 4,
    topic: "KMSキーローテーション",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のコンプライアンス要件により、Amazon S3の暗号化に使用しているKMSカスタマーマネージドキーのキーマテリアルを1年ごとにローテーションする必要があります。既存の暗号化済みデータへの影響を避けつつ、最も少ない運用負荷で実現する方法はどれですか。",
    choices: [
      "毎年新しいKMSキーを手動で作成し、すべての既存オブジェクトを新しいキーで再暗号化する",
      "キーを一度無効化してから再有効化し、キーマテリアルを更新する",
      "カスタマーマネージドキーの自動キーローテーションを有効化する",
      "AWS Secrets ManagerにKMSキーを登録し、ローテーションスケジュールを設定する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。カスタマーマネージドキーで自動キーローテーションを有効化すると、キーマテリアルが1年ごとに自動的に更新されます。古いキーマテリアルはKMS内部に保持されるため、既存の暗号化済みデータはそのまま復号でき、再暗号化やアプリケーションの変更は不要です。Aが誤りである理由は、キーの手動作成と全データの再暗号化は運用負荷が非常に大きいためです。Bのキーの無効化・再有効化は利用の可否を切り替えるだけで、キーマテリアルは更新されません。DのSecrets Managerがローテーションできるのはデータベース認証情報などのシークレットであり、KMSキーのキーマテリアルはローテーションできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/rotate-keys.html",
  },
  {
    id: "qb-d4-023",
    domain: 4,
    topic: "S3オブジェクトロック",
    type: "single",
    difficulty: "hard",
    question:
      "金融規制への対応として、S3に保存する取引監査ログを、あらかじめ定めた保持期間の間はAWSアカウントのルートユーザーや管理者を含む誰もが削除・上書きできない形(WORM)で保持する必要があります。最も適切な方法はどれですか。",
    choices: [
      "バケットポリシーで、すべてのプリンシパルに対してs3:DeleteObjectを拒否する",
      "S3オブジェクトロックをコンプライアンスモードで有効化し、必要な保持期間を設定する",
      "S3バージョニングを有効化し、削除されても以前のバージョンから復元できるようにする",
      "S3ライフサイクルルールで、保持期間が経過するまでオブジェクトを削除しないよう設定する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。S3オブジェクトロックのコンプライアンスモードでは、設定した保持期間が経過するまで、オブジェクトバージョンをルートユーザーを含むいかなるユーザーも削除・上書きできず、保持期間の短縮もできません。これによりWORM(Write Once Read Many)要件を満たせます。Aのバケットポリシーによる拒否は、権限を持つ管理者がポリシー自体を変更・削除できるため、恒久的な不変性は保証できません。Cのバージョニングは削除時に以前のバージョンを残す機能で、削除操作そのものは防げません。Dのライフサイクルルールはオブジェクトの移行や期限切れ削除を自動化する機能であり、削除の防止(不変性の強制)はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lock.html",
  },
  {
    id: "qb-d4-024",
    domain: 4,
    topic: "クロスアカウントロール(外部ID)",
    type: "single",
    difficulty: "hard",
    question:
      "あるSaaSベンダーに、自社アカウントのリソースへIAMロールを引き受けてアクセスさせます。ベンダーは多数の顧客のロールを同じ仕組みで引き受けるため、他の顧客のリクエストによって自社のロールが誤って引き受けられる「混乱した代理(confused deputy)」問題を防ぐ必要があります。最も適切な対策はどれですか。",
    choices: [
      "ベンダー用にIAMユーザーを作成し、アクセスキーを発行してベンダーに渡す",
      "ロールの信頼ポリシーでaws:SourceIp条件を使い、ベンダーの送信元IPアドレスに限定する",
      "ロールにアタッチする権限ポリシーを最小権限にして、アクセスできるリソースを絞る",
      "ロールの信頼ポリシーでsts:ExternalId条件を使い、ベンダーが顧客ごとに割り当てる一意の外部IDと一致する場合のみ引き受けを許可する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。サードパーティにクロスアカウントのIAMロールを引き受けさせる場合、ロールの信頼ポリシーにsts:ExternalId条件を追加し、ベンダーが顧客ごとに割り当てる一意の外部IDと一致するリクエストのみに引き受けを限定するのが、混乱した代理問題に対するAWS推奨の対策です。Aのアクセスキーの発行は長期認証情報の共有となりベストプラクティスに反し、混乱した代理問題の対策にもなりません。Bのaws:SourceIpによる制限は送信元IPが変わると機能せず、別顧客によるなりすまし引き受けを本質的に防ぐものではありません。Cの最小権限はアクセス範囲を狭めるうえで重要ですが、ロールが誤って引き受けられること自体は防げません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html",
  },
  {
    id: "qb-d4-025",
    domain: 4,
    topic: "データ保護",
    type: "multiple",
    difficulty: "medium",
    question:
      "コンプライアンス要件により、あるS3バケットに保存するデータについて、保管時はカスタマーマネージドキーによる暗号化を行い、転送時は暗号化されていない接続からのリクエストを拒否する必要があります。実施すべき設定はどれですか。(2つ選択してください)",
    choices: [
      "バケットのデフォルト暗号化をSSE-KMS(カスタマーマネージドキー)に設定する",
      "AWS Certificate Managerで発行したTLS証明書をS3バケットにアタッチする",
      "Amazon Macieを有効化し、アップロードされたオブジェクトを自動的に暗号化する",
      "aws:SecureTransport条件がfalseのリクエストを拒否するステートメントをバケットポリシーに追加する",
      "バケットのブロックパブリックアクセスを有効化し、転送時の暗号化を強制する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。デフォルト暗号化をSSE-KMSのカスタマーマネージドキーに設定すると、新しいオブジェクトが保管時に指定キーで自動的に暗号化されます。また、aws:SecureTransport条件がfalseのリクエストを拒否するバケットポリシーにより、HTTPSでない暗号化されていない接続からのアクセスを拒否できます。Bが誤りである理由は、ACMの証明書をS3バケットにアタッチする機能は存在しないためです。CのMacieは機密データの検出サービスであり、オブジェクトの暗号化は行いません。Eのブロックパブリックアクセスは公開設定を防ぐ機能であり、転送時の暗号化の強制とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/security-best-practices.html",
  },
  {
    id: "qb-d4-026",
    domain: 4,
    topic: "Session Manager",
    type: "single",
    difficulty: "medium",
    question:
      "セキュリティ強化のため、EC2インスタンスへの管理者アクセスについて、SSHキーの配布・管理をなくし、インバウンドのSSHポート(22)を一切開かず、踏み台サーバーも用意せずにシェルアクセスを提供し、操作内容を監査ログとして記録したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "AWS Systems Manager Session Managerを使用し、SSMエージェントとIAM権限に基づいてシェルアクセスを提供する",
      "パブリックサブネットに踏み台(bastion)ホストを構築し、SSHキーで各インスタンスへの接続を集約する",
      "各インスタンスのセキュリティグループで、ポート22への接続を社内のIPアドレス範囲のみに許可する",
      "EC2 Instance Connectを使用し、一時的なSSHキーでインスタンスに接続する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS Systems Manager Session Managerは、インスタンス上のSSMエージェントがサービスへアウトバウンドで接続する仕組みのため、インバウンドポートを一切開かず、SSHキーや踏み台サーバーも使わずにシェルアクセスを提供できます。アクセスはIAMで制御し、セッションのログをCloudTrailやCloudWatch Logs、S3に記録できます。Bの踏み台ホストやCのポート22の制限は、いずれもSSHキーの管理やインバウンドポートの開放が残るため要件を満たしません。DのEC2 Instance Connectは接続時にセキュリティグループでインバウンドのSSH(ポート22)を許可する必要があり、ポートを一切開かないという要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html",
  },
  {
    id: "qb-d4-027",
    domain: 4,
    topic: "AWS Config アグリゲータ",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Organizationsで多数のアカウントと複数リージョンを運用する企業が、すべてのアカウント・リージョンにわたるAWS Configのリソース構成情報とルール準拠状況を、1か所の集約ビューで確認できるようにしたいと考えています。最も少ない運用負荷で実現する方法はどれですか。",
    choices: [
      "各メンバーアカウントのAWS Configコンソールに個別にサインインして、準拠状況を1つずつ確認する",
      "各アカウントのConfigデータをS3にエクスポートし、Amazon Athenaで結合クエリする基盤を自作する",
      "AWS Configのアグリゲータを作成し、AWS Organizations全体のアカウントとリージョンの構成・準拠データを単一のビューに集約する",
      "Amazon CloudWatchダッシュボードを作成し、各アカウントのConfigのメトリクスをまとめて表示する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Configのアグリゲータ(aggregator)は、複数のアカウントとリージョンのConfigの構成データとルール準拠状況を、単一のアカウント・ビューに集約する機能です。AWS Organizationsと統合すれば組織内の全アカウントを対象に自動で集約でき、アカウント追加にも追従するため運用負荷を最小にできます。Aの各アカウントを個別に確認する運用は負荷が高く、集約ビューになりません。Bの自作のエクスポート・Athena基盤は構築と保守の負荷が大きくなります。DのCloudWatchダッシュボードはメトリクスの可視化の仕組みであり、複数アカウントのリソース構成や準拠状況そのものを集約する機能ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/aggregate-data.html",
  },
  {
    id: "qb-d4-028",
    domain: 4,
    topic: "AWS WAF",
    type: "single",
    difficulty: "easy",
    question:
      "インターネットに公開しているWebアプリケーション(Application Load BalancerおよびAmazon CloudFrontで配信)に対する、SQLインジェクションやクロスサイトスクリプティングといった一般的なWeb攻撃を、マネージドなルールセットでフィルタリングして防御したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Shield Standardを有効化して、SQLインジェクションなどのアプリケーション層の攻撃をブロックする",
      "対象のCloudFront・ALBにAWS WAFを関連付け、AWSマネージドルール(SQLインジェクションや既知の不正入力など)を適用する",
      "セキュリティグループのルールで、HTTPおよびHTTPS以外のポートへのアクセスを拒否する",
      "Amazon GuardDutyを有効化して、悪意のあるWebリクエストを検出しインラインでブロックする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS WAFはCloudFront、Application Load Balancer、Amazon API GatewayなどにアタッチしてHTTP/HTTPSリクエストをルールで検査・フィルタリングするWebアプリケーションファイアウォールです。SQLインジェクションやクロスサイトスクリプティングなどの一般的な攻撃を、AWSマネージドルールを使って手軽に防御できます。AのShield StandardはL3/L4のDDoS攻撃からの保護が目的で、アプリケーション層の攻撃内容の検査は行いません。CのセキュリティグループはポートやIP単位の制御であり、リクエストのペイロードは検査できません。DのGuardDutyは脅威の検出サービスであり、Webリクエストをインラインでブロックする機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/what-is-aws-waf.html",
  },
  {
    id: "qb-d4-029",
    domain: 4,
    topic: "GuardDuty",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、EC2インスタンスの暗号通貨マイニングへの悪用、漏えいした認証情報の不正利用、通常と異なるAPI呼び出しといった脅威を、エージェントの導入やログ分析基盤の構築なしに継続的に検出したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "Amazon Macie",
      "AWS WAF",
      "Amazon Inspector",
      "Amazon GuardDuty",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。GuardDutyはCloudTrailイベント、VPCフローログ、DNSクエリログなどのデータソースを機械学習と脅威インテリジェンスで自動分析し、暗号通貨マイニングや認証情報の不正利用などの脅威を継続的に検出するマネージドサービスで、エージェントの導入やログ基盤の構築は不要です。Aが誤りである理由は、MacieはS3に保存された機密データ(個人情報など)の検出を目的とするサービスであるためです。BのWAFはWebアプリケーションへのリクエストをルールでフィルタリングするサービスで、アカウント全体の脅威検出は行いません。CのInspectorはEC2やコンテナイメージの脆弱性評価が目的で、進行中の脅威の検出ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.html",
  },
  {
    id: "qb-d4-030",
    domain: 4,
    topic: "GuardDuty自動修復",
    type: "single",
    difficulty: "medium",
    question:
      "Amazon GuardDutyがEC2インスタンスの暗号通貨マイニング活動を検出しました。セキュリティチームは今後、同じタイプの検出結果が発生した際に、該当インスタンスを隔離用のセキュリティグループへ自動的に付け替え、担当者に通知する対応を自動化したいと考えています。最も適切な構成はどれですか。",
    choices: [
      "GuardDutyの検出結果にマッチするAmazon EventBridgeルールを作成し、隔離処理を行うAWS Lambda関数とAmazon SNSトピックをターゲットに設定する",
      "GuardDutyの自動修復機能を有効化し、修復アクションとして隔離を選択する",
      "AWS Trusted Advisorのセキュリティチェックの通知を受けて、担当者が手動で対応する",
      "AWS Configの修復アクションにGuardDutyの検出結果を関連付けて修復する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。GuardDutyの検出結果はAmazon EventBridgeにイベントとして配信されます。検出タイプなどの条件でマッチするEventBridgeルールを作成し、セキュリティグループを付け替えるLambda関数と通知用のSNSトピックをターゲットに設定すれば、隔離と通知を自動化できます。Bが誤りである理由は、GuardDuty自体には修復を実行する組み込み機能がないためです。CのTrusted Advisorはベストプラクティスのチェックが目的で、GuardDutyの検出結果への対応はできず、手動対応は自動化の要件も満たしません。DのAWS Configの修復アクションはConfigルールの非準拠リソースに対する仕組みであり、GuardDutyの検出結果を直接のトリガーにはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings_cloudwatch.html",
  },
  {
    id: "qb-d4-031",
    domain: 4,
    topic: "MacieとInspector",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のセキュリティチームには、(1)S3バケットに保存されたデータに含まれる個人情報(PII)の自動検出と、(2)EC2インスタンスおよびECRコンテナイメージのソフトウェア脆弱性(CVE)の継続的なスキャンという2つの要件があります。適切な対応はどれですか。(2つ選択してください)",
    choices: [
      "Amazon GuardDutyのS3保護を有効化して、オブジェクト内の個人情報を検出する",
      "AWS Shield AdvancedでEC2インスタンスの脆弱性をスキャンする",
      "Amazon Macieを有効化して、S3バケット内の機密データを自動検出する",
      "AWS WAFのマネージドルールでECRのコンテナイメージを検査する",
      "Amazon Inspectorを有効化して、EC2インスタンスとECRイメージの脆弱性を継続的にスキャンする",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。MacieはS3に保存されたデータを機械学習とパターンマッチングで分析し、個人情報などの機密データを自動検出するサービスです。InspectorはEC2インスタンスとECRコンテナイメージのCVE脆弱性や意図しないネットワーク公開を継続的にスキャンします。Aが誤りである理由は、GuardDutyのS3保護はS3への不審なアクセスなど脅威の検出であり、保存データの内容からPIIを検出する機能ではないためです。BのShield AdvancedはDDoS攻撃からの保護サービスであり、脆弱性スキャンは行いません。DのWAFはWebリクエストのフィルタリングであり、コンテナイメージを検査する機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/macie/latest/user/what-is-macie.html",
  },
  {
    id: "qb-d4-032",
    domain: 4,
    topic: "Security Hub",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Organizationsで複数のアカウントとリージョンを運用する企業が、GuardDuty、Inspector、Macie、AWS Configの検出結果を1か所に集約し、CIS AWS Foundations Benchmarkなどのセキュリティ基準に対する準拠状況を継続的に確認したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "各セキュリティサービスのコンソールをアカウントごとに定期的に確認する運用手順を整備する",
      "すべての検出結果をS3にエクスポートし、Amazon Athenaで横断検索できる基盤を構築する",
      "AWS Security Hubを有効化して委任管理者アカウントに全アカウント・全リージョンの検出結果を集約し、セキュリティ基準を有効化する",
      "Amazon CloudWatchの複合アラームを作成し、全サービスの検出結果を監視する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Security HubはGuardDuty、Inspector、Macie、AWS Configなどの検出結果を標準化された形式で自動的に集約し、委任管理者アカウントで複数アカウント・複数リージョンの結果を一元管理できます。CIS AWS Foundations Benchmarkなどのセキュリティ基準に基づく自動チェックと準拠状況の継続的な確認も提供します。Aが誤りである理由は、手動確認では継続的な集約にならず、運用負荷も高いためです。BのS3とAthenaによる自作基盤は構築・保守の負荷が大きく、セキュリティ基準の準拠チェック機能も自前で実装する必要があります。DのCloudWatch複合アラームはメトリクスの状態監視の仕組みであり、各サービスの検出結果の集約や基準評価はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/what-is-securityhub.html",
  },
];
