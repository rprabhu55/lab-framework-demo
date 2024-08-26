import { APICheck } from "@/app/components/api-check";
import { APIHeaderCheck } from "@/app/components/api-header-check";
import { APIResponseCheck } from "@/app/components/api-response-check";
import { CodeBlock } from "@/app/components/codeblock";
import { Docker } from "@/app/components/docker";
import { DockerStatus } from "@/app/components/docker-status";
import { GetVariable } from "@/app/components/get-variable";
import { InputVariable } from "@/app/components/input-var";
import { UdfDeploymentMetadata } from "@/app/components/udf-deployment-metadata";
import DockerContainer from "@/app/components/docker-container";
import APICheckContainer from "@/app/components/api-check-container";

const MDXComponents = {
  APICheck,
  APICheckContainer,
  APIHeaderCheck,
  APIResponseCheck,
  CodeBlock,
  Docker,
  DockerStatus,
  DockerContainer,
  GetVariable,
  InputVariable,
  UdfDeploymentMetadata,
  h1: (props) => <h1 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
  h2: (props) => <h2 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
  h3: (props) => <h3 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
  h4: (props) => <h4 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
  code: (props) => <CodeBlock {...props} />
}

export default MDXComponents
