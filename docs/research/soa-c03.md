# SOA-C03 (CloudOps Engineer – Associate) 試験ガイド調査結果

調査日: 2026年7月11日。AWS公式サイト(aws.amazon.com / docs.aws.amazon.com)の公式試験ガイド最新版を一次情報として確認した結果をまとめます。

## 試験概要(コード・問題数・時間・合格点・受験料)

| 項目 | 内容 |
|---|---|
| 試験名 | AWS Certified CloudOps Engineer - Associate |
| 試験コード | SOA-C03 |
| レベル | アソシエイト |
| 提供開始日 | 2025年9月30日(旧SOA-C02は2025年9月29日で提供終了) |
| 問題数 | 65問(採点対象50問+採点対象外15問。採点対象外の設問は試験中に識別できません) |
| 試験時間 | 130分 |
| 合格スコア | 720点(100〜1,000の換算スコアで報告。合否判定のみで、分野ごとの足切りはない補償型スコアリング) |
| 受験料 | 150 USD |
| 受験方法 | ピアソンVUEテストセンターまたはオンライン監督付き試験 |
| 対応言語 | 英語、日本語、韓国語、中国語(簡体字) |
| 前提経験(推奨) | AWSでのデプロイ・管理・トラブルシューティング・ネットワーク・セキュリティの経験1年、およびシステム管理者等の運用系業務の経験1年以上 |

旧称「AWS Certified SysOps Administrator - Associate」の後継資格です。AWSは「クラウド運用の進化と業界用語の変化を反映して認定資格名を変更した」と説明しており、新名称はSOA-C03の合格者のみに適用されます。

### 出題形式

- **択一選択問題(Multiple choice)**: 正しい選択肢が1つ、誤った選択肢(ディストラクター)が3つ提示されます。
- **複数選択問題(Multiple response)**: 5つ以上の選択肢のうち、正解が2つ以上あります。
- 未回答は不正解として採点されますが、推測による解答へのペナルティはありません。
- **試験ラボ(ハンズオン形式)はありません。** 公式試験ガイドの「出題形式(Response types)」に記載されているのは上記2形式のみです。なお、旧SOA-C02では一時期試験ラボが導入されていましたが、2023年3月に廃止されており、SOA-C03でも復活していません。

## 出題分野と比率

日本語版公式試験ガイドの正式名称による5分野構成です(旧SOA-C02の6分野から再編)。

| コンテンツ分野(公式日本語名称) | 比率 |
|---|---|
| コンテンツ分野 1: モニタリング、ログ記録、分析、修復、パフォーマンスの最適化 | 22% |
| コンテンツ分野 2: 信頼性と事業の継続性 | 22% |
| コンテンツ分野 3: デプロイ、プロビジョニング、オートメーション | 22% |
| コンテンツ分野 4: セキュリティとコンプライアンス | 16% |
| コンテンツ分野 5: ネットワークとコンテンツ配信 | 18% |

分野1〜3だけで66%を占めるため、モニタリング・信頼性・デプロイ自動化が学習の最優先領域になります。

## 分野別の主要トピック・サービス

公式試験ガイドのタスクステートメントとスキル項目に基づく詳細です。

### 分野1: モニタリング、ログ記録、分析、修復、パフォーマンスの最適化(22%)

- **タスク1.1: AWSのモニタリング・ログ記録サービスによるメトリクス、アラーム、フィルターの実装**
  - CloudWatch、CloudTrail、Amazon Managed Service for Prometheus を使ったワークロード(サーバーレス、コンピューティング、**AI**)のモニタリング/ログ設定
  - **CloudWatchエージェントの設定・管理(EC2インスタンス、ECSクラスター、EKSクラスターからのメトリクス/ログ収集)** ← SOA-C03での新規追加項目
  - CloudWatchアラーム(複合アラームを含む)の設定とトラブルシューティング、EventBridge経由でのアクション起動
  - 複数アカウント・複数リージョンにまたがる共有可能なCloudWatchダッシュボード
  - Amazon SNSへの通知連携
- **タスク1.2: モニタリングと可用性メトリクスによる問題の特定と修復**
  - CloudWatch、Lambda、Systems Manager、CloudTrail、**Kiro、AWS DevOps Agent** を使ったパフォーマンス分析と修復の自動化
  - EventBridgeによるイベントのルーティング・エンリッチ・配信、イベントバスルールのトラブルシューティング
  - Systems Manager Automation ランブック(カスタム/事前定義)の作成・実行
- **タスク1.3: コンピューティング、ストレージ、データベースのパフォーマンス最適化**(旧分野6を統合)
  - パフォーマンスメトリクス・リソースタグ・AWSツールによるコンピューティングリソースの最適化
  - Amazon EBSのメトリクス分析、ボリュームタイプ最適化(性能向上とコスト削減)
  - S3パフォーマンス戦略(AWS DataSync、S3 Transfer Acceleration、マルチパートアップロード、S3ライフサイクルポリシー)
  - 共有ストレージ(Amazon EFS、Amazon FSx、Amazon S3 Files)の選定と最適化(EFSライフサイクルポリシーなど)
  - Amazon RDSのモニタリングと設定変更(Performance Insights、RDS Proxy)
  - EC2インスタンスと関連ストレージ/ネットワークの最適化(プレイスメントグループなど)

### 分野2: 信頼性と事業の継続性(22%)

- **タスク2.1: スケーラビリティと伸縮性の実装**
  - コンピューティング環境のスケーリングメカニズム(Auto Scaling)の設定・管理
  - キャッシングによる動的スケーラビリティ向上(Amazon CloudFront、Amazon ElastiCache)
  - マネージドデータベース(Amazon RDS、DynamoDB)のスケーリング
- **タスク2.2: 高可用性と耐障害性を備えた環境の実装**
  - Elastic Load Balancing(ELB)とRoute 53ヘルスチェックの設定・トラブルシューティング
  - フォールトトレラントなシステム(マルチAZ配置など)の構成
- **タスク2.3: バックアップと復元戦略の実装**
  - AWS Backup等によるスナップショット/バックアップの自動化(EC2、RDS、EBS、S3、DynamoDB)
  - RTO/RPO/コスト要件を満たすデータベース復元(ポイントインタイムリカバリなど)
  - ストレージのバージョニング(Amazon S3、Amazon FSx)
  - 災害対策(DR)手法: バックアップ&リストア、パイロットライト、ウォームスタンバイ、アクティブ/アクティブ

### 分野3: デプロイ、プロビジョニング、オートメーション(22%)

- **タスク3.1: クラウドリソースのプロビジョニングと維持**
  - AMIと**コンテナイメージ**の作成・管理(EC2 Image Builder)
  - **CloudFormationとAWS CDKによるリソース(スタック)の作成・管理** ← CDKはSOA-C03での新規追加
  - デプロイ問題の特定と修復(サブネットサイズ、CloudFormationエラー、権限の問題)
  - 複数リージョン・複数アカウントへのリソースのプロビジョニングと共有(AWS RAM、CloudFormation StackSets)
  - デプロイ戦略とサービスの実装
  - サードパーティツールによるデプロイ自動化(**Terraform、Git**)
- **タスク3.2: 既存リソースの管理の自動化**
  - Systems Managerなどによる運用プロセスの自動化
  - イベント駆動型の自動化(Lambda、S3イベント通知、EventBridge、AWS DevOps Agent)

### 分野4: セキュリティとコンプライアンス(16%)

- **タスク4.1: セキュリティ・コンプライアンスのツールとポリシーの実装・管理**
  - IAM機能(パスワードポリシー、MFA、ロール、フェデレーテッドアイデンティティ、リソースポリシー、ポリシー条件)
  - アクセス問題のトラブルシューティングと監査(CloudTrail、IAM Access Analyzer、IAMポリシーシミュレーター)
  - マルチアカウント戦略(AWS Organizations、SCP、IAM Identity Center)
  - AWS Trusted Advisorのセキュリティチェック結果に基づく修復
  - コンプライアンス要件の適用と継続的モニタリング(リージョン/サービスの選択、AWS Configコンフォーマンスパック)
- **タスク4.2: データとインフラストラクチャの保護戦略の実装**
  - データ分類スキームの実装
  - 保管時の暗号化(AWS KMS)の実装・設定・トラブルシューティング
  - 転送時の暗号化(AWS Certificate Manager)の実装・設定・トラブルシューティング
  - シークレットの安全な保管(AWS Secrets Managerなど)
  - セキュリティ検出結果のレポートと修復(AWS Security Hub、Amazon GuardDuty、AWS Config、Amazon Inspector、**AWS Security Agent**)

### 分野5: ネットワークとコンテンツ配信(18%)

- **タスク5.1: ネットワーク機能と接続の実装・最適化**
  - VPCの設定(サブネット、ルートテーブル、ネットワークACL、セキュリティグループ、NATゲートウェイ、インターネットゲートウェイ、Egress-onlyインターネットゲートウェイ)
  - プライベート接続(VPCエンドポイント、AWS PrivateLink、VPCピアリング)
  - 単一アカウントでのネットワーク保護サービスの監査(Route 53 Resolver DNS Firewall、AWS WAF、AWS Shield、AWS Network Firewall)
  - ネットワークアーキテクチャのコスト最適化(VPNはSOA-C02の分野4からここへ移動)
- **タスク5.2: ドメイン、DNSサービス、コンテンツ配信の設定**
  - DNSの設定(Route 53 Resolver)
  - Route 53のルーティングポリシー、設定、クエリログ
  - コンテンツ/サービス配信(CloudFront、AWS Global Accelerator)
- **タスク5.3: ネットワーク接続問題のトラブルシューティング**
  - VPC設定のトラブルシューティング(サブネット、ルートテーブル、NACL、セキュリティグループ、Transit Gateway、NATゲートウェイ)
  - ネットワークログの収集と解釈(VPCフローログ、ELBアクセスログ、AWS WAFウェブACLログ、CloudFrontログ、**コンテナログ**)
  - CloudFrontのキャッシュ問題の特定と修復
  - ハイブリッド接続・プライベート接続の問題のトラブルシューティング
  - **CloudWatchネットワークモニタリングサービスの設定と分析** ← SOA-C03での新規追加項目

### 試験範囲内(In-Scope)の主なサービス一覧

公式ガイド記載のカテゴリ別対象サービス(抜粋を含む全カテゴリ)です。

| カテゴリ | サービス |
|---|---|
| 分析 | Amazon Athena、Amazon Data Firehose |
| アプリケーション統合 | Amazon EventBridge、Amazon SNS、Amazon SQS、AWS Step Functions |
| ビジネスアプリケーション | Amazon SES |
| クラウド財務管理 | AWS Cost and Usage Reports、AWS Cost Explorer、Savings Plans |
| コンピューティング | Amazon EC2、EC2 Image Builder、AWS Lambda |
| コンテナ | Amazon ECR、Amazon ECS、Amazon EKS |
| データベース | Amazon Aurora、Aurora Serverless v2、DynamoDB、DAX、ElastiCache、RDS、RDS Proxy |
| デベロッパーツール | AWS X-Ray、Kiro |
| 機械学習・AI | Amazon Bedrock |
| マネジメントとガバナンス | AWS Auto Scaling、AWS CDK、CloudFormation、CloudTrail、CloudWatch、Compute Optimizer、AWS Config、Control Tower、AWS DevOps Agent、Health Dashboard、Amazon Managed Grafana、AWS Managed Service for Prometheus、Organizations、AWS RAM、Service Catalog、SCP、Systems Manager、Trusted Advisor、VPC IPAM |
| 移行と転送 | AWS DataSync |
| ネットワークとコンテンツ配信 | Amazon Application Recovery Controller、Client VPN、CloudFront、Elastic IP、Global Accelerator、PrivateLink、Route 53、Route 53 Resolver DNS Firewall、Site-to-Site VPN、Transit Gateway、Amazon VPC、VPCエンドポイント、VPCフローログ、VPCピアリング、VPC Reachability Analyzer |
| セキュリティ・アイデンティティ・コンプライアンス | ACM、セキュリティグループ、ELB、GuardDuty、IAM、IAM Access Analyzer、IAM Identity Center、Inspector、KMS、Macie、Network Firewall、NATゲートウェイ、ネットワークACL、Secrets Manager、AWS Security Agent、Security Hub、Shield、WAF ほか |
| ストレージ | AWS Backup、Amazon EBS、Amazon EFS、Amazon FSx、Amazon S3、AWS Storage Gateway |

## SOA-C02 からの主な変更点

### 名称と位置づけ

- 資格名が「AWS Certified SysOps Administrator - Associate」から「**AWS Certified CloudOps Engineer - Associate**」に変更されました。試験の対象者(クラウド運用エンジニア)と検証能力(AWS上のワークロードのデプロイ・管理・運用)の骨格は継承されています。

### 分野構成の再編(6分野 → 5分野)

| SOA-C02(〜2025/9/29) | SOA-C03(2025/9/30〜) |
|---|---|
| 分野1: モニタリング、ロギング、修復(20%) | 分野1: モニタリング、ログ記録、分析、修復、パフォーマンスの最適化(**22%**) |
| 分野2: 信頼性と事業継続性(16%) | 分野2: 信頼性と事業の継続性(**22%**) |
| 分野3: デプロイ、プロビジョニング、オートメーション(18%) | 分野3: デプロイ、プロビジョニング、オートメーション(**22%**) |
| 分野4: セキュリティとコンプライアンス(16%) | 分野4: セキュリティとコンプライアンス(16%) |
| 分野5: ネットワークとコンテンツ配信(18%) | 分野5: ネットワークとコンテンツ配信(18%) |
| 分野6: コストとパフォーマンスの最適化(12%) | (廃止 → 旧タスク6.1/6.2は分野1のタスク1.3に統合) |

### 公式に発表された追加コンテンツ

- タスク1.1: **CloudWatchエージェントによるEC2/ECSクラスター/EKSクラスターからのメトリクス・ログ収集**
- タスク3.1: **CloudFormationおよびAWS CDKによるリソーススタックの作成・管理**(CDKが明示的に試験範囲入り)
- タスク4.1: コンプライアンス要件の適用(リージョン/サービスの選択など)
- タスク5.3: CloudWatchネットワークモニタリングサービスの設定と分析

### 公式に発表された削除コンテンツ

- タスク5.2: **S3静的ウェブサイトホスティングの設定**(削除)

### 再分類

- VPN関連がタスク4.2(セキュリティ)からタスク5.1(ネットワーク)へ移動
- 旧分野6(コストとパフォーマンスの最適化)のタスク6.1/6.2が新タスク1.3へ統合

### コンテナ・サーバーレス・IaC の比重変化

- **コンテナ(ECS/EKS)**: ECS/EKS/ECRが引き続き試験範囲内であることに加え、CloudWatchエージェントによるECS/EKSクラスターの監視がタスクレベルで明記され、トラブルシューティング対象に「コンテナログ」が追加されました。受験者の前提知識にも「コンテナ化とオーケストレーションの基礎」が明記され、比重は実質的に増加しています。
- **サーバーレス**: サーバーレスワークロードのモニタリングがスキル1.1.1に明記され、Aurora Serverless v2が対象サービスに含まれます。Lambda/EventBridge/S3イベント通知によるイベント駆動自動化も引き続き重要です。
- **IaC(CloudFormation/CDK)**: 従来のCloudFormationに加えて**AWS CDKが正式に追加**され、Terraform・Gitなどサードパーティツールによる自動化も対象です。デプロイ・自動化分野自体の比率も18%→22%に上がっています。
- **AI関連の新要素**: 生成AI時代を反映し、**Kiro、AWS DevOps Agent、AWS Security Agent、Amazon Bedrock** が試験範囲内サービスに追加され、AIワークロードのモニタリングもスキルに含まれました(2026年7月11日時点の最新版ガイドによる)。

### 出題形式の変更

- SOA-C02で一時導入されていた試験ラボは2023年3月に廃止済みで、**SOA-C03は択一選択問題と複数選択問題のみ**の構成です(65問・130分)。合格ライン(720点/1,000点)と受験料(150 USD)はSOA-C02から変更ありません。

## 情報ソース(確認したURL一覧と確認日)

いずれも2026年7月11日に確認しました。

- AWS公式認定ページ(日本語): https://aws.amazon.com/jp/certification/certified-cloudops-engineer-associate/
- 公式試験ガイド SOA-C03(英語・HTML版): https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html
- 公式試験ガイド SOA-C03(日本語・HTML版): https://docs.aws.amazon.com/ja_jp/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html
- 公式試験ガイド SOA-C03(PDF版): https://docs.aws.amazon.com/pdfs/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.pdf
- 分野1詳細: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03-domain1.html
- 分野2詳細: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03-domain2.html
- 分野3詳細: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03-domain3.html
- 分野4詳細: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03-domain4.html
- 分野5詳細: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03-domain5.html
- SOA-C02とSOA-C03の公式比較: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03-comparison.html
- 試験範囲内AWSサービス一覧: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/soa-03-in-scope-services.html
