// CloudOps教材 分野5(ネットワークとコンテンツ配信)の確認問題
export const questions = [
  // ---- 第1章: VPC運用と接続トラブルシューティング ----
  {
    id: "cloudops-d5-ch01-q01",
    domain: 5,
    topic: "VPCエンドポイント",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のCloudOpsエンジニアが、プライベートサブネットのAmazon EC2インスタンスからAmazon S3バケットへデータをアップロードするために、S3用のゲートウェイVPCエンドポイントを作成しました。しかし、インスタンスからのaws s3 cpコマンドはタイムアウトします。インスタンスのセキュリティグループはすべてのアウトバウンド通信を許可しており、ネットワークACLはデフォルト設定です。最初に確認すべき項目はどれですか。",
    choices: [
      "S3バケットポリシーでインスタンスのプライベートIPアドレスからのアクセスが許可されているか",
      "インスタンスにパブリックIPアドレスが割り当てられているか",
      "サブネットに関連付けられたルートテーブルに、S3のプレフィックスリスト宛てのルート(エンドポイント向け)が追加されているか",
      "S3バケットでTransfer Accelerationが有効になっているか",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ゲートウェイエンドポイントは、エンドポイントに関連付けたルートテーブルへS3のプレフィックスリスト宛てのルートが自動追加されることで機能します。対象サブネットのルートテーブルを関連付け忘れるとS3への経路が存在せず、タイムアウトになります。Aのバケットポリシーで拒否された場合は403エラーが返るため、タイムアウトの原因ではありません。Bのパブリック IPはゲートウェイエンドポイント経由の通信には不要です。DのTransfer Accelerationは転送を高速化する機能であり、接続の可否には関係しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
  },
  {
    id: "cloudops-d5-ch01-q02",
    domain: 5,
    topic: "ネットワークACL",
    type: "single",
    difficulty: "medium",
    question:
      "パブリックサブネットのEC2インスタンスで公開しているWebサーバーに、インターネットからHTTPS(ポート443)で接続するとタイムアウトします。セキュリティグループはポート443のインバウンドを許可しています。サブネットにはカスタムネットワークACLが関連付けられており、インバウンドはポート443を許可、アウトバウンドはポート443宛てのみ許可しています。ルートテーブルとインターネットゲートウェイは正しく構成されています。原因として最も可能性が高いものはどれですか。",
    choices: [
      "ネットワークACLのアウトバウンドルールで、エフェメラルポート(1024〜65535)宛ての戻りの通信が許可されていない",
      "セキュリティグループのアウトバウンドルールで、戻りのトラフィックが明示的に許可されていない",
      "インターネットゲートウェイ宛てのルートがルートテーブルに存在しない",
      "ネットワークACLのインバウンドルールで、エフェメラルポート宛ての通信が許可されていない",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ネットワークACLはステートレスなので、クライアントのエフェメラルポート宛てに返る応答パケットもアウトバウンドルールで明示的に許可する必要があります。アウトバウンドが443宛てのみでは戻りの通信が拒否され、タイムアウトします。Bのセキュリティグループはステートフルであり、許可済みのインバウンド接続の戻りは自動的に許可されるため原因になりません。Cはルートテーブルが正しく構成されているという前提に反します。Dのクライアント発の接続はサーバーのポート443宛てに届くため、インバウンドは443の許可で足りています。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-network-acls.html",
  },
  {
    id: "cloudops-d5-ch01-q03",
    domain: 5,
    topic: "セキュリティグループ",
    type: "single",
    difficulty: "easy",
    question:
      "Amazon VPCにおけるセキュリティグループとネットワークACLの違いに関する説明として、正しいものはどれですか。",
    choices: [
      "セキュリティグループはステートレスであり、戻りの通信も明示的に許可する必要がある",
      "ネットワークACLはルール番号の小さい順に評価され、最初に一致したルールが適用される",
      "セキュリティグループでは許可ルールと拒否ルールの両方を設定できる",
      "ネットワークACLはENI(インスタンス)単位で関連付けて適用される",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ネットワークACLはルール番号の昇順に評価され、最初に一致した許可または拒否のルールで判定が確定します。Aが誤りである理由は、セキュリティグループはステートフルで、許可した通信の戻りは自動的に許可されるためです(ステートレスなのはネットワークACL)。Cのセキュリティグループに設定できるのは許可ルールのみで、拒否ルールを設定できるのはネットワークACLです。Dのネットワーク ACLはサブネット単位で関連付けるものであり、ENI単位で適用されるのはセキュリティグループです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-security-groups.html",
  },
  {
    id: "cloudops-d5-ch01-q04",
    domain: 5,
    topic: "NATゲートウェイ",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、プライベートサブネットのEC2インスタンスからインターネット上のリポジトリへOSアップデートを取得できるようにするため、新しいサブネットにNATゲートウェイを作成し、プライベートサブネットのルートテーブルに0.0.0.0/0宛てのルートとしてNATゲートウェイを設定しました。しかし、インスタンスからインターネットへの接続は依然としてタイムアウトします。セキュリティグループとネットワークACLはすべての必要な通信を許可しています。原因として最も可能性が高いものはどれですか。",
    choices: [
      "インスタンスのセキュリティグループでアウトバウンドのHTTPS通信が拒否されている",
      "NATゲートウェイのセキュリティグループでインバウンド通信が許可されていない",
      "プライベートサブネットのルートテーブルにインターネットゲートウェイ宛てのルートが必要である",
      "NATゲートウェイを配置したサブネットのルートテーブルに、インターネットゲートウェイ宛てのルートがない",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。NATゲートウェイ自体は、0.0.0.0/0宛てのルートがインターネットゲートウェイへ向いているパブリックサブネットに配置する必要があります。IGWへの経路を持たないサブネットに配置すると、変換後のトラフィックがインターネットへ出られずタイムアウトします。Aは問題文の前提(必要な通信は許可済み)に反します。BのNATゲートウェイにはセキュリティグループを関連付けることができないため、この選択肢は成立しません。Cのプライベートサブネットに必要なのはNATゲートウェイ宛てのルートであり、IGW宛てのルートを追加するとパブリックサブネットになってしまい設計に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html",
  },
  {
    id: "cloudops-d5-ch01-q05",
    domain: 5,
    topic: "VPCピアリング",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が2つのVPC(10.0.0.0/16と172.16.0.0/16)の間にVPCピアリング接続を作成し、ステータスは「アクティブ」になっています。しかし、一方のVPCのEC2インスタンスから他方のVPCのインスタンスへ接続できません。通信を成立させるために必要な作業はどれですか。(2つ選択してください)",
    choices: [
      "両方のVPCにインターネットゲートウェイをアタッチする",
      "双方のVPCのルートテーブルに、相手VPCのCIDR宛てのルートとしてピアリング接続を追加する",
      "双方のVPCをAWS Transit Gatewayにアタッチして経路を集約する",
      "接続先インスタンスのセキュリティグループで、接続元のCIDRまたはセキュリティグループからのインバウンド通信を許可する",
      "ピアリング接続にElastic IPアドレスを関連付けて固定IPで通信する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。ピアリング接続がアクティブになっただけでは通信できず、双方のルートテーブルに相手CIDR宛てのルートを追加し、さらにセキュリティグループ(必要に応じてネットワークACL)で通信を許可する必要があります。Aのピアリング通信はAWSのネットワーク内を流れるため、インターネットゲートウェイは不要です。CのTransit Gatewayはピアリングの代替手段であり、ピアリングを機能させるために併用する必要はありません。Eのピアリング接続にElastic IPを関連付ける機能は存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/peering/what-is-vpc-peering.html",
  },
  {
    id: "cloudops-d5-ch01-q06",
    domain: 5,
    topic: "Transit Gateway",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は1つのリージョンで約40のVPCを運用しており、今後も増える予定です。すべてのVPC間の相互通信と、Site-to-Site VPN経由のオンプレミスネットワークとの接続を、最小の運用負荷で実現する必要があります。最も適切な構成はどれですか。",
    choices: [
      "すべてのVPCのペア間にVPCピアリング接続を作成し、各ルートテーブルを個別管理する",
      "AWS Transit Gatewayを作成し、各VPCとVPN接続をアタッチしてハブ&スポーク構成にする",
      "各VPCにインターフェイスVPCエンドポイントを作成してVPC同士を相互接続する",
      "VPCごとに個別のSite-to-Site VPN接続を作成してオンプレミス経由で相互通信させる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Transit Gatewayはハブ&スポーク型で多数のVPCとVPN・Direct Connect接続を集約でき、推移的ルーティングにより相互通信を一元管理できます。40VPCの増加にも追従しやすく、運用負荷が最小です。Aのフルメッシュのピアリングは約780本の接続とルート管理が必要になるうえ、ピアリングは推移的ルーティングに対応していないため運用負荷が過大です。Cのインターフェイスエンドポイントは特定サービスへのPrivateLink接続のための機能で、VPC全体の相互通信には使えません。DはVPN接続と管理がVPCの数だけ必要になり、帯域・コスト・運用のすべてで不利です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/what-is-transit-gateway.html",
  },
  {
    id: "cloudops-d5-ch01-q07",
    domain: 5,
    topic: "PrivateLink",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Direct Connectでオンプレミスのデータセンターと VPCを接続しています。コンプライアンス要件により、オンプレミスのアプリケーションからインターネットを経由せずにAmazon S3へアクセスする必要があります。最も適切な方法はどれですか。",
    choices: [
      "S3用のインターフェイスVPCエンドポイントを作成し、オンプレミスからエンドポイントのプライベートIPアドレス経由でアクセスする",
      "S3用のゲートウェイVPCエンドポイントを作成し、オンプレミスのルーターに同じルートを追加する",
      "VPCにNATゲートウェイを作成し、オンプレミスからのS3宛て通信をアドレス変換して転送する",
      "S3のTransfer Accelerationを有効化し、最寄りのエッジロケーション経由でアクセスする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。インターフェイスエンドポイント(AWS PrivateLink)はVPCのサブネット内にENIとプライベートIPアドレスを作成するため、Direct ConnectやVPNを経由してオンプレミスからもS3へプライベートにアクセスできます。Bのゲートウェイエンドポイントは、VPCのルートテーブルを介してVPC内のリソースから利用する仕組みであり、オンプレミスからのアクセスには使用できません。CのNATゲートウェイはVPC内からのアウトバウンド通信のための機能で、オンプレミス発の通信の入口にはなりません。DのTransfer Accelerationはインターネット(エッジロケーション)経由の転送高速化機能であり、インターネット非経由の要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/what-is-privatelink.html",
  },
  {
    id: "cloudops-d5-ch01-q08",
    domain: 5,
    topic: "VPCフローログ",
    type: "single",
    difficulty: "hard",
    question:
      "EC2インスタンス(10.0.1.15)への接続障害が報告されています。CloudOpsエンジニアがVPCフローログを確認すると、次の2つのレコードが記録されていました。\n2 123456789010 eni-0a1b2c3d 203.0.113.12 10.0.1.15 54321 443 6 12 3480 1689000000 1689000060 ACCEPT OK\n2 123456789010 eni-0a1b2c3d 10.0.1.15 203.0.113.12 443 54321 6 4 240 1689000000 1689000060 REJECT OK\nこの記録から推測できる原因として最も適切なものはどれですか。",
    choices: [
      "セキュリティグループのインバウンドルールでポート443宛ての通信が拒否されている",
      "セキュリティグループのアウトバウンドルールで戻りの通信が拒否されている",
      "ネットワークACLのアウトバウンドルールで、エフェメラルポート宛ての戻りの通信が拒否されている",
      "ルートテーブルに宛先203.0.113.12へ到達するためのルートが存在しない",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。1行目でインバウンド(203.0.113.12からポート443宛て)はACCEPTされているのに、2行目でその応答(ポート443からエフェメラルポート54321宛て)がREJECTされています。セキュリティグループはステートフルで、許可済み接続の戻りを拒否することはないため、戻りをREJECTできるのはステートレスなネットワークACLのアウトバウンドルールです。Aはインバウンドが ACCEPTされている事実と矛盾します。Bはセキュリティグループのステートフル特性から、応答トラフィックの拒否は発生しません。Dのフローログの ACCEPT/REJECTはセキュリティグループとネットワークACLの判定結果を示すものであり、ルートの欠如を示すものではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html",
  },
  {
    id: "cloudops-d5-ch01-q09",
    domain: 5,
    topic: "VPC Reachability Analyzer",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業で、EC2インスタンスAからインスタンスBへのSSH接続ができないという問い合わせがありました。CloudOpsエンジニアは、実際にトラフィックを送信することなく2つのインスタンス間のネットワーク構成を分析し、通信をブロックしているコンポーネント(セキュリティグループやルートテーブルなど)を特定したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS CloudTrailで2つのインスタンス間のAPI呼び出し履歴を分析する",
      "Amazon CloudWatch Logsでインスタンスのシステムログを検索する",
      "AWS Configで2つのインスタンスの構成変更履歴を比較する",
      "VPC Reachability Analyzerで送信元と送信先を指定して経路を分析する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。VPC Reachability Analyzerは、送信元と送信先(ENI、インスタンスなど)とポートを指定すると、実際にパケットを送信せずネットワーク構成を静的に分析し、到達可能性と、到達不能な場合にブロックしているコンポーネントを特定します。AのCloudTrailはAWS APIの呼び出し履歴を記録するサービスであり、ネットワーク経路は分析できません。BのCloudWatch Logsはログの収集・検索の基盤であり、経路上のブロック箇所を特定する機能はありません。CのAWS Configはリソース構成の変更記録と評価のためのサービスで、2点間の到達可能性は判定できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/reachability/what-is-reachability-analyzer.html",
  },
  {
    id: "cloudops-d5-ch01-q10",
    domain: 5,
    topic: "Site-to-Site VPN",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業がAWS Site-to-Site VPNでオンプレミスネットワークとVPCを接続しました。マネジメントコンソールでは両方のVPNトンネルのステータスが「UP」と表示されていますが、VPC内のEC2インスタンスからオンプレミスのサーバーへ接続できません。セキュリティグループとネットワークACLは適切に設定されています。原因として最も可能性が高いものはどれですか。",
    choices: [
      "カスタマーゲートウェイデバイスに設定した事前共有キーがAWS側と一致していない",
      "サブネットのルートテーブルにオンプレミスCIDR宛てのルートがなく、仮想プライベートゲートウェイからのルート伝播も無効になっている",
      "VPNトンネルがBGPによる動的ルーティングではなく静的ルーティングで構成されている",
      "2本のVPNトンネルのうち1本しかトラフィックの転送に使用されていない",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。トンネルがUPでも、VPC側のルートテーブルにオンプレミスCIDR宛てのルート(仮想プライベートゲートウェイ向け)がなければ、パケットはVPNへ転送されません。ルート伝播を有効化するか、静的ルートを追加する必要があります。Aの事前共有キーが不一致の場合はIKEネゴシエーションが失敗し、トンネル自体がUPになりません。Cの静的ルーティング構成自体は正しく設定すれば問題なく動作するため、原因ではありません。Dのトンネルは1本がアクティブであれば通信は成立し、2本目は冗長化のためのものなので、疎通不能の直接原因にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpn/latest/s2svpn/VPC_VPN.html",
  },
  {
    id: "cloudops-d5-ch01-q11",
    domain: 5,
    topic: "ネットワークコスト最適化",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のAWS利用料を分析したところ、NATゲートウェイのデータ処理料金が大きな割合を占めていました。調査の結果、プライベートサブネットのEC2インスタンスからAmazon S3への大量のデータ転送と、別のアベイラビリティーゾーン(AZ)にあるNATゲートウェイ経由の通信が主な原因と判明しました。コストを削減する方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "S3宛てのトラフィックをゲートウェイVPCエンドポイント経由に変更する",
      "インターネットゲートウェイを各アベイラビリティーゾーンに追加してNATを迂回させる",
      "各AZにNATゲートウェイを配置し、各サブネットから同一AZのNATゲートウェイへルーティングする",
      "S3バケットのデータを同一リージョン内の別バケットへレプリケーションする",
      "NATゲートウェイをAWS Transit Gatewayに置き換えてデータ処理を集約する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。S3・DynamoDB用のゲートウェイエンドポイントは追加料金なしで利用でき、S3宛てトラフィックをNATゲートウェイから逃がすことでデータ処理料金を大幅に削減できます。また、別AZのNATゲートウェイを経由するとAZ間データ転送料金が加算されるため、AZごとにNATゲートウェイを配置して同一AZ内で完結させれば、コスト削減とAZ障害耐性の向上を両立できます。Bのインターネットゲートウェイは VPCに1つアタッチする水平スケーリングされたコンポーネントで、AZごとに追加するものではありません。Dのレプリケーションは転送経路を変えず、ストレージコストが増えるだけです。EのTransit Gatewayにも独自のデータ処理料金があり、NAT機能の代替にもなりません。",
    reference:
      "https://aws.amazon.com/jp/vpc/pricing/",
  },

  // ---- 第2章: DNS・コンテンツ配信の運用 ----
  {
    id: "cloudops-d5-ch02-q01",
    domain: 5,
    topic: "Route 53ルーティングポリシー",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は東京リージョンでプライマリのWebアプリケーションを運用し、大阪リージョンにAmazon S3とCloudFrontによる静的なメンテナンスページを用意しています。プライマリサイトが停止した場合のみ、自動的にメンテナンスページへトラフィックを切り替える必要があります。最も適切なAmazon Route 53の構成はどれですか。",
    choices: [
      "フェイルオーバールーティングポリシーを使用し、プライマリレコードにヘルスチェックを関連付ける",
      "加重ルーティングポリシーを使用し、プライマリに重み100、セカンダリに重み0を設定する",
      "レイテンシーベースルーティングポリシーを使用し、2つのリージョンにレコードを作成する",
      "位置情報ルーティングポリシーを使用し、デフォルトレコードをメンテナンスページに向ける",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。フェイルオーバールーティングは、ヘルスチェックでプライマリの異常を検知したときのみセカンダリレコードを返す、アクティブ/パッシブ構成の標準的な実装です。Bの重み0のセカンダリには通常時トラフィックが流れませんが、障害時に自動で切り替わる仕組みがなく、手動での重み変更が必要になるため要件を満たしません。Cのレイテンシーベースは平常時から両リージョンへトラフィックが分散されるため、メンテナンスページが通常時にも表示されてしまいます。Dの位置情報ルーティングはユーザーの地域による出し分けのための機能で、障害時の切り替え用途ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/dns-failover.html",
  },
  {
    id: "cloudops-d5-ch02-q02",
    domain: 5,
    topic: "Route 53ヘルスチェック",
    type: "single",
    difficulty: "medium",
    question:
      "Route 53のフェイルオーバールーティングを構成したところ、プライマリのWebサーバー(EC2上で稼働、利用者のブラウザからは正常にアクセス可能)に関連付けたヘルスチェックが常に「Unhealthy」と表示されます。ヘルスチェックはHTTPS・ポート443・パス/healthで設定されており、アプリケーションの/healthはステータスコード200を返します。原因として最も可能性が高いものはどれですか。",
    choices: [
      "HTTPSヘルスチェックのため、Route 53がSSL証明書の検証に失敗している",
      "ヘルスチェックのリクエスト間隔が標準の30秒に設定されている",
      "WebサーバーのセキュリティグループでRoute 53ヘルスチェッカーのIPアドレス範囲からの接続が許可されていない",
      "ヘルスチェックのエンドポイントをIPアドレスではなくドメイン名で指定している",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ヘルスチェックは、Route 53が世界各地に持つヘルスチェッカーのIPアドレス範囲からエンドポイントへ直接接続して実行されます。利用者からアクセスできても、セキュリティグループやファイアウォールでヘルスチェッカーのIP範囲を許可していなければチェックは失敗し続けます。AのRoute 53のHTTPSヘルスチェックはSSL/TLS証明書の有効性を検証しないため、証明書起因で失敗することはありません。Bの30秒は標準のリクエスト間隔で、正常な設定です。Dのドメイン名によるエンドポイント指定はサポートされており、それ自体は失敗の原因になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/dns-failover.html",
  },
  {
    id: "cloudops-d5-ch02-q03",
    domain: 5,
    topic: "加重ルーティング",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がWebアプリケーションの新バージョンをリリースするにあたり、まず全体の10%のユーザーにのみ新バージョンを提供し、問題がなければ徐々に割合を増やしたいと考えています。最も適切なAmazon Route 53のルーティングポリシーはどれですか。",
    choices: [
      "シンプルルーティングポリシー",
      "フェイルオーバールーティングポリシー",
      "複数値回答ルーティングポリシー",
      "加重ルーティングポリシー",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。加重ルーティングポリシーはレコードごとに設定した重みの比率でトラフィックを分配できるため、旧バージョンに90、新バージョンに10のような重み付けでカナリアリリースを実現し、段階的に比率を変更できます。Aのシンプルルーティングは1つのレコードを返すだけで、比率の制御はできません。Bのフェイルオーバーはヘルスチェックに基づく正常/異常の切り替え用であり、割合の指定はできません。Cの複数値回答ルーティングは正常なレコードを最大8件ランダムに返す方式で、10%のような比率の制御には対応していません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/routing-policy.html",
  },
  {
    id: "cloudops-d5-ch02-q04",
    domain: 5,
    topic: "Route 53 Resolver",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Direct Connectでオンプレミスネットワークと VPCを接続しています。VPCにはプライベートホストゾーン(corp.example.internal)があり、VPC内のインスタンスからは名前解決できますが、オンプレミスのサーバーからはこのゾーンのレコードを解決できません。最小の運用負荷で解決する方法はどれですか。",
    choices: [
      "オンプレミスのDNSサーバーにプライベートホストゾーンと同じ内容のゾーンを複製して手動で同期する",
      "Route 53 Resolverインバウンドエンドポイントを作成し、オンプレミスDNSサーバーから該当ドメインのクエリをそのIPアドレスへ転送する",
      "Route 53 Resolverアウトバウンドエンドポイントを作成し、オンプレミスDNSサーバー宛ての転送ルールを設定する",
      "パブリックホストゾーンを作成して同じレコードをインターネットに公開する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。インバウンドエンドポイントは、オンプレミス側からVPCのRoute 53 ResolverへDNSクエリを送り込むための入口です。オンプレミスDNSサーバーに条件付きフォワーダーを設定してインバウンドエンドポイントのIPへ転送すれば、プライベートホストゾーンを解決できます。Cのアウトバウンドエンドポイントは逆方向、つまりVPC内からオンプレミスのDNSへクエリを転送するための機能です。Aのゾーン複製は手動同期が必要で運用負荷が高く、変更時の不整合も生じます。Dは社内用レコードをインターネットに公開することになり、セキュリティ上不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resolver.html",
  },
  {
    id: "cloudops-d5-ch02-q05",
    domain: 5,
    topic: "DNS Firewall",
    type: "single",
    difficulty: "medium",
    question:
      "Amazon GuardDutyが、VPC内のEC2インスタンスから既知のコマンド&コントロール(C2)ドメインへのDNSクエリを検出しました。CloudOpsエンジニアは、VPC内のすべてのリソースから悪意のある特定ドメインへの名前解決をブロックし、ブロックしたクエリを記録したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "AWS Network Firewallでポート53のアウトバウンド通信をすべて拒否する",
      "AWS WAFのWeb ACLにドメインベースのブロックルールを作成する",
      "Route 53 Resolver DNS Firewallでドメインリストを使用したブロックルールを設定し、Resolverクエリログを有効化する",
      "セキュリティグループのアウトバウンドルールで該当ドメイン宛ての通信を拒否する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Route 53 Resolver DNS Firewallは、VPCから送信されるDNSクエリをドメインリストに基づいてALLOW・ALERT・BLOCKで制御でき、AWSマネージドドメインリストで既知の悪性ドメインもまとめて遮断できます。クエリの記録にはResolverクエリログを使用します。Aのポート53全体の拒否は正当な名前解決まで止めてしまい、業務影響が大きすぎます。BのWAFはWebアプリケーションへのインバウンドHTTP(S)リクエストを検査するもので、アウトバウンドのDNSクエリは制御できません。Dのセキュリティグループはドメイン名を条件にできず、そもそも拒否ルール自体を設定できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resolver-dns-firewall.html",
  },
  {
    id: "cloudops-d5-ch02-q06",
    domain: 5,
    topic: "CloudFront",
    type: "multiple",
    difficulty: "medium",
    question:
      "あるメディアサイトでAmazon CloudFrontのキャッシュヒット率が30%程度と低く、オリジンのALBとEC2の負荷が高止まりしています。調査したところ、ビヘイビアの設定ですべてのHTTPヘッダーをオリジンへ転送しており、TTLも短く設定されていました。キャッシュヒット率を改善する方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "すべてのパスを対象に毎日キャッシュ無効化(invalidation)を実行する",
      "ビューワープロトコルポリシーをHTTPSへのリダイレクトに変更する",
      "キャッシュポリシーを見直し、キャッシュキーに含めるヘッダー・クエリ文字列・Cookieを必要最小限に絞る",
      "オリジンをApplication Load BalancerからNetwork Load Balancerに変更する",
      "オリジンのCache-Controlヘッダーのmax-ageやビヘイビアのTTLを延長し、静的コンテンツのキャッシュ期間を延ばす",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。キャッシュキーに不要なヘッダーやクエリ文字列、Cookieが含まれると、同じコンテンツでも別のキャッシュエントリとして扱われてミスが増えるため、キーを必要最小限に絞ることが最も効果的です。また、TTLが短いとキャッシュがすぐ失効するため、更新頻度の低いコンテンツはmax-ageやTTLを延長してキャッシュ期間を延ばします。Aの無効化はエッジのキャッシュを削除する操作であり、実行するほどヒット率はむしろ低下します。Bのプロトコル設定は通信の暗号化に関する要件であり、ヒット率には影響しません。Dのロードバランサーの種類の変更はオリジン側の構成変更であり、キャッシュ効率の改善にはつながりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/cache-hit-ratio.html",
  },
  {
    id: "cloudops-d5-ch02-q07",
    domain: 5,
    topic: "キャッシュ無効化",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がWebサイトの重要なお知らせページを更新しましたが、Amazon CloudFront経由では古いコンテンツが表示され続けています。設定されたTTLの残り時間を待たずに、できるだけ早く全ユーザーへ更新後のコンテンツを配信する方法として最も適切なものはどれですか。",
    choices: [
      "該当パスを指定してCloudFrontのキャッシュ無効化(invalidation)を実行する",
      "CloudFrontディストリビューションを削除して新しく作成し直す",
      "オリジンのAmazon S3バケットでバージョニングを有効化する",
      "Route 53のレコードのTTLを短い値に変更する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。キャッシュ無効化を実行すると、指定したパス(/*で全体も可)のキャッシュがエッジロケーションから削除され、次のリクエストからオリジンの最新コンテンツが取得・配信されます。TTLの経過を待たずに更新を反映する標準的な方法です。Bのディストリビューションの再作成は配信の停止やDNS変更を伴い、時間もかかるため不適切です。CのS3バージョニングはオブジェクトの世代を保持する機能で、エッジに残ったキャッシュには影響しません。DのRoute 53のTTLはDNS応答のキャッシュ期間の設定であり、CloudFrontのコンテンツキャッシュとは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html",
  },
  {
    id: "cloudops-d5-ch02-q08",
    domain: 5,
    topic: "オリジンアクセスコントロール",
    type: "single",
    difficulty: "medium",
    question:
      "セキュリティ監査で、Amazon CloudFront経由で配信しているAmazon S3バケットのオブジェクトが、S3のURLへ直接アクセスしても取得できてしまうことが指摘されました。ユーザーがCloudFront経由でのみコンテンツにアクセスできるように修正する方法として、最も適切なものはどれですか。",
    choices: [
      "S3のブロックパブリックアクセスを有効化し、CloudFrontのビヘイビアで署名付きURLを必須にする",
      "S3バケットポリシーでCloudFrontのIPアドレス範囲からのアクセスのみを許可する",
      "S3バケットのACLでCloudFrontに読み取り権限を付与し、パブリック読み取り設定を削除する",
      "オリジンアクセスコントロール(OAC)を設定し、バケットポリシーでCloudFrontサービスプリンシパルからの読み取りのみ許可してパブリックアクセスをブロックする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。OACを設定するとCloudFrontがSigV4で署名してS3へアクセスするようになり、バケットポリシーでcloudfront.amazonaws.comサービスプリンシパルに対しAWS:SourceArn条件で自分のディストリビューションに限定した読み取りを許可できます。パブリックアクセスをブロックすれば直接アクセスは拒否されます。Aはパブリックアクセスをブロックするだけでは署名手段を持たないCloudFrontからのアクセスも拒否されて配信が止まり、署名付きURLはビューワー向けの制限であってオリジン保護にはなりません。BのCloudFrontのIP範囲は全CloudFront利用者に共有されており、第三者のディストリビューション経由のアクセスを防げません。CのACLによる制御はレガシーなOAIに近い手法で、現在はOACの使用が推奨されています。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
  },
  {
    id: "cloudops-d5-ch02-q09",
    domain: 5,
    topic: "Global Accelerator",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、UDPベースのリアルタイムゲームサーバーを複数のリージョンで運用しています。世界中のプレイヤーを低レイテンシで接続させるとともに、クライアント側のファイアウォールに登録できる固定のIPアドレスを提供する必要があります。最も適切なサービスはどれですか。",
    choices: [
      "Amazon CloudFrontで各リージョンのサーバーをオリジンとして配信する",
      "AWS Global Acceleratorで各リージョンのエンドポイントへトラフィックをルーティングする",
      "Amazon Route 53のレイテンシーベースルーティングで最寄りリージョンへ誘導する",
      "Application Load Balancerを各リージョンに配置して負荷分散する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Global Acceleratorは2つの固定エニーキャストIPアドレスを提供し、TCP/UDPトラフィックをAWSのグローバルネットワーク経由で最寄りの正常なエンドポイントへルーティングします。UDP対応・固定IP・低レイテンシという要件をすべて満たします。AのCloudFrontはHTTP/HTTPSのコンテンツ配信サービスであり、UDPのゲームトラフィックの中継や固定IPの提供はできません。CのレイテンシーベースルーティングはDNSレベルの誘導のため固定IPを提供できず、クライアント側のDNSキャッシュの影響で切り替えも遅れます。DのALBはHTTP/HTTPS(レイヤー7)用でUDPを扱えず、単一リージョン内の負荷分散にとどまります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/global-accelerator/latest/dg/what-is-global-accelerator.html",
  },
  {
    id: "cloudops-d5-ch02-q10",
    domain: 5,
    topic: "ELBアクセスログ",
    type: "single",
    difficulty: "hard",
    question:
      "あるWebアプリケーションで断続的にHTTP 502エラーが発生しています。CloudOpsエンジニアがApplication Load Balancer(ALB)のアクセスログを分析したところ、elb_status_codeが「502」、target_status_codeが「-」のエントリが多数見つかりました。この記録から読み取れることとして最も適切なものはどれですか。",
    choices: [
      "ターゲットのアプリケーションがHTTP 502をレスポンスとして返している",
      "クライアントがレスポンスを受け取る前にリクエストを中断している",
      "ターゲットから有効なHTTP応答が得られず(接続失敗や不正な応答)、ALBが502を生成している",
      "AWS WAFのルールがリクエストをブロックして502を返している",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ALBアクセスログでは、elb_status_codeがALB自身の応答コード、target_status_codeがターゲットから返されたコードを示します。target_status_codeが「-」のまま502が記録されるのは、ターゲットへの接続失敗や不正な応答などでALBが有効なレスポンスを受け取れず、ALB自身が502 Bad Gatewayを生成したことを意味します。Aのターゲットが502を返した場合はtarget_status_codeにも502が記録されるため一致しません。Bのクライアント側の中断はターゲット応答の有無とは別の事象で、このログパターンの説明になりません。DのWAFによるブロックは既定では403として記録されるため、502の説明として不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-access-logs.html",
  },
  {
    id: "cloudops-d5-ch02-q11",
    domain: 5,
    topic: "AWS WAFログ",
    type: "multiple",
    difficulty: "hard",
    question:
      "AWS WAFのマネージドルールグループを関連付けたALB経由のWebアプリケーションで、一部の正当なユーザーのリクエストが403エラーで拒否されるようになりました。誤検知(false positive)の原因ルールを特定し、サービスへの影響を抑えながら調査とチューニングを進める方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "WAFログのterminatingRuleIdフィールドを確認し、リクエストをブロックしたルールを特定する",
      "Web ACLをALBから関連付け解除し、WAFなしの状態で運用を継続する",
      "ALBのアクセスログでtarget_status_codeを確認し、ブロックの原因になったルールを特定する",
      "誤検知を起こしているルールをカウント(Count)モードに変更し、マッチ状況をログで監視しながらチューニングする",
      "レートベースルールのリクエストしきい値を引き上げて拒否の発生を減らす",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。WAFログには、リクエストの処理を確定させたルールがterminatingRuleIdとして記録されるため、誤検知の原因ルールを特定できます。特定したルールをCountモードに変更すれば、実際にはブロックせずマッチ状況だけをログで観測でき、保護を維持したままルールの除外や調整を進められます。BのWeb ACLの解除はアプリケーションの保護を全面的に失うため不適切です。CのALBアクセスログにはどのWAFルールに一致したかは記録されないため、原因ルールの特定はできません。Eは原因がレートベースルールと特定される前にしきい値を変更しても解決につながらず、必要な保護を弱めるおそれもあります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/logging.html",
  },
];
