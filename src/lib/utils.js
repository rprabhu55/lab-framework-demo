/**
 * Creates an artificial delay
 * @param {any} Time to delay in milliseconds
 * @returns {Promise<void>}
 */
export async function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
