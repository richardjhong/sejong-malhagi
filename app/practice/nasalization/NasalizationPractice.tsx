"use client";

import { useState, useRef } from "react";
import { Example } from "@/app/lib/data";
import { verifyPronunciation } from "@/app/utils/actions";

interface NasalizationPracticeProps {
  examples: Example[];
}

const NasalizationPractice = ({ examples }: NasalizationPracticeProps) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    feedback: string;
  } | null>(null);
  const [answeredExamples, setAnsweredExamples] = useState<Set<number>>(
    new Set()
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const progressPercentage = Math.round(
    (answeredExamples.size / examples.length) * 100
  );

  const handleNextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
    resetExampleState();
  };

  const handlePrevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length);
    resetExampleState();
  };

  const resetExampleState = () => {
    setShowPronunciation(false);
    setUserAnswer("");
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleVerify = async () => {
    if (!userAnswer.trim()) return;

    const result = await verifyPronunciation(
      userAnswer,
      examples[currentExample].pronunciation
    );

    setFeedback(result);
    setShowPronunciation(true);

    if (result.isCorrect) {
      const newAnswered = new Set(answeredExamples);
      newAnswered.add(currentExample);
      setAnsweredExamples(newAnswered);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm text-gray-500 dark:text-gray-400">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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

        <div className="mb-8">
          <div className="text-center mb-4">
            <label
              htmlFor="pronunciation"
              className="block mb-2 text-gray-700 dark:text-gray-300"
            >
              How would you pronounce this?
            </label>
            <input
              ref={inputRef}
              id="pronunciation"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Type your pronunciation..."
              autoComplete="off"
            />
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={handleVerify}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-4"
              disabled={!userAnswer.trim()}
            >
              Check
            </button>
            {/* <button
              onClick={() => setShowPronunciation(!showPronunciation)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {showPronunciation ? "Hide Answer" : "Show Answer"}
            </button> */}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-md mb-4 text-center ${
                feedback.isCorrect
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
              }`}
            >
              {feedback.feedback}
            </div>
          )}

          {showPronunciation && !feedback && (
            <p className="text-2xl mt-4 text-center text-gray-900 dark:text-white">
              {examples[currentExample].pronunciation}
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrevExample}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <button
            onClick={handleNextExample}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NasalizationPractice;
