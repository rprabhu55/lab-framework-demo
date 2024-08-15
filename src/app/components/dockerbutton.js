"use client";

/**
* DockerButton component
*
* @param {Boolean} props.isRunning
* @param {Function} props.onClick
* @returns {JSX.Element}
*/
export function DockerButton({ isRunning, onClick }) {
    const getButtonColor = () => {
        if (isRunning === null) return "bg-green-500"
        return isRunning ? "bg-red-500" : "bg-green-500"
    }

    return (
        <button
            className={"inline-block ".concat(getButtonColor(), " text-white font-bold py-2 px-4 rounded")}
            onClick={() => onClick()}
        >
            {isRunning ? "Stop" : "Run"}
        </button>
    )
}
