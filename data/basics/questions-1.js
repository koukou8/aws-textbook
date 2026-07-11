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
];
