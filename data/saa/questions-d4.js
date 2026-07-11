// SAA-C03 分野4「コストを最適化したアーキテクチャの設計」の確認問題
export const questions = [
  // ===== saa-d4-ch01: コンピューティングのコスト最適化 =====
  {
    id: "saa-d4-ch01-q01",
    domain: 4,
    topic: "スポットインスタンス",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、夜間に実行される画像変換のバッチ処理をAmazon EC2で実行しています。処理は途中で中断されても、後で再実行すれば問題ありません。このワークロードを最もコスト効率良く実行できる購入オプションはどれですか。",
    choices: [
      "オンデマンドインスタンス",
      "スポットインスタンス",
      "スタンダードリザーブドインスタンス(3年・全額前払い)",
      "Dedicated Hosts",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。スポットインスタンスはEC2の未使用キャパシティを利用する購入オプションで、オンデマンド比で最大90%の割引が適用されます。中断される可能性がありますが、このワークロードは中断・再実行を許容できるため最適です。Aのオンデマンドは柔軟ですが割引がなく最安ではありません。Cのリザーブドインスタンスは定常稼働向けのコミットであり、夜間のみのバッチでは未使用時間が無駄になるうえ、スポットほど安くなりません。DのDedicated Hostsは物理サーバーを専有する最も高価なオプションで、コスト削減とは逆行します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-spot-instances.html",
  },
  {
    id: "saa-d4-ch01-q02",
    domain: 4,
    topic: "Savings Plans",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、今後3年間コンピューティングを継続的に使用する予定ですが、期間中にEC2のインスタンスファミリーの変更、別リージョンへの移動、さらにAWS FargateやAWS Lambdaへの移行も検討しています。この柔軟性を維持したまま、利用額のコミットによる割引を受けられる購入オプションはどれですか。",
    choices: [
      "Compute Savings Plans",
      "EC2 Instance Savings Plans",
      "スタンダードリザーブドインスタンス",
      "スポットインスタンス",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Compute Savings Plansは1時間あたりの利用額(USD)をコミットする割引モデルで、インスタンスファミリー・サイズ・リージョン・OSを問わずEC2に適用され、FargateとLambdaの使用量にも適用されます。BのEC2 Instance Savings Plansは割引率は高いものの、特定リージョンの特定インスタンスファミリーに限定され、FargateやLambdaには適用されません。Cのスタンダードリザーブドインスタンスはファミリー変更(交換)ができず、FargateやLambdaも対象外です。Dのスポットインスタンスは中断の可能性がある割引オプションで、継続利用のコミットによる割引とは仕組みが異なります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/savingsplans/latest/userguide/what-is-savings-plans.html",
  },
  {
    id: "saa-d4-ch01-q03",
    domain: 4,
    topic: "EC2購入オプション",
    type: "single",
    difficulty: "medium",
    question:
      "あるECサイトはAmazon EC2上で稼働しており、平常時はほぼ一定の負荷が継続する一方、セール期間には数日間だけトラフィックが数倍になります。可用性を維持しながら最もコスト効率の良い構成はどれですか。",
    choices: [
      "すべてのインスタンスをピーク時の台数に合わせてオンデマンドで常時実行する",
      "すべてのインスタンスをスポットインスタンスに置き換えて実行する",
      "ベースライン分をSavings Plansでカバーし、ピーク時はAuto Scalingでオンデマンドインスタンスを追加する",
      "ピーク時の負荷に合わせた台数のスタンダードリザーブドインスタンスを常時稼働させる",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。常時稼働するベースライン部分には1年または3年のコミットで割引を受けられるSavings Plans(またはリザーブドインスタンス)を適用し、セール期間の一時的なピークにはAuto Scalingで必要な間だけオンデマンドを追加するのが定石です。Aは割引が一切適用されないうえ、平常時に過剰な台数を維持して無駄が生じます。Bは最も安く見えますが、スポットは中断される可能性があり、ECサイトの本番サーバーすべてに使うと可用性の要件を満たせない罠選択肢です。Dはピークに合わせたコミットを常時支払うため、平常時の余剰分が大きな無駄になります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/instance-purchasing-options.html",
  },
  {
    id: "saa-d4-ch01-q04",
    domain: 4,
    topic: "スポットインスタンス",
    type: "single",
    difficulty: "easy",
    question:
      "Amazon EC2スポットインスタンスに関する説明として正しいものはどれですか。",
    choices: [
      "一度起動すると、ユーザーが停止するまで中断されることはない",
      "定常稼働が必要なリレーショナルデータベースサーバーに最も適している",
      "利用にあたって1年または3年の利用期間のコミットが必要である",
      "EC2側がキャパシティを必要とすると、2分前の通知の後に中断されることがある",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。スポットインスタンスはAWSの未使用キャパシティを大幅な割引で利用する仕組みのため、EC2がキャパシティを回収する際には中断されます。中断の2分前に中断通知が発行されるので、アプリケーションはチェックポイントの保存などの後処理を行えます。Aは誤りで、中断の可能性が常にあります。Bも誤りで、中断を許容できないデータベースにはオンデマンドとリザーブドインスタンスやSavings Plansの組み合わせが適します。Cも誤りで、スポットに期間のコミットはありません。コミットが必要なのはリザーブドインスタンスやSavings Plansです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/spot-interruptions.html",
  },
  {
    id: "saa-d4-ch01-q05",
    domain: 4,
    topic: "EC2コスト最適化",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業の開発・テスト用Amazon EC2インスタンス群は平日の日中しか使用されていませんが、24時間365日稼働しており、CPU使用率も常に10%未満です。コストを削減する方法として適切なものはどれですか。(2つ選択してください)",
    choices: [
      "営業時間外にインスタンスを自動的に停止し、営業開始前に起動するスケジュールを構成する",
      "すべてのインスタンスでEC2詳細モニタリングを有効化して使用状況を1分間隔で記録する",
      "インスタンスを複数のアベイラビリティーゾーンに追加配置して冗長化する",
      "AWS Compute Optimizerの推奨に基づいて過剰なサイズのインスタンスをダウンサイジングする",
      "3年・全額前払いのスタンダードリザーブドインスタンスをすべてのインスタンスに購入する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。EC2は停止中であればインスタンスの実行料金が発生しないため、使用しない夜間・週末に停止することで大幅に削減できます。また、CPU使用率が常に低いのは過剰プロビジョニングのサインであり、Compute Optimizerの推奨に基づくダウンサイジングが有効です。Bの詳細モニタリングはメトリクス間隔を短縮する有料オプションで、コストはむしろ増えます。CのマルチAZ化は可用性の施策で、台数が増えればコストも増加します。Eのリザーブドインスタンスは常時稼働を前提とした割引であり、まず稼働時間とサイズを適正化すべきこの状況で3年のコミットを行うのは不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/Stop_Start.html",
  },
  {
    id: "saa-d4-ch01-q06",
    domain: 4,
    topic: "Compute Optimizer",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のソリューションアーキテクトは、数百台のEC2インスタンスについてCPUやメモリの使用履歴を機械学習で分析し、過剰プロビジョニングされたインスタンスに対する具体的なインスタンスタイプ変更の推奨を得たいと考えています。どのサービスを使用すべきですか。",
    choices: [
      "AWS CloudTrail",
      "AWS Compute Optimizer",
      "Amazon Inspector",
      "AWS Cost and Usage Report",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Compute OptimizerはCloudWatchメトリクスの使用履歴を機械学習で分析し、EC2インスタンス、Auto Scalingグループ、EBSボリューム、Lambda関数などに対して具体的な最適化推奨(ダウンサイジングや別ファミリーへの変更)を提示します。メモリ使用率を分析対象に含めるにはCloudWatchエージェントの導入が必要です。AのCloudTrailはAPI呼び出しの証跡を記録する監査サービスです。CのInspectorは脆弱性を管理するセキュリティサービスで、サイジングの推奨は行いません。DのCost and Usage Reportは最も詳細な課金データを提供しますが、使用率分析に基づくインスタンスタイプの推奨機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/compute-optimizer/latest/ug/what-is-compute-optimizer.html",
  },
  {
    id: "saa-d4-ch01-q07",
    domain: 4,
    topic: "AWS Lambda",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、S3バケットにファイルがアップロードされたときだけ、数秒間で完了するデータ変換処理を実行する必要があります。アップロードは1日に数十回程度で不定期です。最もコスト効率の良い実行方法はどれですか。",
    choices: [
      "常時稼働するAmazon EC2オンデマンドインスタンスで処理を実行する",
      "リザーブドインスタンスを適用したAmazon EC2インスタンスで処理を実行する",
      "S3イベント通知でAWS Lambda関数を起動して処理を実行する",
      "Amazon EKSクラスターを常時稼働させて処理を実行する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Lambdaはリクエスト数と実行時間(メモリ×秒)に対してのみ課金され、アイドル時間にはコストが発生しません。1日数十回・数秒間という断続的で短時間の処理には、S3イベント通知でLambdaを起動するイベント駆動構成が最もコスト効率に優れます。AとBの常時稼働EC2は、処理していない大半の時間にも料金が発生するため不経済です。Bのリザーブドインスタンスは割引こそありますが、アイドルが大半のワークロードでは支払い自体が無駄になります。DのEKSはクラスターやノードの料金が常時発生し、この規模の断続処理には過剰です。",
    reference: "https://aws.amazon.com/jp/lambda/pricing/",
  },
  {
    id: "saa-d4-ch01-q08",
    domain: 4,
    topic: "AWS Fargate",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業は、1日に数回不定期に実行されるコンテナ化されたジョブをAmazon ECSで実行しています。1回のジョブは10〜30分で完了し、実行されていない時間帯が大半です。運用負荷を増やさずに最もコスト効率良く実行する方法はどれですか。",
    choices: [
      "Fargate起動タイプでタスクを実行し、タスク実行中のみ料金を支払う",
      "EC2起動タイプで専用のコンテナインスタンスを常時稼働させて実行する",
      "EC2起動タイプのコンテナインスタンスに3年のリザーブドインスタンスを適用する",
      "ジョブをAmazon EC2 Dedicated Hostsへ移行して実行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS Fargateはタスクに割り当てたvCPUとメモリに対してタスク実行中のみ秒単位で課金されるため、実行されない時間が大半のジョブではアイドルコストが発生せず、コンテナインスタンスの管理も不要です。BとCのEC2起動タイプはコンテナインスタンスが稼働している間ずっと料金が発生します。Cのようにリザーブドインスタンスの割引を適用しても、アイドル時間に支払い続けること自体は変わらないため、このアクセスパターンではFargateより割高です。DのDedicated Hostsは物理ホストを専有する最も高価なオプションで、コスト削減の目的に反します。",
    reference: "https://aws.amazon.com/jp/fargate/pricing/",
  },
  {
    id: "saa-d4-ch01-q09",
    domain: 4,
    topic: "Auto Scaling",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業の社内Webアプリケーションは、Auto Scalingグループ内のEC2インスタンスで稼働しています。利用は平日の9時から18時に集中し、その時間帯の負荷はほぼ一定で予測可能です。夜間と週末はほとんど利用されません。最もコスト効率の良いスケーリング戦略はどれですか。",
    choices: [
      "ピーク時に必要な台数のインスタンスを24時間365日維持する",
      "CPU使用率のアラームを監視し、負荷が上がったら運用担当者が手動でインスタンスを追加する",
      "夜間も台数は維持したまま、各インスタンスをより大きいサイズへ変更する",
      "スケジュールに基づくスケーリングで、営業時間に合わせて台数を自動的に増減させる",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。負荷の変動パターンが時間帯で明確に予測できる場合は、スケジュールに基づくスケーリングで営業開始前に台数を増やし、営業終了後に最小台数へ縮小するのが最も確実で無駄のない方法です。Aはピークに合わせた台数をほぼ無人の夜間・週末にも維持するため、大きな無駄が生じます。Bの手動対応は運用負荷が高く、対応の遅れや戻し忘れのリスクもあります。Cは台数を減らさないためコスト削減にならないうえ、インスタンスサイズの拡大はむしろコストを増加させます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html",
  },
  {
    id: "saa-d4-ch01-q10",
    domain: 4,
    topic: "リザーブドインスタンス",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、EC2インスタンスを今後3年間継続して使用することを決定していますが、期間中にワークロードの特性が変わり、インスタンスファミリーを変更する可能性があります。EC2の利用に対する割引を受けつつ、この要件を満たすリザーブドインスタンスの購入方法はどれですか。",
    choices: [
      "スタンダードリザーブドインスタンス",
      "コンバーティブルリザーブドインスタンス",
      "スポットインスタンス",
      "オンデマンドキャパシティ予約",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。コンバーティブルリザーブドインスタンスは、期間中に同等以上の価値を持つ別の構成へ交換でき、インスタンスファミリー・OS・テナンシーなどの属性を変更できます。割引率はスタンダードよりやや低いものの、構成変更の可能性がある長期コミットに適しています。Aのスタンダードリザーブドインスタンスは割引率こそ最大ですが、ファミリーをまたぐ交換はできません(同一ファミリー内のサイズ調整などに限られます)。Cのスポットは中断リスクがあり長期の定常利用に不適切です。Dのオンデマンドキャパシティ予約はキャパシティを確保する仕組みで、それ自体に割引はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
  },
  {
    id: "saa-d4-ch01-q11",
    domain: 4,
    topic: "Savings Plans",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業はEC2上のワークロードの一部をコンテナとサーバーレスへ移行する計画があり、移行後もコミットが無駄にならないようCompute Savings Plansの購入を検討しています。EC2以外でCompute Savings Plansの割引が適用されるサービスはどれですか。(2つ選択してください)",
    choices: [
      "Amazon RDS",
      "AWS Fargate",
      "Amazon S3",
      "Amazon DynamoDB",
      "AWS Lambda",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。Compute Savings Plansは1時間あたりの利用額をコミットする割引モデルで、EC2に加えてAWS FargateとAWS Lambdaの使用量にも自動的に適用されます。そのためEC2からコンテナ(Fargate)やサーバーレス(Lambda)へ移行してもコミットが無駄になりません。AのAmazon RDSはCompute Savings Plansの対象外であり、割引を受けるにはリザーブドDBインスタンスを使用します。CのAmazon S3とDのAmazon DynamoDBはストレージ・データベースサービスであり、コンピューティング使用量を対象とするSavings Plansの適用範囲に含まれません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/savingsplans/latest/userguide/what-is-savings-plans.html",
  },

  // ===== saa-d4-ch02: ストレージ・DB・ネットワークのコスト最適化 =====
  {
    id: "saa-d4-ch02-q01",
    domain: 4,
    topic: "S3 Intelligent-Tiering",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がAmazon S3に大量のデータを保存していますが、オブジェクトごとのアクセスパターンが不明で、時間の経過とともに変化します。取り出し料金やパフォーマンスへの影響なしにストレージコストを自動的に最適化したい場合、最も適切なストレージクラスはどれですか。",
    choices: [
      "S3 Standard",
      "S3 One Zone-IA",
      "S3 Intelligent-Tiering",
      "S3 Glacier Deep Archive",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。S3 Intelligent-Tieringはオブジェクトごとのアクセスパターンを監視し、アクセスされないオブジェクトを低頻度アクセス階層やアーカイブインスタントアクセス階層へ自動的に移動します。取り出し料金がなく、アクセスパターンが不明・変化するデータに最適という試験の定番パターンです。AのS3 Standardは高頻度アクセス向けの単価のままとなり、アクセスされないデータには割高です。BのOne Zone-IAは単一AZ保存で耐障害性が下がるうえ、アクセスのたびに取り出し料金が発生します。DのGlacier Deep Archiveは取り出しに標準12時間かかり、アクセスされる可能性があるデータには不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/intelligent-tiering.html",
  },
  {
    id: "saa-d4-ch02-q02",
    domain: 4,
    topic: "S3 Glacier",
    type: "single",
    difficulty: "medium",
    question:
      "ある医療機関は検査画像をAmazon S3に7年間保存する必要があります。画像はアップロードから30日を過ぎるとほとんどアクセスされませんが、監査の際にはミリ秒単位で即座に取り出せることが求められます。30日経過後の保存先として最もコスト効率の良いストレージクラスはどれですか。",
    choices: [
      "S3 Glacier Instant Retrieval",
      "S3 Glacier Deep Archive",
      "S3 Standard",
      "S3 Glacier Flexible Retrieval",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。S3 Glacier Instant Retrievalは、四半期に1回程度しかアクセスされないアーカイブデータ向けの低単価クラスでありながら、S3 Standardと同等のミリ秒単位の取り出しが可能です。「ほとんどアクセスしないが、必要なときは即時アクセス」という要件に合致します。BのDeep Archiveは最安ですが取り出しに標準12時間かかり、即時取り出しの要件を満たさない「安いが要件未達」の罠です。CのStandardは即時アクセスできますが、ほとんどアクセスされないデータには割高です。DのFlexible Retrievalも取り出しに数分〜数時間かかるため、ミリ秒の要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html",
  },
  {
    id: "saa-d4-ch02-q03",
    domain: 4,
    topic: "S3ライフサイクル",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業はアプリケーションログをAmazon S3に保存しています。ログは最初の30日間は頻繁に分析され、その後90日目までは月に数回参照されます。90日以降は規制対応のため5年間保持するだけで、アクセスはほぼ発生せず、取り出しに12時間かかっても許容されます。最もコスト効率の良いライフサイクル設定はどれですか。",
    choices: [
      "作成直後にS3 Glacier Deep Archiveへ移行し、5年後に有効期限アクションで削除する",
      "30日後にS3 One Zone-IAへ移行し、5年後に有効期限アクションで削除する",
      "30日後にS3 Glacier Deep Archiveへ移行し、5年後に有効期限アクションで削除する",
      "30日後にS3 Standard-IAへ、90日後にS3 Glacier Deep Archiveへ移行し、5年後に有効期限アクションで削除する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。アクセス頻度の低下に合わせて、頻繁な分析が終わる30日後にStandard-IAへ、参照がなくなる90日後に最安のGlacier Deep Archiveへ段階的に移行し、保持期限の5年で削除する構成が、各期間の要件を満たしつつ最も安価です。Aは最初の30日の頻繁な分析に対応できません(Deep Archiveの取り出しには標準12時間かかります)。Bは90日以降も5年間IAの単価を払い続けるため割高で、One Zone-IAは単一AZ保存のため規制対応の長期保存には耐障害性の面でも不向きです。Cは30〜90日の間の月数回の参照のたびに、長い取り出し待ちと取り出し料金が発生します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lifecycle-mgmt.html",
  },
  {
    id: "saa-d4-ch02-q04",
    domain: 4,
    topic: "Amazon EBS",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のEC2インスタンスには多数の汎用SSD(gp2)ボリュームが接続されています。現在のIOPSとスループットの性能を維持したままEBSのコストを削減する方法として、最も適切なものはどれですか。",
    choices: [
      "すべてのボリュームをプロビジョンドIOPS SSD(io2)へ変更する",
      "すべてのボリュームをgp3へ移行し、必要なIOPSとスループットを個別に設定する",
      "すべてのボリュームをスループット最適化HDD(st1)へ変更する",
      "ボリュームサイズを2倍に拡張してベースラインIOPSを引き上げる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。gp3はgp2よりGBあたりの単価が約20%低く、ボリュームサイズと独立して必要なIOPSとスループットをプロビジョニングできます。ベースラインで3,000 IOPSを備えるため、gp2と同等以上の性能を維持したまま移行でき、定番のコスト削減手法です。Aのio2は高耐久・高IOPS向けのボリュームでgp2より高価になります。Cのst1はHDDベースでシーケンシャルなスループット重視のワークロード向けであり、ブートボリュームに使えず、ランダムIOPSの性能要件も満たせません。Dはgp2のIOPSが容量に比例する性質を使う方法ですが、ストレージ料金が倍増しコスト削減に逆行します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html",
  },
  {
    id: "saa-d4-ch02-q05",
    domain: 4,
    topic: "Amazon EFS",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は数百万のファイルをAmazon EFSに保存し、複数のEC2インスタンスから共有アクセスしています。分析の結果、ファイルの大部分は30日以上アクセスされていないことがわかりました。共有ファイルシステムとしての利用を継続しながら、最も簡単にストレージコストを削減する方法はどれですか。",
    choices: [
      "EFSのライフサイクル管理を有効にし、アクセスのないファイルを低頻度アクセスストレージクラスへ自動移行する",
      "すべてのファイルをAmazon EBSボリュームへコピーし、各インスタンスにアタッチして共有する",
      "ファイルシステム全体をS3 Glacier Deep Archiveへ移行してコストを最小化する",
      "各EC2インスタンスのインスタンスストアにファイルを複製して保持する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。EFSのライフサイクル管理を有効にすると、指定した期間アクセスされていないファイルが低頻度アクセス(IA)ストレージクラスへ自動的に移行され、NFSファイルシステムとしての透過的なアクセスを維持したままストレージ単価を大幅に下げられます。再アクセスされたファイルを標準クラスへ戻すポリシーも設定できます。BのEBSは複数インスタンスからの汎用的な共有ファイルストレージには適さず、コピーの運用も複雑です。CはNFSとしての共有アクセスができなくなり、取り出しにも時間がかかるため要件を満たしません。Dのインスタンスストアは揮発性でインスタンス停止時にデータが失われ、共有もできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/efs/latest/ug/lifecycle-management-efs.html",
  },
  {
    id: "saa-d4-ch02-q06",
    domain: 4,
    topic: "Aurora Serverless",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が新しいアプリケーション向けのリレーショナルデータベースを設計しています。利用は断続的で、トラフィックは予測不能に増減し、深夜はほとんどリクエストがありません。データベース容量の管理を自動化し、使用量に応じた支払いにしたい場合、最もコスト効率の良い選択肢はどれですか。",
    choices: [
      "ピーク負荷に合わせて容量を固定したAmazon RDS for MySQLインスタンスを使用する",
      "3年のリザーブドDBインスタンスを適用した大型のAmazon RDSインスタンスを使用する",
      "需要に応じて容量が自動スケールするAmazon Aurora Serverless v2を使用する",
      "Amazon EC2上に自己管理型のMySQLデータベースを構築して運用する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Aurora Serverless v2はデータベース容量を負荷に応じて自動的にスケールアップ・スケールダウンし、使用した容量に対して秒単位で課金されます。断続的で予測不能なワークロードでは、ピークに合わせた固定プロビジョニングを避けられるため最もコスト効率に優れます。AとBは常時ピーク相当の容量に料金が発生し、深夜などのアイドル時間が無駄になります。特にBのリザーブドDBインスタンスは定常的に稼働するワークロード向けの割引であり、断続的な利用では効果を発揮できません。DのEC2への自己構築はインスタンスが常時稼働するうえ、パッチ適用やバックアップなどの運用負荷も増加します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html",
  },
  {
    id: "saa-d4-ch02-q07",
    domain: 4,
    topic: "DynamoDB",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のAmazon DynamoDBテーブルには、新製品の発表時に数分間だけ通常の数百倍のトラフィックが発生し、それ以外の期間はごく少量のアクセスしかありません。トラフィックの事前予測は困難です。スロットリングを避けつつ最もコスト効率良く運用できる設定はどれですか。",
    choices: [
      "プロビジョンドキャパシティモードでピーク時に合わせた容量を常時確保する",
      "オンデマンドキャパシティモードに切り替えてリクエスト数に応じた課金にする",
      "プロビジョンドキャパシティモードで最小の容量を設定し、超過リクエストは制限する",
      "グローバルテーブルで複数リージョンへレプリケートしてトラフィックを分散する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。オンデマンドキャパシティモードは実際のリクエスト数に応じた課金で、事前のキャパシティ計画なしに急激なスパイクへも自動対応できます。トラフィックが予測不能でアイドル期間が長いテーブルでは、ピークに合わせたプロビジョニングを維持するより安価になります。Aはスパイクには耐えられますが、大半の期間で巨大な容量への支払いが無駄になります。Cは一見最も安く見えますが、発表時にスロットリングが発生して機会損失を招く「安いが要件未達」の罠です。Dのグローバルテーブルはリージョン間レプリケーションの書き込みコストが増えるだけで、単一テーブルへのスパイク対策にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html",
  },
  {
    id: "saa-d4-ch02-q08",
    domain: 4,
    topic: "VPCエンドポイント",
    type: "single",
    difficulty: "medium",
    question:
      "あるアプリケーションはプライベートサブネットのEC2インスタンスで稼働し、NATゲートウェイ経由で同一リージョンのAmazon S3へ毎日数TBのデータを転送しています。このデータ転送に関わるコストを削減する最も効果的な方法はどれですか。",
    choices: [
      "NATゲートウェイを各アベイラビリティーゾーンに追加してスループットを向上させる",
      "インスタンスにパブリックIPアドレスを割り当て、インターネットゲートウェイ経由でS3にアクセスする",
      "AWS Direct Connectを導入し、専用線経由でS3にアクセスするよう変更する",
      "S3用のゲートウェイVPCエンドポイントを作成し、S3への通信をエンドポイント経由に変更する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。NATゲートウェイには時間料金に加えて処理データ1GBあたりの料金が発生するため、S3への大量転送をNAT経由で行うと高額になります。S3とDynamoDBにはゲートウェイVPCエンドポイントが利用でき、追加料金なしでプライベートサブネットからAWSネットワーク内経由の直接アクセスが可能になります。これは試験で最頻出のコスト削減パターンです。AはNATゲートウェイの時間料金が増えるうえ処理料金も残ります。Bはプライベートサブネットの設計を崩し、セキュリティ面でも後退します。CのDirect Connectはオンプレミスとの専用線接続サービスであり、VPC内からのS3アクセスのコスト削減策ではなく高額な初期投資も必要です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
  },
  {
    id: "saa-d4-ch02-q09",
    domain: 4,
    topic: "データ転送コスト",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業は単一リージョンで多層Webアプリケーションを運用しており、AWSの請求のうちデータ転送料金が大きな割合を占めていることに気づきました。データ転送コストを削減できる方法はどれですか。(2つ選択してください)",
    choices: [
      "頻繁に通信するEC2インスタンス同士を同一のアベイラビリティーゾーンに配置する",
      "インスタンス間の通信をプライベートIPアドレスからパブリックIPアドレス経由へ変更する",
      "S3への大量アクセスをNATゲートウェイ経由からゲートウェイVPCエンドポイント経由へ切り替える",
      "S3バケットに別リージョンへのクロスリージョンレプリケーションを追加する",
      "すべてのプライベートサブネットに専用のNATゲートウェイを追加する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。同一リージョン内でもAZをまたぐ通信には双方向にデータ転送料金が発生するため、頻繁に通信するコンポーネントを同一AZへ集約すると削減できます(可用性とのトレードオフには注意が必要です)。また、NATゲートウェイの処理データ料金は、無料で利用できるS3向けゲートウェイVPCエンドポイントへの切り替えで排除できます。Bは逆効果で、パブリックIP経由の通信には同一AZ内でも転送料金が適用されます。Dのクロスリージョンレプリケーションはリージョン間転送料金を新たに発生させます。EのNATゲートウェイの追加は時間料金を増やすだけで、転送単価は下がりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html",
  },
  {
    id: "saa-d4-ch02-q10",
    domain: 4,
    topic: "CloudFront",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業はAmazon S3から世界中のユーザーへ動画ファイルを直接配信しており、S3からインターネットへのデータ転送料金が高額になっています。配信品質を維持または向上させながら転送コストを削減する方法として、最も適切なものはどれですか。",
    choices: [
      "S3 Transfer Accelerationを有効にして転送を高速化する",
      "動画ファイルをS3 Standard-IAストレージクラスへ移行する",
      "Amazon CloudFrontディストリビューションを作成し、S3バケットをオリジンとして配信する",
      "主要リージョンにS3バケットを複製し、ユーザーを最寄りのバケットへ誘導する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。CloudFront経由の配信では、S3からCloudFrontへのオリジン転送が無料になり、エッジロケーションでのキャッシュによってS3へのリクエスト数と転送量自体も減少します。ユーザーの近くから配信されるため体感品質も向上し、コストと品質を両立できます。AのTransfer Accelerationは長距離転送を高速化する機能で、GBあたりの追加料金が発生しコスト削減にはなりません。Bはストレージ料金の削減策であり、頻繁に配信される動画ではむしろ取り出し料金が増えます。Dはバケット複製のためのリージョン間転送と重複ストレージのコストが発生し、誘導の仕組みの運用も複雑になります。",
    reference: "https://aws.amazon.com/jp/cloudfront/pricing/",
  },
  {
    id: "saa-d4-ch02-q11",
    domain: 4,
    topic: "AWS Budgets",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業の財務チームは、月間のAWS利用料金が予算の80%に達した時点と、月末の料金が予算を超えると予測された時点で、メールによる通知を受け取りたいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Cost and Usage Report",
      "AWS Budgets",
      "AWS Trusted Advisor",
      "Amazon CloudWatchダッシュボード",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Budgetsではコスト予算を作成し、実際のコストがしきい値(予算の80%など)に達したとき、および予測コストが予算を超過する見込みになったときに、メールやAmazon SNSで通知するアラートを設定できます。実績だけでなく予測ベースの通知に対応している点が決め手です。AのCost and Usage Reportは最も詳細な課金データをS3に出力するレポート機能で、しきい値アラートの仕組みはありません。CのTrusted Advisorはコスト最適化などのベストプラクティスチェックを提供しますが、予算のアラート管理は行いません。DのCloudWatchダッシュボードは可視化ツールであり、予算に対する予測超過の通知機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/budgets-managing-costs.html",
  },
  {
    id: "saa-d4-ch02-q12",
    domain: 4,
    topic: "コスト配分タグ",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業では複数の部門が同一のAWSアカウントを共有しており、部門ごとのコスト内訳を毎月把握できるようにしたいと考えています。実施すべきことはどれですか。(2つ選択してください)",
    choices: [
      "AWS CloudTrailを有効化し、API呼び出し履歴から部門ごとの利用状況を集計する",
      "部門ごとに使用するEC2インスタンスタイプを分けて請求書上で見分けられるようにする",
      "部門を識別するタグをリソースに適用し、コスト配分タグとして請求コンソールで有効化する",
      "IAMのアクセスアドバイザー機能を使用して部門ごとのサービス利用コストを集計する",
      "AWS Cost Explorerでコスト配分タグごとにグループ化した月次レポートを作成する",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。リソースに部門名などのタグを付与し、請求コンソールでコスト配分タグとして有効化すると、以降の課金データがタグ別に分類されます。そのうえでCost Explorerのグループ化やフィルタ機能を使えば、部門ごとの月次コスト内訳を継続的に把握できます。AのCloudTrailはAPI呼び出しの監査証跡であり、コストを部門別に集計する用途には適しません。Bのインスタンスタイプを分けても、請求データ上で部門を判別する仕組みにはなりません。DのIAMアクセスアドバイザーはサービスへの最終アクセス情報を示す機能で、コストの集計はできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",
  },
];
