import fs from "fs";
import path from "path";

// DOCS_PATH is useful when you want to get the path to a specific file
export const DOCS_PATH = path.join(process.cwd(), "src/app/docs");

// postFilePaths is the list of all mdx files inside the DOCS_PATH directory
export const docFilePaths = fs
  .readdirSync(DOCS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path));
