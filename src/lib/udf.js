/**
 * Helper methods to interact with the UDF metadata api and labinfo api
 * The fetch methods will obtain the requested variable from the desired api
 * and then store the key:value in Redis for future lookups since the udf apis are static
 */

import { LABINFO_API_URL, UDF_DEPLOYMENT_API_URL } from "./constants";
import { setRedisVariable } from "./redis";

/**
 * Recursively searches a JSON object for a key that matches the specified key and returns its value.
 *
 * @param {Object} obj - The JSON object to search.
 * @param {string} key - The key to search for in the JSON object.
 * @returns {any} - The value associated with the specified key, or null if the key is not found.
 *
 * @example
 * const data = {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: {
 *       e: 3
 *     }
 *   }
 * };
 * const value = findValueByKey(data, 'e'); // returns 3
 */
function findValueByKey(obj, key) {
  if (obj == null || typeof obj !== 'object') {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  }

  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const result = findValueByKey(obj[k], key);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

/**
 * Pull metadata from the labinfo API
 * 
 * @param {string} variableName - The name of the variable to look up
 * @returns {Promise<any>} - The value of the variable from the API response, or null if not found
 */
async function fetchInfo(url, variableName) {
  try {
    const response = await fetch(url, { mode: 'cors', cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Search for the variableName in the response body
    const variableValue = findValueByKey(data, variableName);
    return variableValue;
  } catch (error) {
    console.error('Error fetching lab info:', error);
    return null;
  }
}

/**
 * Fetches lab information from the LABINFO API and stores it in Redis.
 * 
 * @param {string} variableName - The name of the variable to look up.
 * @returns {Promise<any>} - The value of the variable from the API response.
 */
export async function fetchLabInfo(variableName) {
  if(variableName === undefined){
    return null;
  } 
  const variableValue = await fetchInfo(LABINFO_API_URL, variableName);
  if (variableValue === undefined || variableValue === null) {
    return null;
  }
  
  await setRedisVariable(variableName, variableValue).catch(error => {
  console.error('Unable to store the lab info in redis: ', error.message);
  });
  return variableValue;
}

/**
 * Fetches UDF information from the UDF API and stores it in Redis.
 * 
 * @param {string} variableName - The name of the variable to look up.
 * @returns {Promise<any>} - The value of the variable from the API response.
 */
export async function fetchUDFInfo(variableName) {
  /** 
   * todo: the udf api has multiple paths depending on what you're looking for.
   *       need to add logic that will look for the variable across all paths
   */ 
  const variableValue = await fetchInfo(UDF_DEPLOYMENT_API_URL, variableName);
  await setRedisVariable(variableName, variableValue).catch(error => {
  console.error('Unable to store the lab info in redis: ', error.message);
  });
  return variableValue;
}