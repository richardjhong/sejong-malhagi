"use server";

import Redis from "ioredis";
import { Example } from "@/app/lib/data";

const redisCredentials = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  port: process.env.UPSTASH_REDIS_PORT,
};

const getRedisClient = () => {
  return new Redis(
    `rediss://default:${redisCredentials.password}@${redisCredentials.url}:${redisCredentials.port}`
  );
};

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
    // Initialize Redis client
    const redis = getRedisClient();
    const historyKey = `chat_history:${ruleType}`;

    // Retrieve chat history
    let chatHistory: string[] = [];
    try {
      const storedHistory = await redis.get(historyKey);
      if (storedHistory) {
        chatHistory = JSON.parse(storedHistory);
        console.log(
          `📚 Retrieved chat history for ${ruleType}, ${chatHistory.length} messages`
        );
      }
    } catch (redisError) {
      console.warn(`⚠️ Could not retrieve chat history: ${redisError}`);
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error("❌ Perplexity API key is missing");
      await redis.quit();
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
    4. Review the previous chat history messages with a role of 'system' and do not repeat the same word choices from before.
    5. The specific rule applied that must conform to one of the rules in the aforementioned link.
    6. If none of the rules are directly applicable to the example, then replace with a new example that does comply with following one of the rules. i.e. do not include the non-compliant example and do not count it towards the ${count}
    
    Make sure the examples are varied in complexity and common in everyday Korean.
    Format the response as a valid JSON array with objects having these fields: word, pronunciation, meaning, rule. 
    
    IMPORTANT: Return ONLY the raw JSON array WITHOUT any markdown formatting, code blocks, or explanatory text. Do not wrap the JSON in \`\`\` or any other formatting. The response should begin with [ and end with ] and be valid JSON that can be directly parsed.`;

    console.log(`📝 Generated prompt for ${ruleType}:`, prompt);
    console.log(`📡 Calling Perplexity API...`);

    const randomSeed = Math.floor(Math.random() * 1000000).toString();
    const userMessage = `${prompt}\n\nRemember to ONLY return a valid JSON array. Seed: ${randomSeed}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const messages = [
        {
          role: "system",
          content:
            "You are a Korean linguistics expert specialized in pronunciation rules. You must ONLY output valid JSON arrays containing Korean pronunciation examples following the user's instructions. No explanations, no code blocks, just valid JSON that starts with [ and ends with ].",
        },
      ];

      if (chatHistory.length > 0) {
        for (let i = 0; i < chatHistory.length; i += 2) {
          if (i < chatHistory.length) {
            messages.push({ role: "user", content: chatHistory[i] });
          }
          if (i + 1 < chatHistory.length) {
            messages.push({ role: "assistant", content: chatHistory[i + 1] });
          }
        }
      }

      messages.push({
        role: "user",
        content: userMessage,
      });

      console.log(`📄 Sending ${messages.length} messages to API`);

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
            messages: messages,
            temperature: 0.7,
          }),
          signal: controller.signal,
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      clearTimeout(timeoutId);
      if (!response.ok) {
        console.error(`❌ API request failed with status ${response.status}`);
        await redis.quit();
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(`📊 Received API response data`);

      const content = data.choices[0].message.content;
      console.log(`📄 Raw content from API:`, content);

      if (!content || content.trim() === "") {
        console.error("❌ Empty response from API");
        await redis.quit();
        throw new Error("Empty response from API");
      }

      try {
        const examples: Example[] = JSON.parse(content);
        console.log("✅ Successfully parsed examples:", examples.length);

        try {
          chatHistory.push(userMessage);
          chatHistory.push(content);

          // Keep only the last 6 messages (3 interactions) to prevent history from growing too large
          if (chatHistory.length > 6) {
            chatHistory = chatHistory.slice(chatHistory.length - 6);
          }

          await redis.set(historyKey, JSON.stringify(chatHistory));
          console.log(
            `💾 Updated chat history for ${ruleType} with ${chatHistory.length} messages`
          );
        } catch (saveError) {
          console.error(`❌ Failed to save chat history: ${saveError}`);
        }

        await redis.quit();
        return examples;
      } catch (jsonError) {
        console.error("❌ Failed to parse AI response as JSON", jsonError);
        await redis.quit();
        throw new Error("Invalid response format from AI service");
      }
    } catch (apiError) {
      console.error(`❌ API or parsing error:`, apiError);
      await redis.quit();
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
