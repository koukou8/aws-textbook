// アプリ全体の定数定義

// 章末確認問題で「章完了」と見なす正答率のしきい値
export const PASS_THRESHOLD = 0.8;

// 教材のメタ情報
export const MATERIALS = {
  basics: {
    id: "basics",
    title: "AWS基礎",
    description: "初学者〜中級者向けに主要サービスを体系的に解説する教材です。",
    page: "basics.html",
  },
  saa: {
    id: "saa",
    title: "SAA対策教材",
    description:
      "AWS Certified Solutions Architect – Associate (SAA-C03) の4分野を解説する教材です。",
    page: "saa.html",
  },
  cloudops: {
    id: "cloudops",
    title: "CloudOps対策教材",
    description:
      "AWS Certified CloudOps Engineer – Associate (SOA-C03) の5分野を運用視点で解説する教材です。",
    page: "cloudops.html",
  },
};

export const QUIZBANK_META = {
  id: "quizbank",
  title: "CloudOps問題集",
  description: "SOA-C03 の本試験を想定したシナリオベースの演習問題集です。",
  page: "quiz.html",
};

export const DIFFICULTY_LABELS = {
  easy: "基礎",
  medium: "標準",
  hard: "応用",
};
