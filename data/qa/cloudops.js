// CloudOps一問一答(SOA-C03)
// ダッシュボードの「一問一答」セクションで使う設問データ。
// 1問ごとに「選択肢 → 一答(結論) → 決め手 → 詳しい解説」を持つ。
export const qaSet = {
  id: "cloudops",
  title: "CloudOps一問一答",
  exam: "SOA-C03",
  description:
    "本試験で判断を誤りやすい論点を、結論と決め手までまとめて確認できる一問一答です。",
  items: [
    {
      id: "qa-cloudops-001",
      domain: 4,
      topic: "S3 Object Lock",
      question:
        "ある企業がAmazon S3バケットにバックアップを保存しています。バックアップは作成後、少なくとも3ヶ月間は削除されてはなりません。この要件を満たすために、CloudOpsエンジニアは何をすべきですか。",
      choices: [
        {
          text: "新しいS3バケットでS3 Object Lockをガバナンスモードで有効化する。すべてのバックアップを3ヶ月の保持期間を設定して新しいS3バケットに配置する",
          correct: false,
          comment:
            "ガバナンスモードは、s3:BypassGovernanceRetention という特別な権限を持つユーザーであれば保持期間中でもオブジェクトを削除できます。「少なくとも3ヶ月間は削除されてはならない」という例外を認めない要件には、誰も削除できないコンプライアンスモードが必要です。",
        },
        {
          text: "既存のS3バケットでS3バージョニングを有効化する。バックアップを保護するためにS3ライフサイクルルールを設定する",
          correct: false,
          comment:
            "S3バージョニングはオブジェクトの複数バージョンを保持する機能で、削除そのものを防ぐわけではありません。権限があれば削除マーカーの追加も各バージョンの削除も可能です。S3ライフサイクルルールはストレージクラスの移行や有効期限による自動削除のための機能であり、削除防止とはむしろ逆方向の機能です。",
        },
        {
          text: "新しいS3バケットでS3 Object Lockをコンプライアンスモードで有効化する。すべてのバックアップを3ヶ月の保持期間を設定して新しいS3バケットに配置する",
          correct: true,
          comment:
            "コンプライアンスモードは、設定した保持期間中はrootユーザーを含むいかなるユーザーもオブジェクトを削除・上書きできないWORM(Write Once Read Many)保護を提供します。保持期間の短縮やモードの変更もできないため、「削除されてはならない」という絶対的な要件を確実に満たせます。",
        },
        {
          text: "すべてのユーザーに対して s3:DeleteObject アクションを拒否するIAMポリシーを設定する。オブジェクトが書き込まれてから3ヶ月後にそのポリシーを削除する",
          correct: false,
          comment:
            "IAMポリシーで拒否しても、IAM管理者権限を持つユーザーやrootユーザーはポリシー自体を変更・削除できるため、削除を完全には防止できません。バックアップが継続的に生成される環境で、各オブジェクトの3ヶ月後にポリシーを手動で切り替える運用も非現実的です。",
        },
      ],
      answer:
        "S3 Object Lockをコンプライアンスモードで有効化したバケットに、保持期間3ヶ月を設定して保存します。",
      keyPoint:
        "「削除されてはならない」= rootユーザーを含め誰も消せないこと。バイパス権限で消せるガバナンスモードでは足りず、コンプライアンスモードが答えになります。",
      detail: [
        {
          heading: "問われている要件",
          html: `<ul>
<li>S3に保存されたバックアップを削除から保護する</li>
<li>保護期間はオブジェクト作成後、少なくとも3ヶ月間</li>
<li>rootユーザーを含むすべてのユーザーによる削除を防止する</li>
<li>継続的に生成されるバックアップに、自動的かつ確実に適用できる</li>
</ul>
<p>4つ目の「継続的に生成される」が、手動運用を前提とした選択肢を落とすための条件になっています。</p>`,
        },
        {
          heading: "S3 Object Lockの基礎",
          html: `<p>S3 Object LockはWORM(Write Once Read Many)モデルを実装する機能で、指定した保持期間中はオブジェクトの削除・上書きを<strong>技術的に不可能</strong>にします。IAMポリシーのような「権限による制限」ではなく、ストレージ側の保護である点が本質です。</p>
<ul>
<li>保護方法は<strong>保持期間(Retain Until Date)</strong>と<strong>リーガルホールド(Legal Hold)</strong>の2種類</li>
<li>Object Lockを有効化するとS3バージョニングも自動的に有効になり、以後バージョニングを無効化できない</li>
<li>2023年11月以降は、既存バケットに対しても有効化できる</li>
</ul>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>保持期間は<strong>オブジェクトのバージョン単位</strong>で設定されます。バケットにデフォルトの保持設定を入れておけば、後から追加されるバックアップにも自動的に同じ保持期間が適用されます。</p></div>`,
        },
        {
          heading: "コンプライアンスモードとガバナンスモードの違い",
          html: `<div class="table-wrap"><table>
<thead><tr><th>観点</th><th>コンプライアンスモード</th><th>ガバナンスモード</th></tr></thead>
<tbody>
<tr><td>保持期間中の削除・上書き</td><td>rootユーザーを含め不可</td><td>s3:BypassGovernanceRetention 権限があれば可能</td></tr>
<tr><td>保持期間の短縮</td><td>不可</td><td>権限があれば可能</td></tr>
<tr><td>モードの解除・変更</td><td>不可</td><td>権限があれば可能</td></tr>
<tr><td>主な用途</td><td>規制要件への準拠(SEC規則17a-4(f)など)</td><td>誤削除の防止。運用上の柔軟性を残したい場合</td></tr>
</tbody>
</table></div>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>コンプライアンスモードは<strong>間違えても取り消せません</strong>。問題文が「誤削除を防ぎたい」「管理者による例外を認めてよい」というトーンならガバナンスモード、「削除されてはならない」「規制で要求されている」ならコンプライアンスモードと読み分けます。</p></div>`,
        },
        {
          heading: "解くための考え方",
          html: `<p>「削除されてはならない」という表現は、例外を認めない絶対的な禁止を意味します。したがって、<strong>設定変更や権限付与によっても削除できない技術的な保護</strong>が必要だと考えます。</p>
<ol>
<li><strong>IAMポリシーによる削除拒否</strong>は、ポリシー自体を書き換えられる管理者とrootユーザーの存在で崩れます。加えて、オブジェクトごとに3ヶ月後の解除を手作業で管理するのは現実的ではありません。</li>
<li><strong>バージョニング + ライフサイクルルール</strong>は履歴の保持とストレージ管理の機能であり、削除防止の仕組みではありません。</li>
<li>残るのは<strong>S3 Object Lock</strong>です。あとはモードの選択だけで、バイパス権限を持つ者が削除できるガバナンスモードは要件を満たしません。</li>
</ol>
<p>以上から、コンプライアンスモードで保持期間3ヶ月を設定する構成が正解になります。</p>`,
        },
      ],
      references: [
        {
          label: "S3 Object Lock を使用したオブジェクトのロック",
          url: "https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lock.html",
        },
      ],
    },
    {
      id: "qa-cloudops-002",
      domain: 2,
      topic: "AWS Backup",
      question:
        "同社はAWS Organizationsを使用してアカウントを管理しています。本番アカウントでは、現在および将来のすべてのAmazon EC2インスタンスとAmazon Elastic File System(Amazon EFS)ファイルシステムについて、すべてのデータを毎日バックアップし、30日間保持する必要があります。最小限の労力でこれらの要件を満たすソリューションはどれですか。",
      choices: [
        {
          text: "AWS Backupでバックアッププランを作成し、リソースIDでリソースを割り当てる。毎日プランを編集して新しいリソースを追加し、30日後にバックアップを期限切れにするライフサイクルポリシーで毎日実行するようスケジュールする",
          correct: false,
          comment:
            "AWS Backupの選択自体は適切ですが、リソースIDベースの割り当てでは新しいリソースが自動的に対象になりません。毎日プランを編集する運用が前提になっており、「最小限の労力」という要件を満たしません。",
        },
        {
          text: "Amazon Data Lifecycle Manager(Amazon DLM)でライフサイクルポリシーを作成し、タグで割り当てる。既存のEC2とEFSに正しくタグ付けし、正しいタグがなければリソースを作成できないサービスコントロールポリシー(SCP)を適用し、30日の保持期間で毎日スナップショットを作成する",
          correct: false,
          comment:
            "タグベースの管理とSCPによる強制は良い方向性ですが、Amazon DLMはAmazon EFSのバックアップに対応していないため、「EFSファイルシステムのすべてのデータを毎日バックアップする」という要件を満たせません。",
        },
        {
          text: "AWS Backupでバックアッププランを作成し、タグでリソースを割り当てる。既存のEC2とEFSに正しくタグ付けし、本番アカウントのOUにSCPを適用して正しいタグがなければインスタンスやファイルシステムを作成できないようにする。毎日実行するようスケジュールし、30日後に期限切れとなるライフサイクルポリシーを設定する",
          correct: true,
          comment:
            "AWS BackupはEC2とEFSの両方に対応し、タグベースの割り当てにより新しいリソースも自動的に対象になります。SCPでタグ付けを強制することで、将来作成されるリソースも確実にバックアップ対象となり、手動管理が不要になります。",
        },
        {
          text: "Amazon Data Lifecycle Manager(Amazon DLM)でライフサイクルポリシーを作成し、既存のEC2とEFSをリソースIDで割り当てる。毎日ポリシーを編集して新しいリソースを含め、30日間の保持期間で毎日スナップショットを作成する",
          correct: false,
          comment:
            "Amazon DLMは主にAmazon EBSスナップショットとAMIの管理を目的としたサービスで、Amazon EFSには対応していません。さらに毎日のポリシー編集が必要で、「最小限の労力」という要件にも反します。",
        },
      ],
      answer:
        "AWS Backupのバックアッププランをタグベースで割り当て、SCPでタグ付けを強制します。",
      keyPoint:
        "EFSが対象に入った時点でAmazon DLMは脱落。「将来のリソースも」+「最小限の労力」= タグベース割り当て + SCPによるタグ強制、と読み替えます。",
      detail: [
        {
          heading: "問われている要件",
          html: `<ul>
<li>現在および<strong>将来の</strong>すべてのEC2インスタンスとEFSファイルシステムを毎日バックアップする</li>
<li>バックアップを30日間保持する</li>
<li><strong>最小限の労力</strong>で実現する(継続的な手作業を発生させない)</li>
</ul>
<p>「現在および将来」と「最小限の労力」がセットで出てきたら、リソースの追加に人間が追従しない仕組み、つまりタグベースの自動割り当てを探します。</p>`,
        },
        {
          heading: "AWS Backup と Amazon DLM の守備範囲",
          html: `<div class="table-wrap"><table>
<thead><tr><th>観点</th><th>AWS Backup</th><th>Amazon Data Lifecycle Manager</th></tr></thead>
<tbody>
<tr><td>主な対象</td><td>EC2、EBS、EFS、Amazon RDS、Amazon DynamoDB、Amazon FSx、AWS Storage Gateway など</td><td>EBSスナップショットとAMI</td></tr>
<tr><td>Amazon EFS</td><td>対応</td><td>非対応</td></tr>
<tr><td>割り当て方法</td><td>タグ または リソースID</td><td>タグ</td></tr>
<tr><td>保持・ライフサイクル</td><td>バックアッププランで保持期間とコールドストレージ移行を定義</td><td>スナップショットの世代・期間で管理</td></tr>
<tr><td>その他</td><td>クロスリージョン/クロスアカウントコピー、Backup Vault Lock、レポート</td><td>EBS中心のシンプルな自動化</td></tr>
</tbody>
</table></div>
<div class="callout callout-important"><span class="callout-title">重要</span><p>対象サービスに<strong>EFS、RDS、DynamoDB、FSxが1つでも含まれたらAWS Backup</strong>です。Amazon DLMが正解になるのは、EBSスナップショットとAMIだけで完結する問題に限られます。</p></div>`,
        },
        {
          heading: "タグベース割り当てとSCPによるタグ強制",
          html: `<p>AWS Backupのリソース割り当てには2通りあり、運用負荷が大きく異なります。</p>
<ul>
<li><strong>タグベース</strong>: 指定したタグを持つリソースがすべて自動的に対象になる。新しいリソースもタグさえ付いていれば自動で含まれる</li>
<li><strong>リソースIDベース</strong>: 対象を個別に指定する。新しいリソースは手動で追加が必要</li>
</ul>
<p>ただしタグベースには「タグの付け忘れ」という穴があります。ここを塞ぐのがAWS Organizationsの<strong>サービスコントロールポリシー(SCP)</strong>です。本番アカウントのOUに対して、必須タグが付いていないリソース作成を <code>aws:RequestTag</code> 条件で拒否すれば、タグなしのEC2インスタンスやEFSファイルシステムはそもそも作成できなくなります。</p>
<p>結果として「作られたリソースは必ずタグを持つ → タグを持つリソースは必ずバックアップされる」という連鎖が成立し、人手の介在なしに要件が満たされ続けます。</p>`,
        },
        {
          heading: "解くための考え方",
          html: `<ol>
<li>対象サービスを見る。<strong>EFSが含まれるためAmazon DLMの選択肢はすべて脱落</strong>する。</li>
<li>残ったAWS Backupの2案を、割り当て方法で比較する。リソースIDベースは「毎日プランを編集する」と自ら書いており、最小限の労力に反する。</li>
<li>タグベース + SCPによるタグ強制が、将来のリソースまで自動でカバーする唯一の案として残る。</li>
</ol>
<p>保持期間30日は、いずれの案もバックアッププランのライフサイクル設定で満たせるため、判断の分かれ目にはなりません。</p>`,
        },
      ],
      references: [
        {
          label: "AWS Backup とは",
          url: "https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/whatisbackup.html",
        },
        {
          label: "サービスコントロールポリシー(SCP)",
          url: "https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html",
        },
      ],
    },
    {
      id: "qa-cloudops-003",
      domain: 5,
      topic: "VPCエンドポイント",
      question:
        "ある企業ではパブリックサブネットとプライベートサブネットを持つVPCを利用しています。プライベートサブネットのAmazon EC2インスタンス上のアプリケーションが、Amazon S3バケットに保存された.csvファイルを処理する必要があります。CloudOps管理者はS3バケットにアクセスするための必要なIAMロールを設定しましたが、通信ができません。最小限の権限でこの問題を解決するアクションはどれですか。",
      choices: [
        {
          text: "プライベートサブネットにNATゲートウェイを作成し、プライベートサブネットのルートテーブルを構成する",
          correct: false,
          comment:
            "NATゲートウェイはプライベートサブネットのリソースがインターネットへ出るためのサービスで、そもそもパブリックサブネットに配置する必要があります。S3へのアクセスにインターネット経由の経路を使うことは最小権限の原則に反し、時間料金とデータ処理料金も発生します。",
        },
        {
          text: "S3ゲートウェイエンドポイントをVPCにアタッチし、プライベートサブネットのルートテーブルを構成する",
          correct: true,
          comment:
            "S3ゲートウェイエンドポイントは、プライベートサブネットからS3への通信をAWSのプライベートネットワーク内で完結させます。VPCにエンドポイントを作成し、対象のルートテーブルを指定するだけで設定が完了し、エンドポイント自体の利用料金もかかりません。",
        },
        {
          text: "プライベートサブネットのインスタンスがインターネットゲートウェイを介してアクセスできるようにルートテーブルを構成する",
          correct: false,
          comment:
            "プライベートサブネットにインターネットゲートウェイへのルートを追加すると、そのサブネットはパブリックサブネットになります。ネットワーク設計の根本的な変更であり、外部からの直接アクセスを防ぐというプライベートサブネットの目的にも反します。",
        },
        {
          text: "S3バケットに、IAMロールからのアクセスを許可するバケットポリシーを追加する",
          correct: false,
          comment:
            "問題文に「IAMロールを設定したが通信ができない」と明記されているため、これは権限の問題ではなくネットワーク経路の問題です。バケットポリシーを足しても、プライベートサブネットからS3へ到達する経路は生まれません。",
        },
      ],
      answer:
        "S3ゲートウェイエンドポイントを作成し、プライベートサブネットのルートテーブルにルートを追加します。",
      keyPoint:
        "IAMロールが設定済み = 認証・認可は済んでいる。残る原因は経路であり、S3/DynamoDB宛てで追加コストなしの経路といえばゲートウェイエンドポイントです。",
      topicId: "vpc-endpoint-types",
      detail: [
        {
          heading: "切り分け: 権限の問題か、経路の問題か",
          html: `<p>プライベートサブネットからS3にアクセスするには、次の4つがすべて揃っている必要があります。</p>
<ol>
<li><strong>ネットワーク経路</strong>: S3へ到達するルート(VPCエンドポイントまたはNATゲートウェイ)</li>
<li><strong>DNS解決</strong>: S3エンドポイント名の名前解決</li>
<li><strong>認証</strong>: IAMロールによる認証</li>
<li><strong>認可</strong>: S3バケットとオブジェクトへのアクセス権限</li>
</ol>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>問題文は「IAMロールを設定したが通信ができない」と書いています。3と4は済んでいるという宣言なので、疑うべきは1の経路です。この読み替えができれば、バケットポリシーの選択肢は即座に落とせます。</p></div>`,
        },
        {
          heading: "ゲートウェイエンドポイントの仕組み",
          html: `<p>ゲートウェイエンドポイントは、<strong>ルートテーブルにエントリを追加する方式</strong>のVPCエンドポイントです。対象サービスのプレフィックスリスト(そのサービスのIPアドレス範囲の集合)宛のトラフィックを、エンドポイントへルーティングします。</p>
<ul>
<li>対応サービスは<strong>Amazon S3 と Amazon DynamoDB の2つだけ</strong></li>
<li><strong>追加料金なし</strong>(時間料金・データ処理料金ともに無料)</li>
<li>ENIやIPアドレスを消費しない。ルートテーブル単位で有効化する</li>
<li>アクセスできるのは同じVPC内のリソースからのみ(オンプレミスやピアリング先からは利用不可)</li>
<li>エンドポイントポリシーで、経由できるバケットやアクションを絞り込める</li>
</ul>`,
        },
        {
          heading: "NATゲートウェイ経由との比較",
          html: `<div class="table-wrap"><table>
<thead><tr><th>観点</th><th>S3ゲートウェイエンドポイント</th><th>NATゲートウェイ経由</th></tr></thead>
<tbody>
<tr><td>通信経路</td><td>プライベートサブネット → AWSネットワーク内 → S3</td><td>プライベートサブネット → NATゲートウェイ → インターネット → S3</td></tr>
<tr><td>料金</td><td>エンドポイント利用料は無料</td><td>時間料金 + データ処理料金</td></tr>
<tr><td>セキュリティ</td><td>インターネットを経由しない</td><td>インターネットを経由する</td></tr>
<tr><td>配置</td><td>VPCに作成し、ルートテーブルで有効化</td><td>パブリックサブネットに配置し、EIPが必要</td></tr>
</tbody>
</table></div>
<p>要件に「インターネットに出さない」「コストを抑える」「最小限の権限」のいずれかが含まれていれば、NATゲートウェイは不正解になります。</p>`,
        },
      ],
      references: [
        {
          label: "ゲートウェイ VPC エンドポイント",
          url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/privatelink/gateway-endpoints.html",
        },
      ],
    },
    {
      id: "qa-cloudops-004",
      domain: 2,
      topic: "AWS Storage Gateway",
      question:
        "ある企業ではオンプレミス環境でアプリケーションを運用しており、AWSを使ってデータをバックアップしたいと考えています。このデータはローカル環境で即座に利用できる必要があります。また、使用しているバックアップアプリケーションはPOSIX互換で、ブロックストレージにしかデータを書き込むことができません。この条件を満たすバックアップソリューションはどれですか。",
      choices: [
        {
          text: "AWS Storage Gatewayを利用して「保管型ボリューム」を設定する",
          correct: true,
          comment:
            "保管型ボリューム(Stored Volumes)は、データの完全なコピーをオンプレミスに保持したまま、Amazon S3へ非同期にスナップショットをバックアップします。iSCSIでブロックストレージとして提供されるため、POSIX互換のバックアップアプリケーションからそのまま利用できます。",
        },
        {
          text: "AWS Storage Gatewayを利用して「キャッシュ型ボリューム」を設定する",
          correct: false,
          comment:
            "キャッシュ型ボリューム(Cached Volumes)ではプライマリデータがAmazon S3側に置かれ、ローカルには頻繁にアクセスされるデータだけがキャッシュとして残ります。すべてのデータがローカルで即座に利用できるわけではないため、要件を満たしません。",
        },
        {
          text: "AWS DataSyncを使用して、オンプレミスデータをAmazon S3に同期する",
          correct: false,
          comment:
            "AWS DataSyncはNFSやSMB経由のファイル/オブジェクト単位の転送サービスで、ブロックストレージのインターフェイスを提供しません。ブロックレベルのアクセスを必要とするバックアップアプリケーションの要件を満たせません。",
        },
        {
          text: "Amazon S3をバックアップ先として設定し、バックアップソフトウェアを使用する",
          correct: false,
          comment:
            "Amazon S3はREST APIでアクセスするオブジェクトストレージであり、ブロックストレージではありません。ブロックストレージにしか書き込めないアプリケーションからは直接利用できず、ローカルでの即時利用という要件も満たしません。",
        },
      ],
      answer:
        "AWS Storage Gatewayのボリュームゲートウェイを、保管型ボリューム(Stored Volumes)で構成します。",
      keyPoint:
        "「全データをローカルで即座に」= 保管型、「一部だけローカルキャッシュ」= キャッシュ型。ブロック(iSCSI)必須の時点でS3とDataSyncは脱落します。",
      detail: [
        {
          heading: "要件を技術要素に翻訳する",
          html: `<div class="table-wrap"><table>
<thead><tr><th>問題文の表現</th><th>技術要件</th></tr></thead>
<tbody>
<tr><td>AWSにデータをバックアップしたい</td><td>ハイブリッド構成(オンプレミス + クラウド)</td></tr>
<tr><td>ローカル環境で即座に利用できる必要がある</td><td>プライマリデータがオンプレミスにある(全量)</td></tr>
<tr><td>POSIX互換でブロックストレージにしか書き込めない</td><td>iSCSIなどのブロックデバイスとして見える必要がある</td></tr>
</tbody>
</table></div>
<p>3つ目の条件がオブジェクトストレージ系の選択肢(Amazon S3、AWS DataSync)を、2つ目の条件がキャッシュ型ボリュームを落とします。</p>`,
        },
        {
          heading: "保管型ボリュームとキャッシュ型ボリューム",
          html: `<p>AWS Storage Gatewayのボリュームゲートウェイは、iSCSIブロックデバイスをオンプレミスに提供します。2つのモードはデータの置き場所が正反対です。</p>
<div class="table-wrap"><table>
<thead><tr><th>観点</th><th>保管型(Stored)</th><th>キャッシュ型(Cached)</th></tr></thead>
<tbody>
<tr><td>プライマリデータ</td><td>オンプレミスのローカルストレージ</td><td>Amazon S3</td></tr>
<tr><td>ローカルに置くもの</td><td>全データ</td><td>頻繁にアクセスされるデータのキャッシュ</td></tr>
<tr><td>AWS側の役割</td><td>非同期のスナップショットバックアップ</td><td>データの本体を保持</td></tr>
<tr><td>レイテンシー</td><td>常にローカル並み</td><td>キャッシュミス時はS3からの取得が発生</td></tr>
<tr><td>向いている場面</td><td>低レイテンシーと全データのローカルアクセスが必要</td><td>ローカルのストレージ容量を節約したい</td></tr>
</tbody>
</table></div>
<div class="callout callout-important"><span class="callout-title">重要</span><p>問題文に「ローカルで<strong>即座に</strong>利用できる」「オンプレミスに<strong>完全なコピー</strong>を保持する」とあれば保管型、「ローカルの容量を抑えたい」「使うデータは一部だけ」とあればキャッシュ型です。</p></div>`,
        },
        {
          heading: "ブロックストレージとオブジェクトストレージ",
          html: `<p>POSIX互換のアプリケーションは、ファイルシステムを通じてブロックデバイスへ書き込みます。オブジェクトストレージはHTTPベースのAPIでオブジェクト単位に読み書きするため、同じようには扱えません。</p>
<ul>
<li><strong>ブロックストレージ</strong>: 固定サイズのブロック単位。iSCSIやNVMeなどのプロトコル。データベース、ファイルシステム、仮想マシンのディスク向け</li>
<li><strong>オブジェクトストレージ</strong>: 可変サイズのオブジェクト単位。REST API。Webコンテンツ、アーカイブ、データレイク向け</li>
</ul>
<p>AWS Storage Gatewayの保管型ボリュームは、アプリケーションからは<strong>iSCSIのブロックデバイス</strong>に見えながら、裏側でAmazon S3にスナップショットを保存します。この二面性が、今回の要件を同時に満たす鍵です。</p>`,
        },
        {
          heading: "バックアップの流れ",
          html: `<ol>
<li>バックアップアプリケーションが、iSCSIボリュームにデータを書き込む(ローカルディスクへの書き込み)</li>
<li>Storage Gatewayが差分データを非同期でAmazon S3へアップロードする</li>
<li>定期的にポイントインタイムスナップショットが作成される(Amazon EBSスナップショットとして保存)</li>
<li>災害時は、スナップショットからEBSボリュームを復元してAmazon EC2にアタッチする、またはオンプレミスへ復旧する</li>
</ol>
<p>なお、S3 Glacier系ストレージクラスは長期アーカイブには有効ですが、オブジェクトストレージであり、ローカルでの即時利用というこの問題の要件には応えられません。</p>`,
        },
      ],
      references: [
        {
          label: "ボリュームゲートウェイの仕組み",
          url: "https://docs.aws.amazon.com/ja_jp/storagegateway/latest/vgw/StorageGatewayConcepts.html",
        },
      ],
    },
    {
      id: "qa-cloudops-005",
      domain: 5,
      topic: "VPCピアリング",
      question:
        "CloudOps管理者は、企業のAWSアカウント内にVPC1とVPC2の2つのVPCを作成しました。VPC1にはLinuxのAmazon EC2インスタンスをデプロイし、VPC2にはAmazon RDS for MySQLをプライベートサブネットにデプロイしています。EC2インスタンスで動作するアプリケーションはデータベースに接続する必要があります。最適な方法はどれですか。",
      choices: [
        {
          text: "DBインスタンスのパブリックIPアドレスを使用して接続する",
          correct: false,
          comment:
            "RDSインスタンスはプライベートサブネットにデプロイされているため、パブリックIPアドレスは割り当てられていません。セキュリティの観点からも、データベースをインターネットからアクセス可能にするのは避けるべきです。",
        },
        {
          text: "両方のVPCに同じIPv4 CIDR範囲を割り当てる",
          correct: false,
          comment:
            "VPCは論理的に分離されたネットワークであり、同じCIDR範囲にしても通信できるようにはなりません。むしろCIDRが重複しているとVPCピアリング接続を作成できなくなり、将来の接続手段を自ら塞ぐことになります。",
        },
        {
          text: "DBインスタンスの接続文字列をVPC1のルートテーブルに追加する",
          correct: false,
          comment:
            "ルートテーブルに設定できるのは宛先CIDRとターゲット(ゲートウェイやネットワークインターフェイスなど)の組み合わせだけで、接続文字列のようなアプリケーション層の情報は保持できません。接続情報はアプリケーションの設定やAWS Systems Manager Parameter Store、AWS Secrets Managerで管理します。",
        },
        {
          text: "2つのVPCの間にVPCピアリングを構成する",
          correct: true,
          comment:
            "VPCピアリングは、異なるVPC間でプライベートIPアドレスによる通信を可能にします。VPC1のEC2インスタンスからVPC2のプライベートサブネットにあるRDSインスタンスへ、AWSのネットワーク内でセキュアかつ低レイテンシーに接続できます。",
        },
      ],
      answer: "2つのVPC間にVPCピアリング接続を構成します。",
      keyPoint:
        "VPCはデフォルトで相互に通信できません。2つのVPCを1対1でつなぐだけならVPCピアリングが最もシンプルで低コストです(CIDRの重複は不可)。",
      topicId: "transit-gateway-routing",
      detail: [
        {
          heading: "前提: VPCはデフォルトで分離されている",
          html: `<p>VPCはAWSクラウド内に論理的に分離されたネットワーク空間を作る機能です。<strong>別々のVPCに置かれたリソースは、既定では互いに通信できません</strong>。同じアカウント内であっても、同じリージョンであっても同じです。</p>
<p>したがって、VPC間で通信させたい場合は明示的な接続手段を追加する必要があります。主な選択肢は次のとおりです。</p>
<div class="table-wrap"><table>
<thead><tr><th>手段</th><th>向いている場面</th><th>注意点</th></tr></thead>
<tbody>
<tr><td>VPCピアリング</td><td>2つのVPCを1対1で接続する</td><td>CIDR重複不可。推移的なルーティングは不可</td></tr>
<tr><td>AWS Transit Gateway</td><td>多数のVPCやオンプレミスをハブ&amp;スポークで束ねる</td><td>アタッチメント料金とデータ処理料金が発生する</td></tr>
<tr><td>AWS PrivateLink</td><td>特定のサービスだけを公開する</td><td>サービス側にNLBなどの構成が必要</td></tr>
</tbody>
</table></div>
<p>今回は「2つのVPCの間」の単純な接続なので、コスト効率と手数の少なさからVPCピアリングが最適です。</p>`,
        },
        {
          heading: "VPCピアリング構成後にやること",
          html: `<p>ピアリング接続を作成しただけでは通信は成立しません。次の2つがセットで必要です。</p>
<ol>
<li><strong>両方のVPCのルートテーブル</strong>に、相手VPCのCIDR宛てでターゲットをピアリング接続(pcx-)とするルートを追加する</li>
<li><strong>セキュリティグループ</strong>で通信を許可する。RDS側のセキュリティグループのインバウンドで、MySQLのポート3306に対してEC2側のセキュリティグループを送信元として許可するのが定石</li>
</ol>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>VPCピアリングは<strong>推移的(トランジティブ)ではありません</strong>。VPC1-VPC2、VPC2-VPC3とピアリングしても、VPC1からVPC3へは通信できません。VPCが増えて総当たりの接続が必要になったら、AWS Transit Gatewayへの切り替えを検討します。</p></div>`,
        },
        {
          heading: "解くための考え方",
          html: `<ol>
<li>RDSは<strong>プライベートサブネット</strong>にある、と明記されている。したがってパブリックIPでの接続は成立しない。</li>
<li>CIDRを揃えることは接続手段ではない。むしろピアリングの前提条件(CIDRが重複していないこと)を壊す。</li>
<li>ルートテーブルは経路情報を持つものであり、接続文字列のようなアプリケーション層の情報は扱えない。</li>
<li>残るVPCピアリングが、プライベートIPでのVPC間通信を実現する唯一の選択肢になる。</li>
</ol>`,
        },
      ],
      references: [
        {
          label: "VPC ピア接続とは",
          url: "https://docs.aws.amazon.com/ja_jp/vpc/latest/peering/what-is-vpc-peering.html",
        },
      ],
    },
  ],
};
