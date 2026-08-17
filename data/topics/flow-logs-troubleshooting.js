// 特設ページ: VPCフローログによる到達性トラブルの切り分け(AWS側の制御とOS内部の境界)
export const topic = {
  id: "flow-logs-troubleshooting",
  title: "VPCフローログの読み方: AWS側の制御とOS内部を切り分ける",
  description:
    "インバウンドがACCEPTなのに応答が返らない。フローログが「どこまで見ているか」を理解して、次に調べる場所を1発で決める手順を整理します。",
  exam: "SOA-C03 / SAA-C03",
  services: ["VPCフローログ", "Amazon VPC", "Amazon EC2", "Reachability Analyzer"],
  createdAt: "2026-08-17",
  source: {
    question:
      "あるEC2インスタンスのポート443にだけ接続できない。同じサブネット・同じセキュリティグループ・同じネットワークACLの別インスタンスは正常。対象ENIのフローログにはクライアントからのポート443宛てインバウンドがACCEPTで記録され、REJECTはなく、インスタンスからの応答の記録も無い、という状況で次に調べる場所を選ぶ趣旨の問題。",
    point:
      "フローログはENIの出入り口でのセキュリティグループとネットワークACLの評価結果しか記録しない。インバウンドACCEPTが出ている時点でAWS側の制御は通過済みで、疑うべきはENIより内側(OSのファイアウォールと待ち受けプロセス)。",
  },
  sections: [
    {
      heading: "結論: フローログが見ている「境界」を押さえる",
      html: `<p>VPCフローログは、<strong>ENI(Elastic Network Interface)を出入りするIPトラフィックのメタデータ</strong>を記録します。記録される <code>ACCEPT</code> / <code>REJECT</code> は、<strong>セキュリティグループとネットワークACLがそのパケットを通したか落としたか</strong>の判定結果です。つまりフローログが見ているのは、ENIという1本の境界線だけです。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>インバウンドがACCEPTとして記録されている = そのパケットはセキュリティグループとネットワークACLを通過し、ENIまで確実に届いている</strong>ということです。したがって次に疑うのはENIより内側、すなわち<strong>ゲストOSのファイアウォールと、そのポートで待ち受けているプロセス</strong>です。フローログはOS内部の挙動を一切記録しません。</p></div>
<p>もう一つの決め手が<strong>差分診断</strong>です。「同じサブネット・同じセキュリティグループ・同じネットワークACLの別インスタンスは正常」という前提は、<strong>共有されているコンポーネントを容疑者から外す</strong>ための情報です。ルートテーブルはサブネット単位で関連付けられるため、ルートが欠けていれば同じサブネットの別インスタンスも同様に通信できないはずです。片方だけが壊れているなら、犯人は<strong>そのインスタンスだけが持っているもの</strong>——OS内部の設定、プロセスの状態、アプリケーションの構成——に絞り込めます。</p>`,
    },
    {
      heading: "記録パターン別・容疑者マップ",
      html: `<p>フローログの読み解きは、<strong>往路(ingress)と復路(egress)の記録の有無と組み合わせ</strong>でパターン化できます。これを覚えておくと、シナリオ問題を数秒で判断できます。</p>
<div class="table-wrap"><table><thead><tr><th>フローログの見え方</th><th>意味</th><th>次に調べる場所</th></tr></thead><tbody>
<tr><td>インバウンドの記録がそもそも無い</td><td>パケットがENIに届いていない</td><td>ルートテーブル、インターネットゲートウェイ / NATゲートウェイ、DNSの名前解決、クライアント側のファイアウォール、そもそも見ているENIが違う</td></tr>
<tr><td>インバウンドがREJECT(1件のみ)</td><td>ENIの手前で落とされた</td><td>セキュリティグループのインバウンドルール、またはネットワークACLのインバウンドルール</td></tr>
<tr><td>インバウンドACCEPT + アウトバウンドREJECT</td><td>往路は届いたが、復路が落とされた</td><td><strong>ネットワークACLのアウトバウンド</strong>(エフェメラルポート1024-65535宛ての許可)。セキュリティグループはステートフルなので戻りを拒否しない</td></tr>
<tr><td>インバウンドACCEPT + アウトバウンドの記録が無い</td><td>ENIまでは届いたが、応答パケットが1つも出ていない</td><td><strong>OSのファイアウォール(iptables / nftables / firewalld / ufw / Windows Defender ファイアウォール)と、ポートで待ち受けるプロセスの稼働状態</strong></td></tr>
</tbody></table></div>
<p>この表の3行目と4行目の違いが、今回の問題の分かれ目です。AWS公式ドキュメントも、ネットワークACLのアウトバウンドで戻りが拒否された場合は<strong>ACCEPTとREJECTの2件</strong>が記録されると明記しています。逆にセキュリティグループのインバウンドで拒否された場合は、インスタンスに到達しないため<strong>REJECTが1件だけ</strong>記録されます。今回はREJECTが1件も無いのですから、セキュリティグループもネットワークACLも容疑から外れます。</p>`,
    },
    {
      heading: "なぜ「応答の記録が無い」がOS内部を指すのか",
      html: `<p>ENIより内側でパケットが失われるとき、実は2つのパターンがあります。ここを理解すると、クライアント側の症状からも原因を推測できるようになります。</p>
<ul>
<li><strong>OSのファイアウォールが破棄(DROP)している</strong>: 何も返さずにパケットを捨てるため、ENIから出ていく応答パケットが存在しません。よってアウトバウンドのフローログ記録も残らず、クライアント側は<strong>タイムアウト</strong>になります。</li>
<li><strong>そのポートで何もLISTENしていない</strong>: OSは通常TCPのRSTパケットを返します。RSTもENIを通過するパケットなので、<strong>アウトバウンドにACCEPTの記録が残ります</strong>(カスタムフォーマットで <code>tcp-flags</code> フィールドを含めていればRSTは値4)。クライアント側は待たされずに<strong>接続拒否(Connection refused)</strong>を受け取ります。</li>
</ul>
<p>厳密に言えば「応答の記録がまったく無い」という条件は、前者の<strong>サイレントな破棄</strong>をより強く示唆します。ただしどちらにせよ調査対象は同じ「ENIより内側」であり、実務では<strong>ファイアウォールとプロセスの両方をセットで確認する</strong>のが正解です。</p>
<div class="table-wrap"><table><thead><tr><th>クライアント側の症状</th><th>推測できること</th></tr></thead><tbody>
<tr><td>接続がタイムアウトする</td><td>どこかでパケットが黙って捨てられている。セキュリティグループ / ネットワークACL / OSファイアウォールのDROP / 経路の欠落</td></tr>
<tr><td>即座に「接続が拒否されました」と返る</td><td>パケットは相手に届いてRSTが返っている。ネットワーク経路は正常で、<strong>プロセスが待ち受けていない</strong>可能性が高い</td></tr>
<tr><td>TLSハンドシェイクや証明書のエラー</td><td>TCP接続は成立している。ネットワーク層は問題なく、アプリケーション層の設定を疑う</td></tr>
</tbody></table></div>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>セキュリティグループは拒否時にパケットを黙って破棄するため、「セキュリティグループが原因なら必ずタイムアウト」になります。<strong>即座にConnection refusedが返る時点で、セキュリティグループとネットワークACLは犯人ではありません。</strong></p></div>`,
    },
    {
      heading: "OS内部を確認する手順と、SSHが通らないときの入り方",
      html: `<p>OSにログインできたら、次の3点を順に確認します。</p>
<pre><code># 1. ポート443で待ち受けているプロセスと「待ち受けアドレス」を確認
sudo ss -tlnp | grep :443

# 2. サービスの稼働状態を確認
sudo systemctl status nginx

# 3. OSファイアウォールのルールを確認(環境に応じて使い分け)
sudo iptables -L -n -v
sudo nft list ruleset
sudo firewall-cmd --list-all</code></pre>
<p>ここで見落としがちなのが<strong>待ち受けアドレス</strong>です。プロセスは起動していても <code>127.0.0.1:443</code> にだけバインドしていると、ループバック以外からの接続は受け付けられません。パケットはENIまで届き、フローログにはACCEPTが残り、しかし応答は返らない——今回のシナリオと完全に一致する典型パターンです。<code>0.0.0.0:443</code> や <code>[::]:443</code> でLISTENしているかを必ず確認してください。</p>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>OSファイアウォールが既定で有効かどうかはAMIやOSによって異なります。特にWindows ServerはWindows Defender ファイアウォールが既定で有効で、独自ポートを開けていないという事故が起きやすい構成です。「既定はこうだろう」と決めつけず、必ず実機で確認します。</p></div>
<p>問題のインスタンスにはSSH(ポート22)すら通らないこともあります。その場合はインバウンドポートに依存しない次の手段が使えます。</p>
<ul>
<li><strong>AWS Systems Manager Session Manager</strong>: SSM Agentがアウトバウンドのhttps通信でSSMに接続するため、<strong>インバウンドの許可もキーペアも不要</strong>です。SSM Agentの稼働と、<code>AmazonSSMManagedInstanceCore</code> を含むインスタンスプロファイル、SSMエンドポイントへの到達性(NATゲートウェイまたはインターフェイスVPCエンドポイント)が前提になります。</li>
<li><strong>EC2 Serial Console</strong>: AWS Nitro Systemベースのインスタンスで、<strong>OSのネットワークスタックが壊れていても</strong>シリアル接続でコンソールに入れます。事前にアカウントレベルでのアクセス許可と、OSユーザーのパスワード設定が必要です。ネットワーク設定の変更ミスで自分を締め出したときの最後の手段です。</li>
</ul>`,
    },
    {
      heading: "フローログの盲点と、試験でのひっかけ",
      html: `<p>フローログを「ネットワークの全記録」だと思い込むと誤判断します。次の3つの盲点を押さえておきましょう。</p>
<h4>1. 記録されないトラフィックがある</h4>
<p>フローログはすべてのIPトラフィックを記録するわけではありません。公式に「記録されない」と明記されているものには、<strong>Amazon提供DNSサーバー宛ての通信</strong>(独自DNSサーバー宛ては記録される)、<strong>インスタンスメタデータ(169.254.169.254)</strong>、<strong>Amazon Time Sync Service(169.254.169.123)</strong>、DHCP、ARP、VPCのデフォルトルーター宛て、Windowsのライセンス認証などがあります。「記録が無い = 通信していない」とは限りません。</p>
<h4>2. ペイロードは記録されない</h4>
<p>記録されるのは5タプル(送信元/宛先アドレス・ポート、プロトコル)とパケット数・バイト数などの<strong>メタデータだけ</strong>です。HTTPのステータスコード、TLSのエラー内容、アプリケーションのレスポンス内容はわかりません。「なぜ500エラーが返るのか」をフローログで追うことはできません。</p>
<h4>3. リアルタイムではない</h4>
<p>フローログには<strong>集約間隔(アグリゲーション間隔)</strong>があり、既定の最大値は10分、作成時に1分を選ぶこともできます(Nitroベースのインスタンスに接続されたENIでは常に1分以下)。さらに集約後の配信に、CloudWatch Logsでおよそ5分、Amazon S3でおよそ10分かかり、これはベストエフォートです。また <code>log-status</code> が <code>SKIPDATA</code> のレコードは、内部的な容量制約などで<strong>一部の記録が欠落した</strong>ことを示します(<code>NODATA</code> は集約間隔中に通信が無かったことを示します)。「記録が無い」と判断する前に、集約間隔・配信遅延・SKIPDATAの有無を確認してください。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p><strong>VPC Reachability Analyzer</strong>は実際にパケットを流さず、セキュリティグループ・ネットワークACL・ルートテーブルなどの<strong>構成を静的に解析</strong>してブロック箇所を特定します。裏を返せば、こちらも<strong>OS内部は一切見ません</strong>。今回のようなケースではReachability Analyzerは「到達可能」と回答します。その結果自体が「AWS側の構成は正しい = OS内部が原因」という強い根拠になる、と理解しておくと応用が利きます。</p></div>
<p>最後に、この論点の判断フローを1行にまとめます。<strong>REJECTがあればAWS側の制御(セキュリティグループ / ネットワークACL)、REJECTが無くインバウンドの記録も無ければ経路(ルートテーブル等)、インバウンドACCEPTだけで応答が無ければOS内部</strong>。この3分岐を覚えておけば、フローログを題材にした問題はほぼ判断できます。</p>`,
    },
  ],
  references: [
    {
      label: "フローログレコード(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-log-records.html",
    },
    {
      label: "フローログレコードの例 - セキュリティグループとネットワークACLのルール(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs-records-examples.html",
    },
    {
      label: "フローログの制限事項(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs-limitations.html",
    },
    {
      label: "AWS Systems Manager Session Manager(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html",
    },
  ],
};
