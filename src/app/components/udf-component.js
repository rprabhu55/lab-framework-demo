import { fetchUdfComponentWebShell } from "@/lib/udf";
import dynamic from "next/dynamic";

const UDFComponentButton = dynamic(() => import("../components/udf-component-button"), { ssr: false });

/**
 * Asynchronously fetches the web shell URL for a given UDF component name.
 *
 * @param {string} componentName - The name of the UDF component.
 * @returns {Promise<string|null>} - A promise that resolves to the web shell URL or null if not found.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
async function getWebShellUrl(componentName) {
  try {
    if (componentName === null) {
      console.error('componentName must be defined');
      return;
    }
    const webShellUrl = await fetchUdfComponentWebShell(componentName);
    return webShellUrl || null;
  } catch (error) {
    console.error("Error fetching UDF component web shell URL:", error);
    throw error; // Re-throw the error after logging it
  }
}

/**
 * A React component that renders a UDF component with a button to access its web shell.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the UDF component.
 * @returns {JSX.Element} - The rendered component.
 */
async function UDFComponent({ name }) {
  const webShellUrl = await getWebShellUrl(name);

  return (
    <div className={`max-w-md rounded overflow-hidden shadow-lg h-55`}>
      <div className="px-4 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <UDFComponentButton webShellUrl={webShellUrl} />
      </div>
    </div>
  );
}

export default UDFComponent;