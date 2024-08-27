"use server"
import { spawn } from "child_process";
import { getComponentName, getVariable, setVariable, getEnvVariable } from "./variables";
import { setRedisVariable, removeRedisVariable } from "./redis";
import { exec } from "child_process";


/**
 * Helper function to build Docker command arguments.
 *
 * This function takes in various options and returns a formatted array of strings that can be used as command arguments for Docker commands.
 *
 * @param {string} command - The type of Docker command to perform (e.g. "ps", "rm", "run")
 * @param {string} containerName - The name of the Docker container (used for "ps" and "rm" commands)
 * @param {string} image - The Docker image to use for the "run" command
 * @param {Object[]} env - An array of environment variables to set in the container (for "run" command)
 * @param {Object} port - An object containing the host and container ports to map (for "run" command)
 * @param {Object[]} attrs - An array of attributes to set on the container (for "run" command)
 * @param {string} network - The Docker network to use for the "run" command
 *
 * @returns {string[]} An array of strings that can be used as arguments for the specified Docker command
 */
function buildDockerCommand(command, containerName, image, env = [], port = null, attrs = [], network) {
  switch (command) {
    case "logs":
      return ["logs", `${containerName}`];
    case "ps-all":
      return ["ps", "-a", "--format", "{{json .}},"];
    case "ps":
      return ["ps", "-a", "--filter", `name=${containerName}`, "--filter", "status=running", "--quiet"];
    case "rm":
      return ["rm", "-f", containerName];
    case "run":
      return [
        "run", "-d", "--name", containerName,
        ...env.map(({ name, value }) => `--env=${name}=${value}`),
        ...(port ? ["-p", `${port.host}:${port.container}`] : []),
        ...attrs.map(({ name, value }) => `--${name}=${value}`),
        `--hostname=${containerName}`,
        `--network=${network}`,
        image
      ];
    default:
      throw new Error("Invalid command");
  }
}


/**
 * Helper function to handle Docker process close event.
 *
 * This function takes in information about a completed Docker command and performs any necessary actions based on the outcome of that command.
 *
 * @param {string} command - The type of Docker command that was executed (e.g. "ps", "run", "rm")
 * @param {number} code - The exit code of the Docker process
 * @param {string} containerName - The name of the Docker container affected by this command
 * @param {string} stdoutData - The output data from the Docker process (if any)
 * @param {Object} port - An object containing information about the ports mapped by the "run" command (optional)
 *
 * @returns {Promise<boolean|*>} A promise resolving to `true` if the command was successful, or a specific value depending on the command type
 */
async function handleDockerClose(command, code, containerName, stdoutData, port) {
  if (code !== 0) {
    throw new Error(`Child process exited with code ${code}`);
  }

  switch (command) {
    case "logs":
      return stdoutData;
    case "ps":
      if (stdoutData.trim() === "") {
        throw new Error("Container not running");
      }
      console.log("Container is running");
      return true;
    case "ps-all":
      return stdoutData;
    case "run":
      await setRedisVariable(`components:${containerName}`,
        { status: "running", url: `http://${containerName}`, ...(port && { ports: port }) });
      break;
    case "rm":
      await removeRedisVariable(`components:${containerName}`);
      break;
    default:
      return true;
  }
}


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
async function runDockerCommand(command, name = "", image, env = [], port, attrs = [], network = "lab-framework") {

  const containerName = await getComponentName(name);
  let docker_cmd = buildDockerCommand(command, containerName, image, env, port, attrs, network);

  // Add support for calling the Docker API instead of using docker.sock
  const dockerApiUrl = await getEnvVariable("DOCKER_API_URL");
  if (dockerApiUrl) {
    docker_cmd.unshift(dockerApiUrl)
    docker_cmd.unshift("-H")
  }
  const docker = spawn("docker", docker_cmd);

  let stdoutData = "";
  docker.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  docker.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    throw new Error(data.toString());
  });

  return new Promise((resolve, reject) => {
    docker.on("close", async (code) => {
      try {
        const result = await handleDockerClose(command, code, containerName, stdoutData, port);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Handles the GET request to the status of all containers.
 * 
 * @returns {Object} The status of all containers.
 * @throws {Error} If the container is not running.
 */
export async function getAllContainerStatus() {
  try {
    const commandResult = await runDockerCommand("ps-all");
    // hack to remove final comma and newline
    const parsed = JSON.parse(`[${commandResult.substring(0, commandResult.length - 2)}]`);
    return parsed;
  } catch (error) {
    return false;
  }
}

/**
 * Handles the GET request to check if a container is running.
 * 
 * @param {string} name - The name of the container.
 * @returns {boolean} If the container is running or not.
 * @throws {Error} If the container is not running.
 */
export async function getContainerStatus(name) {
  try {
    await runDockerCommand("ps", name);
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
 * @param {Object} attrs - Additional attributes for the container.
 * @returns {Promise} The promise object representing the result of the command.
 * @throws {Error} If the command is invalid or the container is not running.
 */
export async function createContainer(name = null, image = null, env = [], port = null, attrs = []) {
  if (name === null || image === null)
    throw new Error('createContainer expects a name and image');
  await validateAndFetchEnv(env);
  const response = await runDockerCommand("run", name, image, env, port, attrs);
  const containerName = await getComponentName(name);
  await setVariable(name, containerName);
  return response;
}

/**
 * Stops a container.
 * 
 * @param {String} name - The name of the container.
 * @returns {Promise} The promise object representing the result of the command.
 * @throws {Error} If the command is invalid or the container is not running.
 */
export async function stopContainer(name) {
  const response = await runDockerCommand("rm", name);
  await removeRedisVariable(name);
  return response;
}

/**
 * Retrieves the logs for a specified Docker container.
 * 
 * @param {string} name - The name of the Docker container.
 * @returns {Promise<string|null>} - The logs of the Docker container, or null if the name is not provided or an error occurs.
 */
export async function getContainerLogs(name) {
  if (!name) {
    return null;
  }

  try {
    const logs = await runDockerCommand("logs", name);
    return logs;
  } catch (error) {
    console.error(`Error retrieving logs for container ${name}:`, error.message);
    return null;
  }
}

/**
 * Validates and fetches environment variables.
 * 
 * @param {Array} env - The environment variables to validate and fetch.
 * @throws {Error} If any environment variable is null or undefined and cannot be fetched.
 */
async function validateAndFetchEnv(env) {
  if (!env) {
    throw new Error('validateAndFetchEnv requires an array of environment variables');
  }

  for (let i = 0; i < env.length; i++) {
    const { name, value, isVariable } = env[i];
    if (isVariable) {
      if (value === null || value === undefined) {
        const fetchedValue = await getVariable(name);
        if (fetchedValue === null || fetchedValue === undefined) {
          throw new Error(`Environment variable ${name} could not be resolved`);
        }
        env[i].value = fetchedValue;
      }
    }
  }
}

/**
 * Executes a shell command in the Docker container.
 * @param {string} containerId - The ID of the container.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} A promise that resolves with the command output.
 */
export const execShellCommand = (containerId, command) => {
  return new Promise((resolve, reject) => {

    // Add support for calling the Docker API instead of using docker.sock
    const dockerApiUrl = getEnvVariable("DOCKER_API_URL");

    exec(`docker ${dockerApiUrl ? `-H ${dockerApiUrl}` : ""} exec ${containerId} ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};
