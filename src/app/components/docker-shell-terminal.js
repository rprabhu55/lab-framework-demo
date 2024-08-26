"use client"
import React, { useState, useRef, useEffect } from "react";
import { execShellCommand } from "@/lib/containers";

/**
 * DockerShellTerminal component to interact with the Docker container shell.
 * @param {string} props.containerId - The ID of the container.
 * @returns {JSX.Element} The DockerShellTerminal component.
 */
export function DockerShellTerminal({ containerId }) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const outputRef = useRef(null);

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };
  
  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    const enteredCommand = command;
    setOutput((prevOutput) => `${prevOutput}\n$ ${enteredCommand}`);
    setCommand("");
    try {
      const result = await execShellCommand(containerId, enteredCommand);
      setOutput((prevOutput) => `${prevOutput}\n${result}`);
    } catch (error) {
      setOutput((prevOutput) => `${prevOutput}\nError: ${error.message}`);
    }
  };
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);
  
  return (
    <div
      className={`${
        isFullScreen ? "fixed top-0 left-0 w-full h-full z-50 bg-black" : "relative"
      } flex flex-col`}
    >
      <div className="font-bold text-xl mt-4 mb-2">Exec</div>
      <div
        ref={outputRef}
        className={`bg-black text-white p-2 overflow-y-scroll ${
          isFullScreen ? "flex-1 h-full" : "h-72"
        }`}
      >
        <pre>{output}</pre>
      </div>
      <form
        onSubmit={handleCommandSubmit}
        className="flex items-center p-2"
      >
        <input
          type="text"
          value={command}
          onChange={handleCommandChange}
          className="flex-1 border border-gray-300 p-1"
        />
        <button
          className="inline-block bg-gray-500 text-white font-bold py-1 px-2 rounded m-2 text-sm"
          type="submit"
        >
          Run
        </button>
        <button
          className="inline-block bg-gray-500 text-white font-bold py-1 px-2 rounded m-2 text-sm whitespace-nowrap"
          type="button"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </form>
    </div>
  );
}