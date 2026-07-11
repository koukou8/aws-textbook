// CloudOps教材 分野5(ネットワークとコンテンツ配信)の章コンテンツ
export const chapters = [
  {
    id: "cloudops-d5-ch01",
    domain: 5,
    title: "VPC運用と接続トラブルシューティング",
    sections: [
      {
        heading: "「通信できない」の切り分け手順",
        html: `
<p>運用現場で最も多いネットワークの問い合わせは「インスタンスに接続できない」「サービスに届かない」です。感覚で設定を変更するのではなく、パケットの経路に沿って<strong>決まった順序で切り分ける</strong>のが鉄則で、SOA-C03でもこの手順を前提にしたシナリオ問題が最頻出です。</p>
<ol>
  <li><strong>セキュリティグループ(SG)</strong>: 宛先リソースのインバウンドルールで、該当ポートと送信元(CIDRまたはSG)が許可されているかを確認します。SGはステートフルなので、許可した通信の戻りは自動的に許可されます。</li>
  <li><strong>ネットワークACL(NACL)</strong>: サブネットに関連付けられたNACLの<strong>インバウンドとアウトバウンドの両方</strong>を確認します。ステートレスなので、戻りの通信(エフェメラルポート1024〜65535宛て)も明示的に許可が必要です。</li>
  <li><strong>ルートテーブル</strong>: 送信元・宛先それぞれのサブネットのルートテーブルに、通信相手(インターネット、相手VPC、オンプレミス、エンドポイント)への正しいルートがあるかを確認します。</li>
  <li><strong>ゲートウェイ類</strong>: インターネットゲートウェイ(IGW)のアタッチ、NATゲートウェイの配置(IGWへのルートを持つパブリックサブネットにあるか)、パブリックIPアドレスの有無を確認します。IPv6のアウトバウンド専用通信にはEgress-onlyインターネットゲートウェイを使います。</li>
</ol>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>セキュリティグループ</th><th>ネットワークACL</th></tr></thead>
  <tbody>
    <tr><td>適用単位</td><td>ENI(インスタンス)単位</td><td>サブネット単位</td></tr>
    <tr><td>状態管理</td><td>ステートフル(戻りは自動許可)</td><td>ステートレス(戻りも明示許可)</td></tr>
    <tr><td>ルール</td><td>許可のみ</td><td>許可と拒否の両方</td></tr>
    <tr><td>評価順序</td><td>全ルールを評価</td><td>ルール番号の小さい順に評価し、最初の一致で確定</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「SGは正しく設定されているのにタイムアウトする」シナリオでは、カスタムNACLのアウトバウンドでエフェメラルポート宛ての戻り通信が許可されていないパターンが定番の正解です。</p></div>`,
      },
      {
        heading: "プライベート接続の使い分け(エンドポイント・ピアリング・Transit Gateway)",
        html: `
<p>インターネットを経由しないプライベート接続には複数の選択肢があり、<strong>「何と何をつなぐか」「規模」「コスト」</strong>で使い分けます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>方式</th><th>主な用途</th><th>特徴・料金</th></tr></thead>
  <tbody>
    <tr><td>ゲートウェイVPCエンドポイント</td><td>VPC内からS3・DynamoDBへ</td><td>ルートテーブルにプレフィックスリスト宛てルートを追加して機能。<strong>追加料金なし</strong>。VPC内からのみ利用可</td></tr>
    <tr><td>インターフェイスVPCエンドポイント(AWS PrivateLink)</td><td>多数のAWSサービスやSaaSへのプライベート接続</td><td>サブネットにENIとプライベートIPを作成。<strong>オンプレミスからDirect Connect / VPN経由でも利用可</strong>。時間+データ処理課金</td></tr>
    <tr><td>VPCピアリング</td><td>2つのVPCの1対1接続</td><td>非推移的(AをB、BをCとつないでもAとCは通信不可)。CIDRの重複は不可。ゲートウェイ機器を挟まず低コスト</td></tr>
    <tr><td>AWS Transit Gateway</td><td>多数のVPCとオンプレミスをハブ&スポークで集約</td><td>推移的ルーティングが可能でフルメッシュのピアリング管理が不要。アタッチメント+データ処理課金</td></tr>
  </tbody>
</table>
</div>
<p>判断の目安は次のとおりです。</p>
<ul>
  <li>VPC内からS3・DynamoDBだけなら、まず無料の<strong>ゲートウェイエンドポイント</strong>。</li>
  <li>オンプレミスからもAWSサービスへプライベートに届かせたい、S3以外のサービスも対象にしたい場合は<strong>インターフェイスエンドポイント</strong>。</li>
  <li>VPCが2〜3個の固定的な接続なら<strong>ピアリング</strong>、数十VPC以上や今後の拡張・オンプレミス接続の集約が見えているなら<strong>Transit Gateway</strong>。</li>
</ul>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>ピアリングがアクティブでも、双方のルートテーブルへの相手CIDR宛てルート追加と、SG/NACLの許可がなければ通信できません。「接続を作ったのに通信できない」原因の多くはルートテーブルの追加漏れです。</p></div>`,
      },
      {
        heading: "VPCフローログとReachability Analyzerによる調査",
        html: `
<p><strong>VPCフローログ</strong>は、ENIを通過したIPトラフィックのメタデータ(送信元/宛先アドレス・ポート、プロトコル、ACCEPT/REJECTなど)を記録します。出力先はAmazon CloudWatch Logs、Amazon S3、Amazon Data Firehoseから選べます。パケットの中身(ペイロード)は記録しない点に注意してください。</p>
<pre><code>2 123456789010 eni-0a1b2c3d 203.0.113.12 10.0.1.15 54321 443 6 12 3480 1689000000 1689000060 ACCEPT OK
2 123456789010 eni-0a1b2c3d 10.0.1.15 203.0.113.12 443 54321 6 4 240 1689000000 1689000060 REJECT OK</code></pre>
<p>フィールドは「バージョン、アカウントID、ENI、送信元IP、宛先IP、送信元ポート、宛先ポート、プロトコル(6=TCP)、パケット数、バイト数、開始/終了時刻、アクション、ログステータス」の順です。読み方の定番パターンを押さえましょう。</p>
<ul>
  <li><strong>インバウンドACCEPT+戻りのアウトバウンドREJECT</strong>: SGはステートフルで戻りを拒否しないため、犯人は<strong>ステートレスなNACLのアウトバウンド</strong>です。</li>
  <li><strong>インバウンドがREJECT</strong>: SGのインバウンド未許可か、NACLのインバウンド拒否のどちらかです。</li>
  <li>記録がそもそも無い場合は、経路(ルートテーブル)の問題やフローログの対象範囲外の可能性を疑います。</li>
</ul>
<p><strong>VPC Reachability Analyzer</strong>は、送信元と宛先(ENI、インスタンス、IGW、VPNゲートウェイなど)を指定すると、<strong>実際にパケットを送信せず</strong>に構成を静的に分析し、到達可能かどうか、不可の場合は<strong>どのコンポーネント(SG・NACL・ルートテーブルなど)がブロックしているか</strong>を特定してくれます。手作業での切り分けを大幅に短縮できるため、まず経路仮説を立てるのに最適です。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p>「実トラフィックを流さずに経路を検証したい」「ブロックしている箇所を特定したい」というキーワードが出たらReachability Analyzer、「実際の通信の許可/拒否の記録を分析したい」ならVPCフローログです。</p></div>`,
      },
      {
        heading: "Site-to-Site VPNとハイブリッド接続のトラブルシューティング",
        html: `
<p>AWS Site-to-Site VPNは、オンプレミスの<strong>カスタマーゲートウェイデバイス</strong>と、AWS側の<strong>仮想プライベートゲートウェイ(VGW)またはTransit Gateway</strong>の間をIPsecで接続します。1つのVPN接続には冗長化のため<strong>2本のトンネル</strong>が用意され、高可用性のため両方を構成することが推奨されます。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>症状</th><th>主な確認ポイント</th></tr></thead>
  <tbody>
    <tr><td>トンネルがUPにならない</td><td>事前共有キーの不一致、カスタマーゲートウェイのグローバルIP設定、オンプレミス側ファイアウォールのUDP 500/4500(IKE/NAT-T)の許可</td></tr>
    <tr><td>トンネルはUPだが通信できない</td><td><strong>VPCのルートテーブルにオンプレミスCIDR宛てのルートがあるか(ルート伝播の有効化または静的ルート追加)</strong>、SG/NACLの許可、オンプレミス側のルーティングとファイアウォール</td></tr>
    <tr><td>断続的に切断される</td><td>トンネルのアイドルタイムアウト(定期的なトラフィックやDPD設定)、片側トンネルのみの利用、オンプレミス機器の再ネゴシエーション設定</td></tr>
  </tbody>
</table>
</div>
<p>BGPを使う動的ルーティングでは、VPC側のルートテーブルで<strong>ルート伝播(Route Propagation)</strong>を有効にするとオンプレミスの経路が自動反映されます。静的ルーティングの場合はVPN接続とルートテーブルの両方に手動でCIDRを設定します。また、DNSの名前解決が絡む場合(オンプレミスのホスト名でアクセスできない等)は、次章で扱うRoute 53 Resolverエンドポイントの構成も確認対象です。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「トンネルはUPなのに通信できない」場合の第一容疑者はルートテーブル(伝播の無効化・ルート不足)です。トンネルがUPである時点でIKE/IPsec(事前共有キー等)は確立済みなので、キー不一致を選ばせるひっかけに注意してください。</p></div>`,
      },
      {
        heading: "ネットワークコストの最適化",
        html: `
<p>ネットワークコストは「気づいたら膨らんでいる」代表格で、SOA-C03ではNATゲートウェイのデータ処理料金とAZ間データ転送料金を削減する定番パターンが問われます。AWS Cost Explorerでコストの内訳を確認し、VPCフローログで大量通信の送信元・宛先を特定するのが調査の起点です。</p>
<h4>定番の削減パターン</h4>
<ul>
  <li><strong>S3・DynamoDB宛ての通信がNATゲートウェイを経由している</strong> → <strong>ゲートウェイVPCエンドポイント</strong>(追加料金なし)に切り替え、NATのデータ処理料金を丸ごと削減します。</li>
  <li><strong>その他のAWSサービス(ECR、CloudWatch、Systems Managerなど)への通信がNAT経由</strong> → インターフェイスエンドポイントの時間+処理料金とNAT処理料金を比較し、通信量が多いサービスはエンドポイント化を検討します。</li>
  <li><strong>NATゲートウェイと別AZのインスタンスが通信している</strong> → NATの処理料金に加えて<strong>AZ間データ転送料金</strong>が発生します。AZごとにNATゲートウェイを配置し、各AZのルートテーブルで同一AZのNATへ向けると、コスト削減と同時にAZ障害への耐性も高まります。</li>
  <li><strong>同一リージョンのVPC間で大量のデータ転送がある</strong> → 経由するコンポーネント(Transit Gatewayのデータ処理など)の料金も含めて、ピアリングとの比較を検討します。</li>
</ul>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「NATゲートウェイの料金が高い」というシナリオでは、まず宛先を確認します。宛先がS3やDynamoDBならゲートウェイエンドポイントへの置き換えが最有力の正解です。</p></div>
<p>詳細は<a href="https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html" target="_blank" rel="noopener noreferrer">NATゲートウェイのドキュメント</a>や<a href="https://aws.amazon.com/jp/vpc/pricing/" target="_blank" rel="noopener noreferrer">Amazon VPCの料金ページ</a>で確認できます。</p>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d5-ch01-q01",
      "cloudops-d5-ch01-q02",
      "cloudops-d5-ch01-q03",
      "cloudops-d5-ch01-q04",
      "cloudops-d5-ch01-q05",
      "cloudops-d5-ch01-q06",
      "cloudops-d5-ch01-q07",
      "cloudops-d5-ch01-q08",
      "cloudops-d5-ch01-q09",
      "cloudops-d5-ch01-q10",
      "cloudops-d5-ch01-q11",
    ],
  },
  {
    id: "cloudops-d5-ch02",
    domain: 5,
    title: "DNS・コンテンツ配信の運用",
    sections: [
      {
        heading: "Route 53ルーティングポリシーの使い分けとヘルスチェック",
        html: `
<p>Amazon Route 53のルーティングポリシーは「どの要件のときにどれを選ぶか」がそのまま試験の論点になります。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ポリシー</th><th>選ぶべき要件</th></tr></thead>
  <tbody>
    <tr><td>シンプル</td><td>単一リソースへの標準的な名前解決</td></tr>
    <tr><td>加重(Weighted)</td><td>指定した重みの比率で分配。<strong>カナリアリリース(新版に10%だけ)</strong>やA/Bテスト</td></tr>
    <tr><td>レイテンシーベース</td><td>複数リージョンのうち、ユーザーにとって最も低レイテンシのリージョンへ誘導</td></tr>
    <tr><td>フェイルオーバー</td><td><strong>アクティブ/パッシブのDR構成</strong>。ヘルスチェックと組み合わせ、プライマリ異常時のみセカンダリへ</td></tr>
    <tr><td>位置情報(Geolocation)</td><td>ユーザーの国・地域ごとに応答を変える(コンテンツの出し分け・規制対応)</td></tr>
    <tr><td>地理的近接性(Geoproximity)</td><td>リソースの場所との近さで振り分け、バイアス値で範囲を調整</td></tr>
    <tr><td>複数値回答(Multivalue)</td><td>正常なレコードを最大8件ランダムに返す簡易的な分散と冗長化</td></tr>
  </tbody>
</table>
</div>
<p><strong>ヘルスチェック</strong>には、(1)エンドポイントを監視するもの、(2)他のヘルスチェックの結果を組み合わせる計算済みヘルスチェック、(3)CloudWatchアラームの状態を監視するもの、の3種類があります。フェイルオーバールーティングはヘルスチェックと組み合わせて初めて自動切り替えが機能します。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>ヘルスチェックはRoute 53が世界各地に持つ<strong>ヘルスチェッカーのIPアドレス範囲</strong>からエンドポイントへ直接アクセスして行われます。利用者からは正常に見えるのにUnhealthyになる場合、SGやファイアウォールでヘルスチェッカーのIP範囲を許可していないのが定番の原因です。また、HTTPSヘルスチェックはSSL/TLS証明書の有効性を検証しません。</p></div>
<p>なお、ELBやCloudFrontなどAWSリソースへは<strong>エイリアスレコード</strong>を使い、「ターゲットの正常性を評価」を有効化するとリソース側の状態をフェイルオーバー判断に利用できます。</p>`,
      },
      {
        heading: "Route 53 Resolver・クエリログ・DNS Firewall",
        html: `
<p>各VPCには<strong>Route 53 Resolver</strong>(VPCのCIDR先頭+2のアドレス、通称AmazonProvidedDNS)が用意され、VPC内のDNSクエリを処理します。ハイブリッド環境では、オンプレミスとの間でクエリを中継する<strong>Resolverエンドポイント</strong>を構成します。</p>
<ul>
  <li><strong>インバウンドエンドポイント</strong>: <strong>オンプレミス→AWS</strong>方向。オンプレミスのDNSサーバーからの転送を受け付け、プライベートホストゾーンなどを解決させます。</li>
  <li><strong>アウトバウンドエンドポイント+転送ルール</strong>: <strong>AWS→オンプレミス</strong>方向。VPC内からオンプレミスのドメイン(corp.example.com など)宛てのクエリを、指定したオンプレミスDNSサーバーへ転送します。</li>
</ul>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「クエリがどちらからどちらへ向かうか」で覚えます。オンプレミスのサーバーがVPC内の名前を引けない→インバウンド、VPC内のインスタンスがオンプレミスの名前を引けない→アウトバウンド+転送ルールです。</p></div>
<p><strong>Resolverクエリログ</strong>を有効化すると、VPC内のリソースが「いつ・どのドメインを・どのインスタンスから」クエリしたかを記録し、CloudWatch Logs、S3、Data Firehoseへ出力できます。マルウェア感染調査(不審なドメインを解決したインスタンスの特定)や、DNS Firewallでブロックされたクエリの確認に使います。</p>
<p><strong>Route 53 Resolver DNS Firewall</strong>は、VPCから出るDNSクエリを<strong>ドメインリスト</strong>に基づいてフィルタリングします。ルールのアクションはALLOW(許可)・ALERT(記録のみ)・BLOCK(拒否)の3種類で、AWSマネージドドメインリストを使えば既知のマルウェア・ボットネット関連ドメインをまとめて遮断できます。Amazon GuardDutyがC2ドメインへのクエリを検出した場合の対処として、DNS Firewallでのブロックが定番の組み合わせです。</p>`,
      },
      {
        heading: "CloudFrontのキャッシュ問題の特定と修復",
        html: `
<p>Amazon CloudFrontの運用で問われるのは主に2つ、<strong>「キャッシュヒット率が低い」</strong>と<strong>「古いコンテンツが配信され続ける」</strong>です。ヒット率はCloudWatchのCacheHitRateメトリクスや、応答の x-cache ヘッダー(Hit/Miss from cloudfront)、標準ログの x-edge-result-type で確認できます。</p>
<h4>キャッシュヒット率が低い場合</h4>
<ul>
  <li><strong>キャッシュキーが細分化されすぎている</strong>: 不要なHTTPヘッダー・クエリ文字列・Cookieがキャッシュキーに含まれると、同じコンテンツでも別キャッシュとして扱われミスが増えます。キャッシュポリシーで<strong>キーに含める値を必要最小限に絞る</strong>のが最も効果的です。</li>
  <li><strong>TTLが短すぎる</strong>: オリジンのCache-Controlヘッダー(max-age)やビヘイビアのTTL設定を見直し、更新頻度の低いコンテンツはキャッシュ期間を延ばします。</li>
  <li>クエリ文字列パラメータの順序や大文字小文字の不統一もキーの分裂を招きます。アプリケーション側で正規化します。</li>
  <li>オリジン負荷をさらに下げたい場合は<strong>Origin Shield</strong>(オリジン前段の集約キャッシュ層)の有効化も検討します。</li>
</ul>
<h4>古いコンテンツが配信され続ける場合</h4>
<ul>
  <li><strong>即時に反映したい</strong>: パスを指定して<strong>キャッシュ無効化(invalidation)</strong>を実行します(/* で全体も可)。エッジのキャッシュが削除され、次のリクエストでオリジンから最新版を取得します。</li>
  <li><strong>恒久的な再発防止</strong>: デプロイのたびに無効化するのではなく、<strong>ファイル名にバージョン識別子を付ける</strong>(styles-v2.css など)方式にすると、URLが変わるため即時に新版が配信され、無効化のコストも不要になります。</li>
</ul>
<div class="callout callout-important"><span class="callout-title">重要</span><p>無効化はキャッシュを消す(=直後はミスが増える)操作であり、ヒット率改善の手段ではありません。「ヒット率を上げたい」ならキャッシュキーの最小化とTTL延長、「更新を今すぐ届けたい」なら無効化、と目的で使い分けます。</p></div>`,
      },
      {
        heading: "OACによるオリジン保護とGlobal Acceleratorとの使い分け",
        html: `
<p>S3オリジンを公開したままにすると、CloudFrontを迂回してS3のURLへ直接アクセスされ、WAFや署名付きURLなどの制御をすり抜けられてしまいます。現在の推奨は<strong>オリジンアクセスコントロール(OAC)</strong>です(旧方式のオリジンアクセスアイデンティティ(OAI)はレガシー)。OACを設定するとCloudFrontがSigV4でリクエストに署名し、バケットポリシーで「自分のディストリビューションからのアクセスのみ」を許可できます。</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::example-bucket/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/EDFDVBD6EXAMPLE"
      }
    }
  }]
}</code></pre>
<p>あわせてS3のブロックパブリックアクセスを有効化すれば、直接アクセスは拒否され、CloudFront経由のみ許可されます。カスタムオリジン(ALB等)の場合は、CloudFrontが付与するカスタムヘッダーをALB側で検証する方式やマネージドプレフィックスリストで保護します。</p>
<h4>CloudFrontとAWS Global Acceleratorの使い分け</h4>
<div class="table-wrap">
<table>
  <thead><tr><th>項目</th><th>CloudFront</th><th>Global Accelerator</th></tr></thead>
  <tbody>
    <tr><td>プロトコル</td><td>HTTP/HTTPS</td><td>TCP/UDP(非HTTPも可)</td></tr>
    <tr><td>キャッシュ</td><td>エッジでキャッシュする</td><td>キャッシュしない(経路最適化)</td></tr>
    <tr><td>IPアドレス</td><td>ディストリビューションのドメイン名を使用</td><td><strong>2つの固定エニーキャストIP</strong>を提供</td></tr>
    <tr><td>典型用途</td><td>静的・動的Webコンテンツ配信、動画配信</td><td>ゲーム・IoT・VoIP、固定IPが必要な場合、リージョン間の高速フェイルオーバー</td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>「UDP」「固定IPをファイアウォールに登録」「キャッシュ不可の動的トラフィック」ならGlobal Accelerator、「HTTPコンテンツをキャッシュして配信」ならCloudFrontです。</p></div>`,
      },
      {
        heading: "ELB・WAF・CloudFrontログの解釈",
        html: `
<p>配信経路のどこで問題が起きたかは、各レイヤーのログを突き合わせて特定します。いずれのログも<strong>デフォルトでは無効</strong>で、明示的に有効化(ELBアクセスログはS3バケットへの出力設定など)が必要です。</p>
<div class="table-wrap">
<table>
  <thead><tr><th>ログ</th><th>着目フィールド</th><th>分かること</th></tr></thead>
  <tbody>
    <tr><td>ALBアクセスログ</td><td>elb_status_code / target_status_code、target_processing_time</td><td>エラーをALBが生成したのかターゲットが返したのかの切り分け、バックエンドの遅延</td></tr>
    <tr><td>CloudFront標準ログ</td><td>x-edge-result-type(Hit / Miss / Error など)、sc-status</td><td>キャッシュの当たり具合、エッジで発生したエラー</td></tr>
    <tr><td>AWS WAFログ</td><td>action(ALLOW / BLOCK)、terminatingRuleId</td><td>どのルールがリクエストをブロックしたか(誤検知調査の起点)</td></tr>
  </tbody>
</table>
</div>
<p>ALBアクセスログの読み方の定番は次のとおりです。</p>
<ul>
  <li><strong>elb_status_code=502、target_status_code=「-」</strong>: ターゲットから有効な応答が得られず(接続失敗・不正な応答)、ALBが502 Bad Gatewayを生成しています。ターゲットのアプリケーションやヘルス状態を調査します。</li>
  <li><strong>elb_status_code=503</strong>: 登録済みの正常なターゲットが存在しない(ターゲットグループが空、全ターゲットUnhealthy)場合の典型です。</li>
  <li><strong>両方に同じ5xx</strong>: ターゲットのアプリケーション自身がエラーを返しています。アプリケーションログを調査します。</li>
</ul>
<p>WAFで正当なリクエストがブロックされる誤検知の対応は、(1)WAFログのterminatingRuleIdで原因ルールを特定し、(2)そのルールを<strong>カウント(Count)モード</strong>に変更してブロックせずマッチ状況を観測し、(3)除外や調整を行ってから再度ブロックに戻す、という手順が運用の定石です。</p>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「どのログを見れば何が分かるか」の対応付けが問われます。WAFのブロック原因はALBアクセスログには記録されない(WAFログが必要)点、CloudFrontのキャッシュ判定はx-edge-result-typeで見る点を押さえてください。</p></div>`,
      },
    ],
    checkQuestionIds: [
      "cloudops-d5-ch02-q01",
      "cloudops-d5-ch02-q02",
      "cloudops-d5-ch02-q03",
      "cloudops-d5-ch02-q04",
      "cloudops-d5-ch02-q05",
      "cloudops-d5-ch02-q06",
      "cloudops-d5-ch02-q07",
      "cloudops-d5-ch02-q08",
      "cloudops-d5-ch02-q09",
      "cloudops-d5-ch02-q10",
      "cloudops-d5-ch02-q11",
    ],
  },
];
