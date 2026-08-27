// 一問一答セクション(ダッシュボード)
// data/qa/<id>.js のセットを読み込み、「問い → 答え」のカード一覧を描画する。
// 行をクリックすると答えが開く。進捗は保存しない(教材・問題集の正答率には影響しない)。

import { qaSetIds } from "../data/qa/index.js";
import { topicIds } from "../data/topics/index.js";
import { DOMAINS } from "../data/quizbank/index.js";
import { escapeHtml, icon } from "./ui.js";

function itemHtml(item) {
  const note = item.note
    ? `<span class="qa-note" hidden>${escapeHtml(item.note)}</span>`
    : "";
  return `
    <button type="button" class="qa-row" data-qa="toggle" aria-expanded="false">
      <span class="qa-mark">Q</span>
      <span class="qa-row-body">
        <span class="qa-q">${escapeHtml(item.q)}</span>
        <span class="qa-a" hidden>
          <span class="qa-a-mark">A</span>${escapeHtml(item.a)}
        </span>
        ${note}
      </span>
      <span class="qa-chevron">${icon("chevron-right", "w-4 h-4")}</span>
    </button>`;
}

function groupHtml(group, topicTitles) {
  const domain = DOMAINS[group.domain];
  const domainBadge = domain
    ? `<span class="badge badge-blue" title="${escapeHtml(domain.label)}">分野${group.domain}</span>`
    : "";
  const topicTitle = group.topicId ? topicTitles.get(group.topicId) : null;
  const topicLink = topicTitle
    ? `<a class="qa-group-link" href="topic.html?id=${encodeURIComponent(group.topicId)}" title="${escapeHtml(topicTitle)}">
        特設ページ${icon("chevron-right", "w-3.5 h-3.5")}
      </a>`
    : "";
  return `
    <div class="qa-group">
      <div class="qa-group-head">
        <span class="qa-group-title">${escapeHtml(group.title)}</span>
        ${domainBadge}
        ${topicLink}
      </div>
      <div class="qa-rows">${group.items.map(itemHtml).join("")}</div>
    </div>`;
}

// グループから参照された特設ページのタイトルを解決する(存在しないidは無視する)
async function loadTopicTitles(groups) {
  const ids = [
    ...new Set(
      groups.map((g) => g.topicId).filter((id) => id && topicIds.includes(id))
    ),
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

function referencesHtml(set) {
  if (!(set.references ?? []).length) return "";
  return `
    <div class="qa-refs">
      <p class="qa-refs-title">参考リンク</p>
      <ul class="qa-refs-list">
        ${set.references
          .map(
            (ref) => `<li>
              <a class="link inline-flex items-start gap-1.5" href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">
                <span class="shrink-0 mt-0.5">${icon("external", "w-3.5 h-3.5")}</span>${escapeHtml(ref.label)}
              </a>
            </li>`
          )
          .join("")}
      </ul>
    </div>`;
}

function setHtml(set, topicTitles) {
  const count = set.groups.reduce((n, g) => n + g.items.length, 0);
  return `
    <div class="console-container mb-5 last:mb-0">
      <div class="console-header">
        <div class="flex flex-wrap items-start gap-3">
          <span class="icon-chip mt-0.5">${icon("edit", "w-5 h-5")}</span>
          <div class="min-w-[200px] flex-1">
            <h3 class="console-title">${escapeHtml(set.title)}${
              set.exam
                ? ` <span class="badge badge-blue badge-wrap align-middle">${escapeHtml(set.exam)}</span>`
                : ""
            }</h3>
            <p class="console-desc">${escapeHtml(set.description)}全${count}問。</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm shrink-0 ml-auto" data-qa="toggle-all" aria-pressed="false">
            すべて表示
          </button>
        </div>
      </div>
      <div class="console-body !px-0 !py-0">
        ${set.groups.map((g) => groupHtml(g, topicTitles)).join("")}
      </div>
      ${referencesHtml(set)}
    </div>`;
}

function setRowOpen(row, open) {
  row.setAttribute("aria-expanded", String(open));
  row.querySelectorAll(".qa-a, .qa-note").forEach((el) => {
    el.hidden = !open;
  });
}

// 一問一答セクションを描画する。セットが無ければ非表示にする。
export async function renderQaSection(el) {
  if (!el) return;
  const modules = await Promise.all(
    qaSetIds.map((id) => import(`../data/qa/${id}.js`).catch(() => null))
  );
  const sets = modules
    .map((m) => m?.qaSet)
    .filter(
      (s) =>
        s &&
        Array.isArray(s.groups) &&
        s.groups.some((g) => (g.items ?? []).length > 0)
    );
  if (sets.length === 0) {
    el.innerHTML = "";
    el.classList.add("hidden");
    return;
  }

  const topicTitles = await loadTopicTitles(sets.flatMap((s) => s.groups));
  el.classList.remove("hidden");
  el.innerHTML = sets.map((set) => setHtml(set, topicTitles)).join("");

  el.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qa]");
    if (!btn) return;
    if (btn.dataset.qa === "toggle") {
      setRowOpen(btn, btn.getAttribute("aria-expanded") !== "true");
    } else if (btn.dataset.qa === "toggle-all") {
      const container = btn.closest(".console-container");
      const open = btn.getAttribute("aria-pressed") !== "true";
      container
        .querySelectorAll('[data-qa="toggle"]')
        .forEach((row) => setRowOpen(row, open));
      btn.setAttribute("aria-pressed", String(open));
      btn.textContent = open ? "すべて隠す" : "すべて表示";
    }
  });
}
