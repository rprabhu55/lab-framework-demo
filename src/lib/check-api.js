"use server"
import { getComponentName, getRedisVariable } from "./variables";

/**
 * Retrieves the URL for a given component name.
 * 
 * This function fetches the petname and component data from Redis,
 * constructs the base URL and port, and returns the full URL.
 * 
 * @param {string} componentName - The name of the component.
 * @returns {Promise<string>} - The full URL of the component.
 * @throws {Error} - Throws an error if petname or component data is missing or invalid.
 */
async function getComponentUrl(componentName) {
  const componentData = await getRedisVariable(`components:${componentName}`);
  if (!componentData) throw new Error('Component data is missing or invalid');

  const port = componentData?.ports?.host;
  if (port) return `http://host.docker.internal:${port}`;

  return componentData?.url || `http://${componentName}`;
}

/**
 * Determines the component URL to check based on the input.
 * 
 * @param {string} name - The URL or component name to check.
 * @returns {Promise<string>} - The URL to check.
 */
async function determineUrl(name) {
  const componentName = await getComponentName(name);
  return getComponentUrl(componentName);
}

/**
 * Checks the API status for a given URL or component name.
 * 
 * This function determines if the input is a URL or a component name,
 * constructs the appropriate URL, and then makes a fetch request to
 * check if the API returns the expected status code.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.componentName=null] - The name of the component (optional if URL is provided).
 * @param {string} [params.path="/"] - The path to append to the URL (default is "/").
 * @param {string} [params.url=null] - The URL to check (optional if componentName is provided).
 * @param {number} [params.targetStatusCode=200] - The expected HTTP status code (default is 200).
 * @returns {Promise<boolean>} - Returns true if the API returns the expected status code.
 * @throws {Error} - Throws an error if the API request fails or returns an unexpected status code.
 */
export async function checkAPI({ componentName = null, path = "/", url = null, targetStatusCode = 200 }) {
  if (componentName) {
    url = await determineUrl(componentName);
  }
  try {
    const response = await fetch(url + path, { mode: 'cors', cache: "no-store" });
    if (response.status === targetStatusCode) {
      return true;
    }
    console.error(`HTTP error ${response.status}: ${response.statusText}`);
    return false;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(`Failed API request: ${error.message} (HTTP status code: ${error.status})`);
  }
}

/**
 * Checks if a particular string exists in the API response for a given URL or component name.
 * 
 * This function determines if the input is a URL or a component name,
 * constructs the appropriate URL, and then makes a fetch request to
 * check if the API response contains the specified string.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.componentName=null] - The name of the component (optional if URL is provided).
 * @param {string} [params.url=null] - The URL to check (optional if componentName is provided).
 * @param {string} params.searchString - The string to search for in the response.
 * @param {number} [params.targetStatusCode=200] - The expected HTTP status code (default is 200).
 * @returns {Promise<boolean>} - Returns true if the API response contains the specified string.
 * @throws {Error} - Throws an error if the API request fails or returns an unexpected status code.
 */
export async function checkAPIResponse({ componentName = null, url = null, searchString, targetStatusCode = 200 }) {
  if (componentName) {
    url = await determineUrl(componentName);
  }

  try {
    const response = await fetch(url, { mode: 'cors', cache: "no-store" });
    if (response.status !== targetStatusCode) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const responseBody = await response.text();
    if (responseBody.includes(searchString)) {
      return true;
    } else {
      throw new Error(`String "${searchString}" not found in response`);
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(`Failed API request: ${error.message}`);
  }
}

/**
 * Checks the API status and header for a given URL or component name.
 * 
 * This function determines if the input is a URL or a component name,
 * constructs the appropriate URL, and then makes a fetch request to
 * check if the API returns the expected status code and contains the specified header.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.componentName=null] - The name of the component (optional if URL is provided).
 * @param {string} [params.url=null] - The URL to check (optional if componentName is provided).
 * @param {string} params.name - The name of the header to check.
 * @param {string} params.value - The expected value of the header.
 * @param {number} [params.targetStatusCode=200] - The expected HTTP status code (default is 200).
 * @returns {Promise<boolean>} - Returns true if the API returns the expected status code and header.
 * @throws {Error} - Throws an error if the API request fails or returns an unexpected status code or header.
 */
export async function checkAPIHeader({ componentName = null, url = null, name = '', value = '', targetStatusCode = 200 }) {
  if(componentName) 
      url = await determineUrl(componentName);

  try {
    const response = await fetch(url, { mode: 'cors', cache: "no-store" });
    if (response.status !== targetStatusCode) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const header = response.headers.get(name);
    if (header !== value) {
      throw new Error(`Header mismatch: expected ${name} to be ${value}, but got ${header}`);
    }

    return true;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(`Failed API request: ${error.message} (HTTP status code: ${error.status})`);
  }
}
