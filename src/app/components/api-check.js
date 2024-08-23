"use client"
import { checkAPI } from '@/lib/check-api';
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
 * @returns {JSX.Element} - The rendered component.
 */
export function APICheck({ url = '', componentName = null }) {
  const [state, setState] = useState({ status: null, error: null });
  const inputValue = componentName || url;

  /**
   * Handles the API check and updates the state accordingly.
   * 
   * This function calls the checkAPI function with the input value (URL or component name),
   * and updates the component state based on the result of the API check.
   */
  const handleCheck = async () => {
    try {
      await checkAPI(inputValue);
      setState({ status: true, error: null });
    } catch (error) {
      const errorMessage = error.message.includes('HTTP error')
        ? `API request failed with status code ${error.status}: ${error.message}`
        : error.message;
      console.error('Error occurred while running API check:', error);
      setState({ status: false, error: errorMessage });
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={inputValue}
        placeholder="Enter a URL to test..."
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 bg-white rounded shadow-md mb-6"
        disabled
      />
      <button 
        onClick={handleCheck}
        className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded focus:ring-indigo-500 focus:border-indigo-600 active:bg-blue-700"
      >
        Check
      </button>
      {state.status && <p className="text-green-600 font-bold">Status: 200</p>}
      {state.error && <p className="text-red-600 font-bold">Error: {state.error}</p>}
    </div>
  );
}
