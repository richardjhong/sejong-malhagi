"use server";

import { getRedisClient } from "./redis";

export const getDataFromRedis = async <T>(key: string): Promise<T[]> => {
  const redis = getRedisClient();
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error retrieving data from Redis for key ${key}:`, error);
    return [];
  } finally {
    await redis.quit();
  }
};

export const saveDataToRedis = async <T>(
  key: string,
  data: T[]
): Promise<boolean> => {
  const redis = getRedisClient();
  try {
    await redis.set(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to Redis for key ${key}:`, error);
    return false;
  } finally {
    await redis.quit();
  }
};
