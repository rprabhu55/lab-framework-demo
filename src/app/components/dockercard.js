"use client";
import React, { useState, useEffect } from "react";
import { DockerStateButton } from "@/app/components/docker-state-button";
import { DockerLogsButton } from "@/app/components/docker-logs-button";
import { DockerTestButton } from "@/app/components/docker-test-button";
import { DockerLogs } from "@/app/components/docker-logs";
import { ErrorMessage } from "@/app/components/error";
import { createContainer, stopContainer } from "@/lib/containers";
import { checkAPI } from "@/lib/check-api";
import { Message } from "@/app/components/msg"
import { getComponentName } from "@/lib/variables";
import { DockerShellTerminal } from "@/app/components/docker-shell-terminal"; // Import the new component


/**
 * Represents a Docker Card component.
 * @param {string} props.name - The name of the container.
 * @param {string} props.desc - The description of the container.
 * @param {string} props.image - The image of the container.
 * @param {Array} props.env - The environment variables of the container.
 * @param {Object} props.port - The port mapping of the container to the host.
 * @param {Array} props.attrs - The attributes of the container.
 * @param {boolean} props.initialIsRunning - The initial running state of the container.
 * @returns {JSX.Element} The Docker Card component.
 */
export function DockerCard({ name, desc, image, env, port, attrs, initialIsRunning }) {

  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [isMinimized, setIsMinimized] = useState(true)
  const [showBox, setShowBox] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [componentName, setComponentName] = useState("loading...");

  // Reusable function to fetch component name
  const fetchComponentName = async (containerName) => {
    try {
      const name = await getComponentName(containerName);
      setComponentName(name);
    } catch (error) {
      setError(error.message);
    }
  };

  // Update componentName on initial load
  useEffect(() => {
    if (isRunning) {
      fetchComponentName(name);
    }
  }, [name, isRunning]);

  /**
   * Handles the click event.
   * 
   * @returns {Promise<void>} The promise object representing the result of the operation.
   */
  const handleActionClick = async () => {
    setError(null);
    setMsg(null);

    try {
      if (isRunning) {
        await stopContainer(name);
        setComponentName(null);
      } else {
        await createContainer(name, image, env, port, attrs);
        await fetchComponentName(name);
      }
      setIsRunning(!isRunning);
    } catch (error) {
      console.error("ERROR RETURNED", error.message);
      setError(error.message);
    }
  };

  const handleTestClick = async () => {
    setError(null);
    setMsg(null);

    if (!isRunning) {
      return;
    }

    try {
      await checkAPI(name);
      setMsg("works");
    } catch (error) {
      const errorMessage = error.message.includes("HTTP error")
        ? `API request failed with status code ${error.status}: ${error.message}`
        : error.message;
      console.error("Error occurred while running API check:", error);
      setError(errorMessage);
    }
  };

  const handleMinimizeClick = () => {
    setIsMinimized(!isMinimized);
    setError(null);
    setMsg(null);
  };

  return (
    <div className={`max-w-md rounded overflow-hidden shadow-lg ${isMinimized ? "h-55" : "h-auto"}`}>
      <DockerLogs containerName={name} showBox={showBox} setShowBox={setShowBox} />
      <div className="px-4 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        {!isMinimized && (
          <>
            {isRunning && (
              <div className="text-gray-700 text-xs mb-2">
                <b>container name:</b> {componentName}
              </div>
            )}
            <div className="text-gray-700 text-base mb-2">{desc}</div>
            
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-xs mb-2">
              <div className="col-span-4">
                <b>image:</b> {image}
              </div> 
              {port && (
                <div className="col-span-4">
                  <b>ports: host:</b> {port.host}, <b>container:</b> {port.container}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-700 text-xs mb-2">
              {attrs && attrs.map((a, i) => (
                <div key={i}>
                  <b>{a.name}:</b> {a.value}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-xs mb-2">
              {env && env.map((e, i) => (
                <div key={i}>
                  <b>{e.name}:</b> {e.isSecret ? "********" : e.value}
                </div>
              ))}
            </div>

            <DockerShellTerminal containerId={componentName} /> {/* Add the new component */}
          </>
        )}
      </div>
      <div className="px-6 pt-4 pb-2 p-8">
        <DockerStateButton isRunning={isRunning} onClick={handleActionClick} />
        <DockerLogsButton isRunning={isRunning} onClick={() => setShowBox(!showBox)} />
        <DockerTestButton isRunning={isRunning} onClick={handleTestClick} />
        <button
          className="inline-block bg-gray-500 text-white font-bold py-2 px-4 rounded m-2"
          onClick={handleMinimizeClick}>
          {isMinimized ? "Details" : "Hide Details"}
        </button>
        {error && <ErrorMessage message={error} />}
        {msg && <Message message={msg} />}
      </div>
    </div>
  );
}