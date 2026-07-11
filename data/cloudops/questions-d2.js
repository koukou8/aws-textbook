// CloudOps教材 分野2(信頼性と事業の継続性)の確認問題
export const questions = [
  // ===== cloudops-d2-ch01: スケーラビリティと伸縮性の実装 =====
  {
    id: "cloudops-d2-ch01-q01",
    domain: 2,
    topic: "Auto Scaling",
    type: "single",
    difficulty: "medium",
    question:
      "Application Load Balancer(ALB)配下のAuto Scalingグループで、ヘルスチェックタイプにELBヘルスチェックを使用しています。アプリケーションの初期化には約5分かかります。スケールアウトのたびに、起動直後のインスタンスが異常と判定されて終了され、新しいインスタンスの起動と終了が繰り返されています。この問題を解決する最も適切な対応はどれですか。",
    choices: [
      "ターゲットグループの登録解除遅延を300秒より長く設定する",
      "Auto Scalingグループのヘルスチェックの猶予期間をアプリケーションの初期化時間より長く設定する",
      "スケーリングポリシーのクールダウン期間を延長する",
      "Auto ScalingグループのヘルスチェックタイプをEC2ステータスチェックのみに変更する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ヘルスチェックの猶予期間(HealthCheckGracePeriod)は、起動直後のインスタンスをヘルスチェックの判定対象から除外する時間です。初期化に約5分かかるアプリケーションで猶予期間が短いと、起動処理中のインスタンスが異常と判定され、終了と起動が繰り返されます。猶予期間を初期化時間より長く設定すれば解決します。Aの登録解除遅延はターゲットの切り離し時に処理中のリクエストを待つ設定で、起動時の判定とは無関係です。Cのクールダウンはスケーリング活動同士の間隔の設定です。Dはアプリケーション障害を検知して自動置換する機能を失うため、根本対応として不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html",
  },
  {
    id: "cloudops-d2-ch01-q02",
    domain: 2,
    topic: "Auto Scaling",
    type: "single",
    difficulty: "easy",
    question:
      "CloudOpsエンジニアが、Auto Scalingグループで稼働する数十台のEC2インスタンスに、セキュリティパッチを適用した新しいAMIを展開する必要があります。サービスを継続しながら、最小限の手作業で稼働中の全インスタンスを段階的に新しいAMIへ置き換える方法はどれですか。",
    choices: [
      "各インスタンスにログインしてパッチを適用し、1台ずつ再起動する",
      "新しいAuto Scalingグループを作成し、DNSレコードを新しい環境へ切り替える",
      "起動テンプレートの新しいバージョンで新AMIを指定し、インスタンスの更新(インスタンスリフレッシュ)を開始する",
      "起動テンプレートを更新した後、既存のインスタンスを手動で1台ずつ終了して自動的な置き換えを待つ",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。起動テンプレートは設定をバージョン管理でき、新AMIを指定した新しいバージョンを作成してインスタンスリフレッシュを実行すると、最小正常率を維持しながら稼働中のインスタンスが段階的に新しい設定へ自動で置き換えられ、手作業が最小になります。Aは台数分の手作業が発生するうえ、以後スケールアウトで起動するインスタンスには反映されません。Bは環境の二重管理とDNS切り替え作業が発生し、この要件には過剰です。Dも置き換え自体は起きますが、全台の終了操作と進行の監視を手動で行うことになり、最小限の手作業という要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/asg-instance-refresh.html",
  },
  {
    id: "cloudops-d2-ch01-q03",
    domain: 2,
    topic: "Auto Scaling",
    type: "single",
    difficulty: "medium",
    question:
      "あるECサイトはAuto Scalingグループで稼働しており、毎日ほぼ同じ時間帯に負荷が増加する周期的なパターンがありますが、ピークの規模は季節によって少しずつ変化します。インスタンスは起動から安定稼働まで約10分かかるため、ターゲット追跡スケーリングだけでは負荷の立ち上がりで応答遅延が発生しています。スケジュールを手動で見直し続けることなく、需要を先読みして事前にスケールアウトさせる最も適切な方法はどれですか。",
    choices: [
      "スケジュールされたアクションを作成し、毎日決まった時刻に希望キャパシティを引き上げる",
      "最小キャパシティをピーク時と同じ台数に固定する",
      "簡易スケーリングポリシーに変更してクールダウン期間を短縮する",
      "予測スケーリングポリシーを追加する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。予測スケーリングは過去のメトリクス履歴を機械学習で分析して需要を予測し、インスタンスの起動時間も見込んで事前にスケールアウトします。周期的だが規模が変化する負荷に、手動メンテナンスなしで追従できます。Aは時刻が固定の負荷には有効ですが、ピーク規模の変化に合わせて設定を手動で見直し続ける必要があり要件に反します。Bは要件を満たせてもオフピーク時間帯に過剰なキャパシティを維持することになり、コスト効率が悪化します。Cの簡易スケーリングは負荷を検知してから反応する方式のため、起動に10分かかるという根本の問題を解決できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html",
  },
  {
    id: "cloudops-d2-ch01-q04",
    domain: 2,
    topic: "Auto Scaling",
    type: "single",
    difficulty: "medium",
    question:
      "Auto Scalingグループでスケールアウトした直後のEC2インスタンスが、構成管理ツールによる設定投入が完了する前にリクエストを受信し、エラーを返すことがあります。CloudOpsエンジニアは、設定投入の完了を確認してからインスタンスをサービスインさせたいと考えています。最も適切な方法はどれですか。",
    choices: [
      "autoscaling:EC2_INSTANCE_LAUNCHINGのライフサイクルフックを設定し、設定投入の完了後にライフサイクルアクションを続行させる",
      "ヘルスチェックの猶予期間を設定投入にかかる時間より長く設定する",
      "デフォルトインスタンスウォームアップを設定投入にかかる時間に設定する",
      "autoscaling:EC2_INSTANCE_TERMINATINGのライフサイクルフックを設定して完了を待機させる",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。起動時のライフサイクルフックを設定すると、インスタンスはPending:Wait状態で一時停止し、その間に設定投入などのカスタム処理を実行できます。処理完了後にcomplete-lifecycle-actionを呼び出すことで、準備が整ってからサービスインさせられます。Bの猶予期間は起動直後のインスタンスを異常判定から除外するだけの設定で、サービスインのタイミング自体は制御できません。Cのウォームアップはスケーリング判断のメトリクス集計から除外する設定であり、リクエストの受信は止められません。Dは終了時のフックのため、起動時の制御には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/lifecycle-hooks.html",
  },
  {
    id: "cloudops-d2-ch01-q05",
    domain: 2,
    topic: "CloudFront",
    type: "multiple",
    difficulty: "medium",
    question:
      "Amazon CloudFrontの背後のApplication Load Balancer(ALB)をオリジンとするWebサイトで、オリジンの負荷が想定より高くなっています。調査の結果、キャッシュヒット率が低く、キャッシュ可能な静的コンテンツへのリクエストに多数の異なるクエリ文字列やCookieが付与されてキャッシュキーが分散していることが分かりました。キャッシュヒット率を高める対策はどれですか。(2つ選択してください)",
    choices: [
      "CloudFrontをAWS Global Acceleratorに置き換える",
      "キャッシュポリシーで、キャッシュキーに含めるクエリ文字列・ヘッダー・Cookieを配信に必要な最小限に絞る",
      "ALBのターゲットグループでスティッキーセッションを有効化する",
      "Cache-Controlヘッダーの見直しやデフォルトTTLの延長により、コンテンツのTTLを長くする",
      "S3 Transfer Accelerationを有効化する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。キャッシュキーに不要なクエリ文字列やCookieが含まれると、実体が同じコンテンツでも別オブジェクトとしてキャッシュされてヒット率が下がるため、キャッシュキーを必要最小限に絞ることが有効です。また、TTLを延長すればオブジェクトがエッジに保持される時間が延び、オリジンへの再取得が減ります。AのGlobal Acceleratorは通信経路を最適化するサービスでキャッシュ機能はなく、オリジンの負荷は減りません。Cのスティッキーセッションはターゲットへの振り分けを固定する機能で、ヒット率には影響しません。EはS3への転送を高速化する機能であり、この構成には無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/cache-hit-ratio.html",
  },
  {
    id: "cloudops-d2-ch01-q06",
    domain: 2,
    topic: "RDS",
    type: "single",
    difficulty: "medium",
    question:
      "Amazon RDS for MySQLの読み取り負荷を分散するため、リードレプリカを追加して参照系クエリをレプリカへ向けました。その後、利用者から「登録した直後のデータが一覧画面に表示されないことがあり、数秒後に再読み込みすると表示される」という報告がありました。原因の説明と運用対応として最も適切なものはどれですか。",
    choices: [
      "マルチAZ配置が無効になっていることが原因のため、マルチAZ配置へ変更する",
      "レプリカのストレージ容量が不足しているため、ストレージの自動スケーリングを有効化する",
      "リードレプリカは非同期レプリケーションのため遅延が発生する。ReplicaLagメトリクスを監視し、最新データが必須の読み取りはプライマリへ向ける",
      "クライアント側のDNSキャッシュが原因のため、レコードのTTLを短縮する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。RDSのリードレプリカへは非同期レプリケーションで更新が伝播するため、書き込み直後はレプリカ側に未反映のことがあります。CloudWatchのReplicaLagメトリクスで遅延を監視し、書き込み直後の読み取りなど最新性が必須の処理はプライマリへ向けるのが定石の運用です。AのマルチAZ配置は自動フェイルオーバーのための可用性機能で、通常時の読み取りには使われず遅延も解消しません。Bのストレージ不足は空き容量の問題であり、数秒遅れて反映されるという事象の説明になりません。DのDNSキャッシュは接続先解決の問題で、レプリケーションの遅延とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
  },
  {
    id: "cloudops-d2-ch01-q07",
    domain: 2,
    topic: "Aurora",
    type: "single",
    difficulty: "easy",
    question:
      "社内業務アプリケーションのデータベースにAmazon Aurora MySQLを使用しています。利用は営業時間帯に集中して夜間はほぼアイドル状態になり、月末の集計期間だけ負荷が通常の数倍になります。キャパシティ管理の運用負荷をかけずに、負荷の変動へ自動的に追従させる最も適切な構成はどれですか。",
    choices: [
      "ピーク負荷に合わせた大きなインスタンスクラスのプロビジョンドインスタンスに固定する",
      "Aurora Serverless v2へ移行し、負荷に応じてキャパシティを自動調整させる",
      "夜間と月末にインスタンスクラスを手動で変更する運用手順を整備する",
      "Auroraレプリカを増設し、リーダーエンドポイントで読み取りを分散する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Aurora Serverless v2は、負荷に応じてキャパシティ(ACU)を秒単位できめ細かく自動調整するため、時間帯や月末で負荷が大きく変動する断続的なワークロードに、キャパシティ管理の手間なく追従できます。Aはピークに合わせた常時プロビジョニングとなり、アイドル時間の多いこのワークロードではコスト効率が悪化します。Cはインスタンスクラス変更のたびに短時間の停止が発生するうえ、手動運用の負荷が増えるため要件に反します。Dのレプリカ増設は読み取りの分散にしかならず、書き込みを含む全体の負荷変動への自動追従は実現できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html",
  },
  {
    id: "cloudops-d2-ch01-q08",
    domain: 2,
    topic: "DynamoDB",
    type: "single",
    difficulty: "medium",
    question:
      "モバイルゲームのバックエンドで、Amazon DynamoDBテーブルへの読み取りが集中しています。読み取りは結果整合性で問題ありませんが、リーダーボード参照のレイテンシが要件を満たしておらず、マイクロ秒単位まで短縮する必要があります。アプリケーションの変更を最小限に抑えてこの要件を満たす方法はどれですか。",
    choices: [
      "プロビジョンドスループットの読み込みキャパシティユニット(RCU)を大幅に増やす",
      "テーブルをグローバルテーブルに変更して複数リージョンへ展開する",
      "Amazon ElastiCacheを導入し、アプリケーションにキャッシュの読み書きロジックを実装する",
      "DynamoDB Accelerator(DAX)クラスターを導入する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。DAXはDynamoDB専用のフルマネージドなインメモリキャッシュで、結果整合性のある読み取りをマイクロ秒単位に高速化できます。DynamoDBのAPIと互換性があるため、接続先をDAXクラスターへ向ける程度の最小限の変更で済みます。AのRCU増加はスロットリングの回避には有効ですが、応答時間はミリ秒単位のままでレイテンシ要件を満たせません。Bのグローバルテーブルはマルチリージョン展開のための機能で、単一リージョン内の読み取りの高速化にはなりません。CのElastiCacheでも高速化はできますが、キャッシュ制御ロジックの実装が必要になり、変更を最小限にという要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/DAX.html",
  },
  {
    id: "cloudops-d2-ch01-q09",
    domain: 2,
    topic: "DynamoDB",
    type: "multiple",
    difficulty: "medium",
    question:
      "プロビジョンドキャパシティモードのAmazon DynamoDBテーブルで、テレビCMの放映直後にアクセスが急増し、ProvisionedThroughputExceededExceptionが頻発しています。テーブルにはApplication Auto Scalingが設定されていますが、スパイクに追従できていません。スロットリングを解消する対応として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "オンデマンドキャパシティモードへ切り替える",
      "DynamoDB Accelerator(DAX)を導入して書き込みスループットを向上させる",
      "Auto Scalingの最大キャパシティの上限を実際のピークに合わせて引き上げる",
      "テーブルクラスをDynamoDB Standard-IAに変更する",
      "ポイントインタイムリカバリを有効化する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。オンデマンドモードは事前のキャパシティ設定なしでリクエスト量に応じて即座にスケールするため、予測困難な急激なスパイクに適しています。プロビジョンドモードを維持する場合は、Auto Scalingの最大キャパシティが実際のピークより低いとそこで頭打ちになるため、上限の引き上げが有効です。BのDAXは読み取りキャッシュであり、書き込みスループットの向上にはなりません。DのStandard-IAはアクセス頻度の低いテーブルのストレージコストを下げるテーブルクラスで、スループットとは無関係です。Eはバックアップのための機能であり、スロットリングの解消には寄与しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html",
  },
  // ===== cloudops-d2-ch02: 高可用性と耐障害性の実装 =====
  {
    id: "cloudops-d2-ch02-q01",
    domain: 2,
    topic: "ELB",
    type: "single",
    difficulty: "easy",
    question:
      "ある金融企業が、TCPベースの独自プロトコルで毎秒数十万リクエストを処理するサービスを、複数のアベイラビリティーゾーンのEC2インスタンスで提供します。接続元の取引先企業はファイアウォールで接続先IPアドレスを固定的に許可する運用のため、各AZで変化しない固定IPアドレスを提示する必要があります。最も適切なロードバランサーはどれですか。",
    choices: [
      "Application Load Balancer",
      "Network Load Balancer",
      "Gateway Load Balancer",
      "Amazon CloudFrontを前段に配置したApplication Load Balancer",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Network Load Balancer(NLB)はレイヤー4で動作し、超低レイテンシで大量のTCP接続を処理できます。さらにAZごとにElastic IPアドレスを割り当てられるため、接続先IPアドレスの固定を求められる要件を満たせます。AのALBはHTTP/HTTPS向けのレイヤー7ロードバランサーで、IPアドレスが固定されず、TCPの独自プロトコルにも対応できません。CのGWLBはファイアウォールなどのセキュリティアプライアンスへトラフィックを透過的に振り分けるための製品で、一般的なサービス公開には使いません。DのCloudFrontはHTTP/HTTPSのCDNであり、独自プロトコルの配信や固定IPの提示はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/network/introduction.html",
  },
  {
    id: "cloudops-d2-ch02-q02",
    domain: 2,
    topic: "ELB",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のセキュリティ要件により、VPCに出入りするすべてのトラフィックをサードパーティ製の仮想ファイアウォールアプライアンス群で検査する必要があります。CloudOpsエンジニアは、アプライアンスを複数のアベイラビリティーゾーンに配置してスケールさせながら、トラフィックを透過的にアプライアンスへ振り分ける構成を求められています。最も適切なサービスはどれですか。",
    choices: [
      "Network Load Balancer",
      "AWS Network Firewall",
      "Application Load Balancer",
      "Gateway Load Balancer",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Gateway Load Balancer(GWLB)はレイヤー3で動作し、ファイアウォールや侵入検知システムなどのサードパーティ製仮想アプライアンスへトラフィックを透過的に振り分けるための専用ロードバランサーです。アプライアンス群をヘルスチェック付きでスケールさせつつ、送信元・宛先を変えずに検査経路へ挿入できます。AのNLBはレイヤー4のロードバランサーですが、検査アプライアンスへの透過的な挿入を目的とした設計ではありません。BのNetwork FirewallはAWSのマネージドファイアウォールであり、サードパーティ製アプライアンスを使うという要件に合いません。CのALBはHTTP/HTTPSアプリケーション向けです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/gateway/introduction.html",
  },
  {
    id: "cloudops-d2-ch02-q03",
    domain: 2,
    topic: "ELB",
    type: "single",
    difficulty: "medium",
    question:
      "Application Load Balancer(ALB)配下のWebアプリケーションで、処理に約2分かかる月次レポートの生成リクエストだけがHTTP 504 Gateway Timeoutで失敗するという報告がありました。その他のページは正常に応答しており、ターゲットグループの全ターゲットはhealthyです。最も可能性が高い原因はどれですか。",
    choices: [
      "ターゲットグループに正常なターゲットが1つも登録されていない",
      "ターゲットのセキュリティグループがALBからの通信を拒否している",
      "クロスゾーン負荷分散が無効になっている",
      "レポート生成の処理時間がALBのアイドルタイムアウトを超えており、応答が返る前に接続が切断されている",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。HTTP 504は、ターゲットがALBのアイドルタイムアウト(デフォルト60秒)内に応答を返さない場合に発生します。約2分かかるレポート生成だけが失敗し、他のページやヘルスチェックは正常という状況は、処理時間のタイムアウト超過を示しています。アイドルタイムアウトの延長や処理の非同期化が対応策です。Aの正常なターゲットが存在しない場合はHTTP 503が返り、すべてのリクエストが失敗するはずです。Bのセキュリティグループの拒否があればヘルスチェックも失敗し、ターゲットはunhealthyになります。CのクロスゾーンはAZ間の振り分け方の設定で、特定機能のタイムアウトとは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html",
  },
  {
    id: "cloudops-d2-ch02-q04",
    domain: 2,
    topic: "ELB",
    type: "multiple",
    difficulty: "hard",
    question:
      "夜間バッチで負荷が高まる時間帯に、Application Load Balancer(ALB)のターゲットグループで複数のターゲットが断続的にunhealthyと判定されて切り離され、数分後にhealthyへ復帰する事象が繰り返されています。アプリケーションのプロセスは稼働し続けており、高負荷によりヘルスチェックへの応答が遅くなっていることが分かっています。事象を緩和するヘルスチェック設定の調整として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "ヘルスチェックのタイムアウト値を延長する",
      "ヘルスチェックの実行間隔を短縮する",
      "ヘルスチェックの成功コードに302を追加する",
      "非正常のしきい値(UnhealthyThresholdCount)を引き上げる",
      "ターゲットグループの登録解除遅延を延長する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。高負荷時に応答がヘルスチェックのタイムアウトを超えることが原因のため、タイムアウト値を延長して応答の遅れを許容し、さらに非正常のしきい値を引き上げて一時的な失敗だけでは切り離されないようにするのが、設定面での適切な緩和策です。Bの間隔短縮は失敗の検出をより頻繁にするだけで、切り離しをむしろ加速させます。Cの成功コード302はリダイレクト応答を成功と扱うための設定で、応答遅延が原因の本事象とは無関係です。Eの登録解除遅延は切り離し時に処理中のリクエストの完了を待つ設定であり、unhealthy判定の発生自体は防げません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/target-group-health-checks.html",
  },
  {
    id: "cloudops-d2-ch02-q05",
    domain: 2,
    topic: "Route 53",
    type: "single",
    difficulty: "medium",
    question:
      "Amazon Route 53のフェイルオーバールーティングで、プライマリをApplication Load Balancer(ALB)へのエイリアスレコード、セカンダリを別リージョンの静的サイトとして構成します。プライマリの健全性を判定するにあたり、追加のヘルスチェック料金をかけず、運用負荷も最小にしたいという要件があります。最も適切な方法はどれですか。",
    choices: [
      "ALBのDNS名を監視するHTTPSエンドポイントのヘルスチェックを作成してプライマリレコードに関連付ける",
      "複数のヘルスチェック結果を組み合わせた計算されたヘルスチェックを構成する",
      "プライマリのエイリアスレコードで「ターゲットのヘルスの評価(Evaluate Target Health)」を有効化する",
      "ALBのメトリクスを監視するCloudWatchアラームを作成し、アラーム状態を監視するヘルスチェックを構成する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ELBなどのAWSリソースを指すエイリアスレコードでは、「ターゲットのヘルスの評価」を有効化するだけで、リソースのヘルス状態をDNS応答へ反映できます。ヘルスチェックリソースを別途作成する必要がなく追加料金も発生しないため、運用負荷と費用を最小にできます。AとDでも判定自体は可能ですが、ヘルスチェックやアラームの作成・保守という追加の運用と料金が発生し、要件に反します。Bの計算されたヘルスチェックは複数のヘルスチェック結果をAND/OR条件で集約するためのもので、単一のALBを監視する本要件には過剰な構成です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/dns-failover-configuring.html",
  },
  {
    id: "cloudops-d2-ch02-q06",
    domain: 2,
    topic: "ELB",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、Application Load Balancer(ALB)の背後に新しいターゲットグループを作成し、ポート8080で稼働するWebアプリケーションのEC2インスタンスを登録しました。しかし、すべてのターゲットがunhealthyと判定され、ALBはHTTP 503を返しています。踏み台サーバーからインスタンスのポート8080へ直接アクセスすると正常に応答し、ヘルスチェックのパスと成功コードの設定にも誤りはありません。最も可能性が高い原因はどれですか。",
    choices: [
      "ターゲットのセキュリティグループが、ALBのセキュリティグループからのポート8080へのインバウンド通信を許可していない",
      "ターゲットグループの登録解除遅延が短すぎるため、登録した直後にターゲットが切り離されている",
      "ALBのアイドルタイムアウトが短すぎるため、ヘルスチェックの接続が確立する前に切断されている",
      "クロスゾーン負荷分散が無効になっているため、ALBのノードから別のAZのターゲットへ到達できない",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。インスタンスへ直接アクセスすると正常に応答するのにELB経由のヘルスチェックだけが失敗する場合、典型的な原因はセキュリティグループの設定です。ターゲットのセキュリティグループで、ALBのセキュリティグループを送信元とするヘルスチェックポートへのインバウンドを許可する必要があります。Bの登録解除遅延は切り離し時に処理中のリクエストの完了を待つ設定で、健全性の判定とは無関係です。Cのアイドルタイムアウトはクライアント接続の維持時間の設定で、ヘルスチェックには専用のタイムアウト設定が別にあります。Dのクロスゾーン負荷分散はリクエストの分散方法の設定であり、全ターゲットが異常と判定される原因にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/target-group-health-checks.html",
  },
  {
    id: "cloudops-d2-ch02-q07",
    domain: 2,
    topic: "Route 53",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、VPCのプライベートサブネットで稼働するEC2インスタンス群の社内APIを、Amazon Route 53プライベートホストゾーンのフェイルオーバールーティングで待機系へ切り替えられるようにします。エンドポイントにはインターネットから到達できません。プライマリの健全性を判定する方法として最も適切なものはどれですか。",
    choices: [
      "プライベートIPアドレスを指定したエンドポイント監視のHTTPヘルスチェックを作成し、プライマリレコードに関連付ける",
      "複数のパブリックエンドポイント監視を集約する計算されたヘルスチェックを作成し、プライマリレコードに関連付ける",
      "対象リソースのメトリクスを監視するCloudWatchアラームを作成し、そのアラーム状態を監視するヘルスチェックをプライマリレコードに関連付ける",
      "プライマリレコードをエイリアスレコードへ変更し、ターゲットのヘルスの評価(Evaluate Target Health)を有効化する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Route 53のヘルスチェッカーはインターネット上に配置されており、VPC内のプライベートIPアドレスへは到達できません。この場合は、対象リソースのメトリクスを監視するCloudWatchアラームを作成し、そのアラームの状態を監視するタイプのヘルスチェックを構成するのが定石です。Aはヘルスチェッカーがプライベートアドレスへ到達できないため機能しません。Bの計算されたヘルスチェックは複数のヘルスチェック結果を集約する仕組みにすぎず、到達性の問題は解決できません。Dのターゲットのヘルスの評価はELBなどエイリアス対象のAWSリソースを指す場合に使える機能で、EC2インスタンスのIPアドレスを指すレコードには適用できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/health-checks-types.html",
  },
  {
    id: "cloudops-d2-ch02-q08",
    domain: 2,
    topic: "マルチAZ",
    type: "multiple",
    difficulty: "hard",
    question:
      "あるWebサービスは、ALBの背後で2つのアベイラビリティーゾーン(AZ)にEC2インスタンスを分散して稼働しています。先日の単一AZ障害でサービス全体が停止し、調査により、NATゲートウェイが障害AZにのみ配置され全プライベートサブネットがそれを経由していたため正常なAZのインスタンスも外部API呼び出しに失敗したこと、およびデータベースが障害AZ内のシングルAZ構成のAmazon RDSだったことが判明しました。AZ障害への耐性を高める対応はどれですか。(2つ選択してください)",
    choices: [
      "ALBのスティッキーセッションを有効化し、同一ターゲットへの接続を維持する",
      "NATゲートウェイを各AZに配置し、AZごとのルートテーブルで同じAZのNATゲートウェイへルーティングする",
      "障害が発生したAZ内のEC2インスタンス台数を増やしてキャパシティを確保する",
      "クロスゾーン負荷分散を無効化してAZをまたぐトラフィックを削減する",
      "RDSをマルチAZ配置へ変更し、別AZのスタンバイへの自動フェイルオーバーを構成する",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。NATゲートウェイはAZ単位のリソースであるため、各AZに配置し、AZごとのルートテーブルで同じAZのNATゲートウェイを経由させることで、単一AZの障害が他のAZの通信へ波及しなくなります。また、シングルAZ構成のRDSはそのAZの障害で停止するため、マルチAZ配置へ変更して別AZのスタンバイへ自動フェイルオーバーさせることが有効です。Aのスティッキーセッションは振り分けを固定する機能で、AZ障害対策にはなりません。Cは同一AZ内の増強にすぎず、AZ全体の障害には無力です。Dのクロスゾーン負荷分散の無効化は正常なAZのターゲットを活用しにくくする変更で、耐障害性は向上しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html",
  },
  {
    id: "cloudops-d2-ch02-q09",
    domain: 2,
    topic: "RDS",
    type: "single",
    difficulty: "medium",
    question:
      "マルチAZ配置のAmazon RDS for PostgreSQLでフェイルオーバーが発生しました。RDSのイベントを確認するとフェイルオーバー自体は約2分で完了していますが、Javaで実装されたアプリケーションはその後も30分以上接続エラーを出し続け、アプリケーションサーバーを再起動するまで復旧しませんでした。同様の事象の再発を防ぐ対応として最も適切なものはどれですか。",
    choices: [
      "アプリケーション側のDNSキャッシュのTTLを短く設定し、接続失敗時に再接続する処理を実装する",
      "DBエンドポイントの代わりにプライマリインスタンスのIPアドレスを接続文字列へ設定する",
      "リードレプリカを追加し、フェイルオーバー中の書き込みをレプリカへ振り分ける",
      "DBインスタンスクラスを上位へ変更してフェイルオーバーの完了時間を短縮する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。マルチAZのフェイルオーバーでは、DBエンドポイントのDNSレコードが新しいプライマリを指すよう自動更新されます。JVMは既定でDNSの解決結果を長時間キャッシュするため、更新後も旧プライマリのIPアドレスへ接続し続けたことが原因です。DNSキャッシュのTTLを短くし、接続失敗時の再接続を実装すれば、フェイルオーバー後に速やかに新しい接続先へ切り替わります。BのIPアドレスの直接指定は、DNSの更新で接続先を切り替えるマルチAZの仕組みと相容れず、状況を悪化させます。Cのリードレプリカは読み取り専用であり、書き込みの継続には使えません。Dはフェイルオーバー自体が約2分で完了しているため、原因への対処になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html",
  },
  // ===== cloudops-d2-ch03: バックアップと復元戦略 =====
  {
    id: "cloudops-d2-ch03-q01",
    domain: 2,
    topic: "AWS Backup",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、Amazon EBS、Amazon RDS、Amazon EFS、Amazon DynamoDBのバックアップをサービスごとに個別のスクリプトや設定で取得しており、保持期間の設定漏れが監査で指摘されました。CloudOpsエンジニアは、これらのバックアップを単一のポリシーで一元管理し、今後追加されるリソースにも自動的に適用される仕組みを最小の運用負荷で構築する必要があります。最も適切な方法はどれですか。",
    choices: [
      "Amazon EventBridgeとAWS Lambdaで各サービスのバックアップAPIを定期実行する共通スクリプトを開発する",
      "Amazon Data Lifecycle Managerでライフサイクルポリシーを作成し、全サービスのバックアップを管理する",
      "AWS Backupでバックアッププランを作成し、タグベースのリソース割り当てで対象リソースを自動選択する",
      "各サービスの自動バックアップ機能を個別に有効化し、保持期間の設定手順書を整備して運用する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Backupは、EBS、RDS、EFS、DynamoDBなど複数サービスのバックアップを、バックアッププランという単一のポリシーで一元管理できるサービスです。スケジュールと保持期間をプランに定義し、タグベースのリソース割り当てを使えば、所定のタグを付けた新しいリソースにも自動的に適用され、運用負荷を最小にできます。Aは共通スクリプトの開発と保守という運用負荷が残り続けます。BのData Lifecycle ManagerはEBSスナップショットとEBS-backed AMIの世代管理に特化しており、RDSやDynamoDBは扱えません。Dはサービスごとの個別管理が続くため、設定漏れという課題を解決できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/whatisbackup.html",
  },
  {
    id: "cloudops-d2-ch03-q02",
    domain: 2,
    topic: "AWS Backup",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はランサムウェア対策として、AWS Backupで取得したバックアップを、保持期間が満了するまでは管理者権限を持つユーザーを含む誰も削除できないようにすることを求めています。この要件を満たす最も適切な方法はどれですか。",
    choices: [
      "バックアップボールトのアクセスポリシーで復旧ポイントの削除操作を拒否する",
      "バックアップボールトにAWS Backup Vault Lockを設定し、保持期間中の削除を不可能にする",
      "復旧ポイントの暗号化に使用するAWS KMSキーを定期的にローテーションする",
      "バックアップを手動スナップショットとして保管し、削除を禁止する社内運用ルールを定める",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Backup Vault Lockをバックアップボールトに設定すると、保持期間中の復旧ポイントの削除や保持設定の短縮が、管理者やルートユーザーを含めて実行できなくなり(WORM)、ランサムウェアや内部不正からバックアップを保護できます。Aのアクセスポリシーによる拒否は多層防御として有効ですが、ポリシー自体を変更できる管理者には効果がなく、要件を満たしません。CのKMSキーのローテーションは暗号化キーの運用であり、削除操作の防止とは無関係です。Dの運用ルールには技術的な強制力がなく、管理者権限を奪った攻撃者や内部不正を止められません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/vault-lock.html",
  },
  {
    id: "cloudops-d2-ch03-q03",
    domain: 2,
    topic: "AWS Backup",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業はAWS Backupのバックアッププランで、東京リージョンのリソースを日次でバックアップしています。新しい事業継続要件として、リージョン規模の障害に備えてバックアップの複製を大阪リージョンにも保管することが求められました。最小の運用負荷でこの要件を満たす方法はどれですか。",
    choices: [
      "大阪リージョンにも同じ内容のバックアッププランを作成し、両リージョンで個別にバックアップを取得する",
      "復旧ポイントをS3バケットへエクスポートし、クロスリージョンレプリケーション(CRR)で大阪リージョンへ複製する",
      "Amazon EventBridgeとAWS Lambdaで復旧ポイントを大阪リージョンへコピーする処理を実装する",
      "既存のバックアッププランに、大阪リージョンのバックアップボールトを宛先とするクロスリージョンコピーを追加する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS Backupのバックアッププランにはコピーアクションを追加でき、別リージョンのバックアップボールトを宛先に指定すると、取得した復旧ポイントが自動的に大阪リージョンへコピーされます。既存プランへの設定追加だけで実現でき、運用負荷が最小です。Aのバックアッププランは作成したリージョン内のリソースを保護する仕組みのため、大阪側にプランを作成しても東京のリソースのバックアップは取得できません。Bの復旧ポイントはユーザーが管理するS3バケットのオブジェクトではないため、S3のレプリケーションでは複製できません。Cは自作処理の開発と保守が発生し、最小の運用負荷という要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/cross-region-backup.html",
  },
  {
    id: "cloudops-d2-ch03-q04",
    domain: 2,
    topic: "EBS",
    type: "single",
    difficulty: "medium",
    question:
      "CloudOpsエンジニアが、EBSスナップショットから新しいボリュームを作成してデータベースサーバーを復旧させる訓練を実施したところ、復元直後の数時間はディスク読み取りのレイテンシが高く、性能要件を満たせないことが分かりました。実際の障害時には、復元したボリュームが作成直後からフルパフォーマンスで動作する必要があります。最も適切な対応はどれですか。",
    choices: [
      "復元に使用するスナップショットで高速スナップショット復元(FSR)を有効化する",
      "ボリュームタイプをgp3からプロビジョンドIOPS SSD(io2)へ変更する",
      "スナップショットの取得間隔を短くして毎回の増分を小さく保つ",
      "復元先のボリュームサイズを元のボリュームより大きく指定する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。スナップショットから作成したボリュームは、各ブロックが初回アクセス時にAmazon S3から遅延読み込みされるため、復元直後は一時的にレイテンシが増加します。高速スナップショット復元(FSR)を有効化しておくと、そのスナップショットから作成したボリュームは作成時点で完全に初期化された状態になり、直後からフルパフォーマンスで利用できます。Bのボリュームタイプの変更は定常状態のIOPS性能を高める手段で、初回読み込みによる遅延自体は解消しません。Cの取得間隔の短縮はRPOの改善にはつながりますが、復元後の読み込み性能とは無関係です。Dのサイズの拡大も遅延読み込みの挙動を変えるものではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-fast-snapshot-restore.html",
  },
  {
    id: "cloudops-d2-ch03-q05",
    domain: 2,
    topic: "EBS",
    type: "single",
    difficulty: "easy",
    question:
      "ある部門では、数百台のEC2インスタンスにアタッチされたEBSボリュームについて、12時間ごとにスナップショットを取得し、最新の14世代のみを保持して古いものを自動削除する運用が求められています。バックアップの対象はEBSスナップショットのみです。最小のセットアップでこれを自動化する方法はどれですか。",
    choices: [
      "Amazon EventBridgeスケジュールとAWS LambdaでCreateSnapshot APIを定期実行し、古い世代を削除する処理を実装する",
      "運用サーバーを構築し、AWS CLIのスナップショット取得スクリプトをcronで定期実行する",
      "Amazon Data Lifecycle Manager(DLM)で、対象ボリュームのタグを指定したライフサイクルポリシーを作成する",
      "AWS Configルールでスナップショットの世代数を監視し、超過を検知したら手動で削除する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Data Lifecycle Manager(DLM)は、対象のEBSボリュームをタグで指定し、12時間ごとに取得して14世代保持といったライフサイクルポリシーを定義するだけで、スナップショットの取得と保持数を超えた分の削除を自動化できます。EBSスナップショットの世代管理に特化しており、追加の実装なしで要件を満たせます。AとBはスケジュール実行・世代管理・エラー処理のロジックを自作して保守し続ける必要があり、最小のセットアップという要件に反します。DのAWS Configはリソース構成の記録と評価のためのサービスで、取得の自動化はできず、削除も手動のまま残ります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/snapshot-lifecycle.html",
  },
  {
    id: "cloudops-d2-ch03-q06",
    domain: 2,
    topic: "RDS",
    type: "single",
    difficulty: "medium",
    question:
      "Amazon RDS for MySQL(自動バックアップ有効、保持期間7日)を利用しているシステムで、本日14時5分に誤ったUPDATE文を実行し、テーブルの大部分を不正な値で更新してしまいました。データ損失を最小限に抑えて誤操作の直前の状態へ復旧する手順として、最も適切なものはどれですか。",
    choices: [
      "直近の日次スナップショットから新しいDBインスタンスへ復元し、当日の更新分は手作業で再入力する",
      "ポイントインタイムリカバリで14時4分を指定して新しいDBインスタンスへ復元し、アプリケーションの接続先を切り替える",
      "マルチAZ配置のスタンバイへ手動でフェイルオーバーし、誤操作前のデータへ戻す",
      "リードレプリカをスタンドアロンのDBインスタンスへ昇格させ、誤操作前のデータへ戻す",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。自動バックアップが有効な場合、日次スナップショットに加えてトランザクションログが5分ごとに保存されるため、保持期間内の任意の時点へ復元するポイントインタイムリカバリ(PITR)が可能で、14時4分を指定すれば誤操作の直前まで戻せます。復元は既存インスタンスの巻き戻しではなく新しいDBインスタンスとして作成されるため、接続先の切り替えまでが復旧手順に含まれます。Aは最大で丸1日分の更新を失うため、損失を最小にする要件に反します。Cのスタンバイには同期レプリケーションで誤った更新も反映済みのため、フェイルオーバーしても戻せません。Dのリードレプリカにも誤更新は伝播しており、昇格してもデータは戻りません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIT.html",
  },
  {
    id: "cloudops-d2-ch03-q07",
    domain: 2,
    topic: "S3",
    type: "single",
    difficulty: "easy",
    question:
      "バージョニングが有効なAmazon S3バケットで、利用者がバージョンIDを指定せずに重要なオブジェクトを誤って削除してしまい、CloudOpsエンジニアが復旧を依頼されました。このオブジェクトを最も簡単に元の状態へ戻す方法はどれですか。",
    choices: [
      "S3インベントリのレポートを取得し、削除されたオブジェクトを再作成する",
      "バケットのバージョニングを一時停止してから再度有効化する",
      "AWS Backupの復旧ポイントからバケット全体を以前の状態へ復元する",
      "最新バージョンとして置かれている削除マーカーを削除する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。バージョニングが有効なバケットでバージョンIDを指定せずに削除すると、実データは削除されず、削除マーカーが最新バージョンとして追加されるだけです。この削除マーカーを削除すれば直前のバージョンが再び最新になり、オブジェクトは元どおりアクセスできます。AのS3インベントリはオブジェクトの一覧レポートを出力する機能で、データ本体の復元はできません。Bのバージョニングの停止と再有効化を行っても、既存バージョンや削除マーカーの状態は変わりません。CはAWS Backupの事前設定が前提となるうえ、単一オブジェクトの誤削除への対応としては過剰で、最も簡単な方法とはいえません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Versioning.html",
  },
  {
    id: "cloudops-d2-ch03-q08",
    domain: 2,
    topic: "S3",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業はコンプライアンス要件により、東京リージョンのS3バケットに保存済みのオブジェクトと今後追加されるオブジェクトのすべてを、大阪リージョンのバケットへ複製する必要があります。クロスリージョンレプリケーション(CRR)を構成するにあたり必要な作業はどれですか。(2つ選択してください)",
    choices: [
      "送信先バケットでS3 Transfer Accelerationを有効化する",
      "送信元と送信先のバケットを同一のAWSアカウントへ統合する",
      "送信元と送信先の両方のバケットでバージョニングを有効化する",
      "送信元バケットでMFA Deleteを有効化する",
      "既存のオブジェクトに対してS3バッチレプリケーションを実行する",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。S3レプリケーションを構成するには、送信元と送信先の両方のバケットでバージョニングが有効になっていることが前提条件です。また、レプリケーションルールが複製するのは設定以降に追加・更新されたオブジェクトのみのため、保存済みの既存オブジェクトを複製するにはS3バッチレプリケーションの実行が必要です。AのTransfer Accelerationはクライアントからの転送を高速化する機能で、レプリケーションの要件ではありません。Bは不要で、レプリケーションは異なるアカウントのバケット間でも構成できます。DのMFA Deleteは削除操作の保護を強化する任意の機能であり、複製の前提条件とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication.html",
  },
  {
    id: "cloudops-d2-ch03-q09",
    domain: 2,
    topic: "DR戦略",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業の基幹システムについて、経営層がDR要件としてRTO 30分・RPO 5分を定めました。システムは現在単一リージョンで稼働しており、DRリージョンの平常時コストを可能な限り抑えることも同時に求められています。この要件を満たす最も適切なDR戦略はどれですか。",
    choices: [
      "バックアップ&リストア: 日次バックアップをDRリージョンへコピーし、被災時に環境全体を新規作成する",
      "パイロットライト: データを継続的にDRリージョンへレプリケートし、データベースなどのコア要素のみ稼働させ、被災時にアプリケーション層を起動する",
      "ウォームスタンバイ: 縮小規模のフル機能システムをDRリージョンで常時稼働させ、被災時にスケールアウトする",
      "マルチサイトアクティブ/アクティブ: 両リージョンで同規模の本番システムを稼働させ、同時にトラフィックを処理する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。パイロットライトはデータを継続的にDRリージョンへレプリケートするためRPOを数分以内に抑えられ、被災時はアプリケーション層の起動とスケールアウトにより数十分程度で復旧できるため、RTO 30分・RPO 5分を満たせます。要件を満たす戦略のうち平常時コストが最小である点が決め手です。Aはリソースを復旧時に新規作成するためRTOが時間単位になり、日次バックアップではRPOも最大24時間となって要件を満たしません。CとDも要件自体は満たしますが、縮小構成や同規模の本番環境を常時稼働させる分だけ平常時コストが高く、コストを抑える要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
  },
];
