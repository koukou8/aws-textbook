// ダッシュボード(index.html)
// 教材・問題集カード表示・特設ページ一覧・全体サマリー・進捗の管理(リセット / エクスポート / インポート)を担う。

import { MATERIALS, QUIZBANKS } from "./config.js";
import { topicIds } from "../data/topics/index.js";
import {
  exportStateJSON,
  importStateJSON,
  loadState,
  resetAll,
  resetMaterial,
  resetQuizbank,
  todayString,
} from "./storage.js";
import {
  materialProgress,
  overallStats,
  quizbankProgress,
} from "./progress.js";
import {
  downloadText,
  escapeHtml,
  icon,
  initTheme,
  pctText,
  progressBar,
  renderNavStats,
} from "./ui.js";

const CARD_ICONS = {
  basics: "book",
  saa: "layers",
  cloudops: "gear",
  aif: "target",
  quizbank: "clipboard",
  aifbank: "clipboard",
};

export async function initDashboard() {
  initTheme();
  const materialIds = Object.keys(MATERIALS);
  const bankIds = Object.keys(QUIZBANKS);
  const [materialModules, bankModules] = await Promise.all([
    Promise.all(materialIds.map((id) => import(`../data/${id}/index.js`))),
    Promise.all(
      bankIds.map((id) => import(`../data/${QUIZBANKS[id].dataDir}/index.js`))
    ),
  ]);
  const materialsData = Object.fromEntries(
    materialIds.map((id, i) => [id, materialModules[i]])
  );
  const banksData = Object.fromEntries(
    bankIds.map((id, i) => [id, bankModules[i]])
  );

  const summaryEl = document.getElementById("overall-summary");
  const cardsEl = document.getElementById("material-cards");
  const specialEl = document.getElementById("special-pages");
  const manageEl = document.getElementById("data-management");

  function materialCardHtml(materialId) {
    const meta = MATERIALS[materialId];
    const chapters = materialsData[materialId].chapters ?? [];
    const prog = materialProgress(loadState(), materialId, chapters);
    const resumeHref = prog.lastChapterId
      ? `${meta.page}#${prog.lastChapterId}`
      : meta.page;
    const started = prog.lastChapterId !== null || prog.answeredTotal > 0;
    return `
      <div class="console-container flex flex-col">
        <div class="console-header">
          <div class="flex items-start gap-3">
            <span class="icon-chip mt-0.5">
              ${icon(CARD_ICONS[materialId], "w-5 h-5")}
            </span>
            <div class="min-w-0">
              <h3 class="console-title">${escapeHtml(meta.title)}</h3>
              <p class="console-desc">${escapeHtml(meta.description)}</p>
            </div>
          </div>
        </div>
        <div class="console-body flex flex-col flex-1">
          <div class="flex items-center justify-between text-[12.5px] text-aws-sub mb-1.5">
            <span>進捗(完了章数)</span>
            <span><span class="font-bold text-aws-text">${prog.completedCount}</span> / ${prog.totalChapters}章(${prog.percent}%)</span>
          </div>
          ${progressBar(prog.percent, { done: prog.percent === 100 })}
          <div class="flex items-center justify-between text-[12.5px] text-aws-sub mt-3">
            <span>確認問題の累計正答率</span>
            <span class="font-bold text-aws-text">${pctText(prog.accuracy)}</span>
          </div>
          <div class="mt-4 pt-1 mt-auto">
            <a href="${resumeHref}" class="btn btn-primary w-full">
              ${started ? "続きから学習する" : "学習をはじめる"}
              ${icon("chevron-right", "w-4 h-4")}
            </a>
          </div>
        </div>
      </div>`;
  }

  function quizbankCardHtml(bankId) {
    const meta = QUIZBANKS[bankId];
    const questions = banksData[bankId].questions ?? [];
    const prog = quizbankProgress(loadState(), questions, bankId);
    const resumeHref = prog.hasSession ? `${meta.page}?resume=1` : meta.page;
    return `
      <div class="console-container flex flex-col">
        <div class="console-header">
          <div class="flex items-start gap-3">
            <span class="icon-chip mt-0.5">
              ${icon(CARD_ICONS[bankId], "w-5 h-5")}
            </span>
            <div class="min-w-0">
              <h3 class="console-title">${escapeHtml(meta.title)}</h3>
              <p class="console-desc">${escapeHtml(meta.description)}</p>
            </div>
          </div>
        </div>
        <div class="console-body flex flex-col flex-1">
          <div class="flex items-center justify-between text-[12.5px] text-aws-sub mb-1.5">
            <span>進捗(解答済み問題数)</span>
            <span><span class="font-bold text-aws-text">${prog.answered}</span> / ${prog.totalQuestions}問(${prog.percent}%)</span>
          </div>
          ${progressBar(prog.percent, { done: prog.percent === 100 })}
          <div class="flex items-center justify-between text-[12.5px] text-aws-sub mt-3">
            <span>演習の累計正答率</span>
            <span class="font-bold text-aws-text">${pctText(prog.accuracy)}</span>
          </div>
          <div class="mt-4 pt-1 mt-auto">
            <a href="${resumeHref}" class="btn btn-primary w-full">
              ${
                prog.hasSession
                  ? "中断中のセッションを再開する"
                  : prog.answered > 0
                    ? "続きから演習する"
                    : "演習をはじめる"
              }
              ${icon("chevron-right", "w-4 h-4")}
            </a>
          </div>
        </div>
      </div>`;
  }

  // 特設ページ(問題演習でつまずいたトピックの解説ページ)一覧
  async function renderSpecialPages() {
    if (!specialEl) return;
    if (topicIds.length === 0) {
      specialEl.innerHTML = "";
      specialEl.classList.add("hidden");
      return;
    }
    const modules = await Promise.all(
      topicIds.map((id) => import(`../data/topics/${id}.js`).catch(() => null))
    );
    const topics = modules
      .map((m) => m?.topic)
      .filter((t) => t && t.id && t.title);
    if (topics.length === 0) {
      specialEl.innerHTML = "";
      specialEl.classList.add("hidden");
      return;
    }

    const rows = topics
      .map((t) => {
        const badges = [
          t.exam
            ? `<span class="badge badge-blue badge-wrap">${escapeHtml(t.exam)}</span>`
            : "",
          ...(t.services ?? [])
            .slice(0, 3)
            .map((s) => `<span class="badge badge-gray">${escapeHtml(s)}</span>`),
        ]
          .filter(Boolean)
          .join("");
        return `
          <a href="topic.html?id=${encodeURIComponent(t.id)}" class="flex items-center gap-3 px-5 py-3.5 hover:bg-aws-panel-2 transition-colors">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <span class="font-bold text-[14px] leading-snug">${escapeHtml(t.title)}</span>
                ${badges}
              </div>
              <p class="text-[12.5px] text-aws-sub leading-relaxed">${escapeHtml(t.description ?? "")}</p>
            </div>
            <span class="shrink-0 text-aws-sub">${icon("chevron-right", "w-4 h-4")}</span>
          </a>`;
      })
      .join("");

    specialEl.classList.remove("hidden");
    specialEl.innerHTML = `
      <div class="console-container">
        <div class="console-header">
          <div class="flex items-start gap-3">
            <span class="icon-chip mt-0.5">${icon("bookmark", "w-5 h-5")}</span>
            <div class="min-w-0">
              <h3 class="console-title">特設ページ</h3>
              <p class="console-desc">問題演習でつまずいたトピックを深掘りする解説ページです。全${topics.length}ページ。</p>
            </div>
          </div>
        </div>
        <div class="divide-y divide-aws-border-weak">${rows}</div>
      </div>`;
  }

  function renderSummary() {
    const stats = overallStats(loadState());
    renderNavStats(stats);
    summaryEl.innerHTML = `
      <div class="console-container">
        <div class="console-body !py-4">
          <div class="grid grid-cols-3 divide-x divide-aws-border-weak">
            <div class="px-2 text-center">
              <p class="text-[11.5px] sm:text-[12.5px] text-aws-sub mb-0.5">総回答数</p>
              <p class="text-[22px] sm:text-[26px] font-bold leading-tight">${stats.totalAnswered}<span class="text-[12px] font-normal text-aws-sub ml-0.5">問</span></p>
            </div>
            <div class="px-2 text-center">
              <p class="text-[11.5px] sm:text-[12.5px] text-aws-sub mb-0.5">全体正答率</p>
              <p class="text-[22px] sm:text-[26px] font-bold leading-tight ${
                stats.accuracy !== null && stats.accuracy >= 0.8
                  ? "text-aws-success"
                  : ""
              }">${pctText(stats.accuracy)}</p>
            </div>
            <div class="px-2 text-center">
              <p class="text-[11.5px] sm:text-[12.5px] text-aws-sub mb-0.5">学習した日数</p>
              <p class="text-[22px] sm:text-[26px] font-bold leading-tight">${stats.studyDays}<span class="text-[12px] font-normal text-aws-sub ml-0.5">日</span></p>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCards() {
    cardsEl.innerHTML =
      materialIds.map(materialCardHtml).join("") +
      bankIds.map(quizbankCardHtml).join("");
  }

  function renderManagement() {
    manageEl.innerHTML = `
      <div class="console-container">
        <div class="console-header">
          <h3 class="console-title">学習データの管理</h3>
          <p class="console-desc">進捗はこのブラウザのlocalStorageに保存されています。端末の移行にはエクスポート / インポートを使ってください。</p>
        </div>
        <div class="console-body space-y-5">
          <div>
            <p class="text-[13px] font-bold mb-2">バックアップ</p>
            <div class="flex flex-col sm:flex-row gap-2.5">
              <button type="button" class="btn btn-secondary" data-manage="export">
                ${icon("download", "w-4 h-4")}進捗をエクスポート(JSON)
              </button>
              <button type="button" class="btn btn-secondary" data-manage="import">
                ${icon("upload", "w-4 h-4")}進捗をインポート
              </button>
              <input type="file" id="import-file" accept="application/json,.json" class="hidden">
            </div>
          </div>
          <div>
            <p class="text-[13px] font-bold mb-2">進捗のリセット</p>
            <div class="flex flex-wrap gap-2.5">
              ${materialIds
                .map(
                  (id) =>
                    `<button type="button" class="btn btn-secondary btn-sm" data-manage="reset-material" data-material="${id}">${escapeHtml(
                      MATERIALS[id].title
                    )}をリセット</button>`
                )
                .join("")}
              ${bankIds
                .map(
                  (id) =>
                    `<button type="button" class="btn btn-secondary btn-sm" data-manage="reset-quizbank" data-bank="${id}">${escapeHtml(
                      QUIZBANKS[id].title
                    )}をリセット</button>`
                )
                .join("")}
              <button type="button" class="btn btn-danger btn-sm" data-manage="reset-all">
                ${icon("trash", "w-4 h-4")}すべての進捗をリセット
              </button>
            </div>
          </div>
        </div>
      </div>`;

    const fileInput = manageEl.querySelector("#import-file");
    manageEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-manage]");
      if (!btn) return;
      const action = btn.dataset.manage;

      if (action === "export") {
        downloadText(
          `aws-textbook-progress-${todayString()}.json`,
          exportStateJSON()
        );
      } else if (action === "import") {
        fileInput.click();
      } else if (action === "reset-material") {
        const id = btn.dataset.material;
        if (
          confirm(
            `「${MATERIALS[id].title}」の進捗(完了章・確認問題の記録)をリセットします。よろしいですか?`
          )
        ) {
          resetMaterial(id);
          rerender();
        }
      } else if (action === "reset-quizbank") {
        const bankId = btn.dataset.bank;
        if (
          confirm(
            `「${QUIZBANKS[bankId].title}」の進捗(解答履歴・ブックマーク・中断中セッション)をリセットします。よろしいですか?`
          )
        ) {
          resetQuizbank(bankId);
          rerender();
        }
      } else if (action === "reset-all") {
        if (
          confirm(
            "すべての学習データ(全教材の進捗・問題集の履歴・学習日数)をリセットします。この操作は取り消せません。よろしいですか?"
          )
        ) {
          resetAll();
          rerender();
        }
      }
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (
          !confirm(
            "現在の進捗をインポートしたデータで上書きします。よろしいですか?"
          )
        ) {
          fileInput.value = "";
          return;
        }
        const result = importStateJSON(String(reader.result));
        if (result.ok) {
          alert("進捗をインポートしました。");
          rerender();
        } else {
          alert(`インポートに失敗しました: ${result.error}`);
        }
        fileInput.value = "";
      };
      reader.readAsText(file);
    });
  }

  function rerender() {
    renderSummary();
    renderCards();
  }

  renderSummary();
  renderCards();
  renderSpecialPages();
  renderManagement();
}
