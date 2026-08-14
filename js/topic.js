// 特設ページ(解説ページ)ビューア(topic.html)
// URLの ?id= からトピックを読み込み、解説本文・出典問題・参考リンクを描画する。

import { topicIds } from "../data/topics/index.js";
import { loadState, updateState, recordStudyToday } from "./storage.js";
import { overallStats } from "./progress.js";
import {
  escapeHtml,
  icon,
  initTheme,
  renderBreadcrumb,
  renderNavStats,
} from "./ui.js";

export async function initTopic() {
  initTheme();
  renderNavStats(overallStats(loadState()));

  const contentEl = document.getElementById("topic-content");
  const id = new URLSearchParams(location.search).get("id");

  function renderNotFound() {
    renderBreadcrumb([
      { label: "ホーム", href: "index.html" },
      { label: "特設ページ" },
    ]);
    contentEl.innerHTML = `
      <div class="console-container">
        <div class="console-body">
          <p class="font-bold mb-1">ページが見つかりません</p>
          <p class="text-[13px] text-aws-sub mb-4">指定された特設ページは存在しないか、削除された可能性があります。</p>
          <a href="index.html#special-pages" class="btn btn-primary">${icon("home", "w-4 h-4")}ダッシュボードへ戻る</a>
        </div>
      </div>`;
  }

  if (!id || !topicIds.includes(id)) {
    renderNotFound();
    return;
  }

  let topic;
  try {
    ({ topic } = await import(`../data/topics/${id}.js`));
  } catch {
    renderNotFound();
    return;
  }
  if (!topic) {
    renderNotFound();
    return;
  }

  document.title = `${topic.title} | AWS Study Console`;
  renderBreadcrumb([
    { label: "ホーム", href: "index.html" },
    { label: "特設ページ", href: "index.html#special-pages" },
    { label: topic.title },
  ]);

  const serviceBadges = (topic.services ?? [])
    .map((s) => `<span class="badge badge-gray">${escapeHtml(s)}</span>`)
    .join("");

  const sourceHtml = topic.source
    ? `
      <div class="callout callout-note">
        <span class="callout-title">きっかけになった問題</span>
        <p>${escapeHtml(topic.source.question)}</p>
        <p><strong>決め手:</strong> ${escapeHtml(topic.source.point)}</p>
      </div>`
    : "";

  const sectionsHtml = (topic.sections ?? [])
    .map(
      (sec) => `
      <section class="mb-8">
        <h3 class="text-[17px] font-bold pb-2 mb-3 border-b border-aws-border-weak leading-snug">${escapeHtml(sec.heading)}</h3>
        <div class="material-content">${sec.html}</div>
      </section>`
    )
    .join("");

  const referencesHtml =
    (topic.references ?? []).length > 0
      ? `
      <section class="mb-8">
        <h3 class="text-[17px] font-bold pb-2 mb-3 border-b border-aws-border-weak leading-snug">参考リンク</h3>
        <ul class="space-y-1.5">
          ${topic.references
            .map(
              (ref) => `
              <li class="flex items-start gap-1.5 text-[13.5px]">
                <span class="text-aws-sub mt-0.5 shrink-0">${icon("external", "w-3.5 h-3.5")}</span>
                <a class="link" href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ref.label)}</a>
              </li>`
            )
            .join("")}
        </ul>
      </section>`
      : "";

  contentEl.innerHTML = `
    <div class="console-container">
      <article class="console-body sm:!px-7 sm:!py-6">
        <header class="mb-6">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="badge badge-orange">特設ページ</span>
            ${topic.exam ? `<span class="badge badge-blue badge-wrap">${escapeHtml(topic.exam)}</span>` : ""}
            ${serviceBadges}
          </div>
          <h1 class="text-[22px] font-bold leading-snug">${escapeHtml(topic.title)}</h1>
          <p class="text-[13px] text-aws-sub mt-2">${escapeHtml(topic.description)}</p>
          <p class="text-[11.5px] text-aws-muted mt-1.5">作成日: ${escapeHtml(topic.createdAt ?? "")}</p>
        </header>
        ${sourceHtml ? `<div class="material-content mb-8">${sourceHtml}</div>` : ""}
        ${sectionsHtml}
        ${referencesHtml}
        <nav class="flex flex-col sm:flex-row gap-2.5 border-t border-aws-border pt-5 mt-8">
          <a href="index.html#special-pages" class="btn btn-primary">${icon("home", "w-4 h-4")}ダッシュボードへ戻る</a>
        </nav>
      </article>
    </div>`;

  updateState((s) => {
    recordStudyToday(s);
  });
}
