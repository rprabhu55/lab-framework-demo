import React from "react";
import { APICheck } from "@/app/components/api-check";
import { APIHeaderCheck } from "@/app/components/api-header-check";
import { APIResponseCheck } from "@/app/components/api-response-check";

/**
 * APICheckContainer component
 * 
 * This component filters and renders only the children that are of type APICheck, APIHeaderCheck or APIResponseCheck.
 * It wraps each APICheck component in a div with a specific class for styling.
 * 
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be filtered and rendered.
 * 
 * @returns {JSX.Element} The rendered APICheck component.
 * 
 * @example
 * <APICheckContainer>
 *   <APICheck id="apicheck1" />
 *   <APIHeaderCheck id="apicheck2" />
 *   <APIResponseCheck id="apicheck3" />
 *   <div>Not an APICheck component</div>
 * </APICheckContainer>
 */
const APICheckContainer = ({ children }) => {
  const apiCheckComponents = React.Children.toArray(children).filter(
    child => [APICheck, APIHeaderCheck, APIResponseCheck].includes(child.type));

  return (
    <div id="api-check-outer-container" className="flex flex-col border border-gray-300 p-4 rounded">
      <span className="font-bold text-xl">Checks</span>
      <div id="api-check-inner-container" className="flex flex-wrap gap-4 mt-3">
        {apiCheckComponents.map((component, index) => (
          <div key={index} className="api-check-item">
            {component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default APICheckContainer;