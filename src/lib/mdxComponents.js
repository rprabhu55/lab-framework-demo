import { APICheck } from "@/app/components/api-check"
import { APIHeaderCheck } from "@/app/components/api-header-check";
import { APIResponseCheck } from "@/app/components/api-response-check";
import { CodeBlock } from "@/app/components/codeblock";
import { Docker } from "@/app/components/docker";
import { DockerStatus } from "@/app/components/docker-status";
import { InputVariable } from "@/app/components/input-var";
import { UdfMetadata } from "@/app/components/udf-metadata";
import DockerContainer from "@/app/components/docker-container";

const MDXComponents = {
    APICheck,
    APIHeaderCheck,
    APIResponseCheck,
    CodeBlock,
    Docker,
    DockerStatus,
    DockerContainer,
    InputVariable,
    UdfMetadata,
    h1: (props) => <h1 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    h2: (props) => <h2 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    h3: (props) => <h3 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    h4: (props) => <h4 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    code: (props) => <CodeBlock {...props} />
  }

  export default MDXComponents
