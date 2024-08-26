import React from "react";
import { ApiCheck } from "@/app/components/api-check";

/**
 * ApiCheckContainer component
 * 
 * This component filters and renders only the children that are of type ApiCheck.
 * It wraps each ApiCheck component in a div with a specific class for styling.
 * 
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be filtered and rendered.
 * 
 * @returns {JSX.Element} The rendered ApiCheck component.
 * 
 * @example
 * <ApiCheckContainer>
 *   <ApiCheck id="apicheck1" />
 *   <ApiCheck id="apicheck2" />
 *   <div>Not an ApiCheck component</div>
 * </ApiCheckContainer>
 */
const ApiCheckContainer = ({ children }) => {
  const apiCheckComponents = React.Children.toArray(children).filter(child => child.type === ApiCheck);

  return (
    <div id="api-check-outer-container" className="flex flex-col border border-gray-300 p-4 rounded">
      <span className="font-bold text-xl">ApiCheck Containers</span>
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

export default ApiCheckContainer;