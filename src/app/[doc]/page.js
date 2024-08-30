import { getMdxContent } from "@/lib/mdxUtils"
import { delay } from "@/lib/utils"
import { getEnvVariable } from "@/lib/variables"

export default async function Page({ params }) {
  if (await getEnvVariable("SIMULATE_LOAD_DELAY")) await delay(5000);
  const { content, frontmatter } = await getMdxContent(params.doc)
  return (
    <>
      <div className="mb-10">
        <h1 className="ml-0 mb-0">{frontmatter?.title}</h1>
        {frontmatter?.description && (
          <div className="text-sm text-gray-400">{frontmatter.description}</div>
        )}
      </div>
      {content}
    </>)
}
