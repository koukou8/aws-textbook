// SAA-C03 分野3「高パフォーマンスなアーキテクチャの設計」の章末確認問題(全30問)
export const questions = [
  // ===== 第1章: 高パフォーマンスなストレージの選定 =====
  {
    id: "saa-d3-ch01-q01",
    domain: 3,
    topic: "ストレージタイプの選定",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、複数のアベイラビリティーゾーンで稼働する数十台のLinux EC2インスタンスから、同一のファイルシステムに同時に読み書きできる共有ストレージを必要としています。容量は自動的に拡張し、標準的なPOSIXファイルシステムインターフェイスでアクセスできる必要があります。最も適切なストレージはどれですか。",
    choices: [
      "Amazon EBSボリュームをマルチアタッチで全インスタンスに接続する",
      "Amazon S3バケットを作成して各インスタンスから利用する",
      "Amazon EFSファイルシステムを作成して各インスタンスからマウントする",
      "各インスタンスのインスタンスストアにデータを複製して保持する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon EFSはNFS経由で数千のクライアントから同時にマウントできるPOSIX互換のファイルストレージで、複数AZにまたがるアクセスと容量の自動伸縮に対応します。AのEBSマルチアタッチはio1/io2限定で同一AZ内の少数インスタンスに限られるうえ、クラスター対応ファイルシステムが別途必要です。BのS3はHTTP APIでアクセスするオブジェクトストレージで、POSIXファイルシステムとしてマウントする用途には適しません。Dのインスタンスストアは一時ストレージであり、インスタンス停止でデータが失われ、共有もできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/efs/latest/ug/whatisefs.html",
  },
  {
    id: "saa-d3-ch01-q02",
    domain: 3,
    topic: "S3パフォーマンス",
    type: "single",
    difficulty: "medium",
    question:
      "ある分析企業がAmazon S3の単一バケットに数億個のオブジェクトを保存し、多数の並列クライアントから毎秒数万回のGETリクエストを実行したところ、リクエストの一部が503(Slow Down)エラーで失敗するようになりました。アプリケーション全体のリクエスト性能を高める方法として最も適切なものはどれですか。",
    choices: [
      "オブジェクトキーのプレフィックスを複数に分散し、プレフィックス単位で並列アクセスする",
      "S3 Transfer Accelerationを有効化してエッジロケーション経由でアクセスする",
      "バケットのストレージクラスをS3 Standard-IAへ変更する",
      "バケットのバージョニングを有効化してオブジェクトの複製を作成する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。S3のリクエスト性能はプレフィックスごとに毎秒3,500回の書き込み・5,500回の読み取りをサポートし、プレフィックス数に比例してスケールします。キーを複数のプレフィックスに分散して並列アクセスすることで、全体のリクエストレートを引き上げられます。BのTransfer Accelerationは遠隔地からの転送を高速化する機能で、リクエストレートの上限は変わりません。Cのストレージクラス変更はコストに関する設定であり、リクエスト性能は向上しません。Dのバージョニングは誤削除・上書き対策の機能で、読み取り性能のスケールには寄与しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/optimizing-performance.html",
  },
  {
    id: "saa-d3-ch01-q03",
    domain: 3,
    topic: "S3 Transfer Acceleration",
    type: "single",
    difficulty: "easy",
    question:
      "あるメディア企業では、世界各地の取材拠点から東京リージョンの単一のAmazon S3バケットへ、数GBの動画ファイルを毎日アップロードしています。遠隔地の拠点からのアップロードに時間がかかることが課題です。最小の構成変更でアップロードを高速化する方法はどれですか。",
    choices: [
      "各拠点の近くのリージョンにバケットを作成し、クロスリージョンレプリケーションで集約する",
      "バケットでS3 Transfer Accelerationを有効化し、専用エンドポイント経由でアップロードする",
      "各拠点とAWSの間にAWS Direct Connect接続を敷設する",
      "ファイルを分割せず単一のPUTリクエストで送信するようアプリケーションを変更する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。S3 Transfer Accelerationを有効化すると、クライアントは最寄りのエッジロケーションを入口としてAWSの最適化されたバックボーンネットワーク経由でバケットへ転送するため、遠隔地からのアップロードが高速化されます。バケットの設定変更と接続先エンドポイントの変更だけで済みます。Aはバケットやレプリケーションの管理対象が増え、構成変更が最小という要件に反します。Cの専用線は敷設に数週間以上の期間と高いコストがかかり、各地の拠点には非現実的です。Dの単一PUTは上限5GBの制約があり、マルチパートアップロードよりむしろ低速になります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/transfer-acceleration.html",
  },
  {
    id: "saa-d3-ch01-q04",
    domain: 3,
    topic: "S3ストレージクラス",
    type: "single",
    difficulty: "medium",
    question:
      "ある医療機関では、検査画像をAmazon S3へ長期アーカイブする必要があります。画像へのアクセスは四半期に1回程度と低頻度ですが、医師の診察中に参照が発生するため、必要なときはミリ秒単位で取り出せなければなりません。この要件を最も低いコストで満たすストレージクラスはどれですか。",
    choices: [
      "S3 Standard-IA",
      "S3 Glacier Flexible Retrieval",
      "S3 Glacier Deep Archive",
      "S3 Glacier Instant Retrieval",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。S3 Glacier Instant Retrievalは、四半期に1回程度しかアクセスしないアーカイブデータ向けのクラスで、アーカイブ水準の低い保存コストでありながらミリ秒単位での取り出しが可能なため、要件を最も低コストで満たします。AのStandard-IAもミリ秒アクセスは可能ですが、保存単価がGlacier Instant Retrievalより高く、この低いアクセス頻度ではコスト効率が劣ります。BのFlexible Retrievalは取り出しに数分〜数時間、CのDeep Archiveは12時間以上かかるため、診察中にミリ秒で参照するという要件を満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html",
  },
  {
    id: "saa-d3-ch01-q05",
    domain: 3,
    topic: "EBSボリュームタイプ",
    type: "single",
    difficulty: "medium",
    question:
      "ある金融企業が、Amazon EC2上でミッションクリティカルなデータベースをホストしています。ワークロードの分析から、単一ボリュームで60,000 IOPSとサブミリ秒のレイテンシ、および99.999%のボリューム耐久性が必要なことがわかりました。最も適切なEBSボリュームタイプはどれですか。",
    choices: [
      "汎用SSD(gp3)",
      "スループット最適化HDD(st1)",
      "Cold HDD(sc1)",
      "io2 Block Express(プロビジョンドIOPS SSD)",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。io2 Block Expressは最大256,000 IOPS、サブミリ秒レイテンシ、99.999%の耐久性を提供し、gp3の上限を超えるIOPSを必要とするミッションクリティカルなデータベースに適したボリュームタイプです。Aのgp3は最大16,000 IOPSまでしかプロビジョニングできず、60,000 IOPSの要件を満たせません。Bのst1はシーケンシャルアクセス向けの低コストHDDで、IOPSもレイテンシも要件に届きません。Cのsc1はアクセス頻度の低いデータ向けの最も安価なHDDであり、高IOPS・低レイテンシのワークロードには不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html",
  },
  {
    id: "saa-d3-ch01-q06",
    domain: 3,
    topic: "EBSボリュームタイプ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が、EC2インスタンス上でログデータのバッチ分析基盤を運用しています。ワークロードは大きなファイルへのシーケンシャルな読み書きが中心で高いスループットを必要とする一方、IOPSやレイテンシの要件は厳しくありません。分析は頻繁に実行され、ボリュームには継続的にアクセスがあります。この要件を最も低いコストで満たすEBSボリュームタイプはどれですか。",
    choices: [
      "Cold HDD(sc1)",
      "汎用SSD(gp3)",
      "スループット最適化HDD(st1)",
      "io2 Block Express(プロビジョンドIOPS SSD)",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。st1(スループット最適化HDD)は、ビッグデータやログ処理のような大きなファイルへのシーケンシャルアクセスに対し、低コストで高いスループットを提供します。頻繁にアクセスされるスループット重視のワークロードに最適です。Aのsc1はEBSで最も安価ですが、アクセス頻度の低いデータ向けでスループットのベースラインが低く、継続的にアクセスされる分析基盤には不向きです。Bのgp3はHDDよりGBあたりのコストが高く、ランダムI/O向けの性能特性はこの要件では過剰です。Dのio2は高IOPS向けの最も高価な選択肢で、コスト最小の要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html",
  },
  {
    id: "saa-d3-ch01-q07",
    domain: 3,
    topic: "Amazon FSx for Windows File Server",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がオンプレミスのWindowsファイルサーバーをAWSへ移行します。移行後も、WindowsアプリケーションからSMBプロトコルでアクセスでき、既存のActive DirectoryとNTFSアクセス制御リスト(ACL)を引き続き利用できる必要があります。最も適切なサービスはどれですか。",
    choices: [
      "Amazon EFS",
      "Amazon FSx for Windows File Server",
      "Amazon FSx for Lustre",
      "Amazon S3",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Amazon FSx for Windows File ServerはWindows Server上に構築されたフルマネージドファイルストレージで、SMBプロトコル、Active Directory統合、NTFS ACLをネイティブにサポートし、Windowsファイルサーバーの移行先として最適です。AのEFSはNFSプロトコルのLinux(POSIX)向けファイルシステムで、SMBやNTFS ACLには対応しません。CのFSx for LustreはHPCや機械学習向けのハイパフォーマンスファイルシステムで、SMBやAD統合という要件に合いません。DのS3はオブジェクトストレージであり、SMBによるファイル共有アクセスを直接は提供できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/fsx/latest/WindowsGuide/what-is.html",
  },
  {
    id: "saa-d3-ch01-q08",
    domain: 3,
    topic: "Amazon FSx for Lustre",
    type: "single",
    difficulty: "hard",
    question:
      "ある研究機関が、Amazon S3のデータレイクに保存された数百TBの学習データを使って機械学習モデルのトレーニングを行います。数百台のEC2インスタンスから共有ファイルシステムとしてアクセスし、サブミリ秒のレイテンシと数百GB/秒規模のスループットが必要です。最も適切なソリューションはどれですか。",
    choices: [
      "Amazon FSx for Lustreファイルシステムを作成し、S3バケットとリンクさせる",
      "Amazon EFSを最大I/Oパフォーマンスモードで作成し、S3からデータをコピーする",
      "Amazon FSx for NetApp ONTAPを作成し、S3からデータをコピーする",
      "各インスタンスにio2 Block Expressボリュームをアタッチしてデータを分散配置する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。FSx for LustreはHPC・機械学習向けに設計されたファイルシステムで、サブミリ秒レイテンシと数百GB/秒までのスループットを提供します。S3バケットとネイティブにリンクし、S3上のオブジェクトをファイルとして透過的に処理できる点も要件に合致します。BのEFS最大I/Oモードは高い並列性に対応しますが、Lustreほどの性能特性はなく、S3とのネイティブ連携もありません。CのFSx for ONTAPはマルチプロトコル対応が特長で、HPC向けの性能とS3連携が決め手のこの場面には適しません。DのEBSは単一インスタンス向けブロックストレージで、数百台からの共有アクセスを実現できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/fsx/latest/LustreGuide/what-is.html",
  },
  {
    id: "saa-d3-ch01-q09",
    domain: 3,
    topic: "AWS Storage Gateway",
    type: "single",
    difficulty: "hard",
    question:
      "あるオンプレミスのデータセンターで、iSCSIブロックストレージを使用する業務アプリケーションのディスク容量が逼迫しています。データ全体をクラウドへ移しつつ、頻繁にアクセスするデータには引き続きオンプレミスから低レイテンシでアクセスする必要があります。アプリケーションの変更は許容されません。最も適切なソリューションはどれですか。",
    choices: [
      "保管型ボリュームゲートウェイをデプロイする",
      "キャッシュ型ボリュームゲートウェイをデプロイする",
      "Amazon S3ファイルゲートウェイをデプロイする",
      "AWS DataSyncでデータをAmazon S3へ移行する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。キャッシュ型ボリュームゲートウェイは、データ本体をAmazon S3に保存しながら頻繁にアクセスするデータのみをローカルにキャッシュするため、オンプレミスのディスク使用量を抑えつつ、iSCSI経由の低レイテンシアクセスをアプリケーション変更なしに維持できます。Aの保管型はデータ全体をローカルに保持する方式のため、ディスク逼迫の解決になりません。CのS3ファイルゲートウェイはNFS/SMBのファイルインターフェイスを提供するもので、iSCSIブロックを使う既存アプリケーションに適合しません。DのDataSyncは転送・同期のサービスであり、移行後もオンプレミスから継続的にブロックアクセスし続ける要件を満たせません。",
    reference:
      "https://aws.amazon.com/jp/storagegateway/faqs/",
  },
  {
    id: "saa-d3-ch01-q10",
    domain: 3,
    topic: "S3転送最適化",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある動画制作会社が、Amazon S3バケットとの間で1ファイルあたり数GBの動画ファイルを送受信しています。アップロードとダウンロードの両方の転送パフォーマンスを改善する方法はどれですか。(2つ選択してください)",
    choices: [
      "S3バケットのバージョニングを有効化する",
      "マルチパートアップロードでファイルを分割して並列アップロードする",
      "すべてのオブジェクトを単一のプレフィックスに集約する",
      "バイトレンジフェッチでオブジェクトの範囲を並列ダウンロードする",
      "ライフサイクルルールでS3 Glacier Flexible Retrievalへ移行する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。マルチパートアップロードは大きなオブジェクトを分割して並列送信することでアップロードのスループットを高め、100MBを超えるファイルで推奨されます。バイトレンジフェッチはオブジェクトの指定範囲を並列に取得し、ダウンロードを高速化します。Aのバージョニングは誤削除・上書き対策の機能で、転送性能には影響しません。Cのプレフィックス集約は逆効果で、S3の性能はプレフィックス単位でスケールするため分散させるのが定石です。EのGlacier Flexible Retrievalへの移行は取り出しに数分〜数時間かかるようになり、転送パフォーマンスをむしろ悪化させます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/mpuoverview.html",
  },
  // ===== 第2章: コンピューティングとデータベースの選定 =====
  {
    id: "saa-d3-ch02-q01",
    domain: 3,
    topic: "EC2インスタンスタイプ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、大規模なインメモリデータベースを使用するリアルタイムのビッグデータ分析アプリケーションをAmazon EC2で稼働させる予定です。ワークロードのボトルネックは大量のメモリ容量であることがわかっています。最も適切なインスタンスファミリーはどれですか。",
    choices: [
      "コンピューティング最適化インスタンス(C系)",
      "メモリ最適化インスタンス(R系)",
      "ストレージ最適化インスタンス(I系)",
      "バースト可能パフォーマンスインスタンス(T系)",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。R系をはじめとするメモリ最適化インスタンスは、vCPUあたりのメモリ容量を大きく設計されており、インメモリデータベースやリアルタイムビッグデータ分析のようにメモリ内で大規模データセットを処理するワークロードに最適です。AのC系はCPU性能がボトルネックになるバッチ処理や動画エンコードなどに適し、メモリ容量重視の要件には合いません。CのI系はローカルNVMeストレージの高いディスクI/O性能が特長で、メモリ容量が決め手の要件とは異なります。DのT系は負荷が断続的な小規模ワークロード向けで、継続的な大規模分析には不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/instance-types.html",
  },
  {
    id: "saa-d3-ch02-q02",
    domain: 3,
    topic: "プレイスメントグループ",
    type: "single",
    difficulty: "medium",
    question:
      "ある研究チームが、ノード間で大量のデータを交換する密結合のHPC(ハイパフォーマンスコンピューティング)アプリケーションをEC2インスタンス群で実行します。インスタンス間の通信レイテンシを最小化し、高いネットワークスループットを確保できる配置戦略はどれですか。",
    choices: [
      "スプレッドプレイスメントグループに配置する",
      "パーティションプレイスメントグループに配置する",
      "クラスタープレイスメントグループに配置する",
      "複数のアベイラビリティーゾーンへ均等に分散して配置する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。クラスタープレイスメントグループは、単一AZ内でインスタンスを物理的に近接配置し、ノード間の低レイテンシ・高スループット通信を実現するため、密結合のHPCワークロードに最適です。拡張ネットワーキングとの併用でさらに効果が高まります。Aのスプレッドは少数の重要インスタンスを異なるハードウェアへ分散して同時障害を防ぐ戦略で、通信性能は向上しません。Bのパーティションは大規模分散システムをラック単位で分離する戦略で、レイテンシ最小化が目的ではありません。Dの複数AZへの分散は可用性を高める一方、AZ間通信によってレイテンシはむしろ増加します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/placement-groups.html",
  },
  {
    id: "saa-d3-ch02-q03",
    domain: 3,
    topic: "AWS Lambda",
    type: "single",
    difficulty: "medium",
    question:
      "あるサーバーレスアプリケーションで、画像を変換するAWS Lambda関数の実行時間が長く、ユーザー体験に影響しています。調査の結果、処理はCPU負荷が支配的で、タイムアウトには達していないことがわかりました。関数の処理性能を向上させる方法として最も適切なものはどれですか。",
    choices: [
      "関数のタイムアウト値を最大の15分へ延長する",
      "予約済み同時実行数を増やす",
      "プロビジョニングされた同時実行を有効化する",
      "関数へのメモリ割り当てを増やす",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Lambdaでは割り当てるメモリ量に比例してCPU性能も増加するため、CPU負荷が支配的な処理ではメモリ割り当ての増加が処理速度を上げる第一の手段になります。Aのタイムアウト延長は長時間の実行を許容するだけで、処理自体は速くなりません。Bの予約済み同時実行は関数が利用できる同時実行数を確保する設定で、個々の実行の速度には影響しません。Cのプロビジョニングされた同時実行はコールドスタートによる起動遅延を抑える機能であり、実行中のCPU性能を高めるものではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-memory.html",
  },
  {
    id: "saa-d3-ch02-q04",
    domain: 3,
    topic: "AWS Fargate",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、1回の実行に約1時間かかる動画エンコード処理をコンテナ化しました。処理は不定期に発生します。サーバーやクラスターのインフラストラクチャを管理せずにこのコンテナを実行したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "AWS FargateでECSタスクとして実行する",
      "AWS Lambdaのタイムアウトを延長して実行する",
      "EC2起動タイプのECSクラスターで実行する",
      "EC2スポットインスタンス上で手動でコンテナを起動する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS FargateはECS/EKSのコンテナをサーバーレスで実行する起動タイプで、EC2インスタンスやクラスター基盤の管理なしにコンテナを実行できます。Lambdaの制限時間を超える長時間処理をコンテナで動かす要件に最適です。BのLambdaは最大実行時間が15分のため、約1時間かかる処理は実行できません。CのEC2起動タイプでは、基盤となるEC2インスタンスのプロビジョニングやパッチ適用などの管理が必要になり、要件に反します。Dのスポットインスタンスでの手動運用は、中断への対応やインスタンス管理の負荷が大きく、インフラを管理しないという要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/AWS_Fargate.html",
  },
  {
    id: "saa-d3-ch02-q05",
    domain: 3,
    topic: "AWS Batch",
    type: "single",
    difficulty: "medium",
    question:
      "ある製薬会社が、数十万件の分子シミュレーションジョブを毎晩実行しています。ジョブ間には依存関係があり、必要なコンピューティングリソースはジョブごとに異なります。リソースのプロビジョニングとジョブスケジューリングの管理負荷を最小限にし、コストも抑えたいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "cronを設定したEC2インスタンスを常時稼働させてジョブを順次実行する",
      "すべてのジョブをAWS Lambda関数として並列実行する",
      "Amazon ECSの常駐サービスとしてジョブ実行基盤を自前で構築する",
      "AWS Batchでジョブキューと依存関係を定義し、スポットインスタンスを活用する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS Batchは大量のバッチジョブをキューイングし、ジョブ間の依存関係を管理しながら、ワークロードに応じた最適なコンピューティングリソースを自動でプロビジョニングするサービスです。スポットインスタンスとの組み合わせでコストも抑えられます。Aの常時稼働EC2はリソースが固定で夜間以外は無駄になり、依存関係管理も自作となって運用負荷が高くなります。BのLambdaは最大15分の実行時間制限があり、長時間のシミュレーションには不適切です。Cの自前基盤はスケジューラやスケーリングの構築・運用が必要になり、管理負荷最小の要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/batch/latest/userguide/what-is-batch.html",
  },
  {
    id: "saa-d3-ch02-q06",
    domain: 3,
    topic: "RDSの可用性と読み取りスケーリング",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業のAmazon RDS for MySQLデータベースで、読み取りクエリの増加による性能低下が発生しています。また、AZ障害時にも自動的にデータベースを復旧できる構成が求められています。この2つの要件を満たすために実施すべき対応はどれですか。(2つ選択してください)",
    choices: [
      "マルチAZ配置を有効化して同期レプリケーションのスタンバイを作成する",
      "自動バックアップの保持期間を最大値に設定する",
      "リードレプリカを作成して読み取りクエリを振り分ける",
      "同一AZ内に2つ目のDBインスタンスを作成し、アプリケーションから二重書き込みする",
      "ストレージタイプを汎用SSDからマグネティックへ変更する",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。マルチAZ配置は同期レプリケーションされたスタンバイへの自動フェイルオーバーにより可用性の要件を満たし、リードレプリカは参照クエリをオフロードして読み取り性能の要件を満たします。両者は役割が異なるため、両方の実施が必要です。Bのバックアップ保持期間は復元可能な期間の設定であり、自動フェイルオーバーも性能向上も実現しません。Dの二重書き込みは整合性の維持が困難なアンチパターンで、同一AZ構成のためAZ障害にも耐えられません。Eのマグネティックは旧世代の低性能ストレージであり、性能低下をさらに悪化させます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html",
  },
  {
    id: "saa-d3-ch02-q07",
    domain: 3,
    topic: "RDS Proxy",
    type: "single",
    difficulty: "medium",
    question:
      "あるサーバーレスアプリケーションでは、多数のAWS Lambda関数が同時にAmazon RDS for PostgreSQLへ接続するため、データベースの接続数が上限に達してエラーが発生しています。アプリケーションコードの変更を最小限に抑えながら、この問題を解決する方法として最も適切なものはどれですか。",
    choices: [
      "Amazon RDS Proxyを導入し、Lambdaからはプロキシのエンドポイント経由で接続する",
      "DBインスタンスをより大きなインスタンスクラスへスケールアップする",
      "データベースをAmazon DynamoDBへ移行する",
      "Lambda関数の実行ごとに接続を確立し直すようコードを修正する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。RDS Proxyは接続プーリングを提供するフルマネージドのプロキシで、Lambdaのような大量の短命接続を集約し、データベースへの実接続数を抑えます。接続先をプロキシのエンドポイントへ変えるだけで済むためコード変更が最小で、フェイルオーバー時間の短縮効果もあります。Bのスケールアップは接続数の上限を多少引き上げますが、接続が集中する根本原因は解決せず、コストも増加します。CのDynamoDB移行はデータモデルの再設計とアプリケーションの大幅な変更が必要で、要件に反します。Dは接続の確立と切断がさらに頻発し、問題をむしろ悪化させます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/rds-proxy.html",
  },
  {
    id: "saa-d3-ch02-q08",
    domain: 3,
    topic: "Aurora Global Database",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がAmazon Aurora MySQLで世界向けのアプリケーションを運用しています。海外リージョンのユーザーからの読み取りレイテンシを削減するとともに、リージョン規模の障害に備えた迅速な復旧手段も確保する必要があります。最も適切なソリューションはどれですか。",
    choices: [
      "同一リージョン内にAuroraレプリカを15個まで追加する",
      "Aurora Global Databaseを構成し、セカンダリリージョンへレプリケートする",
      "クロスリージョン自動バックアップを有効化する",
      "マルチAZ配置を有効化してスタンバイインスタンスを作成する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Aurora Global Databaseは通常1秒未満のラグでセカンダリリージョンのクラスターへレプリケートし、海外ユーザーに低レイテンシのローカル読み取りを提供します。リージョン障害時にはセカンダリを短時間で昇格でき、DRの要件も同時に満たします。Aの同一リージョン内のレプリカ追加では、海外ユーザーとリージョン間のネットワークレイテンシを解決できません。Cのクロスリージョンバックアップは復旧に復元作業と時間を要し、読み取りレイテンシの改善効果もありません。DのマルチAZは同一リージョン内のAZ障害対策であり、リージョン障害と海外からの読み取りには対応できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html",
  },
  {
    id: "saa-d3-ch02-q09",
    domain: 3,
    topic: "データベース選定",
    type: "single",
    difficulty: "hard",
    question:
      "あるSNS運営企業が、「友人の友人」や「共通のフォロワー」のような多段階の関係性をたどるクエリを高頻度で実行する新機能を開発しています。リレーショナルデータベースでの多段JOINでは性能要件を満たせないことが判明しました。この関係性クエリを最も高いパフォーマンスで処理できるデータベースはどれですか。",
    choices: [
      "Amazon Aurora MySQLをスケールアップして多段JOINを実行する",
      "Amazon Redshiftへデータを移行して分析クエリとして実行する",
      "Amazon Neptuneへ関係データをグラフとして格納してクエリする",
      "Amazon DocumentDBへJSONドキュメントとして格納してクエリする",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon Neptuneはグラフ構造のデータに最適化されたフルマネージドのグラフデータベースで、SNSの友人関係のような多段階の関係性をたどるクエリを低レイテンシで処理できます。Aのリレーショナルデータベースは、JOINの段数が深くなるほど処理量が急増するため、スケールアップしても根本的に不利です。BのRedshiftは大規模データの集計・分析に適した列指向のデータウェアハウスで、オンラインの関係性探索クエリには向きません。DのDocumentDBはドキュメント指向のデータモデルであり、エンティティ間の多段階の関係をたどる処理を得意としません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/intro.html",
  },
  {
    id: "saa-d3-ch02-q10",
    domain: 3,
    topic: "DynamoDB",
    type: "multiple",
    difficulty: "medium",
    question:
      "あるモバイルゲーム企業がAmazon DynamoDBでプレイヤーデータを管理しています。新イベント開催時のトラフィックが予測できずスロットリングが発生しており、また読み取りが集中する人気アイテムのカタログ参照ではマイクロ秒単位のレイテンシが求められています。これらの要件を満たす対応はどれですか。(2つ選択してください)",
    choices: [
      "プロビジョンドキャパシティモードのままRCU/WCUを高い値に固定する",
      "DynamoDB Auto Scalingの目標使用率を下げて余裕を持たせる",
      "テーブルをオンデマンドキャパシティモードへ変更する",
      "別リージョンにグローバルテーブルのレプリカを追加する",
      "DynamoDB Accelerator(DAX)クラスターを導入する",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。オンデマンドキャパシティモードはリクエスト量に応じて即座にスケールするため、予測不能なスパイクでもキャパシティ計画なしにスロットリングを回避できます。DAXはDynamoDB API互換のインメモリキャッシュで、集中する読み取りをマイクロ秒単位のレイテンシで処理できます。Aの固定値の引き上げは平常時の過剰コストになるうえ、想定を超えるスパイクには対応できません。BのAuto Scalingはスケールの反映に時間がかかるため急激なスパイクに追従しきれず、レイテンシ要件も満たせません。Dのグローバルテーブルはマルチリージョン展開のための機能で、スパイクやキャッシュの課題を解決しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/DAX.html",
  },
  // ===== 第3章: キャッシュ・ネットワーク・データ取り込み =====
  {
    id: "saa-d3-ch03-q01",
    domain: 3,
    topic: "ElastiCache for Redis",
    type: "single",
    difficulty: "medium",
    question:
      "あるゲーム会社が、リアルタイムに更新されるプレイヤーランキング(リーダーボード)機能を構築しています。スコア順のソートを高速に処理できるデータ構造が必要で、ノード障害時にも自動フェイルオーバーによってキャッシュ層を継続稼働させる必要があります。最も適切なサービスはどれですか。",
    choices: [
      "ElastiCache for Memcached",
      "ElastiCache for Redis",
      "DynamoDB Accelerator(DAX)",
      "Amazon RDSのリードレプリカ",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ElastiCache for Redisはソート済みセットというデータ構造を備え、スコア順のランキングを効率的に処理できます。さらにレプリケーションとマルチAZ自動フェイルオーバーに対応しており、可用性の要件も満たします。AのMemcachedはシンプルなキーバリューのみでソート済みセットを持たず、レプリケーションやフェイルオーバーの機能もないため、ノード障害でデータが失われます。CのDAXはDynamoDB専用の読み取りキャッシュで、汎用のインメモリデータ構造ストアとしては使えません。Dのリードレプリカは読み取り負荷の分散が目的で、インメモリのランキング処理を担う機能ではありません。",
    reference:
      "https://aws.amazon.com/jp/elasticache/redis-vs-memcached/",
  },
  {
    id: "saa-d3-ch03-q02",
    domain: 3,
    topic: "Amazon EMR",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が、オンプレミスのHadoopクラスターで稼働している既存のApache SparkジョブをAWSへ移行します。フレームワークのバージョンやクラスター構成を細かく制御する必要があり、タスクノードにスポットインスタンスを使ってコストも最適化したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Glue",
      "Amazon Athena",
      "Amazon EMR",
      "Amazon Redshift",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon EMRはApache SparkやHadoopなどのビッグデータフレームワークをクラスターで実行するマネージドサービスで、既存のSparkジョブをほぼそのまま移行でき、クラスター構成やフレームワークバージョンの細かな制御、タスクノードへのスポットインスタンス適用によるコスト最適化にも対応します。AのGlueはサーバーレスETLサービスで手軽ですが、クラスター構成の細かな制御はできません。BのAthenaはS3上のデータに対するSQLクエリサービスで、Sparkジョブの移行先ではありません。DのRedshiftはデータウェアハウスであり、Hadoop/Sparkワークロードの実行基盤ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/emr/latest/ManagementGuide/emr-what-is-emr.html",
  },
  {
    id: "saa-d3-ch03-q03",
    domain: 3,
    topic: "Amazon CloudFront",
    type: "single",
    difficulty: "easy",
    question:
      "ある教育サービス企業が、Amazon S3に保存した講義動画を世界中の受講者へ配信しています。各地の受講者への配信レイテンシを下げるとともに、S3オリジンへのリクエスト数も削減したいと考えています。最も適切なサービスはどれですか。",
    choices: [
      "AWS Global Accelerator",
      "Amazon CloudFront",
      "S3 Transfer Acceleration",
      "AWS Direct Connect",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Amazon CloudFrontは世界中のエッジロケーションにコンテンツをキャッシュするCDNで、受講者は最寄りのエッジから低レイテンシで動画を視聴でき、キャッシュヒットによりS3オリジンへのリクエストも削減されます。AのGlobal Acceleratorは経路最適化のサービスであり、コンテンツをキャッシュしないためオリジンへの負荷は減りません。CのTransfer Accelerationは遠隔地からS3への転送(主にアップロード)を高速化する機能で、多数の視聴者への配信には適しません。DのDirect Connectはオンプレミスとの専用線接続であり、インターネット上の受講者への配信とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
  },
  {
    id: "saa-d3-ch03-q04",
    domain: 3,
    topic: "AWS Global Accelerator",
    type: "single",
    difficulty: "medium",
    question:
      "あるゲーム会社が、UDPプロトコルを使用するマルチプレイヤーゲームサーバーを複数のリージョンで運用しています。世界中のプレイヤーの通信レイテンシを下げるとともに、企業ネットワークのファイアウォールに登録できる固定IPアドレスでサービスを提供する必要があります。最も適切なサービスはどれですか。",
    choices: [
      "Amazon CloudFront",
      "Route 53のレイテンシーベースルーティング",
      "AWS Global Accelerator",
      "S3 Transfer Acceleration",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AWS Global Acceleratorは2つの静的エニーキャストIPアドレスを提供し、ユーザーを最寄りのエッジロケーションからAWSグローバルネットワーク経由で最適なリージョンへルーティングします。TCP/UDPの両方に対応するため、固定IPと低レイテンシの要件を同時に満たします。AのCloudFrontはHTTP/HTTPS向けのCDNでUDP通信には使えず、IPアドレスも固定されません。BのレイテンシーベースルーティングはDNSで近いリージョンへ誘導しますが、返されるIPは固定ではなく、DNSキャッシュにより切り替えも遅れます。DのS3 Transfer AccelerationはS3への転送を高速化する機能で、ゲームサーバーへの通信とは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/global-accelerator/latest/dg/what-is-global-accelerator.html",
  },
  {
    id: "saa-d3-ch03-q05",
    domain: 3,
    topic: "ハイブリッド接続",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が、オンプレミスのデータセンターとAWSの間で基幹システムのデータを常時やり取りしています。一貫した低レイテンシと大帯域のプライマリ接続を確保しつつ、プライマリ障害時にはコスト効率よく接続を維持できる構成が必要です。実施すべき対応はどれですか。(2つ選択してください)",
    choices: [
      "2本目のAWS Direct Connect接続をバックアップとして構築する",
      "AWS Direct Connect接続をプライマリとして構築する",
      "AWS Client VPNでオンプレミスの各サーバーを個別に接続する",
      "AWS Site-to-Site VPNをバックアップ接続として設定する",
      "Amazon CloudFrontでデータセンターとの通信を高速化する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。Direct Connectは専用線によってインターネットを経由しない一貫した低レイテンシ・大帯域の接続を提供し、プライマリに適します。Site-to-Site VPNはインターネット経由のIPsecトンネルを低コストかつ短期間で構築でき、障害時のバックアップとしてコスト効率に優れる定番構成です。Aの2本目のDirect Connectは可用性こそ最高になりますが、専用線を追加で維持するためコスト効率の要件に合いません。CのClient VPNはリモートユーザーの端末向け接続であり、拠点間の常時接続には不適切です。EのCloudFrontはコンテンツ配信サービスで、オンプレミスとの専用的な接続を提供しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/Welcome.html",
  },
  {
    id: "saa-d3-ch03-q06",
    domain: 3,
    topic: "AWS PrivateLink",
    type: "single",
    difficulty: "hard",
    question:
      "あるSaaSプロバイダーが、AWS上で提供する分析APIを数百の顧客のVPCから利用できるようにします。トラフィックをインターネットに出さず、顧客側とIPアドレス範囲(CIDR)が重複していても接続でき、顧客にはサービスのエンドポイントのみを公開してVPC全体への到達は許可しない必要があります。最も適切な方法はどれですか。",
    choices: [
      "各顧客VPCとの間にVPCピアリング接続を確立する",
      "AWS Transit Gatewayで全顧客VPCを相互接続する",
      "Network Load Balancer経由でインターネットに公開し、セキュリティグループで制限する",
      "AWS PrivateLinkのエンドポイントサービスとして公開し、顧客がインターフェイスエンドポイントを作成する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。AWS PrivateLinkでは、プロバイダーがNLBの背後のサービスをエンドポイントサービスとして公開し、顧客は自身のVPCにインターフェイスエンドポイントを作成して接続します。通信はAWSネットワーク内で完結し、CIDRが重複していても接続でき、公開されるのは特定のサービスのみでVPC全体には到達できません。AのVPCピアリングとBのTransit Gatewayは、いずれもCIDRが重複するとルーティングできず、ネットワーク同士が広く相互到達可能になるため要件に反します。Cはトラフィックがインターネットを経由するため、そもそも要件を満たしません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/what-is-privatelink.html",
  },
  {
    id: "saa-d3-ch03-q07",
    domain: 3,
    topic: "VPCエンドポイント",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のプライベートサブネットで稼働するEC2インスタンスから、同一リージョンのAmazon S3バケットへ大量のデータを転送する要件があります。トラフィックをインターネットに経由させず、追加のデータ処理料金やエンドポイント利用料金も発生させない方法はどれですか。",
    choices: [
      "NATゲートウェイを作成してS3へアクセスする",
      "インターフェイスVPCエンドポイントを作成してS3へアクセスする",
      "インターネットゲートウェイへのルートを追加してS3へアクセスする",
      "S3用のゲートウェイVPCエンドポイントを作成してアクセスする",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。ゲートウェイVPCエンドポイントはS3とDynamoDB専用のエンドポイントで、ルートテーブルの設定だけでVPC内からインターネットを経由せずにアクセスでき、追加料金なしで利用できます。AのNATゲートウェイは時間料金とデータ処理料金が発生するうえ、経路もインターネット向けの構成になります。Bのインターフェイスエンドポイント(PrivateLink)でもS3へプライベート接続できますが、時間課金と処理料金が発生するため、無料という要件ではゲートウェイ型が優先されます。Cのインターネットゲートウェイ経由はインターネットを通るアクセスとなり、要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
  },
  {
    id: "saa-d3-ch03-q08",
    domain: 3,
    topic: "Kinesis Data Streams",
    type: "single",
    difficulty: "medium",
    question:
      "あるEC企業が、Webサイトのクリックストリームデータを秒未満のリアルタイムで処理する基盤を構築します。不正検知とレコメンドという複数の独立したアプリケーションが同じストリームデータをそれぞれ読み取り、障害発生時には過去24時間分のデータを再処理できる必要があります。最も適切なサービスはどれですか。",
    choices: [
      "Amazon Kinesis Data Streams",
      "Amazon Data Firehose",
      "Amazon SQS標準キュー",
      "Amazon SNS",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Kinesis Data Streamsはリアルタイムのストリーミング処理サービスで、保持期間内であれば複数のコンシューマが同じデータを独立して読み取れ、過去データの再処理(リプレイ)も可能です。この2つの要件はData Streams固有の決め手です。BのData Firehoseはバッファリングを伴うニアリアルタイムの配信サービスで、データを保持せず再読み取りもできません。CのSQSはメッセージが受信・削除されると他のコンシューマから読めなくなるため、複数アプリが同じデータを独立に処理する要件に合いません。DのSNSはプッシュ型の通知サービスでメッセージを保持せず、再処理の要件を満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/streams/latest/dev/introduction.html",
  },
  {
    id: "saa-d3-ch03-q09",
    domain: 3,
    topic: "Amazon Data Firehose",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が、アプリケーションのログをニアリアルタイムでAmazon S3のデータレイクへ集約する仕組みを構築します。配信時にApache Parquet形式へ変換する必要がありますが、変換・配信のためのインフラ構築や継続的な管理は行いたくありません。最も適切なサービスはどれですか。",
    choices: [
      "Kinesis Data Streamsとカスタムコンシューマアプリケーションを構築する",
      "Amazon Data Firehoseの配信ストリームでS3へ配信する",
      "AWS Glueの日次バッチジョブで変換して書き込む",
      "EC2上にログ収集サーバーを構築してS3へ転送する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Amazon Data Firehose(旧称Kinesis Data Firehose)はストリーミングデータをバッファリングし、S3などの宛先へコードを書かずにニアリアルタイムで自動配信するフルマネージドサービスです。配信時のParquet/ORCへの形式変換も組み込み機能で対応でき、インフラの構築・管理が不要です。AのData Streamsとカスタムコンシューマでも実現できますが、コンシューマの開発とシャードやスケーリングの管理が必要で、運用負荷最小の要件に反します。CのGlue日次バッチではニアリアルタイムの要件を満たせません。DのEC2ログサーバーは構築・運用・スケーリングの管理が必要で、要件に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/firehose/latest/dev/what-is-this-service.html",
  },
  {
    id: "saa-d3-ch03-q10",
    domain: 3,
    topic: "Amazon Athena",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業がAmazon S3に保存した大量のCSV形式のアクセスログをAmazon Athenaで分析しています。データ量の増加に伴い、クエリの実行時間とスキャン料金が増大しました。クエリのパフォーマンスを改善し、スキャンされるデータ量を削減できる対応はどれですか。(2つ選択してください)",
    choices: [
      "データをApache Parquetなどの列指向形式へ変換する",
      "S3バケットのストレージクラスをOne Zone-IAへ変更する",
      "すべてのログを単一の巨大なCSVファイルへ統合する",
      "日付などのキーでデータをパーティション分割する",
      "ログデータをDynamoDBへ移行してからクエリする",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。Parquetなどの列指向形式はクエリで参照する列だけを読み取るためスキャン量が大幅に減り、圧縮効率にも優れます。日付などによるパーティション分割は、WHERE句の条件でクエリ対象のデータを物理的に絞り込み、スキャン量と実行時間を削減します。いずれもAWS Glueによる変換と組み合わせるのが定番です。Bのストレージクラス変更は保存コストの設定であり、スキャン量もクエリ性能も変わりません。Cの単一巨大ファイルへの統合は並列読み取りを妨げ、性能をむしろ悪化させます。EのDynamoDB移行はデータモデルの再設計が必要なうえ、キーバリュー型のDynamoDBは大規模な集計・分析クエリに不向きです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/athena/latest/ug/what-is.html",
  },
];
