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
                  Plosive (ㄱ, ㄷ, ㅂ) → Nasalization
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
                  ㄹ → Nasalization
                </h4>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Final Consonant
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Following Consonant
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
                        ㅁ, ㅇ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄹ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄴ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        담력 → 담녁
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄱ, ㄷ, ㅂ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㄹ
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        ㅇ, ㄴ, ㅁ + ㄴ*
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        협력 → 혐녁
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                  This particular case involves both liquidization and
                  nasalization. The ㄹ following a ㄱ, ㄷ, ㅂ turns into ㄴ
                  (liquidation). Then using the above nasalization rule
                  regarding final consonants ㄱ, ㄷ, ㅂ, the final consonants
                  turn into nasalized sounds (nasalization).
                </p>
              </div>
            </div>
          </div>
          <hr className="my-8" />
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Liquidization (유음화)
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Liquidization is a phonological phenomenon where certain
              consonants transform into a liquid sound when they appear in
              specific positions within words.
            </p>
            <div className="overflow-x-auto mt-4">
              <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                Forward Liquidization
              </h4>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      First Syllable Final Consonant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Following Syllable First Consonant
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
                      ㄹ
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      ㄴ
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      ㄹ + ㄹ
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      칼날 → 칼랄
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto mt-8">
              <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                Backward Liquidization
              </h4>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      First Syllable Final Consonant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Following Syllable First Consonant
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
                      ㄴ
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      ㄹ
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      ㄹ + ㄹ
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      신라 → 실라
                    </td>
                  </tr>
                </tbody>
              </table>
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
