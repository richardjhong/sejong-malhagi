const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        About 세종 말하기 (Sejong Malhagi)
      </h1>

      <div className="max-w-3xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Key Pronunciation Rules
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Nasalization (비음화)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nasalization involves changing certain consonants to nasal
                sounds:
              </p>
              <div className="overflow-x-auto mt-4">
                <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Table 1: Plosive → Nasals
                </h4>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        First Syllable Final Consonant
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Following Syllable First Consonant Sound
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Result
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Example
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄱ, ㄲ, ㅋ, ㄳ, ㄺ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ, ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅇ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        학년 → 항년
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄷ, ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ, ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        걷는 → 건는
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅂ, ㅍ, ㄼ, ㄿ, ㄽ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ, ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        읍내 → 음내
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto mt-8">
                <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Table 2: Fricatives & Liquids → Nasals
                </h4>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        First Syllable Final Consonant
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Following Syllable First Consonant Sound
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Result
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Example
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅅ, ㅆ, ㅈ, ㅊ, ㅎ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ, ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        있는 → 인는
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅂ, ㅍ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ, ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅁ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        입력 → 임녁
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄹ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ + ㄴ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        설날 → 설랄
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Liquidization (유음화)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Liquidization occurs when ㄴ and ㄹ meet, creating a smooth,
                flowing sound:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                <li>ㄴ + ㄹ → ㄹ + ㄹ (e.g., 신라 → 실라)</li>
                <li>ㄹ + ㄴ → ㄹ + ㄹ (e.g., 설날 → 설랄)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            How to Use This App
          </h2>
        </section> */}
      </div>
    </div>
  );
};

export default About;
