import { fetchUDFInfo } from "@/lib/udf";

const UDF_DEPLOYMENT_PATH = "deployment"

/**
 * UdfDeploymentMetadata component
 * @returns {JSX.Element} displaying deployment metadata from the UD API.
 */
export async function UdfDeploymentMetadata() {
  const data = await fetchUDFInfo(UDF_DEPLOYMENT_PATH)
  if (!data) return "Loading...";

  return (
    <div className="container mx-auto">
      <div className="max-w-fit rounded overflow-scroll shadow-2xl">
        <div className="font-bold text-xl mb-2">UDF Deployment Info</div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div >
  );
}
