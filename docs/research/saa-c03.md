# SAA-C03 試験ガイド調査結果

調査日: 2026年7月11日
調査方法: AWS公式サイト(aws.amazon.com / docs.aws.amazon.com)の認定ページおよび公式試験ガイド(PDF全文)を一次情報として確認しました。

## 試験概要(コード・問題数・時間・合格点・受験料)

| 項目 | 内容 |
|---|---|
| 試験名 | AWS Certified Solutions Architect – Associate(AWS認定ソリューションアーキテクト – アソシエイト) |
| 試験コード | **SAA-C03**(2026年7月11日時点の現行バージョン) |
| レベル | アソシエイト |
| 問題数 | **65問**(うち採点対象50問、採点対象外15問。採点対象外の設問は受験中に識別できません) |
| 試験時間 | **130分** |
| 合格スコア | **720**(100〜1,000のスケールスコア、合否判定方式) |
| 受験料 | **150 USD**(日本での受験は 20,000円。別途税金がかかる場合があります) |
| 受験方法 | ピアソンVUEテストセンターまたはオンライン監督付き試験 |
| 提供言語 | 英語、日本語、フランス語(フランス)、イタリア語、韓国語、ポルトガル語(ブラジル)、スペイン語(ラテンアメリカ)、スペイン語(スペイン)、中国語(簡体字)、中国語(繁体字) |
| 推奨経験 | AWSのサービスを使用するクラウドソリューション設計の実務経験1年以上 |
| 資格有効期間 | 3年(再認定が必要) |

### 出題形式

公式試験ガイドに記載されている回答タイプは次の2種類です。

- **択一選択問題(Multiple choice)**: 正しい選択肢が1つ、誤った選択肢(不正解)が3つ提示されます(4択)。
- **複数選択問題(Multiple response)**: 5つ以上の選択肢のうち、正解が2つ以上あります。

採点に関する補足(公式試験ガイドより):

- 試験は補償型スコアリングモデルを採用しており、分野ごとの合格基準はありません。試験全体のスコアで合否が判定されます。
- 分野別の出題比率は「採点対象の50問」に対する比率です。
- 試験画面では、よく知られたAWSサービスは公式の短縮名(例: Amazon Simple Notification Service → Amazon SNS)で表記されます(各設問のヘルプ機能で正式名称を確認できます)。

## 出題分野と比率

日本語版公式試験ガイド(docs.aws.amazon.com ja_JP)記載の公式名称と比率です。

| 分野 | 日本語公式名称 | 英語名称 | 比率 |
|---|---|---|---|
| 分野1 | セキュアなアーキテクチャの設計 | Design Secure Architectures | **30%** |
| 分野2 | レジリエントなアーキテクチャの設計 | Design Resilient Architectures | **26%** |
| 分野3 | 高パフォーマンスなアーキテクチャの設計 | Design High-Performing Architectures | **24%** |
| 分野4 | コストを最適化したアーキテクチャの設計 | Design Cost-Optimized Architectures | **20%** |

## 分野別の主要トピック・サービス

以下は公式試験ガイド本文(タスクステートメントの「対象知識」「対象スキル」)から抽出した内容です。

### 分野1: セキュアなアーキテクチャの設計(30%)

- **タスク1.1: AWSリソースへのセキュアなアクセスを設計する**(Design secure access to AWS resources)
  - 対象知識: マルチアカウントのアクセス制御、フェデレーションアクセス、AWSグローバルインフラストラクチャ(リージョン/AZ)、最小権限の原則、AWS責任共有モデル
  - 主要サービス・スキル: IAM(ユーザー/グループ/ロール/ポリシー)、IAM Identity Center、AWS STS(ロールスイッチング、クロスアカウントアクセス)、MFA、AWS Organizations/Control Tower、サービスコントロールポリシー(SCP)、リソースポリシー、AWS Directory Service
- **タスク1.2: セキュアなワークロードとアプリケーションを設計する**(Design secure workloads and applications)
  - 対象知識: アプリケーション設定と認証情報のセキュリティ、サービスエンドポイント、ポート/プロトコル/ネットワークトラフィックの制御、DDoS・SQLインジェクション等の外部脅威
  - 主要サービス・スキル: VPC(セキュリティグループ、ネットワークACL、ルートテーブル、NATゲートウェイ、パブリック/プライベートサブネット)、Amazon Cognito、Amazon GuardDuty、Amazon Macie、AWS Shield、AWS WAF、AWS Secrets Manager、IAM Identity Center、VPN、AWS Direct Connect
- **タスク1.3: 適切なデータセキュリティ管理を判断する**(Determine appropriate data security controls)
  - 対象知識: データのアクセスとガバナンス、データ復旧、データ保持と分類、暗号化と適切なキー管理
  - 主要サービス・スキル: AWS KMS(キーのローテーション)、AWS Certificate Manager(ACM)/TLS、転送中・保管中の暗号化の実装、データバックアップとレプリケーション、ライフサイクル/データ保護ポリシー、コンプライアンス要件に応じた管理

### 分野2: レジリエントなアーキテクチャの設計(26%)

- **タスク2.1: スケーラブルで疎結合なアーキテクチャを設計する**(Design scalable and loosely coupled architectures)
  - 対象知識: API作成と管理(Amazon API Gateway、REST API)、キャッシュ戦略、マイクロサービス設計原則(ステートレス/ステートフル)、イベント駆動型アーキテクチャ、水平/垂直スケーリング、エッジアクセラレーター(CDN)、コンテナ移行、ロードバランシング(ALB)、多層アーキテクチャ、キューイングとメッセージング(パブリッシュ/サブスクライブ)、ストレージタイプ(オブジェクト/ファイル/ブロック)
  - 主要サービス: Amazon SQS、AWS Transfer Family、AWS Secrets Manager、AWS Fargate、AWS Lambda(サーバーレス)、Amazon ECS / Amazon EKS(コンテナオーケストレーション)、AWS Step Functions(ワークフローオーケストレーション)、リードレプリカ
- **タスク2.2: 高可用性および/またはフォールトトレラントなアーキテクチャを設計する**(Design highly available and/or fault-tolerant architectures)
  - 対象知識: グローバルインフラストラクチャ(AZ、リージョン、Amazon Route 53)、ディザスタリカバリ戦略(バックアップと復元、パイロットライト、ウォームスタンバイ、アクティブ/アクティブフェイルオーバー、RPO/RTO)、分散設計パターン、フェイルオーバー戦略、イミュータブルインフラストラクチャ、サービスクォータとスロットリング、ストレージの耐久性とレプリケーション
  - 主要サービス・スキル: ALB等のロードバランシング、Amazon RDS Proxy、AWS X-Ray(ワークロードの可視性)、単一障害点の排除、リージョン/AZをまたぐ高可用性設計、DR戦略の選択、AWS Managed Services(Amazon Comprehend、Amazon Pollyなどの適材適所の利用)

### 分野3: 高パフォーマンスなアーキテクチャの設計(24%)

- **タスク3.1: 高パフォーマンスかつ/またはスケーラブルなストレージソリューションを決定する**
  - Amazon S3、Amazon EFS、Amazon EBS、ハイブリッドストレージ、ストレージタイプ(オブジェクト/ファイル/ブロック)の特性に基づく選定
- **タスク3.2: 高パフォーマンスで伸縮性のあるコンピューティングソリューションを設計する**
  - AWS Batch、Amazon EMR、AWS Fargate、AWS Lambda、Amazon ECS / Amazon EKS、Amazon EC2 Auto Scaling / AWS Auto Scaling、EC2インスタンスタイプの選択、Lambdaメモリサイズ等のリソースサイジング、ワークロードの疎結合化
- **タスク3.3: 高パフォーマンスなデータベースソリューションを決定する**
  - Amazon Aurora、Amazon DynamoDB、Amazon RDS、Amazon ElastiCache(キャッシュ戦略)、リードレプリカ、データベースプロキシ、キャパシティープランニング(キャパシティーユニット、プロビジョンドIOPS)、リレーショナル/非リレーショナル/インメモリ/サーバーレスの使い分け、エンジン選定(MySQLとPostgreSQLの比較など)
- **タスク3.4: 高パフォーマンスかつ/またはスケーラブルなネットワークアーキテクチャを決定する**
  - Amazon CloudFront、AWS Global Accelerator(エッジサービス)、Application Load Balancer、AWS VPN、AWS Direct Connect、AWS PrivateLink、サブネット階層・ルーティング・IPアドレス設計、ネットワークトポロジ(グローバル/ハイブリッド/多層)
- **タスク3.5: 高パフォーマンスなデータ取り込み・変換ソリューションを決定する**
  - Amazon Athena、AWS Lake Formation、Amazon Quick Suite(旧 Amazon QuickSight。日本語版ガイドではQuickSight表記)、AWS DataSync、AWS Storage Gateway、AWS Glue(データ変換)、Amazon Kinesis(ストリーミング)、Amazon EMR(データ処理)、データレイクの構築と保護、フォーマット変換(.csv → .parquet など)

### 分野4: コストを最適化したアーキテクチャの設計(20%)

- **タスク4.1: コストを最適化したストレージソリューションを設計する**
  - Amazon S3 / EBS / EFS / FSx、AWS DataSync、AWS Transfer Family、AWS Storage Gateway、ストレージ階層化(コールドティアリング)とS3ライフサイクル管理、HDD/SSDボリュームタイプ、バックアップ/アーカイブ戦略、リクエスタ支払いバケット、AWS Cost Explorer / AWS Budgets / AWS Cost and Usage Report(コスト管理ツール)
- **タスク4.2: コストを最適化したコンピューティングソリューションを設計する**
  - 購入オプション(スポットインスタンス、リザーブドインスタンス、Savings Plans)、インスタンスタイプ・ファミリー・サイズの選定、自動スケーリングと休止(ハイバネーション)、AWS Outposts(ハイブリッド)、AWS Lambda / Amazon EC2 / AWS Fargateのコスト比較、ALB(レイヤー7)/NLB(レイヤー4)/Gateway Load Balancerの使い分け
- **タスク4.3: コストを最適化したデータベースソリューションを設計する**
  - Amazon RDS、Amazon Aurora、Amazon DynamoDB、バックアップ/保持ポリシー(スナップショット頻度)、エンジン選定、DynamoDBとRDSの比較・サーバーレス選択、時系列・列指向などのデータ形式、リードレプリカ、データベース移行(スキーマ/データ)
- **タスク4.4: コストを最適化したネットワークアーキテクチャを設計する**
  - NATゲートウェイとNATインスタンスのコスト比較、AWS Transit Gateway、VPCピアリング、VPCエンドポイント、AWS Direct Connect / VPNの使い分け、リージョン間・AZ間のデータ転送コスト最小化、CDN(CloudFront)とエッジキャッシュ、帯域幅の割り当て(単一VPNと複数VPN、Direct Connect速度)

### 付録: 試験範囲内のAWSサービス(公式試験ガイド付録より・カテゴリ別抜粋)

- **分析**: Amazon Athena、AWS Data Exchange、Amazon Data Firehose、Amazon EMR、AWS Glue、Amazon Kinesis、AWS Lake Formation、Amazon MSK、Amazon OpenSearch Service、Amazon Quick(旧 QuickSight)、Amazon Redshift
- **アプリケーション統合**: Amazon AppFlow、AWS AppSync、Amazon EventBridge、Amazon MQ、Amazon SNS、Amazon SQS、AWS Step Functions
- **コスト管理**: AWS Budgets、AWS Cost and Usage Report、AWS Cost Explorer、Savings Plans
- **コンピューティング**: AWS Batch、Amazon EC2、Amazon EC2 Auto Scaling、AWS Elastic Beanstalk、AWS Outposts、AWS Serverless Application Repository、VMware Cloud on AWS、AWS Wavelength
- **コンテナ**: Amazon ECR、Amazon ECS、Amazon ECS Anywhere、Amazon EKS、Amazon EKS Anywhere、Amazon EKS Distro
- **データベース**: Amazon Aurora、Amazon Aurora Serverless、Amazon DocumentDB、Amazon DynamoDB、Amazon ElastiCache、Amazon Keyspaces、Amazon Neptune、Amazon RDS、Amazon Redshift
- **開発者ツール**: AWS X-Ray
- **フロントエンドのウェブとモバイル**: AWS Amplify、Amazon API Gateway、AWS Device Farm
- **機械学習**: Amazon Comprehend、Amazon Kendra、Amazon Lex、Amazon Polly、Amazon Rekognition、Amazon SageMaker AI、Amazon Textract、Amazon Transcribe、Amazon Translate
- **マネジメントとガバナンス**: AWS Auto Scaling、AWS CLI、AWS CloudFormation、AWS CloudTrail、Amazon CloudWatch、AWS Compute Optimizer、AWS Config、AWS Control Tower、AWS Health Dashboard、AWS License Manager、Amazon Managed Grafana、Amazon Managed Service for Prometheus、AWS Management Console、AWS Organizations、AWS Service Catalog、AWS Systems Manager、AWS Trusted Advisor、AWS Well-Architected Tool
- **メディアサービス**: Amazon Elastic Transcoder、Amazon Kinesis Video Streams
- **移行と転送**: AWS Application Migration Service、AWS DataSync、AWS DMS、AWS Snowファミリー、AWS Transfer Family
- **ネットワークとコンテンツ配信**: AWS Client VPN、Amazon CloudFront、AWS Direct Connect、Elastic Load Balancing(ELB)、AWS Global Accelerator、AWS PrivateLink、Amazon Route 53、AWS Site-to-Site VPN、AWS Transit Gateway、Amazon VPC
- **セキュリティ・アイデンティティ・コンプライアンス**: AWS Artifact、AWS Audit Manager、AWS Certificate Manager(ACM)、AWS CloudHSM、Amazon Cognito、Amazon Detective、AWS Directory Service、AWS Firewall Manager、Amazon GuardDuty、AWS IAM Identity Center、Amazon Inspector、AWS KMS、Amazon Macie、AWS Network Firewall、AWS Resource Access Manager(AWS RAM)、AWS Secrets Manager、AWS Security Hub、AWS Shield、AWS WAF、IAM
- **サーバーレス**: AWS AppSync、AWS Fargate、AWS Lambda
- **ストレージ**: AWS Backup、Amazon EBS、Amazon EFS、Amazon FSx(全タイプ)、Amazon S3、Amazon S3 Glacier、AWS Storage Gateway

**試験範囲外**とされている主なサービス(付録より抜粋): Amazon Lightsail、Amazon MWAA、Amazon Managed Blockchain、CodeBuild / CodeCommit / CodeDeploy / AWS CDK 等の開発者ツール群、IoT関連の全サービス、Amazon GameLift、Amazon Personalize / SageMaker Canvas 等の一部ML系サービス、AWS Elemental各サービス、Amazon Braket、AWS Ground Station など。

※範囲内・範囲外のリストはいずれも「網羅的ではなく、変更される可能性がある」と公式に明記されています。

## 新バージョン(SAA-C04等)の状況

**2026年7月11日時点で、SAA-C04などの新バージョンはAWS公式から発表されていません。SAA-C03(2022年8月30日開始)が引き続き現行バージョンです。**

- AWS公式の新試験情報ページ「Coming Soon to AWS Certification」を確認しましたが、ソリューションアーキテクト – アソシエイトの更新に関する記載はありません。同ページで告知されている試験更新は「AWS Certified CloudOps Engineer - Associate(SOA-C03)」(旧 SysOps Administrator – Associate の改称・更新、2025年9月30日開始)のみです。
- 公式認定ページ(英語・日本語)および公式試験ガイドのいずれも、試験コードは SAA-C03 のままです。
- なお、一部の対策サイトやブログには「SAA-C04が2024年3月に開始された」といった記述が見られますが、AWS公式サイト・公式ドキュメントでは一切確認できず、誤情報と判断されます。受験準備はSAA-C03の公式試験ガイドに基づいて行ってください。
- 補足: 試験バージョンはSAA-C03のまま、公式試験ガイドの内容(特に付録のサービス名)は随時更新されています。現行ガイドでは Amazon Data Firehose(旧 Kinesis Data Firehose)、Amazon SageMaker AI、Amazon Quick(旧 QuickSight)など、リブランド後のサービス名が反映されています。新バージョンの発表があった場合は上記「Coming Soon」ページに掲載されるため、定期的な確認をおすすめします。

## 情報ソース(確認したURL一覧と確認日)

すべて2026年7月11日に確認しました。

### AWS公式(一次情報)

- 認定ページ(英語): https://aws.amazon.com/certification/certified-solutions-architect-associate/ — 試験時間・問題数・受験料・提供言語を確認
- 認定ページ(日本語): https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/ — 日本語表記の試験概要を確認
- 公式試験ガイド(日本語版・docs): https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html — 出題分野の日本語公式名称・比率・回答タイプ・合格スコアを確認
- 公式試験ガイド 分野1(日本語): https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html
- 公式試験ガイド 分野2(日本語): https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain2.html
- 公式試験ガイド 分野3(日本語): https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html
- 公式試験ガイド 分野4(日本語): https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html
- 公式試験ガイドPDF(英語・全文確認): https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf — タスクステートメント詳細、範囲内/範囲外サービス一覧(付録)を確認
- 新試験・更新情報(Coming Soon): https://aws.amazon.com/certification/coming-soon/ — SAA-C04の告知がないことを確認
- 受験ポリシー・料金(日本語): https://aws.amazon.com/jp/certification/policies/before-testing/ — アソシエイトレベルの受験料(150 USD / 20,000円)を確認

### 補助的に参照(公式以外)

- 対策サイト・ブログ(Citadel Cloud Management等)にSAA-C04開始という記述がありましたが、上記AWS公式ソースと矛盾するため採用していません。
