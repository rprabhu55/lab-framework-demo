import { APIBase } from '@/lib/api-base'

/**
 * APIHeaderCheck component
 * 
 * This component renders information about an API header check, including the header name and value.
 * It also includes the APIBase component to perform the actual API check.
 * 
 * @param {Object} props - The properties object.
 * @param {string} [props.componentName=null] - The name of the component to check.
 * @param {string} [props.headerName=null] - The name of the header to check.
 * @param {string} [props.headerValue=null] - The value of the header to check.
 * @param {string} [props.path='/'] - The path to append to the URL for the API check.
 * @param {number} [props.targetStatusCode=200] - The expected HTTP status code from the API check.
 * @param {string} [props.url=null] - The URL to check.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export function APIHeaderCheck({ 
  componentName = null, 
  headerName = null, 
  headerValue = null, 
  path = '/', 
  targetStatusCode = 200, 
  url = null 
}) {
  return (
    <div className="flex flex-col">
      <p className="font-bold">Header Name: <span className="font-normal">{headerName}</span></p>
      <p className="font-bold">Header Value: <span className="font-normal">{headerValue}</span></p>
      <APIBase 
        componentName={componentName} 
        headerName={headerName} 
        headerValue={headerValue} 
        path={path} 
        targetStatusCode={targetStatusCode} 
        url={url} 
      />
    </div>
  );
}
