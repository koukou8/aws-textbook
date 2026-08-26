// 特設ページ: Transit Gatewayのルーティング設定(VPC側とTGW側の2層ルートテーブル)
export const topic = {
  id: "transit-gateway-routing",
  title: "Transit Gatewayで通信できない時: ルートテーブルは「2層」ある",
  description:
    "アタッチメントを作ってもVPC間は通信できません。TGW側とVPC側、2層のルートテーブルの役割と、VPCピアリングとの使い分けを整理します。",
  exam: "SOA-C03 / SAA-C03",
  services: ["AWS Transit Gateway", "Amazon VPC", "VPCピアリング"],
  createdAt: "2026-08-15",
  source: {
    question:
      "2つのVPCをTransit Gatewayにアタッチし、TGWのルートテーブルには両VPCへの伝播されたルートがあるのに、VPC間でインスタンスが通信できない(セキュリティグループとネットワークACLは許可済み)。最も可能性が高い原因を選ぶ、という趣旨の問題。",
    point:
      "VPCをアタッチしても、VPC側のサブネットのルートテーブルには何も自動追加されない。ルート伝播が働くのはTransit Gateway側のルートテーブルだけ。相手VPCのCIDR宛てにターゲット= Transit Gatewayの静的ルートを、双方のVPCへ手動で追加する必要がある。",
  },
  sections: [
    {
      heading: "結論: ルートテーブルは「TGW側」と「VPC側」の2層ある",
      html: `<p>Transit Gateway(TGW)のトラブルシューティングで最初に押さえるべきことは、ルートテーブルが<strong>2つの層</strong>に分かれていることです。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>VPCをTransit Gatewayにアタッチしても、VPC側のサブネットのルートテーブルには何も自動追加されません。ルート伝播が行われるのはTransit Gateway側のルートテーブルだけ。VPC側には「宛先: 相手VPCのCIDR、ターゲット: Transit Gateway」の静的ルートを、通信する双方のVPCに手動で追加します。</strong></p></div>
<p>今回の問題はまさにこの構図です。アタッチメントは利用可能、TGWルートテーブルには伝播されたルートがあり、セキュリティグループ・ネットワークACLも許可済み。それでも通信できないなら、残る原因は<strong>VPC側のサブネットのルートテーブル</strong>です。送信元のインスタンスから見ると、相手VPCのCIDR(10.2.0.0/16)宛てのルートが自分のルートテーブルに存在しないため、パケットはそもそもTransit Gatewayに向かうことすらできません。</p>
<p>「アタッチメント = 接続完了」と考えてしまうのが最大の罠です。アタッチメントはいわば配線をつないだ状態にすぎず、「どの宛先をその配線に流すか」というルーティングは別途設定が必要です。</p>`,
    },
    {
      heading: "仕組み: パケットの視点で通信経路を追う",
      html: `<p>VPC A(10.1.0.0/16)のインスタンスからVPC B(10.2.0.0/16)のインスタンスへ通信するとき、パケットは次の順で判断されます。</p>
<ol>
<li><strong>送信元サブネットのルートテーブル</strong>: 宛先10.2.0.0/16に一致するルートを探す。「宛先10.2.0.0/16 → ターゲット tgw-xxxx」の静的ルートがあれば、パケットはTGWへ送られる。<strong>なければここで通信は失敗する</strong>(今回の問題の原因)</li>
<li><strong>Transit Gatewayのルートテーブル</strong>: アタッチメントに関連付けられたルートテーブルで宛先を照合し、10.2.0.0/16が伝播(または静的追加)されていれば、VPC Bのアタッチメントへ転送する</li>
<li><strong>戻りの通信</strong>: 応答パケットにも同じことが起きる。VPC B側のサブネットのルートテーブルにも「宛先10.1.0.0/16 → ターゲット tgw-xxxx」が必要。<strong>片方だけでは往復が成立しない</strong></li>
</ol>
<figure class="diagram">
<svg viewBox="0 0 700 182" role="img" aria-label="VPC AのEC2からVPC BのEC2へパケットが届くまでに、VPC側ルートテーブル・TGWルートテーブル・相手VPC側ルートテーブルの3か所を順に通ることを示した図">
  <text class="d-title" x="350" y="20" text-anchor="middle">VPC A の EC2 から VPC B の EC2 へ、パケットが参照するルートテーブルの順序</text>

  <text class="d-accent" x="201" y="36" text-anchor="middle">VPC側(第1層)</text>
  <text class="d-accent" x="358" y="36" text-anchor="middle">TGW側(第2層)</text>
  <text class="d-accent" x="515" y="36" text-anchor="middle">VPC側(第3層)</text>

  <rect class="d-node" x="8" y="42" width="104" height="60" rx="8"/>
  <text class="d-text" x="60" y="61" text-anchor="middle">EC2</text>
  <text class="d-sub" x="60" y="76" text-anchor="middle">VPC A</text>
  <text class="d-mono" x="60" y="94" text-anchor="middle">10.1.0.0/16</text>

  <path class="d-flow" d="M113 72 L122 72"/>
  <path class="d-arrow" d="M129 72 l-7 -4.5 v9 z"/>

  <rect class="d-node-ng" x="130" y="42" width="142" height="60" rx="8"/>
  <text class="d-text" x="201" y="61" text-anchor="middle">① サブネットの</text>
  <text class="d-text" x="201" y="76" text-anchor="middle">ルートテーブル</text>
  <text class="d-mono" x="201" y="94" text-anchor="middle">10.2.0.0/16 → tgw</text>

  <path class="d-flow" d="M273 72 L282 72"/>
  <path class="d-arrow" d="M289 72 l-7 -4.5 v9 z"/>

  <rect class="d-node-ok" x="290" y="42" width="136" height="60" rx="8"/>
  <text class="d-text" x="358" y="61" text-anchor="middle">② Transit Gateway</text>
  <text class="d-text" x="358" y="76" text-anchor="middle">ルートテーブル</text>
  <text class="d-sub" x="358" y="94" text-anchor="middle">アタッチメントから伝播</text>

  <path class="d-flow" d="M427 72 L436 72"/>
  <path class="d-arrow" d="M443 72 l-7 -4.5 v9 z"/>

  <rect class="d-node-ng" x="444" y="42" width="142" height="60" rx="8"/>
  <text class="d-text" x="515" y="61" text-anchor="middle">③ サブネットの</text>
  <text class="d-text" x="515" y="76" text-anchor="middle">ルートテーブル</text>
  <text class="d-mono" x="515" y="94" text-anchor="middle">10.1.0.0/16 → tgw</text>

  <path class="d-flow" d="M587 72 L596 72"/>
  <path class="d-arrow" d="M603 72 l-7 -4.5 v9 z"/>

  <rect class="d-node" x="604" y="42" width="88" height="60" rx="8"/>
  <text class="d-text" x="648" y="61" text-anchor="middle">EC2</text>
  <text class="d-sub" x="648" y="76" text-anchor="middle">VPC B</text>
  <text class="d-mono" x="648" y="94" text-anchor="middle">10.2.0.0/16</text>

  <text class="d-ng" x="201" y="120" text-anchor="middle">手動追加が必要</text>
  <text class="d-sub" x="201" y="134" text-anchor="middle">アタッチしても自動追加されない</text>
  <text class="d-ok" x="358" y="120" text-anchor="middle">伝播で自動登録される</text>
  <text class="d-sub" x="358" y="134" text-anchor="middle">(問題文では正常と明示)</text>
  <text class="d-ng" x="515" y="120" text-anchor="middle">戻り用も手動で必要</text>
  <text class="d-sub" x="515" y="134" text-anchor="middle">片方だけでは往復しない</text>

  <path class="d-flow" d="M648 102 L648 156 L60 156 L60 111"/>
  <path class="d-arrow" d="M60 104 l-4.5 7 h9 z"/>
  <text class="d-sub" x="354" y="171" text-anchor="middle">戻りの通信も同じ2層を逆にたどるため、双方のVPCに設定が必要</text>
</svg>
<figcaption>赤い①③がVPC側の第1層・第3層で、手動追加が必要な見落としポイントです。緑の②だけが伝播で自動登録されます。</figcaption>
</figure>
<h4>通信できない時のチェックリスト</h4>
<ul>
<li>セキュリティグループ・ネットワークACL(今回は確認済み)</li>
<li><strong>双方の</strong>VPCのサブネットのルートテーブルに相手CIDR宛てのルートがあるか</li>
<li>TGWルートテーブルのアソシエーション(どのアタッチメントがどのルートテーブルを使うか)と伝播の状態</li>
<li>アタッチメント作成時に指定したサブネット(TGWは指定したサブネットのAZにしか接続点を作らない)</li>
</ul>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>仮想プライベートゲートウェイ(VGW)では、VPCのルートテーブルで「ルート伝播」を有効化してVPN経由のルートを自動追加できます。<strong>Transit GatewayにはVPC側ルートテーブルへの伝播機能がなく、静的ルートの手動追加が必須</strong>です。「VGWでは伝播できたから」という思い込みがTGWでのひっかけになります。</p></div>`,
    },
    {
      heading: "比較表: Transit Gateway vs VPCピアリング",
      html: `<p>誤答選択肢にあった「ピアリングの併用が必要」を正しく否定するには、両者の関係を理解しておく必要があります。Transit GatewayとVPCピアリングは<strong>どちらもVPC間を接続する手段であり、代替関係</strong>です。併用が必須になることはありません。</p>
<div class="table-wrap"><table><thead><tr><th>観点</th><th>Transit Gateway</th><th>VPCピアリング</th></tr></thead><tbody>
<tr><td>接続形態</td><td>ハブ&スポーク(TGWが中継点)</td><td>VPC同士の1対1接続</td></tr>
<tr><td>推移的ルーティング</td><td>可(A-TGW-Cの経由通信ができる)</td><td>不可(A-B、B-Cがあっても A-C は通れない)</td></tr>
<tr><td>スケール</td><td>多数のVPC・オンプレミス接続を集約</td><td>数が増えるとフルメッシュの管理が破綻</td></tr>
<tr><td>オンプレミス接続の集約</td><td>Site-to-Site VPNやDirect Connectゲートウェイをアタッチ可</td><td>不可(VPC間専用)</td></tr>
<tr><td>CIDRの重複</td><td>重複するCIDR間の通信は正しくルーティングできない</td><td>重複していると接続自体を作成できない</td></tr>
<tr><td>料金</td><td>アタッチメントの時間料金+データ処理料金</td><td>接続自体は無料(データ転送料金のみ)</td></tr>
<tr><td>VPC側ルートテーブル設定</td><td>必要(ターゲット: tgw-xxxx)</td><td>必要(ターゲット: pcx-xxxx)</td></tr>
</tbody></table></div>
<p>最下段に注目してください。<strong>「VPC側のルートテーブルへの手動追加が必要」という点は、実はピアリングでも同じ</strong>です。VPC間接続の手段が何であれ、「接続を作る」ことと「ルートを向ける」ことは別の作業である、と覚えておくと応用が利きます。</p>`,
    },
    {
      heading: "典型パターンと、誤答選択肢はなぜ不正解か",
      html: `<p>試験で問われる典型パターンを整理します。</p>
<ol>
<li><strong>VPCが2〜3個の固定的な接続で、コストを最小にしたい</strong> → VPCピアリング(時間料金がかからない)</li>
<li><strong>数十VPC以上、今後の拡張、オンプレミス接続の集約が見えている</strong> → Transit Gateway</li>
<li><strong>ピアリングを多数のVPCに広げたら管理が大変になった</strong> → 推移的ルーティングができないピアリングはVPC数が増えるとフルメッシュが必要。Transit Gatewayへの移行が定番の解答</li>
<li><strong>TGW構成でVPC間が通信できない</strong> → SG・NACLの次は「VPC側(双方)→TGW側」の順にルートテーブルを確認</li>
</ol>
<h4>誤答選択肢はなぜ不正解か</h4>
<ul>
<li><strong>ルート伝播が無効になっている</strong>: 問題文に「TGWのルートテーブルには伝播されたルートが存在する」と明示されており、伝播は機能しています。問題文の条件と矛盾する選択肢は最初に消せます</li>
<li><strong>CIDRが重複している</strong>: 10.1.0.0/16と10.2.0.0/16はアドレス範囲がまったく重ならない別のネットワークです。重複とは10.1.0.0/16と10.1.0.0/24のように範囲が重なるケースを指します</li>
<li><strong>ピアリング接続の併用が必要</strong>: Transit GatewayとVPCピアリングは代替関係にある独立した接続手段で、TGW経由の通信にピアリングは不要です。「両方必要」型の選択肢は、2つの技術の関係(代替か・補完か)を問うひっかけの定番です</li>
</ul>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>ネットワークのトラブルシューティング問題は「問題文で正常と明示された要素を消去する」のが最短ルートです。今回はアタッチメント・TGWルートテーブル・SG・NACLが正常と明示されているため、残るのはVPC側のルートテーブルしかありません。</p></div>`,
    },
  ],
  references: [
    {
      label: "Transit Gatewayの仕組み(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/how-transit-gateways-work.html",
    },
    {
      label: "VPCピアリングとは(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/peering/what-is-vpc-peering.html",
    },
    {
      label: "AWS Transit Gateway FAQ",
      url: "https://aws.amazon.com/jp/transit-gateway/faqs/",
    },
  ],
};
