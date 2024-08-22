"use client"
import { checkAPI } from '@/lib/check-api';
import { useState } from 'react';

export function APICheck({url = ''}) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {

    let response;
      try {
        response = await checkAPI(url)
        setStatus(true);
        setError(null);
      } catch (error) {
        setStatus(false);
        if (error.message.includes('HTTP error')) { 
            setError(`API request failed with status code ${error.status}: ${error.message}`);
        } else {
        console.error('Error occurred while running API check:', error);
        setError(error.message); 
        }
      }
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={url}
        placeholder="Enter a URL to test..."
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 bg-white rounded shadow-md mb-6"
        disabled
      />
      <button 
      onClick={handleCheck}
      className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded focus:ring-indigo-500 focus:border-indigo-600 active:bg-blue-700">
        Check</button>
        {status && <p className="text-green-600 font-bold">Status: 200</p>}
        {error && <p className="text-red-600 font-bold">Error: {error}</p>}
    </div>
  );
}
