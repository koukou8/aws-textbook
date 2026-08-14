// AI Practitioner問題集 分野5(AIソリューションのセキュリティ、コンプライアンス、ガバナンス)後半: aq-d5-015〜aq-d5-028
export const questions = [
  {
    id: "aq-d5-015",
    domain: 5,
    topic: "データアクセス制御の運用",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のML基盤で、プロジェクトを離れたメンバーの学習データへのアクセス権限が残ったままになっていたことが判明しました。同様の問題の再発を防ぐ運用として、最も適切なものはどれですか。",
    choices: [
      "権限管理を簡素化するため、全メンバーに同一の管理者権限を付与する",
      "アクセス権限を定期的に棚卸しし、不要になった権限を速やかに削除する",
      "個人ごとのIAMユーザーを廃止し、共有アカウントの認証情報をチームで使い回す",
      "アクセスログの記録を停止し、権限の変更履歴を残さないようにする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。最小権限の原則を維持するには、権限は付与して終わりではなく、定期的なレビュー(棚卸し)で業務上不要になった権限を特定し、速やかに削除する運用が必要です。異動や退職に伴う権限の削除漏れは、データ漏えいの典型的な原因になります。Aの全員への管理者権限の付与は、最小権限の原則に真っ向から反します。Cの共有アカウントの使い回しは、誰が操作したかを特定できなくし、説明責任を果たせなくします。Dのログ記録の停止は監査証跡を失わせる行為であり、ガバナンスの観点から不適切です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html",
  },
  {
    id: "aq-d5-016",
    domain: 5,
    topic: "ISO/IEC 27001",
    type: "single",
    difficulty: "easy",
    question:
      "AIソリューションを提供する企業が、コンプライアンス対応の一環としてISO/IEC 27001への準拠を検討しています。ISO/IEC 27001はどのような規格ですか。",
    choices: [
      "クレジットカード会員データを保護するための業界セキュリティ基準",
      "製品やサービスの品質マネジメントシステムに関する国際規格",
      "情報セキュリティマネジメントシステム(ISMS)の要求事項を定めた国際規格",
      "財務報告に関する内部統制を評価するための監査基準",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ISO/IEC 27001は、組織が情報資産を保護するための情報セキュリティマネジメントシステム(ISMS)の確立・運用・継続的改善の要求事項を定めた国際規格です。AWS自身も認証を取得しており、顧客はAWS ArtifactからISO関連の認証資料を入手できます。Aのカード会員データを保護する業界基準はPCI DSSの説明です。Bの品質マネジメントシステムの規格はISO 9001であり、情報セキュリティが主題ではありません。Dの財務報告に関する内部統制の評価はSOC 1レポートなどが対応する領域で、ISO/IEC 27001の目的とは異なります。",
    reference: "https://aws.amazon.com/jp/compliance/iso-27001-faqs/",
  },
  {
    id: "aq-d5-017",
    domain: 5,
    topic: "SOC 2レポート",
    type: "single",
    difficulty: "easy",
    question:
      "AIサービスの顧客企業から、コンプライアンス確認のためにSOC 2レポートについて説明を求められました。SOC 2レポートの説明として正しいものはどれですか。",
    choices: [
      "セキュリティや可用性などに関する組織の内部統制を、独立した第三者の監査人が評価した報告書",
      "組織のクラウド利用料金を分析し、コスト削減の推奨事項をまとめた報告書",
      "アプリケーションに対する脆弱性診断の結果をまとめた技術レポート",
      "機械学習モデルの精度や公平性を評価したベンチマーク報告書",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。SOC 2は、セキュリティ、可用性、処理のインテグリティ、機密保持、プライバシーというトラストサービス基準に基づいて、サービスを提供する組織の内部統制を独立した監査人が評価した報告書です。AWSのSOCレポートはAWS Artifactから入手でき、顧客は自社の監査でAWS基盤の統制状況の確認に利用できます。Bの利用料金の分析はSOCレポートの対象ではなく、Cost Explorerなどが担う領域です。Cの脆弱性診断の結果はSOC 2の枠組みとは別物です。Dのモデルのベンチマークも、SOC 2が扱う内部統制の評価とは無関係です。",
    reference: "https://aws.amazon.com/jp/compliance/soc-faqs/",
  },
  {
    id: "aq-d5-018",
    domain: 5,
    topic: "ConfigとCloudTrailの違い",
    type: "single",
    difficulty: "medium",
    question:
      "AIワークロードのガバナンスで利用する、AWS ConfigとAWS CloudTrailの役割の違いの説明として正しいものはどれですか。",
    choices: [
      "AWS Configはソフトウェアの脆弱性を検出し、AWS CloudTrailはS3内の機密データを検出する",
      "AWS Configはリソースの構成と変更履歴を記録してルールへの準拠を評価し、AWS CloudTrailは誰がどのAPI操作を行ったかを記録する",
      "AWS ConfigはAPI操作の履歴を記録し、AWS CloudTrailはリソース構成のルールへの準拠を評価する",
      "AWS ConfigはAWSのコンプライアンスレポートを提供し、AWS CloudTrailは監査証拠を自動収集してアセスメントを作成する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。AWS Configは「リソースがどのような設定になっているか」という構成情報と変更履歴を記録し、Configルールであるべき構成への準拠を自動評価します。AWS CloudTrailは「誰が・いつ・どのAPI操作を行ったか」というアクティビティを記録します。Aの脆弱性検出はAmazon Inspector、機密データ検出はAmazon Macieの役割です。Cは2つのサービスの役割が逆になっています。Dのコンプライアンスレポートの提供はAWS Artifact、監査証拠の自動収集はAWS Audit Managerの役割です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/WhatIsConfig.html",
  },
  {
    id: "aq-d5-019",
    domain: 5,
    topic: "ガバナンスプロトコル",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が生成AIの全社的な活用に向けて、ガバナンス体制を整備しています。ガバナンスプロトコルの取り組みとして適切なものはどれですか。(2つ選択してください)",
    choices: [
      "一度承認したAIユースケースは、その後の見直しを行わず恒久的に利用を許可する",
      "ガバナンスに関する判断は、各開発者の個人の裁量に完全に委ねる",
      "AI利用に関するポリシーを文書化し、定期的なレビューサイクルを設けて内容を見直す",
      "インシデントが実際に発生するまで、ポリシーの策定は行わない",
      "従業員に対して、AIの適切な利用とリスクに関するトレーニングを実施する",
    ],
    answerIndexes: [2, 4],
    explanation:
      "正解はCとEです。ガバナンスプロトコルでは、AI利用に関するポリシーを文書化し、技術や規制の変化に合わせて定期的なレビューサイクルで見直すことが基本です。また、ポリシーを実効性のあるものにするには、従業員がAIのリスクと適切な利用方法を理解している必要があるため、チームトレーニングの要件を定めて実施することも重要な要素です。Aの恒久的な許可は、モデルや規制の変化に対応できないため不適切です。Bの個人裁量への一任は、組織としての一貫した統制の放棄にあたります。Dのインシデント発生までの放置は、予防を重視するガバナンスの考え方に反します。",
    reference: "https://aws.amazon.com/jp/ai/responsible-ai/",
  },
  {
    id: "aq-d5-020",
    domain: 5,
    topic: "データレジデンシー",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業では、国内の規制により、AIの学習に使用する顧客データを自国内に保存することが義務付けられています。この「データの保存場所を特定の国や地域に限定する」要件を指す用語はどれですか。",
    choices: [
      "データリネージ",
      "データマスキング",
      "データオーグメンテーション(データ拡張)",
      "データレジデンシー",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。データレジデンシーは、データを物理的に保存する場所を特定の国や地域に限定する要件を指します。AWSではデータを保存するリージョンを顧客が選択でき、顧客が明示的に移動しない限りデータがリージョン外へ複製されることはないため、リージョンの選択とアクセス統制によってレジデンシー要件に対応できます。Aのデータリネージは、データの出所や変換の来歴を追跡する概念です。Bのデータマスキングは、機密項目を伏せ字などに置き換える保護手法です。Cのデータオーグメンテーションは学習データを加工して量を増やす手法で、保存場所の要件とは無関係です。",
    reference: "https://aws.amazon.com/jp/compliance/data-privacy-faq/",
  },
  {
    id: "aq-d5-021",
    domain: 5,
    topic: "モデル呼び出しのログ記録",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業がAmazon Bedrockで生成AIアプリケーションを運用しています。ガバナンス要件として、モデルへの入力プロンプトと出力の内容を記録し、後から監査できるようにする必要があります。最も適切な方法はどれですか。",
    choices: [
      "AWS Artifactからモデルの利用履歴レポートをダウンロードする",
      "AWS Trusted Advisorのセキュリティチェックを有効化する",
      "Amazon Bedrockのモデル呼び出しのログ記録を有効化し、Amazon S3やCloudWatch Logsに保存する",
      "Amazon Inspectorでモデルの入出力を継続的にスキャンする",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon Bedrockのモデル呼び出しのログ記録を有効化すると、モデルへの入力プロンプト、出力、メタデータをAmazon S3やCloudWatch Logsに保存できます。利用状況の監査や不適切な利用の調査に活用できます。AのAWS ArtifactはAWS自身のコンプライアンスレポートを入手するサービスで、顧客のモデル利用履歴は提供しません。BのTrusted Advisorはベストプラクティスからの乖離をチェックする機能で、入出力の記録はできません。DのInspectorはソフトウェア脆弱性のスキャンを行うサービスで、モデルの入出力を記録する機能はありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/bedrock/latest/userguide/model-invocation-logging.html",
  },
  {
    id: "aq-d5-022",
    domain: 5,
    topic: "スコーピングマトリックスの考え方",
    type: "single",
    difficulty: "hard",
    question:
      "生成AIセキュリティスコーピングマトリックスは、生成AIの利用形態をスコープ1(消費者向けアプリの利用)からスコープ5(自社データによる独自モデルのトレーニング)までの5段階に分類します。スコープの番号が大きくなるにつれて、一般的に何が変化しますか。",
    choices: [
      "セキュリティの検討事項はすべてのスコープで同一であり、変化しない",
      "顧客が所有・管理する範囲が広がり、顧客が担うべきセキュリティとガバナンスの統制が増える",
      "AWSがモデルとデータの管理をすべて引き受けるため、顧客の責任は減っていく",
      "スコープの番号が大きいユースケースほど、機密データを扱えなくなる",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。スコーピングマトリックスでは、既製の生成AIアプリの利用(スコープ1〜2)から、事前トレーニング済みモデルの活用、ファインチューニング、独自モデルのトレーニング(スコープ5)へ進むにつれて、モデルや学習データなど顧客が所有・管理する要素が増えます。それに伴い、データ保護、アクセス制御、モデルのガバナンスといった顧客側で検討・実装すべき統制の範囲も広がります。Aの「同一」は誤りで、スコープごとに検討の深さが変わることがこの枠組みの主旨です。Cは変化の方向が逆で、顧客の責任はむしろ増えます。Dのような機密データの取り扱い可否を定める分類ではありません。",
    reference:
      "https://aws.amazon.com/jp/ai/generative-ai/security/scoping-matrix/",
  },
  {
    id: "aq-d5-023",
    domain: 5,
    topic: "コンプライアンスの責任分担",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業が、ISOやSOCなどの基準への準拠が求められるAIサービスをAWS上で構築します。コンプライアンス対応の取り組みとして適切なものはどれですか。(2つ選択してください)",
    choices: [
      "AWS ArtifactからAWSの認証・監査レポートを入手し、自社の監査対応の資料として活用する",
      "AWSが認証を取得しているため、自社のアプリケーションやデータに関する統制は不要と判断する",
      "AWSのデータセンターへ立ち入り、物理的セキュリティを自社で直接検査する",
      "自社が管理する範囲(データ保護やアクセス制御など)の統制を実装し、AWS Audit Managerなどで準拠状況の証拠を継続的に収集・評価する",
      "コンプライアンス対応の検討は、サービスの一般公開後に開始する",
    ],
    answerIndexes: [0, 3],
    explanation:
      "正解はAとDです。コンプライアンスも責任共有の考え方で成り立ちます。AWS側の統制はAWS Artifactから第三者監査のレポートを入手して確認し、自社の監査資料として活用します。自社が管理する範囲(データ保護、アクセス制御、アプリケーション設定など)は自ら統制を実装し、AWS Audit Managerなどで準拠の証拠を継続的に収集・評価します。BはAWSの認証が対象とするのは基盤部分であり、顧客側の統制が不要になるわけではないため誤りです。Cのデータセンターへの立ち入り検査はできず、監査レポートで代替します。Eの後回しは、手戻りと違反リスクを高める不適切な進め方です。",
    reference: "https://aws.amazon.com/jp/compliance/",
  },
  {
    id: "aq-d5-024",
    domain: 5,
    topic: "検査サービスの使い分け",
    type: "single",
    difficulty: "medium",
    question:
      "AIアプリケーション環境のセキュリティとガバナンスを強化するため、次の3つの要件があります。(1) EC2インスタンスやコンテナイメージのソフトウェア脆弱性の継続的な検出、(2) S3に保存された学習データ内の個人情報の検出、(3) コスト最適化やセキュリティなどのベストプラクティスからの乖離のチェック。(1)〜(3)に対応するサービスの組み合わせとして正しいものはどれですか。",
    choices: [
      "(1) Amazon Inspector、(2) Amazon Macie、(3) AWS Trusted Advisor",
      "(1) Amazon Macie、(2) Amazon Inspector、(3) AWS Trusted Advisor",
      "(1) AWS Trusted Advisor、(2) Amazon Macie、(3) Amazon Inspector",
      "(1) Amazon Inspector、(2) AWS Trusted Advisor、(3) Amazon Macie",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Amazon InspectorはEC2やコンテナイメージ、Lambda関数を対象にソフトウェア脆弱性(CVE)や意図しないネットワーク公開を継続的にスキャンするため(1)に対応します。Amazon MacieはS3内のデータを分析して個人情報などの機密データを検出するため(2)に対応します。AWS Trusted Advisorはコスト最適化やセキュリティなどの観点でベストプラクティスからの乖離をチェックし推奨事項を提示するため(3)に対応します。BとCとDはいずれもサービスの役割の対応が入れ替わっており、各要件を満たせません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/inspector/latest/user/what-is-inspector.html",
  },
  {
    id: "aq-d5-025",
    domain: 5,
    topic: "アルゴリズム説明責任",
    type: "single",
    difficulty: "hard",
    question:
      "ローン審査を自動化するAIシステムを提供する企業が、アルゴリズム説明責任法のような規制の考え方に沿った対応を準備しています。この種の規制が企業に求める中心的な取り組みはどれですか。",
    choices: [
      "審査モデルの推論速度を一定の水準以上に保つこと",
      "審査モデルのソースコードをすべて一般公開すること",
      "審査結果のログを暗号化して保存すること",
      "自動化された意思決定がバイアスやプライバシーに与える影響を評価し、文書化して説明できるようにすること",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。アルゴリズム説明責任法に代表される規制の枠組みは、雇用や与信のような重要な意思決定を自動化するシステムに対して、バイアス・公平性・プライバシーなどへの影響評価(インパクトアセスメント)の実施と、その結果の文書化・説明責任を企業に求めるものです。SageMaker ClarifyやModel Cardsなどが対応を支援します。Aの推論速度は性能要件であり、規制の主眼ではありません。Bのソースコードの全面公開までは求められておらず、求められるのは影響の評価と透明性の確保です。Cのログの暗号化は重要なセキュリティ対策ですが、それだけでは影響評価と説明責任の要求には応えられません。",
    reference: "https://aws.amazon.com/jp/compliance/",
  },
  {
    id: "aq-d5-026",
    domain: 5,
    topic: "AWS Artifactの機能",
    type: "single",
    difficulty: "easy",
    question: "AWS Artifactが提供する機能の説明として正しいものはどれですか。",
    choices: [
      "AWSが取得した認証・監査レポートのダウンロードと、AWSとの契約(NDAや事業提携契約など)の確認・管理",
      "自社のAWSリソースに対する脆弱性の継続的なスキャン",
      "業界標準フレームワークに沿った自社の監査証拠の自動収集とアセスメント作成",
      "S3バケット内に保存された機密データの検出と分類",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。AWS Artifactは、AWSが第三者監査で取得したSOCレポートやISO認証などのコンプライアンスレポートをオンデマンドでダウンロードできるほか、秘密保持契約(NDA)や事業提携契約(BAA)といったAWSとの契約の確認・締結・管理も行えるセルフサービスのポータルです。Bの脆弱性スキャンはAmazon Inspectorの機能です。Cの自社の監査証拠の自動収集とアセスメント作成はAWS Audit Managerの役割で、Artifactの対象はあくまでAWS側の監査資料です。Dの機密データの検出と分類はAmazon Macieの機能です。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/artifact/latest/ug/what-is-aws-artifact.html",
  },
  {
    id: "aq-d5-027",
    domain: 5,
    topic: "運用サービスの使い分け",
    type: "single",
    difficulty: "hard",
    question:
      "AIワークロードの運用で、次の3つの要件があります。(1) 推論エンドポイントのエラー率やレイテンシーといったメトリクスの監視、(2) リソースを削除した操作者と日時の特定、(3) 「S3バケットの暗号化が有効か」などの構成ルールへの準拠評価。(1)〜(3)に対応するサービスの組み合わせとして正しいものはどれですか。",
    choices: [
      "(1) AWS CloudTrail、(2) AWS Config、(3) Amazon CloudWatch",
      "(1) AWS Config、(2) Amazon CloudWatch、(3) AWS CloudTrail",
      "(1) Amazon CloudWatch、(2) AWS CloudTrail、(3) AWS Config",
      "(1) Amazon CloudWatch、(2) AWS Config、(3) AWS CloudTrail",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。エラー率やレイテンシーなどのメトリクスの収集・監視・アラームは(1)Amazon CloudWatchの役割です。「誰が・いつ・どのAPI操作を行ったか」という操作者の特定は(2)AWS CloudTrailのイベント記録で行います。「あるべき構成」への準拠を継続的に評価するのは(3)AWS ConfigのConfigルールです。AとBは役割の対応が入れ替わっており、CloudTrailにメトリクス監視の機能はなく、CloudWatchは操作者の記録を目的としません。Dは(2)と(3)が逆で、操作者の特定はConfigではなくCloudTrailで行います。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
  },
  {
    id: "aq-d5-028",
    domain: 5,
    topic: "データライフサイクルと削除",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業のAI基盤に対して、顧客から個人データの削除要求がありました。対象のデータは、元のS3バケットのほか、前処理済みデータセットや分析用のコピーにも含まれている可能性があります。削除要求へ確実に対応するためのデータガバナンス上の取り組みとして、最も適切なものはどれですか。",
    choices: [
      "元のS3バケットのオブジェクトのみを削除し、コピーはいずれ期限切れになると想定して放置する",
      "データカタログとデータリネージで複製・派生データを含む保存場所を追跡し、データライフサイクル全体で保持と削除を管理する",
      "データを削除する代わりに、バケットへのアクセスを一時的に制限する",
      "削除要求に備えて、今後は個人データの保存場所の記録を作成しないようにする",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。削除要求へ確実に対応するには、データがどこに複製・派生して存在するかを把握できることが前提になります。データカタログとデータリネージで所在と来歴を追跡し、収集から削除までのデータライフサイクルとして保持期間や削除手順を管理していれば、対象データを漏れなく特定して削除できます。Aの元データのみの削除では、コピーや派生データに個人データが残り、要求に応えたことになりません。Cのアクセス制限は削除ではなく、データは保持されたままです。Dの記録を作らない方針は所在の特定を不可能にし、対応能力そのものを失わせるため不適切です。",
    reference: "https://aws.amazon.com/jp/what-is/data-governance/",
  },
];
