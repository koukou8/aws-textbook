// 特設ページ: 混乱した代理(confused deputy)問題の防ぎ方
export const topic = {
  id: "confused-deputy-external-id",
  title:
    "混乱した代理(confused deputy)問題の防ぎ方: 外部IDとaws:SourceArn/SourceAccountの使い分け",
  description:
    "SaaSベンダーにIAMロールを引き受けさせる構成で頻出の「混乱した代理」問題を、攻撃の仕組みから外部ID(ExternalId)の正しい使い方、クロスサービス版の条件キーまで整理します。",
  exam: "SAA-C03",
  services: ["AWS IAM", "AWS STS", "混乱した代理問題"],
  createdAt: "2026-08-17",
  source: {
    question:
      "多数の顧客のロールを同じ仕組みで引き受けるSaaSベンダーに自社アカウントへのアクセスを許可する際、他の顧客のリクエストで自社のロールが誤って引き受けられる「混乱した代理」問題を防ぐ方法を選ぶ、という趣旨の問題。",
    point:
      "「第三者 + 多数の顧客 + 混乱した代理」が揃ったら、信頼ポリシーのsts:ExternalId条件が決め手。送信元IP制限や最小権限は、ロールが誤って引き受けられること自体を防げない。",
  },
  sections: [
    {
      heading: "結論: 「代理」が誰かで条件キーが決まる",
      html: `<p>混乱した代理(confused deputy)問題とは、<strong>本来その操作を行う権限を持たない者が、より強い権限を持つ相手をだまして操作を代行させる</strong>セキュリティ上の問題です。AWSでは「代理」を務めるのが誰かによって、対策に使う条件キーが2系統に分かれます。ここを取り違えると試験で確実に落とします。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>代理が第三者のAWSアカウント(SaaSベンダーなど)なら、ロールの信頼ポリシーで <code>sts:ExternalId</code>。代理がAWSサービス自身(サービスプリンシパル)なら、リソースベースポリシーで <code>aws:SourceArn</code> / <code>aws:SourceAccount</code>。</strong></p></div>
<p>問題文の見分け方はシンプルです。「サードパーティー」「SaaSベンダー」「多数の顧客に同じ仕組みでアクセスする」といった語が出てきて、<strong>相手が自分のAWSアカウントを持っていて<code>sts:AssumeRole</code>を呼ぶ</strong>構図なら前者(クロスアカウント)です。一方、「CloudTrailが別アカウントのS3バケットに書き込む」「SNSトピックがサービスから呼ばれる」のように<strong>AWSサービスがあなたのリソースにアクセスする</strong>構図なら後者(クロスサービス)です。</p>`,
    },
    {
      heading: "なぜロールARNを渡すだけでは危険なのか",
      html: `<p>外部IDが必要な理由は、<strong>ロールのARNが秘密情報ではない</strong>という一点に尽きます。ARNはアカウントIDとロール名を連結した文字列にすぎず、推測も可能です。この前提で攻撃シナリオを追うと、外部IDの役割がはっきりします。</p>
<ol>
<li>あなたは監視SaaSのベンダー(仮にExample Corp)を利用するため、自社アカウントにロールを作り、その<strong>ロールARNをベンダーに登録</strong>します。ベンダーはあなたの「代理」としてロールを引き受け、リソースを読み取ります。</li>
<li>別の顧客も同じベンダーを使い始めます。この顧客が、自分のロールARNの代わりに<strong>あなたのロールARNを登録します</strong>(推測した、あるいは何らかの経路で知った)。</li>
<li>ベンダーはその顧客のリクエストを受けて、登録されたARN — つまり<strong>あなたのロール</strong> — を引き受けます。信頼ポリシーはベンダーのアカウントIDしか見ていないため、この<code>AssumeRole</code>は成功します。</li>
<li>結果として、別の顧客があなたのリソースにアクセスできてしまいます。ベンダーは悪意なく、誰の代理で動いているかを混同したまま操作を実行しました。これが「混乱した(confused)代理(deputy)」です。</li>
</ol>
<figure class="diagram">
<svg viewBox="0 0 700 268" role="img" aria-label="外部IDが無い場合は別の顧客の依頼であなたのロールが引き受けられてしまい、外部IDがある場合は値が一致せず拒否されることを比較した図">
  <line class="d-zone" x1="350" y1="8" x2="350" y2="260"/>

  <text class="d-title-ng" x="175" y="20" text-anchor="middle">外部IDなし: 引き受けが成立してしまう</text>
  <rect class="d-node" x="50" y="32" width="250" height="42" rx="8"/>
  <text class="d-text" x="175" y="50" text-anchor="middle">別のAWS顧客</text>
  <text class="d-sub" x="175" y="66" text-anchor="middle">あなたのロールARNを登録</text>
  <path class="d-flow" d="M175 74 L175 85"/>
  <path class="d-arrow" d="M175 92 l-4.5 -7 h9 z"/>
  <text class="d-sub" x="183" y="87">自分の代理として依頼</text>
  <rect class="d-node-accent" x="50" y="92" width="250" height="46" rx="8"/>
  <text class="d-text" x="175" y="111" text-anchor="middle">SaaSベンダー(代理)</text>
  <text class="d-mono" x="175" y="127" text-anchor="middle">sts:AssumeRole(ARNのみ)</text>
  <path class="d-flow" d="M175 138 L175 149"/>
  <path class="d-arrow" d="M175 156 l-4.5 -7 h9 z"/>
  <text class="d-sub" x="183" y="151">引き受け要求</text>
  <rect class="d-node" x="50" y="156" width="250" height="46" rx="8"/>
  <text class="d-text" x="175" y="175" text-anchor="middle">あなたのロール</text>
  <text class="d-sub" x="175" y="191" text-anchor="middle">信頼ポリシー: ベンダーのアカウントIDのみ</text>
  <path class="d-flow-ng" d="M175 202 L175 213"/>
  <path class="d-arrow-ng" d="M175 220 l-4.5 -7 h9 z"/>
  <rect class="d-node-ng" x="50" y="220" width="250" height="36" rx="8"/>
  <text class="d-ng" x="175" y="243" text-anchor="middle">成功 → 他人にリソースを読まれる</text>

  <text class="d-title-ok" x="525" y="20" text-anchor="middle">外部IDあり: 不一致で拒否される</text>
  <rect class="d-node" x="400" y="32" width="250" height="42" rx="8"/>
  <text class="d-text" x="525" y="50" text-anchor="middle">別のAWS顧客</text>
  <text class="d-sub" x="525" y="66" text-anchor="middle">あなたのロールARNを登録</text>
  <path class="d-flow" d="M525 74 L525 85"/>
  <path class="d-arrow" d="M525 92 l-4.5 -7 h9 z"/>
  <text class="d-sub" x="533" y="87">自分の代理として依頼</text>
  <rect class="d-node-accent" x="400" y="92" width="250" height="46" rx="8"/>
  <text class="d-text" x="525" y="111" text-anchor="middle">SaaSベンダー(代理)</text>
  <text class="d-mono" x="525" y="127" text-anchor="middle">ExternalId = 67890(依頼元の顧客の値)</text>
  <path class="d-flow" d="M525 138 L525 149"/>
  <path class="d-arrow" d="M525 156 l-4.5 -7 h9 z"/>
  <text class="d-sub" x="533" y="151">引き受け要求</text>
  <rect class="d-node" x="400" y="156" width="250" height="46" rx="8"/>
  <text class="d-text" x="525" y="175" text-anchor="middle">あなたのロール</text>
  <text class="d-sub" x="525" y="191" text-anchor="middle">信頼ポリシー: sts:ExternalId = 12345</text>
  <path class="d-flow-ok" d="M525 202 L525 213"/>
  <path class="d-arrow-ok" d="M525 220 l-4.5 -7 h9 z"/>
  <rect class="d-node-ok" x="400" y="220" width="250" height="36" rx="8"/>
  <text class="d-ok" x="525" y="243" text-anchor="middle">不一致で拒否 → 守られる</text>
</svg>
<figcaption>ベンダーは「依頼してきた顧客の外部ID」を必ず付けて引き受けます。顧客側は他人の外部IDを指定できないため、なりすましによる引き受けが成立しません。</figcaption>
</figure>
<p>ポイントは、<strong>ベンダー自身は悪意がなく、信頼ポリシーも「ベンダーのアカウントだけを信頼する」という意味では正しく書かれている</strong>ことです。欠けているのは「<em>誰の代理として</em>引き受けているのか」という文脈の検証だけです。</p>`,
    },
    {
      heading: "外部ID(ExternalId)の正しい使い方",
      html: `<p>外部IDは、<code>sts:AssumeRole</code>のリクエストに付ける「今どの顧客の代理として動いているか」を表す識別子です。ロールの信頼ポリシーに<code>sts:ExternalId</code>条件を書くと、<strong>正しい外部IDを添えたリクエストしかロールを引き受けられなくなります</strong>。</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": { "AWS": "ベンダーのAWSアカウントID" },
    "Action": "sts:AssumeRole",
    "Condition": {
      "StringEquals": { "sts:ExternalId": "12345" }
    }
  }
}</code></pre>
<p>先ほどの攻撃シナリオに当てはめると、別の顧客のリクエストでベンダーが動くとき、ベンダーは<strong>その顧客の外部ID</strong>(例: 67890)を付けて<code>AssumeRole</code>を呼びます。あなたのロールの信頼ポリシーは12345を要求しているので、この呼び出しは失敗します。<strong>外部IDは顧客が自由に指定できない値なので、なりすましが成立しません。</strong></p>
<h4>実装上の必須ルール</h4>
<ul>
<li><strong>外部IDは顧客ではなくベンダーが生成する。</strong> 顧客が自分で決められる値では、別の顧客が同じ値を申告して回避できてしまい、対策の意味がなくなります。ベンダー側は顧客ごとに一意なランダム文字列(GUIDなど)を割り当て、AWSアカウントごとに1つ使うのが推奨です。</li>
<li><strong>外部IDは秘密情報ではありません。</strong> ロールを閲覧できる人には見えます。パスワードやアクセスキーの代わりではなく、「どの顧客の文脈か」を主張するための識別子だと理解してください。推測しやすい値(ベンダー名、電話番号など)は避けます。</li>
<li>値の制約は<strong>2〜1224文字</strong>で、英数字と <code>+ = , . @ : / -</code> が使えます(空白は不可)。</li>
<li>ベンダー側の責務として、顧客からロールARNを受け取ったら<strong>外部IDなしでも引き受けられてしまわないかテストする</strong>ことがAWSから推奨されています。引き受けられてしまう場合は、顧客が信頼ポリシーを直すまでARNを登録すべきではありません。</li>
</ul>`,
    },
    {
      heading: "クロスサービス版: aws:SourceArn / aws:SourceAccount",
      html: `<p>もう一方の系統が、<strong>AWSサービスが代理を務める</strong>ケースです。たとえばCloudTrailが別アカウントのS3バケットにログを書き込む構成では、バケットポリシーは<code>cloudtrail.amazonaws.com</code>というサービスプリンシパルを許可します。しかしこのポリシーは「CloudTrailであること」しか検証しておらず、<strong>そのCloudTrailを設定したのが誰か</strong>は見ていません。バケット名を知った第三者が自分のアカウントでCloudTrailを設定すれば、あなたのバケットにログを書き込めてしまいます。</p>
<p>これを防ぐのが、リソースベースポリシーに書くグローバル条件キーです。</p>
<div class="table-wrap"><table><thead><tr><th>条件キー</th><th>意味</th><th>使いどころ</th></tr></thead><tbody>
<tr><td><code>aws:SourceArn</code></td><td>サービスが代理している「特定のリソース」を限定</td><td>特定のCloudTrail証跡、特定のSNSトピックなど、リソース単位で絞りたいとき(最も厳密)</td></tr>
<tr><td><code>aws:SourceAccount</code></td><td>サービスが代理している「AWSアカウント」を限定</td><td>アカウント単位で十分なとき。ARNが事前に確定しない場合にも使いやすい</td></tr>
<tr><td><code>aws:SourceOrgID</code></td><td>代理元のAWS Organizations組織を限定</td><td>組織全体をまとめて許可したいとき。RCPで一括適用も可能</td></tr>
</tbody></table></div>
<p>2系統の違いを整理すると次のようになります。</p>
<div class="table-wrap"><table><thead><tr><th>観点</th><th>クロスアカウント(第三者)</th><th>クロスサービス(AWSサービス)</th></tr></thead><tbody>
<tr><td>代理を務めるのは</td><td>SaaSベンダーなど別アカウントのプリンシパル</td><td>AWSサービスプリンシパル(例: cloudtrail.amazonaws.com)</td></tr>
<tr><td>条件を書く場所</td><td>ロールの<strong>信頼ポリシー</strong></td><td>リソースベースポリシー(バケットポリシー等)/ RCP</td></tr>
<tr><td>使う条件キー</td><td><code>sts:ExternalId</code></td><td><code>aws:SourceArn</code> / <code>aws:SourceAccount</code> / <code>aws:SourceOrgID</code></td></tr>
<tr><td>値を決めるのは</td><td>ベンダー(第三者)</td><td>あなた(自分のアカウントID・リソースARN)</td></tr>
</tbody></table></div>`,
    },
    {
      heading: "誤答の理由と試験での注意",
      html: `<p>この論点は「正解を覚える」より「<strong>惜しいが的外れな選択肢がなぜ落ちるか</strong>」を理解しておくと安定します。典型的なひっかけを整理します。</p>
<ul>
<li><strong>IAMユーザーを作ってアクセスキーを渡す</strong> — 長期認証情報を社外と共有することになり、ローテーションも漏洩時の失効も難しくなります。ベストプラクティスに反するうえ、そもそも混乱した代理問題の対策にはなりません。「第三者にアクセスを許可する」というシナリオでアクセスキーが出てきたら、ほぼ確実に誤答です。</li>
<li><strong><code>aws:SourceIp</code>でベンダーの送信元IPに限定する</strong> — 一見それらしく見えますが、ベンダーのIPは変わりうるうえ(可用性リスク)、<strong>すべての顧客のリクエストが同じベンダーのIPから出てくる</strong>ため、別の顧客によるなりすまし引き受けを区別できません。防ぎたい脅威に対して効いていないのが本質的な問題です。</li>
<li><strong>権限ポリシーを最小権限にする</strong> — セキュリティ上は当然やるべきことで、被害範囲を小さくする効果はあります。しかし<strong>ロールが誤って引き受けられること自体は防げません</strong>。「被害を減らす」対策と「発生を防ぐ」対策を混同させるのが出題側の狙いです。</li>
<li><strong>MFAを必須にする</strong>(<code>aws:MultiFactorAuthPresent</code>) — 人間が対話的にロールを切り替える場面向けの制御で、SaaSからの自動アクセスには適用できません。</li>
<li><strong>SCPで制限する</strong> — SCPは自分の組織内アカウントに対するガードレールであり、組織外の第三者によるなりすましには機能しません。</li>
</ul>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>外部IDを「パスワードのような秘密」と説明する選択肢は誤りです。AWSは外部IDを秘密として扱いません。また「<strong>顧客が任意の外部IDを決めてベンダーに伝える</strong>」という記述も誤りで、値を生成・管理するのはベンダー側です。細部を入れ替えたひっかけが出るので、「誰が値を決めるか」を必ず確認してください。</p></div>`,
    },
  ],
  references: [
    {
      label: "混乱した代理問題(IAMユーザーガイド)",
      url: "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/confused-deputy.html",
    },
    {
      label: "サードパーティーが所有するAWSアカウントへのアクセス(IAMユーザーガイド)",
      url: "https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html",
    },
    {
      label: "AssumeRole(AWS STS APIリファレンス)",
      url: "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html",
    },
  ],
};
