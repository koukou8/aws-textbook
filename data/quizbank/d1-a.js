// CloudOps問題集 分野1(モニタリング、ログ記録、分析、修復、パフォーマンスの最適化)前半
// ※現在はフェーズ1の動作確認用サンプル2問のみ。フェーズ2で全問に上書きされます。

export const questions = [
  {
    id: "qb-d1-001",
    domain: 1,
    topic: "CloudWatch",
    type: "single",
    difficulty: "easy",
    question:
      "ある企業のCloudOpsエンジニアが、Amazon EC2インスタンスのメモリ使用率をAmazon CloudWatchで監視したいと考えています。最も適切な方法はどれですか。",
    choices: [
      "EC2の標準メトリクスでメモリ使用率を有効化する",
      "CloudWatchエージェントをインスタンスにインストールしてカスタムメトリクスを収集する",
      "詳細モニタリングを有効化して1分間隔のメモリメトリクスを取得する",
      "AWS CloudTrailのログからメモリ使用率を抽出する",
    ],
    answerIndexes: [1],
    explanation:
      "正解はBです。メモリ使用率やディスク使用率などOS内部のメトリクスは、EC2のハイパーバイザーからは取得できないため、CloudWatchエージェントをインストールしてカスタムメトリクスとして送信する必要があります。AとCが誤りである理由は、標準メトリクスにも詳細モニタリングにもメモリ使用率は含まれないためです(詳細モニタリングは既存メトリクスの間隔を5分から1分に短縮する機能です)。DのAWS CloudTrailはAPI呼び出しの記録サービスであり、OSのリソース使用状況は記録しません。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html",
  },
  {
    id: "qb-d1-002",
    domain: 1,
    topic: "CloudWatchアラーム",
    type: "multiple",
    difficulty: "medium",
    question:
      "ある企業では、CPU使用率が高い状態が続いたEC2インスタンスを自動的に再起動し、同時に運用チームへ通知したいと考えています。CloudWatchアラームのアクションとして設定できるものはどれですか。(2つ選択してください)",
    choices: [
      "Amazon SNSトピックへの通知",
      "EC2インスタンスの再起動アクション",
      "AWS CloudTrail証跡の自動作成",
      "セキュリティグループのルール変更",
      "Amazon S3バケットへの直接書き込み",
    ],
    answerIndexes: [0, 1],
    explanation:
      "正解はAとBです。CloudWatchアラームは、Amazon SNSトピックへの通知と、EC2アクション(再起動・停止・終了・復旧)を直接実行できます。CのCloudTrail証跡の作成はアラームアクションとしてサポートされていません。Dのセキュリティグループ変更やEのS3への直接書き込みもアラームアクションには存在せず、そのような処理が必要な場合はSNS経由でAWS Lambdaを起動するか、Amazon EventBridge経由で自動化を構成します。",
    reference:
      "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
  },
];
