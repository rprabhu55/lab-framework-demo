import Redis from "ioredis";

const REDIS_URL = "redis"
const UDF_API_URL = "http://metadata.udf"

const redis = new Redis(REDIS_URL);

/**
 * Fetches data from the UDF API, and caches in Redis
 * 
 * @returns {Object} UDF data.
 * @throws {Error} If the the data cannot be fetched.
 */
export async function getUdfData(path) {

    let start = Date.now();
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
                redis.set(path, JSON.stringify(result.data), "EX", 60)
                return result
            })
    }
}
