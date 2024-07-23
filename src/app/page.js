import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import Image from "next/image";
import { docFilePaths, DOCS_PATH } from "./utils/mdxUtils";

export default function Home() {
  const docs = getDocs()
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Lab Framework
      </h1>
      <p className="text-lg text-center">
        A demo of the lab framework capabilities
      </p>
      <Image
        src="/lab-framework-logo.png"
        alt="Lab Framework"
        width={200}
        height={200}
      />
      <p>
        The following are a list of pages in this lab.
      </p>
      <ul>
        {docs.map((doc) => (
          <li key={doc.filePath}>
            <Link
              as={`/${doc.filePath.replace(/\.mdx?$/, "")}`}
              href={`/[slug]`}
            >
              {doc.data.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function getDocs() {
  const docs = docFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(DOCS_PATH, filePath));
    const { content, data } = matter(source);

    return {
      content,
      data,
      filePath,
    };
  });
  // console.log(docs)
  return docs.sort((a,b) => a.data.order - b.data.order);
}