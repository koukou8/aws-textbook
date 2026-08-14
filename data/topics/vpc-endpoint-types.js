// 特設ページ: VPCエンドポイントの使い分け(ゲートウェイ型 vs インターフェイス型)
export const topic = {
  id: "vpc-endpoint-types",
  title: "VPCエンドポイントの使い分け: ゲートウェイ型 vs インターフェイス型",
  description:
    "S3へのプライベート接続で頻出のVPCエンドポイント2種類を、仕組み・料金・試験での決め手から整理します。",
  exam: "SAA-C03 / SOA-C03",
  services: ["Amazon VPC", "AWS PrivateLink", "Amazon S3"],
  createdAt: "2026-08-14",
  source: {
    question:
      "プライベートサブネットのEC2インスタンスからS3バケットへアクセスしたい。トラフィックをインターネットに出さず、追加コストを最小限に抑える構成を選ぶ、という趣旨の問題。",
    point:
      "「S3またはDynamoDB + コスト最小」ならゲートウェイエンドポイントが決め手。NATゲートウェイ経由やインターフェイスエンドポイントは要件を満たすが追加コストが発生する。",
  },
  sections: [
    {
      heading: "結論: 試験での決め手はこれだけ",
      html: `<p>VPC内のリソースから<strong>インターネットを経由せずに</strong>AWSサービスへアクセスしたい、という問題が出たら、まずVPCエンドポイントを疑います。2種類の使い分けは次の1行に集約できます。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>宛先がS3またはDynamoDBで、VPC内からのアクセスだけでよいならゲートウェイ型(無料)。それ以外のサービス、またはオンプレミス・他VPCからのアクセスが必要ならインターフェイス型(有料)。</strong></p></div>
<p>選択肢に「NATゲートウェイを追加する」がある場合も注意が必要です。NATゲートウェイでもS3へは到達できますが、トラフィックはインターネット経由になり(パブリックIPを使用)、処理料金と時間料金が発生します。「インターネットに出さない」「コスト最小」という要件がある時点で不正解になります。</p>`,
    },
    {
      heading: "ゲートウェイエンドポイントの仕組み",
      html: `<p>ゲートウェイエンドポイントは、<strong>ルートテーブルにエントリを追加する方式</strong>のエンドポイントです。対象サービスのプレフィックスリスト(そのサービスのIPアドレス範囲の集合)宛のトラフィックを、エンドポイントに向けてルーティングします。</p>
<ul>
<li>対応サービスは <strong>Amazon S3 と Amazon DynamoDB の2つだけ</strong></li>
<li><strong>追加料金なし</strong>(データ処理料金・時間料金ともに無料)</li>
<li>ルートテーブル単位で有効化するため、ENIやIPアドレスを消費しない</li>
<li>アクセスできるのは<strong>同じVPC内のリソースから</strong>のみ。オンプレミス(VPN / Direct Connect経由)やピアリング先のVPCからは利用できない</li>
</ul>
<p>エンドポイントポリシーを設定すれば、「特定のバケットにしかアクセスさせない」といった制御も可能です。S3バケットポリシー側で <code>aws:sourceVpce</code> 条件キーを使い、「このエンドポイント経由以外のアクセスを拒否する」パターンも頻出です。</p>`,
    },
    {
      heading: "インターフェイスエンドポイント(AWS PrivateLink)の仕組み",
      html: `<p>インターフェイスエンドポイントは、<strong>サブネット内にENI(Elastic Network Interface)を作成する方式</strong>です。ENIにはVPC内のプライベートIPアドレスが割り当てられ、そのIPに向けて接続することでサービスにプライベート到達します。この基盤技術がAWS PrivateLinkです。</p>
<ul>
<li>対応サービスが幅広い: CloudWatch、SQS、SNS、Kinesis、Secrets Manager、Systems Managerなど<strong>ほとんどのAWSサービス</strong>に加え、他のAWSアカウントが公開するエンドポイントサービス(SaaS含む)にも接続できる</li>
<li><strong>有料</strong>: エンドポイントの時間料金 + データ処理料金がかかる</li>
<li>プライベートDNSを有効にすると、通常のサービスDNS名(例: <code>sqs.ap-northeast-1.amazonaws.com</code>)がエンドポイントのプライベートIPに解決されるため、アプリの接続先変更が不要</li>
<li>ENIへの接続なので、<strong>オンプレミス(VPN / Direct Connect経由)やピアリング先VPCからも利用できる</strong></li>
</ul>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>S3にはゲートウェイ型とインターフェイス型の両方が存在します。「オンプレミスからDirect Connect経由でS3にプライベートアクセスしたい」という要件では、ゲートウェイ型が使えないため<strong>S3用インターフェイスエンドポイント</strong>が正解になります。</p></div>`,
    },
    {
      heading: "比較表と典型パターン",
      html: `<div class="table-wrap"><table><thead><tr><th>観点</th><th>ゲートウェイ型</th><th>インターフェイス型(PrivateLink)</th></tr></thead><tbody>
<tr><td>対応サービス</td><td>S3 / DynamoDBのみ</td><td>ほとんどのAWSサービス + 他社SaaS</td></tr>
<tr><td>実装方式</td><td>ルートテーブルのエントリ</td><td>サブネット内のENI</td></tr>
<tr><td>料金</td><td>無料</td><td>時間料金 + データ処理料金</td></tr>
<tr><td>オンプレ / 他VPCから</td><td>不可</td><td>可(VPN / Direct Connect / ピアリング経由)</td></tr>
<tr><td>DNS</td><td>不要(ルーティングで解決)</td><td>プライベートDNSで透過的に利用可</td></tr>
</tbody></table></div>
<p>試験で問われる典型パターンを整理します。</p>
<ol>
<li><strong>VPC内のEC2からS3へ、インターネットに出さず低コストで</strong> → ゲートウェイエンドポイント</li>
<li><strong>プライベートサブネットのLambdaやEC2からSQS / Secrets Managerへ</strong> → インターフェイスエンドポイント(ゲートウェイ型は非対応サービスのため)</li>
<li><strong>オンプレミスからDirect Connect経由でS3へプライベートに</strong> → S3用インターフェイスエンドポイント</li>
<li><strong>自社のサービスを他社のVPCへプライベートに公開したい</strong> → NLB + PrivateLink(エンドポイントサービス)</li>
</ol>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「エンドポイント」という言葉だけで飛びつかず、<strong>宛先サービス・アクセス元・コスト要件</strong>の3点を必ず確認してください。特に「S3だからゲートウェイ型」と即断すると、アクセス元がオンプレミスの問題で誤答します。</p></div>`,
    },
  ],
  references: [
    {
      label: "AWS PrivateLinkとは(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/what-is-privatelink.html",
    },
    {
      label: "ゲートウェイエンドポイント(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
    },
    {
      label: "AWS PrivateLink FAQ",
      url: "https://aws.amazon.com/jp/privatelink/faqs/",
    },
  ],
};
