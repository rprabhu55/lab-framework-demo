import fs from "fs"
import path from "path"
import { MDXRemote } from 'next-mdx-remote/rsc'
// import lab from "./lab.mdx"

const contentDir = path.join(process.cwd(), "src/app/lab")
const source = path.join(contentDir,"./lab.mdx")

export default function Page() {
  return <MDXRemote 
    source={fs.readFileSync(source, "utf8")}
    // source={lab}
  />
}