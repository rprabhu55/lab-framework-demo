import { DockerCard } from "@/app/components/dockercard";
import { getContainerStatus } from "@/lib/containers";

/**
 * Docker component
 * 
 * @param {Object} props
 * @param {String} props.name
 * @param {String} props.desc
 * @param {String} props.image
 * @returns {JSX.Element}
 */
export async function Docker ({ name, desc, image}) {
    console.log('name', name)
    const isRunning = await getContainerStatus(name)
    console.log('getInitialIsRunningState', isRunning)
    return (
        <div className="container mx-auto">
            <DockerCard name={name} desc={desc} image={image} initialIsRunning={isRunning}/>
        </div>
    )
}