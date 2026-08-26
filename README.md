# AWS Study Console — AWS資格対策 学習Webアプリ

AWS認定資格 **SAA-C03 (Solutions Architect – Associate)** / **SOA-C03 (CloudOps Engineer – Associate)** / **AIF-C01 (AI Practitioner)** の学習用Webアプリです。教材(AWS基礎 / SAA / CloudOps / AI Practitioner)と、SOA-C03・AIF-C01向けの演習問題集を収録しています。

- フレームワーク不使用(HTML + Tailwind CSS + Vanilla JavaScript / ES Modules)
- バックエンドなし。進捗はすべてブラウザの localStorage に保存
- 初回ロード後はオフラインでも動作(外部APIへの依存なし)
- Vercel に静的サイトとしてそのままデプロイ可能

> ※本アプリは個人学習用の非公式教材です。掲載内容は作成時点の情報に基づきます。

## 収録コンテンツ

| コンテンツ | 章 | 問題数 |
|---|---|---|
| AWS基礎 | 12章 | 章末確認問題 71問 |
| SAA対策教材(SAA-C03) | 4分野 11章 | 章末確認問題 110問 |
| CloudOps対策教材(SOA-C03) | 5分野 13章 | 章末確認問題 123問 |
| AI Practitioner対策教材(AIF-C01) | 5分野 14章 | 章末確認問題 140問 |
| CloudOps問題集(SOA-C03) | — | 演習 200問(分野比率 44/44/44/32/36) |
| AI Practitioner問題集(AIF-C01) | — | 演習 200問(分野比率 40/48/56/28/28) |
| **合計** | **50章** | **844問** |

すべての問題に解説(誤答の理由を含む)とAWS公式ドキュメントの参照リンクを付けています。試験分野の比率は各試験の公式試験ガイド(2026年7〜8月時点、`docs/research/` に調査結果を収録)に準拠しています。

## セットアップ

```bash
npm install
npm run build   # Tailwind CSS をビルド(css/styles.css を生成)
npm run serve   # http://localhost:4173 で起動(python3 の簡易サーバー)
```

ES Modules を使用しているため、`file://` で直接開くことはできません。必ずHTTPサーバー経由で開いてください(`npx serve .` などでも可)。

- CSSは **Tailwind CSS v4 の CLIビルド(`@tailwindcss/cli`)** を採用しています(Play CDNは不使用)。ビルド済みの `css/styles.css` もリポジトリにコミットしているため、コンテンツの追加だけならビルドなしでも動作します。スタイルやクラスを変更した場合は `npm run build` を再実行してください。
- 開発中は `npm run watch` でファイル変更を監視できます。

## デプロイ(Vercel)

静的サイトのため、ビルド設定なしでそのままデプロイできます(`vercel.json` は `cleanUrls` のみ設定)。

### 方法1: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel          # プレビューデプロイ(質問にはすべてデフォルトでOK / Framework: Other)
vercel --prod   # 本番デプロイ
```

### 方法2: GitHub連携

1. このリポジトリをGitHubへプッシュ
2. [vercel.com](https://vercel.com) → 「Add New… → Project」→ リポジトリをインポート
3. Framework Preset は **Other**、Build Command / Output Directory は**空のまま**(ビルド済みCSSをコミットしているため)で「Deploy」
4. 以後、`main` ブランチへのプッシュで自動デプロイ

## ディレクトリ構成

```
aws-textbook/
├── index.html            # ダッシュボード
├── basics.html           # AWS基礎教材
├── saa.html              # SAA対策教材
├── cloudops.html         # CloudOps対策教材
├── aif.html              # AI Practitioner対策教材
├── quiz.html             # CloudOps問題集
├── aif-quiz.html         # AI Practitioner問題集
├── css/
│   ├── input.css         # Tailwind 入力(デザイントークン定義)
│   └── styles.css        # ビルド出力(コミット済み)
├── js/
│   ├── config.js         # 定数(PASS_THRESHOLD、教材メタ情報)
│   ├── storage.js        # localStorage ラッパー(保存・移行・入出力)
│   ├── progress.js       # 進捗計算
│   ├── quiz-engine.js    # 出題・採点・解説・結果(全ページ共通)
│   ├── material.js       # 教材ページ共通ロジック
│   ├── quizbank.js       # 問題集ページ(モード選択・セッション)
│   ├── dashboard.js      # ダッシュボード
│   ├── qa.js             # 一問一答セクション(ダッシュボード)
│   └── ui.js             # 共通UIヘルパー
├── data/
│   ├── basics/           # AWS基礎(content-*.js / questions-*.js / index.js)
│   ├── saa/              # SAA教材(分野別 content-d*.js / questions-d*.js)
│   ├── cloudops/         # CloudOps教材(分野別)
│   ├── aif/              # AI Practitioner教材(分野別)
│   ├── quizbank/         # CloudOps問題集(分野別 d*-a.js / d*-b.js)
│   ├── aifbank/          # AI Practitioner問題集(分野別 d*-a.js / d*-b.js)
│   └── qa/               # 一問一答(ダッシュボードのセクション)
├── docs/research/        # 試験ガイド・出題傾向の調査結果
├── scripts/validate.js   # データ検証スクリプト
├── package.json
└── vercel.json
```

## データ検証

```bash
npm run validate                            # 全データの検証+統計
node scripts/validate.js data/quizbank/d1-a.js   # 単一ファイルの検証
```

ID重複・必須フィールド欠落・answerIndexes範囲外・章と確認問題の参照切れなどを検出します。

## 問題・章の追加方法

### 問題を追加する

`data/quizbank/d1-a.js` などの担当ファイルに、以下のスキーマで追記します。

```js
{
  id: "qb-d1-001",          // 一意ID(プレフィックスで教材/分野を識別)
  domain: 1,                 // 分野番号(basicsは null)
  topic: "CloudWatch",       // 主要トピック
  type: "single",            // "single" | "multiple"
  difficulty: "medium",      // "easy" | "medium" | "hard"
  question: "ある企業では...",
  choices: ["...", "...", "...", "..."],   // 4〜6個
  answerIndexes: [2],        // 正解のインデックス配列(multiple は2個以上)
  explanation: "正解はCです。... Aは...のため不適切です。",  // 誤答の理由も必須
  reference: "https://docs.aws.amazon.com/..."
}
```

### 章を追加する

`data/saa/content-d1.js` などに章オブジェクトを追加し、対応する確認問題を `questions-d1.js` に追加します。

```js
{
  id: "saa-d1-ch01",
  domain: 1,
  title: "IAMとアクセス管理の設計",
  sections: [
    { heading: "見出し", html: `<p>本文(HTML)</p>` },
  ],
  checkQuestionIds: ["saa-d1-ch01-q01", /* ... */],
}
```

追加後は `npm run validate` で検証してください。新しいファイルを作った場合は、各ディレクトリの `index.js` に import を追加します。

## 進捗データ

- 保存先: localStorage キー `aws-textbook:v1`(スキーマに `version` フィールドを持ち、将来の変更時はマイグレーションされます)
- 章末確認問題で正答率80%以上(`js/config.js` の `PASS_THRESHOLD` で変更可)を取ると章完了になります
- ダッシュボードの「学習データの管理」から、教材ごと/全体のリセット、JSONのエクスポート/インポート(端末移行用)ができます
