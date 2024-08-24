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

/**
 * Compiles MD(X) document content.
 * @param {string} documentName - The file name of the document to compile.
 * 
 * @returns {Promise<CompileMDXResult<Record<string, unknown>>>} the compiled MDX.
 * @throws {Error} If the the document cannot be compiled.
 */
export async function getMdxContent(documentName) {

    // these values need to be pulled from ENV, to avoid remote code execution
  const remoteDocsRepoServer = await getEnvVariable("REMOTE_DOCS_REPO_SERVER")
  const remoteDocsRepoOwner = await getEnvVariable("REMOTE_DOCS_REPO_OWNER")
  const remoteDocsRepoName = await getEnvVariable("REMOTE_DOCS_REPO_NAME")
  const remoteDocsRepoBranch = await getEnvVariable("REMOTE_DOCS_REPO_BRANCH")
  const remoteDocsRepoPath = await getEnvVariable("REMOTE_DOCS_REPO_PATH")
  const remoteDocsRepoMediaPath = await getEnvVariable("REMOTE_DOCS_REPO_MEDIA_PATH") || "media"
  const remoteDocsRepoCacheSeconds = parseInt(await getEnvVariable("REMOTE_DOCS_REPO_CACHE_SECONDS") || 300)

  let remarkPlugins = [
    remarkGfm,
    emoji,
  ]
  if (remoteDocsRepoServer) remarkPlugins.push([imgLinks, { absolutePath: `${remoteDocsRepoServer}/${remoteDocsRepoOwner}/${remoteDocsRepoName}/${remoteDocsRepoBranch}/${remoteDocsRepoMediaPath}` }])

  const documentUrl = `${remoteDocsRepoServer}/${remoteDocsRepoOwner}/${remoteDocsRepoName}/${remoteDocsRepoBranch}/${remoteDocsRepoPath}/${documentName}`
  if (remoteDocsRepoServer) console.log(`Fetching remote document: ${documentUrl}, caching for ${remoteDocsRepoCacheSeconds} seconds.`)
  const sourceDocument = remoteDocsRepoServer ? await getRemoteDocument(documentUrl, remoteDocsRepoCacheSeconds) : await getLocalDocument(documentName)
  return await compileMDX({
    source: sourceDocument,
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

/**
 * Fetches MD(X) content from the local file system.
 * @param {string} documentName - The file name of the document to fetch.
 * 
 * @returns {Promise<string>} the text content of the loaded document.
 * @throws {Error} If the document cannot be loaded.
 */
async function getLocalDocument(documentName) {
  return await fs.readFile(path.join(LOCAL_DOCS_PATH, documentName), "utf8");
}


/**
 * Fetches mdx content from a remote GitHub repo, and caches in nextjs.
 * @param {string} documentName - The file name of the document to fetch.
 * @param {string} cacheSeconds - The number of seconds to cache the fetched content in nextjs.
 * 
 * @returns {Promise<string>} the text content of the fetched document.
 * @throws {Error} If the document cannot be fetched.
 */
async function getRemoteDocument(url, cacheSeconds) {

  // Attempt to influence cache control attempt from https://stackoverflow.com/questions/64792450/avoiding-getting-cached-content-from-raw-githubusercontent-com
  const cacheBustingUrl = `${url}?token=${new Date().getMilliseconds()}`
  const options = {
    method: "GET",
    supportHeaderParams: true,
    headers: {
      "Accept": "text/plain;encoding=utf-8",
      "Content-Type": "text/plain;encoding=utf-8"
    },
    next: {
      revalidate: cacheSeconds
    }
  }
  const res = await fetch(cacheBustingUrl, options)

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }
  return res.text()
}


/**
 * Gets a list of MD(X) documents from a local or remote source depending on whether a repo is specified in the env vars.
 * @returns {any} array of document data sorted by order metadata in frontmatter
 */
export async function getIndexDocs() {
  const remoteDocsRepoServer = await getEnvVariable("REMOTE_DOCS_REPO_SERVER")
  return remoteDocsRepoServer ? await getGitHubDocs() : await getLocalDocs(LOCAL_DOCS_PATH)
}

/**
 * Gets a list of MD(X) documents from a remote source, GitHub.
 * @returns {any} array of document data sorted by order metadata in frontmatter
 */
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

/**
 * Fetches document from GitHub using API to return its frontmatter.
 * @param {any} url to fetch the document from.
 * @param {any} options to be used by the fetch operation.
 * @returns {any} The document content and frontmatter.
 */
async function getGitHubFileContent(url, options) {
  const response = await fetch(url, options)
  const fileData = await response.json()
  const decodedDocument = Buffer.from(fileData.content, "base64").toString("utf8")
  return decodeFrontmatter(decodedDocument)
}

/**
 * Gets a list of MD(X) documents from the local file system.
 * @param {any} docsPath the file system path to scan for MD(X) documents.
 * @returns {any} array of document data sorted by order metadata in frontmatter
 */
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


/**
 * Parses frontmatter from MD(X) document.
 * @param {any} document in string form
 * @returns {any} an object containing discrete content and metadata (frontmatter)
 */
function decodeFrontmatter(document) {
  const { content, data } = matter(document)
  return { content, metadata: data }
}


/**
 * Description
 * @param {any} docs array of documents
 * @returns {any} array of documents sorted in ascending order.
 */
function sortDocumentsByOrder(docs) {
  return docs.sort((a, b) => a.documentData.metadata?.order - b.documentData.metadata?.order);
}
