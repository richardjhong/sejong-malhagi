"use server";

import { Example } from "@/app/lib/data";
import { getRedisClient } from "./redis";
import { PronunciationRuleType, RuleDetails } from "./types";

const ruleDetails: Record<PronunciationRuleType, RuleDetails> = {
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
        wordStatus: "unanswered",
      },
      {
        word: "법률",
        pronunciation: "범뉼",
        meaning: "Law",
        rule: "ㅂ + ㄹ → ㅁ + ㄴ",
        wordStatus: "unanswered",
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
        wordStatus: "unanswered",
      },
      {
        word: "설날",
        pronunciation: "설랄",
        meaning: "New Year's Day",
        rule: "ㄹ + ㄴ → ㄹ + ㄹ",
        wordStatus: "unanswered",
      },
    ],
  },
};

/**
 * Fetches Korean pronunciation examples from Perplexity AI
 * @param ruleType Type of pronunciation rule to fetch examples for
 * @param count Number of examples to fetch (default: 10)
 * @returns Array of pronunciation examples
 */
export async function fetchPronunciationExamplesFromAI(
  ruleType: PronunciationRuleType,
  count: number = 10
): Promise<Example[]> {
  try {
    const redis = getRedisClient();
    const historyKey = `chat_history:${ruleType}`;
    const correctWordsKey = `correct_words:${ruleType}`;
    const learningWordsKey = `learning_words:${ruleType}`;

    let learningWords: Example[] = [];
    const storedLearningWords = await redis.get(learningWordsKey);
    if (storedLearningWords) {
      learningWords = JSON.parse(storedLearningWords);
    }

    let correctWords: Example[] = [];
    const storedCorrectWords = await redis.get(correctWordsKey);
    if (storedCorrectWords) {
      correctWords = JSON.parse(storedCorrectWords);
    }

    if (learningWords.length >= count) {
      await redis.quit();
      return learningWords.slice(0, count);
    }

    const neededCount = count - learningWords.length;

    let chatHistory: string[] = [];
    try {
      const storedHistory = await redis.get(historyKey);
      if (storedHistory) {
        chatHistory = JSON.parse(storedHistory);
      }
    } catch (redisError) {
      console.warn(`Could not retrieve chat history: ${redisError}`);
    }

    if (neededCount <= 0) {
      await redis.quit();
      return learningWords;
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error("Perplexity API key is missing");
      await redis.quit();
      throw new Error("API key not configured");
    }

    const ruleInfo = ruleDetails[ruleType];

    const existingWords = new Set([
      ...correctWords.map((w) => w.word),
      ...learningWords.map((w) => w.word),
    ]);

    const prompt = createPrompt(ruleType, ruleInfo, neededCount, existingWords);

    const randomSeed = Math.floor(Math.random() * 1000000).toString();
    const userMessage = `${prompt}\n\nRemember to ONLY return a valid JSON array. Seed: ${randomSeed}`;

    try {
      const newExamples = await fetchExamplesFromPerplexity(
        apiKey,
        userMessage,
        chatHistory
      );

      const processedExamples = newExamples.map((example) => ({
        ...example,
        wordStatus: example.wordStatus || ("unanswered" as const),
      }));

      const combinedExamples = [...learningWords, ...processedExamples];

      await redis.set(learningWordsKey, JSON.stringify(combinedExamples));

      try {
        const cleanContent = JSON.stringify(newExamples);

        chatHistory.push(userMessage);
        chatHistory.push(cleanContent);

        if (chatHistory.length > 6) {
          chatHistory = chatHistory.slice(chatHistory.length - 6);
        }

        await redis.set(historyKey, JSON.stringify(chatHistory));
      } catch (saveError) {
        console.error(`Failed to save chat history: ${saveError}`);
      }

      await redis.quit();
      return combinedExamples.slice(0, count);
    } catch (apiError) {
      console.error(`API or parsing error:`, apiError);
      await redis.quit();
      throw apiError;
    }
  } catch (error) {
    console.error(`Error fetching ${ruleType} examples:`, error);
    console.log(`Returning fallback data for ${ruleType}`);

    return ruleDetails[ruleType].fallback;
  }
}

const pronunciationRules = {
  nasalization: {
    rules: [
      "- When ㄱ or any related sound (ㄲ, ㅋ, ㄱㅅ, ㄹㄱ) as the last consonant of a syllable meets ㄴ or ㅁ as the first consonant of the next syllable, it changes to ㅇ",
      "- When ㄷ or any related sound (ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ) as the last consonant of a syllable meets ㄴ or ㅁ as the first consonant of the next syllable, it changes to ㄴ",
      "- When ㅂ or any related sound (ㅍ, ㄹㅂ, ㄹㅍ, ㄹㅅ) as the last consonant of a syllable meets ㄴ or ㅁ as the first consonant of the next syllable, it changes to ㅁ",
    ],
  },
  liquidization: {
    rules: [
      "- When ㄴ as the last consonant of a syllable meets ㄹ as the first consonant of the next syllable, it changes to ㄹ",
      "- When ㄹ as the last consonant of a syllable meets ㄴ as the first consonant of the next syllable, the ㄴ changes to ㄹ",
    ],
  },
};

function createPrompt(
  ruleType: PronunciationRuleType,
  ruleInfo: RuleDetails,
  neededCount: number,
  existingWords: Set<string>
): string {
  return `Generate ${neededCount} authentic examples of Korean ${ruleType} (${
    ruleInfo.koreanName
  }) ${
    ruleInfo.description
  }.Make sure that ${ruleType} is relevant to the examples and do not generate examples where this is not applicable.
    
    IMPORTANT RULES TO FOLLOW:
    1. The following are strict rules for pronunciation; do not deviate from them and be able to directly cite the rule in your response: 
    ${pronunciationRules[ruleType].rules.join("\n    ")}
    2. DO NOT include any examples that don't perfectly match these rules (I'm looking for how it sounds in real spoken Korean, not just formal orthography). No exceptions. 
    3. If you are unsure whether an example follows the rules, DO NOT include it and generate a different example. i.e. if you cannot directly cite one of the rules in the first bullet point above, do not include it and generate a different example. The disregarded example does not count towards the ${neededCount} examples.
    4. Review the previous chat history to avoid repeating previous examples.
    5. Do NOT include any of these words that have already been answered: ${Array.from(
      existingWords
    ).join(", ")}
    
    For each example, you MUST include:
    1. The original Korean word (using Hangul) in the "word" field
    2. How it's actually pronounced with the ${ruleType} rule applied (using Hangul) in the "pronunciation" field
    3. The meaning in English in the "meaning" field
    4. The specific rule applied (must be one of the rules listed above) in the "rule" field. If the this specific rule does not directly match one of the rules in the IMPORTANT RULES TO FOLLOW section, then disregard this example, do not count it towards the total count, and generate a new example.
    
    Make sure the examples are varied in complexity and common in everyday Korean.
    Format the response as a valid JSON array with objects having these fields: word, pronunciation, meaning, rule, wordStatus. 
    The wordStatus field should ALWAYS be set to "unanswered" for all examples. 
  `;
}

async function fetchExamplesFromPerplexity(
  apiKey: string,
  userMessage: string,
  chatHistory: string[]
): Promise<Example[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a Korean linguistics expert specialized in pronunciation rules. You must ONLY output valid JSON arrays containing Korean pronunciation examples following the user's instructions. No explanations, no code blocks, no embedded line breaks, just valid JSON that starts with [ and ends with ].",
      },
    ];

    // if (chatHistory.length > 0) {
    //   for (let i = 0; i < chatHistory.length; i += 2) {
    //     if (i < chatHistory.length) {
    //       messages.push({ role: "user", content: chatHistory[i] });
    //     }
    //     if (i + 1 < chatHistory.length) {
    //       messages.push({ role: "assistant", content: chatHistory[i + 1] });
    //     }
    //   }
    // }

    messages.push({
      role: "user",
      content: userMessage,
    });

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
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
    });

    clearTimeout(timeoutId);
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const content = data.choices[0].message.content;

    if (!content || content.trim() === "") {
      console.error("Empty response from API");
      throw new Error("Empty response from API");
    }

    const sanitizedContent = JSON.parse(content);

    try {
      return sanitizedContent;
    } catch (jsonError) {
      console.error("Failed to parse AI response as JSON", jsonError);
      console.log("Raw content:", content);
      throw new Error("Invalid response format from AI service");
    }
  } catch (error) {
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
