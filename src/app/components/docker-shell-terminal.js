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

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div>
      <div
        ref={outputRef}
        style={{ backgroundColor: "#000", color: "#fff", padding: "10px", height: "300px", overflowY: "scroll" }}
      >
        <pre>{output}</pre>
      </div>
      <form onSubmit={handleCommandSubmit}>
        <input
          type="text"
          value={command}
          onChange={handleCommandChange}
          placeholder="Enter command"
          style={{ width: "80%" }}
        />
        <button type="submit">Run</button>
      </form>
    </div>
  );
}