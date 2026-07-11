// CloudOps問題集 分野5(ネットワークとコンテンツ配信)後半 qb-d5-019〜qb-d5-036
export const questions = [
  {
    id: "qb-d5-019",
    domain: 5,
    topic: "Route 53ルーティングポリシー",
    type: "single",
    difficulty: "medium",
    question:
      "あるグローバルSaaS企業は、バージニア北部リージョンと東京リージョンにそれぞれALB配下の同一構成のWebアプリケーションを展開しています。世界中のユーザーを、ネットワーク遅延が最も小さいリージョンへ自動的に誘導し、リージョン障害時には正常なリージョンだけが応答されるようにする必要があります。最も適切なAmazon Route 53の構成はどれですか。",
    choices: [
      "レイテンシーベースルーティングポリシーで2つのレコードを作成し、それぞれにヘルスチェックを関連付ける",
      "位置情報ルーティングポリシーで大陸ごとにリージョンを割り当てる",
      "加重ルーティングポリシーで両リージョンに同じ重みを設定する",
      "複数値回答ルーティングポリシーで両リージョンのIPアドレスを返す",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。レイテンシーベースルーティングは、ユーザーからの測定レイテンシーが最小のリージョンのレコードを返すため、「最も遅延が小さいリージョンへ誘導」という要件に直接合致します。ヘルスチェックを関連付ければ、異常なリージョンは応答から除外されます。Bの位置情報ルーティングはユーザーの地理的な場所で機械的に振り分ける機能で、地理的に近くてもネットワーク的に最速とは限らず、要件の意図と異なります。Cの加重ルーティングは指定比率での分配であり、遅延は考慮されません。Dの複数値回答は正常なレコードを複数返すだけで、どれを使うかはクライアント任せとなり、遅延最小の誘導はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/routing-policy.html",
  },
  {
    id: "qb-d5-020",
    domain: 5,
    topic: "Route 53ルーティングポリシー",
    type: "single",
    difficulty: "medium",
    question:
      "ある動画配信企業は、コンテンツのライセンス契約により、日本のユーザーには日本向けカタログを提供する国内のエンドポイントへ、米国のユーザーには米国向けカタログのエンドポイントへ、必ずユーザーの国に基づいてアクセスさせる義務があります。その他の国のユーザーはデフォルトのエンドポイントへ誘導します。最も適切なAmazon Route 53のルーティングポリシーはどれですか。",
    choices: [
      "レイテンシーベースルーティングポリシー",
      "加重ルーティングポリシー",
      "位置情報ルーティングポリシー",
      "複数値回答ルーティングポリシー",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。位置情報ルーティングポリシーは、DNSクエリの発信元の国や地域に基づいて返すレコードを切り替えられ、デフォルトレコードで未定義の地域にも対応できます。ライセンスや規制のように「ユーザーの所在国で確実に出し分ける」要件の定番です。Aのレイテンシーベースルーティングは遅延最小のリージョンを返すため、国境と一致する保証がなく、契約義務の実装には不適切です。Bの加重ルーティングは比率での分配であり、ユーザーの場所は考慮されません。Dの複数値回答は正常なレコードを複数返す方式で、国ごとの出し分けはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/routing-policy.html",
  },
  {
    id: "qb-d5-021",
    domain: 5,
    topic: "Route 53フェイルオーバー",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業は、プライマリサイト(EC2のElastic IPを指すAレコード、TTL 86400秒)とセカンダリサイト(S3の静的サイト)でRoute 53のフェイルオーバールーティングを構成し、ヘルスチェックも作成しました。先日プライマリサイトが停止した際、DNSはプライマリのIPアドレスを返し続け、手動で復旧するまでセカンダリへ切り替わりませんでした。また、切り替え後も一部のユーザーは長時間プライマリへアクセスし続けました。原因として考えられるものはどれですか。(2つ選択してください)",
    choices: [
      "セカンダリレコードにヘルスチェックが関連付けられていない",
      "作成したヘルスチェックがプライマリのフェイルオーバーレコードに関連付けられておらず、Route 53が障害を検知しても応答を切り替えられない",
      "フェイルオーバールーティングはエイリアスレコードでのみ使用できる",
      "ヘルスチェックの失敗しきい値が既定の3回に設定されている",
      "レコードのTTLが長すぎるため、リゾルバーやクライアントが古いDNS応答をキャッシュし続けている",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。フェイルオーバールーティングは、プライマリレコードに関連付けたヘルスチェックの結果に基づいて応答を切り替えます。ヘルスチェックを作成しただけでレコードに関連付けていなければ、障害時も切り替えは発生しません。また、TTLが86400秒(24時間)と長いと、切り替え後も各地のリゾルバーやクライアントがキャッシュした古いIPを使い続けるため、フェイルオーバー用レコードのTTLは60秒程度の短い値にするのが定石です。Aのセカンダリへのヘルスチェックは必須ではなく、切り替わらなかった原因になりません。Cのフェイルオーバーはエイリアス以外のレコードでも使用できます。Dの失敗しきい値3回は正常な既定値で、切り替え不能の説明にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/dns-failover.html",
  },
  {
    id: "qb-d5-022",
    domain: 5,
    topic: "Route 53 Resolver",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のVPC内のEC2インスタンスは、Site-to-Site VPNで接続されたオンプレミスのDNSサーバーが管理する社内ドメイン(corp.example.local)の名前解決を行う必要があります。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "corp.example.localと同名のプライベートホストゾーンを作成し、レコードを手動で複製する",
      "Route 53 Resolverインバウンドエンドポイントを作成し、インスタンスのDNS参照先をそのIPアドレスに変更する",
      "各インスタンスのOSのDNS設定をオンプレミスのDNSサーバーへ直接向ける",
      "Route 53 Resolverアウトバウンドエンドポイントを作成し、corp.example.local宛てのクエリをオンプレミスDNSサーバーへ転送するルールをVPCに関連付ける",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。アウトバウンドエンドポイントは、VPC内のRoute 53 Resolverが受けたクエリのうち、転送ルールに一致するドメイン(corp.example.local)だけをオンプレミスのDNSサーバーへ転送する仕組みで、要件どおりの構成を追加の保守なしで実現できます。Aのレコードの手動複製は変更のたびに同期作業が必要で、不整合のリスクも高くなります。Bのインバウンドエンドポイントはオンプレミス側からVPCのResolverへクエリを送るための逆方向の入口です。CのOS設定の直接変更は、AWSサービスのエンドポイントやVPC内部の名前解決が既定のResolverで行えなくなる副作用があり、インスタンスごとの設定管理も煩雑です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resolver.html",
  },
  {
    id: "qb-d5-023",
    domain: 5,
    topic: "Resolverクエリログ",
    type: "single",
    difficulty: "medium",
    question:
      "セキュリティ監査により、ある企業はVPC内のリソースが「どのドメイン名を名前解決したか」を、クエリ元インスタンスの情報とあわせて記録し、調査に使用できるようにすることを求められました。最も適切な方法はどれですか。",
    choices: [
      "VPCフローログを有効化してCloudWatch Logsで分析する",
      "Route 53 Resolverクエリログを設定し、CloudWatch LogsまたはS3へ送信する",
      "AWS CloudTrailの証跡を作成してDNSクエリを記録する",
      "パブリックホストゾーンのDNSクエリログを有効化する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Route 53 Resolverクエリログは、VPC内のリソースが行ったDNSクエリについて、問い合わせたドメイン名、レコードタイプ、応答、クエリ元インスタンスIDや送信元IPなどを記録し、CloudWatch Logs、S3、Amazon Data Firehoseへ送信できます。監査要件に直接対応します。AのVPCフローログはIPアドレスやポートなどのメタデータのみで、ドメイン名は記録されず、Amazon提供DNSへのクエリ自体が記録対象外です。CのCloudTrailはAWS APIの呼び出し履歴であり、DNSクエリは記録しません。Dのパブリックホストゾーンのクエリログは、自社が公開するゾーンへ外部から届いたクエリの記録であり、VPC内リソースの名前解決の記録ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resolver-query-logs.html",
  },
  {
    id: "qb-d5-024",
    domain: 5,
    topic: "Route 53エイリアスレコード",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は、ドメインのZone Apex(example.com)へのアクセスをApplication Load Balancer(ALB)に向ける必要があります。ALBのIPアドレスは固定されていません。Amazon Route 53で最も適切な設定はどれですか。",
    choices: [
      "ALBのDNS名をターゲットとするエイリアスAレコードをexample.comに作成する",
      "ALBのDNS名を値とするCNAMEレコードをexample.comに作成する",
      "ALBの現在のIPアドレスを値とするAレコードをexample.comに作成する",
      "example.comのNSレコードをALBのDNS名に変更する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。DNSの仕様上、Zone ApexにはCNAMEレコードを作成できませんが、Route 53のエイリアスレコードはApexでもALBなどのAWSリソースを指すことができ、ターゲットのIPアドレス変化にも自動追従します。エイリアスクエリへの応答は無料である点も利点です。BのCNAMEはApex(example.com自体)には設定できず、SOAやNSレコードと共存できないため作成がエラーになります。CのALBのIPアドレスは固定ではなく随時変わるため、静的なAレコードでは接続不能になります。DのNSレコードはゾーンの権威DNSサーバーを委任するためのもので、トラフィックをALBへ向ける用途には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html",
  },
  {
    id: "qb-d5-025",
    domain: 5,
    topic: "CloudFrontキャッシュ戦略",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のWebアプリケーションは、CSSやJavaScriptなどの静的アセットをAmazon CloudFrontで配信しています。毎日のリリースのたびに全パス(/*)のキャッシュ無効化を実行しており、無効化の料金と反映までのタイムラグ、新旧ファイルが混在して表示が崩れる問題に悩んでいます。リリース運用を改善する方法として最も適切なものはどれですか。",
    choices: [
      "すべてのビヘイビアのTTLを0秒に設定してキャッシュを実質無効にする",
      "無効化の実行をリリースのたびに複数回に分けて実施する",
      "オリジンのレスポンスにCache-Control: no-storeヘッダーを付与する",
      "ビルドごとにファイル名へバージョン識別子(ハッシュ)を付与し、HTMLから新しいファイル名を参照して長いTTLでキャッシュする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。ファイル名にバージョン識別子を含めると、リリースごとに新しいURLのオブジェクトとして配信されるため、無効化を実行しなくても即座に新バージョンが反映されます。旧ファイルも残るためHTMLと参照アセットの整合性が保たれ、長いTTLで高いキャッシュヒット率も維持できます。AのTTL 0秒は毎回オリジンへ問い合わせが発生し、オリジン負荷とレイテンシーが増加してCDNの利点を失います。Bの無効化を分割しても料金・タイムラグ・混在の問題は本質的に解決しません。Cのno-storeはキャッシュ自体を禁止するため、Aと同様にオリジン負荷が増大し、改善と逆行します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/UpdatingExistingObjects.html",
  },
  {
    id: "qb-d5-026",
    domain: 5,
    topic: "CloudFrontオリジンフェイルオーバー",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、Amazon S3バケットをオリジンとするCloudFrontディストリビューションで重要な静的コンテンツを配信しています。オリジン側の障害でHTTP 5xxエラーが返された場合でも配信を継続できるよう、可用性を高める必要があります。最小の運用負荷で実現できる構成はどれですか。",
    choices: [
      "Route 53のフェイルオーバールーティングで2つのCloudFrontディストリビューションを切り替える",
      "別リージョンにレプリケートしたセカンダリS3バケットを用意し、CloudFrontのオリジングループでフェイルオーバー条件(5xxエラー等)を設定する",
      "Lambda@Edge関数を実装し、オリジンエラー時に別バケットへのリトライ処理を行う",
      "キャッシュのTTLを最大値に設定してオリジンへのアクセスをなくす",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudFrontのオリジングループはプライマリとセカンダリの2つのオリジンを設定し、指定したステータスコード(5xx等)や接続失敗の際に自動でセカンダリへフェイルオーバーします。クロスリージョンレプリケーションしたS3バケットと組み合わせれば、追加コードなしで配信の可用性を高められます。AのDNSによる切り替えはヘルスチェックの検知とTTLの伝播に時間がかかり、ディストリビューションの二重管理も必要です。CのLambda@Edgeによる自作リトライは実装・テスト・保守の負荷が高く、標準機能で足りる場面では不適切です。DのTTLを延ばしてもキャッシュミスや失効時のオリジンアクセスは必ず発生するため、障害対策になりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html",
  },
  {
    id: "qb-d5-027",
    domain: 5,
    topic: "CloudFront署名付きURL",
    type: "single",
    difficulty: "medium",
    question:
      "あるオンライン教育企業は、有料会員向けの動画ファイルをAmazon S3オリジン+CloudFront(オリジンアクセスコントロール設定済み)で配信しています。認証済みの会員だけが動画をダウンロードでき、発行したリンクは24時間で無効になるようにする必要があります。CloudFrontのエッジ配信による低レイテンシーは維持します。最も適切な方法はどれですか。",
    choices: [
      "S3の署名付きURLを生成して会員に直接配布する",
      "CloudFrontの地理的制限で会員の居住国のみ許可する",
      "信頼されたキーグループをディストリビューションに設定し、アプリケーションから有効期限付きのCloudFront署名付きURLを発行する",
      "AWS WAFのIPセットに会員のIPアドレスを登録して許可する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。CloudFrontの署名付きURL(または署名付きCookie)は、信頼されたキーグループの秘密鍵で署名した有効期限付きのアクセス権をコンテンツ単位で発行でき、期限を24時間に設定すれば要件をそのまま満たします。オリジンアクセスコントロールと組み合わせることで、S3への直接アクセスも防げます。AのS3署名付きURLでもアクセス制御自体は可能ですが、CloudFrontを迂回してS3へ直接アクセスさせる形となり、エッジキャッシュによる低レイテンシー配信の要件を満たしません。Bの地理的制限は国単位の制御であり、会員かどうかの判定はできません。DのIPアドレスによる許可は、会員のIPが変動するため管理が破綻し、認可の仕組みとしても不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html",
  },
  {
    id: "qb-d5-028",
    domain: 5,
    topic: "CloudFront地理的制限",
    type: "single",
    difficulty: "easy",
    question:
      "ある放送事業者は、ライセンス契約により、CloudFrontで配信する動画コンテンツへのアクセスを日本国内からのみに制限する必要があります。最小の運用負荷で実現できる方法はどれですか。",
    choices: [
      "CloudFrontの地理的制限(geo restriction)で日本のみを許可リストに設定する",
      "Route 53の位置情報ルーティングで日本以外のクエリには応答しないようにする",
      "オリジンのセキュリティグループで海外のIPアドレス範囲を拒否する",
      "AWS WAFのレートベースルールで海外からのリクエストを制限する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。CloudFrontの地理的制限は、ビューワーの国を判定してディストリビューション全体へのアクセスを許可リストまたは拒否リストで制御する組み込み機能で、設定するだけで日本以外からのリクエストに403を返せます。BのDNSで応答を制御しても、名前解決済みのクライアントやIP直接指定のアクセスは防げず、確実な制限になりません。Cのセキュリティグループには拒否ルールがなく、そもそもビューワーが接続するのはCloudFrontのエッジであり、オリジン側の制御では配信自体を止められません。Dのレートベースルールはリクエスト頻度に基づく制御であり、国単位の制限とは目的が異なります(WAFで行うなら地理的一致ルールを使いますが、単純な国別制限には地理的制限で十分です)。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/georestrictions.html",
  },
  {
    id: "qb-d5-029",
    domain: 5,
    topic: "CloudFrontトラブルシューティング",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、ALBをオリジンとするCloudFront経由でWebアプリケーションを提供しています。帳票生成APIなど処理に時間のかかる一部のリクエストだけがCloudFrontからHTTP 504エラーで返されます。ALBへ直接アクセスすると同じリクエストは時間はかかるものの正常に完了します。CloudFront側の対処として最も適切なものはどれですか。",
    choices: [
      "対象パスのキャッシュTTLを延長してオリジンへのリクエストを減らす",
      "ビューワープロトコルポリシーをHTTPSのみに変更する",
      "オリジンのキープアライブタイムアウトを短縮する",
      "対象オリジンのレスポンスタイムアウト(応答待ち時間)を処理時間より長い値に引き上げる",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。CloudFrontはオリジンからの応答を一定時間(オリジンレスポンスタイムアウト)まで待ち、超過すると504 Gateway Timeoutを返します。オリジン直アクセスでは完了する長時間処理だけが失敗する症状は、この待ち時間の超過が典型的な原因であり、タイムアウト値を処理時間より長く設定することで解消できます(あわせて処理の非同期化も中長期的な改善策です)。Aの帳票生成のような動的リクエストはキャッシュの対象にしにくく、TTLの延長は504の解決になりません。Bのビューワープロトコルポリシーはクライアントとエッジ間の通信方式の設定で、オリジンの応答待ちとは無関係です。Cのキープアライブタイムアウトの短縮は接続の再利用を減らすだけで、むしろ悪影響です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html",
  },
  {
    id: "qb-d5-030",
    domain: 5,
    topic: "ELBアクセスログ",
    type: "single",
    difficulty: "medium",
    question:
      "利用者からWebアプリケーションの応答が遅いと報告があり、CloudOpsエンジニアがApplication Load Balancer(ALB)のアクセスログを分析したところ、遅いリクエストのエントリはelb_status_codeが200で、request_processing_timeが0.001秒、target_processing_timeが8.5秒、response_processing_timeが0.002秒でした。この記録から導かれる結論として最も適切なものはどれですか。",
    choices: [
      "クライアントとALBの間のネットワーク遅延が原因である",
      "ターゲットのアプリケーションの処理に時間がかかっており、バックエンド側の調査が必要である",
      "ALB自体が過負荷でリクエストの転送に遅延が発生している",
      "ターゲットからの応答をクライアントへ返す処理に時間がかかっている",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。target_processing_timeは、ALBがターゲットへリクエストを送信してからターゲットが応答ヘッダーを返し始めるまでの時間で、8.5秒という値はバックエンドのアプリケーション処理(またはその先のDB等)が遅いことを直接示します。アプリケーションやデータベースの性能調査に進むのが適切です。Aのクライアント側やALB受信側の遅延であればrequest_processing_timeに現れますが、0.001秒と正常です。CのALBの転送遅延も同様にrequest_processing_timeなどに反映されるうえ、ALBは負荷に応じて自動スケールするマネージドサービスです。Dの応答返送の遅延はresponse_processing_timeに現れますが、0.002秒と問題ありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-access-logs.html",
  },
  {
    id: "qb-d5-031",
    domain: 5,
    topic: "AWS WAF",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のインターネット公開WebアプリケーションはALBの背後で稼働しています。セキュリティ診断でSQLインジェクションへの脆弱性が指摘され、さらに特定の単一IPアドレスからの大量のスクレイピングリクエストによる負荷も問題になっています。これらに対処する方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "ネットワークACLでSQLインジェクション文字列を含むパケットを拒否するルールを追加する",
      "AWS WAFのWeb ACLをALBに関連付け、SQLデータベース用のマネージドルールグループを追加する",
      "AWS Shield Standardを有効化してアプリケーション層の攻撃を防御する",
      "Web ACLにレートベースルールを作成し、同一IPアドレスからのしきい値を超えるリクエストを自動的にブロックする",
      "ALBのセキュリティグループのインバウンドルールをポート443のみに限定する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。AWS WAFのSQLデータベース用マネージドルールグループは、リクエストに含まれるSQLインジェクションのパターンを検査してブロックします。また、レートベースルールは送信元IPアドレスごとのリクエスト数を追跡し、しきい値を超えたIPを自動的に一時ブロックできるため、単一IPからのスクレイピング対策として有効です。AのネットワークACLはIPアドレスやポートなどレイヤー3/4の情報で判定する機能で、HTTPリクエストの中身は検査できません。BのShield StandardはネットワークレイヤーのDDoS緩和が対象で、SQLインジェクション等のアプリケーション層攻撃は防げず、有効化の操作も不要(自動適用)です。Eのポート限定は既に公開しているWebサービスの通信内容の検査にはならず、どちらの問題も解決しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/aws-managed-rule-groups.html",
  },
  {
    id: "qb-d5-032",
    domain: 5,
    topic: "AWS Shield",
    type: "single",
    difficulty: "easy",
    question:
      "ある金融サービス企業は、CloudFrontとALBで公開しているサービスへの大規模なDDoS攻撃に備え、攻撃発生時にAWSのDDoS対応の専門チームによる支援を受けられること、およびDDoS起因のリソーススケーリングによる利用料金の急増に対する保護を求めています。最も適切な対応はどれですか。",
    choices: [
      "AWS Shield Standardを有効化する",
      "AWS WAFのマネージドルールグループをWeb ACLに追加する",
      "AWS Shield Advancedのサブスクリプションを契約し、CloudFrontとALBを保護対象に登録する",
      "Amazon GuardDutyを有効化してDDoS攻撃を検出する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Shield Advancedは、DDoS対応の専門チーム(Shield Response Team)への24時間365日のエスカレーション、DDoS起因のスケーリング費用の払い戻し(コスト保護)、高度な検知・緩和機能などを提供する有料サブスクリプションで、要件の2点に直接対応します。AのShield StandardはすべてのAWS利用者にネットワーク層のDDoS緩和を無料・自動で提供しますが、専門チームの支援やコスト保護は含まれません(有効化の操作も不要です)。BのWAFマネージドルールはWebアプリケーション層の攻撃対策であり、専門チームやコスト保護の要件は満たせません。DのGuardDutyは脅威の検出サービスであり、DDoSの緩和や費用保護の機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/ddos-overview.html",
  },
  {
    id: "qb-d5-033",
    domain: 5,
    topic: "AWS Network Firewall",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のコンプライアンス要件により、VPC内のワークロードから外部へのすべてのアウトバウンド通信を、承認済みドメイン(FQDN)の許可リストに一致するものだけに制限し、通信の検査ログを残す必要があります。DNSでの名前解決の制御だけでは、IPアドレスを直接指定した通信を防げないことが課題です。最も適切なソリューションはどれですか。",
    choices: [
      "検査用サブネットにAWS Network Firewallをデプロイし、許可ドメインリストのステートフルルールでアウトバウンド通信をフィルタリングする",
      "Route 53 Resolver DNS Firewallで許可ドメイン以外の名前解決をブロックする",
      "セキュリティグループのアウトバウンドルールで承認済みドメインのみを許可する",
      "AWS WAFのWeb ACLで許可リスト以外へのリクエストをブロックする",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS Network Firewallは、VPCの経路上に配置してトラフィック自体を検査するマネージドファイアウォールで、TLSのSNIやHTTPホストヘッダーに基づくドメイン許可リストのステートフルルールにより、アウトバウンド通信を承認済みFQDNのみに制限し、ログも記録できます。名前解決を経ないIP直接指定の通信も実際のパケットを検査するため防げます。BのDNS Firewallは名前解決の段階の制御であり、問題文が指摘するとおりIP直接指定の通信は通過してしまいます。Cのセキュリティグループのルールで指定できるのはCIDRやプレフィックスリスト等であり、ドメイン名は指定できません。DのWAFは自社のWebアプリケーションへのインバウンドリクエストを検査するサービスで、アウトバウンド制御には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/network-firewall/latest/developerguide/what-is-aws-network-firewall.html",
  },
  {
    id: "qb-d5-034",
    domain: 5,
    topic: "CloudFrontとGlobal Acceleratorの使い分け",
    type: "single",
    difficulty: "easy",
    question:
      "あるグローバルなニュースメディア企業は、世界中の読者へ画像・動画・記事ページ(HTTPS)を配信しています。読者の近くでコンテンツをキャッシュしてページ表示を高速化し、オリジンサーバーへのリクエスト数も削減したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Global Acceleratorでトラフィックを最寄りのリージョンへルーティングする",
      "Amazon CloudFrontディストリビューションを作成してエッジロケーションでコンテンツをキャッシュする",
      "Amazon Route 53のレイテンシーベースルーティングで最寄りのオリジンへ誘導する",
      "Amazon ElastiCacheをWebサーバーの前段に配置してコンテンツをキャッシュする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。CloudFrontは世界中のエッジロケーションでHTTP/HTTPSコンテンツをキャッシュするCDNであり、読者に近い場所からの配信による高速化と、キャッシュヒットによるオリジン負荷の削減という2つの要件を同時に満たします。AのGlobal AcceleratorはエニーキャストIPとAWSグローバルネットワークで経路を最適化するサービスですが、キャッシュ機能を持たないため、オリジンへのリクエスト削減という要件を満たせません(キャッシュ不可のTCP/UDP通信や固定IP要件の際に選びます)。CのDNSによる誘導は経路の選択のみで、コンテンツのキャッシュは行われません。DのElastiCacheはリージョン内でアプリケーションが利用するインメモリキャッシュであり、エッジでのコンテンツ配信には使えません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
  },
  {
    id: "qb-d5-035",
    domain: 5,
    topic: "ハイブリッド接続トラブルシューティング",
    type: "multiple",
    difficulty: "hard",
    question:
      "オンプレミスの業務システムから、Site-to-Site VPN経由でVPC内のEC2インスタンス上のAPI(TCPポート8443)へ接続できないという報告がありました。VPNトンネルは両方ともUPで、他のオンプレミスシステムからVPC内の別サーバーへの通信は正常です。構成にロードバランサーは含まれません。AWS側で通信がどこで遮断されているかを特定するための調査方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "対象インスタンスのENIのVPCフローログを確認し、オンプレミスの送信元IPからのポート8443のトラフィックが到達しているか、ACCEPTとREJECTのどちらで記録されているかを調べる",
      "AWS CloudTrailのイベント履歴で該当時間帯のネットワーク通信の記録を検索する",
      "VPC Reachability Analyzerで仮想プライベートゲートウェイから対象インスタンスへのパスをポート8443で分析し、ブロックしているコンポーネントを特定する",
      "ALBのアクセスログを有効化してリクエストの到達状況を確認する",
      "Route 53 Resolverクエリログでルートテーブルの設定ミスを確認する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。VPCフローログを確認すれば、トラフィックがENIまで到達しているか、セキュリティグループまたはネットワークACLでREJECTされているか、そもそもレコードがなく経路の問題かを切り分けられます。また、VPC Reachability Analyzerは仮想プライベートゲートウェイを送信元として指定でき、実トラフィックなしで経路上のルートテーブル・セキュリティグループ・ネットワークACLのどこがブロックしているかを特定できます。BのCloudTrailはAWS APIの呼び出し履歴であり、ネットワーク通信の内容は記録されません。Dは構成にロードバランサーが含まれないため対象のログが存在しません。EのResolverクエリログはDNSクエリの記録であり、ルートテーブルの設定を確認する手段ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/reachability/what-is-reachability-analyzer.html",
  },
  {
    id: "qb-d5-036",
    domain: 5,
    topic: "ネットワークACL",
    type: "single",
    difficulty: "medium",
    question:
      "パブリックサブネットで公開しているWebサーバーに対し、特定の単一IPアドレスから悪意のあるアクセスが継続しています。Webサーバーのセキュリティグループは、サービスの性質上0.0.0.0/0からのポート443を許可する必要があります。サブネットにはカスタムネットワークACLがあり、ルール番号100でポート443のインバウンドを許可しています。他の利用者に影響を与えずにこのIPアドレスからのアクセスを遮断する方法はどれですか。",
    choices: [
      "セキュリティグループに該当IPアドレスからの通信を拒否するインバウンドルールを追加する",
      "ネットワークACLに該当IPアドレスを拒否するインバウンドルールをルール番号200で追加する",
      "ネットワークACLのアウトバウンドルールに該当IPアドレス宛ての拒否ルールを追加する",
      "ネットワークACLに該当IPアドレスを拒否するインバウンドルールを、ルール番号100より小さい番号で追加する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。ネットワークACLはルール番号の小さい順に評価され、最初に一致したルールで許可・拒否が確定します。拒否ルールを既存の許可ルール(番号100)より小さい番号(例: 50)で追加すれば、該当IPからの通信だけが先に拒否され、他の利用者は引き続き番号100の許可ルールで接続できます。Aのセキュリティグループには許可ルールしか設定できず、拒否ルールという概念がありません。Bの番号200では、先に評価される番号100の許可ルール(0.0.0.0/0にはこのIPも含まれる)に一致してしまい、拒否ルールは評価されません。Cのアウトバウンドルールは応答方向の制御であり、攻撃元からのインバウンド接続の遮断としては方向が誤っています。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-network-acls.html",
  },
];
