// CloudOps問題集 分野3(デプロイ、プロビジョニング、オートメーション)後半 qb-d3-023〜qb-d3-044
export const questions = [
  {
    id: "qb-d3-023",
    domain: 3,
    topic: "Distributor",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、社内で開発した監視エージェントを、Systems Managerのマネージドノードである数百台のEC2インスタンスへ特定のバージョンでインストールし、以後のバージョン更新も管理された形で配布したいと考えています。独自の配布の仕組みを作らずに実現できる方法はどれですか。",
    choices: [
      "Systems Manager Distributorでエージェントをパッケージとしてバージョン管理し、マネージドノードへ配布・インストールする",
      "各インスタンスのユーザーデータにインストールスクリプトを記述し、エージェントを導入する",
      "エージェントを組み込んだ新しいAMIを作成し、すべてのインスタンスを置き換えて反映する",
      "Amazon S3にインストーラを配置し、各インスタンスの管理者が手動でダウンロードして実行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Systems Manager Distributorは、独自ソフトウェアやAWS提供のエージェントをパッケージとしてバージョン管理し、Run CommandやState Managerと連携してマネージドノードへ配布・インストール・更新できる機能です。特定バージョンの指定や常に最新版を配布する運用も可能で、独自の配布基盤を構築する必要がありません。Bのユーザーデータは既定では初回起動時にのみ実行され、稼働中のノードやバージョン更新には対応できません。CのAMI置き換えは1つのエージェント導入のためには過剰で、バージョン管理された配布にもなりません。Dの手動ダウンロードは運用負荷が高く、配布状況やバージョンの一元管理もできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/distributor.html",
  },
  {
    id: "qb-d3-024",
    domain: 3,
    topic: "Run Command出力",
    type: "multiple",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、多数のマネージドノードに対してSystems Manager Run Commandで実行したコマンドの完全な出力を、監査のために長期間保存し、後から検索・確認できるようにする必要があります。コンソールに表示される出力は文字数が制限されており不十分です。適切な方法はどれですか。(2つ選択してください)",
    choices: [
      "コマンドの出力の送信先としてAmazon S3バケットを指定する",
      "コマンドの出力の送信先としてAmazon CloudWatch Logsを指定する",
      "AWS CloudTrailのデータイベントを有効化して、コマンドの出力内容を記録する",
      "VPCフローログを有効化して、コマンドの実行結果を保存する",
      "Systems Managerインベントリを有効化して、コマンドの出力を収集する",
    ],
    answerIndexes: [0, 1],
    explanation:
      "正解はAとBです。Run Commandは既定ではコンソールにコマンド出力の先頭部分しか表示しませんが、コマンド実行時に出力の送信先としてAmazon S3バケットやAmazon CloudWatch Logsを指定すると、完全な出力を保存できます。CloudWatch Logsに送れば検索やメトリクスフィルタによる分析も可能です。CのCloudTrailはAPI呼び出しの履歴を記録するもので、コマンドが生成したシェル出力の内容は残りません。DのVPCフローログはネットワークトラフィックのメタデータの記録であり、コマンド出力とは無関係です。EのSSMインベントリはソフトウェアや構成のメタデータを収集する機能で、コマンドの実行出力は収集しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/sysman-rc-setting-up-cwlogs.html",
  },
  {
    id: "qb-d3-025",
    domain: 3,
    topic: "Patch Manager",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、本番EC2インスタンスへのOSパッチ適用を毎月第2日曜日の深夜2時間だけ許可しています。CloudOpsエンジニアは、この時間帯にのみ自動でパッチを適用し、営業時間中には決して実行されないようにしたいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "EventBridgeルールから自作のLambda関数を起動し、各インスタンスでパッチコマンドを実行する",
      "毎月第2日曜日に担当者がRun CommandからAWS-RunPatchBaselineを手動実行する",
      "メンテナンスウィンドウをcron式で定義し、AWS-RunPatchBaselineを実行するRun Commandタスクを登録する",
      "State Managerでインスタンス起動のたびにパッチを適用するアソシエーションを作成する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。メンテナンスウィンドウは、cron/rate式で定義した時間枠内でのみ登録タスクを実行する仕組みです。AWS-RunPatchBaselineタスクを登録すれば、許可された時間帯だけ自動的にパッチ適用が行われます。Aはパッチ制御ロジックを自作Lambdaで実装・保守することになり運用負荷が高くなります。Bは手動運用のため実行忘れのリスクがあり、自動化の要件を満たしません。Dは起動タイミングに依存して適用されるため、営業時間中に実行されない保証がなく、時間枠の制御もできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-maintenance.html",
  },
  {
    id: "qb-d3-026",
    domain: 3,
    topic: "パッチベースライン",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のパッチポリシーでは、Linuxサーバー向けのセキュリティパッチはリリース後14日間の社内検証期間を経てから本番環境に適用することが定められています。Patch Managerでこの要件を満たす方法はどれですか。",
    choices: [
      "承認ルールに自動承認までの待機日数14日を設定したカスタムパッチベースラインを作成し、本番のパッチグループに関連付ける",
      "AWS提供の既定のパッチベースラインをそのまま本番インスタンスに使用する",
      "メンテナンスウィンドウのスケジュールを14日後ろにずらして実行する",
      "リリースから14日経過したパッチのリストを毎週手動で作成し、Run Commandで個別にインストールする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。カスタムパッチベースラインの承認ルールでは、パッチのリリースから自動承認までの待機日数を指定できます。14日に設定してパッチグループに関連付ければ、検証期間を経たパッチだけが本番に適用されます。Bの既定ベースラインは承認待機日数などの設定を変更できず、14日という社内要件に合致する保証がありません。Cはウィンドウの実行日をずらしても、個々のパッチのリリース日からの経過日数は評価されません。Dは手動でのリスト管理が必要で、運用負荷が高く漏れも発生しやすくなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-patch.html",
  },
  {
    id: "qb-d3-027",
    domain: 3,
    topic: "Auto Scalingライフサイクルフック",
    type: "single",
    difficulty: "medium",
    question:
      "あるEC2 Auto Scalingグループでは、スケールアウトで新しく起動したインスタンスに対して、サービスインの前に設定処理とウォームアップを完了させたいと考えています。また、スケールインでインスタンスが終了する前には、処理中の接続をドレイン(排出)する時間を確保する必要があります。最も適切な方法はどれですか。",
    choices: [
      "Auto Scalingグループにライフサイクルフックを設定し、起動時と終了時に一時停止して処理を実行してから次の状態へ進める",
      "起動テンプレートのユーザーデータで初期化を行い、完了を待たずにインスタンスをサービスインさせる",
      "ヘルスチェックの猶予期間(グレースピリオド)を延長して、初期化とドレインの時間を確保する",
      "スケーリングポリシーのクールダウン期間を長く設定して、処理の時間を確保する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Auto Scalingのライフサイクルフックは、インスタンスの起動時(Pending:Wait)や終了時(Terminating:Wait)に一時停止状態を設け、設定処理やウォームアップ、接続のドレインなどのカスタム処理を実行してから、CompleteLifecycleActionで次の状態へ遷移させられます。Bのユーザーデータだけでは処理の完了を待たずにサービスインし、終了時のドレインも制御できません。Cのヘルスチェックの猶予期間はヘルスチェックの開始を遅らせる設定で、カスタム処理の実行や終了時のドレインを行うものではありません。Dのクールダウンは連続するスケーリング活動の間隔を制御する設定で、個々のインスタンスの準備や終了処理を挟む仕組みではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/lifecycle-hooks.html",
  },
  {
    id: "qb-d3-028",
    domain: 3,
    topic: "Session Manager",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のセキュリティ部門は、EC2インスタンスへの管理シェルアクセスについて「インバウンドポートを一切開放しない」「SSHキーペアを管理しない」「接続の可否をIAMポリシーで制御する」ことを求めています。これらの要件をすべて満たす方法はどれですか。",
    choices: [
      "踏み台ホストを経由したSSH接続のみを許可する",
      "Systems Manager Session Managerを使用してインスタンスに接続する",
      "EC2シリアルコンソールを日常の管理アクセス手段として使用する",
      "SSHキーペアを定期的にローテーションしながらSSH接続を継続する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Session ManagerはSSM Agentがアウトバウンド接続で確立するチャネルを通じてシェルアクセスを提供するため、インバウンドポートの開放もSSHキーペアも不要で、接続可否や対象インスタンスはIAMポリシーで制御できます。Aは踏み台自体へのポート開放とSSH鍵管理が残るため要件を満たしません。Cのシリアルコンソールはネットワーク障害時などのトラブルシューティング用の手段で、日常の管理アクセスには適しません。Dはインバウンドの22番ポート開放と鍵管理が継続するため、要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html",
  },
  {
    id: "qb-d3-029",
    domain: 3,
    topic: "Session Managerポート転送",
    type: "single",
    difficulty: "medium",
    question:
      "開発者が、プライベートサブネットにあるAmazon RDS for MySQLへ、手元のPCのSQLクライアントから接続して調査を行う必要があります。会社のポリシーでは、踏み台ホストの新設、データベースのインターネット公開、セキュリティグループのインバウンド開放はいずれも禁止されています。VPC内にはSSMマネージドのEC2インスタンスが存在します。どうすべきですか。",
    choices: [
      "Session ManagerのAWS-StartPortForwardingSessionToRemoteHostドキュメントで、EC2インスタンスを中継するRDSへのポート転送セッションを開始する",
      "RDSインスタンスのパブリックアクセシビリティを有効化し、会社のグローバルIPからのみ接続を許可する",
      "NATゲートウェイを追加し、PCからの接続をプライベートサブネットへルーティングする",
      "リードレプリカをパブリックサブネットに作成し、レプリカへ接続して調査する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Session Managerのリモートホスト向けポート転送を使うと、マネージドインスタンスを中継してプライベートなRDSエンドポイントへ、踏み台の新設もインバウンド開放もなしにローカルポート経由で安全に接続できます。Bはデータベースをインターネットへ公開することになりポリシー違反です。CのNATゲートウェイはVPC内からのアウトバウンド通信用であり、外部からVPC内への接続経路にはなりません。Dはレプリカの公開が同様にポリシーに反するうえ、公開レプリカの作成は攻撃対象領域を広げます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html",
  },
  {
    id: "qb-d3-030",
    domain: 3,
    topic: "Parameter Store",
    type: "multiple",
    difficulty: "medium",
    question:
      "あるアプリケーションは、カスタマーマネージドKMSキーで暗号化されたParameter StoreのSecureStringパラメータを、起動時に復号して読み取ります。アプリケーションが動作するEC2インスタンスのIAMロールに必要なアクセス許可はどれですか。(2つ選択してください)",
    choices: [
      "secretsmanager:GetSecretValue",
      "ssm:GetParameter",
      "kms:CreateGrant",
      "iam:PassRole",
      "kms:Decrypt",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。SecureStringパラメータを復号付きで取得するには、対象パラメータへのssm:GetParameterと、暗号化に使用されたKMSキーに対するkms:Decryptの両方の許可が必要です。カスタマーマネージドキーの場合はキーポリシー側でも許可されている必要があります。AのGetSecretValueはSecrets Manager用のアクションで、Parameter Storeの取得には使いません。CのCreateGrantはキーの使用権限を委任するためのもので、値の復号には不要です。Dのiam:PassRoleはロールをAWSサービスへ渡す際の許可で、パラメータの取得とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/services-parameter-store.html",
  },
  {
    id: "qb-d3-031",
    domain: 3,
    topic: "Parameter Store階層",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、アプリケーションの設定値を環境ごとに /myapp/dev/ と /myapp/prod/ のような名前でParameter Storeに保存しています。アプリケーションは起動時に自環境のすべてのパラメータを一括取得する必要があり、また開発者のIAMロールにはdev環境の値だけを読み取らせたいと考えています。最も適切な方法はどれですか。",
    choices: [
      "環境ごとに別のAWSアカウントを新設し、パラメータを完全に分離する",
      "各パラメータにタグを付与し、アプリケーションからタグ検索で1件ずつ取得する",
      "階層パスに対してGetParametersByPathで一括取得し、IAMポリシーのResourceにパス配下のパラメータARNを指定してアクセスを制御する",
      "全環境の設定値を1つのStringList型パラメータにまとめて格納する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Parameter Storeはスラッシュ区切りの階層構造をサポートしており、GetParametersByPath APIでパス配下のパラメータを再帰的に一括取得できます。IAMポリシーのResourceに /myapp/dev/ 配下のARNを指定すれば、開発者にはdev環境のみ許可できます。Aはアカウント分離でも制御できますが、この要件だけのためには構築・管理のコストが過剰です。Bはタグで値を直接取得するAPIはなく、1件ずつの取得は非効率です。Dは1つの値にまとめると環境単位のアクセス制御や個別の更新ができなくなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-parameter-store.html",
  },
  {
    id: "qb-d3-032",
    domain: 3,
    topic: "Automationランブック",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、本番EC2インスタンスの再起動を含む定型メンテナンス手順をSystems Manager Automationランブックとして整備しています。ガバナンス要件として、再起動ステップの直前で運用責任者の承認を取得し、承認された場合のみ後続ステップへ進む必要があります。どうすべきですか。",
    choices: [
      "ランブック実行前にAmazon SNSで通知を送り、責任者の返信を確認してから手動で実行する",
      "IAMポリシーでMFA認証を条件としてランブックの実行を許可する",
      "Change Calendarを作成し、営業時間外のみ実行を許可する",
      "ランブックにaws:approveアクションのステップを追加し、承認者となるIAMプリンシパルを指定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Automationのaws:approveアクションは、指定した承認者が承認または却下するまでランブックの実行を一時停止するステップで、SNS通知と組み合わせて承認フローを手順の途中に組み込めます。Aは通知と実行が分離した手動運用となり、確認漏れや実行ミスが起きやすくなります。BのMFA条件は実行者本人の認証を強化するだけで、別の責任者による承認ゲートにはなりません。CのChange Calendarは実行を許可する期間を制御する機能であり、個々の実行に対する承認プロセスは提供しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-automation.html",
  },
  {
    id: "qb-d3-033",
    domain: 3,
    topic: "ハイブリッドアクティベーション",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、オンプレミスのデータセンターにあるLinuxサーバー200台を、EC2インスタンスと同じようにSystems ManagerのRun CommandとPatch Managerで管理したいと考えています。最初に行うべき設定はどれですか。",
    choices: [
      "ハイブリッドアクティベーションを作成し、発行されたアクティベーションコードとIDを使って各サーバーのSSM Agentを登録する",
      "各オンプレミスサーバーにIAMインスタンスプロファイルをアタッチする",
      "各オンプレミスサーバーにEC2 Instance Connectを設定する",
      "AWS Direct Connectの専用線を敷設する(Systems Manager管理の前提条件であるため)",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。オンプレミスサーバーは、ハイブリッドアクティベーションで発行されるアクティベーションコードとIDを指定してSSM Agentを登録することで、マネージドノードとしてRun CommandやPatch Managerの対象になります。権限は関連付けたIAMサービスロールから引き受けます。BのIAMインスタンスプロファイルはEC2インスタンス専用の仕組みで、オンプレミスの物理・仮想サーバーには使用できません。CのEC2 Instance ConnectはEC2向けのSSH接続機能です。DはHTTPSでSSMエンドポイントへ到達できればよく、専用線は前提条件ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-managedinstances.html",
  },
  {
    id: "qb-d3-034",
    domain: 3,
    topic: "SSMインベントリ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がソフトウェアライセンスの監査を受けることになり、全EC2インスタンス(SSMマネージドノード)にインストールされているアプリケーションとバージョンの一覧を継続的に収集し、一元的に確認できるようにする必要があります。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "AWS Configの設定レコーダーでインストール済みソフトウェアの一覧を記録する",
      "CloudTrailのログからソフトウェアのインストールイベントを抽出して集計する",
      "Systems Managerインベントリを有効化し、マネージドノードからメタデータを収集する",
      "各インスタンスにパッケージ一覧を出力するcronジョブを構成し、結果をS3へ集約する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。SSMインベントリは、インストール済みアプリケーション、OS情報、ネットワーク設定などのメタデータをマネージドノードから定期的に収集し、コンソールで一元確認できます。リソースデータ同期でS3へ集約しAthenaで分析することも可能です。AのAWS ConfigはAWSリソースの設定変更を記録するサービスで、OS内部のソフトウェア一覧は収集しません。BのCloudTrailはAWS APIの呼び出し履歴であり、OS内で行われたインストール操作は記録されません。Dは自作ジョブの配布・集約・保守が必要となり運用負荷が高くなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-inventory.html",
  },
  {
    id: "qb-d3-035",
    domain: 3,
    topic: "S3イベント通知",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、S3バケットの uploads/ プレフィックスに .jpg ファイルがアップロードされたときにだけ、サムネイル生成用のLambda関数を自動的に実行したいと考えています。最小の設定で実現できる方法はどれですか。",
    choices: [
      "CloudTrailのデータイベントを有効化し、EventBridgeルール経由でLambda関数を起動する",
      "S3ライフサイクルルールを作成し、オブジェクト作成時にLambda関数を呼び出す",
      "EC2インスタンス上のスクリプトでバケットを定期的にポーリングし、新規ファイルを検出して関数を呼び出す",
      "プレフィックス uploads/ とサフィックス .jpg のフィルターを設定したS3イベント通知の送信先にLambda関数を指定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。S3イベント通知は、オブジェクト作成イベントの送信先としてLambda関数を直接指定でき、プレフィックスとサフィックスのフィルターで対象オブジェクトを絞り込めるため、追加サービスなしの最小構成で要件を満たせます。AはCloudTrailデータイベントの有効化とEventBridgeルールの作成という追加設定が必要で、実現は可能ですが最小の設定ではありません。Bのライフサイクルルールはストレージクラスの移行や削除のための機能で、Lambdaの呼び出しはできません。Cはポーリングによる検出遅延とEC2の運用コストが発生します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/NotificationHowTo.html",
  },
  {
    id: "qb-d3-036",
    domain: 3,
    topic: "EventBridgeスケジュール",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアは、在庫レポートを生成するLambda関数を、月曜日から金曜日の09:00(UTC)にのみ自動実行する必要があります。追加のインフラを稼働させずに実現できる方法はどれですか。",
    choices: [
      "rate(1 day) を指定したEventBridgeスケジュールを作成し、関数内で曜日を判定して平日以外は処理を終了する",
      "cron(0 9 ? * MON-FRI *) を指定したEventBridgeスケジュールを作成し、Lambda関数をターゲットに設定する",
      "SQSの遅延キューにメッセージを送信し、遅延時間の経過後に関数で処理する",
      "Step Functionsのステートマシンを常時実行し、待機ステートで次の平日9時まで待つループを構成する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EventBridgeのcron式は分・時・日・曜日などを指定でき、平日の特定時刻のような細かいスケジュールを表現してLambda関数を直接起動できます。Aのrate式は一定間隔の繰り返ししか表現できず実行時刻も指定できないため、関数側に本来不要な曜日判定の実装が増えます。CのSQS遅延キューの最大遅延時間は15分であり、週次・日次のスケジュール用途には使えません。Dは常時稼働するステートマシンの実行コストと管理の手間が発生し、単純なスケジュール実行には過剰な構成です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-create-rule-schedule.html",
  },
  {
    id: "qb-d3-037",
    domain: 3,
    topic: "EventBridgeイベントバス",
    type: "single",
    difficulty: "medium",
    question:
      "あるアプリケーションはPutEvents APIで、カスタムイベントバス orders-bus に注文イベントを送信しています。CloudOpsエンジニアは、このイベントを処理するLambda関数を起動するルールを作成しましたが、関数は一度も起動されません。調査の結果、PutEventsは成功しており、イベントパターンは送信イベントに一致する内容であることが確認できましたが、ルールはデフォルトイベントバス上に作成されていました。どうすべきですか。",
    choices: [
      "orders-bus イベントバス上に同じイベントパターンのルールを作成し直す",
      "Lambda関数の予約済み同時実行数を増やす",
      "デフォルトイベントバスにアーカイブを設定してイベントを保存する",
      "アプリケーションの送信先をCloudWatch Logsのロググループに変更する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。EventBridgeのルールは特定のイベントバスに属し、そのバスに届いたイベントだけを評価します。イベントはorders-busへ送信されているため、デフォルトバス上のルールには一致せず、ルールをorders-bus上に作成する必要があります。Bはそもそも呼び出しが発生していないため、同時実行数の設定は原因と無関係です。Cのアーカイブはイベントの保存と再生のための機能で、バス間でイベントを転送したりルールに一致させたりするものではありません。Dはイベント駆動でLambdaを起動するという本来の要件を満たさなくなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-rules.html",
  },
  {
    id: "qb-d3-038",
    domain: 3,
    topic: "Lambdaリソースベースポリシー",
    type: "single",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアがAWS CLIでEventBridgeルールを作成し、既存のLambda関数をターゲットに設定しました。イベントはルールに一致していますが、関数は実行されず、ルールのFailedInvocationsメトリクスが増加しています。関数のIAM実行ロールには必要な許可が付与されています。最も可能性の高い原因はどれですか。",
    choices: [
      "Lambda関数の実行ロールに events:PutEvents の許可がない",
      "EventBridgeルールのスケジュール式のタイムゾーン設定が誤っている",
      "events.amazonaws.com からの lambda:InvokeFunction を許可するリソースベースポリシーが関数に設定されていない",
      "Lambda関数にデッドレターキューが設定されていない",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EventBridgeがLambda関数を呼び出すには、関数側のリソースベースポリシーで、プリンシパルevents.amazonaws.com(ソースARNとしてルールARN)にlambda:InvokeFunctionを許可する必要があります。コンソールでターゲットを追加すると自動付与されますが、CLIの場合は lambda add-permission を別途実行しなければなりません。Aの実行ロールは関数が他のサービスを呼び出すための権限であり、呼び出される側の許可ではありません。Bはイベントパターンに一致するルールでありスケジュール式は使われていません。DのDLQは失敗イベントの退避先で、呼び出し失敗の原因にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/access-control-resource-based.html",
  },
  {
    id: "qb-d3-039",
    domain: 3,
    topic: "ECSデプロイサーキットブレーカー",
    type: "single",
    difficulty: "medium",
    question:
      "ある開発チームは、Amazon ECS(Fargate、ローリング更新)のサービスへ新しいタスク定義をデプロイしています。まれに新しいタスクが安定状態に達せずデプロイが停滞することがあり、その場合は手動操作なしで直前の正常なバージョンへ自動的に戻したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "サービスのデプロイサーキットブレーカーを有効化し、ロールバックを有効にする",
      "サービスの希望タスク数を一時的に増やして、安定するまで待機する",
      "force-new-deploymentを繰り返し実行して、タスクが安定するまで試行する",
      "Application Load Balancerのヘルスチェックのしきい値を緩和して、失敗を許容する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ECSのデプロイサーキットブレーカーは、ローリング更新で新しいタスクが安定状態(steady state)に達せず、タスクの起動やヘルスチェックの失敗が続く場合に、デプロイを失敗と判定します。ロールバックを有効にしておくと、直前に正常完了したデプロイへ自動的に戻すため、手動対応なしで復旧できます。Bの希望タスク数の増加は失敗したタスクを解消せず、自動ロールバックにもなりません。Cのforce-new-deploymentの再実行は同じイメージ・タスク定義では同様に失敗する可能性が高く、根本的な解決になりません。Dのヘルスチェックの緩和は不健全なタスクを見逃す対処であり、問題を隠すだけで要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/deployment-circuit-breaker.html",
  },
  {
    id: "qb-d3-040",
    domain: 3,
    topic: "ECRライフサイクルポリシー",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のECRリポジトリにはCI/CDパイプラインから1日に何度もイメージがプッシュされており、タグが外れた古いイメージが蓄積してストレージコストが増加しています。追加のインフラを構築せずに、不要になった未タグのイメージを自動的に削除し続けるにはどうすべきですか。",
    choices: [
      "ECRのイメージを保存している基盤のS3バケットにS3ライフサイクルルールを設定する",
      "EventBridgeスケジュールで毎晩Lambda関数を起動し、batch-delete-imageを実行するスクリプトを保守する",
      "リポジトリのタグのイミュータビリティ(上書き禁止)を有効化する",
      "未タグのイメージを対象に、プッシュからの経過日数または保持数の条件で期限切れにするECRライフサイクルポリシーを設定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。ECRライフサイクルポリシーは、untagged(未タグ)などのステータスと、プッシュからの経過日数やイメージ保持数の条件に基づいてイメージを自動的に期限切れとして削除でき、追加インフラなしで蓄積を防げます。AのECRのストレージはAWSが管理しており、利用者がS3バケットとして直接操作することはできません。Bは実現可能ですがLambdaスクリプトの実装と保守が必要で、標準機能で足りるため不適切です。Cのタグのイミュータビリティは既存タグの上書きを防ぐ機能であり、古いイメージの削除は行いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonECR/latest/userguide/LifecyclePolicies.html",
  },
  {
    id: "qb-d3-041",
    domain: 3,
    topic: "ECRイメージ取得",
    type: "multiple",
    difficulty: "hard",
    question:
      "インターネットへの経路がないプライベートサブネットでFargateタスクを起動したところ、CannotPullContainerError が発生してECRからのイメージ取得に失敗し、タスクが停止します。タスク実行ロールにはECRへの必要な許可が付与されています。解決策として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "ecr.api と ecr.dkr のインターフェイスVPCエンドポイント、およびS3ゲートウェイエンドポイントを作成する",
      "タスクのセキュリティグループでインバウンドのTCP 443を許可する",
      "NATゲートウェイを配置し、プライベートサブネットからのアウトバウンド経路をルートテーブルに追加する",
      "タスクのネットワーク設定でパブリックIPアドレスの自動割り当てを有効化する",
      "リポジトリをAmazon ECR Publicへ移行してイメージを公開する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。ECRからのイメージ取得には、ECRのAPI・Dockerレジストリエンドポイントと、イメージレイヤーが格納されるS3への到達性が必要です。インターネット経路のないサブネットでは、VPCエンドポイント(ecr.api、ecr.dkr、S3)を作成するか、NATゲートウェイ経由のアウトバウンド経路を用意することで解決できます。Bはプルはタスク側から開始するアウトバウンド通信のため、インバウンド許可は不要です。DはパブリックIPを割り当てても、インターネットゲートウェイへのルートがないサブネットでは外部に到達できません。Eは社内イメージの公開となりセキュリティ上不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonECR/latest/userguide/vpc-endpoints.html",
  },
  {
    id: "qb-d3-042",
    domain: 3,
    topic: "EKSアクセス管理",
    type: "single",
    difficulty: "hard",
    question:
      "新しく入社したエンジニアが、自分のIAMロールで aws eks update-kubeconfig を実行した後、kubectl get pods を実行すると「error: You must be logged in to the server (Unauthorized)」というエラーになります。このIAMロールには eks:DescribeCluster などのEKS API許可が付与されています。最も可能性の高い原因はどれですか。",
    choices: [
      "クラスターのセキュリティグループでkubectlが使用するポートが拒否されている",
      "そのIAMロールが、EKSのアクセスエントリ(または aws-auth ConfigMap)でクラスターに登録されていない",
      "kubectlのバージョンがクラスターのKubernetesバージョンより新しい",
      "EKSクラスターのパブリックエンドポイントが無効化されている",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EKSでは、AWS APIに対するIAM権限とは別に、Kubernetes側の認証・認可への登録が必要です。アクセスエントリ(従来はaws-auth ConfigMap)にIAMプリンシパルを追加し、アクセスポリシーやグループを関連付けていない場合、APIサーバーからUnauthorizedが返されます。Aのようなネットワーク到達性の問題では接続タイムアウトなどになり、認証エラーにはなりません。Cのバージョン差異は互換性の推奨範囲はあるものの、Unauthorizedの原因にはなりません。Dのパブリックエンドポイント無効化も接続不可という症状になり、認証エラーとは異なります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/access-entries.html",
  },
  {
    id: "qb-d3-043",
    domain: 3,
    topic: "サブネットIP枯渇",
    type: "multiple",
    difficulty: "hard",
    question:
      "あるECSサービス(Fargate、awsvpcネットワークモード)のスケールアウトが「insufficient free IP addresses in subnet」というエラーで失敗し始めました。調査の結果、タスクを配置しているサブネットの空きIPv4アドレスが枯渇していることが分かりました。恒久的な対策として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "既存サブネットのCIDRブロックをより大きな範囲に変更して利用可能なIPアドレスを増やす",
      "NATゲートウェイを追加配置してプライベートIPアドレスの消費を削減する",
      "使用されていないENIや不要になったリソースを削除し、サブネットのIPアドレスを解放する",
      "タスクのネットワークモードをhostに変更してENIの割り当てをなくす",
      "VPCにセカンダリCIDRブロックを追加して新しいサブネットを作成し、サービスのネットワーク設定に追加する",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。サブネットのIP枯渇への恒久対策は、未使用ENIの削除などによるIPアドレスの解放と、VPCへのセカンダリCIDRブロック追加+新サブネット作成による容量の拡張です。Aは作成済みのサブネットのCIDRは変更・拡張できないため実施できません(VPCにはCIDRの追加のみ可能です)。BのNATゲートウェイはアウトバウンド接続のための機能で、それ自体がIPアドレスを消費するためIP不足の解決にはなりません。DのFargateはawsvpcネットワークモードが必須であり、hostモードは選択できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-cidr-blocks.html",
  },
  {
    id: "qb-d3-044",
    domain: 3,
    topic: "Service Quotas",
    type: "single",
    difficulty: "medium",
    question:
      "セール当日、ある企業のAuto Scalingグループのスケールアウトが途中で停止し、アクティビティ履歴に「You have requested more instances (65) than your current instance limit of 64 allows」というエラーが記録されていました。今後のセールで同じ問題を起こさないための対応はどれですか。",
    choices: [
      "Service Quotasコンソールで、該当リージョンのEC2オンデマンドインスタンス実行数(vCPUベース)のクォータ引き上げをリクエストする",
      "Auto Scalingグループの最大キャパシティを64未満に設定してエラーの発生を防ぐ",
      "別のアベイラビリティーゾーンにサブネットを追加し、スケールアウト先を分散する",
      "起動テンプレートのインスタンスタイプをより大きいサイズに変更して必要台数を減らす",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。このエラーはアカウントのリージョンごとのEC2実行クォータ(オンデマンドインスタンスのvCPU上限)に到達したことが原因であり、Service Quotasから引き上げをリクエストするのが正しい恒久対応です。Bはエラーは出なくなりますが、需要に必要な台数を確保できず機会損失を防ぐという本来の目的に反します。Cのクォータはリージョン単位で適用されるため、AZを分散しても上限は変わりません。Dはインスタンスサイズを大きくしてもvCPU消費量が増えるため上限の問題は解決せず、アプリケーション構成の変更も伴います。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/servicequotas/latest/userguide/request-quota-increase.html",
  },
];
