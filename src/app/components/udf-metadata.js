import { getUdfData } from '@/lib/data';

const UDF_DEPLOYMENT_PATH = "deployment"

/**
 * Docker component
 * 
 * @returns {JSX.Element}
 */
export async function UdfMetadata() {
    const { data, error } = await getUdfData(UDF_DEPLOYMENT_PATH)
    // const data = await fetch(`${process.env.APIpath}/api/udf`)
    if (error) return "An error has occurred.";
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
