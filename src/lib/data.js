import { createClient } from 'redis';
import { REDIS_URL, UDF_API_URL, REDIS_CACHE_SECONDS } from "./constants";

/**
 * Fetches data from the UDF API, and caches in Redis
 * 
 * @returns {Object} UDF data.
 * @throws {Error} If the the data cannot be fetched.
 */
export async function getUdfData(path) {

    let start = Date.now();
    const redis = await createClient({ url: REDIS_URL })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    let cache = await redis.get(path)
    cache = JSON.parse(cache)
    let result = {}
    if (cache) {
        console.log("loading UDF metadata from cache")
        result.data = cache
        result.type = "redis"
        result.latency = Date.now() - start;
        return result
    } else {
        console.log("loading from api")
        start = Date.now();
        return fetch(`${UDF_API_URL}/${path}`)
            .then(r => r.json())
            .then(data => {
                result.data = data
                result.type = "api"
                result.latency = Date.now() - start;
                redis.set(path, JSON.stringify(result.data), { EX: REDIS_CACHE_SECONDS })
                return result
            })
    }
}
