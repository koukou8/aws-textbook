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

// 特設ページ(data/topics/<id>.js の export const topic)の検証
function checkTopic(t, where) {
  if (!t || typeof t !== "object") {
    err(where, "topic がオブジェクトではありません");
    return;
  }
  const w = `${where} ${t.id ?? "(idなし)"}`;
  if (typeof t.id !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(t.id)) {
    err(w, `id が不正です(小文字英数字とハイフンのみ): ${t.id}`);
  }
  if (typeof t.title !== "string" || t.title.trim() === "") {
    err(w, "title が空です");
  }
  if (typeof t.description !== "string" || t.description.trim().length < 20) {
    err(w, "description が短すぎるか空です(20字以上)");
  }
  if (t.exam != null && (typeof t.exam !== "string" || t.exam.trim() === "")) {
    err(w, "exam は null か空でない文字列にしてください");
  }
  if (!Array.isArray(t.services) || t.services.length === 0) {
    err(w, "services(主要サービス・キーワードの配列)が空です");
  } else {
    t.services.forEach((s, i) => {
      if (typeof s !== "string" || s.trim() === "") {
        err(w, `services[${i}] が空です`);
      }
    });
  }
  if (typeof t.createdAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(t.createdAt)) {
    err(w, `createdAt は YYYY-MM-DD 形式にしてください: ${t.createdAt}`);
  }
  if (t.source != null) {
    if (typeof t.source !== "object") {
      err(w, "source はオブジェクトか null にしてください");
    } else {
      if (typeof t.source.question !== "string" || t.source.question.trim().length < 20) {
        err(w, "source.question(問題の要約)が短すぎます(20字以上)");
      }
      if (typeof t.source.point !== "string" || t.source.point.trim().length < 15) {
        err(w, "source.point(決め手)が短すぎます(15字以上)");
      }
    }
  }
  if (!Array.isArray(t.sections) || t.sections.length < 2) {
    err(w, `sections は2個以上必要です(実際: ${Array.isArray(t.sections) ? t.sections.length : "配列でない"})`);
  } else {
    t.sections.forEach((sec, i) => {
      if (typeof sec.heading !== "string" || sec.heading.trim() === "") {
        err(w, `sections[${i}].heading が空です`);
      }
      if (typeof sec.html !== "string" || sec.html.trim().length < 100) {
        err(w, `sections[${i}].html が短すぎるか空です(100字以上)`);
      }
      for (const tag of ["script", "style", "img"]) {
        if (new RegExp(`<${tag}`, "i").test(sec.html ?? "")) {
          err(w, `sections[${i}].html に <${tag}> タグが含まれています(使用禁止)`);
        }
      }
    });
  }
  if (!Array.isArray(t.references) || t.references.length === 0) {
    warn(w, "references(参考リンク)がありません");
  } else {
    t.references.forEach((ref, i) => {
      if (typeof ref?.label !== "string" || ref.label.trim() === "") {
        err(w, `references[${i}].label が空です`);
      }
      if (typeof ref?.url !== "string" || !/^https:\/\//.test(ref.url)) {
        err(w, `references[${i}].url がURL形式ではありません: ${ref?.url}`);
      }
    });
  }
}

// 特設ページのレジストリ(data/topics/index.js)と各ページの整合を検証
async function validateTopics() {
  let registry;
  try {
    registry = await importData("data/topics/index.js");
  } catch {
    return { count: 0 }; // レジストリ未作成なら特設ページなしとして扱う
  }
  const ids = registry.topicIds ?? [];
  if (!Array.isArray(ids)) {
    err("topics", "topicIds が配列ではありません");
    return { count: 0 };
  }
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) {
      err("topics", `topicIds に ${id} が重複しています`);
      continue;
    }
    seen.add(id);
    try {
      const mod = await importData(`data/topics/${id}.js`);
      if (!mod.topic) {
        err(`topics/${id}`, "topic がエクスポートされていません");
        continue;
      }
      checkTopic(mod.topic, "topics");
      if (mod.topic.id !== id) {
        err(`topics/${id}`, `topic.id(${mod.topic.id})がファイル名と一致しません`);
      }
    } catch (e) {
      err(`topics/${id}`, `読み込みに失敗しました: ${e.message}`);
    }
  }
  return { count: ids.length };
}

// 一問一答(data/qa/<id>.js の export const qaSet)の検証
function checkQaItem(item, w, seenIds) {
  if (!item || typeof item !== "object") {
    err(w, "item がオブジェクトではありません");
    return;
  }
  if (typeof item.id !== "string" || !/^qa-[a-z0-9-]+-\d{3}$/.test(item.id)) {
    err(w, `id は qa-<セットid>-001 形式にしてください: ${item.id}`);
  } else if (seenIds.has(item.id)) {
    err(w, `id が重複しています: ${item.id}`);
  } else {
    seenIds.add(item.id);
  }
  if (typeof item.q !== "string" || item.q.trim().length < 5) {
    err(w, "q(問い)が短すぎるか空です");
  } else if (item.q.length > 60) {
    warn(w, `q(問い)が長すぎます(60字以内を目安に / 実際: ${item.q.length}字)`);
  }
  if (typeof item.a !== "string" || item.a.trim().length < 10) {
    err(w, "a(答え)が短すぎるか空です(10字以上)");
  } else if (item.a.length > 140) {
    warn(w, `a(答え)が長すぎます(140字以内を目安に / 実際: ${item.a.length}字)`);
  }
  if (item.note != null && (typeof item.note !== "string" || item.note.trim().length < 10)) {
    err(w, "note は10字以上の文字列か、省略してください");
  }
  for (const [key, value] of Object.entries(item)) {
    if (!["id", "q", "a", "note"].includes(key)) {
      warn(w, `未知のフィールドです: ${key}`);
    }
    if (typeof value === "string" && /<[a-z]/i.test(value)) {
      err(w, `${key} にHTMLタグが含まれています(一問一答はプレーンテキストのみ)`);
    }
  }
}

function checkQaSet(set, where, knownTopicIds) {
  if (!set || typeof set !== "object") {
    err(where, "qaSet がオブジェクトではありません");
    return;
  }
  const w = `${where} ${set.id ?? "(idなし)"}`;
  if (typeof set.id !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(set.id)) {
    err(w, `id が不正です(小文字英数字とハイフンのみ): ${set.id}`);
  }
  if (typeof set.title !== "string" || set.title.trim() === "") {
    err(w, "title が空です");
  }
  if (typeof set.description !== "string" || set.description.trim().length < 20) {
    err(w, "description が短すぎるか空です(20字以上)");
  }
  if (set.exam != null && (typeof set.exam !== "string" || set.exam.trim() === "")) {
    err(w, "exam は null か空でない文字列にしてください");
  }
  if (!Array.isArray(set.groups) || set.groups.length === 0) {
    err(w, "groups が空です");
    return;
  }
  const seenIds = new Set();
  set.groups.forEach((g, gi) => {
    const gw = `${w} groups[${gi}]`;
    if (typeof g?.title !== "string" || g.title.trim() === "") {
      err(gw, "title が空です");
    }
    if (typeof g?.domain !== "number" || ![1, 2, 3, 4, 5].includes(g.domain)) {
      err(gw, `domain が不正です(1〜5 / 実際: ${g?.domain})`);
    }
    if (g?.topicId != null) {
      if (typeof g.topicId !== "string") {
        err(gw, "topicId は文字列にしてください");
      } else if (knownTopicIds && !knownTopicIds.includes(g.topicId)) {
        err(gw, `topicId が特設ページに存在しません: ${g.topicId}`);
      }
    }
    if (!Array.isArray(g?.items) || g.items.length === 0) {
      err(gw, "items が空です");
      return;
    }
    g.items.forEach((item, i) => {
      checkQaItem(item, `${gw} items[${i}]`, seenIds);
      if (typeof item?.id === "string" && !item.id.startsWith(`qa-${set.id}-`)) {
        err(`${gw} items[${i}]`, `id のプレフィックスがセットid と一致しません(期待: qa-${set.id}-NNN)`);
      }
    });
  });
  if (set.references != null) {
    if (!Array.isArray(set.references)) {
      err(w, "references は配列にしてください");
    } else {
      set.references.forEach((ref, i) => {
        if (typeof ref?.label !== "string" || ref.label.trim() === "") {
          err(w, `references[${i}].label が空です`);
        }
        if (typeof ref?.url !== "string" || !/^https:\/\//.test(ref.url)) {
          err(w, `references[${i}].url がURL形式ではありません: ${ref?.url}`);
        }
      });
    }
  } else {
    warn(w, "references(参考リンク)がありません");
  }
}

// 一問一答のレジストリ(data/qa/index.js)と各セットの整合を検証
async function validateQaSets() {
  let registry;
  try {
    registry = await importData("data/qa/index.js");
  } catch {
    return { sets: 0, items: 0 }; // レジストリ未作成なら一問一答なしとして扱う
  }
  const ids = registry.qaSetIds ?? [];
  if (!Array.isArray(ids)) {
    err("qa", "qaSetIds が配列ではありません");
    return { sets: 0, items: 0 };
  }
  let knownTopicIds = null;
  try {
    knownTopicIds = (await importData("data/topics/index.js")).topicIds ?? null;
  } catch {}
  const seen = new Set();
  let items = 0;
  for (const id of ids) {
    if (seen.has(id)) {
      err("qa", `qaSetIds に ${id} が重複しています`);
      continue;
    }
    seen.add(id);
    try {
      const mod = await importData(`data/qa/${id}.js`);
      if (!mod.qaSet) {
        err(`qa/${id}`, "qaSet がエクスポートされていません");
        continue;
      }
      checkQaSet(mod.qaSet, "qa", knownTopicIds);
      if (mod.qaSet.id !== id) {
        err(`qa/${id}`, `qaSet.id(${mod.qaSet.id})がファイル名と一致しません`);
      }
      items += (mod.qaSet.groups ?? []).reduce((n, g) => n + (g.items ?? []).length, 0);
    } catch (e) {
      err(`qa/${id}`, `読み込みに失敗しました: ${e.message}`);
    }
  }
  return { sets: ids.length, items };
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
  const requireDomain = /quizbank|aifbank|cloudops|aif/.test(relPath)
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
  if (mod.topic) {
    checkTopic(mod.topic, relPath);
    const fileId = path.basename(relPath, ".js");
    if (mod.topic.id !== fileId && fileId !== "index") {
      err(relPath, `topic.id(${mod.topic.id})がファイル名(${fileId})と一致しません`);
    }
    console.log(`特設ページ: ${mod.topic.title ?? "(タイトルなし)"}`);
    console.log(`セクション数: ${mod.topic.sections?.length ?? 0}`);
  }
  if (Array.isArray(mod.topicIds)) {
    console.log(`特設ページレジストリ: ${mod.topicIds.length}件`);
  }
  if (mod.qaSet) {
    let knownTopicIds = null;
    try {
      knownTopicIds = (await importData("data/topics/index.js")).topicIds ?? null;
    } catch {}
    checkQaSet(mod.qaSet, relPath, knownTopicIds);
    const fileId = path.basename(relPath, ".js");
    if (mod.qaSet.id !== fileId && fileId !== "index") {
      err(relPath, `qaSet.id(${mod.qaSet.id})がファイル名(${fileId})と一致しません`);
    }
    const qaCount = (mod.qaSet.groups ?? []).reduce(
      (n, g) => n + (g.items ?? []).length,
      0
    );
    console.log(`一問一答: ${mod.qaSet.title ?? "(タイトルなし)"}`);
    console.log(`グループ数: ${mod.qaSet.groups?.length ?? 0} / 設問数: ${qaCount}`);
  }
  if (Array.isArray(mod.qaSetIds)) {
    console.log(`一問一答レジストリ: ${mod.qaSetIds.length}件`);
  }
  if (
    !Array.isArray(mod.questions) &&
    !Array.isArray(mod.chapters) &&
    !mod.topic &&
    !Array.isArray(mod.topicIds) &&
    !mod.qaSet &&
    !Array.isArray(mod.qaSetIds)
  ) {
    err(relPath, "questions / chapters / topic / qaSet のいずれもエクスポートされていません");
  }
}

// ---- 全体モード ----
async function validateAll() {
  const basics = await importData("data/basics/index.js");
  const saa = await importData("data/saa/index.js");
  const cloudops = await importData("data/cloudops/index.js");
  const aif = await importData("data/aif/index.js");
  const quizbank = await importData("data/quizbank/index.js");
  const aifbank = await importData("data/aifbank/index.js");

  const datasets = [
    { name: "basics", data: basics, domains: null, isMaterial: true },
    { name: "saa", data: saa, domains: [1, 2, 3, 4], isMaterial: true },
    { name: "cloudops", data: cloudops, domains: [1, 2, 3, 4, 5], isMaterial: true },
    { name: "aif", data: aif, domains: [1, 2, 3, 4, 5], isMaterial: true },
    { name: "quizbank", data: quizbank, domains: [1, 2, 3, 4, 5], isMaterial: false },
    { name: "aifbank", data: aifbank, domains: [1, 2, 3, 4, 5], isMaterial: false },
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
  for (const [name, mod] of [
    ["quizbank", quizbank],
    ["aifbank", aifbank],
  ]) {
    const count = (mod.questions ?? []).length;
    if (count > 0 && count < 200) {
      warn(name, `問題数が目標(200問)未満です: ${count}問`);
    }
  }
  console.log(`総問題数(全データセット合計): ${totalQuestions}`);
  if (totalQuestions > 0 && totalQuestions < 800) {
    warn("全体", `総問題数が目標(800問)未満です: ${totalQuestions}問`);
  }

  const topicsResult = await validateTopics();
  console.log(`特設ページ数: ${topicsResult.count}`);
  const qaResult = await validateQaSets();
  console.log(`一問一答: ${qaResult.sets}セット ${qaResult.items}問`);
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
