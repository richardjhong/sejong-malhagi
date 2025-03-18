"use client";

import { useState } from "react";

interface Example {
  word: string;
  pronunciation: string;
  meaning: string;
  rule: string;
}

const examples: Example[] = [
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
    meaning: "Hallasan (mountain)",
    rule: "ㄴ + ㄹ → ㄹ + ㄹ",
  },
];

export default function LiquidizationPractice() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showPronunciation, setShowPronunciation] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Liquidization Practice (유음화)
      </h1>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {examples[currentExample].word}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {examples[currentExample].meaning}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Rule: {examples[currentExample].rule}
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowPronunciation(!showPronunciation)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {showPronunciation ? "Hide Pronunciation" : "Show Pronunciation"}
          </button>
          {showPronunciation && (
            <p className="text-2xl mt-4 text-gray-900 dark:text-white">
              {examples[currentExample].pronunciation}
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() =>
              setCurrentExample(
                (prev) => (prev - 1 + examples.length) % examples.length
              )
            }
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentExample((prev) => (prev + 1) % examples.length)
            }
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          About Liquidization
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Liquidization (유음화) is a Korean pronunciation rule where:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
          <li>When ㄴ meets ㄹ, ㄴ becomes ㄹ</li>
          <li>When ㄹ meets ㄴ, ㄹ becomes ㄹ</li>
          <li>This creates a smooth, flowing sound between the consonants</li>
        </ul>
      </div>
    </div>
  );
}
