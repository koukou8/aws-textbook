// AWS基礎 前半(第1〜6章)の章末確認問題
// ※現在はフェーズ1の動作確認用サンプル2問のみ。フェーズ2で全問に上書きされます。

export const questions = [
  {
    id: "basics-ch01-q01",
    domain: null,
    topic: "グローバルインフラストラクチャ",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業が、単一のAWSリージョン内でアプリケーションの可用性を高めたいと考えています。データセンター障害の影響を最小限にするための最も基本的な設計はどれですか。",
    choices: [
      "複数のエッジロケーションにEC2インスタンスを配置する",
      "複数のアベイラビリティーゾーンにEC2インスタンスを分散配置する",
      "同一アベイラビリティーゾーン内でインスタンスサイズを大きくする",
      "リージョンを2つ契約して同じAZ名を使用する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。アベイラビリティーゾーン(AZ)はリージョン内で物理的に分離されたデータセンター群であり、複数AZへの分散配置が単一データセンター障害への基本的な対策です。Aのエッジロケーションはコンテンツ配信用の拠点でありEC2インスタンスは配置できません。Cの垂直スケーリングでは障害の影響範囲は変わりません。Dの「リージョンを契約する」という概念はAWSに存在せず、AZ名はリージョンごとに独立しています。",
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
      "エッジロケーションを利用するAWSサービスはどれですか。(2つ選択してください)",
    choices: [
      "Amazon CloudFront",
      "Amazon EBS",
      "Amazon Route 53",
      "Amazon RDS",
      "AWS Backup",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。Amazon CloudFrontはエッジロケーションでコンテンツをキャッシュ配信するCDNサービスで、Amazon Route 53もエッジロケーションを使ってDNSクエリに低レイテンシで応答します。BのAmazon EBSはAZ内に存在するブロックストレージ、DのAmazon RDSはリージョン内で稼働するマネージドデータベース、EのAWS Backupはリージョン単位で動作するバックアップ管理サービスであり、いずれもエッジロケーションは利用しません。",
    reference: "https://aws.amazon.com/jp/cloudfront/features/",
  },
];
