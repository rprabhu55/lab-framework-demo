"use client";
import React, { useState } from 'react';
import { DockerButton } from '@/app/components/dockerbutton';
import { ErrorMessage } from '@/app/components/error';
import { createContainer, stopContainer } from '@/lib/containers';
/**
 * Represents a Docker Card component.
 * @param {string} props.name - The name of the container.
 * @param {string} props.desc - The description of the container.
 * @param {string} props.image - The image of the container.
 * @param {Array} props.env - The environment variables of the container.
 * @param {Object} props.port - The port mapping of the container to the host.
 * @param {boolean} props.initialIsRunning - The initial running state of the container.
 * @returns {JSX.Element} The Docker Card component.
 */
export function DockerCard({ name, desc, image, env, port, initialIsRunning }) {

    const [isRunning, setIsRunning] = useState(initialIsRunning);
    const [error, setError] = useState(null);

    /**
     * Handles the click event.
     * 
     * @returns {Promise<void>} The promise object representing the result of the operation.
     */
    const handleClick = async () => {
        
        setError(null);
        
        try {
            if (isRunning === true) {
                await stopContainer(name);
                setIsRunning(!isRunning);
            } else {
                await createContainer(name, image, env, port);
                setIsRunning(!isRunning);
            }
        } catch (error) {
            console.error('ERROR RETURNED', error.message);
            setError(error.message);
        }
    };

    return (
        <div className="max-w-md rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{name}</div>
                <p className="text-gray-700 text-base">{desc}</p>
                <p className="text-gray-700 text-xs">
                    <b>image:</b> {image}
                </p>
                <p className="text-gray-700 text-xs">
                    {port && <><b>ports: host:</b>{port.host}, <b>container:</b>{port.container}</>}
                </p>
                <p className="text-gray-700 text-xs">
                    {env && env.map((e, i) => (
                        <span key={i}><b>{e.name}:</b> {e.value} </span>
                    ))}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <DockerButton isRunning={isRunning} onClick={handleClick} />
                {error && <ErrorMessage message={error} />}
            </div>
        </div>
    );
}