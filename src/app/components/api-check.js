import { APIBase } from '@/lib/api-base'

/**
 * APICheck component
 * 
 * This component renders information about an API check, including the URL and component name.
 * It also includes the APIBase component to perform the actual API check.
 * 
 * @param {Object} props - The properties object.
 * @param {string} [props.componentName=null] - The name of the component to check.
 * @param {string} [props.path='/'] - The path to append to the URL for the API check.
 * @param {number} [props.targetStatusCode=200] - The expected HTTP status code from the API check.
 * @param {string} [props.url=null] - The URL to check.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export function APICheck({ 
  componentName = null, 
  path = '/', 
  targetStatusCode = 200, 
  url = null 
}) {
  return (
    <div className="flex flex-col">
      <p className="space-y-2">
        {url && (
          <span className="block">
            <b className="font-bold">URL:</b> <span className="font-normal">{url}</span>
          </span>
        )}
        {componentName && (
          <span className="block">
            <b className="font-bold">Component Name:</b> <span className="font-normal">{componentName}</span>
          </span>
        )}
      </p>
      <APIBase componentName={componentName} path={path} targetStatusCode={targetStatusCode} url={url} />
    </div>
  );
}
