import { ApiCheck } from "@/app/components/apicheck";
import { CodeBlock } from "../app/components/codeblock";
import { Docker } from "../app/components/docker";
import { DockerStatus } from "../app/components/docker-status";
import { UdfMetadata } from "../app/components/udf-metadata";

const MDXComponents = {
    ApiCheck,
    CodeBlock,
    Docker,
    DockerStatus,
    UdfMetadata,
    h1: (props) => <h1 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    h2: (props) => <h2 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    h3: (props) => <h3 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    h4: (props) => <h4 id={props.children.toLowerCase().replace(/\s/g, "-")} {...props} />,
    code: (props) => <CodeBlock {...props} />
  }

  export default MDXComponents
