import React from "react";
import PronunciationTable from "./PronunciationTable";

const NasalizationRules = () => {
  const plosiveNasalizationData = [
    {
      firstConsonant: "ㄱ, ㄲ, ㅋ, ㄳ, ㄺ",
      followingSound: "ㄴ, ㅁ",
      result: "ㅇ",
      example: "학년 → 항년",
    },
    {
      firstConsonant: "ㄷ, ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ",
      followingSound: "ㄴ, ㅁ",
      result: "ㄴ",
      example: "걷는 → 건는",
    },
    {
      firstConsonant: "ㅂ, ㅍ, ㄼ, ㄿ, ㄽ",
      followingSound: "ㄴ, ㅁ",
      result: "ㅁ",
      example: "읍내 → 음내",
    },
  ];

  const liquidNasalizationData = [
    {
      firstConsonant: "ㅁ, ㅇ",
      followingSound: "ㄹ",
      result: "ㄴ",
      example: "담력 → 담녁",
    },
    {
      firstConsonant: "ㄱ, ㄷ, ㅂ",
      followingSound: "ㄹ",
      result: "ㅇ, ㄴ, ㅁ + ㄴ*",
      example: "협력 → 혐녁",
    },
  ];

  const footnoteText =
    "This particular case involves two back to back nasalization changes. The ㄹ following a ㄱ, ㄷ, ㅂ turns into ㄴ. Then using the above nasalization rule regarding final consonants ㄱ, ㄷ, ㅂ, the final consonants turn into nasalized sounds.";

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        Nasalization (비음화)
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        Nasalization involves changing certain consonants to nasal sounds:
      </p>

      <PronunciationTable
        title="Plosive (ㄱ, ㄷ, ㅂ) → Nasalization"
        rows={plosiveNasalizationData}
      />

      <div className="mt-8">
        <PronunciationTable
          title="ㄹ → Nasalization"
          rows={liquidNasalizationData}
          footnote={footnoteText}
        />
      </div>
    </div>
  );
};

export default NasalizationRules;
