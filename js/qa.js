// 一問一答セクション(ダッシュボード)
// data/qa/<id>.js のセットを読み込み、アコーディオン形式で描画する。
// 選択肢を選ぶ(または「答えを見る」を押す)と、正解・各選択肢の講評・詳しい解説を開示する。
// 進捗は保存しない(教材・問題集の正答率には影響しない)軽量な確認用セクション。

import { qaSetIds } from "../data/qa/index.js";
import { topicIds } from "../data/topics/index.js";
import { DOMAINS } from "../data/quizbank/index.js";
import { escapeHtml, icon } from "./ui.js";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// itemId -> { revealed: boolean, selected: number | null }
const states = new Map();

function stateOf(itemId) {
  if (!states.has(itemId)) states.set(itemId, { revealed: false, selected: null });
  return states.get(itemId);
}

function choiceHtml(item, choice, i, state) {
  const { revealed, selected } = state;
  let cls = "choice-btn";
  let letterCls = "choice-letter";
  if (revealed) {
    if (choice.correct) {
      cls += " choice-correct";
      letterCls += " choice-letter-correct";
    } else if (selected === i) {
      cls += " choice-wrong";
      letterCls += " choice-letter-wrong";
    } else {
      cls += " choice-muted";
    }
  }
  const comment = revealed
    ? `<p class="qa-comment ${choice.correct ? "qa-comment-ok" : "qa-comment-ng"}">
        <span class="qa-comment-mark">${choice.correct ? "正解" : "不正解"}</span>${escapeHtml(choice.comment)}
      </p>`
    : "";
  return `
    <div>
      <button type="button" class="${cls}" data-qa="choice" data-item="${item.id}" data-index="${i}" ${
        revealed ? "disabled" : ""
      }>
        <span class="${letterCls}">${LETTERS[i]}</span>
        <span class="flex-1">${escapeHtml(choice.text)}</span>
      </button>
      ${comment}
    </div>`;
}

function revealHtml(item, state, topicTitles) {
  const correctIndex = item.choices.findIndex((c) => c.correct);
  const judged =
    state.selected === null
      ? ""
      : state.selected === correctIndex
        ? `<div class="flashbar flashbar-success" role="status">
            ${icon("check-circle", "w-5 h-5")}
            <div><span class="font-bold">正解です。</span></div>
          </div>`
        : `<div class="flashbar flashbar-error" role="status">
            ${icon("x-circle", "w-5 h-5")}
            <div><span class="font-bold">不正解です。</span> 正解は <span class="font-bold">${LETTERS[correctIndex]}</span> です。</div>
          </div>`;

  const detailHtml = (item.detail ?? [])
    .map(
      (sec) => `<h4>${escapeHtml(sec.heading)}</h4>
      ${sec.html}`
    )
    .join("");

  const referencesHtml =
    (item.references ?? []).length > 0
      ? `<div class="qa-refs">
          <p class="qa-refs-title">参考リンク</p>
          <ul class="qa-refs-list">
            ${item.references
              .map(
                (ref) => `<li>
                  <a class="link inline-flex items-start gap-1.5" href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">
                    <span class="shrink-0 mt-0.5">${icon("external", "w-3.5 h-3.5")}</span>${escapeHtml(ref.label)}
                  </a>
                </li>`
              )
              .join("")}
          </ul>
        </div>`
      : "";

  const relatedTitle = item.topicId ? topicTitles.get(item.topicId) : null;
  const relatedHtml = relatedTitle
    ? `<a class="qa-related" href="topic.html?id=${encodeURIComponent(item.topicId)}">
        ${icon("bookmark", "w-4 h-4")}
        <span class="flex-1">特設ページで深掘りする: <b>${escapeHtml(relatedTitle)}</b></span>
        ${icon("chevron-right", "w-4 h-4")}
      </a>`
    : "";

  return `
    <div class="qa-reveal">
      ${judged}
      <div class="qa-answer">
        <p class="qa-answer-label">${icon("check", "w-3.5 h-3.5")}答え</p>
        <p class="qa-answer-text">${escapeHtml(item.answer)}</p>
      </div>
      <div class="qa-keypoint">
        <p class="qa-keypoint-label">決め手</p>
        <p>${escapeHtml(item.keyPoint)}</p>
      </div>
      ${relatedHtml}
      <details class="qa-detail">
        <summary class="qa-detail-summary">
          ${icon("chevron-right", "w-3.5 h-3.5")}詳しい解説を読む
        </summary>
        <div class="material-content qa-detail-body">${detailHtml}${referencesHtml}</div>
      </details>
      <div class="flex justify-end">
        <button type="button" class="btn btn-secondary btn-sm" data-qa="reset" data-item="${item.id}">
          ${icon("refresh", "w-4 h-4")}もう一度解く
        </button>
      </div>
    </div>`;
}

function bodyHtml(item, topicTitles) {
  const state = stateOf(item.id);
  const choices = item.choices
    .map((c, i) => choiceHtml(item, c, i, state))
    .join("");
  const actions = state.revealed
    ? ""
    : `<div class="qa-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-qa="reveal" data-item="${item.id}">答えを見る</button>
        <span class="qa-hint">選択肢を選ぶと、自己採点つきで解説を表示します。</span>
      </div>`;
  return `
    <div class="qa-choices">${choices}</div>
    ${actions}
    ${state.revealed ? revealHtml(item, state, topicTitles) : ""}`;
}

function itemHtml(item, index, topicTitles) {
  const domain = DOMAINS[item.domain];
  const domainBadge = domain
    ? `<span class="badge badge-blue" title="${escapeHtml(domain.label)}">分野${item.domain}</span>`
    : "";
  return `
    <details class="qa-item" data-qa-item="${item.id}">
      <summary class="qa-summary">
        <span class="qa-num">Q${index + 1}</span>
        <span class="min-w-0 flex-1">
          <span class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            ${domainBadge}
            <span class="badge badge-gray">${escapeHtml(item.topic)}</span>
          </span>
          <span class="qa-question">${escapeHtml(item.question)}</span>
        </span>
        <span class="qa-chevron">${icon("chevron-right", "w-4 h-4")}</span>
      </summary>
      <div class="qa-body" data-qa-body="${item.id}">${bodyHtml(item, topicTitles)}</div>
    </details>`;
}

// 関連づけられた特設ページのタイトルを解決する(存在しないidは無視する)
async function loadTopicTitles(items) {
  const ids = [
    ...new Set(items.map((i) => i.topicId).filter((id) => id && topicIds.includes(id))),
  ];
  const mods = await Promise.all(
    ids.map((id) => import(`../data/topics/${id}.js`).catch(() => null))
  );
  const map = new Map();
  ids.forEach((id, i) => {
    const title = mods[i]?.topic?.title;
    if (title) map.set(id, title);
  });
  return map;
}

// 一問一答セクションを描画する。セットが無ければ非表示にする。
export async function renderQaSection(el) {
  if (!el) return;
  const modules = await Promise.all(
    qaSetIds.map((id) => import(`../data/qa/${id}.js`).catch(() => null))
  );
  const sets = modules
    .map((m) => m?.qaSet)
    .filter((s) => s && Array.isArray(s.items) && s.items.length > 0);
  if (sets.length === 0) {
    el.innerHTML = "";
    el.classList.add("hidden");
    return;
  }

  const allItems = sets.flatMap((s) => s.items);
  const topicTitles = await loadTopicTitles(allItems);
  const itemById = new Map(allItems.map((i) => [i.id, i]));

  el.classList.remove("hidden");
  el.innerHTML = sets
    .map(
      (set) => `
      <div class="console-container mb-5 last:mb-0">
        <div class="console-header">
          <div class="flex items-start gap-3">
            <span class="icon-chip mt-0.5">${icon("edit", "w-5 h-5")}</span>
            <div class="min-w-0">
              <h3 class="console-title">${escapeHtml(set.title)}${
                set.exam
                  ? ` <span class="badge badge-blue badge-wrap align-middle">${escapeHtml(set.exam)}</span>`
                  : ""
              }</h3>
              <p class="console-desc">${escapeHtml(set.description)}全${set.items.length}問。</p>
            </div>
          </div>
        </div>
        <div class="divide-y divide-aws-border-weak">
          ${set.items.map((item, i) => itemHtml(item, i, topicTitles)).join("")}
        </div>
      </div>`
    )
    .join("");

  function rerenderItem(itemId) {
    const item = itemById.get(itemId);
    const body = el.querySelector(`[data-qa-body="${itemId}"]`);
    if (!item || !body) return;
    body.innerHTML = bodyHtml(item, topicTitles);
  }

  el.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qa]");
    if (!btn) return;
    const itemId = btn.dataset.item;
    const state = stateOf(itemId);
    if (btn.dataset.qa === "choice") {
      state.selected = Number(btn.dataset.index);
      state.revealed = true;
    } else if (btn.dataset.qa === "reveal") {
      state.selected = null;
      state.revealed = true;
    } else if (btn.dataset.qa === "reset") {
      state.selected = null;
      state.revealed = false;
    } else {
      return;
    }
    rerenderItem(itemId);
  });
}
