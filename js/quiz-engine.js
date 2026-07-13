// クイズエンジン(全ページ共通)
// 出題 → 解答 → 即時採点 → 解説 → 結果画面、という一連のUIと進行を担う。
// 進捗の記録・セッション保存はコールバック経由で呼び出し側が行う。

import { escapeHtml, icon, pctText, progressBar } from "./ui.js";
import { DIFFICULTY_LABELS } from "./config.js";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function sameAnswer(selected, answerIndexes) {
  if (selected.length !== answerIndexes.length) return false;
  const a = [...selected].sort((x, y) => x - y);
  const b = [...answerIndexes].sort((x, y) => x - y);
  return a.every((v, i) => v === b[i]);
}

function answerLetters(indexes) {
  return [...indexes]
    .sort((x, y) => x - y)
    .map((i) => LETTERS[i] ?? "?")
    .join(", ");
}

// container 内にクイズUIを描画する。
// opts:
//   questions        出題する問題の配列(出題順そのまま)
//   title            ヘッダータイトル
//   domainLabels     {分野番号: ラベル} 結果画面の分野別集計に使う(null可)
//   passThreshold    合格ライン(0〜1)。指定時は結果画面で達成判定を表示
//   bookmarkable     ブックマークトグルを表示するか
//   isBookmarked(id) / onToggleBookmark(id) => 新しい状態
//   initial          { answers: [{id, selected, correct}] } 中断からの再開用
//   onAnswer(question, selectedIndexes, isCorrect)  解答確定ごと
//   onProgress(answers)  解答確定ごと(セッション保存用)
//   onFinish(result)     全問解答時
//   onRetry()            結果画面「もう一度挑戦」(null なら非表示)
//   onExit()             中断・戻る(null なら非表示)
//   exitLabel / resultExitLabel
export function renderQuiz(container, opts) {
  const questions = opts.questions ?? [];
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const answers = (opts.initial?.answers ?? []).filter((a) =>
    questionById.has(a.id)
  );
  let index = Math.min(answers.length, questions.length);
  let phase = index >= questions.length ? "result" : "question";
  let selectedSet = new Set();
  let finished = phase === "result";

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="console-container">
        <div class="console-body text-aws-sub">出題できる問題がありません。</div>
      </div>`;
    return;
  }

  function buildResult() {
    let correctCount = 0;
    const byDomain = {};
    for (const a of answers) {
      const q = questionById.get(a.id);
      if (!q) continue;
      const d = q.domain ?? 0;
      byDomain[d] ??= { total: 0, correct: 0 };
      byDomain[d].total += 1;
      if (a.correct) {
        byDomain[d].correct += 1;
        correctCount += 1;
      }
    }
    return { total: questions.length, correctCount, answers: [...answers], byDomain };
  }

  function metaBadges(q) {
    const badges = [];
    if (opts.domainLabels && q.domain != null && opts.domainLabels[q.domain]) {
      badges.push(
        `<span class="badge badge-blue badge-wrap">分野${q.domain}: ${escapeHtml(
          opts.domainLabels[q.domain]
        )}</span>`
      );
    }
    if (q.topic) {
      badges.push(`<span class="badge badge-gray">${escapeHtml(q.topic)}</span>`);
    }
    if (q.difficulty && DIFFICULTY_LABELS[q.difficulty]) {
      badges.push(
        `<span class="badge badge-orange">${DIFFICULTY_LABELS[q.difficulty]}</span>`
      );
    }
    if (q.type === "multiple") {
      badges.push(
        `<span class="badge badge-red">${q.answerIndexes.length}つ選択</span>`
      );
    }
    return badges.join("");
  }

  function bookmarkButton(q) {
    if (!opts.bookmarkable) return "";
    const active = opts.isBookmarked?.(q.id) ?? false;
    return `
      <button type="button" data-action="bookmark"
        class="inline-flex items-center gap-1 px-2 py-2 rounded-sm text-[12.5px] font-bold cursor-pointer transition-colors ${
          active ? "text-aws-orange" : "text-aws-sub hover:text-aws-orange"
        }"
        aria-pressed="${active}" title="ブックマーク">
        ${icon(active ? "bookmark-fill" : "bookmark", "w-[18px] h-[18px]")}
        <span class="hidden sm:inline">${active ? "登録済み" : "ブックマーク"}</span>
      </button>`;
  }

  function renderQuestionView() {
    const q = questions[index];
    const answered = phase === "feedback";
    const answer = answered ? answers[answers.length - 1] : null;
    const isMultiple = q.type === "multiple";

    const choicesHtml = q.choices
      .map((choice, i) => {
        let cls = "choice-btn";
        let mark = `<span class="choice-letter">${LETTERS[i]}</span>`;
        if (!answered && isMultiple && selectedSet.has(i)) {
          cls += " choice-selected";
        }
        if (answered) {
          const isAnswer = q.answerIndexes.includes(i);
          const isSelected = answer.selected.includes(i);
          if (isAnswer) {
            cls += " choice-correct";
            mark = `<span class="choice-letter" style="background:var(--color-aws-success);border-color:var(--color-aws-success);color:#fff">${LETTERS[i]}</span>`;
          } else if (isSelected) {
            cls += " choice-wrong";
            mark = `<span class="choice-letter" style="background:var(--color-aws-error);border-color:var(--color-aws-error);color:#fff">${LETTERS[i]}</span>`;
          } else {
            cls += " choice-muted";
          }
        }
        return `
          <button type="button" class="${cls}" data-action="choice" data-index="${i}" ${
          answered ? "disabled" : ""
        }>
            ${mark}
            <span class="flex-1">${escapeHtml(choice)}</span>
          </button>`;
      })
      .join("");

    const submitArea =
      !answered && isMultiple
        ? `<div class="mt-4">
            <button type="button" class="btn btn-primary w-full sm:w-auto" data-action="submit" ${
              selectedSet.size === q.answerIndexes.length ? "" : "disabled"
            }>解答する</button>
            <p class="mt-2 text-[12.5px] text-aws-sub">選択肢を${q.answerIndexes.length}つ選ぶと解答できます(現在 ${selectedSet.size}/${q.answerIndexes.length})</p>
          </div>`
        : "";

    let feedbackHtml = "";
    if (answered) {
      const flash = answer.correct
        ? `<div class="flashbar flashbar-success" role="status">
            ${icon("check-circle", "w-5 h-5")}
            <div><span class="font-bold">正解です。</span></div>
          </div>`
        : `<div class="flashbar flashbar-error" role="status">
            ${icon("x-circle", "w-5 h-5")}
            <div><span class="font-bold">不正解です。</span> 正解は <span class="font-bold">${answerLetters(
              q.answerIndexes
            )}</span> です。</div>
          </div>`;
      const referenceHtml = q.reference
        ? `<p class="mt-3 text-[12.5px]">
            <a href="${escapeHtml(q.reference)}" target="_blank" rel="noopener noreferrer" class="link inline-flex items-center gap-1">
              ${icon("external", "w-3.5 h-3.5")}AWSドキュメントを参照
            </a>
          </p>`
        : "";
      feedbackHtml = `
        <div class="mt-4 space-y-4">
          ${flash}
          <div class="console-container">
            <div class="console-header"><h3 class="console-title text-[14px]">解説</h3></div>
            <div class="console-body">
              <p class="whitespace-pre-line leading-relaxed">${escapeHtml(q.explanation ?? "")}</p>
              ${referenceHtml}
            </div>
          </div>
          <div class="flex justify-end">
            <button type="button" class="btn btn-primary w-full sm:w-auto" data-action="next">
              ${index === questions.length - 1 ? "結果を見る" : "次の問題へ"}
              ${icon("chevron-right", "w-4 h-4")}
            </button>
          </div>
        </div>`;
    }

    const exitBtn = opts.onExit
      ? `<button type="button" class="btn btn-secondary btn-sm" data-action="exit">${escapeHtml(
          opts.exitLabel ?? "中断して戻る"
        )}</button>`
      : "";

    container.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-3 mb-3">
          <h2 class="text-[15px] font-bold truncate">${escapeHtml(opts.title ?? "確認問題")}</h2>
          ${exitBtn}
        </div>
        <div class="mb-4">
          <div class="flex items-center justify-between text-[12.5px] text-aws-sub mb-1.5">
            <span>問題 <span class="font-bold text-aws-text">${index + 1}</span> / ${questions.length}</span>
            <span>正解 ${answers.filter((a) => a.correct).length} / 解答済み ${answers.length}</span>
          </div>
          ${progressBar((answers.length / questions.length) * 100)}
        </div>
        <div class="console-container">
          <div class="console-header">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-wrap gap-1.5">${metaBadges(q)}</div>
              ${bookmarkButton(q)}
            </div>
          </div>
          <div class="console-body">
            <p class="font-medium leading-relaxed whitespace-pre-line mb-4">${escapeHtml(q.question)}</p>
            <div class="space-y-2.5" role="group" aria-label="選択肢">
              ${choicesHtml}
            </div>
            ${submitArea}
          </div>
        </div>
        ${feedbackHtml}
      </div>`;

    if (answered) {
      const next = container.querySelector('[data-action="next"]');
      if (next) next.focus({ preventScroll: true });
    }
  }

  function renderResultView() {
    const result = buildResult();
    const ratio = result.total > 0 ? result.correctCount / result.total : 0;
    const passed =
      opts.passThreshold != null ? ratio >= opts.passThreshold : null;

    const passFlash =
      passed === null
        ? ""
        : passed
          ? `<div class="flashbar flashbar-success mb-4">
              ${icon("check-circle", "w-5 h-5")}
              <div><span class="font-bold">お疲れさまでした。</span> 正答率${Math.round(
                opts.passThreshold * 100
              )}%以上を達成したため、この章は<span class="font-bold">完了</span>になりました。</div>
            </div>`
          : `<div class="flashbar flashbar-info mb-4">
              ${icon("info", "w-5 h-5")}
              <div>章完了には正答率<span class="font-bold">${Math.round(
                opts.passThreshold * 100
              )}%以上</span>が必要です。解説を確認してもう一度挑戦しましょう。</div>
            </div>`;

    const domainEntries = Object.entries(result.byDomain);
    const domainTable =
      opts.domainLabels && domainEntries.length > 1
        ? `<div class="console-container mb-4">
            <div class="console-header"><h3 class="console-title text-[14px]">分野別の結果</h3></div>
            <div class="console-body overflow-x-auto">
              <table class="stats-table">
                <thead><tr><th>分野</th><th class="text-right">正解</th><th style="width:40%">正答率</th></tr></thead>
                <tbody>
                  ${domainEntries
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([d, v]) => {
                      const r = v.total > 0 ? v.correct / v.total : 0;
                      return `<tr>
                        <td>${escapeHtml(opts.domainLabels[d] ?? `分野${d}`)}</td>
                        <td class="text-right whitespace-nowrap">${v.correct} / ${v.total}</td>
                        <td><div class="flex items-center gap-2">${progressBar(r * 100, {
                          done: r >= 0.8,
                          extraClass: "flex-1",
                        })}<span class="text-[12px] text-aws-sub w-10 text-right">${pctText(r)}</span></div></td>
                      </tr>`;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>`
        : "";

    const wrong = result.answers.filter((a) => !a.correct);
    const wrongList =
      wrong.length > 0
        ? `<div class="console-container mb-4">
            <div class="console-header">
              <h3 class="console-title text-[14px]">間違えた問題(${wrong.length}問)</h3>
              <p class="console-desc">タップすると解説を再表示します。</p>
            </div>
            <div>
              ${wrong
                .map((a) => {
                  const q = questionById.get(a.id);
                  if (!q) return "";
                  const num = questions.indexOf(q) + 1;
                  return `
                  <details class="border-t border-aws-border-weak group">
                    <summary class="flex items-start gap-2.5 px-4 sm:px-5 py-3.5 cursor-pointer hover:bg-aws-bg list-none">
                      <span class="text-aws-error mt-0.5 shrink-0">${icon("x-circle", "w-4 h-4")}</span>
                      <span class="flex-1 text-[13.5px]">
                        <span class="font-bold mr-1.5">Q${num}.</span>${escapeHtml(
                          q.question.length > 80 ? q.question.slice(0, 80) + "…" : q.question
                        )}
                      </span>
                      <span class="text-aws-sub mt-0.5 shrink-0 transition-transform group-open:rotate-90">${icon(
                        "chevron-right",
                        "w-4 h-4"
                      )}</span>
                    </summary>
                    <div class="px-4 sm:px-5 pb-4 pt-1 text-[13.5px] space-y-3 bg-aws-panel-2">
                      <p class="whitespace-pre-line">${escapeHtml(q.question)}</p>
                      <ul class="space-y-1.5">
                        ${q.choices
                          .map((c, i) => {
                            const isAns = q.answerIndexes.includes(i);
                            const isSel = a.selected.includes(i);
                            const color = isAns
                              ? "text-aws-success font-bold"
                              : isSel
                                ? "text-aws-error"
                                : "text-aws-sub";
                            const mark = isAns ? "✓" : isSel ? "✗" : "・";
                            return `<li class="${color}">${mark} ${LETTERS[i]}. ${escapeHtml(c)}</li>`;
                          })
                          .join("")}
                      </ul>
                      <div class="callout callout-note !my-0">
                        <span class="callout-title">解説</span>
                        <p class="whitespace-pre-line !m-0">${escapeHtml(q.explanation ?? "")}</p>
                        ${
                          q.reference
                            ? `<p class="!mb-0 !mt-2"><a class="link text-[12.5px]" target="_blank" rel="noopener noreferrer" href="${escapeHtml(
                                q.reference
                              )}">AWSドキュメントを参照</a></p>`
                            : ""
                        }
                      </div>
                    </div>
                  </details>`;
                })
                .join("")}
            </div>
          </div>`
        : "";

    const retryBtn = opts.onRetry
      ? `<button type="button" class="btn btn-primary" data-action="retry">${icon(
          "refresh",
          "w-4 h-4"
        )}もう一度挑戦</button>`
      : "";
    const exitBtn = opts.onExit
      ? `<button type="button" class="btn btn-secondary" data-action="exit">${escapeHtml(
          opts.resultExitLabel ?? "一覧に戻る"
        )}</button>`
      : "";

    container.innerHTML = `
      <div>
        ${passFlash}
        <div class="console-container mb-4">
          <div class="console-header"><h3 class="console-title">結果</h3></div>
          <div class="console-body">
            <div class="flex items-end gap-3 flex-wrap">
              <div class="text-[40px] leading-none font-bold ${
                passed === false ? "text-aws-error" : "text-aws-success"
              }">${pctText(ratio)}</div>
              <div class="text-aws-sub pb-1">${result.correctCount} / ${result.total} 問正解</div>
            </div>
            <div class="mt-4">${progressBar(ratio * 100, { done: passed !== false })}</div>
          </div>
        </div>
        ${domainTable}
        ${wrongList}
        <div class="flex flex-col sm:flex-row gap-2.5 sm:justify-end">${exitBtn}${retryBtn}</div>
      </div>`;
  }

  function render() {
    if (phase === "result") {
      renderResultView();
    } else {
      renderQuestionView();
    }
  }

  function commitAnswer(selectedIndexes) {
    const q = questions[index];
    const correct = sameAnswer(selectedIndexes, q.answerIndexes);
    answers.push({ id: q.id, selected: [...selectedIndexes].sort((a, b) => a - b), correct });
    phase = "feedback";
    opts.onAnswer?.(q, selectedIndexes, correct);
    opts.onProgress?.([...answers]);
    render();
  }

  function handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target || !container.contains(target)) return;
    const action = target.dataset.action;
    const q = questions[index];

    if (action === "choice" && phase === "question") {
      const i = Number(target.dataset.index);
      if (q.type === "multiple") {
        if (selectedSet.has(i)) {
          selectedSet.delete(i);
        } else if (selectedSet.size < q.answerIndexes.length) {
          selectedSet.add(i);
        }
        render();
      } else {
        commitAnswer([i]);
      }
    } else if (action === "submit" && phase === "question") {
      if (selectedSet.size === q.answerIndexes.length) {
        commitAnswer([...selectedSet]);
      }
    } else if (action === "next" && phase === "feedback") {
      index += 1;
      selectedSet = new Set();
      if (index >= questions.length) {
        phase = "result";
        if (!finished) {
          finished = true;
          opts.onFinish?.(buildResult());
        }
      } else {
        phase = "question";
      }
      render();
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action === "bookmark") {
      const newState = opts.onToggleBookmark?.(q.id);
      if (newState !== undefined) render();
    } else if (action === "retry") {
      opts.onRetry?.();
    } else if (action === "exit") {
      opts.onExit?.();
    }
  }

  container.removeEventListener("click", container._quizHandler ?? (() => {}));
  container._quizHandler = handleClick;
  container.addEventListener("click", handleClick);

  if (finished && answers.length >= questions.length) {
    // 再開時にすでに全問解答済みだった場合も結果を確定させる
    opts.onFinish?.(buildResult());
  }
  render();
}
