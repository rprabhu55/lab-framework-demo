import { Suspense } from 'react'
import { getVariable } from '@/lib/variables';

/**
 * Asynchronously retrieves a variable by its name and displays it within a React component.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.name - The name of the variable to retrieve.
 * @returns {JSX.Element|string} - A React component displaying the variable value, or an error message if the variable cannot be retrieved.
 *
 * @example
 * <GetVariable name="exampleVariable" />
 */
export async function GetVariable({name}) {
  if (!name) return "eat shit - empty";

  let value = null;

  try {
    value = await getVariable(name);
  } catch (error) {
    console.error('unable to retrieve variable: ', name);
    return "eat shit - error";
  }
  

  return (
    <span>
      <Suspense fallback={"loading..."}>
        {value}
      </Suspense>
    </span>
  );
}
