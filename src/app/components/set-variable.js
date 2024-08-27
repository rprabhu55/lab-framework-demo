import { setVariable, getComponentName } from "@/lib/variables";

/**
 * Asynchronously set a variable.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.name - The name of the variable to set.
 * @param {string} props.value - The value of the variable to set.
 * @param {Boolean} props.isComponent - Is the variable value the component name.
 * @returns {Promise} - Resolves when the variable is set
 *
 * @example
 * <GetVariable name="exampleVariable" />
 */
export async function SetVariable({ name = null, value = null, isComponent = false }) {
  if (!name) return Promise.reject("Variable name empty");
  if (value === null && isComponent === false) return Promise.reject("No value supplied");

  if(isComponent) {
    value = await getComponentName(name);
  }

  try {
    await setVariable(name, value);
  } catch (error) {
    console.error("unable to set variable: ", name);
    return Promise.reject(error);
  }

  return Promise.resolve();
}
