// SAA-C03 分野1「セキュアなアーキテクチャの設計」の章末確認問題(全29問)
export const questions = [
  // ===== 第1章: セキュアなアクセス設計 — IAMとマルチアカウント =====
  {
    id: "saa-d1-ch01-q01",
    domain: 1,
    topic: "IAMポリシー評価",
    type: "single",
    difficulty: "easy",
    question:
      "あるソリューションアーキテクトが、IAMユーザーに特定のS3バケットへのフルアクセスを許可するポリシーを直接アタッチしました。しかし、このユーザーが所属するIAMグループには、同じバケットへのすべてのS3アクションを明示的に拒否するポリシーがアタッチされています。このユーザーが該当バケットのオブジェクトを取得しようとした場合、どうなりますか。",
    choices: [
      "ユーザーに直接アタッチされたポリシーがグループのポリシーより優先されるため、アクセスは許可される",
      "明示的な拒否は常に許可より優先されるため、アクセスは拒否される",
      "ポリシーが評価された順序によって結果が変わる",
      "許可と拒否が競合した場合はMFA認証の有無によって判定される",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。IAMのポリシー評価では、プリンシパルに適用されるすべてのポリシー(直接アタッチ・グループ経由の両方)が合わせて評価され、1つでも明示的な拒否があれば、他にどれだけ許可があってもリクエストは拒否されます。Aは誤りで、アタッチ先(ユーザー直接かグループか)によるポリシーの優先順位は存在しません。Cも誤りで、ポリシー評価に順序や先勝ち・後勝ちの概念はありません。DのMFAはポリシーのCondition要素で要求できる条件の1つであり、許可と拒否の競合を解決する仕組みではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
  },
  {
    id: "saa-d1-ch01-q02",
    domain: 1,
    topic: "IAMロール",
    type: "single",
    difficulty: "easy",
    question:
      "あるWebアプリケーションをAmazon EC2で稼働させており、アプリケーションからAmazon S3バケットへファイルをアップロードする必要があります。認証情報の管理について、セキュリティのベストプラクティスに従った方法はどれですか。",
    choices: [
      "IAMユーザーのアクセスキーを作成し、AMIに埋め込んで各インスタンスに展開する",
      "IAMユーザーのアクセスキーを作成し、インスタンスの環境変数に設定する",
      "S3へのアクセスを許可したIAMロールを作成し、インスタンスプロファイルとしてEC2にアタッチする",
      "S3バケットポリシーでEC2インスタンスのパブリックIPアドレスからのアクセスを許可する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2上のアプリケーションにAWSリソースへのアクセスを許可するには、IAMロールをインスタンスプロファイルとしてアタッチする方法がベストプラクティスです。STSが発行する一時的な認証情報が自動的にローテーションされ、キー漏えいのリスクと管理負荷がなくなります。AとBは長期的なアクセスキーをAMIや環境変数に保存する方法であり、漏えいリスクと手動ローテーションの負担があるため不適切です。DはIPアドレスベースの制御で認証情報管理の問題を解決しておらず、インスタンスの入れ替えでIPが変わると機能しなくなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html",
  },
  {
    id: "saa-d1-ch01-q03",
    domain: 1,
    topic: "クロスアカウントアクセス",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では開発用と本番用のAWSアカウントを分離しています。開発アカウントの管理者数名が、本番アカウントのリソースを一時的に操作できるようにする必要があります。セキュリティのベストプラクティスに従った方法はどれですか。",
    choices: [
      "本番アカウントにIAMロールを作成して信頼ポリシーで開発アカウントを信頼し、管理者にsts:AssumeRoleを許可する",
      "本番アカウントにIAMユーザーを作成し、アクセスキーを開発アカウントの管理者に配布する",
      "開発アカウントのIAMユーザーを本番アカウントのIAMグループに追加する",
      "本番アカウントのルートユーザーの認証情報を開発アカウントの管理者と共有する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。クロスアカウントアクセスの標準パターンは、アクセスされる側(本番)にIAMロールを作成して必要最小限の権限を与え、信頼ポリシーでアクセスする側(開発)を信頼し、開発側のプリンシパルにsts:AssumeRoleを許可する構成です。操作はすべて一時認証情報で行われ、CloudTrailで監査もできます。Bはアクセスキーという長期認証情報の配布となり、漏えいリスクがあるため不適切です。CのIAMユーザーを別アカウントのIAMグループに追加することは仕様上できません。Dのルートユーザー認証情報の共有は最も避けるべき行為です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html",
  },
  {
    id: "saa-d1-ch01-q04",
    domain: 1,
    topic: "STSと外部ID",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、サードパーティーの監視SaaSに自社AWSアカウント内のリソースの読み取りアクセスを許可することになりました。このSaaSは多数の顧客のAWSアカウントに同じ仕組みでアクセスします。「混乱した代理(confused deputy)」問題を防ぐために推奨される構成はどれですか。",
    choices: [
      "SaaS事業者専用のIAMユーザーを作成し、アクセスキーを定期的にローテーションして共有する",
      "クロスアカウントロールの信頼ポリシーでMFAデバイスの使用を必須にする",
      "SCPでSaaS事業者のAWSアカウントからのアクセスを明示的に許可する",
      "クロスアカウントロールの信頼ポリシーで、SaaS事業者が指定する一意の外部ID(ExternalId)の一致を必須にする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。サードパーティーにロールを引き受けさせる構成では、信頼ポリシーのsts:ExternalId条件で顧客ごとに一意の外部IDを要求します。これにより、攻撃者が他顧客のロールARNを指定してSaaS経由で不正にロールを引き受ける「混乱した代理」問題を防げます。Aはアクセスキーという長期認証情報の共有となり、ベストプラクティスに反します。BのMFAは人間のユーザーによる対話的なアクセス向けであり、SaaSからの自動アクセスには適用できません。CのSCPは自組織のアカウントに対するガードレールであり、外部の第三者のなりすまし防止には機能しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html",
  },
  {
    id: "saa-d1-ch01-q05",
    domain: 1,
    topic: "IAM Identity Center",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Organizationsで50個のAWSアカウントを管理しており、従業員はオンプレミスのMicrosoft Active Directoryで管理されています。従業員が既存のAD認証情報を使ってすべてのアカウントにシングルサインオンできるようにしたいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "各AWSアカウントに従業員ごとのIAMユーザーを作成し、パスワードポリシーを統一する",
      "IAM Identity Centerを有効化し、AD Connectorを介して既存のActive Directoryをアイデンティティソースとして接続する",
      "Amazon Cognitoユーザープールを作成し、従業員を移行して各アカウントへのアクセスを構成する",
      "50個の各アカウントで個別にSAML 2.0フェデレーションを設定し、ADFSと連携する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。IAM Identity CenterはOrganizations内の複数アカウントへのシングルサインオンと許可セットによる権限管理を一元化でき、AD Connector等を介して既存のActive Directoryをアイデンティティソースにできます。既存のAD認証情報がそのまま使え、運用負荷が最小です。Aはアカウント数×従業員数のIAMユーザー管理が必要になり、負荷が非常に大きくなります。CのCognitoはアプリケーションの一般利用者向けの認証サービスであり、従業員のAWSアカウントアクセス管理には不向きです。Dは50アカウントそれぞれで設定と保守が必要で、運用負荷が高くなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/what-is.html",
  },
  {
    id: "saa-d1-ch01-q06",
    domain: 1,
    topic: "SCP",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、AWS Organizations配下のすべてのメンバーアカウントで、データ主権の要件により承認された2つのリージョン以外でのリソース作成を防止する必要があります。最小の運用負荷で実現する方法はどれですか。",
    choices: [
      "各アカウントのすべてのIAMユーザー・ロールに、リージョンを制限するIAMポリシーをアタッチする",
      "AWS Configルールで承認外リージョンのリソースを検出し、管理者が手動で削除する",
      "組織のルート(またはOU)に、承認リージョン以外へのリクエストを拒否するSCPを適用する",
      "CloudTrailログをAmazon EventBridgeで監視し、AWS Lambdaで承認外リージョンのリソースを自動削除する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。SCPは組織のルートやOUに適用するだけで、配下の全メンバーアカウントのすべてのIAMユーザー・ロール(メンバーアカウントのルートユーザーを含む)に権限の上限を強制できます。aws:RequestedRegion条件で承認リージョン以外のアクションを拒否するSCPを1つ適用すれば、最小の運用負荷で予防的に統制できます。Aは全アカウントの全プリンシパルへのポリシー配布と維持が必要で負荷が高く、アカウント側で変更されるおそれもあります。BとDは事後に検出・対応する発見的な仕組みであり、リソースの作成自体を防止できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "saa-d1-ch01-q07",
    domain: 1,
    topic: "SCP",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Organizationsの管理者が、あるOUに「Amazon S3とAmazon EC2の関連アクションのみを許可する」SCPを適用しました。このOU内のメンバーアカウントのIAMユーザーには、Amazon DynamoDBへのフルアクセスを許可するIAMポリシーがアタッチされています。このユーザーがDynamoDBテーブルを操作しようとするとどうなりますか。",
    choices: [
      "SCPで許可されていないため、アクセスは拒否される",
      "IAMポリシーで明示的に許可されているため、アクセスできる",
      "SCPはIAMユーザーには適用されないため、アクセスできる",
      "SCPとIAMポリシーでは、より後に作成されたポリシーが優先される",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。SCPはアカウントが使用できるアクションの上限(ガードレール)を定義し、実際に許可されるのはSCPとIAMポリシーの両方で許可されたアクションだけです。SCPがS3とEC2のみを許可している場合、IAMポリシーでDynamoDBが許可されていてもアクセスは拒否されます。Bは誤りで、IAMポリシーの許可はSCPが定める上限を超えられません。Cも誤りで、SCPはメンバーアカウント内のすべてのIAMユーザー・ロールに適用されます(適用されないのは管理アカウントです)。Dのような作成時期による優先順位のルールは存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
  },
  {
    id: "saa-d1-ch01-q08",
    domain: 1,
    topic: "Control Tower",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がAWSの利用を開始するにあたり、ベストプラクティスに沿ったマルチアカウント環境(ログの集約、ガードレール、アカウント払い出しの仕組みを含む)を最小の労力で構築したいと考えています。どのサービスを使用すべきですか。",
    choices: [
      "AWS CloudFormation StackSetsで独自のアカウント標準化テンプレートを展開する",
      "AWS Configの適合パックを各アカウントに手動でデプロイする",
      "AWS Systems Managerで全アカウントの構成を一元管理する",
      "AWS Control Towerでランディングゾーンをセットアップする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS Control Towerは、Organizations、IAM Identity Center、CloudTrail、AWS Configなどを組み合わせたランディングゾーン(ベストプラクティス準拠のマルチアカウント環境)を自動でセットアップし、予防的・発見的コントロール(ガードレール)の適用やAccount Factoryによる統制されたアカウント払い出しまで提供します。AのStackSetsはテンプレートの設計・保守を自前で行う必要があり、労力が大きくなります。BのConfig適合パックは発見的統制のみで環境全体の構築はできません。CのSystems Managerは運用管理のサービスであり、マルチアカウント環境の構築は目的が異なります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/controltower/latest/userguide/what-is-control-tower.html",
  },
  {
    id: "saa-d1-ch01-q09",
    domain: 1,
    topic: "クロスアカウントアクセス",
    type: "multiple",
    difficulty: "hard",
    question:
      "開発アカウントのEC2上のアプリケーションが、本番アカウントのS3バケットにオブジェクトを書き込む必要があります。セキュリティのベストプラクティスに従ってクロスアカウントアクセスを構成する手順はどれですか。(2つ選択してください)",
    choices: [
      "開発アカウントのEC2にアタッチしたIAMロールに、本番アカウントのロールを引き受けるsts:AssumeRole権限を付与する",
      "本番アカウントでIAMユーザーを作成し、そのアクセスキーを開発アカウントのアプリケーションに設定する",
      "本番アカウントにS3への書き込み権限を持つIAMロールを作成し、信頼ポリシーで開発アカウントを信頼する",
      "本番アカウントのS3バケットでブロックパブリックアクセスを無効化し、バケットACLで書き込みを許可する",
      "開発アカウントと本番アカウントのVPC間にピアリング接続を作成する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。クロスアカウントアクセスは、(1)アクセスされる側の本番アカウントに必要最小限の権限を持つIAMロールを作成して信頼ポリシーで開発アカウントを信頼し、(2)アクセスする側である開発アカウントのプリンシパル(EC2のロール)にそのロールへのsts:AssumeRoleを許可する、という2つの設定の組み合わせで成立します。Bは長期認証情報の埋め込みでありベストプラクティスに反します。Dはパブリックアクセスの許可につながる危険な設定で、アカウント間のアクセス制御にもなりません。EのVPCピアリングはネットワーク経路の接続であり、S3 APIへのアクセス許可の問題は解決しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html",
  },
  {
    id: "saa-d1-ch01-q10",
    domain: 1,
    topic: "IAMベストプラクティス",
    type: "multiple",
    difficulty: "medium",
    question:
      "新しいAWSアカウントをセットアップしたソリューションアーキテクトが、ルートユーザーを保護するために実施すべきベストプラクティスはどれですか。(2つ選択してください)",
    choices: [
      "ルートユーザーの権限をIAMポリシーで読み取り専用に制限する",
      "ルートユーザーにMFA(多要素認証)を有効化する",
      "ルートユーザーのアクセスキーを作成し、AWS Secrets Managerで自動ローテーションする",
      "ルートユーザーのアクセスキーは作成せず(存在する場合は削除し)、日常業務にはIAMロールベースのアクセスを使用する",
      "IAMパスワードポリシーを設定してルートユーザーのパスワードを定期的に自動失効させる",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。ルートユーザーはアカウントの全権限を持つため、MFAを有効化して認証を強化し、アクセスキーは作成せず(存在すれば削除し)、日常業務にはIAMロールやIAM Identity Center経由のアクセスを使用するのがベストプラクティスです。Aは誤りで、ルートユーザーの権限はIAMポリシーでは制限できません(メンバーアカウントであればSCPで制限できます)。Cはルートの長期認証情報を増やす行為であり逆効果です。EのIAMパスワードポリシーが適用されるのはIAMユーザーであり、ルートユーザーには適用されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/root-user-best-practices.html",
  },

  // ===== 第2章: データ保護の設計 — 暗号化とシークレット管理 =====
  {
    id: "saa-d1-ch02-q01",
    domain: 1,
    topic: "KMS",
    type: "single",
    difficulty: "medium",
    question:
      "ある金融企業では、Amazon S3に保存する顧客データの暗号化について、キーポリシーで利用可能なプリンシパルを自社で制御し、キーの使用履歴をAWS CloudTrailで監査し、ローテーションのスケジュールも自社で管理することが求められています。要件を満たす暗号化方式はどれですか。",
    choices: [
      "SSE-S3(Amazon S3マネージドキーによるサーバー側暗号化)",
      "SSE-KMS(AWSマネージドキー aws/s3 を使用)",
      "SSE-KMS(カスタマーマネージドキーを使用)",
      "アプリケーション側で独自に鍵管理基盤を構築するクライアントサイド暗号化",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。カスタマーマネージドキーは利用者自身が作成・所有するKMSキーで、キーポリシーの編集による利用者制御、CloudTrailによる使用履歴の監査、ローテーション設定(自動ローテーションの有効化や期間指定)の管理をすべて自社で行えます。AのSSE-S3はキー管理がS3側で完結し、キーポリシーによる制御ができません。BのAWSマネージドキーは使用の監査はできますが、キーポリシーの編集やローテーションの管理は自社で制御できません。Dは要件自体は満たせても、鍵管理基盤の構築・運用の負荷が大きく、KMSで満たせる要件に対して過剰です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/concepts.html",
  },
  {
    id: "saa-d1-ch02-q02",
    domain: 1,
    topic: "KMS",
    type: "single",
    difficulty: "medium",
    question:
      "AWS KMSのエンベロープ暗号化に関する説明として正しいものはどれですか。",
    choices: [
      "暗号化対象のデータをKMSに送信し、KMSキーで直接暗号化する方式である",
      "データはローカルでデータキーにより暗号化し、そのデータキーをKMSキーで暗号化して暗号化済みデータとともに保存する方式である",
      "KMSキーそのものをアプリケーションサーバーにダウンロードしてデータを暗号化する方式である",
      "マルチリージョンキーを作成した場合にのみ利用できる暗号化方式である",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。エンベロープ暗号化では、GenerateDataKey APIで取得したデータキーを使ってデータをローカルで暗号化し、平文のデータキーは破棄して、KMSキーで暗号化されたデータキーを暗号化済みデータとともに保存します。復号時は暗号化済みデータキーをKMSで復号してから使用します。Aは誤りで、KMSキーによる直接暗号化は4KB以下のデータに限られ、大きなデータをKMSへ送信する方式は取りません。Cも誤りで、KMSキー自体をKMSの外へダウンロードすることはできません。Dのマルチリージョンキー限定という制約は存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/concepts.html",
  },
  {
    id: "saa-d1-ch02-q03",
    domain: 1,
    topic: "RDS暗号化",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業で、暗号化されていない既存のAmazon RDS for MySQLインスタンスに対して、コンプライアンス要件により保管中の暗号化を有効にする必要が生じました。適切な対応はどれですか。",
    choices: [
      "RDSインスタンスの変更(Modify)で暗号化オプションを有効化し、次のメンテナンスウィンドウで適用する",
      "暗号化を有効にしたリードレプリカを作成し、プライマリに昇格させる",
      "AWS Backupで暗号化バックアップを取得し、既存インスタンスに上書き復元する",
      "スナップショットを取得し、KMSキーを指定して暗号化されたコピーを作成し、そのコピーから新しいインスタンスを復元する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。RDSの保管中の暗号化はDBインスタンスの作成時にのみ有効化できるため、既存の非暗号化インスタンスでは、スナップショットを取得し、KMSキーを指定して暗号化されたコピーを作成し、そのコピーから新しいインスタンスを復元する手順を取ります。Aのような既存インスタンスの設定変更による暗号化の後付けはサポートされていません。Bも誤りで、非暗号化のプライマリから暗号化されたリードレプリカを直接作成することはできません。CのAWS Backupにも、既存インスタンスを稼働したまま暗号化状態へ上書き変換する機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Overview.Encryption.html",
  },
  {
    id: "saa-d1-ch02-q04",
    domain: 1,
    topic: "ACM",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がApplication Load Balancerの背後でWebアプリケーションを公開します。HTTPS用のTLS証明書を最小の運用負荷で調達・管理する方法はどれですか。",
    choices: [
      "AWS Certificate Manager(ACM)でDNS検証のパブリック証明書を発行し、ALBのHTTPSリスナーに関連付ける",
      "サードパーティー認証局から証明書を購入し、毎年手動で更新してALBにインポートする",
      "自己署名証明書を作成してALBにインポートする",
      "AWS Private CAでプライベート証明書を発行し、有効期限ごとに手動でALBに再インポートする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ACMのパブリック証明書は無料で発行でき、ALBのHTTPSリスナーに直接関連付けられます。DNS検証を使用すると、検証用CNAMEレコードが維持されている限り有効期限前に自動更新されるため、証明書管理の運用負荷がほぼゼロになります。Bは購入費用に加えて毎年の手動更新・インポート作業が発生します。Cの自己署名証明書はブラウザに信頼されず警告が表示されるため、公開Webサイトには不適切です。DのAWS Private CAは社内システム向けのプライベート証明書基盤で月額費用がかかり、公開サイトには不適切なうえ手動更新の負荷も残ります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/acm-overview.html",
  },
  {
    id: "saa-d1-ch02-q05",
    domain: 1,
    topic: "S3暗号化",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、1日あたり数百万個のオブジェクトをSSE-KMS(カスタマーマネージドキー)で暗号化してAmazon S3に保存しており、AWS KMSへのAPIリクエスト料金が増大しています。カスタマーマネージドキーによる暗号化と監査の要件を維持したまま、最もコスト効率よくKMS関連コストを削減する方法はどれですか。",
    choices: [
      "バケットでS3バケットキー(S3 Bucket Keys)を有効化する",
      "暗号化方式をSSE-S3に切り替える",
      "KMSキーを複数作成し、オブジェクトのプレフィックスごとにリクエストを分散する",
      "オブジェクトをアーカイブにまとめてからアップロードするバッチ処理をEC2で実装する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。S3バケットキーを有効化すると、S3がKMSから取得したバケットレベルの短期キーを一定期間再利用してオブジェクトを暗号化するため、オブジェクトごとのKMS API呼び出しが大幅に減り、SSE-KMSのリクエストコストを大きく削減できます。暗号化方式はSSE-KMSのままで、カスタマーマネージドキーによる制御・監査の要件も維持されます。BのSSE-S3への切り替えは、キーポリシーによる制御や個別監査という要件を満たさなくなります。Cのキー分散はスロットリング対策にはなりますが、リクエスト数自体は減らずコストも下がりません。Dはアプリケーションの大幅な変更と自前バッチの運用負荷が発生します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/bucket-key.html",
  },
  {
    id: "saa-d1-ch02-q06",
    domain: 1,
    topic: "Secrets Manager",
    type: "single",
    difficulty: "easy",
    question:
      "あるアプリケーションはAmazon RDS for MySQLの認証情報を安全に保存し、コンプライアンス要件として90日ごとの自動ローテーションが求められています。最小の運用負荷で要件を満たすサービスはどれですか。",
    choices: [
      "AWS Systems Manager Parameter StoreのSecureStringに保存し、ローテーション用のLambda関数を自作する",
      "AWS Secrets Managerに保存し、RDS向けのマネージドローテーションを有効化する",
      "AWS KMSでパスワードを暗号化し、Amazon S3バケットに保存する",
      "Amazon DynamoDBにKMS暗号化で保存し、TTLで定期的に失効させる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Secrets ManagerはRDSなどのデータベース認証情報に対するマネージドローテーションを標準機能として提供しており、日数のスケジュールを設定するだけでパスワードの変更とシークレットの更新が自動実行されます。AのParameter StoreのSecureStringは安全な保存はできますが、ネイティブのローテーション機能がなく、Lambda関数の自作・保守が必要で運用負荷が高くなります。CのKMSとS3の組み合わせには、保存した値をローテーションする仕組みがありません。DのDynamoDBとTTLは古い項目の削除はできても、新しい認証情報の生成とデータベースへの反映は自動化されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/rotating-secrets.html",
  },
  {
    id: "saa-d1-ch02-q07",
    domain: 1,
    topic: "Macie",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、複数のAmazon S3バケットに保存された大量のデータに個人情報(PII)や機密情報が含まれていないかを機械学習で継続的に検出し、コンプライアンス部門に報告する必要があります。どのサービスを使用すべきですか。",
    choices: [
      "Amazon Inspector",
      "Amazon GuardDuty",
      "AWS Config",
      "Amazon Macie",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Amazon Macieは機械学習とパターンマッチングにより、S3バケット内の個人情報(PII)や機密データを自動的に検出・分類し、結果をレポートできるマネージドサービスで、継続的なコンプライアンス監査に適しています。AのAmazon InspectorはEC2、ECRイメージ、Lambda関数のソフトウェア脆弱性や意図しないネットワーク公開を検出するサービスで、データの内容は分析しません。BのGuardDutyは不正アクセスなどの脅威を検出するサービスで、保存データの分類は行いません。CのAWS Configはリソース構成の記録・評価が目的で、オブジェクトの中身は対象外です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/macie/latest/user/what-is-macie.html",
  },
  {
    id: "saa-d1-ch02-q08",
    domain: 1,
    topic: "暗号化(転送中・保管中)",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のWebアプリケーション(ALB、EC2、RDSで構成)について、転送中および保管中のデータ暗号化を実装する必要があります。要件の実現に有効な対策はどれですか。(2つ選択してください)",
    choices: [
      "セキュリティグループでポート443のインバウンドを許可し、通信を自動的に暗号化する",
      "ACMのパブリック証明書をALBのHTTPSリスナーに関連付けてTLS通信を構成する",
      "RDSのMulti-AZ配置を有効化してスタンバイへのレプリケーションを保護する",
      "RDSインスタンスの作成時にAWS KMSによる保管中の暗号化を有効化する",
      "EC2インスタンスにElastic IPアドレスを割り当てて通信経路を固定する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。転送中の暗号化は、ACMのパブリック証明書をALBのHTTPSリスナーに関連付けてクライアントとの通信をTLS化することで実現します。保管中の暗号化は、RDSインスタンス作成時にKMSによる暗号化を有効化することで実現し、データに加えて自動バックアップ・スナップショット・レプリカも暗号化されます。Aは誤りで、ポート443を許可しただけでは暗号化されず、TLSには証明書の構成が必要です。CのMulti-AZは可用性向上のための機能であり、暗号化の要件とは無関係です。EのElastic IPはパブリックIPアドレスの固定であり、通信の保護にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/acm-overview.html",
  },
  {
    id: "saa-d1-ch02-q09",
    domain: 1,
    topic: "KMSキーポリシー",
    type: "single",
    difficulty: "hard",
    question:
      "アカウントAの管理者が、カスタマーマネージドKMSキーで暗号化したAmazon EBSスナップショットをアカウントBに共有し、アカウントBでそのスナップショットからボリュームを作成できるようにする必要があります。必要な設定はどれですか。",
    choices: [
      "スナップショットの共有設定でパブリック共有を有効にする",
      "スナップショットの暗号化キーをAWSマネージドキーに変更してから共有する",
      "スナップショットの共有設定にアカウントBを追加し、KMSキーのキーポリシーでアカウントBにキーの使用を許可する",
      "KMSキーのキーマテリアルをエクスポートしてアカウントBにインポートする",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。暗号化されたEBSスナップショットの共有には2つの設定が必要です。スナップショットのアクセス許可の変更でアカウントBを追加することと、暗号化に使用したカスタマーマネージドキーのキーポリシーでアカウントBにkms:Decryptやkms:CreateGrantなどのキーの使用を許可することです。Aは誤りで、暗号化されたスナップショットはパブリックに共有できません。Bも誤りで、AWSマネージドキー(aws/ebs)で暗号化されたスナップショットは他アカウントに共有できないため逆効果です。DのKMSキーのキーマテリアルを取り出してエクスポートする機能は存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-policies.html",
  },

  // ===== 第3章: セキュアなワークロード設計 — ネットワークと境界防御 =====
  {
    id: "saa-d1-ch03-q01",
    domain: 1,
    topic: "セキュリティグループ",
    type: "single",
    difficulty: "easy",
    question:
      "あるソリューションアーキテクトが、EC2インスタンス上のWebサーバーへのアクセスをHTTPS(ポート443)のみに制限するセキュリティグループを構成しました。クライアントからのリクエストに対する応答トラフィックを返すために、追加で必要な設定はどれですか。",
    choices: [
      "アウトバウンドルールにエフェメラルポート範囲(1024-65535)の許可を追加する",
      "追加の設定は不要である(セキュリティグループはステートフルであるため)",
      "インバウンドと同じルールをアウトバウンドにも設定する",
      "応答トラフィック専用のセキュリティグループを作成して追加でアタッチする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。セキュリティグループはステートフルであり、許可されたインバウンド接続への応答トラフィックは、アウトバウンドルールの内容に関係なく自動的に許可されます。そのためポート443のインバウンド許可だけで応答は返せます。Aのエフェメラルポートの明示的な許可が必要になるのは、ステートレスなネットワークACLで往路と復路を個別に許可する場合です。Cはステートレスなファイアウォールの考え方であり、セキュリティグループでは不要です。Dのような応答トラフィック専用のセキュリティグループという仕組みは存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-security-groups.html",
  },
  {
    id: "saa-d1-ch03-q02",
    domain: 1,
    topic: "ネットワークACL",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のパブリックサブネットで稼働するWebサーバー群が、特定の1つのIPアドレスから継続的に不正なリクエストを受けています。VPCのサブネットレベルでこの送信元からのすべてのトラフィックを拒否する方法はどれですか。",
    choices: [
      "Webサーバーのセキュリティグループに該当IPアドレスの拒否ルールを追加する",
      "ルートテーブルから該当IPアドレスへのルートを削除する",
      "サブネットのネットワークACLに、該当IPアドレスからのトラフィックを拒否するルールを追加する",
      "インターネットゲートウェイを一時的にデタッチする",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ネットワークACLは許可ルールと拒否ルールの両方を設定でき、サブネット単位で適用されるため、特定の送信元IPアドレスからのトラフィック遮断に適しています。ルール番号の小さい拒否ルールを追加すれば、後続の許可ルールより先に評価されます。Aは誤りで、セキュリティグループには許可ルールしか設定できず、拒否ルールは記述できません。Bのルートテーブルは宛先に基づく経路制御であり、送信元IPアドレスによる遮断はできません。Dのインターネットゲートウェイのデタッチは、正当なユーザーのトラフィックも含めてすべて遮断してしまうため不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-network-acls.html",
  },
  {
    id: "saa-d1-ch03-q03",
    domain: 1,
    topic: "セキュリティグループ",
    type: "single",
    difficulty: "medium",
    question:
      "3層構成のWebアプリケーションで、プライベートサブネットのAmazon RDSインスタンスへの接続を、アプリケーション層のEC2インスタンスからのみに限定する必要があります。アプリケーション層はAuto Scalingによりインスタンスが頻繁に増減します。最も適切な方法はどれですか。",
    choices: [
      "RDS用セキュリティグループのインバウンドルールで、アプリケーション層のセキュリティグループをソースに指定してDBポートを許可する",
      "RDS用セキュリティグループのインバウンドルールで、アプリケーション層の各インスタンスのプライベートIPアドレスを許可する",
      "サブネットのネットワークACLでアプリケーション層のIPアドレス範囲のみを許可する",
      "RDSインスタンスをパブリックサブネットに移動し、IAMデータベース認証を必須にする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。セキュリティグループはインバウンドルールのソースとして別のセキュリティグループを指定でき、そのグループが関連付けられたインスタンスからの通信のみを許可できます。Auto ScalingでインスタンスやIPアドレスが増減しても許可関係が自動的に維持されるため、動的な環境に最適です。BはインスタンスのIPが変わるたびにルールの更新が必要となり、現実的に維持できません。CのネットワークACLはIPアドレス範囲ベースかつサブネット全体への制御であり、通信元をインスタンス単位で特定できません。DはRDSを外部に近づける構成であり、多層防御の原則に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-security-groups.html",
  },
  {
    id: "saa-d1-ch03-q04",
    domain: 1,
    topic: "NATゲートウェイ",
    type: "single",
    difficulty: "medium",
    question:
      "プライベートサブネットのEC2インスタンスが、OSのセキュリティパッチ取得のためにインターネットへのアウトバウンド接続を必要としています。インターネット側から開始されるインバウンド接続は一切許可してはいけません。適切な構成はどれですか。",
    choices: [
      "プライベートサブネットのルートテーブルに0.0.0.0/0からインターネットゲートウェイへのルートを追加する",
      "各EC2インスタンスにElastic IPアドレスを割り当ててインターネットゲートウェイ経由で通信させる",
      "共有サービスVPCとピアリング接続し、ピア先VPCのインターネットゲートウェイを経由させる",
      "パブリックサブネットにNATゲートウェイを配置し、プライベートサブネットのルートテーブルに0.0.0.0/0からNATゲートウェイへのルートを設定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。NATゲートウェイをパブリックサブネットに配置し、プライベートサブネットのデフォルトルートをNATゲートウェイへ向けることで、内側から開始されるアウトバウンド通信とその応答のみが許可されます。NATゲートウェイは外部から開始されるインバウンド接続を受け付けません。AはIGWへのルートを追加するとサブネットがパブリック化し、要件に反します。BのElastic IPの割り当てはインスタンスへの直接のインバウンド到達を可能にしてしまいます。CのVPCピアリングは推移的ルーティングをサポートせず、ピア先VPCのインターネットゲートウェイを経由したアクセスはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html",
  },
  {
    id: "saa-d1-ch03-q05",
    domain: 1,
    topic: "VPCエンドポイント",
    type: "single",
    difficulty: "medium",
    question:
      "プライベートサブネットのEC2インスタンスから、インターネットを経由せずにAmazon S3のデータへアクセスする必要があります。最もコスト効率が良い方法はどれですか。",
    choices: [
      "パブリックサブネットにNATゲートウェイを配置してS3のパブリックエンドポイントにアクセスする",
      "S3用のインターフェイスVPCエンドポイントを作成する",
      "S3用のゲートウェイVPCエンドポイントを作成し、ルートテーブルに関連付ける",
      "AWS Site-to-Site VPNを構成してS3へ接続する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon S3とDynamoDBにはゲートウェイVPCエンドポイントが利用でき、追加料金なしでインターネットを経由しないプライベートアクセスを実現できます。ルートテーブルにエントリを追加するだけで運用負荷も最小です。AのNATゲートウェイは時間料金とデータ処理料金が発生し、通信もS3のパブリックエンドポイント向けになります。Bのインターフェイスエンドポイントでも要件は満たせますが、時間課金とデータ処理料金がかかるため、無料のゲートウェイ型と比べてコスト効率が劣ります。DのSite-to-Site VPNはオンプレミス接続のためのサービスで、VPC内からS3への接続手段ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
  },
  {
    id: "saa-d1-ch03-q06",
    domain: 1,
    topic: "VPCエンドポイント",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業はAWS Direct Connect(プライベートVIF)でオンプレミスデータセンターとVPCを接続しています。オンプレミスのサーバーから、インターネットを経由せずにAmazon S3 APIへアクセスすることが要件です。適切な構成はどれですか。",
    choices: [
      "S3用のゲートウェイVPCエンドポイントを作成し、オンプレミスからそのルートを利用する",
      "S3用のインターフェイスVPCエンドポイントをVPCに作成し、オンプレミスからDirect Connect経由でエンドポイントのプライベートIPにアクセスする",
      "VPC内にNATゲートウェイを配置し、オンプレミスのトラフィックをNAT経由でS3に転送する",
      "S3 Transfer Accelerationを有効化し、専用のエンドポイント経由でアクセスする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。インターフェイスVPCエンドポイントはVPCのサブネット内にプライベートIPを持つENIとして作成されるため、Direct ConnectやVPNで接続されたオンプレミスからも、そのプライベートIP宛にインターネットを経由せずS3 APIへアクセスできます。Aは誤りで、ゲートウェイエンドポイントは関連付けたルートテーブルを使うVPC内のリソースからしか利用できず、オンプレミスやピアリング先からは使えません。CのNATゲートウェイはVPC内リソースのアウトバウンド用であり、オンプレミス発トラフィックの経路にはできません。DのTransfer Accelerationは転送高速化の機能で、プライベート接続の要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/what-is-privatelink.html",
  },
  {
    id: "saa-d1-ch03-q07",
    domain: 1,
    topic: "WAF",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のWebアプリケーション(CloudFrontとALBで構成)が、SQLインジェクションとクロスサイトスクリプティング(XSS)の攻撃を受けています。これらのアプリケーション層への攻撃を最小の運用負荷でブロックする方法はどれですか。",
    choices: [
      "AWS WAFをCloudFrontディストリビューションに関連付け、AWSマネージドルールグループを適用する",
      "AWS Shield Advancedを有効化して保護対象にCloudFrontを追加する",
      "セキュリティグループで攻撃元IPアドレスからのアクセスを拒否する",
      "Amazon GuardDutyの検出結果に基づいてネットワークACLを手動で更新する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS WAFはSQLインジェクションやXSSといったアプリケーション層(L7)の攻撃パターンを検査してブロックできるWebアプリケーションファイアウォールで、CloudFront、ALB、API Gatewayなどに関連付けられます。AWSマネージドルールグループを使えばルールの作成・更新をAWSに任せられるため、運用負荷が最小です。BのShield AdvancedはDDoS攻撃への保護を強化するサービスで、SQLインジェクション等の内容検査は行いません。Cのセキュリティグループはポート・プロトコル・送信元の制御のみで、HTTPリクエストの内容は検査できません。Dは検出後の手動対応となり、継続的な攻撃への防御としては運用負荷が高くなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/what-is-aws-waf.html",
  },
  {
    id: "saa-d1-ch03-q08",
    domain: 1,
    topic: "GuardDuty",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、組織内の全AWSアカウントを対象に、侵害されたEC2インスタンスによる暗号通貨マイニング、不審なAPI呼び出し、既知の悪意あるIPアドレスとの通信といった脅威を、エージェントを導入せずに継続的に検出したいと考えています。どのサービスが適切ですか。",
    choices: [
      "Amazon Inspector",
      "AWS WAF",
      "AWS Network Firewall",
      "Amazon GuardDuty",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Amazon GuardDutyは、CloudTrailイベント、VPCフローログ、DNSクエリログなどのデータソースを機械学習と脅威インテリジェンスで分析し、暗号通貨マイニング、不審なAPI呼び出し、悪意あるIPアドレスとの通信などの脅威をエージェントレスで継続的に検出します。AWS Organizationsと統合して全アカウントへ一括で展開できます。AのAmazon Inspectorはソフトウェア脆弱性やネットワーク到達性の評価が目的で、挙動ベースの脅威検出サービスではありません。BのAWS WAFはWebリクエストのフィルタリング機能です。CのAWS Network FirewallはVPCのトラフィック制御であり、アカウント全体のAPIアクティビティ分析は行いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.html",
  },
  {
    id: "saa-d1-ch03-q09",
    domain: 1,
    topic: "Shield",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業の公開Webアプリケーション(Amazon Route 53、CloudFront、ALBで構成)について、大規模なDDoS攻撃とHTTPフラッド攻撃への防御を強化する必要があります。有効な対策はどれですか。(2つ選択してください)",
    choices: [
      "AWS Shield Advancedを有効化し、DDoS対応チーム(SRT)の支援と拡張保護を利用する",
      "Amazon Inspectorで全EC2インスタンスの脆弱性を継続的にスキャンする",
      "AWS WAFのレートベースルールで、単一送信元からの過剰なリクエストを自動的に制限する",
      "Amazon MacieでS3バケットへの異常なアクセスを監視する",
      "セキュリティグループのアウトバウンドルールをすべて削除する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。AWS Shield Advancedを有効化すると、L3/L4の大規模DDoS攻撃に対する拡張的な検知・緩和、24時間365日のShieldレスポンスチーム(SRT)の支援、攻撃に起因する費用増への保護を利用できます。またAWS WAFのレートベースルールは、単一送信元からの過剰なリクエスト(HTTPフラッド)を閾値超過時に自動的にブロックできます。BのInspectorは脆弱性管理サービスであり、DDoS対策にはなりません。DのMacieはS3内の機密データを検出するサービスで、攻撃の防御機能はありません。Eのアウトバウンドルールの削除はインスタンスから開始する正当な通信を妨げるだけで、インバウンドの攻撃対策にはなりません。",
    reference: "https://aws.amazon.com/jp/shield/faqs/",
  },
  {
    id: "saa-d1-ch03-q10",
    domain: 1,
    topic: "Cognito",
    type: "multiple",
    difficulty: "medium",
    question:
      "あるモバイルアプリケーションで、ユーザーのサインアップ/サインイン機能(GoogleアカウントなどのソーシャルIdP連携を含む)を提供し、認証されたユーザーには一時的なAWS認証情報を発行してAmazon S3へ写真を直接アップロードさせたいと考えています。適切な組み合わせはどれですか。(2つ選択してください)",
    choices: [
      "IAM Identity Centerでアプリ利用者を管理し、SSOアクセスを構成する",
      "Amazon Cognitoユーザープールでサインアップ/サインインとソーシャルIdP連携を実装する",
      "利用者ごとにIAMユーザーを作成し、アクセスキーをアプリに配布する",
      "Amazon Cognitoアイデンティティプールで、認証済みユーザーにIAMロールに基づく一時的なAWS認証情報を発行する",
      "アプリケーションにルートユーザーの認証情報を埋め込み、STSでセッショントークンを取得する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。Cognitoユーザープールは、サインアップ/サインイン、MFA、GoogleなどのソーシャルIdPやSAML IdPとの連携を提供する認証基盤です。Cognitoアイデンティティプールは、ユーザープールなどで認証されたユーザーにIAMロールに基づく一時的なAWS認証情報を発行し、S3への直接アップロードのようなAWSリソースアクセスを可能にします。AのIAM Identity Centerは従業員向けのマルチアカウントSSOであり、アプリの一般利用者の認証には使いません。Cは利用者数分のIAMユーザーと長期キーの配布となり、セキュリティ・拡張性の両面で不適切です。Eのルートユーザー認証情報の埋め込みは最も危険なアンチパターンです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/what-is-amazon-cognito.html",
  },
];
