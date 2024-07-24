import { spawn } from 'child_process';

/**
 * Handles the GET request to check if a container is running.
 * 
 * @param {Request} request - The HTTP request object.
 * @returns {Response} The HTTP response object.
 */
export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams
        const name = searchParams.get('name')
        if (!name) {
            throw new Error('Name is required');
        }
        await runDocker('ps', name)

        return new Response(JSON.stringify({ message: 'Container running' }), { status: 200 });
        
    } catch (error) {
        console.error('There has been a problem with your docker command:', error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

/**
 * Handles the POST request to start a container.
 *
 * @param {Request} request - The HTTP request object.
 * @returns {Response} The HTTP response object.
 */
export async function POST(request) {
  let body = null;

  try {
    body = await request.json();
    const { image, name } = body;

    if (!image || !name) {
      throw new Error('Image and name are required');
    }

    await runDocker('run', name.replace(/ /g, "-"), image);

    return new Response(JSON.stringify({ message: 'Container started' }), { status: 200 });

  } catch (error) {
    console.error('There has been a problem with your docker command:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

/**
 * Handles the DELETE request to stop a container.
 * 
 * @param {Request} request - The HTTP request object.
 * @returns {Response} The HTTP response object.
 */
export async function DELETE(request) {
    let body = null;
    
    try {
        body = await request.json();
        const { name } = body;
    
        if (!name) {
        throw new Error('Name is required');
        }
    
        await runDocker('rm', name);
    
        return new Response(JSON.stringify({ message: 'Container stopped' }), { status: 200 });
    
    } catch (error) {
        console.error('There has been a problem with your docker command:', error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

/**
 * Runs a docker command.
 * 
 * @param {string} cmd - The docker command to run.
 * @param {string} name - The name of the container.
 * @param {string} image - The image to use.
 * @returns {Promise} The promise object representing the result of the command.
 * @throws {Error} If the command is invalid or the container is not running.
 */
function runDocker(cmd, name, image = null) {
    console.log('runDocker', cmd, name, image);
    return new Promise((resolve, reject) => {
        let docker_cmd = [];
        let docker_name = name.replace(/ /g, "-");
        switch(cmd) {
            case 'ps':
                docker_cmd = ['ps', '-a', '--filter', `name=${docker_name}`, '--filter', 'status=running', '--quiet'];
                break;
            case 'rm':
                docker_cmd = ['rm', '-f', docker_name];
                break;
            case 'run':
                docker_cmd = ['run', '-d', '--name', docker_name, image];
                break;
            default:
                reject(new Error('Invalid command'));
        }

        const docker = spawn('docker', docker_cmd);
    
        let stdoutData = '';
        docker.stdout.on('data', (data) => {
            stdoutData += data.toString();
            console.log(`stdout: ${data}`);
        });

        docker.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject(new Error(data.toString()));
        });

        docker.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Child process exited with code ${code}`));
            } else {
                if (cmd === 'ps') {
                    if (stdoutData.trim() === '') {
                        reject(new Error('Container not running'));
                    } else {
                        console.log('Container is running');
                        resolve('Container is running');
                    }
                } else {
                    resolve();
                }
            }
        });
    });
  }
