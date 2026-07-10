# SAA-C03 / SOA-C03 出題傾向調査結果

本ドキュメントは、AWS認定 SAA-C03 (Solutions Architect – Associate) および SOA-C03 (CloudOps Engineer – Associate) の頻出トピック・出題傾向を、公式試験ガイドと国内外の対策サイト・受験記をもとに調査した結果をまとめたものです (調査日: 2026年7月11日)。

まず両試験の基本情報を整理します。

| 項目 | SAA-C03 | SOA-C03 |
|---|---|---|
| 正式名称 | AWS Certified Solutions Architect – Associate | AWS Certified CloudOps Engineer – Associate |
| 開始時期 | 2022年8月 (調査日時点で現行。後継C04の公式発表は確認できませんでした) | 2025年9月30日 (SOA-C02「SysOps Administrator」の後継。C02は2025年9月29日で終了) |
| 問題数・時間 | 65問 (採点対象50問+採点外15問)・130分 | 65問 (採点対象50問+採点外15問)・130分 |
| 合格ライン | 720 / 1000 (セクション別の足切りなし) | 720 / 1000 (セクション別の足切りなし) |
| 出題形式 | 択一選択・複数選択 | 択一選択・複数選択 (公式ガイドv1.1に記載の形式はこの2種のみ。C02にあった試験ラボは廃止済みで、C03にはありません) |
| ドメイン構成 | ①セキュアなアーキテクチャの設計 30% / ②レジリエントなアーキテクチャの設計 26% / ③高パフォーマンスなアーキテクチャの設計 24% / ④コストを最適化したアーキテクチャの設計 20% | ①モニタリング・ロギング・分析・修復・パフォーマンス最適化 22% / ②信頼性と事業継続性 22% / ③デプロイ・プロビジョニング・自動化 22% / ④セキュリティとコンプライアンス 16% / ⑤ネットワークとコンテンツ配信 18% |

SOA-C03では、SOA-C02にあった第6ドメイン「コストとパフォーマンスの最適化 (12%)」が廃止され、その内容がドメイン1に統合されました (公式ガイド Appendix B)。その結果、ドメイン1〜3が各22%と均等に最重要領域になっています。

## SAA-C03 頻出トピック(サービス別・シナリオパターン別)

### 試験全体の傾向

- 受験記 (Qiita・note・マイナビエンジニアブログ等) では、C02からC03への改訂で対象サービスが約63から131へ倍増した一方、「サービス名を答えるだけの問題」が激減し、長文シナリオから最適な構成を選ばせる問題が大多数になったと繰り返し指摘されています。
- オンプレミス連携、VPC間・マルチアカウント連携、グローバル展開、DR戦略 (パイロットライト/ウォームスタンバイ) など、複数サービスを組み合わせる実践的な問題が中心です。
- 「7割は模試と同水準、2割は易しい、1割は知らないサービス」という難易度分布の報告があり、マイナーサービスの名前と一言の用途を知っているだけで拾える問題が一定数あります。

### サービス別の頻出ポイント

| サービス | 試験での問われ方 (頻出パターン) |
|---|---|
| S3 | 試験全体で最頻出の「得点源」。ストレージクラス選定 (Standard / Standard-IA / One Zone-IA / Intelligent-Tiering / Glacier Instant Retrieval / Flexible Retrieval / Deep Archive) とライフサイクルポリシーによる段階的移行。「アクセスパターンが不明・変化する」→ Intelligent-Tiering が定番。暗号化 (SSE-S3 / SSE-KMS)、クロスリージョンレプリケーション、バージョニング、イベント通知 |
| EC2 / Auto Scaling | 購入オプションの選定 (オンデマンド / スポット / リザーブド / Savings Plans)。「中断可能なバッチ」→スポット、「定常稼働」→ Savings Plans。プレイスメントグループ、ターゲット追跡スケーリング、ELBとの組み合わせ |
| RDS / Aurora | 最頻出の対比: Multi-AZ = 高可用性 (フェイルオーバー)、リードレプリカ = 読み取りスケール、という役割の区別。Aurora Global Database (リージョン障害対策)、RDS Proxy (Lambdaからの大量接続)、「暗号化は作成時のみ設定可」というひっかけ |
| DynamoDB | 「ミリ秒レイテンシ」「キーバリュー」がキーワード。DAXによるマイクロ秒キャッシュ、TTL、オンデマンドキャパシティ、グローバルテーブル |
| SQS / SNS / EventBridge | 疎結合化の定番。「処理のスパイクを吸収」「非同期化」→ SQS、「1対多への通知」→ SNS、SNS→複数SQSのファンアウト構成、FIFO vs 標準キュー、DLQ、SaaS/スケジュールイベント→ EventBridge |
| Kinesis | 「リアルタイム」→ Kinesis Data Streams、「ニアリアルタイムでS3/Redshift/OpenSearchへ配信」→ Data Firehose、ストリーム分析→ Managed Service for Apache Flink、という3点セットの使い分け |
| Lambda / API Gateway | サーバーレス定番構成 (API Gateway + Lambda + DynamoDB)。実行ロール不足でコードが動かないシナリオ、同時実行・タイムアウトの制約 |
| VPC / ネットワーク | ゲートウェイエンドポイント (S3/DynamoDB専用・無料) vs インターフェイスエンドポイント (PrivateLink・オンプレからも利用可) の使い分けが頻出。NATゲートウェイ、セキュリティグループ (ステートフル) vs NACL (ステートレス)、多数VPC接続→ Transit Gateway、専用線→ Direct Connect (+VPNバックアップ) |
| ELB / Route 53 | ALB (L7・パスルーティング) vs NLB (L4・固定IP・超低レイテンシ)。Route 53ルーティングポリシー (フェイルオーバー / レイテンシー / 加重 / 位置情報) とヘルスチェック |
| CloudFront / Global Accelerator | 「静的コンテンツ配信・キャッシュ」→ CloudFront (署名付きURL/Cookie、OACによるS3保護、キャッシュ無効化)、「TCP/UDP・キャッシュ不可・固定エニーキャストIP」→ Global Accelerator |
| EBS / EFS / FSx / Storage Gateway | 「複数インスタンスから共有」→ EFS、「Windows・SMB・AD連携」→ FSx for Windows File Server、「HPC・機械学習・S3連携」→ FSx for Lustre、「オンプレとのハイブリッド」→ Storage Gateway。EBSはボリュームタイプ (gp3/io2) と暗号化 |
| IAM / KMS / セキュリティ系 | 最小権限、IAMロールによるクロスアカウントアクセス、KMS (カスタマーマネージドキー・キーポリシー・自動ローテーション)、Secrets Manager (自動ローテーション有) vs Parameter Store、ACM、WAF (SQLi/XSS) / Shield (DDoS)、Macie (S3内の個人情報検出)、GuardDuty (脅威検出) |
| 移行・転送 | DMS (フルロード+CDCでダウンタイム最小化)、Snowballファミリー (大容量・帯域制約)、DataSync (継続的なファイル転送) |
| 分析・ML | Athena (S3をSQLで直接クエリ・サーバーレス)、Glue、QuickSight。ML系 (Rekognition / Textract / Comprehend / Transcribe / Polly など) は「名前と用途の一対一対応」レベルで出題 |

### シナリオパターン別の定番

1. **ストレージコスト最適化**: アクセス頻度・保持期間・取り出し時間の条件からS3クラスとライフサイクルを選ぶ。
2. **疎結合・スパイク耐性**: Web層とバックエンドの間にSQSを挟み、処理を非同期化してオートスケーリングと組み合わせる。
3. **DR戦略選定**: RTO/RPOの数値条件から「バックアップ&リストア < パイロットライト < ウォームスタンバイ < マルチサイトアクティブ/アクティブ」を選ぶ (コストと復旧速度のトレードオフ)。
4. **DB高可用性 vs 読み取り性能**: 「フェイルオーバーしたい」のか「読み取り負荷を下げたい」のかを読み分ける。
5. **暗号化・鍵管理**: 「監査のためキー利用を追跡」「自社でキーをローテーション」→ KMSカスタマーマネージドキー。
6. **プライベート接続**: 「インターネットを経由せずS3へ」→ ゲートウェイエンドポイント、が典型。
7. **グローバル配信・低レイテンシ**: 静的→ CloudFront、動的/非HTTP → Global Accelerator、DBは Aurora Global Database / DynamoDBグローバルテーブル。
8. **コンプライアンス**: 特定リージョンにデータを保持、証跡はCloudTrail、構成監査はAWS Config。

## SOA-C03 頻出トピック(サービス別・シナリオパターン別)

### 試験全体の傾向とC02からの変更点

- 公式ガイド Appendix B によると、C02からタスクの削除はなく、追加と再編のみです。明示的な追加は (1) CloudWatchエージェントによるEC2/ECS/EKSクラスターからのメトリクス・ログ収集、(2) CloudFormationに加えてAWS CDKによるスタック管理、(3) コンプライアンス要件の適用 (リージョン・サービス選択) の3点です。
- 対策サイト・受験記では、コンテナ (ECS / EKS / ECR / Fargate)、CDK、Terraform / Git、Amazon Managed Service for Prometheus / Managed Grafana、X-Rayによるマイクロサービスのトレースが新スコープとして強調されています。逆にEMR、MSK、Transfer Family、Neptune、Timestream、CloudHSM、ML系サービスなどは公式に対象外です。公式の対象サービス一覧にCodeシリーズ (CodePipeline等) は含まれず、自動化はCloudFormation / CDK / Systems Manager中心です。
- 受験者の所感 (note・Qiita) では「問題文が比較的短く、前提が整理されていて、選択肢の差が『意味・思想』で分かれる」「一語だけ違う揚げ足取り型の意地悪な問題が減った」と、旧試験からの出題スタイルの変化が報告されています。難易度は「アソシエイトレベルとして標準的。国内問題集 (CloudTech等) と同等かやや難しい程度」という評価が複数あります。
- SAAと出題範囲の重複が大きく、「SAA = どう設計するか、CloudOps = 構築済み環境をどう運用・監視・自動化・トラブルシュートするか」という視点の違いが最大のポイントです。

### ドメイン別・サービス別の頻出ポイント

| ドメイン (比率) | 頻出サービス | 頻出シナリオパターン |
|---|---|---|
| 1. モニタリング・ロギング・分析・修復・パフォーマンス最適化 (22%) | CloudWatch (メトリクス / アラーム / 複合アラーム / Logs Insights / ダッシュボード / エージェント)、CloudTrail、EventBridge、SSM Automation、X-Ray、Managed Prometheus / Grafana、Compute Optimizer | 「メトリクス収集 → アラーム → 自動修復」の3段構成が最重要。CloudWatchアラーム+EventBridge+SSM Automationランブック / Lambdaによる自動復旧。CloudWatchエージェントでEC2/ECS/EKSからカスタムメトリクス (メモリ等) を収集。クロスアカウント・クロスリージョンのダッシュボード。SNSへの通知連携 |
| 同 (パフォーマンス最適化) | EBS、S3、EFS / FSx、RDS、EC2 | EBSボリュームタイプの見直しによる性能改善とコスト削減。S3の転送最適化 (Transfer Acceleration / マルチパートアップロード / DataSync / ライフサイクル)。RDS Performance Insights・RDS Proxyによるチューニング。EC2プレイスメントグループ |
| 2. 信頼性と事業継続性 (22%) | Auto Scaling、ELB、Route 53、AWS Backup、RDS / Aurora、ElastiCache、CloudFront | ELBとRoute 53ヘルスチェックの設定・トラブルシュート。Multi-AZによる耐障害構成。AWS Backupによるバックアップの一元化・自動化 (保持期間・暗号化・クロスリージョンコピー)。ポイントインタイムリカバリでRTO/RPO要件を満たす復元。S3 / FSxのバージョニング。DR手順の実行 |
| 3. デプロイ・プロビジョニング・自動化 (22%) | CloudFormation、AWS CDK、Terraform / Git、EC2 Image Builder、Systems Manager、AWS RAM、Lambda | CloudFormationのエラー・ロールバック原因の特定 (権限不足・サブネットサイズ等)、ドリフト検出、StackSetsによるマルチアカウント / マルチリージョン展開、変更セット。AMI・コンテナイメージの作成管理 (EC2 Image Builder)。SSM Patch Manager / State Manager / Run Command / Session Managerによる運用自動化。S3イベント通知+Lambdaのイベント駆動自動化 |
| 4. セキュリティとコンプライアンス (16%) | IAM、CloudTrail、IAM Access Analyzer、IAMポリシーシミュレーター、Organizations / SCP / Control Tower、Trusted Advisor、KMS、ACM、Secrets Manager、Security Hub / GuardDuty / Config / Inspector | 「アクセスできない」問題の切り分け (ポリシーシミュレーター・Access Analyzer・CloudTrail)。マルチアカウント戦略とSCPによるガードレール (リージョン・サービス制限)。保存時暗号化 (KMS)・転送時暗号化 (ACM) のトラブルシュート。シークレットの安全な保管。Config Rules / Security Hubの検出結果に基づく自動修復 |
| 5. ネットワークとコンテンツ配信 (18%) | VPC (サブネット / ルートテーブル / NACL / SG / NATゲートウェイ / egress-only IGW)、PrivateLink / VPCエンドポイント、Transit Gateway、Site-to-Site VPN / Client VPN、Route 53 (Resolver / ルーティングポリシー / クエリログ)、CloudFront / Global Accelerator、VPC Flow Logs、Reachability Analyzer、VPC IPAM、Network Firewall / WAF / Shield | 「通信できない」原因の特定が最頻出 (ルートテーブル・NACL・SG・NATの見直し)。VPC Flow Logs / ELBアクセスログ / WAFログ / CloudFrontログの読み解き。Reachability Analyzerによる経路検証。CloudFrontのキャッシュ問題 (ヒット率低下・古いコンテンツ) の修復。Route 53ルーティングポリシーの使い分け。ハイブリッド接続 (VPN / Transit Gateway) のトラブルシュート。ネットワークコストの最適化 (NAT経由をエンドポイントへ等) |

## 定番の出題キーフレーズと解法の考え方

両試験とも「技術的にはどれも実現可能な選択肢」を並べ、問題文末尾の修飾語 (qualifier) で1つに絞らせるスタイルが共通の特徴です。Tutorials Dojoや受験記が共通して挙げるキーフレーズと解法を整理します。

| キーフレーズ (日本語/英語) | 選ぶべき方向性 |
|---|---|
| 最小の運用負荷 / 運用上のオーバーヘッドを最小限に (LEAST operational overhead) | フルマネージド・サーバーレスを優先 (Lambda、Fargate、Aurora Serverless、AWS Backup、マネージドルールなど)。自作スクリプト+cron、EC2上での自前運用は原則誤答 |
| 最もコスト効率が良い (MOST cost-effective) | 要件を満たす最安構成。断続的な利用→サーバーレス (Athena、Lambda)、中断可能→スポット、低頻度アクセス→S3 IA / Glacier。「安いが要件未達」の選択肢が罠として混ざる |
| 最小限のダウンタイム / ダウンタイムなしで | Blue/Greenデプロイ、DMSのフルロード+CDC、Multi-AZフェイルオーバー |
| 最も高いパフォーマンス / 最も低いレイテンシ (BEST performance) | キャッシュ層の追加 (ElastiCache、DAX、CloudFront)、Global Accelerator、プレイスメントグループ |
| リアルタイム (near real-time との区別) | リアルタイム→ Kinesis Data Streams、ニアリアルタイム→ Data Firehose、が典型的な線引き |
| アプリケーションのコードを変更せずに | プロキシ・エージェント・インフラ側の機能で解決 (RDS Proxy、CloudWatchエージェント、ALBリスナールール等) |
| RTO ◯時間 / RPO ◯分以内 | 数値の厳しさに応じてDR戦略 (バックアップ&リストア〜マルチサイト) とバックアップ頻度・レプリケーション方式を選ぶ |
| 規制・コンプライアンス要件 / データを国内に保持 | リージョン固定、SCPによる制限、保存時・転送時の暗号化、証跡 (CloudTrail) と構成監査 (Config) |
| 最小権限の原則 | 広い権限 (`*`) を含む選択肢を排除し、必要最小限のIAMポリシー・ロールを選ぶ |
| 2つ選択 / 3つ選択 (Choose TWO/THREE) | 部分点はないため、組み合わせで1つの解を構成するパターンとして学習が必要 |

解法の定石として、受験記・対策サイトは次の点で一致しています。

1. **観点の特定が先**: 問題文が「コスト」「運用負荷」「可用性」「セキュリティ」「パフォーマンス」のどれを最適化したいのかを最初に特定し、その観点で選択肢を採点します (SAAのドメイン構成そのものが観点の一覧になっています)。
2. **消去法とアンチパターン検出**: 「手作業の運用」「単一AZ」「認証情報のハードコード」「キャッシュなしで物量スケール」などのアンチパターンをまず消します。
3. **2択まで絞って修飾語で決める**: 最後は必ず問題文のqualifierに戻って決定します。「キーワードの見落としが最大の失点原因」という指摘が英語圏の受験記でも共通です。
4. **時間配分**: 65問130分で1問あたり約2分。わかる問題を素早く処理し、迷う問題はフラグを立てて2周目で解く方法が定番です。未回答のペナルティはないため必ず全問回答します。

## 教材・問題作成への示唆

本調査から、SAA-C03 / SOA-C03向けの教材や模擬問題を作成する際は以下が有効と考えられます。

1. **「全選択肢が技術的に成立する」シナリオ問題を基本形にする**: サービス名の一問一答ではなく、業務要件 (コスト・RTO/RPO・運用体制・コンプライアンス) を含む3〜6文のシナリオ+qualifierという本番形式に揃えます。SAAはやや長文、SOA-C03は「短めで前提が整理された文」という違いも再現すると実戦的です。
2. **定番の対比ペアを網羅する**: Multi-AZ vs リードレプリカ、SQS vs SNS vs Kinesis、CloudFront vs Global Accelerator、ゲートウェイ型 vs インターフェイス型エンドポイント、EFS vs FSx各種、Secrets Manager vs Parameter Store、スポット vs Savings Plans、Data Streams vs Firehose など、「似ているが決定的な違いが1つある」ペアが両試験の頻出源です。
3. **ドメイン比率に合わせた出題配分**: SAAはセキュリティ30%・レジリエンス26%を厚めに、SOAはドメイン1〜3 (監視・修復 / 信頼性 / 自動化) で66%を占めるよう配分します。
4. **SOA-C03はトラブルシュート起点の問題を増やす**: 「アラームが発報した」「CloudFormationのデプロイが失敗した」「EC2からS3に接続できない」「CloudFrontのキャッシュヒット率が低い」など障害・事象から入り、原因特定→修復 (できれば自動修復) までを問う形式が試験の思想に合致します。
5. **SOA-C03の新スコープを必ず含める**: ECS/EKSクラスターのCloudWatchエージェント監視、CDKによるプロビジョニング、Prometheus/Grafana、X-Rayトレース、Terraform/Gitへの言及は旧C02向け教材には存在しないため、差別化ポイントになります。逆にEMR・MSK・ML系など公式対象外サービスを正答に使わないよう注意が必要です。
6. **解説は「他の選択肢がなぜ誤りか」を必ず書く**: 受験記で高評価の教材 (Ping-t、CloudTech、Tutorials Dojo) はいずれも不正解選択肢の理由説明が丁寧で、これが学習効果の決め手とされています。あわせてqualifierのどの語が決め手かを明示すると解法訓練になります。
7. **演習設計**: 65問130分の模試形式 (1問2分ペース)、フラグ→2周目の解き直し、正答率85%を合格圏の目安とする周回学習 (3周程度) が、複数の合格体験記で共通する成功パターンです。
8. **キーフレーズ訓練コンテンツ**: 「最小の運用負荷」「最もコスト効率が良い」等のqualifier別に正答の方向性を整理したチートシートや、同一シナリオでqualifierだけを変えて答えが変わる練習問題は、両試験に共通して効果が高いと考えられます。

## 情報ソース(確認したURL一覧と確認日)

すべて2026年7月11日に確認しました。

**公式情報 (AWS)**

- AWS Certified CloudOps Engineer – Associate (SOA-C03) 公式試験ガイド Version 1.1 (PDF): https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-cloudops-associate/AWS-Certified-CloudOps-Engineer-Associate_Exam-Guide.pdf — ドメイン比率・タスクステートメント・対象/対象外サービス・C02とC03の比較表 (Appendix B) を確認
- AWS Certified CloudOps Engineer – Associate 公式ページ: https://aws.amazon.com/certification/certified-cloudops-engineer-associate/
- AWS認定ドキュメント (SOA-C03): https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html
- AWS認定ドキュメント (SAA-C03): https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html
- SAA-C03 公式試験ガイド (PDF): https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf

**日本語の対策サイト・受験記**

- SOA-C03合格記 (2025/10/03投稿・Qiita・handy-dd18氏): https://qiita.com/handy-dd18/items/4a7333a8abae82389791 — 新試験初期の受験所感 (コンテナ・マルチアカウント・IaC強化)
- POSITIVLOG「AWS CloudOps Engineer Associate（SOA-C03）とは？SAAとの違いと勉強法」: https://yasulog-life.com/aws-cloudops-engineer-associatesoa-c03/ — SAAとの視点の違い、運用系サービスの整理
- CloudCamp「【SOA-C03】問題集・模擬試験対策」: https://cloud-camp.net/soa-c03/ — ドメイン別頻出サービス・シナリオ、EventBridge+SSM Automation等の自動修復パターン
- note「【AWS SOA-C03 合格体験記】AWS試験の思想が変わった話」(あだち氏): https://note.com/addache_note/n/n90c7a6fcbc15 — 出題スタイルの変化 (短文化・意味ベース化) に関する考察
- Qiita「【四冠達成】CloudTech＋ChatGPTで SOA-C03に合格」(kanekane氏): https://qiita.com/kanekane/items/af264017b36922bfe528 — 本番難易度の所感と学習法
- サキトの花「【2026年版】AWS SOA-C03 完全学習ロードマップ」: https://sakitoo.com/aws-soa-c03-learning-roadmap/ — 参考として確認 (一部にC02時代のドメイン構成・試験ラボの記述が残る点に注意)
- kotona-school「【AWS-SAA-C03】3週間で一発合格した勉強法＆Web問題集」: https://kotona-school.com/business/certification/aws-saa-c03/ — 問題集の的中感 (複数教材の組み合わせで8割強が既視感) の報告
- Zenn「AWS SAA-C03 合格体験記＋『やっておけばよかった』と後悔したこと」: https://zenn.dev/comf_nakamura/articles/awssaa_experience — 本番の難易度分布 (既知7割/易2割/未知1割) と教材比較
- AQ Tech Blog「AWS SAA-C03受験前に読みたい記事」: https://techblog.asia-quest.jp/202410/to-read-before-taking-the-aws-saa-c03-exam — 4観点 (コスト/運用/セキュリティ/可用性) での解法とひっかけポイント
- Qiita「【AWS】SAA-C03試験対策まとめ（AWS主要サービスの全体像）」(RizumuUEDA氏): https://qiita.com/RizumuUEDA/items/20a2d4af87aa3541f1d3 — サービス別の典型的な問われ方
- マイナビエンジニアブログ「【受験記録】Udemyを活用してAWS SAA-C03を取得しました」: https://engineerblog.mynavi.jp/technology/aws_saa_c03/ — 長文問題への慣れ・サービスの組み合わせ理解の必要性 (検索結果より確認)

**英語の対策サイト・受験記**

- Towards The Cloud「AWS CloudOps Engineer Exam Guide: SOA-C03 Prep & Study Plan [2026]」: https://towardsthecloud.com/blog/aws-cloudops-engineer-associate-exam-guide — ドメイン別重要サービス、C02からの変更点、qualifier対策
- Tutorials Dojo「AWS Certified Solutions Architect Associate Exam – SAA-C03 Study Path」: https://tutorialsdojo.com/aws-certified-solutions-architect-associate-exam-saa-c03-study-path/ — 「MOST cost-effective / LEAST operational overhead」等のキーワード戦略 (検索結果および同サイト模試ページより確認)
- Medium「How to Pass the AWS Solutions Architect Associate (SAA-C03) Exam in 2025」(Malith Ileperuma氏): https://medium.com/@mileperuma/how-to-pass-the-aws-solutions-architect-associate-saa-c03-exam-in-2025-4692a160c5f8 — ドメイン別頻出トピックとキーワード (LEAST / Minimum / NOT 等) の見落とし対策
- DEV Community「AWS Solutions Architect Syllabus (SAA-C03): Exam Domains, Topics & Study Guide (2025 Update)」: https://dev.to/skillboosttrainer/aws-solutions-architect-syllabus-saa-c03-exam-domains-topics-study-guide-2025-update-3ih7 — ドメイン比率と対象サービス範囲 (検索結果より確認)
- Tutorials Dojo「AWS Certified CloudOps Engineer Associate SOA-C03 Practice Exams」: https://portal.tutorialsdojo.com/courses/aws-certified-cloudops-engineer-associate-practice-exams/ — 受験者フィードバックに基づく頻出テーマ (暗号化・IAMポリシーシミュレーター・AWS Backup・Multi-AZ等、検索結果より確認)

**補足 (信頼性に関する注記)**

- SOA-C03の出題形式について、一部サイトは「並べ替え・マッチング・ケーススタディ形式」の追加に言及していますが、公式試験ガイドv1.1に明記されている形式は択一選択と複数選択の2種類のみのため、本ドキュメントは公式ガイドの記載を採用しています。
- 「SAA-C04が2024年にリリースされた」と記載するブログも検索結果に含まれますが、AWS公式サイト・主要対策サイト (Tutorials Dojo等) は2026年時点でもSAA-C03を現行試験としており、当該ブログの記述は誤りと判断しました。
