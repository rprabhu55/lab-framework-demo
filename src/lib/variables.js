"use server";
import { createClient } from 'redis';
import { REDIS_URL } from "./constants";

export async function GetVariable({ name }) {
    return process.env[name] || null;
}

export async function GetUsername() {
    return process.env.USERNAME || null;
}


/**
 * Fetches data from the Redis store
 * 
 * @returns {Object} UDF data.
 * @throws {Error} If the the data cannot be fetched.
 */
export async function getRedisVariable(path) {
    const redis = await createClient({ url: REDIS_URL })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    return await redis.json.get(path)
}
