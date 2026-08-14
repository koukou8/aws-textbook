// AIF-C01教材 分野1(AIとMLの基礎)の確認問題
export const questions = [
  // ===== aif-d1-ch01: AIの基本概念と用語 =====
  {
    id: "aif-d1-ch01-q01",
    domain: 1,
    topic: "AI・ML・深層学習",
    type: "single",
    difficulty: "easy",
    question:
      "AI(人工知能)、機械学習(ML)、深層学習の関係を正しく説明しているものはどれですか。",
    choices: [
      "機械学習は深層学習の一分野であり、深層学習はAIの一分野である",
      "AIと機械学習は同じ意味の用語であり、深層学習だけが独立した別の技術である",
      "機械学習はAIの一分野であり、深層学習は機械学習の一分野である",
      "AIは機械学習の一分野であり、機械学習は深層学習の一分野である",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。AIは人間の知的な振る舞いを実現する技術の総称であり、その実現手段の1つとしてデータからパターンを学習するMLがあります。深層学習は多層ニューラルネットワークを用いるMLの一手法で、AI⊃ML⊃深層学習という包含関係になります。Aは機械学習と深層学習の包含関係が逆です。BはAIとMLを同義としていますが、MLはAIの部分集合であり同義ではありません。Dは包含関係全体が逆になっており誤りです。",
    reference: "https://aws.amazon.com/jp/what-is/deep-learning/",
  },
  {
    id: "aif-d1-ch01-q02",
    domain: 1,
    topic: "トレーニングと推論",
    type: "single",
    difficulty: "easy",
    question: "機械学習における「推論」の説明として最も適切なものはどれですか。",
    choices: [
      "トレーニング済みのモデルに新しいデータを入力し、予測結果を得るプロセス",
      "ラベル付きデータを使ってモデルのパラメータを調整するプロセス",
      "データセットから欠損値や異常値を取り除くプロセス",
      "テストデータに対するモデルの精度を評価指標で測定するプロセス",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。推論は、トレーニングで完成したモデルを実際に使い、新しい入力データに対して予測や判定を生成する工程です。Bはラベル付きデータからモデルのパラメータを調整する工程であり、トレーニング(学習)の説明です。Cはデータ前処理の説明で、トレーニングの前段階の作業です。Dはモデル評価の説明で、デプロイ前に性能を確認する工程です。「トレーニング=学ぶ工程、推論=使う工程」という対比を押さえてください。",
    reference: "https://aws.amazon.com/jp/what-is/machine-learning/",
  },
  {
    id: "aif-d1-ch01-q03",
    domain: 1,
    topic: "自然言語処理(NLP)",
    type: "single",
    difficulty: "easy",
    question:
      "自然言語処理(NLP)を活用するユースケースとして最も適切なものはどれですか。",
    choices: [
      "製造ラインのカメラ画像から不良品を検出する",
      "顧客レビューのテキストを分析してポジティブ・ネガティブの感情を判定する",
      "過去の売上データから来月の販売数量を予測する",
      "設備センサーの数値データから故障の予兆を検知する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。NLPは人間が日常的に使う言語(テキストや音声)をコンピュータが理解・分析・生成する技術で、レビューのテキストからポジティブ・ネガティブを判定する感情分析は代表的な応用です。Aは画像データを扱うためコンピュータビジョンの領域です。Cは数値データから連続値を予測する回帰のユースケースです。Dはセンサーの数値データを使った異常検知であり、いずれも言語データを扱わないためNLPには該当しません。",
    reference: "https://aws.amazon.com/jp/what-is/nlp/",
  },
  {
    id: "aif-d1-ch01-q04",
    domain: 1,
    topic: "教師あり学習",
    type: "single",
    difficulty: "medium",
    question:
      "ある企業は、過去のメールに「スパム」「非スパム」のラベルを付けたデータセットを保有しており、これを使って新着メールを自動で振り分けるモデルを構築します。この学習方式はどれですか。",
    choices: ["教師なし学習", "強化学習", "クラスタリング", "教師あり学習"],
    answerIndexes: [3],
    explanation:
      "正解はDです。「スパム」「非スパム」という正解ラベルの付いたデータから入力と出力の対応関係を学ぶのは教師あり学習で、このケースは二値分類の典型例です。Aの教師なし学習はラベルのないデータから構造やグループを発見する方式で、ラベルが既にある本ケースには該当しません。Bの強化学習は環境からの報酬を手がかりに試行錯誤で行動を学ぶ方式です。Cのクラスタリングは教師なし学習に属する手法の名前であり、ラベル付きデータによる振り分けには使いません。",
    reference:
      "https://aws.amazon.com/jp/compare/the-difference-between-machine-learning-supervised-and-unsupervised/",
  },
  {
    id: "aif-d1-ch01-q05",
    domain: 1,
    topic: "教師なし学習",
    type: "single",
    difficulty: "medium",
    question:
      "ECサイトの運営会社が、ラベルの付いていない購買履歴データから、類似した行動パターンを持つ顧客のグループを発見したいと考えています。最も適切な学習方式はどれですか。",
    choices: ["教師なし学習", "教師あり学習", "強化学習", "線形回帰"],
    answerIndexes: [0],
    explanation:
      "正解はAです。ラベルの付いていないデータから、データ自体に潜む構造や類似グループを発見するのは教師なし学習で、顧客セグメンテーションはクラスタリングによる代表的なユースケースです。Bの教師あり学習は正解ラベル付きデータが前提のため、ラベルがない本ケースには適用できません。Cの強化学習は環境からの報酬を最大化する行動を学ぶ方式で、グループの発見には使いません。Dの線形回帰は教師あり学習で連続値を予測する手法であり、グループ分けはできません。",
    reference:
      "https://aws.amazon.com/jp/compare/the-difference-between-machine-learning-supervised-and-unsupervised/",
  },
  {
    id: "aif-d1-ch01-q06",
    domain: 1,
    topic: "過学習",
    type: "single",
    difficulty: "medium",
    question:
      "あるMLモデルは、トレーニングデータに対しては99%の精度を示しますが、新しいデータに対しては60%程度の精度しか出ません。この状態を表す用語はどれですか。",
    choices: [
      "アンダーフィッティング(学習不足)",
      "データドリフト",
      "オーバーフィッティング(過学習)",
      "バイアス",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。トレーニングデータのノイズや細部まで過剰に学習してしまい、トレーニングデータでは高精度なのに未知のデータへの汎化性能が大きく落ちる状態がオーバーフィッティング(過学習)です。Aのアンダーフィッティングはモデルがパターンを捉えられず、トレーニングデータに対しても精度が低くなる状態なので症状が一致しません。Bのデータドリフトは本番運用中に入力データの分布が変化して精度が落ちる現象です。Dのバイアスはデータや予測の偏りを指す概念で、この症状の名称ではありません。",
    reference: "https://aws.amazon.com/jp/what-is/overfitting/",
  },
  {
    id: "aif-d1-ch01-q07",
    domain: 1,
    topic: "バッチ推論",
    type: "single",
    difficulty: "medium",
    question:
      "小売企業が、数百万件の顧客データに対する購入予測スコアを毎晩まとめて更新したいと考えています。即時の応答は不要で、コスト効率を重視します。最も適切な推論方式はどれですか。",
    choices: [
      "リアルタイム推論",
      "バッチ推論",
      "継続的なオンライン学習",
      "エッジデバイスでの推論",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。数百万件をまとめて処理し、即時応答が不要で、コスト効率を重視する夜間の定期実行にはバッチ推論が最適です。ジョブの実行中だけリソースを使うため、エンドポイントの常時稼働が不要です。Aのリアルタイム推論は低レイテンシーの即時応答が必要な場合の方式で、常時稼働のコストがかかるため本要件では非効率です。Cのオンライン学習は推論方式ではなく、モデルを逐次更新していく学習の話です。Dのエッジ推論はデバイス上で推論を行う形態で、夜間の一括処理という要件に合いません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/batch-transform.html",
  },
  {
    id: "aif-d1-ch01-q08",
    domain: 1,
    topic: "データの種類",
    type: "multiple",
    difficulty: "medium",
    question: "非構造化データに分類されるものを2つ選択してください。",
    choices: [
      "リレーショナルデータベースに格納された顧客マスタテーブル",
      "コールセンターで録音された通話音声ファイル",
      "行と列で整理されたCSV形式の売上集計表",
      "SNSに投稿された自由記述のテキスト",
      "1時間ごとに記録された気温の時系列測定値",
    ],
    answerIndexes: [1, 3],
    explanation:
      "正解はBとDです。非構造化データは行と列のような事前定義されたスキーマを持たないデータで、音声・テキスト・画像・動画が代表例です。Bの通話音声ファイルとDの自由記述テキストはこれに該当します。Aのリレーショナルデータベースのテーブルと、Cの行と列で整理されたCSVは典型的な構造化データです。Eの1時間ごとの気温は時刻と数値の組で整理された時系列データであり、構造化データに分類されます。",
    reference: "https://aws.amazon.com/jp/what-is/structured-data/",
  },
  {
    id: "aif-d1-ch01-q09",
    domain: 1,
    topic: "強化学習",
    type: "single",
    difficulty: "medium",
    question:
      "エージェントが環境の中で試行錯誤を繰り返し、行動の結果として得られる報酬を最大化するように学習する方式はどれですか。",
    choices: ["教師あり学習", "教師なし学習", "自己教師あり学習", "強化学習"],
    answerIndexes: [3],
    explanation:
      "正解はDです。強化学習は、エージェントが環境と相互作用しながら行動を選び、その結果得られる報酬を最大化する行動戦略を試行錯誤で学ぶ方式で、ゲームAIやロボット制御、AWS DeepRacerの自動走行が代表例です。Aの教師あり学習は正解ラベル付きデータから入力と出力の対応を学ぶ方式で、報酬による学習は行いません。Bの教師なし学習はラベルなしデータからパターンを発見する方式です。Cの自己教師あり学習はデータ自体から擬似的なラベルを生成して学習する方式で、環境からの報酬は使いません。",
    reference: "https://aws.amazon.com/jp/what-is/reinforcement-learning/",
  },
  {
    id: "aif-d1-ch01-q10",
    domain: 1,
    topic: "バイアスと公平性",
    type: "single",
    difficulty: "hard",
    question:
      "採用候補者を評価するMLモデルを過去10年間の採用実績データでトレーニングしたところ、特定の属性を持つ応募者を一貫して低く評価することが判明しました。最も可能性の高い原因はどれですか。",
    choices: [
      "モデルがアンダーフィッティングを起こしている",
      "トレーニングデータに含まれる歴史的な偏りをモデルが学習した",
      "リアルタイム推論のレイテンシーが高すぎる",
      "トレーニングデータが構造化データではなく非構造化データだった",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。過去の採用実績に特定属性への偏った扱いが含まれていると、モデルはその偏りをパターンとして学習し、予測で再現・増幅してしまいます。これがMLにおけるバイアスの問題で、公平性を損なう典型例です。Aのアンダーフィッティングであれば特定属性だけでなく全体の精度が低下するはずで、系統的な偏りの説明になりません。Cの推論レイテンシーは応答速度の問題であり、予測内容の偏りとは無関係です。Dのデータが非構造化データかどうかは、特定属性への偏った評価の原因にはなりません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/clarify-fairness-and-explainability.html",
  },

  // ===== aif-d1-ch02: AIのユースケースとAWSのAI/MLサービス =====
  {
    id: "aif-d1-ch02-q01",
    domain: 1,
    topic: "Amazon Transcribe",
    type: "single",
    difficulty: "easy",
    question:
      "コールセンターの通話録音を自動で文字起こしし、テキストとして保存したいと考えています。最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon Polly",
      "Amazon Transcribe",
      "Amazon Translate",
      "Amazon Comprehend",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Amazon Transcribeは音声をテキストに変換する自動音声認識サービスで、通話録音の文字起こしに最適です。AのAmazon Pollyは変換の向きが逆で、テキストを自然な音声に変換する読み上げサービスです。CのAmazon Translateは言語間のテキスト翻訳サービスで、音声の文字起こしはできません。DのAmazon Comprehendはテキストから感情やエンティティを抽出するNLPサービスで、文字起こし後の分析には使えますが文字起こし自体は行えません。",
    reference: "https://aws.amazon.com/jp/transcribe/",
  },
  {
    id: "aif-d1-ch02-q02",
    domain: 1,
    topic: "Amazon Polly",
    type: "single",
    difficulty: "easy",
    question:
      "ニュース記事のテキストを自然な音声で読み上げる機能をアプリケーションに追加したいと考えています。最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon Transcribe",
      "Amazon Lex",
      "Amazon Polly",
      "Amazon Kendra",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon Pollyはテキストを自然な音声に変換するテキスト読み上げサービスで、記事の音声読み上げ機能に最適です。AのAmazon Transcribeは変換の向きが逆で、音声をテキストに変換するサービスです。BのAmazon Lexは意図の理解や対話フローの管理を行う会話型ボットを構築するサービスで、一方向の読み上げ機能には適していません。DのAmazon Kendraは自然言語で質問できるインテリジェント文書検索サービスであり、音声合成の機能はありません。",
    reference: "https://aws.amazon.com/jp/polly/",
  },
  {
    id: "aif-d1-ch02-q03",
    domain: 1,
    topic: "回帰",
    type: "single",
    difficulty: "easy",
    question:
      "不動産会社が、物件の面積・築年数・立地などのデータから販売価格(連続的な数値)を予測するモデルを構築します。最も適切なML手法はどれですか。",
    choices: ["回帰", "分類", "クラスタリング", "異常検知"],
    answerIndexes: [0],
    explanation:
      "正解はAです。回帰は入力データから価格や売上のような連続的な数値を予測する教師あり学習の手法で、物件価格の予測は代表的なユースケースです。Bの分類はスパム判定のように、あらかじめ決まったカテゴリのどれに属するかを予測する手法で、連続値の予測には使いません。Cのクラスタリングはラベルなしデータから類似グループを発見する教師なし学習の手法です。Dの異常検知は通常のパターンから外れたデータを見つける手法で、価格の予測はできません。",
    reference: "https://aws.amazon.com/jp/what-is/linear-regression/",
  },
  {
    id: "aif-d1-ch02-q04",
    domain: 1,
    topic: "クラスタリング",
    type: "single",
    difficulty: "medium",
    question:
      "大量の社内文書を、事前のラベル付けなしに内容の類似度に基づいて自動でグループ分けしたいと考えています。最も適切なML手法はどれですか。",
    choices: ["ロジスティック回帰", "線形回帰", "二値分類", "クラスタリング"],
    answerIndexes: [3],
    explanation:
      "正解はDです。クラスタリングは、ラベルのないデータを内容の類似度に基づいてグループにまとめる教師なし学習の手法で、文書の自動グループ分けに適しています。Aのロジスティック回帰は名前に回帰と付きますが分類に使われる教師あり学習の手法で、ラベル付きデータが必要です。Bの線形回帰は連続値を予測する教師あり学習の手法で、グループ分けはできません。Cの二値分類は事前に定義した2つのカテゴリへ振り分ける手法であり、ラベルのない本ケースには適用できません。",
    reference:
      "https://aws.amazon.com/jp/compare/the-difference-between-machine-learning-supervised-and-unsupervised/",
  },
  {
    id: "aif-d1-ch02-q05",
    domain: 1,
    topic: "MLの適用判断",
    type: "single",
    difficulty: "medium",
    question:
      "次のうち、ML(機械学習)ソリューションの導入が最も適切でないものはどれですか。",
    choices: [
      "数百万件の取引データから不正のパターンを検出する",
      "過去の販売実績から季節ごとの需要を予測する",
      "顧客の行動履歴に基づいて商品を推薦する",
      "税率表に基づいて商品ごとの税額を正確に計算する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。税額計算は税率表という規則で結果が一意に決まる決定論的な処理で、100%の正確性が求められます。MLの予測は本質的に確率的で誤りを含むため、このような処理は従来のルールベースのプログラムで実装すべきです。Aの不正検出は大量データからパターンを学習する分類の代表例、Bの需要予測は過去データを使った回帰の代表例、Cのレコメンデーションは行動履歴の分析による代表例で、いずれも明示的なルール化が難しくMLが価値を発揮するユースケースです。",
    reference: "https://aws.amazon.com/jp/what-is/machine-learning/",
  },
  {
    id: "aif-d1-ch02-q06",
    domain: 1,
    topic: "Amazon Textract",
    type: "single",
    difficulty: "medium",
    question:
      "紙の請求書をスキャンしたPDFから、テキスト・表・フォームの項目を自動で抽出してデータ化したいと考えています。最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon Textract",
      "Amazon Rekognition",
      "Amazon Comprehend",
      "Amazon Kendra",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。Amazon Textractはスキャン文書や画像からテキストだけでなく、表やフォームのキーと値の関係まで構造を保って抽出できるドキュメント分析サービスで、請求書のデータ化に最適です。BのAmazon Rekognitionは画像・動画から物体・顔・シーンなどを検出するサービスで、帳票の構造化抽出には適しません。CのAmazon Comprehendは抽出済みテキストの感情分析やエンティティ検出を行うサービスです。DのAmazon Kendraは文書を対象とする検索サービスで、項目の抽出はできません。",
    reference: "https://aws.amazon.com/jp/textract/",
  },
  {
    id: "aif-d1-ch02-q07",
    domain: 1,
    topic: "Amazon Personalize",
    type: "single",
    difficulty: "medium",
    question:
      "動画配信サービスが、各ユーザーの視聴履歴に基づく「あなたへのおすすめ」機能を、MLの専門知識なしで実装したいと考えています。最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon Kendra",
      "Amazon Comprehend",
      "Amazon Fraud Detector",
      "Amazon Personalize",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。Amazon Personalizeはユーザーの行動履歴や商品データからパーソナライズされたレコメンデーションを生成するマネージドサービスで、Amazon.comで使われているものと同様の技術をMLの専門知識なしで利用できます。AのAmazon Kendraは自然言語で質問できる文書検索サービスで、おすすめ表示の機能ではありません。BのAmazon Comprehendはテキストの感情分析などを行うNLPサービスです。CのAmazon Fraud Detectorは不正検出に特化したサービスで、レコメンデーションは提供しません。",
    reference: "https://aws.amazon.com/jp/personalize/",
  },
  {
    id: "aif-d1-ch02-q08",
    domain: 1,
    topic: "AIサービスの用途",
    type: "multiple",
    difficulty: "medium",
    question:
      "AWSのAIサービスとその用途の組み合わせとして正しいものを2つ選択してください。",
    choices: [
      "Amazon Comprehend — テキストからの感情分析やエンティティ抽出",
      "Amazon Personalize — 音声データのテキスト変換",
      "Amazon Fraud Detector — オンライン取引の不正検出",
      "Amazon Translate — テキストからの音声合成",
      "Amazon Rekognition — 社内文書の自然言語検索",
    ],
    answerIndexes: [0, 2],
    explanation:
      "正解はAとCです。Amazon Comprehendはテキストから感情・エンティティ・キーフレーズを抽出するNLPサービス、Amazon Fraud Detectorは取引やアカウント登録の不正の可能性をスコアリングするサービスで、いずれも用途の対応が正しい組み合わせです。Bの音声のテキスト変換はAmazon Transcribeの用途で、Personalizeはレコメンデーションのサービスです。Dのテキストからの音声合成はAmazon Pollyの用途で、Translateはテキスト翻訳のサービスです。Eの自然言語での文書検索はAmazon Kendraの用途で、Rekognitionは画像・動画分析のサービスです。",
    reference: "https://aws.amazon.com/jp/comprehend/",
  },
  {
    id: "aif-d1-ch02-q09",
    domain: 1,
    topic: "Amazon Lex",
    type: "single",
    difficulty: "medium",
    question:
      "ピザの注文を音声とテキストの両方で受け付ける対話型ボットを構築したいと考えています。ユーザーの発話から意図を理解し、注文に必要な情報を聞き返す機能が必要です。最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon Polly",
      "Amazon Transcribe",
      "Amazon Lex",
      "Amazon Translate",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。Amazon Lexは音声とテキストの両方に対応した会話型インターフェイスを構築するサービスで、発話からの意図(インテント)の認識と、注文に必要な情報(スロット)の聞き返しという対話管理を実現できます。Alexaと同じ会話AI技術が基盤です。AのAmazon Pollyはテキストの読み上げのみで、意図の理解はできません。BのAmazon Transcribeは音声の文字起こしのみで、対話の管理はできません。DのAmazon Translateはテキスト翻訳のサービスで、ボット構築の機能はありません。",
    reference: "https://aws.amazon.com/jp/lex/",
  },
  {
    id: "aif-d1-ch02-q10",
    domain: 1,
    topic: "サービス選定",
    type: "single",
    difficulty: "hard",
    question:
      "ある企業には専任のMLエンジニアがいません。アプリケーションに、画像内のオブジェクト検出や不適切コンテンツ検出といった一般的な画像分析機能を最短期間で組み込みたい場合、最も適切なアプローチはどれですか。",
    choices: [
      "Amazon SageMakerで独自の画像分類モデルをゼロからトレーニングする",
      "事前トレーニング済みのAmazon Rekognition APIを呼び出して利用する",
      "Amazon EC2のGPUインスタンスにオープンソースのモデルをデプロイして運用する",
      "Amazon SageMaker Ground Truthで画像のラベリング作業から開始する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。Amazon Rekognitionは事前トレーニング済みモデルをAPIで呼び出すだけで物体検出や不適切コンテンツ検出を利用できるAIサービスで、ML専門人材がいなくても一般的な画像分析を最短で導入できます。一般的な要件にはまず既製のAIサービスを検討するのが定石です。AのSageMakerでの独自トレーニングはデータ準備と専門知識が必要で、期間もコストもかかります。CのEC2への自前デプロイはインフラ運用の負担が最も大きい選択肢です。DのGround Truthはラベル付きデータを作成するサービスで、独自モデルを開発する場合の工程であり本要件には不要です。",
    reference: "https://aws.amazon.com/jp/rekognition/",
  },

  // ===== aif-d1-ch03: ML開発ライフサイクルとMLOps =====
  {
    id: "aif-d1-ch03-q01",
    domain: 1,
    topic: "MLパイプライン",
    type: "single",
    difficulty: "easy",
    question:
      "MLパイプラインの主要なステージを正しい順序で並べたものはどれですか。",
    choices: [
      "モデルトレーニング → データ収集 → データ前処理 → 評価 → デプロイ",
      "データ収集 → モデルトレーニング → データ前処理 → デプロイ → 評価",
      "データ収集 → データ前処理 → モデルトレーニング → 評価 → デプロイ",
      "データ前処理 → データ収集 → 評価 → モデルトレーニング → デプロイ",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。MLパイプラインは、データを収集し、EDAや前処理・特徴量エンジニアリングでトレーニングに適した形へ整え、モデルをトレーニングし、評価指標で性能を確認したうえでデプロイし、本番でモニタリングするという順序で進みます。Aはデータを収集する前にトレーニングを開始しており成立しません。Bは前処理をトレーニングの後に行っている点と、評価の前にデプロイしている点が誤りです。Dはデータ収集の前に前処理を行う順序になっており成立しません。",
    reference: "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/whatis.html",
  },
  {
    id: "aif-d1-ch03-q02",
    domain: 1,
    topic: "Ground Truth",
    type: "single",
    difficulty: "easy",
    question:
      "教師あり学習用のトレーニングデータを作るために、大量の画像へ効率的にラベルを付ける作業を支援するAWSサービスはどれですか。",
    choices: [
      "Amazon SageMaker Model Monitor",
      "Amazon SageMaker Feature Store",
      "Amazon SageMaker Data Wrangler",
      "Amazon SageMaker Ground Truth",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。SageMaker Ground Truthは、人手によるラベリングワークフローと自動ラベリングを組み合わせて、教師あり学習に必要な高品質のラベル付きデータセットを効率的に作成するサービスです。AのModel Monitorは本番デプロイ後のモデル品質やドリフトを監視するサービスで、ラベリングは行いません。BのFeature Storeは特徴量を保存・共有・再利用するリポジトリです。CのData Wranglerはデータの前処理・変換・可視化を支援するデータ準備ツールで、ラベル付け作業そのものを担うサービスではありません。",
    reference: "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/sms.html",
  },
  {
    id: "aif-d1-ch03-q03",
    domain: 1,
    topic: "Model Monitor",
    type: "single",
    difficulty: "easy",
    question:
      "本番環境にデプロイしたMLモデルについて、入力データの分布の変化(ドリフト)や予測品質の劣化を継続的に監視したいと考えています。最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon SageMaker Data Wrangler",
      "Amazon SageMaker Model Monitor",
      "Amazon SageMaker Ground Truth",
      "AWS CloudTrail",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。SageMaker Model Monitorは、本番エンドポイントへの入力データと予測結果を継続的に分析し、データ品質・モデル品質の劣化やドリフトを検出してアラートを上げられるサービスです。劣化を検知したら再トレーニングにつなげるのがMLOpsの基本サイクルです。AのData Wranglerはトレーニング前のデータ準備ツールで、本番の監視はできません。CのGround Truthはラベル付きデータを作成するサービスです。DのAWS CloudTrailはAWS APIの操作履歴を記録する監査サービスで、モデルの予測品質は監視できません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/model-monitor.html",
  },
  {
    id: "aif-d1-ch03-q04",
    domain: 1,
    topic: "Feature Store",
    type: "single",
    difficulty: "medium",
    question:
      "複数のMLチームがそれぞれ別々に同じような特徴量を作成しており、トレーニング時と推論時で特徴量の値に不整合も発生しています。この課題の解決に最も適切なAWSサービスはどれですか。",
    choices: [
      "Amazon SageMaker Feature Store",
      "Amazon S3のバージョニング",
      "Amazon SageMaker Model Monitor",
      "AWS Glue DataBrew",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。SageMaker Feature Storeは特徴量を一元管理するリポジトリで、チーム間での特徴量の共有・再利用に加え、トレーニング時(オフラインストア)と推論時(オンラインストア)で同じ特徴量を参照することによる整合性の確保を実現します。BのS3バージョニングはオブジェクトの世代管理機能で、特徴量の共有や整合性の仕組みは提供しません。CのModel Monitorは本番モデルの品質を監視するサービスで、課題が異なります。DのGlue DataBrewはデータのクレンジング・正規化を行う準備ツールで、特徴量の一元管理には対応しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/feature-store.html",
  },
  {
    id: "aif-d1-ch03-q05",
    domain: 1,
    topic: "ハイパーパラメータ",
    type: "single",
    difficulty: "medium",
    question:
      "MLにおける「ハイパーパラメータ」の説明として最も適切なものはどれですか。",
    choices: [
      "トレーニングの過程でモデルが自動的に学習する重みの値",
      "本番環境で推論リクエストに含める入力データの項目",
      "学習率のように、トレーニングの前に人が設定し、学習プロセスを制御する値",
      "モデルの予測精度を測定するための評価指標",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。ハイパーパラメータは、学習率・エポック数・決定木の深さなど、トレーニングを開始する前に人が設定して学習プロセスの挙動を制御する値です。最適な組み合わせを探索する工程がハイパーパラメータチューニングで、SageMakerの自動モデルチューニングで効率化できます。Aのトレーニング過程でモデルが学習する重みは(モデル)パラメータと呼ばれ、ハイパーパラメータとは区別されます。Bは推論時の入力データの説明で、チューニングの対象ではありません。Dは正解率やF1スコアといった評価指標の説明です。",
    reference: "https://aws.amazon.com/jp/what-is/hyperparameter-tuning/",
  },
  {
    id: "aif-d1-ch03-q06",
    domain: 1,
    topic: "モデルのソース",
    type: "single",
    difficulty: "medium",
    question:
      "スタートアップ企業が、一般的な文書要約機能を持つアプリケーションを短期間・低コストで立ち上げたいと考えています。トレーニングに使える独自データはほとんどありません。モデルの調達方法として最も適切なものはどれですか。",
    choices: [
      "要約用のデータセットを1から収集し、カスタムモデルをトレーニングする",
      "社内にラベリングチームを組成し、独自のラベル付きデータを整備してから開発を始める",
      "汎用のモデルをゼロから事前トレーニングする",
      "公開されている事前トレーニング済みモデルを利用する",
    ],
    answerIndexes: [3],
    explanation:
      "正解はDです。文書要約のような一般的なタスクで、独自データがほとんどなく、短期間・低コストでの立ち上げが要件の場合は、公開されている事前トレーニング済みモデルやマネージドサービスの利用が最適です。AとBはデータセットの収集やラベリング体制の整備に多大な時間とコストを要し、短期間・低コストという要件に反します。Cのゼロからの事前トレーニングは膨大な計算資源とデータを必要とする最も高コストな選択肢で、一般的なタスクのために行うのは不合理です。",
    reference: "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/whatis.html",
  },
  {
    id: "aif-d1-ch03-q07",
    domain: 1,
    topic: "F1スコア",
    type: "single",
    difficulty: "medium",
    question:
      "分類モデルの評価指標であるF1スコアの説明として正しいものはどれですか。",
    choices: [
      "全予測のうち正しく予測できた割合",
      "適合率(Precision)と再現率(Recall)の調和平均",
      "ROC曲線の下側の面積",
      "予測値と実測値の差の二乗平均平方根",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。F1スコアは、適合率(陽性と予測したもののうち実際に陽性だった割合)と再現率(実際の陽性のうち検出できた割合)の調和平均で、両者のバランスを1つの値で表します。クラスが不均衡なデータでは正解率よりも実態を反映しやすい指標です。Aの全予測のうち正しかった割合は正解率(Accuracy)の説明です。CのROC曲線の下側の面積はAUCの説明で、しきい値に依存しない分類性能を表します。Dの予測値と実測値の差の二乗平均平方根は回帰モデルで使うRMSEの説明で、分類の指標ではありません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/model-monitor-model-quality-metrics.html",
  },
  {
    id: "aif-d1-ch03-q08",
    domain: 1,
    topic: "ビジネスメトリクス",
    type: "single",
    difficulty: "medium",
    question:
      "MLプロジェクトの成果を測る指標のうち、「ビジネスメトリクス」に分類されるものはどれですか。",
    choices: [
      "F1スコア",
      "ROC曲線下面積(AUC)",
      "投資収益率(ROI)",
      "正解率(Accuracy)",
    ],
    answerIndexes: [2],
    explanation:
      "正解はCです。投資収益率(ROI)は、MLソリューションへの投資に対してどれだけの利益が得られたかを測るビジネスメトリクスで、ほかにユーザーあたりのコスト、開発コスト、顧客からのフィードバックなどが該当します。モデルの技術的性能が高くても事業価値につながるとは限らないため、両面での評価が必要です。AのF1スコア、BのAUC、Dの正解率は、いずれもモデルの予測性能を測るモデルパフォーマンスメトリクスであり、収益や費用対効果といったビジネス上の成果を直接表す指標ではありません。",
    reference: "https://aws.amazon.com/jp/what-is/mlops/",
  },
  {
    id: "aif-d1-ch03-q09",
    domain: 1,
    topic: "MLOps",
    type: "multiple",
    difficulty: "hard",
    question:
      "MLOpsの基本的なプラクティスとして適切なものを2つ選択してください。",
    choices: [
      "本番モデルは一度デプロイしたら、性能が変化しても変更を加えない",
      "実験の条件と結果を追跡し、誰でも同じ結果を再現できるようにする",
      "モニタリングの工数を削減するため、本番環境の監視は行わない",
      "データサイエンティストの手作業によるデプロイを標準の運用にする",
      "パイプラインを自動化し、データの変化に応じてモデルを再トレーニングできるようにする",
    ],
    answerIndexes: [1, 4],
    explanation:
      "正解はBとEです。MLOpsはDevOpsの考え方をMLに適用したプラクティスで、実験の追跡による再現性の確保と、パイプラインの自動化による継続的な再トレーニングはその中核です。Aは、本番ではデータドリフトによりモデルが劣化していくため、変更せず放置する運用は不適切です。Cはモニタリングを否定しており、劣化の検知が不可能になるためMLOpsの考え方に反します。Dの手作業によるデプロイは再現性を損ない技術的負債を増やすため、自動化を重視するMLOpsとは逆行します。",
    reference: "https://aws.amazon.com/jp/what-is/mlops/",
  },
  {
    id: "aif-d1-ch03-q10",
    domain: 1,
    topic: "モデルのデプロイ",
    type: "single",
    difficulty: "hard",
    question:
      "トレーニング済みのカスタムモデルを本番利用するにあたり、推論用インフラの管理負担を最小限にし、自動スケーリングするHTTPSエンドポイントとして公開したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "Amazon SageMakerのマネージドなリアルタイム推論エンドポイントにデプロイする",
      "Amazon EC2インスタンスに推論サーバーを自前で構築して運用する",
      "オンプレミスのGPUサーバーでモデルをホストする",
      "開発者のローカルマシンで推論スクリプトを常時実行する",
    ],
    answerIndexes: [0],
    explanation:
      "正解はAです。SageMakerのリアルタイム推論エンドポイントは、モデルをマネージドなHTTPSエンドポイントとして公開し、インフラのプロビジョニング・自動スケーリング・ヘルスチェックをAWSが担うため、運用負担を最小化するという要件に合致します。BのEC2でのセルフホストは構成の自由度が高い反面、サーバー管理やスケーリングをすべて自分で行う必要があり要件に反します。Cのオンプレミス運用は機器の調達を含め管理負担がさらに大きくなります。Dのローカルマシンでの実行は可用性・スケーラビリティがなく、本番利用には耐えられません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/deploy-model.html",
  },
];
