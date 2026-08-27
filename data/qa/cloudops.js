// CloudOps一問一答(SOA-C03)
// ダッシュボードの「一問一答」セクションで使うデータ。
// 1件は「短い問い」と「短い答え」のみ。判断基準を添えたいときだけ note を足す。
export const qaSet = {
  id: "cloudops",
  title: "CloudOps一問一答",
  exam: "SOA-C03",
  description:
    "本試験で問われる用語と判断基準を、問いと答えだけでテンポよく確認します。",
  groups: [
    {
      title: "S3のデータ保護",
      domain: 4,
      items: [
        {
          id: "qa-cloudops-001",
          q: "S3 Object Lockとは?",
          a: "オブジェクトをWORM(Write Once Read Many)で保護し、指定した保持期間中は削除・上書きを技術的に不可能にする機能です。",
        },
        {
          id: "qa-cloudops-002",
          q: "S3 Object Lockの2つの保護方法は?",
          a: "保持期間(Retain Until Date)とリーガルホールド(Legal Hold)です。リーガルホールドは期限を持たず、解除するまで保護が続きます。",
        },
        {
          id: "qa-cloudops-003",
          q: "S3 Object Lockのコンプライアンスモードとは?",
          a: "保持期間中はrootユーザーを含む誰もオブジェクトを削除・上書きできないモードです。保持期間の短縮もモードの変更もできません。",
          note: "「削除されてはならない」という例外を認めない要件は、このモードが答えになります。",
        },
        {
          id: "qa-cloudops-004",
          q: "S3 Object Lockのガバナンスモードとは?",
          a: "s3:BypassGovernanceRetention 権限を持つユーザーだけが、保持期間中でも削除・変更できるモードです。誤削除の防止が主目的のときに使います。",
        },
        {
          id: "qa-cloudops-005",
          q: "S3 Object Lockを有効にするとバージョニングはどうなる?",
          a: "自動的に有効になり、以後は無効化できなくなります。",
        },
        {
          id: "qa-cloudops-006",
          q: "S3バージョニングは削除を防げる?",
          a: "防げません。バージョンの履歴を残す機能であり、権限があれば削除マーカーの追加も各バージョンの削除もできます。",
        },
        {
          id: "qa-cloudops-007",
          q: "S3ライフサイクルルールの役割は?",
          a: "ストレージクラスの移行と、有効期限による自動削除の設定です。削除の防止には使えません。",
        },
        {
          id: "qa-cloudops-008",
          q: "IAMポリシーで s3:DeleteObject を拒否すれば削除を完全に防げる?",
          a: "防げません。IAM管理者はポリシー自体を変更でき、rootユーザーはIAMポリシーをバイパスできます。",
        },
      ],
    },
    {
      title: "バックアップの自動化",
      domain: 2,
      items: [
        {
          id: "qa-cloudops-009",
          q: "AWS Backupとは?",
          a: "複数のAWSサービスのバックアップを、スケジュールと保持期間を定めたバックアッププランで一元管理するサービスです。",
        },
        {
          id: "qa-cloudops-010",
          q: "AWS Backupが対応する主なサービスは?",
          a: "Amazon EC2、Amazon EBS、Amazon EFS、Amazon RDS、Amazon DynamoDB、Amazon FSx、AWS Storage Gateway などです。",
        },
        {
          id: "qa-cloudops-011",
          q: "Amazon Data Lifecycle Manager(DLM)の対象は?",
          a: "Amazon EBSスナップショットとAMIの作成・保持・削除の自動化です。Amazon EFSには対応していません。",
          note: "対象にEFSやRDSが混ざったらDLMは脱落し、AWS Backupが答えになります。",
        },
        {
          id: "qa-cloudops-012",
          q: "バックアップ対象をタグで割り当てる利点は?",
          a: "指定したタグを持つリソースが自動的に対象になるため、後から作られたリソースも手作業なしでバックアップされます。",
        },
        {
          id: "qa-cloudops-013",
          q: "リソースIDでバックアップ対象を割り当てる弱点は?",
          a: "新しいリソースが自動では含まれず、追加のたびにバックアッププランの編集が必要になります。",
        },
        {
          id: "qa-cloudops-014",
          q: "タグの付け忘れを組織的に防ぐには?",
          a: "AWS Organizationsのサービスコントロールポリシー(SCP)で、必須タグのないリソース作成を拒否します。",
        },
        {
          id: "qa-cloudops-015",
          q: "サービスコントロールポリシー(SCP)とは?",
          a: "AWS Organizationsの組織単位(OU)やアカウントに対して、許可されるアクションの上限を定めるポリシーです。配下のアカウントに継承されます。",
        },
        {
          id: "qa-cloudops-016",
          q: "バックアップの保持期間はどこで設定する?",
          a: "バックアッププランのライフサイクル設定です。「30日後に期限切れ」のように指定します。",
        },
      ],
    },
    {
      title: "VPCからAWSサービスへの経路",
      domain: 5,
      topicId: "vpc-endpoint-types",
      items: [
        {
          id: "qa-cloudops-017",
          q: "VPCエンドポイントとは?",
          a: "VPC内のリソースから、インターネットを経由せずにAWSサービスへプライベート接続する仕組みです。",
        },
        {
          id: "qa-cloudops-018",
          q: "ゲートウェイエンドポイントの対応サービスは?",
          a: "Amazon S3 と Amazon DynamoDB の2つだけです。",
        },
        {
          id: "qa-cloudops-019",
          q: "ゲートウェイエンドポイントの料金は?",
          a: "追加料金はかかりません(時間料金・データ処理料金ともに無料)。",
          note: "「S3宛て」+「コスト最小」ならゲートウェイエンドポイントが決め手です。",
        },
        {
          id: "qa-cloudops-020",
          q: "ゲートウェイエンドポイントの設定手順は?",
          a: "VPCにエンドポイントを作成し、対象のルートテーブルにサービスのプレフィックスリスト宛のルートを追加します。",
        },
        {
          id: "qa-cloudops-021",
          q: "インターフェイスエンドポイント(AWS PrivateLink)との違いは?",
          a: "サブネット内にENIを作る方式で、ほぼ全サービスに対応しオンプレミスからも使えますが、時間料金とデータ処理料金がかかります。",
        },
        {
          id: "qa-cloudops-022",
          q: "NATゲートウェイはどのサブネットに置く?",
          a: "パブリックサブネットです。プライベートサブネットには作成できません。",
        },
        {
          id: "qa-cloudops-023",
          q: "プライベートサブネットにインターネットゲートウェイへのルートを足すとどうなる?",
          a: "そのサブネットはパブリックサブネットになります。プライベートサブネットの目的そのものが失われます。",
        },
        {
          id: "qa-cloudops-024",
          q: "IAMロールは設定済みなのにEC2からS3へ通信できない。何を疑う?",
          a: "ネットワーク経路です。認証・認可が済んでいるなら、VPCエンドポイントやNATゲートウェイの有無を確認します。",
        },
      ],
    },
    {
      title: "ハイブリッドストレージ",
      domain: 2,
      items: [
        {
          id: "qa-cloudops-025",
          q: "AWS Storage Gatewayとは?",
          a: "オンプレミスに置いた仮想アプライアンス経由で、既存アプリケーションからAWSのストレージを透過的に利用できるようにするサービスです。",
        },
        {
          id: "qa-cloudops-026",
          q: "保管型ボリューム(Stored Volumes)とは?",
          a: "全データの実体をオンプレミスに置いたまま、Amazon S3へ非同期にスナップショットをバックアップする構成です。",
          note: "「全データをローカルで即座に使いたい」ならこちらです。",
        },
        {
          id: "qa-cloudops-027",
          q: "キャッシュ型ボリューム(Cached Volumes)とは?",
          a: "データの実体をAmazon S3に置き、頻繁にアクセスされるデータだけをローカルにキャッシュする構成です。",
        },
        {
          id: "qa-cloudops-028",
          q: "ボリュームゲートウェイが使うプロトコルは?",
          a: "iSCSIです。OSからはブロックデバイスとして見えるため、既存アプリケーションをそのまま使えます。",
        },
        {
          id: "qa-cloudops-029",
          q: "ブロックストレージとオブジェクトストレージの違いは?",
          a: "ブロックはファイルシステム経由で固定サイズのブロックを読み書きし(iSCSIなど)、オブジェクトはREST APIでオブジェクト単位に読み書きします。",
        },
        {
          id: "qa-cloudops-030",
          q: "POSIXとは?",
          a: "UNIX系OSのインターフェイスを定めたIEEE規格です。POSIX互換のアプリケーションは、ファイルシステム経由でブロックデバイスに読み書きします。",
        },
        {
          id: "qa-cloudops-031",
          q: "AWS DataSyncの役割は?",
          a: "オンプレミスとAWS間、またはAWSサービス間で、ファイルやオブジェクトを高速に転送・同期するサービスです。ブロックストレージのインターフェイスは提供しません。",
        },
        {
          id: "qa-cloudops-032",
          q: "S3 Glacier系ストレージクラスの用途は?",
          a: "低コストな長期アーカイブです。取り出しに時間がかかるクラスもあり、ローカルでの即時利用には向きません。",
        },
      ],
    },
    {
      title: "VPC間の接続",
      domain: 5,
      topicId: "transit-gateway-routing",
      items: [
        {
          id: "qa-cloudops-033",
          q: "別々のVPCにあるリソースは既定で通信できる?",
          a: "できません。VPCは論理的に分離されており、同一アカウント・同一リージョンでも明示的な接続が必要です。",
        },
        {
          id: "qa-cloudops-034",
          q: "VPCピアリングとは?",
          a: "2つのVPCをプライベートIPアドレスで直接通信させる接続です。別リージョン間・別アカウント間でも作成できます。",
        },
        {
          id: "qa-cloudops-035",
          q: "VPCピアリングの前提条件は?",
          a: "2つのVPCのCIDRブロックが重複していないことです。",
        },
        {
          id: "qa-cloudops-036",
          q: "ピアリング接続を作成した後に必要な設定は?",
          a: "両方のVPCのルートテーブルに相手のCIDR宛のルートを追加し、セキュリティグループで通信を許可します。",
        },
        {
          id: "qa-cloudops-037",
          q: "VPCピアリングは推移的?",
          a: "推移的ではありません。VPC1-VPC2、VPC2-VPC3をつないでも、VPC1からVPC3へは通信できません。",
          note: "VPCが増えて総当たりの接続が必要になったら、AWS Transit Gatewayに切り替えます。",
        },
        {
          id: "qa-cloudops-038",
          q: "AWS Transit Gatewayとは?",
          a: "多数のVPCやオンプレミス接続をハブ&スポーク型に集約するルーターです。ピアリングと違い推移的なルーティングができます。",
        },
        {
          id: "qa-cloudops-039",
          q: "プライベートサブネットのRDSインスタンスにパブリックIPは付く?",
          a: "付きません。インターネットからの直接アクセスはできず、アプリケーション層からのみ接続します。",
        },
        {
          id: "qa-cloudops-040",
          q: "ルートテーブルに設定できるものは?",
          a: "宛先CIDRとターゲット(ゲートウェイ、ENI、ピアリング接続など)の組み合わせだけです。接続文字列などアプリケーション層の情報は持てません。",
        },
      ],
    },
  ],
  references: [
    {
      label: "S3 Object Lock を使用したオブジェクトのロック",
      url: "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lock.html",
    },
    {
      label: "AWS Backup とは",
      url: "https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/whatisbackup.html",
    },
    {
      label: "ゲートウェイ VPC エンドポイント",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
    },
    {
      label: "ボリュームゲートウェイの仕組み",
      url: "https://docs.aws.amazon.com/ja_jp/storagegateway/latest/vgw/StorageGatewayConcepts.html",
    },
    {
      label: "VPC ピア接続とは",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/peering/what-is-vpc-peering.html",
    },
  ],
};
