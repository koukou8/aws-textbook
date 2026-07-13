// CloudOps問題集ページ(quiz.html)
// モード選択(全問順次 / 分野別 / ランダム10問 / 復習 / ブックマーク)と
// セッションの保存・再開を担う。クイズUI本体は quiz-engine.js を使う。

import {
  loadState,
  updateState,
  recordStudyToday,
} from "./storage.js";
import {
  bookmarkedQuestions,
  overallStats,
  quizbankDomainStats,
  quizbankProgress,
  wrongQuestions,
} from "./progress.js";
import { renderQuiz } from "./quiz-engine.js";
import {
  escapeHtml,
  icon,
  initTheme,
  pctText,
  progressBar,
  renderBreadcrumb,
  renderNavStats,
  shuffled,
} from "./ui.js";

export async function initQuizbank() {
  initTheme();
  const data = await import("../data/quizbank/index.js");
  const questions = data.questions ?? [];
  const DOMAINS = data.DOMAINS ?? {};
  const domainLabels = Object.fromEntries(
    Object.entries(DOMAINS).map(([num, def]) => [num, def.label])
  );
  const questionById = new Map(questions.map((q) => [q.id, q]));

  const rootEl = document.getElementById("quizbank-root");
  renderNavStats(overallStats(loadState()));
  renderBreadcrumb([
    { label: "ホーム", href: "index.html" },
    { label: "CloudOps問題集" },
  ]);

  if (questions.length === 0) {
    rootEl.innerHTML = `
      <div class="console-container">
        <div class="console-body text-aws-sub">問題データはまだ準備中です。</div>
      </div>`;
    return;
  }

  // ---- セッション管理 ----
  function saveSession(session) {
    updateState((s) => {
      s.quizbank.session = session;
    });
  }

  function clearSession() {
    updateState((s) => {
      s.quizbank.session = null;
    });
  }

  function startSession(mode, { domain = null } = {}) {
    let ids = [];
    let label = "";
    const state = loadState();

    if (mode === "all") {
      ids = questions.map((q) => q.id);
      label = "全問順次";
    } else if (mode === "domain") {
      ids = questions.filter((q) => q.domain === domain).map((q) => q.id);
      label = `分野${domain}: ${domainLabels[domain] ?? ""}`;
    } else if (mode === "random10") {
      ids = shuffled(questions).slice(0, 10).map((q) => q.id);
      label = "ランダム10問";
    } else if (mode === "review") {
      ids = shuffled(wrongQuestions(state, questions)).map((q) => q.id);
      label = "復習(間違えた問題)";
    } else if (mode === "bookmark") {
      ids = bookmarkedQuestions(state, questions).map((q) => q.id);
      label = "ブックマーク";
    }

    if (ids.length === 0) {
      alert("このモードで出題できる問題がありません。");
      return;
    }

    const session = {
      mode,
      domain,
      label,
      questionIds: ids,
      answers: [],
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSession(session);
    runQuiz(session);
  }

  // ---- クイズ実行 ----
  function runQuiz(session) {
    const qs = session.questionIds
      .map((id) => questionById.get(id))
      .filter(Boolean);

    rootEl.innerHTML = "";
    const container = document.createElement("div");
    rootEl.appendChild(container);
    window.scrollTo({ top: 0 });

    renderQuiz(container, {
      questions: qs,
      title: `演習: ${session.label}`,
      domainLabels,
      bookmarkable: true,
      initial: { answers: session.answers },
      isBookmarked(qid) {
        return loadState().quizbank.history?.[qid]?.bookmarked === true;
      },
      onToggleBookmark(qid) {
        let next = false;
        updateState((s) => {
          const rec = s.quizbank.history[qid] ?? {
            attempts: 0,
            correct: 0,
            lastCorrect: null,
            bookmarked: false,
            lastAnsweredAt: null,
          };
          rec.bookmarked = !rec.bookmarked;
          next = rec.bookmarked;
          s.quizbank.history[qid] = rec;
        });
        return next;
      },
      onAnswer(question, selected, isCorrect) {
        updateState((s) => {
          const rec = s.quizbank.history[question.id] ?? {
            attempts: 0,
            correct: 0,
            lastCorrect: null,
            bookmarked: false,
            lastAnsweredAt: null,
          };
          rec.attempts += 1;
          if (isCorrect) rec.correct += 1;
          rec.lastCorrect = isCorrect;
          rec.lastAnsweredAt = new Date().toISOString();
          s.quizbank.history[question.id] = rec;
          recordStudyToday(s);
        });
      },
      onProgress(answers) {
        updateState((s) => {
          if (!s.quizbank.session) return;
          s.quizbank.session.answers = answers;
          s.quizbank.session.updatedAt = new Date().toISOString();
        });
      },
      onFinish() {
        clearSession();
        renderNavStats(overallStats(loadState()));
      },
      onExit() {
        renderModeSelect();
        window.scrollTo({ top: 0 });
      },
      exitLabel: "中断してモード選択へ",
      resultExitLabel: "モード選択に戻る",
    });
  }

  // ---- モード選択画面 ----
  function renderModeSelect() {
    const state = loadState();
    const prog = quizbankProgress(state, questions);
    const session = state.quizbank.session;
    const wrongCount = wrongQuestions(state, questions).length;
    const bookmarkCount = bookmarkedQuestions(state, questions).length;
    const domainRows = quizbankDomainStats(state, questions, DOMAINS);

    const resumeBanner = session
      ? `<div class="console-container mb-5 border-l-4 !border-l-aws-accent">
          <div class="console-body flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex-1">
              <p class="font-bold text-[14px]">中断中のセッションがあります</p>
              <p class="text-[12.5px] text-aws-sub mt-0.5">${escapeHtml(session.label)} — ${session.answers.length} / ${session.questionIds.length}問 解答済み</p>
            </div>
            <div class="flex gap-2">
              <button type="button" class="btn btn-primary btn-sm" data-mode="resume">再開する</button>
              <button type="button" class="btn btn-secondary btn-sm" data-mode="discard">破棄する</button>
            </div>
          </div>
        </div>`
      : "";

    const modeCard = (mode, title, desc, count, disabled = false) => `
      <button type="button" data-mode="${mode}" ${disabled ? "disabled" : ""}
        class="console-container text-left p-0 cursor-pointer transition-shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none">
        <span class="console-body block">
          <span class="flex items-center justify-between gap-2">
            <span class="font-bold text-[14.5px]">${title}</span>
            <span class="text-aws-sub">${icon("chevron-right", "w-4 h-4")}</span>
          </span>
          <span class="block text-[12.5px] text-aws-sub mt-1">${desc}</span>
          <span class="block text-[12px] text-aws-link font-bold mt-2">${count}</span>
        </span>
      </button>`;

    rootEl.innerHTML = `
      ${resumeBanner}
      <div class="console-container mb-5">
        <div class="console-header">
          <h2 class="console-title">学習状況</h2>
        </div>
        <div class="console-body">
          <div class="flex items-center justify-between text-[12.5px] text-aws-sub mb-1.5">
            <span>解答済み</span>
            <span><span class="font-bold text-aws-text">${prog.answered}</span> / ${prog.totalQuestions}問(${prog.percent}%) ・ 累計正答率 <span class="font-bold text-aws-text">${pctText(prog.accuracy)}</span></span>
          </div>
          ${progressBar(prog.percent, { done: prog.percent === 100 })}
          <div class="overflow-x-auto mt-4">
            <table class="stats-table">
              <thead><tr><th>分野</th><th class="text-right">問題数</th><th class="text-right">解答済み</th><th class="text-right">正答率</th></tr></thead>
              <tbody>
                ${domainRows
                  .map(
                    (row) => `
                  <tr>
                    <td class="min-w-[200px]">${row.domain}. ${escapeHtml(row.label)}</td>
                    <td class="text-right">${row.total}</td>
                    <td class="text-right">${row.answered}</td>
                    <td class="text-right font-bold">${pctText(row.accuracy)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2 class="text-[15px] font-bold mb-3">演習モードを選択</h2>
      <div class="grid gap-3 md:grid-cols-2 mb-5">
        ${modeCard("all", "全問順次", "全問題を収録順に解きます。中断してもあとから再開できます。", `全${questions.length}問`)}
        ${modeCard("random10", "ランダム10問", "全分野からランダムに10問を出題するミニテストです。", "10問")}
        ${modeCard("review", "復習モード", "前回間違えた問題だけを解き直します。", `${wrongCount}問`, wrongCount === 0)}
        ${modeCard("bookmark", "ブックマーク", "ブックマークを付けた問題だけを出題します。", `${bookmarkCount}問`, bookmarkCount === 0)}
      </div>

      <div class="console-container">
        <div class="console-header">
          <h2 class="console-title text-[14px]">分野別演習</h2>
          <p class="console-desc">SOA-C03の出題分野ごとに集中して演習します。</p>
        </div>
        <div>
          ${domainRows
            .map(
              (row) => `
            <button type="button" data-mode="domain" data-domain="${row.domain}"
              class="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 border-t border-aws-border-weak text-left cursor-pointer hover:bg-aws-bg transition-colors">
              <span class="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-aws-panel-2 border border-aws-border text-aws-orange text-[12.5px] font-bold tabular">${row.domain}</span>
              <span class="flex-1 min-w-0">
                <span class="block text-[13.5px] font-medium leading-snug">${escapeHtml(row.label)}</span>
                <span class="block text-[12px] text-aws-sub mt-0.5">${row.total}問 ・ 解答済み${row.answered} ・ 正答率${pctText(row.accuracy)}</span>
              </span>
              <span class="text-aws-sub shrink-0">${icon("chevron-right", "w-4 h-4")}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>`;

    rootEl.querySelectorAll("[data-mode]").forEach((el) => {
      el.addEventListener("click", () => {
        const mode = el.dataset.mode;
        if (mode === "resume") {
          const current = loadState().quizbank.session;
          if (current) runQuiz(current);
        } else if (mode === "discard") {
          if (confirm("中断中のセッションを破棄します。よろしいですか?(解答済みの履歴は残ります)")) {
            clearSession();
            renderModeSelect();
          }
        } else if (mode === "domain") {
          startSession("domain", { domain: Number(el.dataset.domain) });
        } else {
          startSession(mode);
        }
      });
    });
  }

  // ---- 初期表示(?resume=1 なら自動再開) ----
  const params = new URLSearchParams(location.search);
  const session = loadState().quizbank.session;
  if (params.get("resume") === "1" && session) {
    runQuiz(session);
  } else {
    renderModeSelect();
  }
}
