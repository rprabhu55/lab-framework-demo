/**
 * Utility functions for interacting with environment variables and Redis.
 */

import { createClient } from "redis";
import { REDIS_URL } from "./constants";
const PETNAME_URL = "http://host.docker.internal:5123/petname"

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
 * Retrieves a random petname from the UDF petname service
 * 
 * @returns {string} A random petname
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
            throw new Error(`Failed to retrieve petname from ${PETNAME_URL}`);
        }
        petname = await response.text();
        await setRedisVariable(petnameKey, petname);
    return petname;
    } catch (error) {
        throw new Error('Failed to retrieve petname: ' + error.message);
    }
}

/**
 * Fetches data from the Redis store.
 *
 * This function creates a Redis client and uses it to retrieve the specified key's value as JSON.
 *
 * @param {string} path - The Redis key to fetch data for
 * @returns {Object|null} The fetched data, or null if the key does not exist
 * @throws {Error} If an error occurs while connecting to Redis or fetching the data
 */
export async function getRedisVariable(path) {
    const redis = await createClient({ url: REDIS_URL })
        .on("error", err => console.log("Redis Client Error", err))
        .connect();
    return await redis.json.get(path)
}

/**
 * Sets a value in the Redis store.
 *
 * This function creates a Redis client and uses it to set the specified key's value. If the value is an object, it will be stringified before being stored.
 *
 * @param {string} path - The Redis key to set data for
 * @param {*} value - The value to store in Redis
 */
export async function setRedisVariable(path, value) {
    const redis = await createClient({ url: REDIS_URL })
        .on("error", err => console.log("Redis Client Error", err))
        .connect();
    if (typeof value === 'object') {
        // await redis.json.set(path, "$", JSON.stringify(value));
        await redis.json.set(path, "$", value);
    } else {
        await redis.set(path, value);
    }
}

/**
 * Removes a key from the Redis store.
 *
 * This function creates a Redis client and uses it to delete the specified key.
 *
 * @param {string} path - The Redis key to remove
 */
export async function removeRedisVariable(path) {
    const redis = await createClient({ url: REDIS_URL })
        .on("error", err => console.log("Redis Client Error", err))
        .connect();
    await redis.del(path);
}
