"use server"
/**
 * Utility functions for interacting with environment variables and Redis.
 */

import { PETNAME_API_URL } from "./constants";
import { fetchRedisVariable, setRedisVariable } from "./redis";
import { fetchLabInfo, fetchUDFInfo } from "./udf";

/**
 * Returns a normalized component name prefixed with petname
 * 
 * @param {string} - a name
 * @return {string} - a unique and normalized component name
 */
export async function getComponentName(name){
    try {
        const petname = await getPetname();
        return petname + "-" + name.replace(/ /g, "-").toLowerCase();
    } catch(error) {
        throw new Error("Error getting component name: ", error.message)
    }
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
 * Retrieves a random pet name from the UDF pet name service.
 * 
 * @returns {string} A random pet name
 */
export async function getPetname() {
    const petnameKey = "petname";
    let petname = await fetchRedisVariable(petnameKey);
    if (petname) {
        return petname;
    }
    try {
        // Fetch pet name from external service
        const response = await fetch(PETNAME_API_URL, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to retrieve petname from ${PETNAME_API_URL}`);
        }
        const petData = await response.json();
        petname = petData[petnameKey];
        await setRedisVariable(petnameKey, petname);
    return petname;
    } catch (error) {
        console.error("Error fetching pet name:", error);
    }
    return null;
}

/**
 * Retrieves a variable by first checking the following sources:
 *  - environment variables 
 *  - Redis
 *  - LabInfo API
 *  - UDF API
 *
 * @param {string} name - The name of the variable to retrieve
 * @returns {string|null} The value of the variable, or null if it does not exist
 */
export async function getVariable(name) {
    const sources = [getEnvVariable, fetchRedisVariable, fetchLabInfo, fetchUDFInfo];
    if (name === null) return null;
    for (const source of sources) {
        const value = await source(name);
        if (value) {
            return value;
        }
    }

    return null;
}

/**
 * Sets a variable in the storage.
 *
 * @param {string} key - The key of the variable to set
 * @param {string} value - The value of the variable to set
 
 */
export async function setVariable(key, value) {
    await setRedisVariable(key, value);
}

