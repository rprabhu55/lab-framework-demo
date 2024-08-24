"use client"
import { setVariable } from "@/lib/variables";
import { useState, useEffect } from 'react';

/**
 * InputVariable
 * 
 * @param {string} key - the variable name
 * @param {string} value - the variable value
 * @returns {Promise}
 */
export function InputVariable({ variableKey = '', value = '' }) {
  const [state, setState] = useState({ status: null, error: null });
  const [isDisabled, setIsDisabled] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {}, [variableKey, value])

  const handleButtonClick = async () => {
    setIsDisabled(true);
    console.log('variableKey', variableKey);
    console.log('value', inputValue);
    
    // Normalize the key
    const normalizedVariableKey = variableKey.replace(/ /g, "-").toLowerCase();

    try {
      await setVariable(normalizedVariableKey, inputValue);
      setState({ status: true, error: null });
    } catch (error) {
      console.error('Error setting variable:', error);
      setState({ status: false, error: error.message });
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="flex flex-col">
      <p>{variableKey}</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a value..."
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 bg-white rounded shadow-md mb-6"
        disabled={isDisabled}
      />
      <button 
        onClick={handleButtonClick}
        className="py-2 px-4 bg-blue-500 size-min hover:bg-blue-600 text-white rounded focus:ring-indigo-500 focus:border-indigo-600 active:bg-blue-700"
        disabled={isDisabled}
      >
        Save
      </button>
      {state.status && <p className="text-green-600 font-bold">Status: Saved</p>}
      {state.error && <p className="text-red-600 font-bold">Error: {state.error}</p>}
    </div>
  );
}