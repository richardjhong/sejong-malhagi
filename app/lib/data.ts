export interface Example {
  word: string;
  pronunciation: string;
  meaning: string;
  rule: string;
  wordStatus?: "correct" | "incorrect" | "unanswered";
}

export const getNasalizationExamples = async (): Promise<Example[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return [
    {
      word: "학년",
      pronunciation: "항년",
      meaning: "Grade (in school)",
      rule: "ㄱ + ㄴ → ㅇ + ㄴ",
    },
    {
      word: "법률",
      pronunciation: "범뉼",
      meaning: "Law",
      rule: "ㅂ + ㄴ → ㅁ + ㄴ",
    },
    {
      word: "입력",
      pronunciation: "임녁",
      meaning: "Input",
      rule: "ㅂ + ㄹ → ㅁ + ㄴ",
    },
  ];
};

export const getLiquidizationExamples = async (): Promise<Example[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return [
    {
      word: "신라",
      pronunciation: "실라",
      meaning: "Silla (ancient Korean kingdom)",
      rule: "ㄴ + ㄹ → ㄹ + ㄹ",
    },
    {
      word: "설날",
      pronunciation: "설랄",
      meaning: "New Year's Day",
      rule: "ㄹ + ㄴ → ㄹ + ㄹ",
    },
    {
      word: "한라산",
      pronunciation: "할라산",
      meaning: "Mount Halla",
      rule: "ㄴ + ㄹ → ㄹ + ㄹ",
    },
    {
      word: "칼날",
      pronunciation: "칼랄",
      meaning: "Blade edge",
      rule: "ㄹ + ㄴ → ㄹ + ㄹ",
    },
    {
      word: "일년",
      pronunciation: "일련",
      meaning: "One year",
      rule: "ㄹ + ㄴ → ㄹ + ㄹ",
    },
  ];
};
