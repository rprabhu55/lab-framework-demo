"use client"
import { checkAPIResponse } from '@/lib/check-api';
import { useState } from 'react';

/**
 * APICheck component
 * 
 * This component allows users to check the status of an API by providing either a URL or a component name.
 * It displays the status of the API check and any error messages if the check fails.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL to check (optional if componentName is provided).
 * @param {string} [props.componentName=null] - The component name to check (optional if URL is provided).
 * @param {string} props.searchString - The string to search for in the response.
 * @param {number} [props.targetStatusCode=200] - The expected HTTP status code (default is 200).
 * @returns {JSX.Element} - The rendered component.
 */
export function APIResponseCheck({ url = null, componentName = null, path = '/', searchString, targetStatusCode = 200 }) {
  const [state, setState] = useState({ status: null, error: null });

  /**
   * Handles the API check and updates the state accordingly.
   * 
   * This function calls the checkAPIResponse function with the input value (URL or component name),
   * and updates the component state based on the result of the API check.
   */
  const handleCheck = async () => {
    try {
      const result = await checkAPIResponse({ url, componentName, path, searchString, targetStatusCode });
      setState({ status: result, error: null });
    } catch (error) {
      const errorMessage = "The API check failed: " + error.message;
      setState({ status: false, error: errorMessage });
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <p><b>Response String:</b> {searchString}</p>
      </div>
      <button 
        onClick={handleCheck}
        className="py-2 px-4 size-min bg-blue-500 hover:bg-blue-600 text-white rounded focus:ring-indigo-500 focus:border-indigo-600 active:bg-blue-700"
      >
        Check
      </button>
      {state.status && <p className="text-green-600 font-bold">Status: 200</p>}
      {state.error && <p className="text-red-600 font-bold">Error: {state.error}</p>}
    </div>
  );
}
