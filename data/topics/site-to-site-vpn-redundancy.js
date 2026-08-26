// 特設ページ: Site-to-Site VPNの冗長性(2本のトンネルが守るもの・守らないもの)
export const topic = {
  id: "site-to-site-vpn-redundancy",
  title: "Site-to-Site VPNの冗長性: 2本のトンネルが守るもの・守らないもの",
  description:
    "「トンネルが2本あるのに全断した」のはなぜか。VPN接続の障害ドメインの考え方と、オンプレ側デバイスを冗長化する構成、Client VPNとの違いを整理します。",
  exam: "SOA-C03 / SAA-C03",
  services: ["AWS Site-to-Site VPN", "AWS Client VPN", "カスタマーゲートウェイ"],
  createdAt: "2026-08-17",
  source: {
    question:
      "オンプレミスの1台のカスタマーゲートウェイデバイスとVPCの間で、トンネル2本が両方UPのSite-to-Site VPN接続を使っていたが、オンプレ側デバイスの故障で全断した。デバイス障害に耐える構成を選ぶ、という趣旨の問題。",
    point:
      "1つのVPN接続の2本のトンネルは、どちらも同じカスタマーゲートウェイデバイスに終端する。つまり2本のトンネルはAWS側の冗長化であり、オンプレ側は単一障害点のまま。耐えるには2台目のデバイスと2つ目のVPN接続を追加する。",
  },
  sections: [
    {
      heading: "結論: 2本のトンネルは「AWS側」の冗長化",
      html: `<p>Site-to-Site VPN接続を作ると必ずトンネルが2本用意されるため、「冗長化はできている」と考えてしまいがちです。しかし、この2本が守っているのは<strong>AWS側の障害</strong>だけです。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>1つのVPN接続の2本のトンネルは、AWS側では別々のエンドポイントに終端しますが、オンプレミス側ではどちらも同じ1台のカスタマーゲートウェイデバイスに終端します。そのデバイスが壊れれば2本とも道連れです。オンプレミス側の障害に耐えるには、2台目のデバイスを用意し、それに対する2つ目のSite-to-Site VPN接続を追加します。</strong></p></div>
<p>この問題を解く鍵は<strong>障害ドメイン</strong>(どの部品が壊れたら何が止まるか)という考え方です。「トンネルが2本ある = 冗長」と数だけで判断せず、「その2本は同じ機器・同じ経路・同じ拠点に依存していないか」を確認します。今回の構成では、2本のトンネルの共通の依存先がオンプレミスの1台のデバイスだったため、そこが単一障害点になっていました。</p>`,
    },
    {
      heading: "仕組み: 構成要素と冗長構成の作り方",
      html: `<p>Site-to-Site VPNの登場人物を整理すると、障害ドメインが見えやすくなります。</p>
<ul>
<li><strong>カスタマーゲートウェイデバイス</strong>: オンプレミス側の物理・仮想VPN機器。IPsecトンネルのオンプレ側終端</li>
<li><strong>カスタマーゲートウェイ</strong>: 上記デバイスの情報(パブリックIPなど)をAWSに登録したリソース</li>
<li><strong>仮想プライベートゲートウェイ(VGW)またはTransit Gateway</strong>: AWS側の終端。VGWはVPCに1つアタッチする</li>
<li><strong>Site-to-Site VPN接続</strong>: 上記2つを結ぶ接続。<strong>1接続につきトンネルは常に2本</strong>で、AWS側はそれぞれ別のエンドポイントに終端する(AWS側の高可用性)</li>
</ul>
<p>オンプレミス側も冗長化した構成は次のようになります。</p>
<ol>
<li>2台目のカスタマーゲートウェイデバイスを用意する(パブリックIPが必要)</li>
<li>そのデバイス用に2つ目のカスタマーゲートウェイリソースを登録する</li>
<li><strong>同じVGW(またはTGW)に対して2つ目のVPN接続を作成する</strong> — これで合計4トンネル、デバイス2台の構成になる</li>
</ol>
<figure class="diagram">
<svg viewBox="0 0 700 172" role="img" aria-label="VPN接続1つではオンプレ側の1台の機器に2本のトンネルが終端して単一障害点になるのに対し、機器2台とVPN接続2つでは計4トンネルになり機器障害に耐えることを比較した図">
  <line class="d-zone" x1="350" y1="8" x2="350" y2="166"/>

  <text class="d-title-ng" x="174" y="20" text-anchor="middle">① VPN接続1つ(トンネル2本)</text>
  <rect class="d-node-ng" x="30" y="56" width="110" height="48" rx="8"/>
  <text class="d-text" x="85" y="76" text-anchor="middle">カスタマー</text>
  <text class="d-text" x="85" y="91" text-anchor="middle">ゲートウェイ機器</text>
  <path class="d-flow" d="M140 70 L216 70"/>
  <path class="d-flow" d="M140 90 L216 90"/>
  <text class="d-mono" x="178" y="65" text-anchor="middle">トンネル1</text>
  <text class="d-mono" x="178" y="104" text-anchor="middle">トンネル2</text>
  <rect class="d-node-accent" x="216" y="56" width="104" height="48" rx="8"/>
  <text class="d-text" x="268" y="76" text-anchor="middle">VGW</text>
  <text class="d-sub" x="268" y="91" text-anchor="middle">(AWS側)</text>
  <text class="d-ng" x="85" y="122" text-anchor="middle">この1台が単一障害点</text>
  <text class="d-sub" x="268" y="122" text-anchor="middle">AWS側は別エンドポイント</text>
  <text class="d-ng" x="174" y="148" text-anchor="middle">機器が故障すると2本とも断 → 全断</text>

  <text class="d-title-ok" x="526" y="20" text-anchor="middle">② 機器2台 + VPN接続2つ(計4トンネル)</text>
  <rect class="d-node" x="382" y="46" width="110" height="40" rx="8"/>
  <text class="d-text" x="437" y="63" text-anchor="middle">ゲートウェイ</text>
  <text class="d-sub" x="437" y="78" text-anchor="middle">機器 1台目</text>
  <rect class="d-node" x="382" y="100" width="110" height="40" rx="8"/>
  <text class="d-text" x="437" y="117" text-anchor="middle">ゲートウェイ</text>
  <text class="d-sub" x="437" y="132" text-anchor="middle">機器 2台目</text>
  <path class="d-flow" d="M492 58 L572 76"/>
  <path class="d-flow" d="M492 70 L572 82"/>
  <path class="d-flow" d="M492 116 L572 94"/>
  <path class="d-flow" d="M492 128 L572 100"/>
  <text class="d-mono" x="532" y="52" text-anchor="middle">VPN接続1</text>
  <text class="d-mono" x="532" y="140" text-anchor="middle">VPN接続2</text>
  <rect class="d-node-accent" x="572" y="64" width="104" height="48" rx="8"/>
  <text class="d-text" x="624" y="84" text-anchor="middle">VGW</text>
  <text class="d-sub" x="624" y="99" text-anchor="middle">(同じものでよい)</text>
  <text class="d-ok" x="526" y="160" text-anchor="middle">1台が故障しても、もう1台の2本で通信を継続</text>
</svg>
<figcaption>1つのVPN接続の2本は、オンプレミス側では同じ1台の機器に終端します。機器障害に耐えるには、2台目の機器と2つ目のVPN接続を追加して計4トンネルにします。</figcaption>
</figure>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>公式ドキュメントは、冗長構成では<strong>動的ルーティング(BGP)の使用を推奨</strong>しています。BGPなら片方のデバイスが落ちたとき、利用可能な経路への切り替えが自動で行われます。静的ルーティングでは障害時の経路切り替えを自動化できないため、冗長VPN構成の問題では「BGPで動的ルーティング」がセットで正解になりやすい論点です。</p></div>`,
    },
    {
      heading: "比較表: Site-to-Site VPN vs Client VPN",
      html: `<p>誤答選択肢のClient VPNは名前が似ていますが、解決する課題がまったく別のサービスです。決め手は<strong>「誰(何)がつなぐか」</strong>です。</p>
<div class="table-wrap"><table><thead><tr><th>観点</th><th>Site-to-Site VPN</th><th>Client VPN</th></tr></thead><tbody>
<tr><td>接続の単位</td><td>拠点のネットワーク同士(オンプレミス ↔ VPC)</td><td>個人の端末(PC・スマートフォン)からの個別接続</td></tr>
<tr><td>オンプレ側 / 利用者側の終端</td><td>カスタマーゲートウェイデバイス(VPN機器)</td><td>OpenVPNベースのクライアントソフト</td></tr>
<tr><td>典型ユースケース</td><td>データセンターとVPCの常時接続</td><td>リモートワーカーが社内リソースへアクセス</td></tr>
<tr><td>接続する人数・台数の考え方</td><td>拠点内の全端末が経路を共有</td><td>ユーザーごとに個別のVPNセッション</td></tr>
<tr><td>認証</td><td>IPsec(事前共有キーなど)</td><td>証明書・Active Directory・フェデレーション</td></tr>
</tbody></table></div>
<p>「拠点間の接続のバックアップにClient VPNを使う」が成立しないのは、Client VPNが<strong>端末単位</strong>の接続だからです。拠点のネットワーク全体を代替する経路にはならず、用途が根本から異なります。試験では「リモートユーザー」「在宅勤務」「個人PCから」という言葉が出たらClient VPN、「オンプレミス」「データセンター」「拠点」ならSite-to-Site VPN(またはDirect Connect)と判別できます。</p>`,
    },
    {
      heading: "高可用性の段階と、誤答選択肢はなぜ不正解か",
      html: `<p>ハイブリッド接続の可用性は段階的に考えると整理しやすいです。要件の強さに応じて構成を選びます。</p>
<ol>
<li><strong>VPN接続1つ(トンネル2本を両方構成)</strong>: 最低限。AWS側の障害には耐えるが、オンプレ側デバイスが単一障害点</li>
<li><strong>デバイス2台 + VPN接続2つ(計4トンネル)</strong>: オンプレ側のデバイス障害・メンテナンスにも耐える</li>
<li><strong>Direct Connect + VPNバックアップ</strong>: 通常時は専用線の帯域・品質、障害時はVPNへフェイルオーバーする定番構成</li>
<li><strong>Direct Connect 2本(別ロケーション)</strong>: 最高レベル。専用線自体を冗長化する</li>
</ol>
<h4>誤答選択肢はなぜ不正解か</h4>
<ul>
<li><strong>トンネルを4本に増やすよう依頼する</strong>: トンネル数は1接続につき2本で固定されており、増やすオプションは存在しません。数を増やしたい場合は接続自体を追加します</li>
<li><strong>仮想プライベートゲートウェイを2つ作成する</strong>: VGWはVPCに1つアタッチするものです。仮に作れても、オンプレ側の単一障害点(デバイス1台)は解消されないため、対策として的外れです</li>
<li><strong>Client VPNをバックアップにする</strong>: リモートユーザーの端末単位の接続サービスであり、拠点間接続の代替経路にはなりません</li>
</ul>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>冗長化の問題では、<strong>障害が起きた場所(AWS側か・オンプレ側か・回線か)と、対策が守る場所が一致しているか</strong>を必ず確認してください。「AWS側の冗長化を増やす」選択肢は、オンプレ側の障害という出題意図に対して常に不正解です。</p></div>`,
    },
  ],
  references: [
    {
      label: "冗長なSite-to-Site VPN接続を使用したフェイルオーバー(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpn/latest/s2svpn/vpn-redundant-connection.html",
    },
    {
      label: "AWS Site-to-Site VPNとは(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpn/latest/s2svpn/VPC_VPN.html",
    },
    {
      label: "AWS Client VPNとは(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpn/latest/clientvpn-admin/what-is.html",
    },
  ],
};
