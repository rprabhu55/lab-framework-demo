/**
 * Helper methods to interact with the Redis database
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

function normalizePathName(name) {
    return name.replace(/ /g, "-")
}

/**
 * Fetches data from the Redis store.
 *
 * @param {string} path - The Redis key to fetch data for
 * @returns {Object|string|null} The fetched data, or null if the key does not exist
 */
export async function fetchRedisVariable(path) {
  const normalizedPath = normalizePathName(path); 
  const redis = await connectRedis();
  try {
      const pathType = await redis.type(normalizedPath);
      if (pathType === "string") {
          return await redis.get(normalizedPath) || null;
      } else {
          return await redis.json.get(normalizedPath) || null;
      }
  } catch (error) {
      console.error(`Error fetching Redis variable ${normalizedPath}:`, error);
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

  if(path === null || value === null) return(new Error("Redis path or value is empty"));
  const normalizedPath = normalizePathName(path);
  const redis = await connectRedis();
  try {
      if (typeof value === 'object') {
          await redis.json.set(normalizedPath, "$", value);
      } else {
          await redis.set(normalizedPath, value);
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
  const normalizedPath = normalizePathName(path);
  const redis = await connectRedis();
  try {
      await redis.del(normalizedPath);
  } finally {
      await redis.disconnect();
  }
}