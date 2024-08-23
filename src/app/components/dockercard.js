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
    const [componentName, setComponentName] = useState('loading...');

    // Update componentName on initial load
    useEffect(() => {
        const fetchComponentName = async () => {
            try {
                setComponentName(getComponentName(name));
            } catch (error) {
                setError(error.message);
            }
        };

        fetchComponentName();
    }, [name, isRunning]);

    /**
     * Handles the click event.
     * 
     * @returns {Promise<void>} The promise object representing the result of the operation.
     */
    const handleClick = async () => {

        setError(null);
        setMsg(null);

        try {
            if (isRunning === true) {
                await stopContainer(name);
                setIsRunning(!isRunning);
                setComponentName(null);
            } else {
                await createContainer(name, image, env, port, attrs);
                setIsRunning(!isRunning);
                setComponentName(await getComponentName(name));
            }
        } catch (error) {
            console.error("ERROR RETURNED", error.message);
            setError(error.message);
        }
    };

    const handleTestClick = async () => {

        setError(null);
        setMsg(null);

        try {
            if(isRunning !== true) {
                return null;
            }
            await checkAPI(name);
            setMsg('works');
        } catch (error) {
            const errorMessage = error.message.includes('HTTP error')
                ? `API request failed with status code ${error.status}: ${error.message}`
                : error.message;
            console.error('Error occurred while running API check:', error);
            setError(errorMessage);
        }
    };

    const handleMinimizeClick = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className={`max-w-md rounded overflow-hidden shadow-lg ${isMinimized ? 'h-55' : 'h-auto'}`}>
            <DockerLogs containerName={name} showBox={showBox} setShowBox={setShowBox}/>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{name}</div>
                {!isMinimized && (
                    <>
                        {isRunning && <p className="text-gray-700 text-xs">
                            <b>container name:</b> {componentName}
                        </p>}
                        <p className="text-gray-700 text-base">{desc}</p>
                        <p className="text-gray-700 text-xs">
                            <b>image:</b> {image}
                        </p>
                        <p className="text-gray-700 text-xs">
                            {port && <><b>ports: host:</b>{port.host}, <b>container:</b>{port.container}</>}
                        </p>
                        <p className="text-gray-700 text-xs">
                            {attrs && attrs.map((a, i) => (
                                <span key={i}><b>{a.name}:</b> {a.value} </span>
                            ))}
                        </p>
                        <p className="text-gray-700 text-xs">
                            {env && env.map((e, i) => (
                                <span key={i}><b>{e.name}:</b> {e.isSecret ? "********" : e.value} </span>
                            ))}
                        </p>
                    </>
                )}
            </div>
            <div className="px-6 pt-4 pb-2 p-8">                
                <DockerStateButton isRunning={isRunning} onClick={handleClick} />
                <DockerLogsButton isRunning={isRunning} onClick={() => setShowBox(!showBox)} />
                <DockerTestButton isRunning={isRunning} onClick={handleTestClick} />
                <button 
                    className="inline-block bg-gray-500 text-white font-bold py-2 px-4 rounded m-2"
                    onClick={handleMinimizeClick}>
                    {isMinimized ? 'Details' : 'Hide Details'}
                </button>
                {error && <ErrorMessage message={error} />}
                {msg && <Message message={msg} />}
            </div>
        </div>
    );
}