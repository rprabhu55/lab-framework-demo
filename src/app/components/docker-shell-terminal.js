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
    <div style={{ position: isFullScreen ? "fixed" : "relative", top: 0, left: 0, width: isFullScreen ? "100%" : "auto", height: isFullScreen ? "100%" : "auto", zIndex: isFullScreen ? 1000 : "auto", backgroundColor: isFullScreen ? "#000" : "transparent" }}>
      <div className="font-bold text-xl mt-4 mb-2">Exec</div>
      <div
        ref={outputRef}
        style={{ backgroundColor: "#000", color: "#fff", padding: "10px", height: isFullScreen ? "calc(100% - 50px)" : "300px", overflowY: "scroll" }}
      >
        <pre>{output}</pre>
      </div>
      <form onSubmit={handleCommandSubmit} style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={command}
          onChange={handleCommandChange}
          className="flex-1 border border-gray-300"
        />
        <button className="inline-block bg-gray-500 text-white font-bold py-1 px-2 rounded m-2 text-sm" type="submit">Run</button>
        <button className="inline-block bg-gray-500 text-white font-bold py-1 px-2 rounded m-2 text-sm" type="button" onClick={toggleFullScreen}>
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
      </form>
    </div>
  );
}