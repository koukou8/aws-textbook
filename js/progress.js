// 進捗計算ロジック。state(localStorage)とコンテンツデータから
// ダッシュボードや各ページに表示する数値を導出する。

// 教材の進捗: 完了章数ベース + 章末確認問題の累計正答率
export function materialProgress(state, materialId, chapters) {
  const m = state.materials[materialId] ?? {
    completedChapters: [],
    lastChapterId: null,
    checkResults: {},
  };
  const chapterIds = new Set(chapters.map((c) => c.id));
  const completed = (m.completedChapters ?? []).filter((id) =>
    chapterIds.has(id)
  );

  let sumCorrect = 0;
  let sumTotal = 0;
  for (const [chapterId, result] of Object.entries(m.checkResults ?? {})) {
    if (!chapterIds.has(chapterId) || !result) continue;
    sumCorrect += result.sumCorrect ?? 0;
    sumTotal += result.sumTotal ?? 0;
  }

  return {
    totalChapters: chapters.length,
    completedCount: completed.length,
    percent:
      chapters.length > 0
        ? Math.round((completed.length / chapters.length) * 100)
        : 0,
    accuracy: sumTotal > 0 ? sumCorrect / sumTotal : null,
    answeredTotal: sumTotal,
    lastChapterId: chapterIds.has(m.lastChapterId) ? m.lastChapterId : null,
  };
}

// 問題集の進捗: 一度でも解答した問題数ベース + 累計正答率
export function quizbankProgress(state, questions) {
  const history = state.quizbank.history ?? {};
  let answered = 0;
  let attempts = 0;
  let correct = 0;
  for (const q of questions) {
    const rec = history[q.id];
    if (rec && rec.attempts > 0) {
      answered += 1;
      attempts += rec.attempts;
      correct += rec.correct ?? 0;
    }
  }
  return {
    totalQuestions: questions.length,
    answered,
    percent:
      questions.length > 0
        ? Math.round((answered / questions.length) * 100)
        : 0,
    attempts,
    correct,
    accuracy: attempts > 0 ? correct / attempts : null,
    hasSession: Boolean(state.quizbank.session),
  };
}

// 問題集の分野別統計
export function quizbankDomainStats(state, questions, domains) {
  const history = state.quizbank.history ?? {};
  const rows = [];
  for (const [num, def] of Object.entries(domains)) {
    const domainNumber = Number(num);
    const inDomain = questions.filter((q) => q.domain === domainNumber);
    let answered = 0;
    let attempts = 0;
    let correct = 0;
    for (const q of inDomain) {
      const rec = history[q.id];
      if (rec && rec.attempts > 0) {
        answered += 1;
        attempts += rec.attempts;
        correct += rec.correct ?? 0;
      }
    }
    rows.push({
      domain: domainNumber,
      label: def.label,
      total: inDomain.length,
      answered,
      accuracy: attempts > 0 ? correct / attempts : null,
    });
  }
  return rows;
}

// 全体サマリー(総回答数・全体正答率・学習日数)。教材+問題集の延べ回答を合算する。
export function overallStats(state) {
  let total = 0;
  let correct = 0;
  for (const material of Object.values(state.materials ?? {})) {
    for (const result of Object.values(material.checkResults ?? {})) {
      total += result?.sumTotal ?? 0;
      correct += result?.sumCorrect ?? 0;
    }
  }
  for (const rec of Object.values(state.quizbank?.history ?? {})) {
    total += rec?.attempts ?? 0;
    correct += rec?.correct ?? 0;
  }
  return {
    totalAnswered: total,
    totalCorrect: correct,
    accuracy: total > 0 ? correct / total : null,
    studyDays: (state.stats?.studyDates ?? []).length,
  };
}

// 復習モード対象: 最後の解答が不正解だった問題
export function wrongQuestions(state, questions) {
  const history = state.quizbank.history ?? {};
  return questions.filter((q) => history[q.id]?.lastCorrect === false);
}

// ブックマーク済みの問題
export function bookmarkedQuestions(state, questions) {
  const history = state.quizbank.history ?? {};
  return questions.filter((q) => history[q.id]?.bookmarked === true);
}
