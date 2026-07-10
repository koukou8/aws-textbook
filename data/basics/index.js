// AWS基礎教材のデータ結合モジュール
// content-1.js / content-2.js(章コンテンツ)と questions-1.js / questions-2.js(章末確認問題)を結合する。

import { chapters as chapters1 } from "./content-1.js";
import { chapters as chapters2 } from "./content-2.js";
import { questions as questions1 } from "./questions-1.js";
import { questions as questions2 } from "./questions-2.js";

// AWS基礎は分野グルーピングなし
export const domainLabels = null;

export const chapters = [...chapters1, ...chapters2];
export const questions = [...questions1, ...questions2];
