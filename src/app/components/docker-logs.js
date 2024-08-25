import React, { useState, useEffect } from 'react';
import { getContainerLogs } from '@/lib/containers';

/**
 * DockerLogs component
 * 
 * This component fetches and displays the logs of a specified Docker container.
 * It shows a box with the logs when `showBox` is true and hides it when `showBox` is false.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.containerName - The name of the Docker container to fetch logs for.
 * @param {boolean} props.showBox - A flag indicating whether to show the logs box.
 * @param {Function} props.setShowBox - A function to update the `showBox` state.
 * @returns {JSX.Element} - The rendered component.
 */
export function DockerLogs({ containerName, showBox, setShowBox }) {
    const [containerLogs, setContainerLogs] = useState(false);

    useEffect(() => {
        const fetchLogs = async () => {
            if (showBox && containerName) {
                const logs = await getContainerLogs(containerName);
                setContainerLogs(logs);
            }
        };

        fetchLogs();
    }, [showBox, containerName]);

    const closeBox = () => {
        setShowBox(false);
    };

    return (
        <div className="relative">
            {showBox && (
                <div className="fixed inset-0 bg-white border border-gray-300 p-4 shadow-lg flex flex-col max-h-screen overflow-auto z-50">
                    <button 
                        onClick={closeBox} 
                        className="self-end bg-red-500 text-white px-2 py-1 rounded"
                    >
                        X
                    </button>
                    <div className="flex-grow">
                        <pre className="whitespace-pre-wrap bg-black text-white p-2 rounded">
                            <code>
                                {containerLogs}
                            </code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}