/**
 * DockerTestButton
 * 
 * @param {Boolean} props.isRunning
 * @param {Function} props.onClick
 * @returns {JSX.Element}
 */
export function DockerTestButton({ isRunning, onClick }) {
  if(!isRunning) {
    return null;
  }

  return (
    <button
    className="inline-block bg-sky-500 text-white font-bold py-2 px-4 rounded m-2"
    onClick={onClick}
    >
      Test
    </button>
  )
}