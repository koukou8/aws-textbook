// CloudOps教材 分野1(モニタリング、ログ記録、分析、修復、パフォーマンスの最適化)の確認問題
export const questions = [
  // ===== cloudops-d1-ch01: CloudWatch徹底 — メトリクス・ログ・アラーム =====
  {
    id: "cloudops-d1-ch01-q01",
    domain: 1,
    topic: "カスタムメトリクス",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のアプリケーションは、PutMetricData APIを使用して独自の名前空間にカスタムメトリクスを送信しており、API呼び出しはすべて成功しています。しかし、CloudOpsエンジニアが作成したダッシュボードのグラフにはデータが何も表示されません。最も可能性が高い原因はどれですか。",
    choices: [
      "インスタンスの詳細モニタリングが有効になっていないため",
      "PutMetricDataの呼び出しがスロットリングされているため",
      "グラフで指定した名前空間とディメンションの組み合わせが、送信時のものと一致していないため",
      "カスタムメトリクスはアラームを作成するまでグラフに表示されないため",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。CloudWatchのメトリクスは「名前空間+メトリクス名+ディメンション」の組み合わせで一意に識別され、参照時にこの3点が送信時と完全に一致しないとグラフには何も表示されません。表示トラブルではまずグラフ側の名前空間とディメンション指定を確認するのが定石です。Aの詳細モニタリングはEC2標準メトリクスの間隔を1分に短縮する機能で、カスタムメトリクスの表示とは無関係です。BはAPI呼び出しがすべて成功している時点でスロットリングによる欠落は考えられません。Dのような制約は存在せず、アラームがなくてもメトリクスはグラフ表示できます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html",
  },
  {
    id: "cloudops-d1-ch01-q02",
    domain: 1,
    topic: "CloudWatchエージェント(オンプレミス)",
    type: "multiple",
    difficulty: "easy",
    question:
      "ある企業はハイブリッド環境を運用しており、AWS上のEC2インスタンスに加えて、オンプレミスの物理サーバーのメモリ使用率とアプリケーションログもAmazon CloudWatchで一元監視したいと考えています。オンプレミスサーバー側で必要な対応はどれですか。(2つ選択してください)",
    choices: [
      "サーバーにCloudWatchエージェントをインストールする",
      "サーバーにEC2インスタンスプロファイルをアタッチする",
      "サーバーの詳細モニタリングを有効化する",
      "メトリクスとログの送信権限を持つIAMユーザーの認証情報をエージェントに設定する",
      "サーバーが接続するVPCにインターフェイスエンドポイントを必ず作成する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。CloudWatchエージェントはオンプレミスサーバーにもインストールでき、メモリなどのシステムメトリクスとログを収集してCloudWatchへ送信します。オンプレミスではEC2のようにインスタンスプロファイルから認証情報を取得できないため、送信に必要な権限を持つIAMユーザーの認証情報をエージェント側に設定します。BのインスタンスプロファイルはEC2専用の仕組みで、オンプレミスの物理サーバーにはアタッチできません。Cの詳細モニタリングはEC2の標準メトリクスに対する設定で、オンプレミスには適用されません。Eのインターフェイスエンドポイントは必須ではなく、インターネット経由でもサービスエンドポイントへ送信できます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html",
  },
  {
    id: "cloudops-d1-ch01-q03",
    domain: 1,
    topic: "VPCエンドポイント(CloudWatch)",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のセキュリティポリシーでは、機密データを扱うEC2インスタンスのサブネットにインターネット向けの経路(インターネットゲートウェイ・NATゲートウェイ)を作成することが禁止されています。このサブネットのインスタンスにCloudWatchエージェントを導入し、適切なIAMロールも設定しましたが、メトリクスとログがCloudWatchに届きません。ポリシーに準拠したまま解決できる方法はどれですか。",
    choices: [
      "サブネットにNATゲートウェイへのルートを追加する",
      "CloudWatch用(monitoring)とCloudWatch Logs用(logs)のインターフェイスVPCエンドポイントを作成する",
      "CloudWatch用のゲートウェイ型VPCエンドポイントを作成する",
      "セキュリティグループのインバウンドルールでCloudWatchからの通信を許可する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudWatchエージェントはパブリックなサービスエンドポイントへHTTPSで送信するため、インターネット経路のないサブネットからはメトリクスもログも届きません。CloudWatch(monitoring)とCloudWatch Logs(logs)のインターフェイスVPCエンドポイントを作成すれば、PrivateLink経由でインターネットに出ずに送信でき、ポリシーにも準拠します。AのNATゲートウェイは技術的には解決しますが、インターネット向け経路を禁止するポリシーに反します。Cのゲートウェイ型エンドポイントが利用できるのはS3とDynamoDBのみです。Dについて、エージェントの通信はアウトバウンドであり、ステートフルなセキュリティグループにインバウンド許可は不要です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-and-interface-VPC.html",
  },
  {
    id: "cloudops-d1-ch01-q04",
    domain: 1,
    topic: "CloudWatchアラーム評価",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のEC2インスタンスでは、cronジョブの実行により1分程度のCPU使用率スパイクが毎晩発生し、そのたびにCPU使用率アラーム(期間60秒・閾値80%)が発報して運用チームが呼び出されています。チームは、瞬間的なスパイクでは発報させず、高負荷が5分間のうち大半で継続した場合のみ通知したいと考えています。最も適切な変更はどれですか。",
    choices: [
      "アラームの閾値を95%に引き上げる",
      "メトリクスを高解像度(1秒)に変更して評価を細かくする",
      "アラームをCloudWatch異常検出ベースに変更する",
      "アラームの評価条件を「5個中4個のデータポイント超過」のようにN個中M個の形式へ変更する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。CloudWatchアラームは「N個中M個のデータポイント」が閾値を超えたときに発報する条件を設定でき、1分程度の一時的なスパイクでは発報せず、高負荷が継続した場合のみ通知させることができます。一時的なスパイクによる誤発報の抑制はこの設定が定石です。Aの閾値引き上げは、80%台の高負荷が継続する本来検知すべき状態を見逃す副作用があります。Bの高解像度化はデータポイントが増えるだけで、瞬間的な超過で発報する問題は解消しません。Cの異常検出は過去パターンからの逸脱を検知する仕組みであり、「一定時間継続したときだけ発報する」という要件への直接の対処ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
  },
  {
    id: "cloudops-d1-ch01-q05",
    domain: 1,
    topic: "複合アラーム",
    type: "single",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアが、EC2インスタンスのCPU使用率アラームとアプリケーションのレイテンシーアラームをANDで組み合わせた複合アラームを作成し、両方が同時にALARM状態になったときのみ対象インスタンスを自動で再起動しようとしています。しかし、複合アラームのアクション設定にEC2の再起動アクションが見当たりません。要件を満たす方法はどれですか。",
    choices: [
      "複合アラームの状態変化に一致するEventBridgeルールを作成し、SSM AutomationのAWS-RestartEC2Instanceランブックをターゲットに設定する",
      "複合アラームにEC2アクション実行用のサービスロールを関連付けて再起動アクションを有効化する",
      "2つの子アラームそれぞれにEC2再起動アクションを設定する",
      "メトリクス数式で2つのメトリクスを組み合わせた単一のアラームを作成し、EC2再起動アクションを設定する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。複合アラームに設定できるアクションはSNS通知やOpsItem作成などに限られ、EC2アクションやAuto Scalingアクションは設定できません。複合アラームの状態変化イベントをEventBridgeルールで受け、AWS-RestartEC2InstanceなどのSSM Automationランブックを起動するのが定石です。Bのような設定方法は存在しません。Cは子アラームの片方だけがALARMになった場合にも再起動が実行されるため、「両方成立時のみ」という要件に反します。Dについて、EC2アクションを設定できるのはEC2のインスタンス別メトリクスを監視する単一メトリクスのアラームのみで、メトリクス数式に基づくアラームには設定できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html",
  },
  {
    id: "cloudops-d1-ch01-q06",
    domain: 1,
    topic: "メトリクスフィルター",
    type: "single",
    difficulty: "medium",
    question:
      "昨夜発生した障害を受けて、CloudOpsエンジニアはアプリケーションのロググループに「Exception」の出現回数を数えるメトリクスフィルターを本日作成しました。昨夜のログに多数のExceptionが記録されていることはコンソールで確認できますが、生成されたメトリクスをグラフ表示しても昨夜のデータポイントが存在しません。原因はどれですか。",
    choices: [
      "メトリクスフィルターはアラームを設定するまでメトリクスを発行しないため",
      "メトリクスフィルターは作成以降に取り込まれたログイベントにのみ適用され、過去のログには遡及しないため",
      "JSON形式のログにはメトリクスフィルターを適用できないため",
      "ロググループの保持期間が切れて昨夜のログイベントが削除されたため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。メトリクスフィルターは作成以降にロググループへ取り込まれたログイベントにのみ適用され、過去のログイベントには遡及しません。そのため作成前の障害時のExceptionはメトリクスに反映されず、以降に一致するログが届いた時点からデータポイントが生成されます。過去ログの集計が必要な場合はLogs Insightsでのクエリが適切です。Aは誤りで、アラームの有無に関係なくフィルターに一致すればメトリクスは発行されます。CはJSON形式のログにもフィルターパターンを適用できます。Dは、昨夜のログがコンソールで確認できている時点で保持期間切れは該当しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringLogData.html",
  },
  {
    id: "cloudops-d1-ch01-q07",
    domain: 1,
    topic: "SNSとKMS",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業では、セキュリティ強化のため、CloudWatchアラームの通知先SNSトピックの暗号化をカスタマーマネージドKMSキーによるSSE-KMSへ変更しました。その直後から、アラームがALARM状態に遷移しても通知が届かなくなりました。Eメールサブスクリプションは確認済みで、アラームのアクションも有効です。適切な対処はどれですか。",
    choices: [
      "KMSキーのキーポリシーで、CloudWatch(cloudwatch.amazonaws.com)にkms:Decryptとkms:GenerateDataKey*の使用を許可する",
      "Eメールサブスクリプションを削除して再登録し、確認リンクを再承認する",
      "アラームにKMSキーの使用権限を持つIAMロールをアタッチする",
      "SNSトピックを別リージョンに作成し直してアラームに関連付ける",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。SSE-KMSで暗号化されたSNSトピックへCloudWatchアラームがメッセージを発行するには、暗号化に使うカスタマーマネージドキーのキーポリシーで、CloudWatchサービスにkms:Decryptとkms:GenerateDataKey*を許可する必要があります。暗号化を有効化した直後から通知が止まった場合の典型的な原因です。Bのサブスクリプションは確認済みであることが分かっており、原因ではありません。Cについて、アラームからSNSへの発行はサービスが行う仕組みで、ユーザーがアラームにIAMロールをアタッチする設定は存在しません。Dのリージョン変更は無関係で、アラームには同一リージョンのトピックを指定するのが正しい構成です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-key-management.html",
  },
  {
    id: "cloudops-d1-ch01-q08",
    domain: 1,
    topic: "ログの長期アーカイブ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、監査要件によりアプリケーションログを5年間保管する必要がありますが、保管中のログを参照することはほとんどありません。現在すべてのログをCloudWatch Logsに無期限で保存しており、保存料金が増え続けています。最もコスト効率の良い対応はどれですか。",
    choices: [
      "各ロググループの保持期間を5年に設定してCloudWatch Logsで保管を続ける",
      "CloudWatch Logs Insightsで集計した結果のみを保存し、元のログは削除する",
      "サブスクリプションフィルターでAmazon OpenSearch Serviceへ転送して保管する",
      "ログをS3へ配信し、ライフサイクルポリシーで低コストのストレージクラスへ移行したうえで、ロググループの保持期間を短く設定する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。アクセス頻度の低い長期保管ログをCloudWatch Logsに置き続けると保存料金が高くつくため、S3へ配信(エクスポートまたはサブスクリプションフィルター+Amazon Data Firehose)し、ライフサイクルポリシーでGlacierなどの低コストクラスへ移行しつつ、ロググループ側の保持期間を短くするのが定石です。Aは要件自体は満たしますが、CloudWatch Logsの保存単価が高いままでコスト最適になりません。Bは元のログを失うため5年間の保管という監査要件に反します。CのOpenSearch Serviceは検索クラスターの稼働コストが高く、参照頻度の低いアーカイブ用途には不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/S3Export.html",
  },
  {
    id: "cloudops-d1-ch01-q09",
    domain: 1,
    topic: "Container Insights(EKS)",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAmazon EKSクラスターでContainer Insightsを構成し、ノードおよびPod単位のCPU・メモリメトリクスをCloudWatchで可視化したいと考えています。メトリクス収集コンポーネントのデプロイ方法として最も適切なものはどれですか。",
    choices: [
      "各アプリケーションPodにCloudWatchエージェントをサイドカーコンテナとして追加する",
      "EKSコントロールプレーンのログ記録をすべて有効化する",
      "CloudWatchエージェントをDaemonSetとしてデプロイし、各ノードで稼働させる",
      "Fluent BitをDaemonSetとしてデプロイし、メトリクスを収集させる",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EKSでContainer Insightsのメトリクス(ノード・Pod単位のCPU・メモリなど)を収集するには、CloudWatchエージェントを各ノードで稼働するDaemonSetとしてデプロイするのが標準構成です。Aのサイドカー方式はPodごとにコンテナが増えて非効率なうえ、ノードレベルの情報を収集できず、Container Insightsの構成としても標準ではありません。BのコントロールプレーンログはAPIサーバーや監査ログなどEKS管理側のログであり、Podのリソースメトリクスは含まれません。DのFluent Bitはアプリケーションログなどのログ収集を担うコンポーネントで、メトリクス収集用ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html",
  },

  // ===== cloudops-d1-ch02: 分析と自動修復 =====
  {
    id: "cloudops-d1-ch02-q01",
    domain: 1,
    topic: "EventBridgeイベントバス",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、EC2インスタンスの状態変化(stopped)を検知するEventBridgeルールを、運用ツール用に作成したカスタムイベントバス上に作成しました。イベントパターンは正しいことを確認済みですが、インスタンスを停止してもルールは一度も一致しません。同じパターンのルールをデフォルトイベントバスに作成すると正常に動作します。原因はどれですか。",
    choices: [
      "EC2の状態変化イベントの受信にはCloudTrail証跡の有効化が必要なため",
      "ターゲットのリソースベースポリシーにEventBridgeからの呼び出し許可がないため",
      "AWSサービスが発行するイベントはデフォルトイベントバスにのみ配信され、カスタムイベントバスには流れないため",
      "カスタムイベントバス上のルールにはdetail-typeの指定が必須で、指定が欠けているため",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2の状態変化などAWSサービスが発行するイベントは、そのアカウントのデフォルトイベントバスにのみ配信されます。カスタムイベントバスが受け取るのは独自アプリケーションやパートナーのイベントであるため、カスタムバス上のルールはパターンが正しくても一致しません。AWSサービスのイベントを扱うルールはデフォルトバスに作成する必要があります。Aの証跡が必要なのは「AWS API Call via CloudTrail」型のイベントであり、状態変化イベントには不要です。Bのターゲット権限の不足はルール一致後の呼び出し失敗の原因で、一致自体が起きていない本件とは異なります。Dのような必須指定の違いは存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-event-bus.html",
  },
  {
    id: "cloudops-d1-ch02-q02",
    domain: 1,
    topic: "Systems Manager Automation",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、毎月のメンテナンスで「EC2インスタンスのAMIを取得し、インスタンスを停止し、インスタンスタイプを変更して起動し、動作を確認する」という手順を担当者が手作業で実施しており、先月は手順の抜け漏れによる障害が発生しました。この一連の手順をコード化し、再現性のある形で自動実行できるようにしたいと考えています。最も適切なサービス・機能はどれですか。",
    choices: [
      "SSM Run Commandでインスタンス内にシェルスクリプトを配布して実行する",
      "SSM Automationのカスタムランブックとして手順を定義して実行する",
      "SSM State Managerの関連付けで手順を定義して適用する",
      "SSM Session Managerで接続し、画面共有しながら手順書どおりに操作する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AMI取得→停止→インスタンスタイプ変更→起動のようにAWS APIをまたぐ一連の手順は、Systems Manager Automationのカスタムランブックとしてコード化するのが適切です。aws:executeAwsApiなどのステップで手順と順序を定義でき、再現性の高い実行が可能になります。AのRun Commandはインスタンス内でコマンドを実行する単発操作向けで、停止中のインスタンスに対するAWS API操作を含むフロー全体は制御できません。CのState Managerは構成を継続的に維持するための仕組みで、一連の手順の実行用ではありません。DのSession Managerは対話的なアクセス手段であり、手作業とミスの余地が残ります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-automation.html",
  },
  {
    id: "cloudops-d1-ch02-q03",
    domain: 1,
    topic: "Automation承認ステップ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、CloudWatchアラームを起点にSSM Automationランブックでアプリケーションサーバーを自動再起動していますが、先日、想定外の状況で本番サーバーが自動再起動されてしまう事故が発生しました。検知と情報収集の自動化は維持しつつ、再起動の実行直前に運用リーダーの承認を必須にしたいと考えています。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "アラーム発生時にEventBridgeルールを手動で有効化してからランブックを実行する運用にする",
      "自動修復を廃止し、すべての再起動作業を手動運用に戻す",
      "ランブックは通知のみ行い、承認後に担当者が別途コマンドで再起動を実行する手順書を整備する",
      "ランブックの再起動ステップの前にaws:approveステップを追加し、承認者の承認後に後続を実行させる",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。SSM Automationランブックにはaws:approveステップを組み込むことができ、指定した承認者が承認するまで実行を一時停止できます。検知や情報収集は自動化したまま、影響の大きい再起動の直前にだけ人の判断を挟む半自動運用を、ランブックの修正のみで実現できます。Aのルールの手動有効化・無効化は操作ミスを招きやすく、承認の記録も残りません。Bの全面手動化は自動化の利点を放棄し、運用負荷が大幅に増加します。Cは通知と実行が分断されて手作業とミスの余地が残り、承認から実行までを1つの仕組みとして管理できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/automation-action-approve.html",
  },
  {
    id: "cloudops-d1-ch02-q04",
    domain: 1,
    topic: "自動修復のIAM権限",
    type: "multiple",
    difficulty: "hard",
    question:
      "CloudOpsエンジニアが、CloudWatchアラームの状態変化イベントをEventBridgeルールで受け、SSM Automationランブックでインスタンスを再起動する自動修復を構成しました。アラームがALARMに遷移してもランブックによる修復が完了しません。原因として考えられるものはどれですか。(2つ選択してください)",
    choices: [
      "アラームのアクションが無効化されていると状態変化イベントがEventBridgeへ配信されないため",
      "EventBridgeルールに関連付けたIAMロールにssm:StartAutomationExecution権限がないため",
      "SSM AutomationランブックはEventBridgeからの自動起動に対応していないため",
      "Automationの実行に指定したサービスロールに、ec2:RebootInstancesなど修復操作の権限がないため",
      "アラームがINSUFFICIENT_DATA状態を経由するとイベントが発行されなくなるため",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。EventBridgeルールのターゲットにSSM Automationを指定する場合、ルールにssm:StartAutomationExecutionを許可するIAMロールを関連付ける必要があり、不足するとランブックが開始されません。また、Automation実行時のサービスロールに修復対象の操作権限がなければ、実行が開始されてもステップが失敗します。修復の実行主体の権限不足は「自動修復が動かない」トラブルの最頻出原因です。Aは誤りで、状態変化イベントはアラームアクションの有効・無効に関係なく配信されます。CのAutomationはEventBridgeのターゲットとしてサポートされています。Eのような仕様はなく、状態遷移のたびにイベントは発行されます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-troubleshooting.html",
  },
  {
    id: "cloudops-d1-ch02-q05",
    domain: 1,
    topic: "CloudTrail組織証跡",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Organizationsで複数のメンバーアカウントを運用する企業が監査を受け、「各アカウントのAPI操作履歴が90日分しか確認できず、全アカウントを横断した調査もできない」と指摘されました。全メンバーアカウント・全リージョンのAPI操作履歴を1年以上保持し、一元的に調査できるようにする必要があります。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "管理アカウントで全リージョンを対象とする組織証跡を1つ作成し、中央のS3バケットへログを配信する",
      "各メンバーアカウントで個別に証跡を作成し、ログファイルを毎月手動で集約する",
      "各アカウントのCloudTrailイベント履歴の保持期間を1年に延長する",
      "AWS Configのアグリゲーターを構成して全アカウントの操作履歴を集約する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CloudTrailの組織証跡を管理アカウント(または委任された管理者)で1つ作成すれば、組織内の全メンバーアカウント・全リージョンの管理イベントを中央のS3バケットへ継続的に配信でき、90日を超える長期保持と横断的な調査を最小の運用負荷で実現できます。Bはアカウント数に比例して設定と集約の作業が増え、運用負荷が高くなります。Cのイベント履歴は過去90日分に固定されており、保持期間の延長はできません。DのAWS Configアグリゲーターが集約するのはリソース構成とルール準拠状況であり、APIの呼び出し履歴の保管には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/creating-trail-organization.html",
  },
  {
    id: "cloudops-d1-ch02-q06",
    domain: 1,
    topic: "自動修復の3段構成",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のEC2上のアプリケーションは、CloudWatch Logsのロググループに「FATAL」という文字列を含むログを出力することがあり、そのたびに運用担当者が手動でサービスを再起動しています。FATALの発生を検知したら数分以内に自動でサービス再起動を実行する仕組みを、追加のサーバーなしで構築したいと考えています。最も適切な構成はどれですか。",
    choices: [
      "サブスクリプションフィルターのターゲットにSSM Automationランブックを直接指定して再起動を実行する",
      "メトリクスフィルターでFATALの回数をメトリクス化してアラームを設定し、アラームの状態変化イベントをEventBridge経由でSSM Automationランブックに連携して再起動を実行する",
      "CloudWatch Logs Insightsのスケジュールクエリを構成し、FATAL検出時にランブックを起動する",
      "CloudTrailのデータイベントでFATAL文字列を検知し、SNS経由で再起動スクリプトを起動する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ログ中のパターン検知にはメトリクスフィルターで出現回数をメトリクス化してアラームを設定し、アラームの状態変化イベントをEventBridgeルールで受けてSSM Automationランブック(aws:runCommandでのサービス再起動など)を起動する、検知→ルーティング→修復の3段構成が定石です。Aは誤りで、サブスクリプションフィルターの配信先はLambda、Amazon Data Firehose、Kinesis Data Streamsなどに限られ、Automationを直接指定できません。CのLogs Insightsはアドホック調査用であり、クエリ結果を契機に自動処理を起動する仕組みはありません。DのCloudTrailはAPI呼び出しの記録であり、アプリケーションログの内容は検知できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-and-eventbridge.html",
  },
  {
    id: "cloudops-d1-ch02-q07",
    domain: 1,
    topic: "ADOTとX-Ray",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、EKS上のマイクロサービスの分散トレースをAWS X-Rayで可視化したいと考えています。社内方針として、アプリケーションの計装はベンダー中立なOpenTelemetry標準に統一することが決まっています。この方針に沿ってトレースを収集しX-Rayへ送信するために導入すべきものはどれですか。",
    choices: [
      "X-Ray SDKで各サービスを計装し、X-Rayデーモンを各ノードで実行する",
      "Container Insightsを有効化してトレースを収集する",
      "AWS Distro for OpenTelemetry(ADOT)を導入し、コレクター経由でX-Rayへトレースを送信する",
      "Fluent BitをDaemonSetとして導入し、トレースをX-Rayへ転送する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Distro for OpenTelemetry(ADOT)は、OpenTelemetry標準で計装したアプリケーションのトレースを収集し、AWS X-Rayへ送信できるAWSサポートのディストリビューションです。ベンダー中立な標準への統一とX-Rayによる可視化を両立できます。AのX-Ray SDKとデーモンによる計装はX-Ray固有の方式であり、OpenTelemetryへ統一するという方針に合いません。BのContainer Insightsはコンテナのメトリクスとログを収集・可視化する機能で、分散トレースの収集は行いません。Dのようにログ転送用コンポーネントであるFluent BitでトレースをX-Rayへ送ることはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/aws-xray.html",
  },
  {
    id: "cloudops-d1-ch02-q08",
    domain: 1,
    topic: "Lambdaによる修復",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、特定のCloudWatchアラームがALARM状態になった際の対応として、社外のITサービス管理(ITSM)ツールのAPIを呼び出してチケットを起票し、営業時間かどうかに応じて処理を分岐する独自ロジックを自動実行する必要があります。アラームの状態変化を受けるEventBridgeルールのターゲットとして最も適切なものはどれですか。",
    choices: [
      "独自ロジックを実装したAWS Lambda関数",
      "AWSが提供する事前定義のSSM Automationランブック",
      "CloudWatchアラームのEC2復旧(recover)アクション",
      "SNSトピックのEメールサブスクリプションによる担当者への通知",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。外部のITSM APIの呼び出しや営業時間による分岐といった独自ロジックを含む処理は、EventBridgeルールのターゲットにAWS Lambda関数を指定して実装するのが適切です。定型的なAWS操作はSSM Automation、独自ロジックや外部API連携はLambdaという使い分けが自動修復設計の定石です。Bの事前定義ランブックはAWSリソースの定型操作が対象で、外部システムへの起票や独自の分岐は実装できません。CのEC2復旧アクションは基盤ホスト障害時にインスタンスを復旧する機能で、本要件とは無関係です。DのEメール通知では起票や判断が手作業のまま残り、自動実行の要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-targets.html",
  },
  {
    id: "cloudops-d1-ch02-q09",
    domain: 1,
    topic: "State Manager",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、数百台のEC2インスタンスでCloudWatchエージェントを稼働させていますが、担当者による手動変更などが原因で、一部のインスタンスでエージェントが停止していたり設定が書き換わっていたりする状態が繰り返し見つかっています。エージェントが常に導入・起動され、標準設定が適用された状態を自動的に維持し、新規起動されたインスタンスにも同じ状態を適用したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "問題が見つかるたびにSSM Run Commandでエージェントを再設定する",
      "SSM Automationランブックを一度実行して全インスタンスを修正する",
      "インスタンスを毎週再作成して構成を初期状態に戻す",
      "SSM State Managerの関連付けを作成し、タグで対象を指定してスケジュールに従い設定を継続的に適用する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Systems Manager State Managerは、関連付け(association)で定義した状態(エージェントの導入・起動・設定適用など)をスケジュールに従って対象へ繰り返し適用し、構成のドリフトを自動的に是正する「構成を継続的に維持する」仕組みです。タグでターゲットを指定すれば、新規に起動したインスタンスへも自動的に適用されます。AのRun Commandは単発実行のため、ドリフトのたびに人が検知して実行する運用が残ります。BのAutomationの一回実行も同様に、その後のドリフトには対応できません。Cの定期的な再作成は影響と作業負荷が大きく、ドリフト対策として過剰です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-state.html",
  },

  // ===== cloudops-d1-ch03: パフォーマンスの最適化 =====
  {
    id: "cloudops-d1-ch03-q01",
    domain: 1,
    topic: "EBS Elastic Volumes",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のコスト見直しで、本番環境の数百個のgp2ボリュームのEBSコスト削減が指示されました。現在の性能で問題は発生しておらず、アプリケーションを停止することは許可されていません。最も適切な対応はどれですか。",
    choices: [
      "各ボリュームのスナップショットからgp3ボリュームを新規作成し、インスタンスに付け替える",
      "Elastic Volumesの変更操作で、稼働中のままボリュームタイプをgp3へ変更する",
      "ボリュームタイプをst1へ変更してGBあたりの単価を下げる",
      "データをインスタンスストアへ移行してEBSボリュームを削除する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EBSはElastic Volumesにより、ボリュームをデタッチしたりインスタンスを停止したりすることなく、稼働中にgp2からgp3へタイプ変更できます。gp3はgp2よりGBあたり約2割安く、ベースラインで3,000IOPSを備えるため、性能を維持したままダウンタイムなしでコストを削減できます。Aのスナップショットからの作り直しは付け替え時に停止が必要になり、数百ボリュームでは作業負荷も過大です。Cのst1はHDDベースでランダムI/Oに不向きなうえ、ブートボリュームには使用できません。Dのインスタンスストアは揮発性で、インスタンスの停止によりデータが失われるため永続データの移行先になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-modify-volume.html",
  },
  {
    id: "cloudops-d1-ch03-q02",
    domain: 1,
    topic: "EBS最適化インスタンス",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のデータベースサーバーは、io2ボリュームに高いIOPSをプロビジョニングしていますが、ピーク時にI/O性能が頭打ちになります。CloudWatchで確認すると、ボリュームの実測IOPSとスループットはプロビジョニング値を大きく下回った水準で頭打ちになっており、CPU使用率には余裕があります。最も適切な対処はどれですか。",
    choices: [
      "ボリュームのプロビジョンドIOPSをさらに引き上げる",
      "ボリュームをgp3に変更してスループットを個別に設定する",
      "EBS帯域(EBS最適化性能)の上限がより大きいインスタンスタイプへ変更する",
      "ボリュームのマルチアタッチを有効化して帯域を拡張する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ボリュームの実測性能がプロビジョニング値を下回ったまま頭打ちになっている場合、ボトルネックはボリュームではなくインスタンス側です。インスタンスタイプごとにEBS最適化の帯域・IOPS上限が定められており、その上限に達するとボリュームの性能を使い切れないため、EBS帯域の大きいインスタンスタイプへの変更が適切です。Aはボリュームの上限に達していないため、引き上げても効果がありません。Bのgp3は最大性能がio2より低く、インスタンス側の上限という原因も解消しません。Dのマルチアタッチは複数インスタンスから同時アタッチするio1/io2の機能で、単一インスタンスの帯域は増えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ebs-optimized.html",
  },
  {
    id: "cloudops-d1-ch03-q03",
    domain: 1,
    topic: "EBSボリュームタイプ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、EC2上で大容量のログファイルを毎日連続的に読み書きするビッグデータ処理基盤を構築します。アクセスパターンは大きなファイルのシーケンシャルアクセスが中心で、高いスループットを低コストで確保することが最優先です。最も適切なEBSボリュームタイプはどれですか。",
    choices: [
      "gp3(汎用SSD)",
      "io2(プロビジョンドIOPS SSD)",
      "sc1(Cold HDD)",
      "st1(スループット最適化HDD)",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。st1(スループット最適化HDD)は、大きなファイルのシーケンシャルアクセスに対して高いスループットを低コストで提供するボリュームタイプで、ログ処理やビッグデータ処理に最適です。Aのgp3でも動作はしますが、大容量のシーケンシャルワークロードではst1の方がGBあたりのコストを大幅に抑えられます。Bのio2は小さなランダムI/Oが中心のミッションクリティカルなデータベース向けで、本用途には過剰でコストも高くなります。Cのsc1はアクセス頻度の低いコールドデータ向けの最安HDDで、毎日連続的にアクセスされる本ワークロードには性能が不足します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html",
  },
  {
    id: "cloudops-d1-ch03-q04",
    domain: 1,
    topic: "S3読み取りパフォーマンス",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業は、東京リージョンの単一のS3バケットから世界中のユーザーへデータファイルを直接配信しています。海外ユーザーからダウンロードが遅いという苦情があるほか、人気ファイルへのアクセスが集中する時間帯には503(Slow Down)エラーが発生しています。読み取りパフォーマンスを改善できる方法はどれですか。(2つ選択してください)",
    choices: [
      "オブジェクトキーを複数のプレフィックスに分散してリクエストを並列化する",
      "バケットのバージョニングを有効化する",
      "CloudFrontディストリビューションを前段に配置し、繰り返しダウンロードされるオブジェクトをエッジでキャッシュする",
      "ゲートウェイ型VPCエンドポイント経由でアクセスさせる",
      "ライフサイクルポリシーでオブジェクトをS3 Glacier Flexible Retrievalへ移行する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。S3のリクエストレートはプレフィックス単位で自動スケールするため、キーを複数プレフィックスへ分散するとアクセス集中時の503(Slow Down)を回避しやすくなります。また、CloudFrontを前段に置いて人気オブジェクトをエッジでキャッシュすれば、海外ユーザーのレイテンシー改善とS3への直接リクエスト削減を同時に実現できます。Bのバージョニングは誤削除・上書き対策であり、性能には影響しません。DのゲートウェイエンドポイントはVPC内からのプライベート経路であり、インターネット上のユーザーの改善にはなりません。EのGlacierへの移行は取り出しに時間がかかるようになり、逆効果です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/optimizing-performance.html",
  },
  {
    id: "cloudops-d1-ch03-q05",
    domain: 1,
    topic: "FSx for Lustre",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業の機械学習チームは、Amazon S3バケットに保存した学習データを使って、多数のEC2インスタンスからなるGPUクラスターでトレーニングを実行します。S3のデータをファイルとして扱える高スループットの並列ファイルシステムが必要です。最も適切なサービスはどれですか。",
    choices: [
      "Amazon FSx for Lustre",
      "Amazon FSx for Windows File Server",
      "Amazon EFS",
      "Amazon FSx for NetApp ONTAP",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Amazon FSx for LustreはHPCや機械学習向けの高性能並列ファイルシステムで、S3バケットとリンクさせてオブジェクトをファイルとして透過的に扱いながら、多数のノードから高スループットで並列アクセスできます。学習データがS3にあるという条件と並列高速アクセスという要件の両方に合致します。BのFSx for Windows File ServerはSMBプロトコルとActive Directory統合を必要とするWindowsワークロード向けです。CのEFSはLinux向けの汎用NFS共有には適しますが、LustreのようなS3統合と並列性能は提供しません。DのFSx for NetApp ONTAPはNetApp資産の移行やマルチプロトコル用途向けです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/fsx/latest/LustreGuide/what-is.html",
  },
  {
    id: "cloudops-d1-ch03-q06",
    domain: 1,
    topic: "EFSパフォーマンスモード",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のWebアプリケーションは、小さなファイルを大量に読み取るワークロードをEFSファイルシステム上で実行していますが、ファイル操作あたりのレイテンシーが高いという問題があります。調査の結果、このファイルシステムは数年前に最大I/O(Max I/O)パフォーマンスモードで作成されていたことが分かりました。レイテンシーを改善するために適切な対応はどれですか。",
    choices: [
      "既存ファイルシステムのパフォーマンスモードを汎用(General Purpose)へオンラインで変更する",
      "汎用(General Purpose)パフォーマンスモードで新しいファイルシステムを作成し、AWS DataSyncでデータを移行する",
      "スループットモードをプロビジョンドスループットへ変更する",
      "ライフサイクル管理で低頻度アクセス(IA)ストレージクラスへファイルを移行する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EFSのパフォーマンスモードは作成時にのみ指定でき、作成後に変更できません。最大I/Oモードは高い並列性向けの旧来の選択肢で、汎用モードよりファイル操作あたりのレイテンシーが高くなります。レイテンシーを下げるには、推奨である汎用モードのファイルシステムを新規作成し、AWS DataSyncなどでデータを移行するのが正攻法です。Aはパフォーマンスモードの変更自体が不可能です。Cのスループットモードは帯域に関する設定であり、モード起因のレイテンシーは解消しません。DのIAクラスへの移行はコスト削減の機能で、アクセス時のレイテンシーはむしろ増加します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/efs/latest/ug/performance.html",
  },
  {
    id: "cloudops-d1-ch03-q07",
    domain: 1,
    topic: "RDSリードレプリカ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のRDS for PostgreSQLでは、月末にBIツールから実行される大量の集計クエリ(読み取り専用)によってCPU使用率が高騰し、本番のトランザクション処理が遅延します。BIツールの接続先設定は変更可能です。トランザクション処理への影響を取り除くために最も適切な対応はどれですか。",
    choices: [
      "RDS Proxyを導入してBIツールの接続をプールする",
      "マルチAZ DBインスタンス配置に変更し、スタンバイで集計クエリを実行する",
      "リードレプリカを作成し、BIツールの接続先をレプリカのエンドポイントへ変更する",
      "拡張モニタリングを有効化してOSレベルの負荷を分析する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。読み取り専用の集計クエリによる負荷は、リードレプリカを作成してBIツールの接続先をレプリカへ切り替えることで、プライマリのトランザクション処理から分離できます。「読み取り負荷の分散にはリードレプリカ」という使い分けが決め手です。AのRDS Proxyは接続の確立・破棄を効率化する接続プールであり、クエリの実行負荷そのものはプライマリに残ります。BのマルチAZ DBインスタンス配置は高可用性のための構成で、スタンバイは読み取りリクエストを処理できません。Dの拡張モニタリングは可視化のための機能であり、負荷の分離という要件には直接つながりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
  },
  {
    id: "cloudops-d1-ch03-q08",
    domain: 1,
    topic: "Compute Optimizer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Compute Optimizerを有効化し、EC2インスタンスのサイジング見直しを進めています。しかし、推奨内容を確認すると、メモリ使用率が分析に含まれておらず、メモリ観点では過剰プロビジョニングかどうか判断できません。メモリ使用率を加味した推奨を得るために必要な対応はどれですか。",
    choices: [
      "CloudWatchエージェントを導入してメモリ使用率のメトリクスを収集する",
      "インスタンスの詳細モニタリングを有効化する",
      "Compute Optimizerの拡張インフラストラクチャメトリクスを有効化する",
      "AWS Trusted Advisorのコスト最適化チェックに切り替える",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Compute OptimizerがEC2の推奨にメモリ使用率を加味するには、CloudWatchエージェントでメモリのメトリクスを収集しておく必要があります。メモリはOS内部の情報でありハイパーバイザーからは取得できないため、標準ではCPUやネットワークなどのみが分析対象になります。Bの詳細モニタリングは既存の標準メトリクスの間隔を1分に短縮するだけで、メモリメトリクスは追加されません。Cの拡張インフラストラクチャメトリクスは分析対象の履歴期間を延長する有料オプションで、メモリを収集する機能ではありません。DのTrusted Advisorに切り替えても、ワークロード実績に基づく詳細なサイジング推奨は得られません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/compute-optimizer/latest/ug/what-is-compute-optimizer.html",
  },
  {
    id: "cloudops-d1-ch03-q09",
    domain: 1,
    topic: "プレイスメントグループ",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業がクラスタープレイスメントグループで稼働中のHPCクラスターにインスタンスを追加起動しようとしたところ、キャパシティ不足(InsufficientInstanceCapacity)エラーが発生しました。有効な対処はどれですか。(2つ選択してください)",
    choices: [
      "同じプレイスメントグループのまま別のアベイラビリティーゾーンでインスタンスを起動する",
      "グループ内のすべてのインスタンスを一旦停止してから、同時に起動し直す",
      "プレイスメントグループの戦略をスプレッドに変更する",
      "追加するインスタンスをグループ内の既存インスタンスと同じインスタンスタイプで起動する",
      "インスタンスをパーティションプレイスメントグループへ移動する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。クラスタープレイスメントグループは単一AZ内の物理的に近接した容量を必要とするため、後からの追加起動でキャパシティ不足が発生することがあります。対処の定石は、グループ内の全インスタンスを一旦停止してから同時に起動し直して近接した容量をまとめて確保することと、グループ内のインスタンスタイプを統一して確保を容易にすることです。Aは誤りで、クラスター戦略のグループは単一AZ内に限定されるため別AZでは起動できません。Cのプレイスメントグループの戦略は作成後に変更できません。Eのパーティション戦略への移動は、低レイテンシー・高スループットというクラスター配置本来の目的を失わせます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/placement-groups.html",
  },
];
