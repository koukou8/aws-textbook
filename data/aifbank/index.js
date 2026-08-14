// AI Practitioner問題集(AIF-C01)のデータ結合モジュール
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

// AIF-C01 の出題分野(公式日本語名称)と本試験の出題比率
export const DOMAINS = {
  1: { label: "AIとMLの基礎", share: 0.2 },
  2: { label: "生成AIの基礎", share: 0.24 },
  3: { label: "基盤モデルの応用", share: 0.28 },
  4: { label: "責任あるAIに関するガイドライン", share: 0.14 },
  5: {
    label: "AIソリューションのセキュリティ、コンプライアンス、ガバナンス",
    share: 0.14,
  },
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
