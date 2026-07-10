// データ検証スクリプト
//   全体検証:       node scripts/validate.js
//   単一ファイル検証: node scripts/validate.js data/quizbank/d1-a.js
//
// 問題スキーマ・ID重複・answerIndexes範囲・章と確認問題の参照整合を検査し、
// 統計(問題数・分野配分・multiple比率など)を出力する。エラーがあれば exit 1。

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const errors = [];
const warnings = [];

function err(where, message) {
  errors.push(`[${where}] ${message}`);
}
function warn(where, message) {
  warnings.push(`[${where}] ${message}`);
}

const VALID_TYPES = new Set(["single", "multiple"]);
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

function checkQuestion(q, where, { requireDomain = null } = {}) {
  if (!q || typeof q !== "object") {
    err(where, "問題がオブジェクトではありません");
    return;
  }
  const id = q.id ?? "(idなし)";
  const w = `${where} ${id}`;

  if (typeof q.id !== "string" || q.id.trim() === "") {
    err(w, "id が空です");
  }
  if (requireDomain) {
    if (typeof q.domain !== "number" || !requireDomain.includes(q.domain)) {
      err(w, `domain が不正です(期待: ${requireDomain.join(",")} / 実際: ${q.domain})`);
    }
  }
  if (typeof q.topic !== "string" || q.topic.trim() === "") {
    warn(w, "topic が空です");
  }
  if (!VALID_TYPES.has(q.type)) {
    err(w, `type が不正です: ${q.type}`);
  }
  if (!VALID_DIFFICULTIES.has(q.difficulty)) {
    err(w, `difficulty が不正です: ${q.difficulty}`);
  }
  if (typeof q.question !== "string" || q.question.trim().length < 15) {
    err(w, "question が短すぎるか空です");
  }
  if (!Array.isArray(q.choices) || q.choices.length < 4 || q.choices.length > 6) {
    err(w, `choices は4〜6個必要です(実際: ${Array.isArray(q.choices) ? q.choices.length : "配列でない"})`);
  } else {
    q.choices.forEach((c, i) => {
      if (typeof c !== "string" || c.trim() === "") {
        err(w, `choices[${i}] が空です`);
      }
    });
    const uniqueChoices = new Set(q.choices.map((c) => String(c).trim()));
    if (uniqueChoices.size !== q.choices.length) {
      err(w, "choices に重複があります");
    }
  }
  if (!Array.isArray(q.answerIndexes) || q.answerIndexes.length === 0) {
    err(w, "answerIndexes が空です");
  } else {
    const set = new Set(q.answerIndexes);
    if (set.size !== q.answerIndexes.length) {
      err(w, "answerIndexes に重複があります");
    }
    for (const i of q.answerIndexes) {
      if (
        !Number.isInteger(i) ||
        i < 0 ||
        (Array.isArray(q.choices) && i >= q.choices.length)
      ) {
        err(w, `answerIndexes に範囲外の値があります: ${i}`);
      }
    }
    if (q.type === "single" && q.answerIndexes.length !== 1) {
      err(w, `type=single なのに正解が${q.answerIndexes.length}個あります`);
    }
    if (q.type === "multiple" && q.answerIndexes.length < 2) {
      err(w, "type=multiple なのに正解が2個未満です");
    }
  }
  if (typeof q.explanation !== "string" || q.explanation.trim().length < 60) {
    err(w, `explanation が短すぎます(${q.explanation?.length ?? 0}字。60字以上必須)`);
  } else if (q.explanation.trim().length < 140) {
    warn(w, `explanation が目安(150字)より短めです(${q.explanation.trim().length}字)`);
  }
  if (q.reference != null) {
    if (typeof q.reference !== "string" || !/^https:\/\//.test(q.reference)) {
      err(w, `reference がURL形式ではありません: ${q.reference}`);
    } else if (!/^https:\/\/(docs\.)?aws\.amazon\.com\//.test(q.reference)) {
      warn(w, `reference がAWS公式ドキュメント以外です: ${q.reference}`);
    }
  } else {
    warn(w, "reference がありません");
  }
}

function checkChapter(ch, where, questionIds) {
  if (!ch || typeof ch !== "object") {
    err(where, "章がオブジェクトではありません");
    return;
  }
  const w = `${where} ${ch.id ?? "(idなし)"}`;
  if (typeof ch.id !== "string" || ch.id.trim() === "") {
    err(w, "id が空です");
  }
  if (typeof ch.title !== "string" || ch.title.trim() === "") {
    err(w, "title が空です");
  }
  if (!Array.isArray(ch.sections) || ch.sections.length === 0) {
    err(w, "sections が空です");
  } else {
    ch.sections.forEach((sec, i) => {
      if (typeof sec.heading !== "string" || sec.heading.trim() === "") {
        err(w, `sections[${i}].heading が空です`);
      }
      if (typeof sec.html !== "string" || sec.html.trim().length < 50) {
        err(w, `sections[${i}].html が短すぎるか空です`);
      }
      if (/<script/i.test(sec.html ?? "")) {
        err(w, `sections[${i}].html に <script> タグが含まれています`);
      }
    });
  }
  if (!Array.isArray(ch.checkQuestionIds) || ch.checkQuestionIds.length === 0) {
    err(w, "checkQuestionIds が空です");
  } else if (questionIds) {
    for (const qid of ch.checkQuestionIds) {
      if (!questionIds.has(qid)) {
        err(w, `checkQuestionIds の ${qid} に対応する問題が見つかりません`);
      }
    }
    const set = new Set(ch.checkQuestionIds);
    if (set.size !== ch.checkQuestionIds.length) {
      err(w, "checkQuestionIds に重複があります");
    }
  }
}

function checkGlobalIdUniqueness(entries) {
  const seen = new Map();
  for (const { id, where } of entries) {
    if (!id) continue;
    if (seen.has(id)) {
      err("ID重複", `${id} が ${seen.get(id)} と ${where} の両方に存在します`);
    } else {
      seen.set(id, where);
    }
  }
}

function pct(n, d) {
  return d > 0 ? `${Math.round((n / d) * 100)}%` : "—";
}

function questionStats(questions) {
  const multiple = questions.filter((q) => q.type === "multiple").length;
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const q of questions) {
    if (byDifficulty[q.difficulty] != null) byDifficulty[q.difficulty] += 1;
  }
  const withRef = questions.filter((q) => q.reference).length;
  return { multiple, byDifficulty, withRef };
}

async function importData(relPath) {
  return import(pathToFileURL(path.join(ROOT, relPath)).href);
}

// ---- 単一ファイルモード ----
async function validateSingleFile(relPath) {
  console.log(`単一ファイル検証: ${relPath}\n`);
  const mod = await importData(relPath);
  const requireDomain = relPath.includes("quizbank")
    ? [1, 2, 3, 4, 5]
    : relPath.includes("cloudops")
      ? [1, 2, 3, 4, 5]
      : relPath.includes("saa")
        ? [1, 2, 3, 4]
        : null;

  if (Array.isArray(mod.questions)) {
    const ids = mod.questions.map((q, i) => ({
      id: q?.id,
      where: `${relPath}[${i}]`,
    }));
    checkGlobalIdUniqueness(ids);
    mod.questions.forEach((q) => checkQuestion(q, relPath, { requireDomain }));
    const stats = questionStats(mod.questions);
    console.log(`問題数: ${mod.questions.length}`);
    console.log(
      `multiple: ${stats.multiple}問 (${pct(stats.multiple, mod.questions.length)})`
    );
    console.log(
      `難易度: easy ${stats.byDifficulty.easy} / medium ${stats.byDifficulty.medium} / hard ${stats.byDifficulty.hard}`
    );
    console.log(`reference付き: ${stats.withRef}/${mod.questions.length}`);
  }
  if (Array.isArray(mod.chapters)) {
    const ids = mod.chapters.map((c, i) => ({
      id: c?.id,
      where: `${relPath}[${i}]`,
    }));
    checkGlobalIdUniqueness(ids);
    // 単一ファイルでは確認問題の参照整合はチェックしない(全体検証で行う)
    mod.chapters.forEach((c) => checkChapter(c, relPath, null));
    console.log(`章数: ${mod.chapters.length}`);
  }
  if (!Array.isArray(mod.questions) && !Array.isArray(mod.chapters)) {
    err(relPath, "questions / chapters のどちらもエクスポートされていません");
  }
}

// ---- 全体モード ----
async function validateAll() {
  const basics = await importData("data/basics/index.js");
  const saa = await importData("data/saa/index.js");
  const cloudops = await importData("data/cloudops/index.js");
  const quizbank = await importData("data/quizbank/index.js");

  const datasets = [
    { name: "basics", data: basics, domains: null, isMaterial: true },
    { name: "saa", data: saa, domains: [1, 2, 3, 4], isMaterial: true },
    { name: "cloudops", data: cloudops, domains: [1, 2, 3, 4, 5], isMaterial: true },
    { name: "quizbank", data: quizbank, domains: [1, 2, 3, 4, 5], isMaterial: false },
  ];

  // ID重複はデータ横断でチェック
  const allIds = [];
  for (const ds of datasets) {
    (ds.data.chapters ?? []).forEach((c, i) =>
      allIds.push({ id: c?.id, where: `${ds.name}/chapters[${i}]` })
    );
    (ds.data.questions ?? []).forEach((q, i) =>
      allIds.push({ id: q?.id, where: `${ds.name}/questions[${i}]` })
    );
  }
  checkGlobalIdUniqueness(allIds);

  console.log("=== データ検証 ===\n");
  let totalQuestions = 0;

  for (const ds of datasets) {
    const questions = ds.data.questions ?? [];
    const chapters = ds.data.chapters ?? [];
    const questionIds = new Set(questions.map((q) => q.id));

    questions.forEach((q) =>
      checkQuestion(q, ds.name, { requireDomain: ds.domains })
    );
    chapters.forEach((c) => checkChapter(c, ds.name, questionIds));

    // 教材: 章から参照されていない問題を警告
    if (ds.isMaterial) {
      const referenced = new Set(
        chapters.flatMap((c) => c.checkQuestionIds ?? [])
      );
      for (const q of questions) {
        if (!referenced.has(q.id)) {
          warn(`${ds.name} ${q.id}`, "どの章からも参照されていない問題です");
        }
      }
    }

    totalQuestions += questions.length;
    const stats = questionStats(questions);
    console.log(`--- ${ds.name} ---`);
    if (ds.isMaterial) console.log(`章数: ${chapters.length}`);
    console.log(`問題数: ${questions.length}`);
    if (questions.length > 0) {
      console.log(
        `multiple: ${stats.multiple}問 (${pct(stats.multiple, questions.length)}) / ` +
          `難易度 easy:${stats.byDifficulty.easy} medium:${stats.byDifficulty.medium} hard:${stats.byDifficulty.hard} / ` +
          `reference付き: ${stats.withRef}`
      );
    }
    if (ds.domains && questions.length > 0) {
      const byDomain = {};
      for (const q of questions) {
        byDomain[q.domain] = (byDomain[q.domain] ?? 0) + 1;
      }
      console.log(
        `分野配分: ${ds.domains.map((d) => `分野${d}=${byDomain[d] ?? 0}`).join(" / ")}`
      );
    }
    console.log("");
  }

  // 目標値チェック
  const quizbankCount = (quizbank.questions ?? []).length;
  if (quizbankCount > 0 && quizbankCount < 200) {
    warn("quizbank", `問題数が目標(200問)未満です: ${quizbankCount}問`);
  }
  console.log(`総問題数(全データセット合計): ${totalQuestions}`);
  if (totalQuestions > 0 && totalQuestions < 450) {
    warn("全体", `総問題数が目標(450問)未満です: ${totalQuestions}問`);
  }
}

// ---- 実行 ----
const target = process.argv[2];
try {
  if (target) {
    await validateSingleFile(target);
  } else {
    await validateAll();
  }
} catch (e) {
  err("実行時", `データの読み込みに失敗しました: ${e.message}`);
}

console.log("");
if (warnings.length > 0) {
  console.log(`⚠ 警告 (${warnings.length}件):`);
  for (const w of warnings.slice(0, 60)) console.log(`  ${w}`);
  if (warnings.length > 60) console.log(`  ...ほか${warnings.length - 60}件`);
  console.log("");
}
if (errors.length > 0) {
  console.error(`✗ エラー (${errors.length}件):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
} else {
  console.log("✓ エラーはありません");
}
