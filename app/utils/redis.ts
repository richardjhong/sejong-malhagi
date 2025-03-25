import Redis from "ioredis";

export const redisCredentials = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  port: process.env.UPSTASH_REDIS_PORT,
};

export const getRedisClient = () => {
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

// Create separate file for server async functions
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
