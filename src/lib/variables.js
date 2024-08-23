/**
 * Utility functions for interacting with environment variables and Redis.
 */

import { createClient } from "redis";
import { REDIS_URL } from "./constants";
const PETNAME_URL = "http://host.docker.internal:5123/petname";

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
 * Retrieves an environment variable by name.
 *
 * @param {string} name - The name of the environment variable to retrieve
 * @returns {string|null} The value of the environment variable, or null if it does not exist
 */
export async function getEnvVariable(name) {
    return process.env[name] || null;
}

/**
 * Retrieves the username from the environment variables.
 *
 * @returns {string|null} The username, or null if it does not exist
 */
export async function getUsername() {
    return process.env.USERNAME || null;
}

/**
 * Retrieves a random pet name from the UDF pet name service.
 * 
 * @returns {string} A random pet name
 */
export async function getPetname() {
    const petnameKey = "petname";
    let petname = await getRedisVariable(petnameKey);
    if (petname) {
        return petname;
    }
    try {
        const response = await fetch(PETNAME_URL, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to retrieve pet name from ${PETNAME_URL}`);
        }
        const petData = await response.json();
        petname = petData.petname;
        await setRedisVariable(petnameKey, petname);
        return petname;
    } catch (error) {
        throw new Error('Failed to retrieve pet name: ' + error.message);
    }
}

/**
 * Fetches data from the Redis store.
 *
 * @param {string} path - The Redis key to fetch data for
 * @returns {Object|string|null} The fetched data, or null if the key does not exist
 */
export async function getRedisVariable(path) {
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
