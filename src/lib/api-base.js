"use client"
import { checkAPI } from '@/lib/check-api';
import { useState } from 'react';

/**
 * APIBase component
 * 
 * This component provides a button to perform an API check and displays the result.
 * It uses the checkAPI function to perform the check and updates the component state based on the result.
 * 
 * @param {Object} props - The properties object.
 * @param {string} [props.componentName=null] - The name of the component to check.
 * @param {string} [props.headerName=null] - The name of the header to check.
 * @param {string} [props.headerValue=null] - The value of the header to check.
 * @param {string} [props.searchString=null] - The search string to use in the API check.
 * @param {string} [props.path='/'] - The path to append to the URL for the API check.
 * @param {number} [props.targetStatusCode=200] - The expected HTTP status code from the API check.
 * @param {string} [props.url=null] - The URL to check.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export function APIBase({ 
    componentName = null,
    headerName = null,
    headerValue = null,
    searchString = null,
    path ="/", 
    targetStatusCode = 200,
    url = null  
  }) {
  const [state, setState] = useState({ status: null, error: null });

  /**
   * Handles the API check and updates the state accordingly
   * 
   * This function calls the checkAPI function with the input value (URL or component name), 
   * and updates the component state based on the result of the API check.
   */
  const handleCheck = async () => {
    try {
      await checkAPI({ componentName, headerName, headerValue, searchString, path, targetStatusCode, url});
      setState({ status: true, error: null });
    } catch (error) {
      const errorMessage = "The API check failed"
      setState({ status: false, error: errorMessage });
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleCheck}
        className="py-2 px-4 size-min bg-blue-500 hover:bg-blue-600 text-white rounded focus:ring-indigo-500 focus:border-indigo-600 active:bg-blue-700"
        >Check</button>
      {state.status && <p className="text-green-600 font-bold">Status: 200</p>}
      {state.error && <p className="text-red-600 font-bold">Error: {state.error}</p>}
    </div>
  )
}
