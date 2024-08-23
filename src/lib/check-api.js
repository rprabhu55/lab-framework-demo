"use server"
import { getPetname, getRedisVariable } from "./variables";

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
  const petname = await getRedisVariable('petname');
  if (!petname) throw new Error('Petname is missing or invalid');

  const componentData = await getRedisVariable(`components:${petname}-${componentName}`);
  if (!componentData) throw new Error('Component data is missing or invalid');

  // check if on docker host or docker network
  const port = Object.prototype.hasOwnProperty.call(componentData, 'ports') && Object.prototype.hasOwnProperty.call(componentData.ports, 'host') ? componentData.ports.host : null;
  if (port)
    return `http://host.docker.internal:${port}`
    
  return Object.prototype.hasOwnProperty.call(componentData, 'url') ? componentData.url : `http://${componentName}`;
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
  let url;

  if (urlOrComponentName.startsWith('http://') || urlOrComponentName.startsWith('https://')) {
    url = urlOrComponentName;
  } else {
    const componentName = urlOrComponentName.replace(/ /g, "-").toLowerCase();
    url = await getComponentUrl(componentName);
  }

  try {
    const response = await fetch(url, { mode: 'cors', cache: "no-store" });
    if (response.status === targetStatusCode) {
      return true;
    } else {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error(`Failed API request: ${error.message} (HTTP status code: ${error.status})`);
  }
}
