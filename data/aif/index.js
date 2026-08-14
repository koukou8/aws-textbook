// AI Practitioner対策教材(AIF-C01)のデータ結合モジュール
// 分野1〜5の章コンテンツと章末確認問題を結合する。

import { chapters as d1Chapters } from "./content-d1.js";
import { chapters as d2Chapters } from "./content-d2.js";
import { chapters as d3Chapters } from "./content-d3.js";
import { chapters as d4Chapters } from "./content-d4.js";
import { chapters as d5Chapters } from "./content-d5.js";
import { questions as d1Questions } from "./questions-d1.js";
import { questions as d2Questions } from "./questions-d2.js";
import { questions as d3Questions } from "./questions-d3.js";
import { questions as d4Questions } from "./questions-d4.js";
import { questions as d5Questions } from "./questions-d5.js";

// AIF-C01 公式試験ガイドの分野名(日本語公式名称)
export const domainLabels = {
  1: "AIとMLの基礎",
  2: "生成AIの基礎",
  3: "基盤モデルの応用",
  4: "責任あるAIに関するガイドライン",
  5: "AIソリューションのセキュリティ、コンプライアンス、ガバナンス",
};

export const chapters = [
  ...d1Chapters,
  ...d2Chapters,
  ...d3Chapters,
  ...d4Chapters,
  ...d5Chapters,
];

export const questions = [
  ...d1Questions,
  ...d2Questions,
  ...d3Questions,
  ...d4Questions,
  ...d5Questions,
];
