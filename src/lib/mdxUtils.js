import { promises as fs } from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import imgLinks from "@pondorasti/remark-img-links";
import emoji from "remark-emoji";
import { getVariable, getEnvVariable } from "./variables"
import MDXComponents from "./mdxComponents"
import { mapAsync, filterAsync } from "lodasync"
import matter from "gray-matter";

export const LOCAL_DOCS_PATH = path.join(process.cwd(), "src/app/docs");

export async function getMdxContent(params) {

  // these values need to be pulled from ENV, to avoid remote code execution
  const remoteDocsRepoServer = await getEnvVariable("REMOTE_DOCS_REPO_SERVER")
  const remoteDocsRepoOwner = await getEnvVariable("REMOTE_DOCS_REPO_OWNER")
  const remoteDocsRepoName = await getEnvVariable("REMOTE_DOCS_REPO_NAME")
  const remoteDocsRepoBranch = await getEnvVariable("REMOTE_DOCS_REPO_BRANCH")
  const remoteDocsRepoPath = await getEnvVariable("REMOTE_DOCS_REPO_PATH")
  const remoteDocsRepoMediaPath = await getEnvVariable("REMOTE_DOCS_REPO_MEDIA_PATH") || "media"

  let remarkPlugins = [
    remarkGfm,
    emoji,
  ]
  if (remoteDocsRepoServer) remarkPlugins.push([imgLinks, { absolutePath: `${remoteDocsRepoServer}/${remoteDocsRepoOwner}/${remoteDocsRepoName}/${remoteDocsRepoBranch}/${remoteDocsRepoMediaPath}` }])

  return await compileMDX({
    source: remoteDocsRepoServer ? await getRemoteDocument(`${remoteDocsRepoServer}/${remoteDocsRepoOwner}/${remoteDocsRepoName}/${remoteDocsRepoBranch}/${remoteDocsRepoPath}/${params.doc}`) : await fs.readFile(path.join(LOCAL_DOCS_PATH, params.doc), "utf8"),
    components: MDXComponents,
    options: {
      mdxOptions: {
        remarkPlugins: remarkPlugins,
      },
      parseFrontmatter: true,
      scope: {
        vars: await getVariable("vars")
      },
    },
  })
}

async function getRemoteDocument(url) {

  const options_get = {
    method: "GET",
    supportHeaderParams: true,
    headers: {
      "Accept": "text/plain;encoding=utf-8",
      "Content-Type": "text/plain;encoding=utf-8"
    }
  }
  const res = await fetch(url, options_get)

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }
  return res.text()
}

export async function getIndexDocs() {
  const remoteDocsRepoServer = await getEnvVariable("REMOTE_DOCS_REPO_SERVER")
  return remoteDocsRepoServer ? await getGitHubDocs() : await getLocalDocs(LOCAL_DOCS_PATH)
}

async function getGitHubDocs() {

  const remoteDocsRepoApiServer = await getVariable("REMOTE_DOCS_REPO_API_SERVER")
  const remoteDocsRepoOwner = await getVariable("REMOTE_DOCS_REPO_OWNER")
  const remoteDocsRepoName = await getVariable("REMOTE_DOCS_REPO_NAME")
  const remoteDocsRepoPath = await getVariable("REMOTE_DOCS_REPO_PATH")

  const url = `${remoteDocsRepoApiServer}/repos/${remoteDocsRepoOwner}/${remoteDocsRepoName}/contents/${remoteDocsRepoPath}`

  const fetchOptions = {
    method: "GET",
    supportHeaderParams: true,
    headers: {
      "Accept": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  }
  const res = await fetch(url, fetchOptions)

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  const body = await res.json()
  const files = body.filter(file => /\.mdx?$/.test(file.name) && file.type === "file").map(file => ({ name: file.name, url: file.url }))
  const docs = await mapAsync(async (file) => ({ name: file.name, location: file.url, documentData: await getGitHubFileContent(file.url, fetchOptions) }), files)
  return sortDocumentsByOrder(docs);
}

async function getGitHubFileContent(url, options) {
  const response = await fetch(url, options)
  const fileData = await response.json()
  const decodedDocument = Buffer.from(fileData.content, "base64").toString("utf8")
  return decodeFrontmatter(decodedDocument)
}

async function getLocalDocs(docsPath) {

  // Only include md(x) files
  const docFilePaths = filterAsync((path) => /\.mdx?$/.test(path), (await fs.readdir(docsPath)));
  const docs = await mapAsync(async (location) => {
    const filePath = path.join(docsPath, location)
    const source = await fs.readFile(filePath, "utf8");

    return {
      name: path.basename(location),
      location,
      documentData: decodeFrontmatter(source)
    };
  }, docFilePaths);
  return sortDocumentsByOrder(docs)
}

function decodeFrontmatter(document) {
  const { content, data } = matter(document)
  return { content, metadata: data }
}

function sortDocumentsByOrder(docs) {
  return docs.sort((a, b) => a.documentData.metadata?.order - b.documentData.metadata?.order);
}
