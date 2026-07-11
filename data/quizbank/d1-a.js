// CloudOps問題集 分野1(モニタリング、ログ記録、分析、修復、パフォーマンスの最適化)前半 qb-d1-001〜qb-d1-022
export const questions = [
  {
    id: "qb-d1-001",
    domain: 1,
    topic: "CloudWatchエージェント",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のCloudOpsエンジニアが、Amazon EC2インスタンスのメモリ使用率とディスク使用率をAmazon CloudWatchで監視したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "EC2の標準メトリクスでメモリ使用率とディスク使用率を有効化する",
      "CloudWatchエージェントをインスタンスにインストールしてメトリクスを収集する",
      "詳細モニタリングを有効化して1分間隔のメモリメトリクスを取得する",
      "AWS CloudTrailのログからメモリ使用率を抽出する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。メモリ使用率やディスク使用率などOS内部のメトリクスは、EC2のハイパーバイザーからは取得できないため、CloudWatchエージェントをインストールしてカスタムメトリクスとして送信する必要があります。AとCが誤りである理由は、標準メトリクスにも詳細モニタリングにもメモリ・ディスク使用率は含まれないためです(詳細モニタリングは既存メトリクスの間隔を5分から1分に短縮する機能です)。DのAWS CloudTrailはAPI呼び出しの記録サービスであり、OSのリソース使用状況は記録しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html",
  },
  {
    id: "qb-d1-002",
    domain: 1,
    topic: "CloudWatchアラーム",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業では、CPU使用率が高い状態が続いたEC2インスタンスを自動的に再起動し、同時に運用チームへ通知したいと考えています。CloudWatchアラームのアクションとして直接設定できるものはどれですか。(2つ選択してください)",
    choices: [
      "Amazon SNSトピックへの通知",
      "EC2インスタンスの再起動アクション",
      "AWS CloudTrail証跡の自動作成",
      "セキュリティグループのルール変更",
      "Amazon S3バケットへの直接書き込み",
    ],
    answerIndexes: [0, 1],
    explanation:
      "正解はAとBです。CloudWatchアラームは、Amazon SNSトピックへの通知と、EC2アクション(再起動・停止・終了・復旧)を直接実行できます。CのCloudTrail証跡の作成はアラームアクションとしてサポートされていません。Dのセキュリティグループ変更やEのS3への直接書き込みもアラームアクションには存在せず、そのような処理が必要な場合はSNS経由でAWS Lambdaを起動するか、Amazon EventBridge経由で自動化を構成します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
  },
  {
    id: "qb-d1-003",
    domain: 1,
    topic: "CloudWatchメトリクス",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のCloudOpsエンジニアが、EC2インスタンスの標準メトリクス(CPUUtilizationなど)を、追加のソフトウェアをインストールせずに1分間隔でCloudWatchに送信したいと考えています。どうすべきですか。",
    choices: [
      "CloudWatchエージェントをインストールして収集間隔を60秒に設定する",
      "CloudWatchアラームの評価期間を1分に変更する",
      "インスタンスの詳細モニタリングを有効化する",
      "メトリクスフィルターを作成して1分ごとに集計する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2の基本モニタリングでは標準メトリクスが5分間隔で送信されますが、詳細モニタリングを有効化すると追加ソフトウェアなしで1分間隔になります(有料)。Aは機能的には近いことができますが、エージェントのインストールが必要になるため要件に反します。Bのアラーム評価期間はアラーム判定の設定であり、メトリクス自体の送信間隔は変わりません。Dのメトリクスフィルターはログイベントからメトリクスを生成する機能で、既存の標準メトリクスの間隔短縮とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-cloudwatch-new.html",
  },
  {
    id: "qb-d1-004",
    domain: 1,
    topic: "複合アラーム",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のWebアプリケーションでは、ALBの異常ホスト数アラームとEC2のCPU使用率アラームを個別に設定していますが、短時間の変動のたびに両方が発報し、通知が大量に届いています。運用チームは、両方のアラームが同時にALARM状態になったときだけ1件の通知を受け取りたいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "2つのアラームをANDで組み合わせた複合アラームを作成し、複合アラームにのみSNS通知アクションを設定する",
      "2つのアラームの状態をLambda関数で定期的にポーリングし、両方がALARMのときにSNSへ発行する",
      "各アラームの評価期間を長くして通知の回数を減らす",
      "メトリクス数式で2つのメトリクスを合算した新しいアラームを作成する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。複合アラームはANDやORのルール式で複数のアラーム状態を組み合わせ、条件を満たしたときだけアクションを実行できるため、アラートノイズの削減に最適です。Bはポーリング用Lambdaの開発・保守が必要で運用負荷が高くなります。Cは通知数を減らせても「両方が同時にALARMのときだけ通知」という要件は満たせず、検知も遅れます。Dのメトリクス数式はメトリクス値の計算機能であり、既存アラームの状態同士を組み合わせる用途には適しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html",
  },
  {
    id: "qb-d1-005",
    domain: 1,
    topic: "メトリクスフィルター",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のアプリケーションはCloudWatch Logsのロググループにログを出力しています。CloudOpsエンジニアは、ログに「ERROR」という文字列が5分間に10回以上出現した場合にアラームで通知したいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "サブスクリプションフィルターでLambda関数にログを流し、エラー数を集計してSNSに発行する",
      "ログをS3にエクスポートし、Athenaで定期的にエラー数を集計する",
      "CloudWatch Logs Insightsのクエリを5分ごとに手動実行して確認する",
      "「ERROR」に一致するメトリクスフィルターを作成し、生成されたメトリクスにCloudWatchアラームを設定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。メトリクスフィルターはロググループに届くログイベントからパターンに一致した回数をCloudWatchメトリクスとして発行でき、そのメトリクスに閾値アラームを設定するだけで要件を満たせます。Aは実現可能ですがLambdaの実装・保守が必要で運用負荷が高くなります。Bのエクスポートはバッチ処理であり、リアルタイムに近い検知や自動通知には不向きです。CのLogs Insightsはアドホックな分析に優れますが、手動実行では継続的な監視と通知になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringLogData.html",
  },
  {
    id: "qb-d1-006",
    domain: 1,
    topic: "CloudWatch Logs Insights",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業で障害が発生し、CloudOpsエンジニアはCloudWatch Logsに保存された過去数時間のJSON形式のアプリケーションログを対象に、エラーコード別の件数集計や特定リクエストIDでの絞り込みを行う必要があります。追加のインフラをプロビジョニングせずにアドホックなクエリを実行できる機能はどれですか。",
    choices: [
      "Amazon Athena",
      "CloudWatch Logs Insights",
      "Amazon OpenSearch Service",
      "AWS CloudTrail Lake",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudWatch Logs Insightsは専用のクエリ言語でロググループを直接検索・集計・フィルタリングでき、インフラの追加なしにアドホックな障害調査を行えます。JSONログのフィールドは自動で認識されます。AのAthenaはS3上のデータが対象で、先にログをS3へエクスポートする手間が発生します。CのOpenSearch Serviceは強力な検索基盤ですが、ドメインの作成とログ取り込みの設定が必要です。DのCloudTrail LakeはAWSのAPIアクティビティなどイベントの分析用で、アプリケーションログの集計には適しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html",
  },
  {
    id: "qb-d1-007",
    domain: 1,
    topic: "CloudWatchダッシュボード",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は複数のAWSアカウントと複数のリージョンでワークロードを運用しています。運用チームは、中央のモニタリング専用アカウントのCloudWatchダッシュボード1つで、全アカウント・全リージョンのメトリクスを閲覧したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "各アカウントでLambda関数を実行し、メトリクスを中央アカウントへPutMetricDataで転送する",
      "各アカウントのIAMユーザーを運用チームに配布し、アカウントごとにコンソールを切り替えて閲覧する",
      "CloudWatchのクロスアカウントオブザーバビリティを設定し、モニタリングアカウントに各アカウントをソースアカウントとしてリンクする",
      "全アカウントのメトリクスをS3へ出力し、QuickSightでダッシュボードを作成する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。CloudWatchのクロスアカウントオブザーバビリティでは、モニタリングアカウントとソースアカウントをリンクすることで、複数アカウントのメトリクスやログを1つのアカウントから横断的に閲覧できます。ダッシュボードは複数リージョンのグラフ表示にも対応しています。Aは転送の仕組みを自作・保守する必要があり、メトリクスの二重課金も発生します。Bはダッシュボード1つという要件を満たさず、運用も煩雑です。Dはニアリアルタイムの運用監視には不向きで、構築の手間も大きくなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html",
  },
  {
    id: "qb-d1-008",
    domain: 1,
    topic: "CloudWatchエージェント",
    type: "multiple",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、EC2インスタンスにCloudWatchエージェントをインストールしてメモリ使用率を収集する設定を行いましたが、CloudWatchコンソールにカスタムメトリクスが表示されません。原因として考えられるものはどれですか。(2つ選択してください)",
    choices: [
      "インスタンスの詳細モニタリングが有効化されていない",
      "設定ファイルの誤りなどによりCloudWatchエージェントが起動していない",
      "セキュリティグループのインバウンドルールでCloudWatch用のポートが許可されていない",
      "インスタンスプロファイルのIAMロールにcloudwatch:PutMetricData権限が付与されていない",
      "メトリクスの送信先ロググループが事前に作成されていない",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。エージェントは設定ファイルの構文エラーなどで起動に失敗していることがあり、稼働状態とログの確認が切り分けの基本です。また、エージェントはインスタンスプロファイルの認証情報で送信するため、cloudwatch:PutMetricDataを含む権限(CloudWatchAgentServerPolicyなど)が必須です。Aの詳細モニタリングは標準メトリクスの間隔短縮であり、エージェントのカスタムメトリクスとは無関係です。Cのエージェント通信はアウトバウンドのHTTPSであり、インバウンドルールは影響しません。Eはログ送信側の概念で、メトリクスの表示可否とは関係ありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/troubleshooting-CloudWatch-Agent.html",
  },
  {
    id: "qb-d1-009",
    domain: 1,
    topic: "CloudWatchエージェント",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は数百台のEC2インスタンスでCloudWatchエージェントを稼働させています。全インスタンスのエージェント設定を統一し、設定変更時にも一括で反映できるようにしたいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "エージェント設定ファイルをSystems Managerパラメータストアに保存し、Run Command(AmazonCloudWatch-ManageAgent)で全インスタンスに適用する",
      "設定ファイルを組み込んだAMIを作成し、設定変更のたびに全インスタンスを再構築する",
      "各インスタンスにSSHで接続し、設定ファイルを個別に編集してエージェントを再起動する",
      "ユーザーデータスクリプトに設定を記述し、変更のたびにインスタンスを停止・起動する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CloudWatchエージェントの設定JSONはSystems Managerパラメータストアに保存でき、Run CommandのAmazonCloudWatch-ManageAgentドキュメントでパラメータストア上の設定を指定して全対象へ一括適用できます。State Managerと組み合わせれば継続的な適用も自動化できます。Bは設定変更のたびに再構築が必要で、時間とコストがかかりすぎます。Cは台数が多い環境では現実的でなく、設定のばらつきも生じます。Dのユーザーデータは基本的に初回起動時に実行されるもので、稼働中の設定配布の仕組みとしては不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html",
  },
  {
    id: "qb-d1-010",
    domain: 1,
    topic: "Container Insights",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAmazon ECSクラスターで複数のサービスを運用しています。CloudOpsエンジニアは、タスクレベル・サービスレベルのCPUおよびメモリ使用率をCloudWatchで確認し、クラスター全体のパフォーマンスを可視化したいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "各コンテナにカスタムスクリプトを組み込み、PutMetricData APIでメトリクスを送信する",
      "AWS X-RayのSDKを各タスクに組み込んでリソース使用率を記録する",
      "コンテナインスタンスの詳細モニタリングを有効化する",
      "クラスターでCloudWatch Container Insightsを有効化する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Container InsightsをECSクラスターで有効化すると、タスク・サービス・クラスターの各レベルでCPU、メモリ、ネットワークなどのメトリクスが自動的に収集され、専用ダッシュボードで可視化できます。Aはスクリプトの開発・保守が必要で運用負荷が高くなります。BのX-Rayは分散トレーシングのサービスであり、リソース使用率の収集用途ではありません。Cの詳細モニタリングはEC2インスタンス単位の標準メトリクスの間隔を短縮するだけで、タスクレベルの可視化はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html",
  },
  {
    id: "qb-d1-011",
    domain: 1,
    topic: "Container Insights",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAmazon EKSクラスターでアプリケーションを運用しています。CloudOpsエンジニアは、各Podが標準出力に書き込むアプリケーションログをCloudWatch Logsに集約する必要があります。最も適切な方法はどれですか。",
    choices: [
      "EKSコントロールプレーンのログ記録をすべて有効化する",
      "Fluent BitをDaemonSetとしてデプロイし、ノード上のコンテナログをCloudWatch Logsへ転送する",
      "VPCフローログを有効化してロググループに送信する",
      "CloudTrailの証跡を作成してコンテナのログを記録する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Podのアプリケーションログを収集するには、Container Insightsのログ収集コンポーネントであるFluent Bit(またはCloudWatchエージェント)を各ノードにDaemonSetとして配置し、コンテナログをCloudWatch Logsへ転送するのが標準的な構成です。Aのコントロールプレーンログ記録はAPIサーバーや監査ログなどEKS管理側のログであり、アプリケーションログは含まれません。CのVPCフローログはネットワークトラフィックのメタデータの記録です。DのCloudTrailはAPI呼び出し履歴の記録であり、コンテナのログは収集できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html",
  },
  {
    id: "qb-d1-012",
    domain: 1,
    topic: "EventBridge",
    type: "single",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアが、AWS CLIでEventBridgeルールを作成し、既存のLambda関数をターゲットに設定しました。ルールは有効(ENABLED)で、イベントパターンが対象イベントに一致することも確認済みですが、Lambda関数が一度も呼び出されません。コンソールから同じ設定でルールを作成すると正常に動作します。最も可能性の高い原因はどれですか。",
    choices: [
      "Lambda関数のリソースベースポリシーに、EventBridgeからの呼び出しを許可するアクセス権限が追加されていない",
      "Lambda関数の実行ロールにevents:PutEvents権限が付与されていない",
      "ルールにターゲット呼び出し用のIAMロールがアタッチされていない",
      "Lambda関数に予約済み同時実行数が設定されていない",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。EventBridgeがLambda関数を呼び出すには、関数のリソースベースポリシーでevents.amazonaws.comからのlambda:InvokeFunctionを許可する必要があります。コンソールでターゲットを追加すると権限が自動付与されますが、CLIやAPIではadd-permissionによる明示的な追加が必要です。Bの実行ロールはLambdaが他のサービスへアクセスするための権限で、呼び出される側の許可とは無関係です。CのIAMロール方式はKinesisストリームなど一部ターゲットで使うもので、Lambdaはリソースベースポリシー方式です。Dの予約済み同時実行数は未設定でも呼び出しは妨げられません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-troubleshooting.html",
  },
  {
    id: "qb-d1-013",
    domain: 1,
    topic: "EventBridge",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、毎日午前2時に在庫集計用のLambda関数を自動実行したいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "EC2インスタンスのcronジョブからLambda関数を呼び出す",
      "CloudWatchアラームを毎日午前2時に発報するよう設定する",
      "EventBridgeでcron式のスケジュールルールを作成し、Lambda関数をターゲットに設定する",
      "SQSの遅延キューを使用して24時間ごとにメッセージを配信する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EventBridgeのスケジュールルール(またはEventBridgeスケジューラ)はcron式やrate式で定期的にターゲットを起動でき、サーバーレスで運用負荷がかかりません。Aはcron実行のためだけにEC2を稼働・保守する必要があり、運用負荷とコストが増えます。Bのアラームはメトリクスの閾値超過や状態変化に反応する仕組みであり、指定時刻に発報させる機能はありません。DのSQS遅延キューの配信遅延は最大15分であり、24時間周期の定期実行には使用できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-create-rule-schedule.html",
  },
  {
    id: "qb-d1-014",
    domain: 1,
    topic: "EventBridge",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、いずれかのEC2インスタンスが停止(stopped)状態になったときに、EventBridge経由で運用チームへ通知したいと考えています。ルールに設定するイベントパターンとして正しいものはどれですか。",
    choices: [
      "{\"source\": [\"aws.cloudwatch\"], \"detail-type\": [\"CloudWatch Alarm State Change\"], \"detail\": {\"state\": [\"stopped\"]}}",
      "{\"source\": [\"aws.cloudtrail\"], \"detail-type\": [\"AWS API Call via CloudTrail\"], \"detail\": {\"eventName\": [\"StopInstances\"]}}",
      "{\"source\": [\"aws.ec2\"], \"detail-type\": [\"EC2 Instance State-change Notification\"], \"detail\": {\"state\": [\"running\"]}}",
      "{\"source\": [\"aws.ec2\"], \"detail-type\": [\"EC2 Instance State-change Notification\"], \"detail\": {\"state\": [\"stopped\"]}}",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。EC2インスタンスの状態変化は、ソースaws.ec2、詳細タイプ「EC2 Instance State-change Notification」のイベントとして配信され、detail.stateで対象の状態(stopped)を指定します。Aはアラームの状態変化に一致させるパターンで、インスタンスの状態遷移そのものは捉えられません。BはソースをCloudTrailとしていますが、API呼び出しイベントでもsourceはaws.ec2などサービス名であり、aws.cloudtrailというソースは使われません。CはstateがrunningのためInstance起動時に一致してしまい、停止の検知になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-event-patterns.html",
  },
  {
    id: "qb-d1-015",
    domain: 1,
    topic: "Amazon SNS",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のCloudWatchアラームがALARM状態に遷移しましたが、SNSトピックをアクションに設定しているにもかかわらず、運用チームにEメール通知が届きません。原因として考えられるものはどれですか。(2つ選択してください)",
    choices: [
      "Eメールサブスクリプションが承認待ち(PendingConfirmation)のままになっている",
      "SNSトピックはEメール配信に対応しておらず、Amazon SES経由の設定が必要である",
      "アラームのアクションが無効化(ActionsEnabled=false)されている",
      "SNSトピックとアラームが同一リージョンにあるため通知が抑制されている",
      "対象メトリクスの詳細モニタリングが無効になっている",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。Eメールサブスクリプションは受信者が確認リンクを承認するまで有効にならず、承認待ちのままでは通知が配信されません。また、アラームのアクションが無効化されていると、状態遷移が起きてもSNSへの発行が実行されません。BはSNSがEメールプロトコルを標準でサポートしているため誤りです。Dは逆で、アラームのアクションには同一リージョンのSNSトピックを指定するのが正しい構成であり、同一リージョンであることは問題になりません。Eの詳細モニタリングはメトリクスの間隔の設定であり、通知の配信可否とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-email-notifications.html",
  },
  {
    id: "qb-d1-016",
    domain: 1,
    topic: "CloudWatchアラーム",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業では、夜間バッチジョブが成功するたびにカスタムメトリクスをCloudWatchに発行しています。CloudOpsエンジニアは、ジョブが実行されずメトリクスが送信されなかった場合にもアラームで検知したいと考えています。アラームにどの設定を行うべきですか。",
    choices: [
      "欠落データを「notBreaching(良好)」として扱うよう設定する",
      "欠落データを「breaching(閾値超過)」として扱うよう設定する",
      "評価期間を増やして複数データポイントの平均で判定する",
      "異常検出(Anomaly Detection)ベースのアラームに変更する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudWatchアラームは欠落データの扱い(treat missing data)を設定でき、「breaching」を指定するとデータポイントが届かない期間を閾値超過として扱うため、メトリクスの送信が途絶えたこと自体を検知できます。Aの「notBreaching」は欠落を良好とみなすため、ジョブが動かなくてもアラームは発報しません。Cの評価期間の変更は欠落データの解釈を変えるものではなく、データが無い状態の検知にはなりません。Dの異常検出は過去パターンからの逸脱を検出する仕組みで、データが送信されない状況を確実に検知する設定ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
  },
  {
    id: "qb-d1-017",
    domain: 1,
    topic: "Systems Manager Automation",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、アプリケーションのCloudWatchアラームがALARM状態になった際に、手順書に沿ったサービス再起動処理を自動実行したいと考えています。処理はSystems Manager Automationランブックとして定義済みです。最小の運用負荷でランブックを自動起動できる構成はどれですか。",
    choices: [
      "アラームのアクションにAutomationランブックの実行を直接設定する",
      "運用担当者がアラーム通知メールを受信したら、コンソールからランブックを実行する",
      "アラームの状態変化イベントに一致するEventBridgeルールを作成し、Automationランブックをターゲットに設定する",
      "EC2上のスクリプトでアラーム状態を定期的にポーリングし、ALARM時にStartAutomationExecutionを呼び出す",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。アラームの状態変化はEventBridgeへイベントとして配信されるため、「CloudWatch Alarm State Change」に一致するルールを作成し、Systems Manager Automationをターゲットに指定すれば、追加コードなしでランブックを自動実行できます。Aは誤りで、アラームアクションに設定できるのはSNS通知、EC2アクション、Auto Scalingアクション、OpsItem/インシデント作成などであり、Automationの直接実行はできません。Bは手動対応であり自動化の要件を満たしません。Dはポーリング用サーバーの構築・保守が必要で運用負荷が高くなります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-and-eventbridge.html",
  },
  {
    id: "qb-d1-018",
    domain: 1,
    topic: "EventBridge",
    type: "multiple",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、EventBridgeルールを使ってイベント発生時の自動対応を構成しています。EventBridgeルールのターゲットとして直接指定できるものはどれですか。(2つ選択してください)",
    choices: [
      "Amazon S3バケット",
      "Amazon RDS DBインスタンス",
      "AWS Lambda関数",
      "AWS Configルール",
      "Systems Manager Automationランブック",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。EventBridgeルールはLambda関数、Systems Manager Automation、SNSトピック、SQSキュー、Step Functionsステートマシンなど多数のターゲットを直接指定でき、自動修復処理の起点として広く使われます。AのS3バケットは直接のターゲットにできず、書き込みが必要な場合はLambdaやAmazon Data Firehose経由で構成します。BのRDS DBインスタンスやDのAWS Configルールもターゲットとしてサポートされておらず、これらを操作したい場合はLambda関数やAutomationランブックを経由して実行します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-targets.html",
  },
  {
    id: "qb-d1-019",
    domain: 1,
    topic: "EC2ステータスチェック",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業の重要なEC2インスタンスで、基盤ハードウェアの問題を示すシステムステータスチェック(StatusCheckFailed_System)の失敗が時々発生します。インスタンスID、プライベートIPアドレス、アタッチ済みEBSボリュームを維持したまま自動復旧させたい場合、最も適切な方法はどれですか。",
    choices: [
      "StatusCheckFailed_Systemメトリクスにアラームを設定し、アラームアクションに「復旧(recover)」を指定する",
      "StatusCheckFailed_Instanceメトリクスにアラームを設定し、アラームアクションに「再起動(reboot)」を指定する",
      "Auto Scalingグループに配置し、ヘルスチェック失敗時に新しいインスタンスへ置き換える",
      "アラームアクションに「停止(stop)」を設定し、EventBridgeで別のインスタンスを起動する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。システムステータスチェックの失敗は基盤ホスト側の問題を示すため、復旧(recover)アクションで別の正常なホスト上にインスタンスを復旧させるのが適切です。復旧後もインスタンスID、プライベートIP、Elastic IP、アタッチ済みEBSは維持されます(メモリ上のデータは失われます)。Bの再起動はOSやアプリケーション起因のインスタンスステータスチェック失敗向けで、ホスト障害の解消には不十分です。Cは自動置き換えできますがインスタンスIDやIPが変わるため要件に反します。Dは手作業に近い複雑な構成になり、ID維持もできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-instance-recover.html",
  },
  {
    id: "qb-d1-020",
    domain: 1,
    topic: "CloudTrail",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業で、本番環境のEC2インスタンスが昨夜、何者かによって終了(Terminate)されていたことが判明しました。CloudOpsエンジニアが、いつ、どのIAMエンティティがこの操作を行ったかを特定するために最初に確認すべきものはどれですか。",
    choices: [
      "VPCフローログ",
      "CloudWatchエージェントが収集したOSログ",
      "EC2コンソールのステータスチェックの履歴",
      "CloudTrailのイベント履歴にあるTerminateInstances APIの呼び出し記録",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。CloudTrailはアカウント内のAPI呼び出しを記録しており、イベント履歴では過去90日分のマネジメントイベントを検索できます。TerminateInstancesイベントには実行時刻、呼び出したIAMエンティティ、送信元IPアドレスなどが含まれ、操作者の特定に直結します。AのVPCフローログはネットワークトラフィックのメタデータであり、API操作者は分かりません。BのOSログには終了操作を行った主体の情報は残りません。Cのステータスチェック履歴はインスタンスの健全性の記録であり、誰が操作したかは記録されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/view-cloudtrail-events.html",
  },
  {
    id: "qb-d1-021",
    domain: 1,
    topic: "X-Ray",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のマイクロサービスアプリケーションは、API Gateway、複数のLambda関数、DynamoDBで構成されています。ユーザーから応答遅延の苦情があり、CloudOpsエンジニアはリクエスト単位でどのサービス間呼び出しがボトルネックかをエンドツーエンドで特定したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS X-Ray",
      "Amazon CloudWatchダッシュボード",
      "AWS CloudTrail",
      "VPC Reachability Analyzer",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。X-Rayは分散トレーシングサービスであり、サービスマップとトレースにより、リクエストが通過した各コンポーネントの所要時間やエラーを可視化し、ボトルネックとなる呼び出し区間を特定できます。BのCloudWatchダッシュボードはサービスごとのメトリクス可視化には有効ですが、個々のリクエストを追跡した区間別のレイテンシー分析はできません。CのCloudTrailはAPI操作の監査記録であり、性能分析用ではありません。DのReachability Analyzerはネットワーク経路の到達性を検証するツールで、アプリケーションの遅延分析には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/aws-xray.html",
  },
  {
    id: "qb-d1-022",
    domain: 1,
    topic: "Managed Prometheus/Grafana",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、EKSクラスターのメトリクスをセルフマネージドのPrometheusサーバーで収集し、EC2上のGrafanaで可視化しています。監視基盤の管理負荷が課題であり、既存のPromQLクエリとGrafanaダッシュボードの資産を活かしたままマネージドサービスへ移行したいと考えています。最も適切な構成はどれですか。",
    choices: [
      "すべてのメトリクスをCloudWatch標準メトリクスに置き換え、CloudWatchダッシュボードで可視化する",
      "Prometheusサーバーをより大きなEC2インスタンスへ移行し、AMIバックアップを自動化する",
      "Amazon Managed Service for PrometheusとAmazon Managed Grafanaへ移行する",
      "Container Insightsを有効化し、Logs Insightsでメトリクスを集計する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon Managed Service for PrometheusはPrometheus互換のメトリクス収集・保存基盤でPromQLをそのまま利用でき、Amazon Managed GrafanaはGrafanaのマネージド版として既存ダッシュボード資産を活かせます。いずれもサーバー管理が不要になり、課題を直接解決します。Aはメトリクス体系の全面的な作り直しが必要で、PromQL資産を活かす要件に反します。Bはインスタンスの管理やパッチ適用が残り、マネージド化になりません。DのContainer InsightsはCloudWatchベースの監視であり、PromQLやGrafanaダッシュボードは利用できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html",
  },
];
