import React from 'react';
import { Docker } from "@/app/components/docker";

const DockerContainer = ({ children }) => {
  const dockerComponents = React.Children.toArray(children).filter(child => child.type === Docker);

  return (
    <div id="docker-container" className="flex flex-wrap gap-4">
      {dockerComponents.map((component, index) => (
        <div key={index} className="docker-item">
          {component}
        </div>
      ))}
    </div>
  );
};

export default DockerContainer;