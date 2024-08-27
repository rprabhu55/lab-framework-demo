import { APICheck } from "@/app/components/api-check";
import { APIHeaderCheck } from "@/app/components/api-header-check";
import { APIResponseCheck } from "@/app/components/api-response-check";
import { CodeBlock } from "@/app/components/codeblock";
import { Docker } from "@/app/components/docker";
import { DockerStatus } from "@/app/components/docker-status";
import { GetVariable } from "@/app/components/get-variable";
import { InputVariable } from "@/app/components/input-var";
import { SetVariable } from "@/app/components/set-variable";
import UDFComponent from "@/app/components/udf-component";
import { UdfDeploymentMetadata } from "@/app/components/udf-deployment-metadata";

import DockerContainer from "@/app/components/docker-container";
import APICheckContainer from "@/app/components/api-check-container";
import dynamic from 'next/dynamic';

const ImageModalClient = dynamic(() => import('@/app/components/image-modal-client'), { ssr: false });

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
  UDFComponent,
  UdfDeploymentMetadata,
  SetVariable,
  h1: (props) => <h1 id={formatId(props.children)} {...props} />,
  h2: (props) => <h2 id={formatId(props.children)} {...props} />,
  h3: (props) => <h3 id={formatId(props.children)} {...props} />,
  h4: (props) => <h4 id={formatId(props.children)} {...props} />,
  code: (props) => <CodeBlock {...props} />,
  img: (props) => <ImageModalClient {...props} />
}

export default MDXComponents
/**
 * Returns an id without spaces, and is lower case.
 * @param {string} the existing id.
 * @returns {string} the formatted id.
 */

function formatId(existingId) {
  return existingId.toLowerCase().replace(/\s/g, "-");
}
