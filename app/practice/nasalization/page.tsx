import { Suspense } from "react";
import NasalizationPractice from "./NasalizationPractice";
import { getNasalizationExamples } from "@/app/lib/data";

const ExampleSkeleton = () => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

const NasalizationExamplesLoader = async () => {
  const examples = await getNasalizationExamples();

  return <NasalizationPractice examples={examples} />;
};

const NasalizationPage = async () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Nasalization Practice (비음화)
      </h1>

      <Suspense fallback={<ExampleSkeleton />}>
        <NasalizationExamplesLoader />
      </Suspense>

      <div className="mt-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          About Nasalization
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Nasalization (비음화) is a Korean pronunciation rule where certain
          consonants change to nasal sounds:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
          <li>ㄱ, ㄲ, ㅋ + ㄴ, ㅁ → ㅇ</li>
          <li>ㄷ, ㄸ, ㅌ + ㄴ, ㅁ → ㄴ</li>
          <li>ㅂ, ㅃ, ㅍ + ㄴ, ㅁ → ㅁ</li>
          <li>ㄹ + ㄴ → ㄴ + ㄴ</li>
        </ul>
      </div>
    </div>
  );
};

export default NasalizationPage;
