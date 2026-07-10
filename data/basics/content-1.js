// AWS基礎 前半(第1〜6章)の章コンテンツ
// ※現在はフェーズ1の動作確認用サンプル1章のみ。フェーズ2で全章に上書きされます。

export const chapters = [
  {
    id: "basics-ch01",
    domain: null,
    title: "AWSとグローバルインフラストラクチャ(サンプル)",
    sections: [
      {
        heading: "リージョンとアベイラビリティーゾーン",
        html: `
<p>AWSのインフラストラクチャは、世界中に配置された<strong>リージョン</strong>と、その中の<strong>アベイラビリティーゾーン(AZ)</strong>で構成されます。</p>
<ul>
  <li>リージョン: 地理的に離れた独立したエリア(例: 東京リージョン ap-northeast-1)</li>
  <li>AZ: リージョン内の1つ以上のデータセンター群。AZ同士は低レイテンシで接続されています</li>
</ul>
<div class="callout callout-note">
  <span class="callout-title">ポイント</span>
  <p>高可用性を求める場合は、複数のAZにリソースを分散配置するのが基本です。</p>
</div>`,
      },
      {
        heading: "エッジロケーション",
        html: `
<p><strong>エッジロケーション</strong>は、Amazon CloudFrontなどがコンテンツをキャッシュ配信するための拠点で、リージョンよりも多くの都市に配置されています。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>拠点</th><th>役割</th><th>代表的なサービス</th></tr></thead>
  <tbody>
    <tr><td>リージョン</td><td>リソースの作成・実行</td><td>Amazon EC2、Amazon S3</td></tr>
    <tr><td>AZ</td><td>リージョン内の冗長化単位</td><td>マルチAZ配置</td></tr>
    <tr><td>エッジロケーション</td><td>ユーザーの近くで配信</td><td>Amazon CloudFront、Amazon Route 53</td></tr>
  </tbody>
</table>
</div>`,
      },
    ],
    checkQuestionIds: ["basics-ch01-q01", "basics-ch01-q02"],
  },
];
