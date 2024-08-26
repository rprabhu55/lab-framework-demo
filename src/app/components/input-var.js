"use client"
import { setVariable } from "@/lib/variables";
import { useState, useEffect } from "react";

/**
 * InputVariable
 * 
 * This component allows users to input a variable key and value, and then set the variable using the `setVariable` function.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.name - The variable name.
 * @param {string} props.value - The variable value.
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * // Example usage of the InputVariable component
 * <InputVariable 
 *   name="exampleKey" 
 *   value="exampleValue" 
 * />
 */
export function InputVariable({ name = "", value = "" }) {
  const [state, setState] = useState({ status: null, error: null });
  const [isDisabled, setIsDisabled] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {}, [name, value])

  const handleButtonClick = async () => {
    setIsDisabled(true);
    
    try {
      await setVariable(name, inputValue);
      setState({ status: true, error: null });
    } catch (error) {
      console.error("Error setting variable:", error);
      setState({ status: false, error: error.message });
    } finally {
      setIsDisabled(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col border border-gray-300 p-4 rounded max-w-lg">
      <span className="font-bold text-xl">Set Variable</span>
      <div className="mt-2 ml-4">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-2">{name}:</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a value..."
            className="flex-grow p-2 bg-white rounded shadow-md"
            disabled={isDisabled}
          />
        </div>
      </div>
      <div className="block m-4">
        <button 
          onClick={handleButtonClick}
          className="bg-blue-500 text-white size-min font-bold py-2 px-4 rounded"
          disabled={isDisabled}
        >
          Save
        </button>
        {state.status !== null && (
          <p className={state.status ? "text-green-500" : "text-red-500"}>
            {state.status ? "Variable set successfully!" : `Error: ${state.error}`}
          </p>
        )}
      </div>
    </div>
  );
}