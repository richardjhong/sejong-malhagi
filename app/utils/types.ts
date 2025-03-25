import { Example } from "@/app/lib/data";

/**
 * Rule type to fetch from AI
 */
export type PronunciationRuleType = "nasalization" | "liquidization";

/**
 * Rule details type
 */
export interface RuleDetails {
  koreanName: string;
  description: string;
  examples: string;
  fallback: Example[];
}
