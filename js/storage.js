// localStorage ラッパー。進捗データの読み書き・マイグレーション・
// エクスポート/インポートを一手に担う。

const STORAGE_KEY = "aws-textbook:v1";
export const CURRENT_VERSION = 1;

function defaultMaterialState() {
  return {
    completedChapters: [],
    lastChapterId: null,
    // 章ID => { best, total, attempts, sumCorrect, sumTotal, lastAt }
    checkResults: {},
  };
}

// 問題集(quizbank / aifbank)ごとの進捗のデフォルト
function defaultBankState() {
  return {
    // 問題ID => { attempts, correct, lastCorrect, bookmarked, lastAnsweredAt }
    history: {},
    // 中断中セッション: { mode, label, domain, questionIds, index, answers, startedAt, updatedAt }
    session: null,
  };
}

// 問題集のstateキー一覧(js/config.js の QUIZBANKS のidと対応)
export const BANK_KEYS = ["quizbank", "aifbank"];

export function defaultState() {
  const state = {
    version: CURRENT_VERSION,
    materials: {
      basics: defaultMaterialState(),
      saa: defaultMaterialState(),
      cloudops: defaultMaterialState(),
      aif: defaultMaterialState(),
    },
    stats: {
      studyDates: [],
    },
  };
  for (const key of BANK_KEYS) {
    state[key] = defaultBankState();
  }
  return state;
}

// スキーマ変更時は { 2: (state) => next } の形でマイグレーション関数を追加する
const MIGRATIONS = {};

function migrate(state) {
  let current = state;
  if (typeof current.version !== "number") {
    current = { ...current, version: 1 };
  }
  while (current.version < CURRENT_VERSION) {
    const step = MIGRATIONS[current.version + 1];
    if (!step) break;
    current = step(current);
  }
  return current;
}

// 欠けているキーをデフォルト値で補完する(古いデータや手編集データへの耐性)
function mergeWithDefault(state) {
  const def = defaultState();
  const merged = {
    ...def,
    ...state,
    version: CURRENT_VERSION,
    materials: { ...def.materials },
    stats: { ...def.stats, ...(state.stats ?? {}) },
  };
  for (const key of Object.keys(def.materials)) {
    merged.materials[key] = {
      ...defaultMaterialState(),
      ...(state.materials?.[key] ?? {}),
    };
  }
  for (const key of BANK_KEYS) {
    merged[key] = { ...defaultBankState(), ...(state[key] ?? {}) };
    if (!merged[key].history || typeof merged[key].history !== "object") {
      merged[key].history = {};
    }
  }
  if (!Array.isArray(merged.stats.studyDates)) merged.stats.studyDates = [];
  return merged;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultState();
    return mergeWithDefault(migrate(parsed));
  } catch (err) {
    console.warn("進捗データの読み込みに失敗したため初期状態で開始します。", err);
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("進捗データの保存に失敗しました。", err);
  }
}

// state を読み込み → mutator で変更 → 保存、をまとめて行う
export function updateState(mutator) {
  const state = loadState();
  mutator(state);
  saveState(state);
  return state;
}

export function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function recordStudyToday(state) {
  const today = todayString();
  if (!state.stats.studyDates.includes(today)) {
    state.stats.studyDates.push(today);
  }
}

export function resetMaterial(materialId) {
  return updateState((s) => {
    s.materials[materialId] = defaultMaterialState();
  });
}

export function resetQuizbank(bankId = "quizbank") {
  return updateState((s) => {
    s[bankId] = defaultBankState();
  });
}

export function resetAll() {
  const state = defaultState();
  saveState(state);
  return state;
}

export function exportStateJSON() {
  return JSON.stringify(loadState(), null, 2);
}

export function importStateJSON(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "JSONとして読み込めませんでした。" };
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof parsed.version !== "number" ||
    !parsed.materials ||
    !parsed.quizbank
  ) {
    return { ok: false, error: "このアプリの進捗データ形式ではありません。" };
  }
  if (parsed.version > CURRENT_VERSION) {
    return {
      ok: false,
      error: "より新しいバージョンのデータのためインポートできません。",
    };
  }
  const state = mergeWithDefault(migrate(parsed));
  saveState(state);
  return { ok: true, state };
}
