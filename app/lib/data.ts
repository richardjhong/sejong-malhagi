export interface Example {
  word: string;
  pronunciation: string;
  meaning: string;
  rule: string;
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
