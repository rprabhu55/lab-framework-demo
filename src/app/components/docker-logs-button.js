/**
 * DockerLogsButton
 * 
 * This component renders a button that displays "Logs" if the Docker container is running.
 * 
 * @param {Boolean} props.isRunning - Indicates whether the Docker container is running.
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @returns {JSX.Element|null} - The rendered button component or null if the container is not running.
 */
export function DockerLogsButton({ isRunning, onClick }) {
  if (!isRunning) {
    return null;
  }

  return (
    <button
      className="inline-block bg-slate-500 text-white font-bold py-2 px-4 rounded m-2"
      onClick={onClick}
    >
      Logs
    </button>
  );
}