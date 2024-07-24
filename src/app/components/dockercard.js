"use client";
import React, { useState } from 'react';
import { DockerButton } from '@/app/components/dockerbutton';
import { ErrorMessage } from '@/app/components/error';
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
     * Handles the click event of the Docker Card component.
     * Calls the API to start or stop the container based on its running state.
     * @returns {Promise<void>} A Promise that resolves when the API call is complete.
     */
    const handleClick = async () => {
        setError(null);

        // call API to stop container
        if (isRunning === true) {
            const res = await fetch('/api/containers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            if (res.status === 500) {
                const errorData = await res.json();
                setError(errorData.message);
            } else {
                setIsRunning(!isRunning);
            }
            return;
        }

        // call API to run container
        const res = await fetch('/api/containers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image, name }),
        });
        if (res.status === 500) {
            const errorData = await res.json();
            setError(errorData.message);
        } else {
            setIsRunning(!isRunning);
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