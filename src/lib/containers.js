"use server"
import { spawn } from 'child_process';

/**
 * Runs a Docker command and handles the promise resolution and rejection.
 * 
 * @param {String} command - The Docker command to run.
 * @param {String} name - The name of the container.
 * @param {String} [image] - The image to use (optional).
 * @param {Array} [env] - The environment variables to set (optional).
 * @param {Object} [port] - The port mapping to use (optional).
 * @param {Array} [attrs] - The attributes of the container (optional).
 * @returns {Promise} The promise object representing the result of the command.
 */
async function runDockerCommand(command, name, image, env, port, attrs) {

    return new Promise((resolve, reject) => {
        let docker_cmd = [];
        const docker_name = name.replace(/ /g, "-");
        
        switch(command) {
            case 'ps':
                docker_cmd = ['ps', '-a', '--filter', `name=${docker_name}`, '--filter', 'status=running', '--quiet'];
                break;
            case 'rm':
                docker_cmd = ['rm', '-f', docker_name];
                break;
            case 'run':
                docker_cmd = [
                    'run', '-d','--name',docker_name,
                    ...env.map(({ name, value }) => `--env=${name}=${value}`),
                    ...port ? ['-p', `${port.host}:${port.container}`] : [],
                    ...attrs.map(({ name, value }) => `--${name}=${value}`),
                    image
                ]
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
                if (command === 'ps') {
                    if (stdoutData.trim() === '') {
                        reject(new Error('Container not running'));
                    } else {
                        console.log('Container is running');
                        resolve(true);
                    }
                } else {
                    resolve(true);
                }
            }
        });
    });
}

/**
 * Handles the GET request to check if a container is running.
 * 
 * @param {String} name - The name of the container.
 * @returns {Boolean} If the container is running or not.
 * @throws {Error} If the container is not running.
 */
export async function getContainerStatus(name) {
    try {
        await runDockerCommand('ps', name);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Create a new container.
 * 
 * @param {String} name - The name of the container.
 * @param {String} image - The image to use.
 * @param {Array} env - The environment variables to set.
 * @param {Object} port - The port mapping to use.
 * @returns {Promise} The promise object representing the result of the command.
 * @throws {Error} If the command is invalid or the container is not running.
 */
export async function createContainer(name, image, env, port, attrs) {
    return runDockerCommand('run', name, image, env, port, attrs);
}

/**
 * Stops a container.
 * 
 * @param {String} name - The name of the container.
 * @returns {Promise} The promise object representing the result of the command.
 * @throws {Error} If the command is invalid or the container is not running.
 */
export async function stopContainer(name) {
    return runDockerCommand('rm', name);
}