"use server"
export async function checkAPI(url, targetStatusCode = 200) {
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
