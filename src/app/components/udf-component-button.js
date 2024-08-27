"use client";
/**
 * A React component that renders a button to open a web shell URL in a new tab.
 *
 * @param {Object} props - The component props.
 * @param {string} props.webShellUrl - The URL of the web shell to be opened.
 * @returns {JSX.Element} - The rendered button component.
 */
function UDFComponentButton({ webShellUrl }) {
  /**
   * Handles the button click event by opening the web shell URL in a new tab.
   */
  const handleButtonClick = () => {
    console.log("Opening web shell URL:", webShellUrl);
    if (webShellUrl) {
      window.open(webShellUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Open Web Shell
    </button>
  );
}

export default UDFComponentButton;