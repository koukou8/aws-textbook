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
    topic: "KMSトラブルシューティング",
    type: "single",
    difficulty: "hard",
    question:
      "KMSカスタマーマネージドキーで暗号化されたEBSルートボリュームを持つEC2インスタンスが、起動操作の直後に停止してしまい、正常に起動できません。CloudTrailには該当キーに対するKMS API呼び出しの失敗が記録されています。最も可能性の高い原因はどれですか。",
    choices: [
      "EBSボリュームのIOPS上限に達しており、読み取りがスロットリングされているため",
      "暗号化に使用されたKMSキーが無効化されているか削除保留中であり、ボリュームの復号に必要なデータキーを取得できないため",
      "インスタンスにインスタンスプロファイルがアタッチされておらず、EC2サービスがKMSを呼び出せないため",
      "EBSボリュームとKMSキーが異なるアベイラビリティーゾーンに存在しているため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。暗号化されたEBSボリュームを使用するインスタンスの起動には、KMSキーによるデータキーの復号が必要です。キーが無効化または削除保留中の場合はこの復号が失敗し、インスタンスは起動直後に停止状態になります。キーを再有効化(または削除をキャンセル)することで復旧できます。Aが誤りである理由は、IOPSのスロットリングは性能低下の原因にはなってもKMS APIの失敗や起動不能にはつながらないためです。CのEBS暗号化のためのKMS呼び出しはEC2サービスがグラントを通じて行うため、インスタンスプロファイルは必要ありません。DのKMSキーはリージョン単位のリソースであり、アベイラビリティーゾーンという概念はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/enabling-keys.html",
  },
  {
    id: "qb-d4-024",
    domain: 4,
    topic: "S3暗号化",
    type: "single",
    difficulty: "hard",
    question:
      "開発者が、SSE-KMS(カスタマーマネージドキー)で暗号化されたオブジェクトをS3バケットからダウンロードしようとするとAccessDeniedになります。開発者のIAMポリシーには対象バケットへのs3:GetObject許可があり、バケットポリシーに拒否ステートメントはありません。同じバケットの暗号化されていないオブジェクトは正常に取得できます。最も可能性の高い原因はどれですか。",
    choices: [
      "SSE-KMSで暗号化されたオブジェクトの取得には、s3:GetObjectVersion権限も必要であるため",
      "バケットのブロックパブリックアクセス設定がGetObjectリクエストをブロックしているため",
      "SSE-KMSで暗号化されたオブジェクトは、バケット所有者以外は取得できない仕様のため",
      "開発者に、暗号化に使用されたKMSキーに対するkms:Decrypt権限がないため",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。SSE-KMSで暗号化されたオブジェクトを取得するには、s3:GetObjectに加えて、暗号化に使用されたKMSキーに対するkms:Decrypt権限が必要です。暗号化されていないオブジェクトは取得できていることから、S3側の権限は正常であり、KMS権限の不足が原因と切り分けられます。Aが誤りである理由は、s3:GetObjectVersionは特定バージョンの取得に必要な権限であり、暗号化の有無とは無関係のためです。BのブロックパブリックアクセスはパブリックなポリシーやACLを制限する機能で、認証済みプリンシパルの正当なアクセスは妨げません。CのSSE-KMSにバケット所有者しか取得できないという仕様はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/UsingKMSEncryption.html",
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
    topic: "ACM",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のWebサイトで使用しているAWS Certificate Manager(ACM)発行のパブリック証明書について、有効期限が近づくたびに更新失敗の警告が届き、毎回手動での対応が発生しています。確認したところ、証明書はEメール検証で発行されていました。今後、手動対応なしで証明書が自動更新されるようにする最も適切な方法はどれですか。",
    choices: [
      "DNS検証を使用する証明書に切り替え、検証用のCNAMEレコードをRoute 53のホストゾーンに維持する",
      "証明書の有効期間を10年に延長するようAWSサポートへ申請する",
      "サードパーティCAから証明書を毎年購入し、ACMにインポートして使用する",
      "ワイルドカード証明書に変更して、証明書の更新頻度を減らす",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ACMのマネージド更新では、DNS検証の証明書は検証用CNAMEレコードがDNSに存在し続ける限り完全に自動で更新されます。一方、Eメール検証では更新時に承認メールへの応答が必要になる場合があり、手動対応が発生します。Bが誤りである理由は、ACM発行のパブリック証明書の有効期間は固定であり、延長を申請する仕組みはないためです。Cのインポートした証明書はACMのマネージド更新の対象外であり、毎年の購入とインポートというさらに大きな手動作業が発生します。Dのワイルドカード証明書は対象ドメインの範囲を広げるだけで、更新が自動化されるわけではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/managed-renewal.html",
  },
  {
    id: "qb-d4-027",
    domain: 4,
    topic: "ACM",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、Amazon CloudFrontディストリビューションのカスタムドメインにACM証明書を関連付けようとしていますが、ap-northeast-1リージョンで発行済みの証明書が設定画面の候補に表示されません。最も可能性の高い原因はどれですか。",
    choices: [
      "証明書がワイルドカード証明書として発行されていないため",
      "CloudFrontはACM証明書をサポートしておらず、IAM証明書ストアの証明書のみ使用できるため",
      "CloudFrontで使用する証明書は、us-east-1(バージニア北部)リージョンのACMで発行またはインポートされている必要があるため",
      "証明書がDNS検証で発行されており、CloudFrontはEメール検証の証明書のみをサポートするため",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。CloudFrontはグローバルサービスであり、ディストリビューションに関連付けるACM証明書はus-east-1(バージニア北部)リージョンで発行またはインポートされたものに限られます。他のリージョンにある証明書は候補に表示されないため、us-east-1で証明書を取得し直す必要があります。Aが誤りである理由は、ワイルドカードかどうかは関連付けの可否に影響しないためです。BのCloudFrontはACM証明書を完全にサポートしています。Dの検証方法(DNS検証・Eメール検証)は証明書発行時の所有権確認手段の違いであり、CloudFrontで使用できるかどうかとは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html",
  },
  {
    id: "qb-d4-028",
    domain: 4,
    topic: "Secrets Manager",
    type: "single",
    difficulty: "easy",
    question:
      "あるアプリケーションはAmazon RDS for MySQLの認証情報を使用しています。セキュリティ要件により、認証情報を暗号化して一元管理し、30日ごとに自動的にローテーションする必要があります。最も少ない開発工数で実現する方法はどれですか。",
    choices: [
      "Systems Manager Parameter StoreのSecureStringに保存し、ローテーション用のLambda関数とスケジュールを自作する",
      "AWS Secrets Managerに認証情報を保存し、RDS向けのマネージドローテーションを30日間隔で有効化する",
      "認証情報をKMSで暗号化してS3バケットに保存し、バージョニングで世代管理する",
      "認証情報をAMIに含めておき、インスタンスの起動時に読み込ませる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Secrets ManagerはRDSなどのデータベースと統合されたマネージドローテーション機能を持ち、ローテーション用Lambda関数のセットアップからデータベース側のパスワード変更までを自動化できるため、開発工数を最小にできます。Aが誤りである理由は、Parameter Storeにはネイティブの自動ローテーション機能がなく、ローテーションの仕組み全体を自作・保守する必要があるためです。CのS3への保存は、取得・更新・ローテーションのロジックをすべて自前で実装することになります。DのAMIへの認証情報の埋め込みは、ローテーションのたびにAMIの再作成が必要になるうえ、漏えいリスクの高いアンチパターンです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/rotating-secrets.html",
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
