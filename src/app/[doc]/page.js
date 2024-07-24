import fs from "fs"
import path from "path"
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import { compileMDX } from "next-mdx-remote/rsc"
import { ApiCheck } from "@/app/components/apicheck"
import { CodeBlock } from "../components/codeblock";
import { Docker } from "../components/docker";

const contentDir = path.join(process.cwd(), "src/app/docs")

const components = {
  ApiCheck,
  CodeBlock,
  Docker,
  h1: (props) => <h1 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
  h2: (props) => <h2 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
  h3: (props) => <h3 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
  h4: (props) => <h4 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
  code: (props) => <CodeBlock {...props} />
}

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, emoji],
  },
  parseFrontmatter: true
}

export default async function Page({ params }) {
  const slug = path.join(contentDir, params.doc)
  const { content, frontmatter } = await compileMDX({
    source: fs.readFileSync(slug + ".mdx", "utf8"),
    components: components,
    options: options,
  })
  return (
    <>
      <div className="post-header">
        <h1>{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="description">{frontmatter.description}</p>
        )}
      </div>
      {content}
    </>)
}
