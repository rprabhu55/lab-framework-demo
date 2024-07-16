import fs from "fs"
import path from "path"
import remarkGfm from 'remark-gfm';
import emoji from 'remark-emoji';
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ApiCheck } from "@/app/components/apicheck"
import { CodeBlock } from "../components/codeblock";

const contentDir = path.join(process.cwd(), "src/app/lab")
const source = path.join(contentDir,"./lab.mdx")

const components = { 
  ApiCheck,  CodeBlock,
  h1: (props) => <h1 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
    h2: (props) => <h2 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
    h3: (props) => <h3 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
    h4: (props) => <h4 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
  code: (props) => <CodeBlock {...props} />
}

const options = {
	mdxOptions: {
    remarkPlugins: [remarkGfm, emoji],
	}
}

export default function Page() {
  return <MDXRemote 
    source={fs.readFileSync(source, "utf8")} 
    components={components} 
    options={options}
  />
}