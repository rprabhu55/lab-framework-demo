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
 * Determines the URL to check based on the input.
 * 
 * @param {string} urlOrComponentName - The URL or component name to check.
 * @returns {Promise<string>} - The URL to check.
 */
async function determineUrl(urlOrComponentName) {
  if (urlOrComponentName.startsWith('http://') || urlOrComponentName.startsWith('https://')) {
    return urlOrComponentName;
  }
  const componentName = await getComponentName(urlOrComponentName);
  return getComponentUrl(componentName);
}

/**
 * Checks the API status for a given URL or component name.
 * 
 * This function determines if the input is a URL or a component name,
 * constructs the appropriate URL, and then makes a fetch request to
 * check if the API returns the expected status code.
 * 
 * @param {string} urlOrComponentName - The URL or component name to check.
 * @param {number} [targetStatusCode=200] - The expected HTTP status code (default is 200).
 * @returns {Promise<boolean>} - Returns true if the API returns the expected status code.
 * @throws {Error} - Throws an error if the API request fails or returns an unexpected status code.
 */
export async function checkAPI(urlOrComponentName, targetStatusCode = 200) {
  const url = await determineUrl(urlOrComponentName);

  try {
    const response = await fetch(url, { mode: 'cors', cache: "no-store" });
    if (response.status !== targetStatusCode) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(`Failed API request: ${error.message} (HTTP status code: ${error.status})`);
  }
}

/**
 * Checks the API status and header for a given URL or component name.
 * 
 * This function determines if the input is a URL or a component name,
 * constructs the appropriate URL, and then makes a fetch request to
 * check if the API returns the expected status code and contains the specified header.
 * 
 * @param {string} urlOrComponentName - The URL or component name to check.
 * @param {string} headerName - The name of the header to check.
 * @param {string} headerValue - The expected value of the header.
 * @param {number} [targetStatusCode=200] - The expected HTTP status code (default is 200).
 * @returns {Promise<boolean>} - Returns true if the API returns the expected status code and header.
 * @throws {Error} - Throws an error if the API request fails or returns an unexpected status code or header.
 */
export async function checkAPIHeader(urlOrComponentName, headerName, headerValue, targetStatusCode = 200) {
  const url = await determineUrl(urlOrComponentName);

  try {
    const response = await fetch(url, { mode: 'cors', cache: "no-store" });
    if (response.status !== targetStatusCode) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const header = response.headers.get(headerName);
    if (header !== headerValue) {
      throw new Error(`Header mismatch: expected ${headerName} to be ${headerValue}, but got ${header}`);
    }

    return true;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(`Failed API request: ${error.message} (HTTP status code: ${error.status})`);
  }
}
