// CloudOps問題集 分野1(モニタリング、ログ記録、分析、修復、パフォーマンスの最適化)後半 qb-d1-023〜qb-d1-044
export const questions = [
  {
    id: "qb-d1-023",
    domain: 1,
    topic: "CloudWatch Logs",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のCloudWatch Logsの利用料金が毎月増え続けています。調査したところ、すべてのロググループでログが無期限に保存されていました。コンプライアンス上、ログの保持は90日で十分です。最もコスト効率よく対応できる方法はどれですか。",
    choices: [
      "ロググループを毎月手動で削除して作り直す",
      "各ロググループの保持期間(retention)を90日に設定する",
      "サブスクリプションフィルターで古いログを別のロググループへ移動する",
      "CloudWatchエージェントのログ送信間隔を長くする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudWatch Logsのログイベントは既定で無期限に保存されるため、ロググループごとに保持期間を設定するのが基本のコスト対策です。90日に設定すれば、期限を過ぎたログイベントは自動的に削除され、以降の保存料金を抑えられます。Aは手動運用の負荷が高いうえ、削除のタイミングによっては保持が必要な直近のログまで失われます。Cのサブスクリプションフィルターはログの転送・処理の仕組みであり、古いログの自動削除はできません。Dは送信間隔の調整にすぎず、保存されるログの総量と保存期間は変わりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html",
  },
  {
    id: "qb-d1-024",
    domain: 1,
    topic: "CloudWatch異常検出",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のECサイトでは、リクエスト数が時間帯や曜日によって大きく変動します。静的な閾値のCloudWatchアラームでは、深夜帯には異常の検知漏れが、ピーク時には誤検知が発生しています。トラフィックのパターンに応じて動的に判定させたい場合、最も適切な方法はどれですか。",
    choices: [
      "複合アラームを作成して昼用と夜用のアラームを組み合わせる",
      "閾値を最も高いピーク時の値に合わせて引き上げる",
      "評価期間を24時間に延長して平均値で判定する",
      "CloudWatch異常検出を有効化し、期待値の帯域から外れた場合に発報するアラームを作成する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。CloudWatch異常検出は、過去のメトリクスを機械学習で分析して期待値の帯域(バンド)を生成し、帯域から外れたときに発報するアラームを構成できます。時間帯や曜日による周期的な変動を自動的に学習するため、静的な閾値の課題を解消できます。Aの複合アラームは複数アラームの状態を論理式で組み合わせる機能で、時間帯ごとの閾値切り替えはできません。Bは深夜帯の異常をさらに検知できなくします。Cは検知が大幅に遅れ、短時間のスパイクや急減を平均がならしてしまうため監視として機能しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html",
  },
  {
    id: "qb-d1-025",
    domain: 1,
    topic: "CloudWatch Logs",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、CloudWatch Logsに集約したアプリケーションログのうち、特定パターンに一致するログイベントをニアリアルタイムで社内の分析基盤(Amazon S3とAmazon OpenSearch Service)へ連携したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "サブスクリプションフィルターを設定し、Amazon Data FirehoseやLambda関数へログイベントをストリーミングする",
      "ロググループのS3エクスポートタスクを毎時実行する",
      "メトリクスフィルターで一致件数をメトリクス化し、分析基盤から参照する",
      "ロググループの保持期間を短くしてS3ライフサイクルで移行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。サブスクリプションフィルターは、ロググループに届いたログイベントをフィルターパターンで絞り込み、Amazon Data Firehose、Lambda、Kinesis Data Streamsへニアリアルタイムでストリーミングできます。Firehose経由でS3やOpenSearch Serviceへの配信も構成できます。BのS3エクスポートはバッチ処理であり、リアルタイム性の要件を満たしません。Cのメトリクスフィルターは件数などの数値化のみで、ログイベント本文は転送できません。DのライフサイクルはS3上のオブジェクト管理機能であり、CloudWatch Logsからの連携手段ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/SubscriptionFilters.html",
  },
  {
    id: "qb-d1-026",
    domain: 1,
    topic: "CloudTrail",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業で、S3バケット内の重要なオブジェクトが削除される事象が発生しました。CloudOpsエンジニアがCloudTrailのイベント履歴を確認したところ、バケットの作成・削除などの操作は記録されていましたが、DeleteObjectなどオブジェクトレベルの操作は見つかりませんでした。今後これらの操作をCloudTrailで記録するにはどうすべきですか。",
    choices: [
      "イベント履歴の保持期間を延長する",
      "証跡のログファイル整合性検証を有効化する",
      "証跡で対象バケットのS3データイベントの記録を有効化する",
      "証跡のマネジメントイベントで「書き込み」イベントの記録を有効化する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。GetObjectやDeleteObjectといったオブジェクトレベルの操作はデータイベントに分類され、既定では記録されません。証跡(またはCloudTrail Lakeのイベントデータストア)でS3データイベントの記録を明示的に有効化する必要があり、追加料金が発生します。Aのイベント履歴はマネジメントイベントのみが対象で、期間を変えてもデータイベントは表示されません。Bの整合性検証はログファイルの改ざん検知の機能であり、記録対象は増えません。Dのマネジメントイベントにはオブジェクトレベルの操作が含まれないため、書き込みを有効化しても記録されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html",
  },
  {
    id: "qb-d1-027",
    domain: 1,
    topic: "X-Ray",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業がEC2上のアプリケーションにX-Ray SDKを組み込みましたが、X-Rayコンソールにトレースが一切表示されません。原因として考えられるものはどれですか。(2つ選択してください)",
    choices: [
      "サンプリングルールですべてのリクエストが記録対象になっている",
      "インスタンスのIAMロールにxray:PutTraceSegmentsなどの権限が付与されていない",
      "CloudWatchエージェントのログ収集セクションが設定されていない",
      "インスタンスの詳細モニタリングが無効になっている",
      "セグメントデータを中継するX-Rayデーモンがインスタンス上で稼働していない",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。EC2上のアプリケーションでは、SDKが生成したセグメントをX-Rayデーモンがバッファリングし、X-Ray APIへ送信します。デーモンが稼働していない場合や、送信に必要なxray:PutTraceSegmentsなどの権限(AWSXRayDaemonWriteAccessポリシーなど)がIAMロールに無い場合は、トレースが表示されません。Aは逆で、全リクエストが記録対象であればトレースは増えるはずです。Cのログ収集設定はCloudWatch Logsへの送信に関するもので、X-Rayのトレース送信とは別の仕組みです。Dの詳細モニタリングはEC2標準メトリクスの間隔設定であり、トレースとは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon.html",
  },
  {
    id: "qb-d1-028",
    domain: 1,
    topic: "Managed Grafana",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業の運用チームは、CloudWatch、Amazon Managed Service for Prometheus、社内データソースのメトリクスを1つのダッシュボードで横断的に可視化したいと考えています。サーバーを管理せず、IAM Identity Centerによるシングルサインオンにも対応したい場合、最も適切なサービスはどれですか。",
    choices: [
      "Amazon QuickSight",
      "Amazon Managed Grafana",
      "CloudWatchダッシュボード",
      "EC2上にセルフホストしたGrafana",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Amazon Managed GrafanaはフルマネージドのGrafanaサービスで、CloudWatch、Amazon Managed Service for Prometheus、X-Rayなど多様なデータソースを統合して可視化でき、IAM Identity Centerによる認証にも対応します。AのQuickSightはBI(ビジネス分析)向けのダッシュボードサービスで、運用メトリクスの監視やPrometheusとの統合には適しません。CのCloudWatchダッシュボードはCloudWatchのデータが中心で、Prometheusや社内データソースを直接クエリできません。Dはサーバーやソフトウェアの管理が残るため要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html",
  },
  {
    id: "qb-d1-029",
    domain: 1,
    topic: "EBS",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のデータベースサーバーはgp2のEBSボリュームを使用しています。業務ピーク時にディスクI/O性能が著しく低下し、CloudWatchのBurstBalanceメトリクスが0近くまで枯渇していることが分かりました。最もコスト効率よく安定した性能を確保できる対処はどれですか。",
    choices: [
      "gp3ボリュームに変更し、必要なIOPSとスループットをプロビジョニングする",
      "gp2ボリュームのサイズを2倍に拡張してベースラインIOPSを引き上げる",
      "st1(スループット最適化HDD)ボリュームに変更する",
      "同じサイズのgp2ボリュームを追加してRAID 0を構成する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。gp3はボリュームサイズと無関係に3,000IOPSのベースラインを備え、必要に応じてIOPSとスループットを個別にプロビジョニングできます。gp2よりGBあたりの単価も低く、バーストクレジット枯渇の問題を根本的に解消できます。Bはgp2のベースラインがサイズに比例することを利用した対処で機能はしますが、不要な容量への支払いが発生しコスト効率で劣ります。Cのst1はHDDベースであり、ランダムI/O中心のデータベース用途には不向きです。DのRAID 0は管理が複雑になり、1ボリュームの障害が全体に波及するリスクも増えます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/general-purpose.html",
  },
  {
    id: "qb-d1-030",
    domain: 1,
    topic: "EBS",
    type: "multiple",
    difficulty: "easy",
    question:
      "ある企業が、レイテンシーに敏感な小さなランダムI/Oが中心のトランザクションデータベースをEC2で稼働させます。この用途に適したSSDベースのEBSボリュームタイプはどれですか。(2つ選択してください)",
    choices: [
      "gp3(汎用SSD)",
      "st1(スループット最適化HDD)",
      "sc1(Cold HDD)",
      "io2(プロビジョンドIOPS SSD)",
      "標準(マグネティック)ボリューム",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。gp3は汎用SSDでコストと性能のバランスに優れ、多くのデータベース用途に対応します。io2はプロビジョンドIOPS SSDで、高いIOPSと耐久性が求められるミッションクリティカルなデータベースに適しています。Bのst1は大きなシーケンシャルアクセスのスループットに最適化されたHDDで、小さなランダムI/Oには不向きです。Cのsc1はアクセス頻度の低いコールドデータ向けのHDDです。Eの標準(マグネティック)は旧世代のボリュームタイプであり、性能要件のあるワークロードには推奨されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html",
  },
  {
    id: "qb-d1-031",
    domain: 1,
    topic: "EBSメトリクス",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のEC2上のデータベースがピーク時に遅くなります。CloudWatchを確認すると、CPUUtilizationは30%前後で推移し、対象のio1ボリュームではVolumeQueueLengthが継続的に高く、ボリュームの合計IOPS(VolumeReadOps+VolumeWriteOps)はプロビジョニングした値の付近で頭打ちになっていました。最も適切な対処はどれですか。",
    choices: [
      "インスタンスタイプをCPU性能の高いものに変更する",
      "メモリ使用率のカスタムメトリクスを収集してから再評価する",
      "ボリュームをsc1に変更してスループットを確保する",
      "ボリュームのプロビジョンドIOPSを引き上げるなど、ストレージ性能を増強する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。VolumeQueueLengthが恒常的に高く、IOPSがプロビジョニング値で頭打ちになっている状態は、ボリュームのIOPS上限がボトルネックとなりI/O要求が待ち行列に滞留していることを示します。プロビジョンドIOPSの引き上げなどストレージ性能の増強が適切です。AはCPUUtilizationが低いため、CPUはボトルネックではありません。Bのメモリ収集は追加情報にはなりますが、すでにストレージ起因を示す明確な証拠があるため対処として遠回りです。Cのsc1は低性能のコールドHDDであり、性能はむしろ大きく悪化します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/using_cloudwatch_ebs.html",
  },
  {
    id: "qb-d1-032",
    domain: 1,
    topic: "S3パフォーマンス",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業では、世界各地の拠点から数十GBの動画ファイルを東京リージョンの単一のS3バケットへアップロードしていますが、遠隔地からの転送が遅く、途中で失敗すると最初からやり直しになることも課題です。転送のパフォーマンスと信頼性を改善できる方法はどれですか。(2つ選択してください)",
    choices: [
      "S3 Intelligent-Tieringストレージクラスに変更する",
      "マルチパートアップロードを使用してパートを並列転送する",
      "S3 Transfer Accelerationを有効化してエッジロケーション経由でアップロードする",
      "ゲートウェイ型VPCエンドポイントを作成して転送を高速化する",
      "バケットのバージョニングを有効化する",
    ],
    answerIndexes: [1, 2],
    explanation:
      "正解はBとCです。マルチパートアップロードは大きなオブジェクトを分割して並列転送でき、失敗時も該当パートのみ再送すればよいため、速度と信頼性の両方が向上します。Transfer Accelerationは最寄りのエッジロケーションを経由してAWSの最適化されたネットワークで転送するため、遠距離からのアップロードを高速化できます。AのIntelligent-Tieringは保存コストの最適化であり、転送速度には影響しません。Dのゲートウェイ型エンドポイントはVPC内からS3へのプライベート経路であり、各拠点からの転送改善にはなりません。Eのバージョニングは誤削除対策で、転送性能とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/transfer-acceleration.html",
  },
  {
    id: "qb-d1-033",
    domain: 1,
    topic: "DataSync",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、オンプレミスのNFSファイルサーバー上にある数十TBのデータをAmazon S3へ移行し、移行後も毎晩の差分同期を継続する必要があります。帯域制御、スケジュール実行、転送データの検証を追加開発なしで行いたい場合、最も適切なサービスはどれですか。",
    choices: [
      "AWS Snowball Edgeで定期的にデータを配送する",
      "EC2上でrsyncとaws s3 syncを組み合わせたスクリプトをcron実行する",
      "AWS DataSyncエージェントを導入し、スケジュールされたタスクでS3へ転送する",
      "AWS Storage GatewayのボリュームゲートウェイでS3へiSCSI接続する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS DataSyncはNFS/SMBなどのオンプレミスストレージとS3・EFS・FSx間のオンラインデータ転送サービスで、差分検出、スケジュール実行、帯域制限、転送データの整合性検証を標準機能として備え、初回移行と継続的な同期の両方に適しています。AのSnowball Edgeは初回の大量一括移行には有効ですが、毎晩の差分同期のような継続運用には不向きです。Bは自作スクリプトの保守や検証機能の作り込みが必要で、運用負荷が高くなります。Dのボリュームゲートウェイはブロックストレージのハイブリッド利用が目的で、ファイル単位のS3同期という要件に合いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/datasync/latest/userguide/what-is-datasync.html",
  },
  {
    id: "qb-d1-034",
    domain: 1,
    topic: "EFS",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業のEFSファイルシステムはバーストスループットモードで運用されています。保存データ量が小さいためベースラインスループットが低く、バーストクレジットが枯渇して業務時間帯にスループットが大きく低下します。この問題を解消できる変更はどれですか。(2つ選択してください)",
    choices: [
      "スループットモードをエラスティックスループットに変更する",
      "パフォーマンスモードを最大I/O(Max I/O)に変更する",
      "EFSライフサイクル管理で低頻度アクセス(IA)ストレージクラスへ移行する",
      "EFSレプリケーションを有効化して負荷を分散する",
      "プロビジョンドスループットモードに変更し、必要なスループットを指定する",
    ],
    answerIndexes: [0, 4],
    explanation:
      "正解はAとEです。エラスティックスループットはワークロードに応じて性能が自動的に伸縮するモードで、バーストクレジットの概念自体がなくなります。プロビジョンドスループットは保存データ量と無関係に必要なスループットを指定できます。いずれもクレジット枯渇の解消策として有効です。Bのパフォーマンスモードはレイテンシーと並列性に関する特性の設定で、スループットのクレジットとは別の概念であり、作成後に変更もできません。CのIA移行はコスト削減の機能であり、スループット低下の解決にはなりません。Dのレプリケーションは災害対策のための機能で、スループットモードの制約は解消できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/efs/latest/ug/performance.html",
  },
  {
    id: "qb-d1-035",
    domain: 1,
    topic: "FSx",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、Active Directoryと統合したWindowsアプリケーション群のために、SMBプロトコルでアクセスでき、NTFSアクセス制御リスト(ACL)をサポートする共有ファイルストレージをAWS上に構築する必要があります。最も適切なサービスはどれですか。",
    choices: [
      "Amazon EFS",
      "Amazon FSx for Windows File Server",
      "Amazon FSx for Lustre",
      "Amazon S3",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。FSx for Windows File ServerはWindows Serverベースのフルマネージドファイルサーバーで、SMBプロトコル、NTFS ACL、Active Directory統合をネイティブにサポートし、Windowsワークロードの共有ストレージに最適です。AのEFSはNFSプロトコルのファイルシステムで、主にLinux環境向けでありNTFS ACLは利用できません。CのFSx for LustreはHPCや機械学習向けの高性能並列ファイルシステムで、SMBやAD統合の用途ではありません。DのS3はオブジェクトストレージであり、SMBでのファイル共有というプロトコル要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/fsx/latest/WindowsGuide/what-is.html",
  },
  {
    id: "qb-d1-036",
    domain: 1,
    topic: "EFS",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のEFSファイルシステムの保存コストが増え続けています。分析の結果、ファイルの大半は作成から30日を過ぎるとほとんどアクセスされませんが、アプリケーションからは引き続き同じパスで即座に読み取れる必要があります。最もコスト効率の良い対策はどれですか。",
    choices: [
      "30日を過ぎたファイルをS3 Glacier Deep Archiveへ移動するバッチ処理を作成する",
      "ファイルシステムを定期的にバックアップして元データを削除する",
      "スループットモードをプロビジョンドに変更して保存単価を下げる",
      "EFSライフサイクル管理を設定し、30日間アクセスのないファイルを低頻度アクセス(IA)ストレージクラスへ自動移行する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。EFSライフサイクル管理は、指定した期間アクセスされていないファイルを低頻度アクセス(EFS IA)などの低コストなストレージクラスへ自動的に移行します。ファイルは同じファイルシステム上の同じパスから透過的にアクセスでき、アプリケーションの変更も不要です。AはGlacierへ移動するとEFSのパスから即座に読み取れなくなり、取り出しの時間も発生するため要件に反します。Bは元データを削除するため、アクセス継続の要件を満たしません。Cのスループットモードは性能の設定であり、保存単価の削減にはつながりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/efs/latest/ug/lifecycle-management-efs.html",
  },
  {
    id: "qb-d1-037",
    domain: 1,
    topic: "RDS Performance Insights",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のRDS for MySQLインスタンスでデータベース負荷が高くなっています。CloudOpsエンジニアは、どのSQLステートメントとどの待機イベントが負荷の主因かをグラフィカルに特定したいと考えています。最小の設定作業で利用できる機能はどれですか。",
    choices: [
      "RDSのPerformance Insightsを有効化する",
      "CloudWatchの標準メトリクス(CPUUtilization)をダッシュボードに追加する",
      "CloudTrailでデータベースへのAPI呼び出しを分析する",
      "EC2にMySQLクライアントを導入してSHOW PROCESSLISTを定期実行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Performance InsightsはRDSのデータベース負荷(DB Load)を可視化する機能で、負荷の内訳をSQLステートメント別、待機イベント別、ホスト別などに分解して表示でき、ボトルネックとなるSQLの特定に直結します。有効化はインスタンス設定の変更のみで行えます。BのCPUUtilizationはインスタンス全体の使用率だけで、SQL単位の内訳は分かりません。CのCloudTrailはRDSの管理API操作の記録であり、SQLの実行内容は記録されません。Dは自前の仕組みの構築・保守が必要なうえ、実行瞬間のスナップショットしか得られません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PerfInsights.html",
  },
  {
    id: "qb-d1-038",
    domain: 1,
    topic: "RDS Proxy",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のサーバーレスアプリケーションでは、多数のLambda関数が同時実行時にRDS for PostgreSQLへ直接接続するため、接続数が上限に達して接続エラーが頻発しています。アプリケーションコードの変更を最小限に抑えて解決できる方法はどれですか。",
    choices: [
      "DBインスタンスをスケールアップして最大接続数を増やす",
      "リードレプリカを追加して接続を分散する",
      "RDS Proxyを導入し、接続先をプロキシのエンドポイントに変更する",
      "Lambda関数のメモリサイズを増やして実行時間を短縮する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。RDS Proxyはデータベース接続をプールして共有するフルマネージドのプロキシで、Lambdaのような高頻度・短時間の接続を効率的に集約し、接続の枯渇を防ぎます。アプリケーション側は接続先エンドポイントを変更するだけで済みます。Aのスケールアップは接続上限を一時的に引き上げるだけで、同時実行数の増加により再発し、コストも増えます。Bのリードレプリカは読み取りの分散手段であり、書き込みを含む接続数集中の解決にはなりません。DのLambdaのメモリ増強は接続数そのものを減らす保証がなく、根本的な対策になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/rds-proxy.html",
  },
  {
    id: "qb-d1-039",
    domain: 1,
    topic: "RDS拡張モニタリング",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のRDSインスタンスでCPU使用率が高騰しています。CloudOpsエンジニアは、OS上のどのプロセスやスレッドがCPUとメモリを消費しているかを、リアルタイムに近い粒度で確認したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "CloudWatch標準メトリクスのグラフの期間を1分に変更する",
      "RDSの拡張モニタリング(Enhanced Monitoring)を有効化する",
      "DBインスタンスにCloudWatchエージェントをインストールする",
      "自動バックアップを有効化してスナップショットを分析する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。拡張モニタリングを有効化すると、DBホスト上のエージェントがOSレベルのメトリクス(CPU、メモリ、プロセスリストなど)を最短1秒の粒度で収集し、プロセスやスレッド単位の消費状況を確認できます。Aの標準メトリクスはハイパーバイザーレベルの集計値であり、表示期間を変えてもプロセス単位の内訳は得られません。CはRDSがマネージドサービスでありOSにアクセスできないため、エージェントのインストール自体ができません。Dのスナップショットはデータの復元用であり、OSのリソース消費の分析には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html",
  },
  {
    id: "qb-d1-040",
    domain: 1,
    topic: "プレイスメントグループ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、ノード間通信のレイテンシーに極めて敏感な密結合のHPCワークロードをEC2で実行します。インスタンス間のネットワークレイテンシーを最小化し、高いスループットを確保するために最も適切な配置戦略はどれですか。",
    choices: [
      "スプレッドプレイスメントグループに配置して異なるハードウェアに分散する",
      "パーティションプレイスメントグループで複数のパーティションに分割する",
      "複数のアベイラビリティーゾーンへ均等に分散配置する",
      "クラスタープレイスメントグループを使用して単一AZ内で近接配置する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。クラスタープレイスメントグループは、単一アベイラビリティーゾーン内でインスタンスを物理的に近接配置し、インスタンス間で低レイテンシー・高スループットのネットワーク性能を実現します。密結合のHPCワークロードにおける標準的な選択です。Aのスプレッドは少数の重要なインスタンスを別々のハードウェアへ分散して障害の影響を抑える戦略で、レイテンシー最小化とは目的が異なります。Bのパーティションは大規模分散システムのラック障害分離向けです。CのマルチAZ分散は可用性を高めますが、AZ間の通信レイテンシーが加わるため要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/placement-groups.html",
  },
  {
    id: "qb-d1-041",
    domain: 1,
    topic: "Compute Optimizer",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、多数のEC2インスタンスが過剰なサイズでプロビジョニングされている疑いがあります。CloudWatchの利用履歴を機械学習で分析し、EC2、EBS、Lambdaなどに対して具体的な推奨構成(ダウンサイジング候補を含む)を提示するサービスはどれですか。",
    choices: [
      "AWS Compute Optimizer",
      "AWS Budgets",
      "AWS Config",
      "Amazon Inspector",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Compute OptimizerはCloudWatchのメトリクス履歴を機械学習で分析し、EC2インスタンスタイプ、Auto Scalingグループ、EBSボリューム、Lambda関数のメモリサイズなどについて、過剰・過小プロビジョニングの判定と具体的な推奨構成を提示します。BのAWS Budgetsは予算の設定と超過アラートのサービスで、リソースの推奨は行いません。CのAWS Configはリソース構成の記録とルール評価のサービスで、性能面のサイジング推奨は提供しません。DのInspectorは脆弱性管理のサービスであり、サイジングとは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/compute-optimizer/latest/ug/what-is-compute-optimizer.html",
  },
  {
    id: "qb-d1-042",
    domain: 1,
    topic: "高解像度メトリクス",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業の決済アプリケーションでは、処理遅延の急上昇を数十秒以内に検知する必要があります。現在はカスタムメトリクスを60秒間隔で発行し、1分周期のアラームを使用していますが、検知が遅すぎます。最も適切な改善方法はどれですか。",
    choices: [
      "EC2の詳細モニタリングを有効化して標準メトリクスを1分間隔にする",
      "アラームの評価期間(evaluation periods)を1に減らす",
      "カスタムメトリクスを1秒解像度の高解像度メトリクスとして発行し、10秒周期の高解像度アラームを設定する",
      "メトリクスフィルターで遅延ログを集計してアラームを設定する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。カスタムメトリクスは1秒単位の高解像度で発行でき、高解像度アラームでは10秒または30秒の周期で評価できるため、数十秒以内の検知が可能になります。Aの詳細モニタリングはEC2標準メトリクスの間隔を1分にする機能で、カスタムメトリクスの解像度もアラーム周期も改善しません。Bは評価期間を1にしても、メトリクスの発行が60秒間隔である以上、検知の速さは1分単位のままです。Dのメトリクスフィルターで生成される標準解像度のメトリクスでも同様に、1分未満の周期での評価はできず、根本的な解決になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/publishingMetrics.html",
  },
  {
    id: "qb-d1-043",
    domain: 1,
    topic: "CloudWatch Synthetics",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、公開Webサイトの死活とログインフロー(複数ページの遷移)が正常に動作するかを、実際のユーザーがアクセスしない深夜帯も含めて24時間監視し、失敗時にアラームを発報したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "ALBのターゲットヘルスチェックの間隔を短縮する",
      "サーバー側の5xxエラー率にCloudWatchアラームを設定する",
      "Route 53のヘルスチェックでエンドポイントを監視する",
      "CloudWatch Syntheticsのcanaryを作成し、ログインフローをスクリプトで定期実行する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。CloudWatch Syntheticsのcanaryは、スクリプト化したユーザー操作(ページ遷移やログインなど)をスケジュールに従って外形的に実行し、成功率やレイテンシーをメトリクス化してアラームと連携できます。実際のトラフィックがなくても監視できる点が要件に合致します。AのALBヘルスチェックは個々のターゲットの応答確認であり、複数ページにまたがるフローは検証できません。Bのエラー率監視はトラフィックのない時間帯には信号が得られず、深夜帯の障害を見逃します。CのRoute 53ヘルスチェックは単一エンドポイントの死活監視で、多段の操作の検証はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html",
  },
  {
    id: "qb-d1-044",
    domain: 1,
    topic: "メトリクス数式",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のAPIでは、リクエスト総数と5xxエラー数をそれぞれCloudWatchメトリクスとして収集しています。トラフィック量が時間帯で大きく変動するため、エラーの件数ではなく「エラー率が2%を超えたとき」に発報する単一のアラームを、最小の運用負荷で作成したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "メトリクス数式(Metric Math)でエラー率を計算する式を定義し、その式に対してアラームを設定する",
      "エラー数のアラームとリクエスト数のアラームを作成し、複合アラームで組み合わせる",
      "Lambda関数で定期的にエラー率を計算し、カスタムメトリクスとして発行してアラームを設定する",
      "CloudWatch Contributor Insightsのルールを作成して上位のエラー要因を監視する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CloudWatchアラームはメトリクス数式の結果に対して直接設定でき、エラー数をリクエスト数で割って百分率にする式を定義すれば、追加リソースなしでエラー率ベースの単一アラームを実現できます。Bの複合アラームは各アラームの状態を論理演算するだけで、2つのメトリクスから比率を計算することはできません。Cは実現可能ですがLambdaの開発・保守と実行コストが発生し、最小の運用負荷という要件に反します。DのContributor Insightsは上位のアクセス元や要因を分析する機能であり、エラー率の閾値アラームを構成するものではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html",
  },
];
