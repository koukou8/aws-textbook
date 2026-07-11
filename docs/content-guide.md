# コンテンツ執筆ガイド(フェーズ2 生成エージェント向け)

このドキュメントは、教材・問題データを生成するすべてのエージェントが従う共通仕様です。**担当として指示されたファイル以外には一切書き込まないでください。**

## 1. 問題スキーマ(全問題共通)

```js
// ファイル全体の形(プレースホルダを丸ごと上書きする)
// 1行目コメント → export const questions = [ ... ];
export const questions = [
  {
    id: "qb-d1-001",          // 一意ID。指示された規則・連番範囲に従う
    domain: 1,                 // 分野番号(AWS基礎のみ null)
    topic: "CloudWatch",       // 主要トピック(サービス名や概念。フィルタ・分析用)
    type: "single",            // "single"(4択・正解1) | "multiple"(5択・正解2)
    difficulty: "medium",      // "easy" | "medium" | "hard"
    question: "ある企業では...最も適切な方法はどれですか。",
    choices: ["...", "...", "...", "..."],   // singleは4個 / multipleは5個
    answerIndexes: [2],        // 正解のインデックス配列(0始まり)。multipleは2個
    explanation: "正解はCです。...。Aは...のため不適切です。Bは...。Dは...。",
    reference: "https://docs.aws.amazon.com/..."   // AWS公式ドキュメントのURL
  },
];
```

### 問題のルール

- **type**: `single` は選択肢4個・正解1個。`multiple` は選択肢5個・正解ちょうど2個とし、問題文の末尾に「(2つ選択してください)」と書く。
- **answerIndexes**: 0始まり。choices の範囲内。正解の位置は偏らせず、A〜D(E)に分散させる。
- **explanation**: 「なぜ正解か」に加えて、**すべての誤答について「なぜ不適切か」を必ず書く**。全体で150〜300字程度。「正解はBです。〜」のように正解の記号から書き始める。
- **reference**: `https://docs.aws.amazon.com/`(日本語版 `ja_jp` 可)または `https://aws.amazon.com/jp/` のURL。**URLをでっち上げない。** 正確なページパスに自信がない場合は、そのサービスの確実に存在するトップレベルのユーザーガイドURL(例: `https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/`配下の主要ページ)か、`https://aws.amazon.com/jp/<service>/faqs/` を使う。
- **difficulty の目安配分**: easy 20〜30% / medium 50〜60% / hard 15〜25%。

### 品質基準(最重要)

1. **シナリオベース問題を6割以上**にする。「ある企業が〜」「CloudOpsエンジニアが〜」の形式で、要件(最小コスト・最小の運用負荷・最高可用性・RTO/RPO値など)を明示し、その要件が決め手になる問題にする。単純な用語暗記問題は3割以下。
2. 誤答選択肢は**実在するサービス・機能**でもっともらしく構成する。明らかなダミー、「上記すべて」「該当なし」のような選択肢は禁止。
3. **存在しないサービス名・機能名・制限値を書かない。** 不確かなクォータ数値・料金数値は問題の題材にしない。仕様に少しでも自信がない内容は出題せず、確実に知っている定番パターンで問題を作る。
4. 定番の対比ペア(Multi-AZ vs リードレプリカ、SQS vs SNS、CloudFront vs Global Accelerator、ゲートウェイ型 vs インターフェイス型エンドポイント、Secrets Manager vs Parameter Store など)を積極的に出題する。
5. 同じ論点の問題を重複させない(シナリオ・角度を変える)。
6. 選択肢の文字数はなるべく揃え、正解だけ極端に長い/短いといったメタ推測を許さない。

## 2. 教材(章)スキーマ

```js
export const chapters = [
  {
    id: "saa-d1-ch01",        // 指示されたID
    domain: 1,                 // 分野番号(AWS基礎は null)
    title: "IAMとアクセス管理の設計",
    sections: [
      { heading: "セクション見出し", html: `<p>本文...</p>` },
      // 1章あたり3〜5セクション
    ],
    checkQuestionIds: ["saa-d1-ch01-q01", "saa-d1-ch01-q02", /* ... */],
  },
];
```

### 章のルール

- 1章 = sections 3〜5個。1セクション = 300〜700字程度の本文(表・リスト含む)。読みやすさ優先で、段落・箇条書き・表を組み合わせる。
- 章の内容は**試験で問われる判断基準**(どんな要件のときに何を選ぶか)を中心に書く。単なる機能羅列にしない。
- 章末の `checkQuestionIds` は、対応する questions ファイルに書いた自分の問題のIDをすべて列挙する(記載順に出題される)。

### sections[].html で使える要素

以下のみ使用可(スタイルは自動適用されるので class 追加は不要):

- `<p>` `<strong>` `<em>` `<code>`(インラインコード)
- `<ul><li>` `<ol><li>`(入れ子可)
- `<h4>`(セクション内の小見出し)
- `<pre><code>...</code></pre>`(コードブロック。CLIコマンドやポリシーJSONなど)
- 表(**必ず `<div class="table-wrap">` で包む**): `<div class="table-wrap"><table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table></div>`
- 注意ボックス(callout。3種):

```html
<div class="callout callout-note"><span class="callout-title">ポイント</span><p>...</p></div>
<div class="callout callout-warning"><span class="callout-title">試験での注意</span><p>...</p></div>
<div class="callout callout-important"><span class="callout-title">重要</span><p>...</p></div>
```

- `<a href="https://docs.aws.amazon.com/..." target="_blank" rel="noopener noreferrer">` (公式ドキュメントへのリンクのみ)
- `<script>` `<style>` `<img>` は禁止。

### JavaScript構文上の注意(重要)

- `html` の値は **テンプレートリテラル(バッククォート)** で書く。そのため本文中にバッククォート(`` ` ``)を書かない。`${` を書く必要がある場合(CloudFormationの `!Sub` 例など)は必ず `\${` とエスケープする。
- `question` / `choices` / `explanation` は通常のダブルクォート文字列で書く(内部の改行は `\n`)。これらは**プレーンテキスト**であり、HTMLタグを含めない。
- ファイルはES Module。`export const questions = [...]`(または `chapters`)以外のトップレベル宣言を書かない。

## 3. 文体・表記

- すべて日本語、「です・ます」調。
- サービス名はAWS公式日本語ドキュメントの表記に従う: 初出は正式名(例: Amazon EC2、Amazon S3、AWS Lambda、Amazon CloudWatch、AWS CloudFormation、Elastic Load Balancing(ELB)、Amazon VPC)。以降は一般的な短縮名(EC2、S3など)可。
- 「Amazon」「AWS」プレフィックスの使い分けを間違えない(例: ○ AWS Lambda / × Amazon Lambda、○ Amazon SQS / × AWS SQS)。
- 2025年以降の名称に従う: 旧称を使わない(例: ○ Amazon Data Firehose / × Kinesis Data Firehose、○ IAM Identity Center / × AWS SSO、○ AWS Certified CloudOps Engineer – Associate / × SysOps Administrator)。

## 4. 作業手順(全エージェント共通)

1. このガイドと、指示された調査資料(docs/research/)を読む。
2. 見本として `data/quizbank/d1-a.js` と `data/basics/content-1.js` を読む(スキーマと文体の実例)。
3. 担当ファイルを Read してから、完成データで Write(上書き)する。
4. セルフチェックを実行する:
   ```bash
   cd /Users/koukiyoshida/development/aws-textbook && node scripts/validate.js data/<担当ファイル>.js
   ```
   エラーが出たら修正して再実行し、**エラー0件**にする(警告は可能な範囲で解消)。
5. 自分の担当分についてID・連番・問題数が指示どおりかを確認する。
6. 最終応答では「作成した章数・問題数・validate結果・使った主なトピック」を5行以内で報告する(コンテンツ本文は貼らない)。
