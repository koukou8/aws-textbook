// AWS基礎 後半(第7〜12章)の章末確認問題
export const questions = [
  {
    id: "basics-ch07-q01",
    domain: null,
    topic: "Amazon RDS",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、オンプレミスのMySQLデータベースをAWSへ移行します。OSやデータベースエンジンへのパッチ適用、バックアップといった定型的な運用作業を減らすことを最も重視しています。最も適切な移行先はどれですか。",
    choices: [
      "Amazon EC2インスタンスにMySQLをインストールして運用する",
      "Amazon DynamoDBにテーブルを作成して移行する",
      "Amazon RDS for MySQLのDBインスタンスへ移行する",
      "Amazon S3にデータベースファイルを保存して運用する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon RDSはマネージドリレーショナルデータベースであり、ハードウェア管理・OSとDBエンジンのパッチ適用・自動バックアップをAWSが担うため、MySQL互換を保ったまま運用負荷を大幅に減らせます。AはEC2上の自前構築となり、パッチ適用やバックアップを引き続き自社で行う必要があります。BのDynamoDBはNoSQL(キーバリュー)型で、既存のSQLやスキーマをそのまま移行できません。DのS3はオブジェクトストレージであり、データベースエンジンとして稼働させることはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Welcome.html",
  },
  {
    id: "basics-ch07-q02",
    domain: null,
    topic: "RDSマルチAZ配置",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がAmazon RDS for PostgreSQLで基幹システムを運用しています。アベイラビリティーゾーン障害が発生してもダウンタイムを最小限に抑え、アプリケーションの接続文字列を変更せずに自動で復旧させたいと考えています。最も適切な構成はどれですか。",
    choices: [
      "マルチAZ配置を有効にする",
      "リードレプリカを別のAZに作成する",
      "毎時スナップショットを取得し、障害時に復元する",
      "ElastiCacheクラスターをデータベースの手前に配置する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。マルチAZ配置では別AZのスタンバイへ同期レプリケーションが行われ、障害時は自動フェイルオーバーでスタンバイが昇格します。DNSエンドポイントは変わらないため接続文字列の変更も不要です。Bのリードレプリカは非同期レプリケーションで、障害時の昇格は手動のため自動復旧の要件を満たしません。Cのスナップショットからの復元は復旧までのダウンタイムが長く、直近データの損失も生じ得ます。DのElastiCacheは読み取りを高速化するキャッシュ層であり、データベースの可用性を高める仕組みではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html",
  },
  {
    id: "basics-ch07-q03",
    domain: null,
    topic: "リードレプリカ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のECサイトでは、Amazon RDS for MySQLに対して夜間のレポート集計クエリが大量に実行され、本番の書き込み処理の性能が低下しています。書き込み側への影響を抑えつつ読み取り負荷を分離する最も適切な方法はどれですか。",
    choices: [
      "マルチAZ配置を有効にし、スタンバイでレポートを実行する",
      "DBインスタンスのストレージ容量を増やす",
      "自動バックアップの保持期間を延長する",
      "リードレプリカを作成し、レポートクエリの接続先にする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。リードレプリカは専用エンドポイントを持つ読み取り専用の複製で、レポートや分析などの読み取りクエリをオフロードしてプライマリの負荷を下げられます。AのマルチAZ配置のスタンバイは待機専用であり、通常時に読み取りクエリを処理させることはできません。Bのストレージ容量の増加は保存できるデータ量が増えるだけで、クエリ負荷の分離にはなりません。Cのバックアップ保持期間は復元可能な期間を決める設定であり、性能とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
  },
  {
    id: "basics-ch07-q04",
    domain: null,
    topic: "Amazon Aurora",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業がRDS for MySQLからAmazon Auroraへの移行を検討しており、Auroraの特徴を整理しています。Auroraの説明として正しいものはどれですか。(2つ選択してください)",
    choices: [
      "OracleとSQL Serverのエンジンを選択できる",
      "MySQLおよびPostgreSQLと互換性がある",
      "ストレージは事前に容量を指定し、手動で拡張する必要がある",
      "データは3つのアベイラビリティーゾーンに合計6つ複製される",
      "リードレプリカは1つまでしか作成できない",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。AuroraはMySQL・PostgreSQL互換のクラウド向けデータベースで、既存のドライバやSQLをほぼそのまま利用できます。またデータは3つのAZに合計6つ複製され、高い耐久性を持ちます。AのOracleやSQL ServerはRDSで選択できるエンジンであり、Auroraでは利用できません。Cは誤りで、Auroraのストレージは使用量に応じて自動的に拡張され、事前のサイズ指定は不要です。Eも誤りで、Auroraレプリカは最大15個まで作成でき、フェイルオーバー先としても機能します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html",
  },
  {
    id: "basics-ch07-q05",
    domain: null,
    topic: "Amazon DynamoDB",
    type: "single",
    difficulty: "easy",
    question:
      "あるゲーム会社が、プレイヤーのセッション情報をユーザーIDをキーとして読み書きするデータストアを探しています。サーバーのプロビジョニングが不要で、アクセス数が急増しても1桁ミリ秒の応答時間を維持できるサービスはどれですか。",
    choices: [
      "Amazon RDS for MySQL",
      "Amazon DynamoDB",
      "Amazon Aurora",
      "Amazon EBS",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。DynamoDBはフルマネージドのNoSQL(キーバリュー)データベースで、サーバーのプロビジョニングが不要なうえ自動で水平スケールし、規模にかかわらず1桁ミリ秒の応答を実現します。キー指定でセッション情報を高速に読み書きする用途に最適です。AのRDSとCのAuroraはリレーショナルデータベースで、インスタンスやキャパシティの管理が必要であり、キーバリューアクセス中心の要件には適しません。DのEBSはEC2にアタッチするブロックストレージで、単体でデータベースとして機能しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Introduction.html",
  },
  {
    id: "basics-ch07-q06",
    domain: null,
    topic: "Amazon ElastiCache",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のWebサイトでは、商品カタログに対する同じ読み取りクエリが大量に繰り返され、Amazon RDSのCPU使用率が高止まりしています。データベースの構成を大きく変えずに、繰り返しアクセスへの応答をメモリから返して高速化し、データベースへ到達するクエリ自体も減らしたいと考えています。最も適切な対策はどれですか。",
    choices: [
      "リードレプリカを複数作成して読み取りを分散する",
      "マルチAZ配置を有効にする",
      "ElastiCacheをデータベースの手前にキャッシュ層として配置する",
      "DBインスタンスをより大きいサイズに変更する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。同一の読み取りクエリが繰り返される場合、ElastiCacheをキャッシュ層として置けば2回目以降の結果をメモリから返せるため応答が高速化し、データベースへ到達するクエリが減って負荷も下がります。Aのリードレプリカは読み取りの分散にはなりますが、同じクエリを毎回データベースで実行する点は変わらず、クエリ数の削減にはなりません。BのマルチAZ配置は可用性対策であり、読み取り性能は向上しません。Dのインスタンスサイズ拡大はコストが増えるうえ、繰り返しクエリという根本原因への対策になりません。",
    reference: "https://aws.amazon.com/jp/elasticache/faqs/",
  },
  {
    id: "basics-ch08-q01",
    domain: null,
    topic: "Application Load Balancer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がコンテナで動作するWebアプリケーションとAPIを運用しており、同一ドメインで受けたHTTPSリクエストのうち「/api/*」はAPI用ターゲットグループへ、「/static/*」は静的コンテンツ用ターゲットグループへ振り分けたいと考えています。最も適切なロードバランサーはどれですか。",
    choices: [
      "Network Load Balancer",
      "Application Load Balancer",
      "Gateway Load Balancer",
      "Amazon Route 53の加重ルーティング",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ALBはL7(HTTP/HTTPS)で動作し、URLパスやホスト名に基づくルーティングをリスナールールで定義できるため、パスごとに異なるターゲットグループへ振り分ける要件に合致します。AのNLBはL4(TCP/UDP)で動作し、URLパスの内容を解釈した振り分けはできません。CのGWLBはファイアウォールなどのネットワーク仮想アプライアンスへトラフィックを流すためのものです。DのRoute 53加重ルーティングはDNSレベルで比率を分ける仕組みであり、URLパスによる振り分けはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/introduction.html",
  },
  {
    id: "basics-ch08-q02",
    domain: null,
    topic: "Network Load Balancer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が、TCPプロトコルで通信するIoTデバイス向けの受信基盤を構築します。大量のトラフィックを極めて低いレイテンシで処理し、デバイス側のファイアウォールに登録するための固定IPアドレスが各AZに必要です。最も適切なロードバランサーはどれですか。",
    choices: [
      "Application Load Balancer",
      "Gateway Load Balancer",
      "Amazon CloudFront",
      "Network Load Balancer",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。NLBはL4(TCP/UDP)で動作して超低レイテンシで大量トラフィックを処理でき、AZごとに固定IPアドレスを持てるため、固定IPをファイアウォールへ登録する要件も満たします。AのALBはL7(HTTP/HTTPS)向けで、固定IPアドレスを標準では提供しません。BのGWLBはファイアウォールなどのアプライアンスを通信経路に挟むためのもので、用途が異なります。CのCloudFrontはHTTP/HTTPSコンテンツをキャッシュ配信するCDNであり、任意のTCP通信の負荷分散には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/network/introduction.html",
  },
  {
    id: "basics-ch08-q03",
    domain: null,
    topic: "ヘルスチェック",
    type: "single",
    difficulty: "easy",
    question:
      "Application Load Balancerの背後で4台のEC2インスタンスが稼働しており、そのうち1台がターゲットグループのヘルスチェックに失敗しました。このときのELBの標準的な動作はどれですか。",
    choices: [
      "異常なインスタンスを振り分け対象から外し、正常な3台にのみリクエストを送る",
      "異常なインスタンスを自動的に終了し、新しいインスタンスに置き換える",
      "異常なインスタンスのOSを自動的に再起動して復旧させる",
      "すべてのインスタンスへの振り分けを停止して保守モードに移行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。ELBのヘルスチェックは各ターゲットの正常・異常を判定し、正常なターゲットにのみリクエストを送ります。異常なターゲットは自動的に振り分け対象から外れ、ヘルスチェックに再び合格すれば対象に戻ります。Bのようにインスタンスを終了して置き換えるのはAuto Scalingグループの自己修復機能であり、ELB単体の機能ではありません。CのOS再起動もELBの機能ではなく、CloudWatchアラームのEC2アクションなどで別途構成するものです。Dのように全体の振り分けを止める動作はなく、残りの正常なターゲットで処理が継続されます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/target-group-health-checks.html",
  },
  {
    id: "basics-ch08-q04",
    domain: null,
    topic: "Auto Scalingグループ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のWebサーバー群はEC2インスタンス3台で構成されています。インスタンスに障害が発生した場合に、人手を介さず自動的に新しいインスタンスへ置き換えて、常に3台を維持したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "CloudWatchダッシュボードで稼働台数を常時監視する",
      "各インスタンスのEBSスナップショットを毎日取得する",
      "最小・希望・最大キャパシティを3に設定したAuto Scalingグループで管理する",
      "Elastic Load Balancingのヘルスチェックを有効にする",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Auto Scalingグループはヘルスチェックに失敗したインスタンスを自動的に終了し、起動テンプレートの定義から新しいインスタンスを起動して希望キャパシティ(3台)を維持します。この自己修復の働きが要件に合致します。Aのダッシュボードは状態の可視化のみで、自動的な置き換えは行いません。BのEBSスナップショットはデータのバックアップであり、稼働台数を維持する仕組みではありません。DのELBヘルスチェックは異常なターゲットへリクエストを送らなくするだけで、インスタンスの交換までは行いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html",
  },
  {
    id: "basics-ch08-q05",
    domain: null,
    topic: "スケーリングポリシー",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業の勤怠システムは、毎週月曜の9時に従業員のアクセスが集中することが分かっています。9時の時点でスケールアウトが完了しているようにしつつ、それ以外の時間帯は台数を抑えてコストを最適化したいと考えています。最も適切なスケーリング方式はどれですか。",
    choices: [
      "ターゲット追跡スケーリングでCPU使用率50%を目標に設定する",
      "スケジュールされたスケーリングで月曜9時前に希望キャパシティを増やす",
      "最小キャパシティを常にピーク時と同じ台数に設定する",
      "ステップスケーリングでアラームの超過幅に応じて増減させる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。需要の急増が特定の日時に起こると事前に分かっている場合は、スケジュールされたスケーリングでその直前に希望キャパシティを増やしておくのが定石で、9時の時点で必要な台数を確保できます。Aのターゲット追跡とDのステップスケーリングは、いずれも指標の変化を検知してから反応する方式のため、インスタンスの起動が完了するまで9時直後の急増に間に合わないおそれがあります。Cのように常時ピーク台数を維持すればスパイクには耐えられますが、閑散時間帯に無駄なコストが発生し、コスト最適化の要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html",
  },
  {
    id: "basics-ch08-q06",
    domain: null,
    topic: "ELBとAuto Scalingの連携",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が、需要の変動が大きいWebアプリケーションをEC2で構築します。トラフィックを複数AZのインスタンスへ分散し、需要に応じた台数の自動増減と障害インスタンスの自動交換を実現するために、組み合わせて使用すべきサービスはどれですか。(2つ選択してください)",
    choices: [
      "Elastic Load Balancing",
      "Amazon CloudFront",
      "Amazon EC2 Auto Scaling",
      "AWS Direct Connect",
      "Amazon ElastiCache",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。ELBがリクエストを複数AZの正常なインスタンスへ分散し、Auto Scalingグループが需要に応じた台数の増減と、障害インスタンスの終了・置き換えによる自己修復を担います。両者を連携させるのが可用性と弾力性を両立する基本構成です。BのCloudFrontはコンテンツをエッジでキャッシュ配信するCDNで、インスタンスの台数管理はできません。DのDirect Connectはオンプレミス拠点とAWSを結ぶ専用線接続サービスです。EのElastiCacheはインメモリキャッシュであり、負荷分散やスケーリングの機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/autoscaling-load-balancer.html",
  },
  {
    id: "basics-ch09-q01",
    domain: null,
    topic: "Route 53ルーティングポリシー",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が同一のWebアプリケーションを東京リージョンとバージニア北部リージョンの両方で稼働させています。世界中の利用者からのDNS問い合わせに対して、それぞれの利用者にとってネットワーク遅延が最小になるリージョンへ誘導したいと考えています。最も適切なルーティングポリシーはどれですか。",
    choices: [
      "シンプルルーティング",
      "フェイルオーバールーティング",
      "加重ルーティング",
      "レイテンシールーティング",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。レイテンシールーティングは、利用者から見てネットワーク遅延が最小になるリージョンのリソースへ誘導するポリシーで、複数リージョン展開で応答速度を最優先する要件に合致します。Aのシンプルルーティングは固定の値を返すだけで、利用者ごとの最適化はできません。Bのフェイルオーバールーティングはプライマリの障害時にセカンダリへ切り替えるための方式です。Cの加重ルーティングは指定した比率で振り分ける方式で、カナリアリリースなどに使うものであり、遅延は考慮されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/routing-policy.html",
  },
  {
    id: "basics-ch09-q02",
    domain: null,
    topic: "フェイルオーバールーティング",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、本番サイトを東京リージョンで運用し、災害対策用の代替サイトを別リージョンに用意しています。本番サイトがヘルスチェックに失敗したときだけ、自動的に代替サイトへDNSの応答を切り替えたいと考えています。最も適切なルーティングポリシーはどれですか。",
    choices: [
      "フェイルオーバールーティング",
      "位置情報ルーティング",
      "複数値回答ルーティング",
      "加重ルーティング",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。フェイルオーバールーティングは、ヘルスチェックでプライマリの異常を検知するとセカンダリのリソースへ応答を切り替える方式で、プライマリ/スタンバイ構成の災害対策に最適です。Bの位置情報ルーティングは利用者の地理的な場所に応じて応答を変える方式で、障害時の切り替えが目的ではありません。Cの複数値回答ルーティングは正常な複数のIPアドレスをランダムに返す簡易的な負荷分散です。Dの加重ルーティングは指定した比率での振り分けであり、「障害時だけ切り替える」動作にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/dns-failover.html",
  },
  {
    id: "basics-ch09-q03",
    domain: null,
    topic: "エイリアスレコード",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業がRoute 53のパブリックホストゾーンで「example.com」を管理しており、ゾーン頂点であるexample.comそのものへのアクセスをApplication Load Balancerへ向けたいと考えています。最も適切な設定はどれですか。",
    choices: [
      "example.comのCNAMEレコードを作成し、ALBのDNS名を指定する",
      "ALBのIPアドレスを調べて、example.comのAレコードに登録する",
      "example.comのエイリアスレコードを作成し、ALBを指定する",
      "プライベートホストゾーンを作成し、ALBへのレコードを追加する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。エイリアスレコードはALBやCloudFrontなどのAWSリソースを直接指し示せるRoute 53独自のレコードで、CNAMEと異なりゾーン頂点(example.com自体)にも設定できます。AのCNAMEレコードは、DNSの仕様上ゾーン頂点には作成できません。BのALBのIPアドレスは固定ではなく変動するため、Aレコードへ直接登録するといずれ接続できなくなります。Dのプライベートホストゾーンは関連付けたVPC内からの問い合わせにのみ応答するものであり、インターネット向けの公開サイトの名前解決には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html",
  },
  {
    id: "basics-ch09-q04",
    domain: null,
    topic: "オリジンアクセスコントロール",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がAmazon S3をオリジンとするCloudFrontディストリビューションで画像を配信しています。利用者がS3バケットのURLへ直接アクセスするのを禁止し、必ずCloudFront経由でのみコンテンツを取得させたいと考えています。最も適切な方法はどれですか。",
    choices: [
      "S3バケットで静的ウェブサイトホスティングを有効にする",
      "オリジンアクセスコントロール(OAC)を設定し、S3への直接アクセスを制限する",
      "キャッシュビヘイビアのTTLを長く設定する",
      "Route 53のエイリアスレコードでS3バケットを指定する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。オリジンアクセスコントロール(OAC)を設定すると、S3バケットへのアクセスをCloudFrontからのリクエストに限定でき、バケットURLへの直接アクセスを禁止できます。Aの静的ウェブサイトホスティングはバケットのコンテンツを公開するための機能で、要件とは逆の結果になります。CのTTLはエッジでのキャッシュ保持時間を決める設定であり、オリジンへのアクセス制御はできません。DのエイリアスレコードはDNSの向き先を設定するだけで、S3バケットへの直接アクセスを防ぐ効果はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
  },
  {
    id: "basics-ch09-q05",
    domain: null,
    topic: "CloudFrontキャッシュ管理",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業がCloudFrontで配信中のCSSファイルに重大な誤りを見つけました。エッジロケーションのキャッシュにはTTLの残り時間がありますが、利用者へ今すぐ修正版を届ける必要があります。有効な方法はどれですか。(2つ選択してください)",
    choices: [
      "ディストリビューションのデフォルトTTLをさらに長く設定する",
      "該当パスに対してキャッシュの無効化(Invalidation)を実行する",
      "オリジンのS3バケットを別のリージョンへ移動する",
      "Route 53のレコードのTTLを短く変更する",
      "修正版をバージョン付きの新しいファイル名で配置し、参照URLを更新する",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。無効化(Invalidation)を実行するとエッジロケーションのキャッシュが破棄され、次のリクエストからオリジンの修正版が配信されます。また、バージョン付きの新しいファイル名で配置すれば別URLとして扱われるため既存キャッシュの影響を受けず、即座に新しいファイルが取得されます。AのTTL延長は古いキャッシュがより長く残るため逆効果です。Cのバケット移動はエッジに残ったキャッシュの破棄につながりません。DのDNSレコードのTTLはドメインの名前解決に関する設定で、エッジキャッシュの保持時間とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html",
  },
  {
    id: "basics-ch09-q06",
    domain: null,
    topic: "AWS Global Accelerator",
    type: "single",
    difficulty: "hard",
    question:
      "あるゲーム会社が、UDPで通信する対戦ゲームのサーバーを複数リージョンで運用しています。世界中のプレイヤーの通信をAWSのネットワーク網に早く乗せて経路を最適化し、クライアントに設定するための固定IPアドレスも提供したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Global Accelerator",
      "Amazon CloudFront",
      "Amazon API Gateway",
      "AWS Direct Connect",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Global Acceleratorは固定のエニーキャストIPアドレスを提供し、利用者の通信を最寄りのエッジからAWSのネットワーク網に乗せて経路を最適化します。キャッシュできないTCP/UDP通信の高速化や、固定IPが必要な要件に適しています。BのCloudFrontはHTTP/HTTPSコンテンツをエッジでキャッシュ配信するCDNで、UDPの対戦通信には使えません。CのAPI GatewayはREST APIやWebSocket APIを管理するサービスで、UDPには対応していません。DのDirect Connectはオンプレミス拠点とAWSを結ぶ専用線であり、インターネット上のプレイヤーの通信高速化には無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/global-accelerator/latest/dg/what-is-global-accelerator.html",
  },
  {
    id: "basics-ch10-q01",
    domain: null,
    topic: "CloudWatchエージェント",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、EC2インスタンスのメモリ使用率をCloudWatchで監視し、しきい値超過時にアラームを発報させたいと考えています。最初に必要な作業はどれですか。",
    choices: [
      "詳細モニタリングを有効にして、メトリクスの間隔を1分にする",
      "CloudTrailの証跡を作成して、インスタンスのイベントを記録する",
      "EC2の標準メトリクスに対してメモリ使用率のアラームを作成する",
      "CloudWatchエージェントを導入して、メモリ使用率をカスタムメトリクスとして送信する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。メモリ使用率やディスク使用率はOS内部の情報のため、EC2の標準メトリクスには含まれません。CloudWatchエージェントをインスタンスに導入し、カスタムメトリクスとして送信して初めてアラームを設定できます。Aの詳細モニタリングは標準メトリクスの間隔を5分から1分に短縮するだけで、メモリのメトリクスが追加されるわけではありません。BのCloudTrailはAPI呼び出しを記録するサービスで、性能監視には使いません。Cは前提が誤っており、標準メトリクスにメモリ使用率は存在しないためアラームを作成できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html",
  },
  {
    id: "basics-ch10-q02",
    domain: null,
    topic: "CloudWatchアラーム",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、EC2インスタンスのCPU使用率が80%を10分間超え続けた場合に、運用チームへメールで自動的に知らせたいと考えています。最も適切な構成はどれですか。",
    choices: [
      "CloudWatch Logsのロググループにメールアドレスを登録する",
      "CloudWatchアラームを作成し、アクションでAmazon SNSトピックへ通知する",
      "AWS Configルールを作成し、CPU使用率を評価する",
      "CloudTrailのイベント履歴でCPU使用率を定期確認する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CPU使用率のメトリクスにしきい値と継続時間を指定したアラームを作成し、ALARM状態になったときのアクションとしてSNSトピックへ通知すれば、購読している運用チームへメールが届きます。メトリクス→アラーム→アクションが監視の基本形です。Aのロググループはログの保管単位であり、メール通知を設定する場所ではありません。CのConfigルールはリソースの設定が準拠しているかを評価する仕組みで、性能指標のしきい値監視には使えません。DのCloudTrailはAPI呼び出しの記録であり、CPU使用率は記録されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
  },
  {
    id: "basics-ch10-q03",
    domain: null,
    topic: "AWS CloudTrail",
    type: "single",
    difficulty: "easy",
    question:
      "セキュリティ担当者が、「先週、本番環境のセキュリティグループのルールを変更したのは誰か」を調査する必要があります。最も適切な確認先はどれですか。",
    choices: [
      "CloudWatchメトリクスのグラフ",
      "VPCフローログ",
      "AWS CloudTrailのイベント履歴",
      "AWS Trusted Advisorのチェック結果",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。コンソールやCLIからの操作はすべてAPI呼び出しとして実行され、CloudTrailに「誰が・いつ・どこから・何をしたか」が記録されます。過去90日分の管理イベントは、追加設定なしでイベント履歴から確認できます。AのCloudWatchメトリクスはCPU使用率などの性能数値であり、操作者の情報は含まれません。BのVPCフローログはネットワークトラフィックの記録で、設定変更の操作履歴ではありません。DのTrusted Advisorは現在の設定に対する推奨事項を提示するツールで、過去の変更操作をたどることはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/view-cloudtrail-events.html",
  },
  {
    id: "basics-ch10-q04",
    domain: null,
    topic: "CloudTrail証跡",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のコンプライアンス部門から、AWSアカウントのすべての管理操作の記録を1年間保管するよう求められました。最小の運用負荷で要件を満たす方法はどれですか。",
    choices: [
      "CloudTrailの証跡を作成し、イベントをS3バケットへ継続的に配信する",
      "CloudTrailのイベント履歴をそのまま利用する",
      "運用担当者が毎月イベント履歴を手動でエクスポートする",
      "CloudWatch Logsの保持期間を1年に設定する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。証跡(Trail)を作成するとイベントがS3バケットへ継続的に自動配信され、90日を超える長期保管が可能になります。追加の作業なしで記録が蓄積されるため運用負荷も最小です。Bのイベント履歴は過去90日分しか保持されないため、1年の要件を満たせません。Cの手動エクスポートは作業漏れのリスクがあり、毎月の運用負荷も発生します。DのCloudWatch Logsの保持期間は、証跡からログを連携させて初めて意味を持つ設定であり、単独ではCloudTrailのイベントは保存されません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
  },
  {
    id: "basics-ch10-q05",
    domain: null,
    topic: "AWS Config",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、アカウント内のすべてのEBSボリュームが暗号化されていることを継続的に確認し、暗号化されていないボリュームが作成された場合は非準拠として一覧で把握したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "Amazon CloudWatchアラーム",
      "AWS CloudTrailのイベント履歴",
      "AWS Trusted Advisor",
      "AWS Configルール",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS Configはリソースの構成を継続的に記録し、Configルールで「EBSボリュームが暗号化されていること」のような望ましい状態を定義して準拠・非準拠を自動評価できます。非準拠リソースの一覧化や通知・自動修復にもつなげられます。AのCloudWatchアラームはメトリクスのしきい値監視であり、設定内容の評価はできません。Bのイベント履歴は操作の記録をたどるもので、現在の準拠状況を一覧化する用途には向きません。CのTrusted Advisorは定義済みのベストプラクティスに基づく推奨を提示するもので、自社の設定要件を定義して継続評価する仕組みではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/WhatIsConfig.html",
  },
  {
    id: "basics-ch10-q06",
    domain: null,
    topic: "CloudWatch Logs",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業のアプリケーションログはCloudWatch Logsのロググループに集約されています。ログに「ERROR」という文字列が5分間に10回以上出現したら、運用チームへ自動通知したいと考えています。必要な設定はどれですか。(2つ選択してください)",
    choices: [
      "ロググループにメトリクスフィルターを作成し、ERRORの出現回数をメトリクス化する",
      "AWS Configルールでロググループを評価対象に追加する",
      "CloudTrailでデータイベントの記録を有効にする",
      "そのメトリクスに対してCloudWatchアラームを作成し、SNSトピックへ通知する",
      "Logs Insightsのクエリを保存し、担当者が毎回手動で実行する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。メトリクスフィルターでログ中の「ERROR」の出現回数をメトリクス化し、そのメトリクスに「5分間に10回以上」のしきい値でアラームを作成してSNSトピックへ通知するのが定番の構成です。BのConfigルールはリソース設定の準拠評価が目的で、ログの内容は評価できません。CのCloudTrailデータイベントはS3オブジェクト操作などのAPI記録であり、アプリケーションログとは無関係です。EのLogs Insightsは障害調査などの対話的な検索・集計には便利ですが、手動実行のため自動通知の要件を満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringLogData.html",
  },
  {
    id: "basics-ch11-q01",
    domain: null,
    topic: "AWS Lambda",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、S3バケットに画像がアップロードされるたびにサムネイルを生成する処理(実行時間は数秒)を追加したいと考えています。サーバーを管理せず、処理が実行された分だけ課金される構成にするには、どの方法が最も適切ですか。",
    choices: [
      "Amazon EC2インスタンスを常時稼働させてS3をポーリングする",
      "S3のイベント通知をトリガーにAWS Lambda関数を実行する",
      "AWS Fargateでコンテナを常時稼働させて処理する",
      "Amazon ECRにサムネイル生成用のイメージを保存して実行する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Lambdaはサーバー管理が不要なサーバーレスコンピューティングで、S3へのアップロードイベントをトリガーに関数を自動実行できます。課金はリクエスト数と実行時間の従量制で待機中は課金されないため、数秒で終わるイベント駆動処理に最適です。AのEC2常時稼働はアイドル時間にも課金され、ポーリングの仕組みも自作する必要があります。CのFargateはサーバーレスですが、常時稼働させる構成では待機中もコストが発生します。DのECRはコンテナイメージを保存するレジストリであり、処理を実行する基盤ではありません。",
    reference: "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/welcome.html",
  },
  {
    id: "basics-ch11-q02",
    domain: null,
    topic: "Lambdaの実行時間制限",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業が、毎晩1回実行される動画ファイルの一括変換ジョブをAWSへ移行します。1回の処理には約3時間かかります。開発チームは処理をコンテナ化済みで、サーバーの管理はしたくないと考えています。最も適切な実行方法はどれですか。",
    choices: [
      "AWS Lambda関数のタイムアウトを3時間に設定して実行する",
      "Amazon EC2インスタンスを常時稼働させ、cronでジョブを実行する",
      "AWS FargateのECSタスクとしてスケジュール実行する",
      "AWS Elastic Beanstalkのワーカー環境を常時稼働させて処理する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Fargateはサーバーレスのコンテナ実行基盤で、EC2インスタンスを管理することなくコンテナ化済みのジョブを実行できます。Lambdaのような15分の実行時間制限がなく、スケジュール起動すれば処理中のみの課金で済みます。AのLambdaは1回の実行が最大15分までであり、3時間のジョブはそもそも実行できません。BのEC2常時稼働は夜間以外のアイドル時間にも課金され、OSの管理も残ります。DのElastic Beanstalkのワーカー環境も背後でEC2インスタンスが稼働し続けるため、サーバー管理を避けたいという要件に合いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/gettingstarted-limits.html",
  },
  {
    id: "basics-ch11-q03",
    domain: null,
    topic: "Lambda実行ロール",
    type: "single",
    difficulty: "medium",
    question:
      "開発者がAWS Lambda関数をデプロイしたところ、関数の処理自体は正常に完了しているにもかかわらず、実行ログがCloudWatch Logsにまったく出力されていません。最も可能性の高い原因はどれですか。",
    choices: [
      "関数の実行ロールにCloudWatch Logsへの書き込みを許可する権限が付与されていない",
      "関数のタイムアウト設定が短すぎて処理が打ち切られている",
      "CloudWatchエージェントが関数にインストールされていない",
      "LambdaはCloudWatch Logsへのログ出力に対応していないため、EC2へ移行する必要がある",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Lambda関数が他のAWSサービスへアクセスする権限は実行ロールで与えます。ログの記録も同様で、実行ロールにロググループの作成やログイベントの書き込みを許可する権限(AWSLambdaBasicExecutionRole相当)がなければ、関数は正常に動作してもログだけが記録されません。Bのタイムアウトで打ち切られた場合は実行がエラーになるため、正常に完了しているという状況と矛盾します。CのCloudWatchエージェントはEC2やオンプレミスのサーバーからメトリクスやログを送信するためのもので、Lambdaには不要です。Dは誤りで、Lambdaは実行ロールの権限さえあれば標準でCloudWatch Logsへログを出力します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-intro-execution-role.html",
  },
  {
    id: "basics-ch11-q04",
    domain: null,
    topic: "Amazon ECR",
    type: "single",
    difficulty: "easy",
    question:
      "ある開発チームがアプリケーションをDockerコンテナ化し、Amazon ECSへデプロイする準備をしています。ビルドしたコンテナイメージを保存・管理し、ECSのタスク起動時に取得できるようにするAWSサービスはどれですか。",
    choices: [
      "Amazon S3",
      "Amazon EBS",
      "AWS Fargate",
      "Amazon ECR",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Amazon ECRはコンテナイメージ専用のマネージドレジストリで、Dockerイメージをプッシュして保存・共有し、ECSやEKSのタスク起動時に取得させることができます。AのS3は汎用のオブジェクトストレージであり、タグ管理やECSとの標準連携といったコンテナレジストリの機能はありません。BのEBSはEC2インスタンスにアタッチするブロックストレージで、イメージの共有には使えません。CのFargateはコンテナを実行するサーバーレス基盤であり、イメージを保管する場所ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonECR/latest/userguide/what-is-ecr.html",
  },
  {
    id: "basics-ch11-q05",
    domain: null,
    topic: "Amazon EKS",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、オンプレミスでKubernetesを使ってコンテナを運用しており、既存のマニフェストや運用ノウハウを活かしたままAWSへ移行したいと考えています。コントロールプレーンの管理はAWSに任せたい場合、最も適切なサービスはどれですか。",
    choices: [
      "Amazon ECS",
      "Amazon EKS",
      "Amazon ECR",
      "AWS Lambda",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EKSはKubernetes互換のマネージドサービスで、コントロールプレーンの運用をAWSに任せながら、既存のマニフェストやツール、運用ノウハウをそのまま活かせます。AのECSはAWS独自方式のオーケストレーターで、シンプルで他のAWSサービスとの統合も容易ですが、Kubernetesの資産を直接は流用できません。CのECRはコンテナイメージを保存するレジストリで、コンテナの配置・管理は行いません。DのLambdaは関数単位のサーバーレス実行環境であり、Kubernetesワークロードの移行先としては適しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/what-is-eks.html",
  },
  {
    id: "basics-ch11-q06",
    domain: null,
    topic: "サーバーレス",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある新興企業が、新サービスのバックエンドをAWS LambdaとAWS Fargateを中心としたサーバーレス構成で構築することを検討しています。この方針で得られる利点として正しいものはどれですか。(2つ選択してください)",
    choices: [
      "ゲストOSのパッチ適用を自社で細かく制御できる",
      "実行時間やリソースを無制限に利用できる",
      "サーバーのプロビジョニングや容量管理が不要になる",
      "どのようなワークロードでもEC2より必ず安価になる",
      "需要の増減に応じて自動的にスケールする",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。サーバーレスではサーバーのプロビジョニング・パッチ適用・容量管理といった作業が不要になり、運用負荷が下がります。また、需要に応じて自動でスケールし、使った分だけの従量課金となります。Aは誤りで、実行基盤やOSの管理はAWS側が担うため、利用者が細かく制御することはできません。Bも誤りで、Lambdaには1回の実行が最大15分という上限などの制約があります。Dも誤りで、常時高負荷なワークロードではEC2やECS on EC2のほうがコスト効率がよい場合があります。",
    reference: "https://aws.amazon.com/jp/serverless/",
  },
  {
    id: "basics-ch12-q01",
    domain: null,
    topic: "EC2購入オプション",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が、新サービスの性能検証のためにEC2インスタンスを3週間だけ稼働させます。検証は途中で中断できず、終了後は環境を破棄する予定で、長期の利用コミットはできません。最も適切な購入オプションはどれですか。",
    choices: [
      "オンデマンドインスタンス",
      "リザーブドインスタンス",
      "スポットインスタンス",
      "Compute Savings Plans",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。オンデマンドインスタンスは初期費用や長期コミットなしに秒単位(または時間単位)の従量課金で利用でき、数週間だけの検証のような短期・不定期のワークロードに最適です。BのリザーブドインスタンスとDのCompute Savings Plansは、1年または3年の利用コミットと引き換えに割引を受ける仕組みで、3週間で終了する用途にはコミットが見合いません。Cのスポットインスタンスは大幅に安価ですが、AWS側の都合で中断される可能性があるため、中断できないという本要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-spot-instances.html",
  },
  {
    id: "basics-ch12-q02",
    domain: null,
    topic: "AWS Budgets",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業の経理部門は、AWSの月額利用料に予算額を設定し、実績または予測がそれを超えそうになったタイミングで担当者へメールで通知したいと考えています。最も適切なツールはどれですか。",
    choices: [
      "AWS Budgets",
      "AWS Pricing Calculator",
      "AWS Cost Explorer",
      "コスト配分タグ",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS Budgetsは予算額を設定し、実績や予測が予算を超過しそうになったときにアラートを通知できるツールで、「しきい値超過時の通知」という要件に合致します。BのPricing Calculatorは利用開始前に構成から月額料金を見積もるツールで、稼働中のコスト監視はできません。CのCost Explorerは過去のコストの可視化・分析が主目的であり、予算超過の通知はBudgetsの役割です。Dのコスト配分タグはコストを部門別・案件別に分類して集計するための仕組みで、通知機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/budgets-managing-costs.html",
  },
  {
    id: "basics-ch12-q03",
    domain: null,
    topic: "AWS Cost Explorer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業で先月からAWSの請求額が急増しました。管理者は、過去6か月のコストの推移をサービス別・タグ別にグラフで分析し、増加の要因となったサービスを特定したいと考えています。最も適切なツールはどれですか。",
    choices: [
      "AWS Pricing Calculator",
      "AWS Trusted Advisor",
      "AWS Budgets",
      "AWS Cost Explorer",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Cost Explorerは過去のコストと使用量をサービス別・タグ別などの軸でグラフ化して分析できるツールで、コスト増加の要因調査に最適です。将来のコスト予測の表示にも対応しています。AのPricing Calculatorは導入前の見積もり専用で、実績の分析はできません。BのTrusted Advisorは低使用率リソースの指摘などの推奨事項を提示しますが、コスト推移を軸を切り替えて分析する機能はありません。CのBudgetsは予算のしきい値監視と通知が主目的であり、詳細な内訳分析には向きません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/ce-what-is.html",
  },
  {
    id: "basics-ch12-q04",
    domain: null,
    topic: "サポートプラン",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業が初めての本番ワークロードをAWSで稼働させます。障害時には24時間365日、電話とチャットで技術サポートへ相談でき、本番システムのダウン時には1時間以内の応答目標が必要です。要件を満たす最も低コストのサポートプランはどれですか。",
    choices: [
      "デベロッパー",
      "ビジネス",
      "エンタープライズ",
      "ベーシック",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ビジネスプランは24時間365日の電話・チャット・メールによる技術サポートを提供し、本番システムのダウンには1時間以内の応答目標が設定されているため、要件を満たす最も低コストのプランです。Aのデベロッパーは営業時間内のメールによる技術サポートのみで、電話や24時間対応がありません。Cのエンタープライズは15分以内の応答目標や専任のTAMなどミッションクリティカル向けの内容で要件自体は満たしますが、コストが高く「最も低コスト」に反します。Dのベーシックは無料ですが、技術サポート自体が含まれません。",
    reference: "https://aws.amazon.com/jp/premiumsupport/plans/",
  },
  {
    id: "basics-ch12-q05",
    domain: null,
    topic: "AWS Trusted Advisor",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、アカウント内の「使用率が著しく低いEC2インスタンス」や「無制限に開放されたセキュリティグループ」などを自動でチェックし、コストとセキュリティの改善推奨を一覧で確認したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Trusted Advisor",
      "Amazon CloudWatch",
      "AWS CloudTrail",
      "AWS Pricing Calculator",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Trusted Advisorはコスト最適化・セキュリティ・耐障害性・パフォーマンス・サービスクォータなどの観点でアカウントを自動チェックし、低使用率のEC2インスタンスや開放されたセキュリティグループといった項目を推奨事項として提示します。BのCloudWatchはメトリクスやログによる稼働状況の監視が目的で、ベストプラクティスの診断は行いません。CのCloudTrailはAPI呼び出しの記録による操作の監査が目的です。DのPricing Calculatorは導入前の料金見積もりツールで、既存環境をチェックする機能はありません。",
    reference:
      "https://aws.amazon.com/jp/premiumsupport/technology/trusted-advisor/",
  },
  {
    id: "basics-ch12-q06",
    domain: null,
    topic: "Well-Architectedフレームワーク",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のアーキテクトが、AWS Well-Architectedフレームワークに基づいて新システムの設計レビューを行います。このフレームワークを構成する6本の柱に含まれるものはどれですか。(2つ選択してください)",
    choices: [
      "高可用性",
      "運用上の優秀性",
      "拡張性(スケーラビリティ)",
      "持続可能性",
      "俊敏性",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。Well-Architectedフレームワークの6本の柱は、運用上の優秀性・セキュリティ・信頼性・パフォーマンス効率・コスト最適化・持続可能性です。運用上の優秀性は運用の自動化や継続的改善を、持続可能性は環境への影響の最小化を扱います。Aの高可用性とCの拡張性は、信頼性やパフォーマンス効率の柱の中で扱われる設計特性であり、柱の名称ではありません。Eの俊敏性はクラウド利用の利点としてよく挙げられる概念ですが、これも柱には含まれません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/framework/welcome.html",
  },
];
