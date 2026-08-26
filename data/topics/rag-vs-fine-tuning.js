// 特設ページ: RAGとファインチューニングの使い分け
export const topic = {
  id: "rag-vs-fine-tuning",
  title: "RAGとファインチューニングの使い分け: 知識の更新か、振る舞いの適応か",
  description:
    "「最新の社内情報を再学習なしで反映」が決め手のRAGと、モデルの振る舞いを変えるファインチューニングを、仕組み・コスト・典型パターンから整理します。",
  exam: "AIF-C01",
  services: ["Amazon Bedrock", "RAG", "ファインチューニング"],
  createdAt: "2026-08-14",
  source: {
    question:
      "毎週更新される社内ナレッジベースに基づく質問応答チャットボットで、モデルを再トレーニングせずに常に最新情報に基づいて回答させる方法を選ぶ、という趣旨の問題。",
    point:
      "「情報が頻繁に更新される + 再トレーニングしない」ならRAGが決め手。ファインチューニングは重みの更新 = 再トレーニングそのものなので、要件に真っ向から反する。",
  },
  sections: [
    {
      heading: "結論: 「知識」の問題か「振る舞い」の問題か",
      html: `<p>RAGとファインチューニングはどちらも「基盤モデルを自社向けに強化する手法」ですが、解決する課題がまったく異なります。使い分けは次の1行に集約できます。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p><strong>モデルが「知っていること」(知識)を追加・更新したいならRAG。モデルの「答え方」(文体・出力形式・タスクへの特化)を変えたいならファインチューニング。</strong></p></div>
<p>今回の問題の要件は「ナレッジベースが毎週更新される」「モデルを再トレーニングしない」「常に最新の社内情報に基づいて回答する」の3つでした。これはすべて<strong>知識の鮮度</strong>の話であり、モデルの答え方を変える必要はどこにもありません。RAGはモデルの外側にある情報源を推論のたびに検索する仕組みなので、情報源を差し替えるだけで回答が最新化されます。</p>
<p>逆に「自社サポート特有の言い回しで回答させたい」「必ず決まった形式で出力させたい」のような要件なら、知識ではなく振る舞いの問題なので、ファインチューニングが候補になります。問題文の要件が「知識」か「振る舞い」かをまず見極めるのが、この対比を解く最短ルートです。</p>`,
    },
    {
      heading: "RAGの仕組み: なぜ再学習なしで最新情報を反映できるのか",
      html: `<p><strong>検索拡張生成(RAG: Retrieval Augmented Generation)</strong>は、ユーザーの質問をそのままモデルに送るのではなく、<strong>推論時に外部ナレッジソースを検索し、見つかった関連情報をプロンプトに付加してから回答を生成させる</strong>手法です。処理の流れは次のとおりです。</p>
<ol>
<li>社内ドキュメントをあらかじめチャンク(断片)に分割し、埋め込みモデルで<strong>埋め込みベクトル</strong>に変換してベクターデータベースに格納しておく</li>
<li>質問が来たら、質問文も同じ方法でベクトル化し、意味的に近いチャンクを検索する</li>
<li>検索で得た情報を質問と一緒にプロンプトへ組み込み、基盤モデルに回答を生成させる</li>
</ol>
<figure class="diagram">
<svg viewBox="0 0 700 224" role="img" aria-label="事前準備としてドキュメントをチャンク化・ベクトル化してベクターデータベースに保管し、推論時には質問でベクトル検索した結果をプロンプトに付加して基盤モデルに回答させるRAGの流れを示した図">
  <text class="d-accent" x="8" y="22">事前準備(取り込み時に1回)</text>

  <rect class="d-node" x="24" y="30" width="136" height="46" rx="8"/>
  <text class="d-text" x="92" y="53" text-anchor="middle">社内ドキュメント</text>
  <text class="d-sub" x="92" y="68" text-anchor="middle">元データ</text>

  <path class="d-flow" d="M161 53 L173 53"/>
  <path class="d-arrow" d="M180 53 l-7 -4.5 v9 z"/>

  <rect class="d-node" x="180" y="30" width="120" height="46" rx="8"/>
  <text class="d-text" x="240" y="53" text-anchor="middle">チャンク分割</text>
  <text class="d-sub" x="240" y="68" text-anchor="middle">断片に分ける</text>

  <path class="d-flow" d="M301 53 L313 53"/>
  <path class="d-arrow" d="M320 53 l-7 -4.5 v9 z"/>

  <rect class="d-node" x="320" y="30" width="136" height="46" rx="8"/>
  <text class="d-text" x="388" y="53" text-anchor="middle">埋め込みモデル</text>
  <text class="d-sub" x="388" y="68" text-anchor="middle">ベクトルに変換</text>

  <path class="d-flow" d="M457 53 L469 53"/>
  <path class="d-arrow" d="M476 53 l-7 -4.5 v9 z"/>

  <rect class="d-node-info" x="476" y="30" width="176" height="46" rx="8"/>
  <text class="d-text" x="564" y="53" text-anchor="middle">ベクターデータベース</text>
  <text class="d-sub" x="564" y="68" text-anchor="middle">埋め込みベクトルを保管</text>

  <path class="d-flow" d="M564 76 L564 104 L208 104 L208 139"/>
  <path class="d-arrow" d="M208 146 l-4.5 -7 h9 z"/>
  <text class="d-sub" x="386" y="98" text-anchor="middle">関連チャンクを取得</text>

  <text class="d-accent" x="8" y="136">推論時(質問のたび)</text>

  <rect class="d-node" x="8" y="146" width="100" height="46" rx="8"/>
  <text class="d-text" x="58" y="173" text-anchor="middle">ユーザーの質問</text>

  <path class="d-flow" d="M109 173 L121 173"/>
  <path class="d-arrow" d="M128 173 l-7 -4.5 v9 z"/>

  <rect class="d-node-info" x="128" y="146" width="160" height="46" rx="8"/>
  <text class="d-text" x="208" y="166" text-anchor="middle">ベクトル検索</text>
  <text class="d-sub" x="208" y="183" text-anchor="middle">意味の近いチャンクを取得</text>

  <path class="d-flow" d="M289 173 L301 173"/>
  <path class="d-arrow" d="M308 173 l-7 -4.5 v9 z"/>

  <rect class="d-node-info" x="308" y="146" width="140" height="46" rx="8"/>
  <text class="d-text" x="378" y="166" text-anchor="middle">プロンプトに付加</text>
  <text class="d-sub" x="378" y="183" text-anchor="middle">質問 + 検索結果</text>

  <path class="d-flow" d="M449 173 L461 173"/>
  <path class="d-arrow" d="M468 173 l-7 -4.5 v9 z"/>

  <rect class="d-node-accent" x="468" y="146" width="110" height="46" rx="8"/>
  <text class="d-text" x="523" y="166" text-anchor="middle">基盤モデル</text>
  <text class="d-sub" x="523" y="183" text-anchor="middle">重みは変更しない</text>

  <path class="d-flow" d="M579 173 L591 173"/>
  <path class="d-arrow" d="M598 173 l-7 -4.5 v9 z"/>

  <rect class="d-node-ok" x="598" y="146" width="94" height="46" rx="8"/>
  <text class="d-text" x="645" y="166" text-anchor="middle">回答</text>
  <text class="d-sub" x="645" y="183" text-anchor="middle">+ 出典を提示</text>

  <text class="d-accent" x="350" y="212" text-anchor="middle">モデルの重みは一切変更されない — 取り込み直すだけで回答が最新化される</text>
</svg>
<figcaption>更新されるのは上段のベクターデータベースだけで、下段の基盤モデルには手を触れません。これが「再トレーニングなしで最新情報を反映できる」理由です。</figcaption>
</figure>
<p>ポイントは、この間<strong>モデルの重み(パラメータ)は一切変更されない</strong>ことです。モデル自体は汎用のまま、「回答の材料」だけを外から毎回渡します。だからナレッジベースが毎週更新されても、更新後のドキュメントを取り込み直すだけで、次の質問から最新情報に基づく回答になります。再トレーニングは不要です。</p>
<p>AWSでは<strong>Amazon Bedrockのナレッジベース</strong>が、ドキュメントの取り込み・チャンク化・埋め込み生成・ベクター検索という一連のRAGワークフローをフルマネージドで提供します。</p>
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>RAGには「回答の根拠になった文書を出典として提示できる」という副次効果もあります。根拠を示せることは、ハルシネーション(もっともらしい誤情報)への対策としても試験頻出の論点です。</p></div>`,
    },
    {
      heading: "ファインチューニングの仕組みと得意なこと",
      html: `<p>ファインチューニングは、事前トレーニング済みの基盤モデルに対して、<strong>比較的少量のラベル付きデータで追加トレーニングを行い、モデルの重みそのものを更新する</strong>手法です。つまり「再トレーニングしない」という要件が付いた時点で、ファインチューニングは定義上選べません。</p>
<p>ファインチューニングが得意なのは、知識の追加ではなく<strong>振る舞いの適応</strong>です。</p>
<ul>
<li>特定ドメインの用語・言い回しに合わせた応答スタイル</li>
<li>要約の長さやトーン、出力形式の一貫した維持</li>
<li>分類・抽出など特定タスクの精度向上</li>
</ul>
<p>逆に「最新の事実を覚えさせ続ける」用途には不向きです。トレーニングのたびに時間と計算コストがかかるうえ、学習した内容を事実として正確に再現する保証はなく、情報が変わるたびに再学習が必要になります。なお、ラベルなしのドメインデータで重みを更新する手法は<strong>継続的な事前トレーニング</strong>と呼ばれ、ラベル付きデータを使うファインチューニングと区別されます。</p>
<div class="callout callout-important"><span class="callout-title">重要</span><p>モデルをユースケースに適応させる手法はコストの小さい順に「<strong>プロンプトエンジニアリング &lt; RAG &lt; ファインチューニング &lt; ゼロからの事前トレーニング</strong>」。要件を満たせる最も低コストな手法を選ぶのが原則で、AIF-C01ではこの並び自体も問われます。</p></div>`,
    },
    {
      heading: "比較表・典型パターンと、誤答選択肢の理由",
      html: `<div class="table-wrap"><table><thead><tr><th>観点</th><th>RAG</th><th>ファインチューニング</th></tr></thead><tbody>
<tr><td>目的</td><td>外部知識の参照(知っていることを増やす)</td><td>振る舞いの適応(答え方を変える)</td></tr>
<tr><td>モデルの重み</td><td>変更しない</td><td>追加トレーニングで更新する</td></tr>
<tr><td>情報の更新</td><td>ナレッジソースの再取り込みだけで反映</td><td>再トレーニングが必要</td></tr>
<tr><td>必要な準備</td><td>ドキュメントとベクターデータベース</td><td>ラベル付きトレーニングデータ</td></tr>
<tr><td>出典の提示</td><td>可能(検索元を引用できる)</td><td>不可</td></tr>
<tr><td>AWSでの代表機能</td><td>Amazon Bedrockのナレッジベース</td><td>Amazon Bedrockのカスタムモデル</td></tr>
</tbody></table></div>
<p>試験で問われる典型パターンを整理します。</p>
<ol>
<li><strong>頻繁に更新される社内情報・製品情報に基づいて回答させたい</strong> → RAG</li>
<li><strong>自社特有の文体・出力形式・専門用語に特化させたい</strong> → ファインチューニング</li>
<li><strong>汎用知識で足りる・数個の例を見せれば済む</strong> → プロンプトエンジニアリング(フューショットなどの状況に応じた学習)</li>
<li><strong>知識も振る舞いも両方カスタマイズしたい</strong> → RAGとファインチューニングは排他ではないので併用できる</li>
</ol>
<h4>誤答選択肢はなぜ不正解か</h4>
<ul>
<li><strong>毎週モデルをファインチューニングする</strong>: 技術的には可能ですが、毎週トレーニングの時間とコストがかかり続けるうえ、学習内容が事実として正確に再現される保証もありません。そもそも「再トレーニングせずに」という要件に反します</li>
<li><strong>すべての社内ドキュメントをプロンプトに含める</strong>: モデルが一度に処理できるトークン数(<strong>コンテキストウィンドウ</strong>)には上限があり、ナレッジベース全体は収まりません。入力トークン量に応じて推論コストも増大します。RAGは「関連する断片だけを選んで渡す」ことでこの問題を回避する手法です</li>
<li><strong>温度(temperature)を下げる</strong>: 温度は出力のランダム性を制御する推論パラメータで、下げると決定的で堅実な応答になります。しかしモデルが持っていない知識を補うことはできず、最新情報の反映とは無関係です</li>
</ul>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>「社内データ」「最新情報」「再トレーニング不要・低コスト」が並んだらRAG、「トーン」「出力形式」「ドメイン特化の振る舞い」ならファインチューニング、と判断できるようにしておきましょう。温度やTop Kなどの<strong>推論パラメータは「知識」の問題を解決しない</strong>、も定番のひっかけです。</p></div>`,
    },
  ],
  references: [
    {
      label: "RAG(検索拡張生成)とは(AWS公式)",
      url: "https://aws.amazon.com/jp/what-is/retrieval-augmented-generation/",
    },
    {
      label: "Amazon Bedrock ナレッジベース(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/bedrock/latest/userguide/knowledge-base.html",
    },
    {
      label: "Amazon Bedrock モデルのカスタマイズ(公式ドキュメント)",
      url: "https://docs.aws.amazon.com/ja_jp/bedrock/latest/userguide/custom-models.html",
    },
  ],
};
