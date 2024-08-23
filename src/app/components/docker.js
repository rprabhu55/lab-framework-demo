import { DockerCard } from "@/app/components/dockercard";
import { getContainerStatus } from "@/lib/containers";
import { getVariable } from "@/lib/variables";

/**
 * Docker component
 * 
 * @param {Object} props
 * @param {String} props.name
 * @param {String} props.desc
 * @param {String} props.image
 * @returns {JSX.Element}
 */
export async function Docker ({ name = "", desc = "", image = "", env = [], port = null, attrs = [] }) {

    // process variables in the env object
    for (let i = 0; i < env.length; i++) {
        if (env[i].isVariable) {
            env[i].value = await getVariable(env[i].name);
        }
    }
    
    const isRunning = await getContainerStatus(name)

    return (
        <div className="container mx-auto">
            <DockerCard 
                name={name} 
                desc={desc} 
                image={image} 
                env={env}
                port={port}
                attrs={attrs}
                initialIsRunning={isRunning}/>
        </div>
    )
}