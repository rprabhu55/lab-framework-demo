import fs from "fs"
import path from "path"
import remarkGfm from 'remark-gfm';
import emoji from 'remark-emoji';
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ApiCheck } from "@/app/components/apicheck"

const contentDir = path.join(process.cwd(), "src/app/lab")
const source = path.join(contentDir,"./lab.mdx")
const components = { ApiCheck }

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