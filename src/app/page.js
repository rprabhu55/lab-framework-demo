import Link from "next/link";
import Image from "next/image";
import { getIndexDocs } from "../lib/mdxUtils"

export default async function Home() {
  const docs = await getIndexDocs()
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
          <li key={doc.location}>
            <Link
              as={`/${doc.name}`}
              href={"/[slug]"}
            >
              {doc.documentData.metadata?.title}
            </Link>
            &nbsp;- {doc.documentData.metadata?.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
