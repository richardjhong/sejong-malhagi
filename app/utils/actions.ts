"use server";

import { Example } from "@/app/lib/data";
import { PronunciationRuleType } from "./types";
import { verifyPronunciation as verify } from "./verification";
import { fetchPronunciationExamplesFromAI as fetchExamples } from "./examplesRetrieval";
import {
  getDataFromRedis as getData,
  saveDataToRedis as saveData,
} from "./redisActions";

export async function verifyPronunciation(
  userAnswer: string,
  correctAnswer: string,
  example: Example,
  ruleType: PronunciationRuleType
) {
  return verify(userAnswer, correctAnswer, example, ruleType);
}

export async function fetchPronunciationExamplesFromAI(
  ruleType: PronunciationRuleType,
  count: number = 10
): Promise<Example[]> {
  return fetchExamples(ruleType, count);
}

export async function getDataFromRedis<T>(key: string): Promise<T[]> {
  return getData(key);
}

export async function saveDataToRedis<T>(
  key: string,
  data: T[]
): Promise<boolean> {
  return saveData(key, data);
}
