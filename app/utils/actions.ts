"use server";

export const verifyPronunciation = async (
  userAnswer: string,
  correctAnswer: string
) => {
  const isCorrect = userAnswer.trim() === correctAnswer.trim();

  return {
    isCorrect,
    feedback: isCorrect
      ? "Correct"
      : `Not quite. The correct pronunciation is ${correctAnswer}.`,
  };
};
