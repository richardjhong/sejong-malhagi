"use server";

import { Example } from "@/app/lib/data";
import { getRedisClient } from "./redis";
import { PronunciationRuleType } from "./types";

export const verifyPronunciation = async (
  userAnswer: string,
  correctAnswer: string,
  example: Example,
  ruleType: PronunciationRuleType
) => {
  const isCorrect = userAnswer.trim() === correctAnswer.trim();

  try {
    const redis = getRedisClient();
    const correctWordsKey = `correct_words:${ruleType}`;
    const learningWordsKey = `learning_words:${ruleType}`;

    // Update example with new status
    const updatedExample = {
      ...example,
      wordStatus: isCorrect ? "correct" : "incorrect",
    };

    if (isCorrect) {
      // Move from learning to correct words
      let correctWords = [];
      const storedCorrectWords = await redis.get(correctWordsKey);

      if (storedCorrectWords) {
        correctWords = JSON.parse(storedCorrectWords);
      }

      // Add to correct words if not already present
      const existingIndex = correctWords.findIndex(
        (w: Example) => w.word === example.word
      );

      if (existingIndex === -1) {
        correctWords.push(updatedExample);
        await redis.set(correctWordsKey, JSON.stringify(correctWords));
        console.log(`Added to correct words: ${example.word}`);
      }

      // Remove from learning words if present
      const storedLearningWords = await redis.get(learningWordsKey);

      if (storedLearningWords) {
        const learningWords = JSON.parse(storedLearningWords);

        const learningIndex = learningWords.findIndex(
          (w: Example) => w.word === example.word
        );

        if (learningIndex !== -1) {
          learningWords.splice(learningIndex, 1);
          await redis.set(learningWordsKey, JSON.stringify(learningWords));
          console.log(`Removed from learning words: ${example.word}`);
        }
      }
    } else {
      // Update in learning words
      let learningWords = [];
      const storedLearningWords = await redis.get(learningWordsKey);

      if (storedLearningWords) {
        learningWords = JSON.parse(storedLearningWords);
      }

      const existingIndex = learningWords.findIndex(
        (w: Example) => w.word === example.word
      );

      if (existingIndex !== -1) {
        // Update status to incorrect
        learningWords[existingIndex] = updatedExample;
      } else {
        // Add to learning words
        learningWords.push(updatedExample);
      }

      await redis.set(learningWordsKey, JSON.stringify(learningWords));
      console.log(`Updated learning word: ${example.word}`);
    }

    await redis.quit();
  } catch (error) {
    console.error(`Error updating word status:`, error);
  }

  return {
    isCorrect,
    feedback: isCorrect
      ? "Correct"
      : `Not quite. The correct pronunciation is ${correctAnswer}.`,
  };
};
