"use server";

import { Example } from "@/app/lib/data";

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

/**
 * Rule type to fetch from AI
 */
export type PronunciationRuleType = "nasalization" | "liquidization";

/**
 * Fetches Korean pronunciation examples from Perplexity AI
 * @param ruleType Type of pronunciation rule to fetch examples for
 * @param count Number of examples to fetch (default: 5)
 * @returns Array of pronunciation examples
 */
export async function fetchPronunciationExamplesFromAI(
  ruleType: PronunciationRuleType,
  count: number = 5
): Promise<Example[]> {
  console.log(
    `🚀 Starting fetchPronunciationExamplesFromAI for ${ruleType}...`
  );

  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error("❌ Perplexity API key is missing");
      throw new Error("API key not configured");
    }

    console.log(`✓ API key found, length: ${apiKey.length} chars`);

    const ruleDetails = {
      nasalization: {
        koreanName: "비음화",
        description: "where certain consonants change to nasal sounds",
        examples: "ㄱ→ㅇ (학년→항년), ㄷ→ㄴ, ㅂ→ㅁ when followed by ㄴ or ㅁ",
        fallback: [
          {
            word: "학년",
            pronunciation: "항년",
            meaning: "Grade (in school)",
            rule: "ㄱ + ㄴ → ㅇ + ㄴ",
          },
          {
            word: "법률",
            pronunciation: "범뉼",
            meaning: "Law",
            rule: "ㅂ + ㄹ → ㅁ + ㄴ",
          },
        ],
      },
      liquidization: {
        koreanName: "유음화",
        description: "where ㄴ becomes ㄹ when adjacent to ㄹ, and vice versa",
        examples: "ㄴ→ㄹ (신라→실라), ㄹ→ㄹ (설날→설랄)",
        fallback: [
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
        ],
      },
    };

    const ruleInfo = ruleDetails[ruleType];

    const prompt = `Generate ${count} authentic examples of Korean ${ruleType} (${
      ruleInfo.koreanName
    }) ${ruleInfo.description}. Use ${
      ruleType === "nasalization"
        ? "https://www.mykoreanlesson.com/post/korean-pronunciation-lesson-consonant-assimilation-nasalization"
        : "https://www.mykoreanlesson.com/post/korean-pronunciation-lesson-consonant-assimilation-liquidization"
    } as the ultimate reference for the rule.
    
    For each example, include:
    1. The Korean word (using Hangul)
    2. How it's actually pronounced with the ${ruleType} rule applied (using Hangul) 
    3. The meaning in English
    4. The specific rule applied that must conform to one of the rules in the aforementioned link.
    5. If none of the rules are directly applicable to the example, then replace with a new example that does comply with following one of the rules. i.e. do not include the non-compliant example and do not count it towards the ${count}
    
    Make sure the examples are varied in complexity and common in everyday Korean.
    Format the response as a valid JSON array with objects having these fields: word, pronunciation, meaning, rule. 
    
    IMPORTANT: Return ONLY the raw JSON array WITHOUT any markdown formatting, code blocks, or explanatory text. Do not wrap the JSON in \`\`\` or any other formatting. The response should begin with [ and end with ] and be valid JSON that can be directly parsed.`;

    console.log(`📝 Generated prompt for ${ruleType}:`, prompt);

    console.log(`📡 Calling Perplexity API...`);

    const randomSeed = Math.floor(Math.random() * 1000000).toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content:
                  "You are a Korean linguistics expert specialized in pronunciation rules. You must ONLY output valid JSON arrays containing Korean pronunciation examples following the user's instructions. No explanations, no code blocks, just valid JSON that starts with [ and ends with ].",
              },
              {
                role: "user",
                content: `${prompt}\n\nRemember to ONLY return a valid JSON array. Seed: ${randomSeed}`,
              },
            ],
            temperature: 0.3,
          }),
          signal: controller.signal,
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      clearTimeout(timeoutId);
      if (!response.ok) {
        console.error(`❌ API request failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(`📊 Received API response data`);

      const content = data.choices[0].message.content;
      console.log(`📄 Raw content from API:`, content);

      if (!content || content.trim() === "") {
        console.error("❌ Empty response from API");
        throw new Error("Empty response from API");
      }

      let examples: Example[] = [];

      try {
        console.log(`🔍 Attempting to parse response as JSON...`);

        let jsonContent = content;

        if (content.includes("```")) {
          console.log("📝 Detected markdown in response, extracting JSON...");
          const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonContent = jsonMatch[1].trim();
            console.log("📄 Extracted JSON content:", jsonContent);
          } else {
            const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (arrayMatch) {
              jsonContent = arrayMatch[0];
              console.log("📄 Extracted array content:", jsonContent);
            }
          }
        }

        if (!jsonContent.startsWith("[")) {
          const startIdx = jsonContent.indexOf("[");
          if (startIdx !== -1) {
            jsonContent = jsonContent.substring(startIdx);
            console.log("🧹 Trimmed content before JSON array");
          }
        }

        if (!jsonContent.endsWith("]")) {
          const endIdx = jsonContent.lastIndexOf("]");
          if (endIdx !== -1 && endIdx > jsonContent.indexOf("[")) {
            jsonContent = jsonContent.substring(0, endIdx + 1);
            console.log("🧹 Trimmed content after JSON array");
          }
        }

        let openBrackets = 0;
        let closeBrackets = 0;
        for (const char of jsonContent) {
          if (char === "[") openBrackets++;
          if (char === "]") closeBrackets++;
        }

        if (openBrackets !== closeBrackets) {
          console.error(
            `⚠️ Unbalanced brackets: ${openBrackets} open vs ${closeBrackets} close`
          );
          if (openBrackets > closeBrackets) {
            jsonContent =
              jsonContent + "]".repeat(openBrackets - closeBrackets);
            console.log("🔧 Added missing closing brackets");
          } else if (closeBrackets > openBrackets) {
            const extraCloseIdx = jsonContent.indexOf("]");
            if (extraCloseIdx > 0) {
              jsonContent = jsonContent.substring(0, extraCloseIdx + 1);
              console.log(
                "🔧 Removed extra content after first closing bracket"
              );
            }
          }
        }

        if (!jsonContent.startsWith("[") || !jsonContent.endsWith("]")) {
          console.error("❌ Invalid JSON structure after cleanup");
          throw new Error("Invalid JSON structure");
        }

        jsonContent = jsonContent
          .replace(/,\s*]/g, "]")
          .replace(/\]\s*\[/g, "],[")
          .replace(/\}\s*\{/g, "},{");

        console.log(
          `📄 Final JSON to parse:`,
          jsonContent.substring(0, 100) +
            (jsonContent.length > 100 ? "..." : "")
        );

        try {
          examples = JSON.parse(jsonContent);
        } catch (parseError) {
          console.error(
            "⚠️ Initial JSON parsing failed, attempting cleanup:",
            parseError
          );

          const objectsMatch = jsonContent.match(
            /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g
          );
          if (objectsMatch && objectsMatch.length > 0) {
            console.log("🔧 Manually extracting JSON objects");
            examples = objectsMatch
              .map((obj: string) => {
                try {
                  return JSON.parse(obj);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);

            if (examples.length === 0) {
              throw new Error("Could not extract valid JSON objects");
            }
          } else {
            throw parseError;
          }
        }

        console.log(`🧪 Validating example structure...`);
        examples = examples.map((example) => ({
          word: example.word || "",
          pronunciation: example.pronunciation || "",
          meaning: example.meaning || "",
          rule: example.rule || "",
        }));

        console.log(`✅ Successfully parsed ${examples.length} examples`);

        return examples;
      } catch (jsonError) {
        console.error("❌ Failed to parse AI response as JSON", jsonError);
        throw new Error("Invalid response format from AI service");
      }
    } catch (apiError) {
      console.error(`❌ API or parsing error:`, apiError);
      throw apiError;
    }
  } catch (error) {
    console.error(`❌ Error fetching ${ruleType} examples:`, error);
    console.log(`⚠️ Returning fallback data for ${ruleType}`);

    return ruleType === "nasalization"
      ? [
          {
            word: "학년",
            pronunciation: "항년",
            meaning: "Grade (in school)",
            rule: "ㄱ + ㄴ → ㅇ + ㄴ",
          },
          {
            word: "법률",
            pronunciation: "범뉼",
            meaning: "Law",
            rule: "ㅂ + ㄹ → ㅁ + ㄴ",
          },
        ]
      : [
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
        ];
  }
}
