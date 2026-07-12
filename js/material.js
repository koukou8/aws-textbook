// 教材ページ共通ロジック(AWS基礎 / SAA / CloudOps)
// サイドバー・章描画・ハッシュルーティング・章末確認問題・進捗記録を担う。

import { MATERIALS, PASS_THRESHOLD } from "./config.js";
import {
  loadState,
  updateState,
  recordStudyToday,
} from "./storage.js";
import { materialProgress, overallStats } from "./progress.js";
import { renderQuiz } from "./quiz-engine.js";
import {
  escapeHtml,
  icon,
  pctText,
  progressBar,
  renderBreadcrumb,
  renderNavStats,
} from "./ui.js";

export async function initMaterial(materialId) {
  const meta = MATERIALS[materialId];
  const data = await import(`../data/${materialId}/index.js`);
  const chapters = data.chapters ?? [];
  const domainLabels = data.domainLabels ?? null;
  const questionById = new Map((data.questions ?? []).map((q) => [q.id, q]));

  const sidenavEl = document.getElementById("sidenav");
  const contentEl = document.getElementById("chapter-content");
  const drawerEl = document.getElementById("drawer");
  const drawerOverlayEl = document.getElementById("drawer-overlay");
  const progressSummaryEl = document.getElementById("material-progress");

  renderNavStats(overallStats(loadState()));

  if (chapters.length === 0) {
    contentEl.innerHTML = `
      <div class="console-container">
        <div class="console-body text-aws-sub">
          この教材のコンテンツはまだ準備中です。
        </div>
      </div>`;
    return;
  }

  function chapterById(id) {
    return chapters.find((c) => c.id === id) ?? null;
  }

  function currentChapter() {
    const hashId = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (hashId && chapterById(hashId)) return chapterById(hashId);
    const state = loadState();
    const last = state.materials[materialId]?.lastChapterId;
    if (last && chapterById(last)) return chapterById(last);
    return chapters[0];
  }

  // ---- サイドバー ----
  function sidebarHtml(activeId) {
    const state = loadState();
    const completed = new Set(
      state.materials[materialId]?.completedChapters ?? []
    );
    const prog = materialProgress(state, materialId, chapters);

    let itemsHtml = "";
    if (domainLabels) {
      // 分野ごとにグルーピング(章の出現順を保持)
      const groups = new Map();
      for (const ch of chapters) {
        const key = ch.domain ?? 0;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(ch);
      }
      for (const [domain, list] of groups) {
        itemsHtml += `<div class="sidenav-group">分野${domain}: ${escapeHtml(
          domainLabels[domain] ?? ""
        )}</div>`;
        itemsHtml += list.map((ch) => itemHtml(ch)).join("");
      }
    } else {
      itemsHtml = chapters.map((ch) => itemHtml(ch)).join("");
    }

    function itemHtml(ch) {
      const isActive = ch.id === activeId;
      const isDone = completed.has(ch.id);
      const num = chapters.indexOf(ch) + 1;
      return `
        <a href="#${escapeHtml(ch.id)}" data-chapter-link
          class="sidenav-item ${isActive ? "sidenav-item-active" : ""}">
          <span class="w-5 shrink-0 text-center">
            ${
              isDone
                ? `<span class="text-aws-success inline-block align-middle">${icon("check-circle", "w-4 h-4")}</span>`
                : `<span class="text-[11px] text-aws-sub">${num}</span>`
            }
          </span>
          <span class="flex-1 leading-snug">${escapeHtml(ch.title)}</span>
        </a>`;
    }

    return `
      <div class="px-4 pt-4 pb-3 border-b border-aws-border-weak">
        <p class="text-[12px] font-bold text-aws-sub mb-1.5">章の進捗</p>
        <div class="flex items-center gap-2">
          ${progressBar(prog.percent, { done: prog.percent === 100, extraClass: "flex-1" })}
          <span class="text-[12px] text-aws-sub whitespace-nowrap">${prog.completedCount}/${prog.totalChapters}</span>
        </div>
      </div>
      <nav class="py-2" aria-label="章一覧">${itemsHtml}</nav>`;
  }

  function renderSidebar(activeId) {
    const html = sidebarHtml(activeId);
    if (sidenavEl) sidenavEl.innerHTML = html;
    if (drawerEl) {
      drawerEl.innerHTML = `
        <div class="flex items-center justify-between px-4 h-12 border-b border-aws-border-weak bg-aws-bg">
          <span class="font-bold text-[14px]">${escapeHtml(meta.title)} — 章一覧</span>
          <button type="button" data-drawer-close class="p-2 text-aws-sub hover:text-aws-text cursor-pointer" aria-label="閉じる">
            ${icon("close", "w-5 h-5")}
          </button>
        </div>
        <div class="overflow-y-auto flex-1">${html}</div>`;
    }
  }

  // ---- ドロワー ----
  function openDrawer() {
    drawerEl?.classList.remove("-translate-x-full");
    drawerOverlayEl?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawerEl?.classList.add("-translate-x-full");
    drawerOverlayEl?.classList.add("hidden");
    document.body.style.overflow = "";
  }
  document
    .getElementById("drawer-open")
    ?.addEventListener("click", openDrawer);
  drawerOverlayEl?.addEventListener("click", closeDrawer);
  drawerEl?.addEventListener("click", (e) => {
    if (e.target.closest("[data-drawer-close]") || e.target.closest("[data-chapter-link]")) {
      closeDrawer();
    }
  });

  // ---- 章末確認問題 ----
  function renderChapterQuiz(chapter) {
    const host = contentEl.querySelector("#chapter-quiz");
    if (!host) return;
    const qs = (chapter.checkQuestionIds ?? [])
      .map((id) => questionById.get(id))
      .filter(Boolean);

    if (qs.length === 0) {
      host.innerHTML = "";
      return;
    }

    function renderIntro() {
      const state = loadState();
      const rec = state.materials[materialId]?.checkResults?.[chapter.id];
      const isDone = (
        state.materials[materialId]?.completedChapters ?? []
      ).includes(chapter.id);
      const bestHtml = rec
        ? `<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-aws-sub mt-2">
            <span>ベストスコア: <span class="font-bold text-aws-text">${rec.best} / ${rec.total}</span>(${pctText(
              rec.total > 0 ? rec.best / rec.total : null
            )})</span>
            <span>挑戦回数: ${rec.attempts}回</span>
          </div>`
        : "";
      host.innerHTML = `
        <div class="console-container">
          <div class="console-header">
            <div class="flex items-center gap-2">
              <h2 class="console-title">理解度確認問題</h2>
              ${
                isDone
                  ? `<span class="badge badge-green">${icon("check", "w-3 h-3")} 章完了</span>`
                  : ""
              }
            </div>
            <p class="console-desc">全${qs.length}問。正答率${Math.round(PASS_THRESHOLD * 100)}%以上でこの章が完了になります。何度でも挑戦できます。</p>
          </div>
          <div class="console-body">
            ${bestHtml ? bestHtml : ""}
            <button type="button" class="btn btn-primary mt-1" data-quiz-start>
              ${rec ? "もう一度挑戦する" : "確認問題を開始する"}
            </button>
          </div>
        </div>`;
      host.querySelector("[data-quiz-start]")?.addEventListener("click", startQuiz);
    }

    function startQuiz() {
      const quizContainer = document.createElement("div");
      host.innerHTML = "";
      host.appendChild(quizContainer);
      quizContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      renderQuiz(quizContainer, {
        questions: qs,
        title: `理解度確認: ${chapter.title}`,
        passThreshold: PASS_THRESHOLD,
        domainLabels: null,
        onFinish(result) {
          updateState((s) => {
            const m = s.materials[materialId];
            const rec = m.checkResults[chapter.id] ?? {
              best: 0,
              total: qs.length,
              attempts: 0,
              sumCorrect: 0,
              sumTotal: 0,
              lastAt: null,
            };
            rec.total = qs.length;
            rec.best = Math.max(rec.best, result.correctCount);
            rec.attempts += 1;
            rec.sumCorrect += result.correctCount;
            rec.sumTotal += result.total;
            rec.lastAt = new Date().toISOString();
            m.checkResults[chapter.id] = rec;
            if (
              result.total > 0 &&
              result.correctCount / result.total >= PASS_THRESHOLD &&
              !m.completedChapters.includes(chapter.id)
            ) {
              m.completedChapters.push(chapter.id);
            }
            recordStudyToday(s);
          });
          renderSidebar(chapter.id);
          renderNavStats(overallStats(loadState()));
          renderProgressSummary();
        },
        onRetry() {
          startQuiz();
        },
        onExit() {
          renderIntro();
        },
        exitLabel: "確認問題をやめる",
        resultExitLabel: "章に戻る",
      });
    }

    renderIntro();
  }

  function renderProgressSummary() {
    if (!progressSummaryEl) return;
    const prog = materialProgress(loadState(), materialId, chapters);
    progressSummaryEl.innerHTML = `
      <span>完了 <span class="font-bold text-aws-text">${prog.completedCount}/${prog.totalChapters}</span>章</span>
      <span class="mx-2 text-aws-border">|</span>
      <span>確認問題の累計正答率 <span class="font-bold text-aws-text">${pctText(prog.accuracy)}</span></span>`;
  }

  // ---- 章本文 ----
  function renderChapter(chapter) {
    const idx = chapters.indexOf(chapter);
    const prev = chapters[idx - 1] ?? null;
    const next = chapters[idx + 1] ?? null;

    renderBreadcrumb([
      { label: "ホーム", href: "index.html" },
      { label: meta.title, href: meta.page },
      { label: chapter.title },
    ]);

    const domainBadge =
      domainLabels && chapter.domain != null && domainLabels[chapter.domain]
        ? `<span class="badge badge-blue badge-wrap">分野${chapter.domain}: ${escapeHtml(domainLabels[chapter.domain])}</span>`
        : "";

    const sectionsHtml = (chapter.sections ?? [])
      .map(
        (sec) => `
        <section class="mb-8">
          <h3 class="text-[17px] font-bold pb-2 mb-3 border-b border-aws-border-weak leading-snug">${escapeHtml(sec.heading)}</h3>
          <div class="material-content">${sec.html}</div>
        </section>`
      )
      .join("");

    contentEl.innerHTML = `
      <article>
        <header class="mb-6">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="badge badge-gray">第${idx + 1}章</span>
            ${domainBadge}
          </div>
          <h1 class="text-[22px] font-bold leading-snug">${escapeHtml(chapter.title)}</h1>
        </header>
        ${sectionsHtml}
        <div id="chapter-quiz" class="my-8 scroll-mt-16"></div>
        <nav class="flex flex-col sm:flex-row gap-2.5 justify-between border-t border-aws-border pt-5 mt-8">
          ${
            prev
              ? `<a href="#${escapeHtml(prev.id)}" class="btn btn-secondary sm:max-w-[48%]">${icon("chevron-left", "w-4 h-4")}<span class="truncate">前の章: ${escapeHtml(prev.title)}</span></a>`
              : "<span></span>"
          }
          ${
            next
              ? `<a href="#${escapeHtml(next.id)}" class="btn btn-primary sm:max-w-[48%]"><span class="truncate">次の章: ${escapeHtml(next.title)}</span>${icon("chevron-right", "w-4 h-4")}</a>`
              : `<a href="index.html" class="btn btn-primary">${icon("home", "w-4 h-4")}ダッシュボードへ戻る</a>`
          }
        </nav>
      </article>`;

    renderChapterQuiz(chapter);
    renderSidebar(chapter.id);
    renderProgressSummary();

    updateState((s) => {
      s.materials[materialId].lastChapterId = chapter.id;
      recordStudyToday(s);
    });
  }

  function navigate() {
    const chapter = currentChapter();
    if (location.hash !== `#${chapter.id}`) {
      history.replaceState(null, "", `#${chapter.id}`);
    }
    renderChapter(chapter);
    window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", navigate);
  navigate();
}
