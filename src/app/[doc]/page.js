import { getMdxContent } from "@/lib/mdxUtils"

export default async function Page({ params }) {

  const { content, frontmatter } = await getMdxContent(params)
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
