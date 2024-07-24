import { DockerCard } from "@/app/components/dockercard";

/**
 * Get the initial state of the container
 * 
 * @param {String} name 
 * @returns {Boolean}
 */
async function getInitialIsRunningState(name) {
    const res = await fetch(
        'http://localhost:3000/api/containers?name=' + name.replace(/ /g, "-"), 
        {
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    console.log('STATUS CODE', res.status)
    return (res.status === 200) ? true : false
}

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
    const isRunning = await getInitialIsRunningState(name)
    console.log('getInitialIsRunningState', isRunning)
    return (
        <div className="container mx-auto">
            <DockerCard name={name} desc={desc} image={image} initialIsRunning={isRunning}/>
        </div>
    )
}