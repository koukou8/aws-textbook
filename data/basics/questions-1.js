// AWS基礎 前半(第1〜6章)の章末確認問題
export const questions = [
  {
    id: "basics-ch01-q01",
    domain: null,
    topic: "グローバルインフラストラクチャ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、単一のAWSリージョン内でWebアプリケーションの可用性を高めたいと考えています。データセンター障害の影響を最小限にするための最も基本的な設計はどれですか。",
    choices: [
      "複数のエッジロケーションにEC2インスタンスを配置する",
      "複数のアベイラビリティーゾーンにEC2インスタンスを分散配置する",
      "同一アベイラビリティーゾーン内でインスタンスサイズを大きくする",
      "同一アベイラビリティーゾーン内にインスタンスを追加する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。アベイラビリティーゾーン(AZ)はリージョン内で電源・ネットワークが物理的に分離されたデータセンター群であり、複数AZへの分散配置が単一データセンター障害への基本的な対策です。Aのエッジロケーションはコンテンツ配信用の拠点であり、EC2インスタンスは配置できません。Cの垂直スケーリングは性能を高めるだけで、障害の影響範囲は変わりません。Dは台数が増えても同一AZ内のため、そのAZの障害で全滅するリスクが残ります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-regions-availability-zones.html",
  },
  {
    id: "basics-ch01-q02",
    domain: null,
    topic: "グローバルインフラストラクチャ",
    type: "multiple",
    difficulty: "medium",
    question:
      "エッジロケーションを利用して機能を提供するAWSサービスはどれですか。(2つ選択してください)",
    choices: [
      "Amazon CloudFront",
      "Amazon EBS",
      "Amazon Route 53",
      "Amazon RDS",
      "AWS Backup",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。Amazon CloudFrontはエッジロケーションでコンテンツをキャッシュ配信するCDNサービスで、Amazon Route 53もエッジロケーションを利用してDNSクエリに低レイテンシで応答します。BのAmazon EBSはAZ内に存在するブロックストレージ、DのAmazon RDSはリージョン内で稼働するマネージドデータベース、EのAWS Backupはリージョン単位で動作するバックアップ管理サービスであり、いずれもエッジロケーションは利用しません。",
    reference: "https://aws.amazon.com/jp/cloudfront/features/",
  },
  {
    id: "basics-ch01-q03",
    domain: null,
    topic: "責任共有モデル",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業がAmazon EC2インスタンスでWebアプリケーションを運用しています。責任共有モデルにおいて、この構成で利用者(顧客)側の責任となるのはどれですか。",
    choices: [
      "データセンターの物理的なセキュリティ管理",
      "ホストサーバーのハードウェアの保守と交換",
      "ハイパーバイザーへのパッチ適用",
      "ゲストOSへのセキュリティパッチの適用",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。EC2はIaaSに分類され、ゲストOS以上のレイヤー(OSのパッチ適用、ミドルウェア、アプリケーション、データ)は利用者の責任です。Aの物理セキュリティ、Bのハードウェア保守、Cのハイパーバイザー管理は、いずれもAWSが担う「クラウドのセキュリティ」に含まれます。EC2では境界がゲストOSにあり、RDSなどのマネージドサービスではOSパッチまでAWSが担う、という境界の違いも押さえておきましょう。",
    reference: "https://aws.amazon.com/jp/compliance/shared-responsibility-model/",
  },
  {
    id: "basics-ch01-q04",
    domain: null,
    topic: "リージョン選定",
    type: "single",
    difficulty: "medium",
    question:
      "ある金融企業が新しいワークロードのデプロイ先リージョンを検討しています。規制により、顧客データを国内に保持することが義務付けられています。リージョン選定で最も優先すべき判断基準はどれですか。",
    choices: [
      "データレジデンシーなどのコンプライアンス要件",
      "リージョン間のサービス料金の差",
      "利用したい新サービスの提供状況",
      "エッジロケーションまでの距離",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。データを特定の国・地域に保持する法的義務(データレジデンシー)は選択の余地がない制約であり、コンプライアンス要件が最優先の判断基準になります。Bの料金差やCのサービス提供状況も重要な基準ですが、規制要件を満たせないリージョンはそもそも候補になりません。Dのエッジロケーションはコンテンツ配信用の拠点で世界中に多数あり、ワークロードを配置するリージョンの選定基準としては優先度が低い要素です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-regions-availability-zones.html",
  },
  {
    id: "basics-ch01-q05",
    domain: null,
    topic: "グローバルインフラストラクチャ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が東京リージョンのAmazon S3バケットに重要なデータを保存しています。災害対策担当者は「リージョン規模の災害が起きても、大阪リージョンで同じデータを使えるようにしたい」と考えています。前提として正しい理解はどれですか。",
    choices: [
      "S3のデータは全リージョンへ自動的に複製されるため、追加の設定は不要である",
      "S3のデータは同一リージョン内の複数AZに保存されるため、リージョン障害にもそのまま耐えられる",
      "リージョン間でデータは自動的にコピーされないため、クロスリージョンレプリケーションなどを明示的に設定する必要がある",
      "エッジロケーションのキャッシュが全世界に残るため、リージョン障害時はそこから復元できる",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。リージョンは互いに独立しており、利用者が明示的に操作しない限りデータがリージョンの外へコピーされることはありません。別リージョンでデータを使うには、S3のクロスリージョンレプリケーションなどを設定します。AとBは誤りで、S3標準クラスの冗長化はあくまで同一リージョン内の複数AZまでであり、リージョン全体の障害には別リージョンへの複製が必要です。DのCloudFrontのキャッシュは一時的な配信用コピーであり、バックアップや復元の手段にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication.html",
  },
  {
    id: "basics-ch02-q01",
    domain: null,
    topic: "IAM",
    type: "single",
    difficulty: "easy",
    question:
      "Amazon EC2インスタンス上のアプリケーションがAmazon S3バケットへファイルをアップロードします。認証情報を安全に扱うための最も適切な方法はどれですか。",
    choices: [
      "IAMユーザーのアクセスキーをアプリケーションのソースコードに記述する",
      "IAMユーザーのアクセスキーをインスタンス内の設定ファイルに保存する",
      "S3へのアクセスを許可したIAMロールを作成し、EC2インスタンスにアタッチする",
      "ルートユーザーのアクセスキーを環境変数に設定する",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。EC2にIAMロールをアタッチすると、アプリケーションは自動的にローテーションされる一時的な認証情報を利用でき、キーの埋め込みや管理が不要になります。AとBは長期的なアクセスキーをコードや設定ファイルに置く方法で、漏えいやローテーション漏れのリスクが高くアンチパターンです。Dのルートユーザーのアクセスキーは最も強い権限を持つ認証情報であり、作成しないこと自体がベストプラクティスです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html",
  },
  {
    id: "basics-ch02-q02",
    domain: null,
    topic: "IAM",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、監査チームが別のAWSアカウントを使用しています。監査チームのメンバーに、本番アカウント内のリソースへの一時的な読み取りアクセスを許可する必要があります。最も適切な方法はどれですか。",
    choices: [
      "本番アカウントに読み取り権限を持つIAMロールを作成し、監査アカウントからロールを引き受け(AssumeRole)させる",
      "本番アカウントに監査メンバー全員分のIAMユーザーを作成し、パスワードをメールで共有する",
      "本番アカウントのIAMユーザーのアクセスキーを発行し、監査チームに配布する",
      "本番アカウントのルートユーザーの認証情報を監査期間中だけ貸与する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。クロスアカウントアクセスの標準は、アクセスされる側にIAMロールを作成し、信頼ポリシーで相手アカウントを指定してAssumeRoleさせる方法です。一時的な認証情報が使われるため安全で、監査終了後はロールを削除すれば済みます。Bはユーザーの重複管理とパスワード共有という運用・セキュリティ両面の問題があります。Cの長期アクセスキーの配布は漏えいリスクが高い方法です。Dのルートユーザーの共有は最も重大なアンチパターンで、いかなる場合も行いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html",
  },
  {
    id: "basics-ch02-q03",
    domain: null,
    topic: "IAM",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が新しいAWSアカウントを開設しました。ルートユーザーを保護するために実施すべきベストプラクティスはどれですか。(2つ選択してください)",
    choices: [
      "ルートユーザーで日常の運用作業を行い、操作履歴を一元化する",
      "ルートユーザーにMFA(多要素認証)を有効化する",
      "ルートユーザーのパスワードを運用チーム全員で共有する",
      "ルートユーザーのアクセスキーを作成せず、既存のものは削除する",
      "ルートユーザーにAdministratorAccessポリシーをアタッチして権限を明示する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。ルートユーザーはアカウントの全権を持つため、MFAによる認証の強化と、プログラムアクセス用のアクセスキーを持たせないことが基本のベストプラクティスです。Aは誤りで、日常作業は必要最小限の権限を持つIAMユーザーやロールで行い、ルートユーザーの使用は専用作業に限定します。Cのパスワード共有は不正利用時の追跡を不可能にする危険な運用です。Eは無意味で、ルートユーザーの権限はポリシーで制御・付与できるものではなく、常にすべての操作が可能です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html",
  },
  {
    id: "basics-ch02-q04",
    domain: null,
    topic: "IAM",
    type: "single",
    difficulty: "hard",
    question:
      "あるIAMユーザーには、S3バケットへのフルアクセスを許可する管理ポリシーがアタッチされています。しかし、このユーザーが特定のバケットにアクセスすると失敗します。調査したところ、所属するグループに、そのバケットへのアクセスを明示的にDenyするポリシーが付与されていました。このユーザーのアクセスはどう評価されますか。",
    choices: [
      "ユーザー個人へのAllowはグループのDenyより優先されるため、アクセスは許可される",
      "明示的なDenyが常に優先されるため、アクセスは拒否される",
      "AllowとDenyが競合した場合は、後から付与されたポリシーが優先される",
      "AllowとDenyが競合した場合は、対象リソースの範囲が狭いポリシーが優先される",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。IAMのポリシー評価では、適用されるすべてのポリシーを合わせて判断し、明示的なDenyが1つでもあればAllowの数や付与先にかかわらず必ず拒否されます(明示的な拒否の優先)。Aは誤りで、ユーザー直接付与かグループ経由かによる優先順位はありません。Cのようなポリシーの付与順序による優先や、Dのようなリソース範囲の狭さによる優先というルールもIAMには存在しません。「デフォルトは暗黙的な拒否、Allowで許可、明示的Denyが最優先」という評価論理を覚えましょう。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
  },
  {
    id: "basics-ch02-q05",
    domain: null,
    topic: "IAM",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業の開発部門には50名のメンバーがおり、全員に同じAWS権限を付与する必要があります。今後もメンバーの入退社や異動が頻繁に発生します。最も運用負荷の低い権限管理の方法はどれですか。",
    choices: [
      "各IAMユーザーに同じポリシーを個別にアタッチする",
      "全員で1つのIAMユーザーを共有する",
      "各メンバーにポリシーのJSONを配布し、自分でインラインポリシーを設定させる",
      "IAMグループにポリシーをアタッチし、メンバーのIAMユーザーをグループに所属させる",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。グループにポリシーを付与しておけば、入退社や異動の際はグループへの追加・削除だけで済み、権限変更もグループのポリシー修正1回で全員に反映されます。Aは人数分の個別管理が必要になり、変更漏れが発生しやすい方法です。BのIAMユーザーの共有は、誰が操作したか追跡できなくなるためベストプラクティスに反します。Cのインラインポリシーの個別設定は管理が分散するうえ、メンバー自身に権限設定をさせること自体が最小権限の原則に反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_groups.html",
  },
  {
    id: "basics-ch02-q06",
    domain: null,
    topic: "IAM",
    type: "single",
    difficulty: "medium",
    question:
      "AWS Lambda関数がAmazon DynamoDBテーブルへ項目を書き込む処理を実装します。関数にDynamoDBへのアクセス権限を与える最も適切な方法はどれですか。",
    choices: [
      "DynamoDBへのフルアクセスを持つIAMユーザーのアクセスキーを関数の環境変数に設定する",
      "対象テーブルへの書き込みを許可したIAMロールを、関数の実行ロールとして設定する",
      "関数のコードにルートユーザーの認証情報を記述する",
      "DynamoDBテーブルをパブリックに公開し、認証なしでアクセスできるようにする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Lambda関数には実行ロールを設定でき、関数は一時的な認証情報で対象リソースにアクセスします。最小権限の原則に従い、対象テーブルへの必要なアクションのみ許可します。Aは長期アクセスキーの管理・漏えいリスクがあり、ロールで実現できる以上不適切です。Cのルートユーザー認証情報の使用は最も危険なアンチパターンです。DのDynamoDBにはS3のような「パブリック公開」の仕組みはなく、認証なしアクセスを許す設計はセキュリティ上も論外です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-intro-execution-role.html",
  },
  {
    id: "basics-ch03-q01",
    domain: null,
    topic: "AMI",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業では、Auto Scalingによって頻繁にEC2インスタンスが追加されます。現在は起動のたびにユーザーデータスクリプトでミドルウェアをインストールしており、サービス投入までに時間がかかっています。起動時間を短縮し、構成のばらつきも防ぐ最も適切な方法はどれですか。",
    choices: [
      "より高速なインスタンスタイプに変更し、スクリプトの実行時間を短縮する",
      "ミドルウェアと設定を適用済みのカスタムAMI(ゴールデンイメージ)を作成し、そこから起動する",
      "起動後に管理者が手動でセットアップする運用手順を整備する",
      "インスタンスを常に最大台数で稼働させ、スケーリングを行わない",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。必要なソフトウェアと設定を組み込んだカスタムAMIから起動すれば、起動時のインストール処理が不要になり、サービス投入までの時間短縮と構成の均一化を同時に実現できます。Aはスクリプトの実行が多少速くなる可能性はあるものの、インストール処理自体は残るため根本的な解決になりません。Cの手動セットアップはAuto Scalingの自動化と相反し、所要時間も構成のばらつきも悪化します。Dは起動時間の問題を回避できてもコストが大幅に増え、需要に合わせて増減できるという利点を放棄することになります。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/AMIs.html",
  },
  {
    id: "basics-ch03-q02",
    domain: null,
    topic: "EC2インスタンスタイプ",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業が、大量のデータをメモリ上に保持して高速に集計するリアルタイム分析アプリケーションをEC2で稼働させます。ワークロードは大容量のメモリを継続的に必要とします。最も適切なインスタンスファミリーはどれですか。",
    choices: [
      "コンピューティング最適化(C系)インスタンス",
      "バーストパフォーマンス(T系)インスタンス",
      "メモリ最適化(R系)インスタンス",
      "ストレージ最適化(I系)インスタンス",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。R系などのメモリ最適化インスタンスはメモリ容量が大きく、インメモリキャッシュやリアルタイム分析のようにメモリを大量に消費するワークロードに適しています。AのC系はvCPUあたりの処理性能を重視したファミリーで、バッチ処理や高負荷APIに向き、メモリ容量が決め手の本要件には合いません。BのT系はCPUクレジットを貯めて一時的な負荷に対応する方式のため、継続的に高い負荷がかかる用途には不向きです。DのI系は高速なローカルNVMeストレージが特徴で、ストレージI/Oではなくメモリが要件の中心である本ケースには適しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/instance-types.html",
  },
  {
    id: "basics-ch03-q03",
    domain: null,
    topic: "EC2購入オプション",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、夜間に実行する画像変換のバッチ処理をEC2で行います。処理は途中で中断されても最初からやり直すことができ、完了期限にも余裕があります。最もコスト効率の良い購入オプションはどれですか。",
    choices: [
      "オンデマンドインスタンス",
      "リザーブドインスタンス",
      "Dedicated Hosts",
      "スポットインスタンス",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。スポットインスタンスはAWSの未使用キャパシティを最大約90%の割引で利用でき、中断される可能性を許容できるバッチ処理に最適です。Aのオンデマンドは柔軟ですが割引がなく、中断に耐えられる本ケースでは割高になります。Bのリザーブドインスタンスは1年または3年のコミットと引き換えに割引を得るオプションで、夜間のみのバッチには利用時間が限られ効果を活かしにくい選択です。CのDedicated Hostsは物理サーバーを専有するオプションで、ライセンスやコンプライアンス要件のためのものであり、コスト削減の目的には合いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-spot-instances.html",
  },
  {
    id: "basics-ch03-q04",
    domain: null,
    topic: "EC2購入オプション",
    type: "multiple",
    difficulty: "hard",
    question:
      "ある企業のWebアプリケーションは、今後3年間、24時間365日の定常稼働が見込まれています。EC2のコンピューティングコストを大幅に削減できる購入オプションはどれですか。(2つ選択してください)",
    choices: [
      "スポットインスタンス",
      "リザーブドインスタンス",
      "オンデマンドキャパシティ予約",
      "Savings Plans",
      "Dedicated Hosts",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。リザーブドインスタンスとSavings Plansはいずれも1年または3年の利用コミットと引き換えに大幅な割引を受けられ、長期にわたり定常稼働するワークロードに最適です。Aのスポットインスタンスは安価ですが中断される可能性があり、常時稼働が必要な本番Webアプリケーションには不適切です。Cのオンデマンドキャパシティ予約はキャパシティを確保するための仕組みであり、それ自体に割引効果はありません。EのDedicated Hostsは物理サーバーを専有するためのオプションで、コスト削減の手段ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/instance-purchasing-options.html",
  },
  {
    id: "basics-ch03-q05",
    domain: null,
    topic: "セキュリティグループ",
    type: "single",
    difficulty: "hard",
    question:
      "Application Load Balancer(ALB)の背後でEC2のWebサーバー群が稼働しています。セキュリティ要件として、WebサーバーへのHTTPリクエストはALB経由のもののみを許可し、インターネットから直接アクセスできないようにする必要があります。最も適切な設定はどれですか。",
    choices: [
      "WebサーバーのセキュリティグループでHTTPの送信元にALBのセキュリティグループを指定する",
      "WebサーバーのセキュリティグループでHTTPの送信元に0.0.0.0/0を指定する",
      "WebサーバーのセキュリティグループにALB以外からの通信を拒否するルールを追加する",
      "サブネットのネットワークACLでALBの現在のIPアドレスのみを許可する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。セキュリティグループは送信元としてCIDRだけでなく別のセキュリティグループを指定でき、ALBのセキュリティグループを送信元にすればALB経由の通信だけを確実に許可できます。Bは全世界からの直接アクセスを許可してしまい、要件に反します。Cは実現不可能で、セキュリティグループには許可ルールしか記述できず、拒否ルールは追加できません。DのALBのIPアドレスは固定ではなくスケールに応じて変化するため、IPアドレスを固定的に許可する方法は通信断や設定漏れを招き不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-security-groups.html",
  },
  {
    id: "basics-ch03-q06",
    domain: null,
    topic: "セキュリティグループ",
    type: "multiple",
    difficulty: "easy",
    question:
      "インターネットに公開するWebサーバー(EC2インスタンス)のセキュリティグループを設定します。セキュリティのベストプラクティスに沿ったインバウンドルールはどれですか。(2つ選択してください)",
    choices: [
      "HTTPS(443)を0.0.0.0/0に対して許可する",
      "SSH(22)を0.0.0.0/0に対して許可する",
      "SSH(22)を社内の固定IPアドレス範囲のみに許可する",
      "すべてのポートを0.0.0.0/0に対して許可する",
      "インバウンドの拒否ルールを追加してSSH(22)をブロックする",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。公開Webサーバーでは、HTTPSのように公開が必要なポートだけを全体(0.0.0.0/0)に許可し、SSHなどの管理用ポートは社内の固定IPアドレス範囲など送信元を最小限に絞るのが基本です。BのSSHの全開放は、総当たり攻撃などの標的になる危険な設定です。Dの全ポート開放は必要最小限に絞るという原則に真っ向から反します。Eは実現不可能で、セキュリティグループには許可ルールしか記述できず、拒否ルールを追加することはできません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-security-groups.html",
  },
  {
    id: "basics-ch04-q01",
    domain: null,
    topic: "VPCとサブネット",
    type: "single",
    difficulty: "easy",
    question:
      "あるエンジニアが新しいVPCにパブリックサブネットとプライベートサブネットを設計しています。サブネットが「パブリックサブネット」として機能するための条件はどれですか。",
    choices: [
      "サブネット内のインスタンスすべてにElastic IPアドレスを割り当てること",
      "サブネット内にNATゲートウェイを配置すること",
      "サブネットに関連付けたルートテーブルにインターネットゲートウェイへのルートがあること",
      "サブネットをVPC内の複数のアベイラビリティーゾーンにまたがって作成すること",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。パブリック/プライベートの区別はサブネット自体の属性ではなく、関連付けられたルートテーブルの内容で決まります。インターネットゲートウェイへのルートを持つサブネットがパブリックサブネットです。AのElastic IPは個々のインスタンスがインターネットと通信するために必要な要素の1つですが、サブネットの分類を決める条件ではありません。BのNATゲートウェイはパブリックサブネットに配置するリソースであり、配置したからパブリックになるわけではありません。Dは誤りで、サブネットは常に単一のAZに属します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/configure-subnets.html",
  },
  {
    id: "basics-ch04-q02",
    domain: null,
    topic: "NATゲートウェイ",
    type: "single",
    difficulty: "medium",
    question:
      "プライベートサブネットのEC2インスタンスが、OSのセキュリティパッチをインターネットからダウンロードする必要があります。ただし、インターネット側からこれらのインスタンスへ接続を開始できてはいけません。最も適切な構成はどれですか。",
    choices: [
      "パブリックサブネットにNATゲートウェイを作成し、プライベートサブネットのルートテーブルに0.0.0.0/0のルートとして設定する",
      "各インスタンスにパブリックIPアドレスを割り当て、パブリックサブネットへ移動する",
      "プライベートサブネットにインターネットゲートウェイを追加でアタッチする",
      "プライベートサブネットにNATゲートウェイを作成し、同じサブネットのルートテーブルに設定する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。NATゲートウェイはプライベートサブネットからのアウトバウンド通信のみを中継し、インターネット側からの接続開始はできないため要件に合致します。NATゲートウェイ自体はIGWへ出られるパブリックサブネットに配置する必要があります。Bはインスタンスがインターネットから直接到達可能になり、要件に反します。Cは誤りで、インターネットゲートウェイはサブネットではなくVPCにアタッチするものです。DはNATゲートウェイの配置場所が誤っており、プライベートサブネットに置くとNATゲートウェイ自体がインターネットへ出られず機能しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html",
  },
  {
    id: "basics-ch04-q03",
    domain: null,
    topic: "ネットワークACL",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のWebサーバーに対し、特定のIPアドレスから不正アクセスの試行が続いています。このIPアドレスからのすべての通信をサブネットのレベルでブロックする最も適切な方法はどれですか。",
    choices: [
      "セキュリティグループに該当IPアドレスの拒否ルールを追加する",
      "ルートテーブルから該当IPアドレス宛てのルートを削除する",
      "インターネットゲートウェイをVPCからデタッチする",
      "ネットワークACLに該当IPアドレスからの通信を拒否するルールを追加する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。ネットワークACLは許可と拒否の両方のルールを記述できるサブネット単位のファイアウォールで、特定の送信元IPアドレスを明示的にブロックする用途に適しています。Aは実現不可能で、セキュリティグループには許可ルールしか記述できず、拒否ルールは作成できません。Bのルートテーブルは宛先に基づいてパケットの送り先を決める仕組みであり、送信元IPアドレスに基づくブロックはできません。Cはインターネットとの接続を丸ごと遮断する操作で、正当な利用者の通信まで止めてしまうため対策として不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-network-acls.html",
  },
  {
    id: "basics-ch04-q04",
    domain: null,
    topic: "ネットワークACL",
    type: "single",
    difficulty: "hard",
    question:
      "あるエンジニアが、セキュリティ強化のためサブネットのネットワークACLをデフォルトから変更し、インバウンドはHTTPS(443)のみ許可、アウトバウンドはすべて拒否に設定しました。その結果、クライアントからWebサーバーへの接続がタイムアウトするようになりました。原因として最も適切なものはどれですか。",
    choices: [
      "ネットワークACLはインバウンドとアウトバウンドに同一番号のルールを設定する必要があるため",
      "ネットワークACLはステートレスであり、応答トラフィックのためにエフェメラルポート宛てのアウトバウンド許可が必要なため",
      "ネットワークACLはステートフルであり、443の許可がアウトバウンドへ反映されるまでに時間がかかるため",
      "HTTPSの通信はセキュリティグループでのみ制御でき、ネットワークACLでは許可できないため",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。ネットワークACLはステートレスなため、インバウンドを許可しても戻りの通信が自動的に許可されることはありません。クライアントはエフェメラルポート(1024〜65535)で応答を受け取るため、その範囲へのアウトバウンド許可がないと応答が返れずタイムアウトします。Aのような同一番号ルールの要件は存在しません。Cは前提が誤りで、ステートフルなのはセキュリティグループであり、ネットワークACLに自動反映の仕組みはありません。Dも誤りで、ネットワークACLはポート443を含む任意のポートの通信を許可・拒否できます。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-network-acls.html",
  },
  {
    id: "basics-ch04-q05",
    domain: null,
    topic: "VPCエンドポイント",
    type: "single",
    difficulty: "medium",
    question:
      "プライベートサブネットのEC2インスタンスがAmazon S3のバケットと大量のデータをやり取りしています。現在はNATゲートウェイ経由で通信しており、データ処理料金が高額になっています。インターネットを経由せず、追加コストを最小限に抑えてS3へアクセスする方法はどれですか。",
    choices: [
      "S3用のインターフェイスエンドポイントを各AZに作成する",
      "NATゲートウェイを各AZに増設して転送効率を高める",
      "S3用のゲートウェイエンドポイントを作成し、プライベートサブネットのルートテーブルに関連付ける",
      "インスタンスをパブリックサブネットへ移動し、インターネットゲートウェイ経由でアクセスする",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ゲートウェイエンドポイントはS3とDynamoDBに対応したVPCエンドポイントで、ルートテーブルへの設定だけでインターネットを経由せずにアクセスでき、追加料金もかかりません。NATゲートウェイの処理料金の削減とセキュリティ向上を同時に実現できる定番パターンです。Aのインターフェイスエンドポイントでも要件は満たせますが、時間課金とデータ処理料金が発生するため「追加コスト最小」に反します。BはNATの処理料金がかかり続けるうえ、増設分のコストも上乗せされます。Dはインターネット経由になるため要件に反し、セキュリティも低下します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
  },
  {
    id: "basics-ch04-q06",
    domain: null,
    topic: "セキュリティグループ",
    type: "multiple",
    difficulty: "medium",
    question:
      "VPC内の通信制御を設計するにあたり、セキュリティグループの特性として正しいものはどれですか。(2つ選択してください)",
    choices: [
      "サブネット単位で適用される",
      "拒否ルールを設定して特定のIPアドレスをブロックできる",
      "ステートフルであり、許可した通信への戻りの通信は自動的に許可される",
      "ルール番号の小さい順に評価され、最初に一致したルールが適用される",
      "送信元として別のセキュリティグループを指定できる",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。セキュリティグループはステートフルなため、許可した通信への応答はルールに関係なく自動的に許可されます。また送信元にはCIDRだけでなく別のセキュリティグループを指定でき、ALBからWebサーバーへのような多層構成の通信制御に活用できます。A、B、DはいずれもネットワークACLの特性です。セキュリティグループはインスタンス(ENI)単位で適用され、記述できるのは許可ルールのみで、番号順ではなくすべてのルールを評価して判断します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-security-groups.html",
  },
  {
    id: "basics-ch05-q01",
    domain: null,
    topic: "S3",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、複数システムのバックアップファイルの保存先としてAmazon S3の採用を検討しています。S3の特性の説明として正しいものはどれですか。",
    choices: [
      "S3 Standardに保存したオブジェクトは、同一リージョン内の複数のアベイラビリティーゾーンに自動的に冗長化される",
      "バケット名は同じリージョン内で一意であればよく、他リージョンとの重複は許される",
      "オブジェクトはOSにブロックデバイスとしてマウントして読み書きする",
      "1つのバケットに保存できる合計容量は5TBまでに制限される",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。S3 Standardはオブジェクトを複数AZへ自動的に冗長化して保存し、イレブンナイン(99.999999999%)の耐久性を実現するため、バックアップの保存先に適しています。Bは誤りで、バケット名は全世界で一意である必要があります。Cも誤りで、S3はHTTPSベースのAPIでアクセスするオブジェクトストレージであり、OSにマウントして使うブロックストレージとは性質が異なります。Dの5TBは1オブジェクトの最大サイズに関する制限であり、バケット全体の容量は実質無制限です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Welcome.html",
  },
  {
    id: "basics-ch05-q02",
    domain: null,
    topic: "S3ストレージクラス",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のデータレイクには、部門ごとにアクセス頻度が大きく異なり、今後のアクセスパターンも予測できないデータが保存されています。運用の手間をかけずにストレージコストを最適化できるストレージクラスはどれですか。",
    choices: [
      "S3 Standard-IA",
      "S3 One Zone-IA",
      "S3 Glacier Flexible Retrieval",
      "S3 Intelligent-Tiering",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。S3 Intelligent-Tieringはオブジェクトごとのアクセスパターンを監視し、頻度に応じて自動的に最適な階層へ移動するクラスで、取り出し料金もかからないため、アクセスパターンが不明・変化するデータに最適です。AのStandard-IAは低頻度アクセスが確実なデータ向けで、頻繁にアクセスされるデータには取り出し料金がかさみます。BのOne Zone-IAは単一AZ保存で耐障害性が下がるため、再作成可能なデータに限定すべきクラスです。CのGlacier Flexible Retrievalは取り出しに数分〜数時間かかるアーカイブ用で、日常的にアクセスされ得るデータには不向きです。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html",
  },
  {
    id: "basics-ch05-q03",
    domain: null,
    topic: "S3ストレージクラス",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業は法規制により、取引記録を7年間保管する必要があります。保管中のデータへのアクセスはほぼ発生せず、監査時の取り出しは12時間以上待つことが許容されています。最もコストの低いストレージクラスはどれですか。",
    choices: [
      "S3 Standard",
      "S3 Glacier Deep Archive",
      "S3 Intelligent-Tiering",
      "S3 Glacier Instant Retrieval",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。S3 Glacier Deep ArchiveはS3の中で最も保存料金が低いクラスで、取り出しに標準で最大12時間かかる代わりに、規制対応の長期保管のようにほぼアクセスしないデータの保管コストを最小化できます。AのStandardは高頻度アクセス向けで、7年間の保管には割高です。CのIntelligent-Tieringはアクセスパターンが不明な場合に有効ですが、ほぼアクセスしないと確定しているデータならDeep Archiveのほうが安価です。DのGlacier Instant Retrievalはミリ秒での取り出しが可能な分、保存料金がDeep Archiveより高く、半日待てる本要件には過剰です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html",
  },
  {
    id: "basics-ch05-q04",
    domain: null,
    topic: "S3バージョニング",
    type: "single",
    difficulty: "hard",
    question:
      "バージョニングが有効なS3バケットで、運用担当者が誤って重要なオブジェクトを削除しました。この直後のバケットの状態と復旧可能性について、正しい説明はどれですか。",
    choices: [
      "オブジェクトとすべての過去バージョンが完全に削除されており、復旧はできない",
      "最新バージョンのみが完全に削除され、1つ前のバージョンが自動的に最新として公開される",
      "削除マーカーが追加されただけで過去バージョンは保持されており、削除マーカーを取り除けば復旧できる",
      "削除と同時にバージョニングが停止されるため、手動で再有効化しない限り復旧できない",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。バージョニングが有効なバケットでの通常の削除操作は、データを消すのではなく「削除マーカー」を最新バージョンとして追加する動作になります。過去バージョンはそのまま保持されているため、削除マーカーを削除すれば元のオブジェクトが再び取得できるようになります。Aは誤りで、完全に削除するにはバージョンIDを指定した削除が必要です。Bのような自動昇格の動作はなく、削除マーカーが最新である間は通常の取得リクエストにエラーが返ります。Dのように削除操作によってバージョニングが停止されることはありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/DeleteMarker.html",
  },
  {
    id: "basics-ch05-q05",
    domain: null,
    topic: "S3暗号化",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のセキュリティポリシーでは、S3に保存する機密データの暗号化に使用する鍵について、利用履歴の監査と、鍵に対するアクセス制御を自社で行うことが求められています。最も適切なサーバー側暗号化の方式はどれですか。",
    choices: [
      "SSE-S3(S3が管理する鍵)",
      "HTTPSによる転送時の暗号化のみを使用する",
      "バケットのデフォルト暗号化を無効化し、暗号化せずに保存する",
      "SSE-KMS(カスタマーマネージドキー)",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。SSE-KMSでカスタマーマネージドキーを使用すると、キーポリシーによる鍵へのアクセス制御と、鍵の利用履歴の記録・監査が可能になり、要件を満たします。AのSSE-S3は鍵の管理がS3側で完結する手軽な方式ですが、鍵単位のアクセス制御や利用の監査はできません。Bの転送時の暗号化は通信経路を保護するだけで、保存時の暗号化と鍵管理の要件を満たしません。Cは暗号化そのものを放棄する選択であり、機密データの保護要件に真っ向から反します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/UsingKMSEncryption.html",
  },
  {
    id: "basics-ch05-q06",
    domain: null,
    topic: "S3アクセス制御",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業で、社内専用のS3バケットが誤って公開されるリスクを低減するよう指示がありました。実施すべき対策はどれですか。(2つ選択してください)",
    choices: [
      "バケットのバージョニングを有効化する",
      "アカウントおよびバケットのブロックパブリックアクセスを有効のまま維持する",
      "すべてのオブジェクトをSSE-KMSで暗号化する",
      "バケットポリシーを見直し、意図しない公開を許可するステートメントを削除する",
      "ライフサイクルルールで古いオブジェクトをGlacierへ移行する",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。ブロックパブリックアクセスは公開設定を強制的に無効化する安全装置で、公開が不要なバケットでは有効のまま維持するのが基本です。あわせてバケットポリシーやACLを見直し、公開を許可するステートメントを排除することで、意図しない公開を防げます。Aのバージョニングは誤削除・上書きへの対策であり、公開防止には寄与しません。Cの暗号化は保存データの保護策であり、アクセス権の公開範囲を制御するものではありません。Eのライフサイクルルールはコスト最適化の仕組みで、公開リスクとは無関係です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-control-block-public-access.html",
  },
  {
    id: "basics-ch06-q01",
    domain: null,
    topic: "インスタンスストア",
    type: "single",
    difficulty: "medium",
    question:
      "ある動画処理アプリケーションは、変換処理の途中で生成される一時ファイルのために、非常に高速なディスクI/Oを必要とします。一時ファイルは処理が終われば不要になり、失われても再生成できます。最も適切なストレージはどれですか。",
    choices: [
      "インスタンスストア",
      "Amazon EFS",
      "Amazon S3 Standard",
      "sc1(Cold HDD)のEBSボリューム",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。インスタンスストアはホスト物理サーバーに内蔵された一時ディスクで、ネットワークを介さないため非常に高速です。インスタンスの停止・終了でデータは失われますが、再生成できる一時ファイルであれば問題にならず、用途に合致します。BのEFSは複数インスタンスでの共有を目的とするNFSのファイルストレージで、ローカルディスクほどの低レイテンシは得られません。CのS3はAPIでアクセスするオブジェクトストレージで、ディスクとしてのI/O用途には不向きです。Dのsc1はアクセス頻度の低いデータ向けの低速なHDDで、高速I/Oの要件を満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/InstanceStorage.html",
  },
  {
    id: "basics-ch06-q02",
    domain: null,
    topic: "EBS",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業のミッションクリティカルなデータベースをEC2で稼働させます。ストレージには一貫した低レイテンシと、gp3の上限(16,000 IOPS)を大きく超えるIOPS性能が求められます。最も適切なEBSボリュームタイプはどれですか。",
    choices: [
      "gp3(汎用SSD)",
      "st1(スループット最適化HDD)",
      "sc1(Cold HDD)",
      "io2 Block Express(プロビジョンドIOPS SSD)",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。io2 Block Expressは指定したIOPSを保証するプロビジョンドIOPS SSDで、gp3の上限を超える高いIOPSと安定した低レイテンシが必要なミッションクリティカルなデータベースに適しています。Aのgp3はコスト効率に優れたほとんどのワークロードの第一候補ですが、要求されるIOPSが上限の16,000を超えるため対応できません。Bのst1は大容量のシーケンシャルアクセスに強いHDDで、ランダムI/Oが中心のデータベースには不向きです。Cのsc1はアクセス頻度の低いデータ向けの最安HDDで、性能要件をまったく満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html",
  },
  {
    id: "basics-ch06-q03",
    domain: null,
    topic: "EBSスナップショット",
    type: "single",
    difficulty: "medium",
    question:
      "ap-northeast-1aで稼働していたEC2インスタンスのEBSボリュームに保存されたデータを、ap-northeast-1cの新しいEC2インスタンスで利用する必要があります。最も適切な方法はどれですか。",
    choices: [
      "既存のボリュームをデタッチし、ap-northeast-1cのインスタンスにそのままアタッチする",
      "ボリュームのスナップショットを取得し、ap-northeast-1cで新しいボリュームとして復元してアタッチする",
      "io2のMulti-Attach機能を使って両方のAZのインスタンスに同時にアタッチする",
      "ボリュームの設定を変更してアベイラビリティーゾーン属性をap-northeast-1cに切り替える",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。EBSボリュームは作成されたAZ内のインスタンスにしかアタッチできないため、別のAZで使うにはスナップショットを取得し、目的のAZで新しいボリュームとして復元するのが標準手順です。スナップショットはAWS管理のS3領域に保存され、AZをまたいだ復元やリージョン間コピーに使えます。Aは不可能で、ボリュームを異なるAZのインスタンスへ直接アタッチすることはできません。CのMulti-Attachは同一AZ内の複数インスタンスへの同時アタッチ機能であり、AZをまたぐ用途には使えません。Dのような作成後にAZを変更する機能は存在しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-snapshots.html",
  },
  {
    id: "basics-ch06-q04",
    domain: null,
    topic: "EBS暗号化",
    type: "single",
    difficulty: "hard",
    question:
      "コンプライアンス監査で、稼働中のEC2インスタンスにアタッチされている未暗号化のEBSボリュームを、KMSで暗号化された状態に移行するよう指摘されました。適切な手順はどれですか。",
    choices: [
      "ボリュームの設定変更で暗号化オプションを有効に切り替える",
      "インスタンスを再起動し、アカウントのデフォルト暗号化設定を自動適用させる",
      "スナップショットを取得し、暗号化を有効にしてコピーしたうえで、そこから作成した新しいボリュームに置き換える",
      "暗号化済みの空のボリュームを追加でアタッチし、既存ボリュームのデータを自動的に暗号化させる",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。既存の未暗号化EBSボリュームをそのまま直接暗号化することはできません。スナップショットを取得し、暗号化を有効にしてコピーを作成し、その暗号化済みスナップショットから新しいボリュームを復元して既存ボリュームと置き換える手順を踏みます。Aのような設定変更による直接の暗号化機能は提供されていません。Bのデフォルト暗号化設定は新規に作成されるボリュームやスナップショットに適用されるもので、再起動しても既存ボリュームには影響しません。Dのように別ボリュームの暗号化状態が既存ボリュームのデータへ波及することはありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-encryption.html",
  },
  {
    id: "basics-ch06-q05",
    domain: null,
    topic: "EFS",
    type: "single",
    difficulty: "easy",
    question:
      "Auto Scalingにより台数が増減する複数のLinux EC2インスタンスから、同一のコンテンツディレクトリを同時に読み書きする必要があります。最も適切なストレージサービスはどれですか。",
    choices: [
      "Amazon EFS",
      "Amazon EBS(gp3)",
      "インスタンスストア",
      "Amazon FSx for Windows File Server",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Amazon EFSはNFSプロトコルで複数のインスタンスから同時にマウントできる共有ファイルストレージで、複数AZのインスタンスからも利用でき、容量も自動で伸縮するため、増減するLinuxサーバー群のコンテンツ共有に最適です。BのEBSは基本的に単一インスタンス専用のブロックストレージで、多数のインスタンスからの同時共有には対応できません。Cのインスタンスストアは各インスタンスに内蔵された一時ディスクで、共有もデータの永続化もできません。DのFSx for Windows File ServerはSMBプロトコルのWindows向けファイルサーバーで、LinuxのNFS共有にはEFSが適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/efs/latest/ug/whatis.html",
  },
  {
    id: "basics-ch06-q06",
    domain: null,
    topic: "FSx",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が2種類のワークロードをAWSへ移行します。1つはSMBプロトコルとActive Directory連携が必須のWindowsファイル共有、もう1つはS3上の学習データを高スループットで処理する機械学習ワークロードです。適切なサービスの組み合わせはどれですか。(2つ選択してください)",
    choices: [
      "Windowsファイル共有にAmazon FSx for Windows File Serverを使用する",
      "Windowsファイル共有にAmazon EFSを使用する",
      "機械学習ワークロードにAmazon EFSを使用する",
      "機械学習ワークロードにAmazon FSx for Lustreを使用する",
      "Windowsファイル共有にインスタンスストアを使用する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。FSx for Windows File ServerはSMBプロトコルとActive Directory連携をネイティブにサポートするフルマネージドのWindowsファイルサーバーで、1つ目の要件に合致します。FSx for LustreはHPCや機械学習向けの高スループットなファイルシステムで、S3と連携してデータを高速に処理できるため2つ目の要件に最適です。BのEFSはNFSプロトコルのLinux向けサービスで、SMBとAD連携の要件を満たせません。CのEFSも高スループット処理とS3連携の要件ではLustreに及びません。Eのインスタンスストアは一時ディスクであり、ファイルサーバーの用途には使えません。",
    reference: "https://aws.amazon.com/jp/fsx/",
  },
];
