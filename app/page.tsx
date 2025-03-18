import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          세종 말하기 (Sejong Malhagi)
        </h1>
        <p className="text-xl text-center mb-12 text-gray-700 dark:text-gray-300">
          Master Korean pronunciation with interactive practice
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/practice/nasalization"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Nasalization (비음화)
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Learn about nasalization where certain consonants change to nasal
              sounds (ㅁ, ㄴ, ㅇ) in specific contexts.
            </p>
          </Link>
          <Link
            href="/practice/liquidization"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Liquidization (유음화)
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Practice the rules of liquidization where ㄴ becomes ㄹ when
              followed by ㄹ, and ㄹ becomes ㄴ when followed by ㄴ.
            </p>
          </Link>
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Learn more about Korean pronunciation rules →
          </Link>
        </div>
      </main>
    </div>
  );
}
