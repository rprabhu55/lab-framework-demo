"use client"
import { checkAPIHeader } from '@/lib/check-api';
import { useState } from 'react';

/**
 * APIHeaderCheck component
 * 
 * This component allows users to check the status of an API by providing either a URL or a component name.
 * It displays the status of the API check and any error messages if the check fails.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL to check (optional if componentName is provided).
 * @param {string} [props.componentName=null] - The component name to check (optional if URL is provided).
 * @returns {JSX.Element} - The rendered component.
 */
export function APIHeaderCheck({ componentName = null, name = null, value = null, path = "/", url = '', statusCode = 200 }) {
  const [state, setState] = useState({ status: null, error: null });

  /**
   * Handles the API check and updates the state accordingly.
   * 
   * This function calls the checkAPI function with the input value (URL or component name),
   * and updates the component state based on the result of the API check.
   */
  const handleCheck = async () => {
    try {
      await checkAPIHeader({componentName, name, value, path, url, statusCode});
      setState({ status: true, error: null });
    } catch (error) {
      const errorMessage = "The API header check failed"
      setState({ status: false, error: errorMessage });
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <p><b>Header Name:</b> {name}</p>
        <p><b>Header Value:</b> {value}</p>
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
