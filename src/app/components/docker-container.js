import React from "react";
import { Docker } from "@/app/components/docker";

/**
 * DockerContainer component
 * 
 * This component filters and renders only the children that are of type Docker.
 * It wraps each Docker component in a div with a specific class for styling.
 * 
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be filtered and rendered.
 * 
 * @returns {JSX.Element} The rendered DockerContainer component.
 * 
 * @example
 * <DockerContainer>
 *   <Docker id="docker1" />
 *   <Docker id="docker2" />
 *   <div>Not a Docker component</div>
 * </DockerContainer>
 */
const DockerContainer = ({ children }) => {
  const dockerComponents = React.Children.toArray(children).filter(child => child.type === Docker);

  return (
    <div id="docker-outer-container" className="flex flex-col border border-gray-300 p-4 rounded">
      <span className="font-bold text-xl">Docker Containers</span>
      <div id="docker-inner-container" className="flex flex-wrap gap-4">
        {dockerComponents.map((component, index) => (
          <div key={index} className="docker-item">
            {component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DockerContainer;