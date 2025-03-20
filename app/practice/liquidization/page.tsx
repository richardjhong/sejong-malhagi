import { Suspense } from "react";
import PronunciationPractice from "@/app/components/PronunciationPractice";
import { fetchPronunciationExamplesFromAI } from "@/app/utils/actions";
import { getLiquidizationExamples } from "@/app/lib/data";

const ExampleSkeleton = () => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

const LiquidizationExamplesLoader = async () => {
  try {
    console.log("🔍 Fetching liquidization examples from Perplexity AI...");
    const aiExamples = await fetchPronunciationExamplesFromAI(
      "liquidization",
      5
    );

    console.log(
      "✅ Received AI examples:",
      JSON.stringify(aiExamples, null, 2)
    );
    console.log(
      `📊 Retrieved ${aiExamples.length} liquidization examples from AI`
    );

    if (aiExamples && aiExamples.length >= 3) {
      return <PronunciationPractice examples={aiExamples} />;
    }
  } catch (error) {
    console.error("❌ Failed to fetch AI examples:", error);
  }

  console.log("⚠️ Falling back to static liquidization examples");
  const staticExamples = await getLiquidizationExamples();
  return <PronunciationPractice examples={staticExamples} />;
};

const LiquidizationPage = async () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Liquidization Practice (유음화)
      </h1>

      <Suspense fallback={<ExampleSkeleton />}>
        <LiquidizationExamplesLoader />
      </Suspense>

      <div className="mt-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          About Liquidization
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Liquidization (유음화) is a Korean pronunciation rule where:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
          <li>When ㄴ meets ㄹ, ㄴ becomes ㄹ (e.g., 신라 → 실라)</li>
          <li>When ㄹ meets ㄴ, ㄴ becomes ㄹ (e.g., 설날 → 설랄)</li>
          <li>This creates a smooth, flowing sound between the consonants</li>
        </ul>
      </div>
    </div>
  );
};

export default LiquidizationPage;
