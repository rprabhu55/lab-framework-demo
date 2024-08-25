import { DockerCard } from "@/app/components/dockercard";
import { getContainerStatus } from "@/lib/containers";
import { getVariable } from "@/lib/variables";

/**
 * Docker component
 * 
 * This component renders a DockerCard with the provided properties and fetches the container status.
 * It also processes environment variables if they are marked as variables.
 * 
 * @param {Object} props - The properties object.
 * @param {String} props.name - The name of the Docker container.
 * @param {String} props.desc - The description of the Docker container.
 * @param {String} props.image - The image of the Docker container.
 * @param {Array} props.env - The environment variables for the Docker container.
 * @param {Number|null} props.port - The port number for the Docker container.
 * @param {Array} props.attrs - Additional attributes for the Docker container.
 * @returns {JSX.Element} - The rendered Docker component.
 * 
 * @example
 * // Example usage of the Docker component
 * <Docker 
 *   name="example-container" 
 *   desc="This is an example Docker container." 
 *   image="example-image" 
 *   env={[{ name: "ENV_VAR", value: "value", isVariable: false }]} 
 *   port={{host: 55055, container: 80}} 
 *   attrs={["attr1", "attr2"]} 
 * />
 */
export async function Docker({ name = "", desc = "", image = "", env = [], port = null, attrs = [] }) {

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
        initialIsRunning={isRunning} />
    </div>
  )
}