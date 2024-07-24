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
 * @param {boolean} props.initialIsRunning - The initial running state of the container.
 * @returns {JSX.Element} The Docker Card component.
 */
export function DockerCard({ name, desc, image, initialIsRunning }) {
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
                await createContainer(name, image);
                setIsRunning(!isRunning);
            }
        } catch (error) {
            console.error('ERROR RETURNED', error.message);
            setError(error.message);
        }
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Run {name} Container</div>
                <p className="text-gray-700 text-base">{desc}</p>
                <p className="text-gray-700 text-xs">
                    <b>image:</b> {image}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <DockerButton isRunning={isRunning} onClick={handleClick} />
                {error && <ErrorMessage message={error} />}
            </div>
        </div>
    );
}