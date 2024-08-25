"use client";
import { useEffect, useState } from "react"

export function ToC() {

  const [headings, setHeadings] = useState([])

  useEffect(() => {
    // Get all the headings on the page
    const headingElements = document.querySelectorAll("h1, h2")
    const headings = Array.from(headingElements).map((heading) => ({
      title: heading.innerText,
      id: heading.innerText.toLowerCase().replace(/\s/g, "-"),
    }))
    setHeadings(headings)
  }, [])

  return (
    <div className="toc-container p-1 w-80 sticky top-0 border-r-2 h-screen">
      <ul className="list-none">
        {headings.map((heading) => (
          <li key={heading.id} className="">
            <a className="no-underline text-gray-500 text-base" href={`#${heading.id}`}>
              {heading.title.substring(0,)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
