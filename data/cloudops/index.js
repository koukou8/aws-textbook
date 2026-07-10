// CloudOps対策教材(SOA-C03)のデータ結合モジュール
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

// SOA-C03 公式試験ガイドの分野名(日本語公式名称)
export const domainLabels = {
  1: "モニタリング、ログ記録、分析、修復、パフォーマンスの最適化",
  2: "信頼性と事業の継続性",
  3: "デプロイ、プロビジョニング、オートメーション",
  4: "セキュリティとコンプライアンス",
  5: "ネットワークとコンテンツ配信",
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
