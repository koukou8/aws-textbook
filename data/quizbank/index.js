// CloudOps問題集(SOA-C03)のデータ結合モジュール
// 分野1〜5(各2ファイル)の問題を結合する。

import { questions as d1a } from "./d1-a.js";
import { questions as d1b } from "./d1-b.js";
import { questions as d2a } from "./d2-a.js";
import { questions as d2b } from "./d2-b.js";
import { questions as d3a } from "./d3-a.js";
import { questions as d3b } from "./d3-b.js";
import { questions as d4a } from "./d4-a.js";
import { questions as d4b } from "./d4-b.js";
import { questions as d5a } from "./d5-a.js";
import { questions as d5b } from "./d5-b.js";

// SOA-C03 の出題分野(公式日本語名称)と本試験の出題比率
export const DOMAINS = {
  1: {
    label: "モニタリング、ログ記録、分析、修復、パフォーマンスの最適化",
    share: 0.22,
  },
  2: { label: "信頼性と事業の継続性", share: 0.22 },
  3: { label: "デプロイ、プロビジョニング、オートメーション", share: 0.22 },
  4: { label: "セキュリティとコンプライアンス", share: 0.16 },
  5: { label: "ネットワークとコンテンツ配信", share: 0.18 },
};

export const questions = [
  ...d1a,
  ...d1b,
  ...d2a,
  ...d2b,
  ...d3a,
  ...d3b,
  ...d4a,
  ...d4b,
  ...d5a,
  ...d5b,
];
