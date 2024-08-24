import { APIBase } from '@/lib/api-base'

export function APIResponseCheck({ 
  componentName = null, 
  path = '/', 
  searchString = null,
  targetStatusCode = 200, 
  url = null 
}) {
  return (
    <div className="flex flex-col">
      <p className="font-bold">Search String: <span className="font-normal">{searchString}</span></p>
      <APIBase 
        componentName={componentName} 
        path={path} 
        searchString={searchString}
        targetStatusCode={targetStatusCode} 
        url={url} 
      />
    </div>
  );
}
