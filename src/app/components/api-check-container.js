import React from "react";
import { APICheck } from "@/app/components/api-check";

/**
 * APICheckContainer component
 * 
 * This component filters and renders only the children that are of type APICheck.
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
 *   <APICheck id="apicheck2" />
 *   <div>Not an APICheck component</div>
 * </APICheckContainer>
 */
const APICheckContainer = ({ children }) => {
  const apiCheckComponents = React.Children.toArray(children).filter(child => child.type === APICheck);

  return (
    <div id="api-check-outer-container" className="flex flex-col border border-gray-300 p-4 rounded">
      <span className="font-bold text-xl">API Checks</span>
      <div id="api-check-inner-container" className="flex flex-wrap gap-4">
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