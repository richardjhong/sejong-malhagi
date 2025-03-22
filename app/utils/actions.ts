"use server";

import Redis from "ioredis";
import { Example } from "@/app/lib/data";

const redisCredentials = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  port: process.env.UPSTASH_REDIS_PORT,
};

const getRedisClient = () => {
  if (
    !redisCredentials.url ||
    !redisCredentials.password ||
    !redisCredentials.port
  ) {
    console.error("❌ Missing Redis credentials");
    throw new Error("Redis credentials missing");
  }

  const connectionString = `rediss://default:${redisCredentials.password}@${redisCredentials.url}:${redisCredentials.port}`;
  const redis = new Redis(connectionString);

  redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
  });

  return redis;
};

export const verifyPronunciation = async (
  userAnswer: string,
  correctAnswer: string,
  example: Example,
  ruleType: PronunciationRuleType
) => {
  const isCorrect = userAnswer.trim() === correctAnswer.trim();

  try {
    if (
      !redisCredentials.url ||
      !redisCredentials.password ||
      !redisCredentials.port
    ) {
      console.error("❌ Redis credentials missing for verification");
      throw new Error("Redis credentials missing");
    }

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
  try {
    const redis = getRedisClient();
    const historyKey = `chat_history:${ruleType}`;
    const correctWordsKey = `correct_words:${ruleType}`;
    const learningWordsKey = `learning_words:${ruleType}`;

    // First check if we have existing learning words (incorrect or unanswered)
    let learningWords: Example[] = [];
    const storedLearningWords = await redis.get(learningWordsKey);
    if (storedLearningWords) {
      learningWords = JSON.parse(storedLearningWords);
    }

    // Get correct words to avoid duplicates
    let correctWords: Example[] = [];
    const storedCorrectWords = await redis.get(correctWordsKey);
    if (storedCorrectWords) {
      correctWords = JSON.parse(storedCorrectWords);
    }

    // If we have enough learning words, return them
    if (learningWords.length >= count) {
      await redis.quit();
      return learningWords.slice(0, count);
    }

    // If we have some but not enough learning words, we'll need to get more
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

    // If we don't need any new words, return what we have
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

    const ruleInfo = ruleDetails[ruleType];

    // Create a set of existing words to avoid duplicates
    const existingWords = new Set([
      ...correctWords.map((w) => w.word),
      ...learningWords.map((w) => w.word),
    ]);

    const prompt = `Generate ${neededCount} authentic examples of Korean ${ruleType} (${
      ruleInfo.koreanName
    }) ${ruleInfo.description}. 
    
    IMPORTANT RULES TO FOLLOW:
    1. ONLY use examples that EXACTLY match the specific rules found at ${
      ruleType === "nasalization"
        ? "https://www.mykoreanlesson.com/post/korean-pronunciation-lesson-consonant-assimilation-nasalization"
        : "https://www.mykoreanlesson.com/post/korean-pronunciation-lesson-consonant-assimilation-liquidization"
    }.
    2. For nasalization, these rules are:
       - When ㄱ or any related sound (ㄲ, ㅋ, ㄱㅅ, ㄹㄱ) meets ㄴ or ㅁ, it changes to ㅇ
       - When ㄷ or any related sound (ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ) meets ㄴ or ㅁ, it changes to ㄴ
       - When ㅂ or any related sound (ㅍ, ㄹㅂ, ㄹㅍ, ㄹㅅ) meets ㄴ or ㅁ, it changes to ㅁ
    3. For liquidization, these rules are:
       - When ㄴ meets ㄹ, it changes to ㄹ
       - When ㄹ meets ㄴ, the ㄴ changes to ㄹ
    4. DO NOT include any examples that don't perfectly match these rules (I'm looking for how it sounds in real spoken Korean, not just formal orthography). No exceptions. 
    5. If you are unsure whether an example follows the rules, DO NOT include it and generate a different example.
    6. Review the previous chat history to avoid repeating previous examples.
    7. Do NOT include any of these words that have already been answered: ${Array.from(
      existingWords
    ).join(", ")}
    
    For each example, include:
    1. The Korean word (using Hangul)
    2. How it's actually pronounced with the ${ruleType} rule applied (using Hangul). Only include the word with the rule applied, not the original word.
    3. The meaning in English
    4. The specific rule applied (must be one of the rules listed above)
    
    Make sure the examples are varied in complexity and common in everyday Korean.
    Format the response as a valid JSON array with objects having these fields: word, pronunciation, meaning, rule, wordStatus. 
    The wordStatus field should ALWAYS be set to "unanswered" for all examples.
    
    IMPORTANT: Return ONLY the raw JSON array WITHOUT any markdown formatting, code blocks, or explanatory text. Do not wrap the JSON in \`\`\` or any other formatting. The response should begin with [ and end with ] and be valid JSON that can be directly parsed.`;

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
        console.error(`API request failed with status ${response.status}`);
        await redis.quit();
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      if (!content || content.trim() === "") {
        console.error("Empty response from API");
        await redis.quit();
        throw new Error("Empty response from API");
      }

      try {
        const newExamples: Example[] = JSON.parse(content);

        // Add or ensure wordStatus is 'unanswered' for all new examples
        const processedExamples = newExamples.map((example) => ({
          ...example,
          wordStatus: example.wordStatus || ("unanswered" as const),
        }));

        // Combine existing learning words with new ones
        const combinedExamples = [...learningWords, ...processedExamples];

        // Update learning words in Redis
        await redis.set(learningWordsKey, JSON.stringify(combinedExamples));

        try {
          // Clean the content by parsing and re-stringifying
          const cleanContent = JSON.stringify(newExamples);

          // Add the current interaction to chat history
          chatHistory.push(userMessage);
          chatHistory.push(cleanContent);

          // Keep only the last 6 messages (3 interactions)
          if (chatHistory.length > 6) {
            chatHistory = chatHistory.slice(chatHistory.length - 6);
          }

          // Store updated chat history
          await redis.set(historyKey, JSON.stringify(chatHistory));
        } catch (saveError) {
          console.error(`Failed to save chat history: ${saveError}`);
        }

        await redis.quit();
        return combinedExamples.slice(0, count);
      } catch (jsonError) {
        console.error("Failed to parse AI response as JSON", jsonError);
        await redis.quit();
        throw new Error("Invalid response format from AI service");
      }
    } catch (apiError) {
      console.error(`API or parsing error:`, apiError);
      await redis.quit();
      throw apiError;
    }
  } catch (error) {
    console.error(`Error fetching ${ruleType} examples:`, error);

    return ruleType === "nasalization"
      ? [
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
        ]
      : [
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
        ];
  }
}
