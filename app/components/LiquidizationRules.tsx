import React from "react";
import PronunciationTable from "./PronunciationTable";

const LiquidizationRules = () => {
  const forwardLiquidizationData = [
    {
      firstConsonant: "ㄹ",
      followingSound: "ㄴ",
      result: "ㄹ + ㄹ",
      example: "칼날 → 칼랄",
    },
  ];

  const backwardLiquidizationData = [
    {
      firstConsonant: "ㄴ",
      followingSound: "ㄹ",
      result: "ㄹ + ㄹ",
      example: "신라 → 실라",
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        Liquidization (유음화)
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        Liquidization is a phonological phenomenon where certain consonants
        transform into a liquid sound when they appear in specific positions
        within words.
      </p>

      <PronunciationTable
        title="Forward Liquidization"
        rows={forwardLiquidizationData}
      />

      <div className="mt-8">
        <PronunciationTable
          title="Backward Liquidization"
          rows={backwardLiquidizationData}
        />
      </div>
    </div>
  );
};

export default LiquidizationRules;
