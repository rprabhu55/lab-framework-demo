/**
 * Helper methods to ineract with the Redis database
 */

import { createClient } from "redis";
import { REDIS_URL } from "./constants";

/**
 * Creates and connects a Redis client.
 *
 * @returns {Object} The connected Redis client
 */
async function connectRedis() {
  const redis = createClient({ url: REDIS_URL });
  redis.on("error", err => console.error("Redis Client Error", err));
  await redis.connect();
  return redis;
}

/**
 * Fetches data from the Redis store.
 *
 * @param {string} path - The Redis key to fetch data for
 * @returns {Object|string|null} The fetched data, or null if the key does not exist
 */
export async function fetchRedisVariable(path) {
  const redis = await connectRedis();
  try {
      const pathType = await redis.type(path);
      if (pathType === "string") {
          return await redis.get(path) || null;
      } else {
          return await redis.json.get(path) || null;
      }
  } catch (error) {
      console.error(`Error fetching Redis variable ${path}:`, error);
      return null;
  } finally {
      await redis.disconnect();
  }
}

/**
* Sets a value in the Redis store.
*
* @param {string} path - The Redis key to set data for
* @param {*} value - The value to store in Redis
*/
export async function setRedisVariable(path, value) {
  const redis = await connectRedis();
  try {
      if (typeof value === 'object') {
          await redis.json.set(path, "$", value);
      } else {
          await redis.set(path, value);
      }
  } finally {
      await redis.disconnect();
  }
}

/**
* Removes a key from the Redis store.
*
* @param {string} path - The Redis key to remove
*/
export async function removeRedisVariable(path) {
  const redis = await connectRedis();
  try {
      await redis.del(path);
  } finally {
      await redis.disconnect();
  }
}