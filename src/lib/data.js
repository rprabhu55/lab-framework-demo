import { createClient } from 'redis';
import { REDIS_URL, UDF_API_URL, REDIS_CACHE_SECONDS } from "./constants";

/**
 * Fetches data from the UDF API, and caches in Redis
 * 
 * @returns {Object} UDF data.
 * @throws {Error} If the the data cannot be fetched.
 */
export async function getUdfData(path) {

    const redis = await createClient({ url: REDIS_URL })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    let cache = await redis.json.get(path)
    if (cache) {
        console.log("loading UDF metadata from cache")
        return cache
    } else {
        console.log("loading UDF metadata from api")
        return fetch(`${UDF_API_URL}/${path}`)
            .then(r => r.json())
            .then(async data => {
                await Promise.all([
                    redis.json.set(path, '$', data),
                    redis.expire(path, REDIS_CACHE_SECONDS)
                ]);
                return data
            })
    }
}
