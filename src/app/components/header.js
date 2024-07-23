//components/header.js

import Image from "next/image"

export function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="mx-auto flex max-w-9xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Lab Framework</span>
            <Image src="/lab-framework-logo.png" alt="Lab Framework" width={50} height={50} />
          </a>
        </div>
        <div className="flex lg:flex-1 justify-end">
          <a href="/" className="text-gray-900 hover:text-gray-900">Home</a>
          <a href="#" className="ml-6 text-gray-900 hover:text-gray-900">Score</a>
        </div>
      </nav>
    </header>
  )
}
