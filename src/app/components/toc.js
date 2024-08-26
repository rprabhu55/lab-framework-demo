"use client";
import { useEffect, useState } from "react"

export function ToC() {

  const [headings, setHeadings] = useState([])

  useEffect(() => {
    // Get all the headings on the page
    const headingElements = document.querySelectorAll("h1, h2, h3, h4")
    const headings = Array.from(headingElements).map((heading) => ({
      title: heading.innerText,
      id: heading.innerText.toLowerCase().replace(/\s/g, "-"),
      level: parseInt(heading.tagName.substring(1)), // Get the heading level
    }))
    setHeadings(headings)
  }, [])

  return (
    <div className="toc-container p-1 w-80 sticky top-0 border-r-2 border-t-2 h-screen">
      <ul className="list-none">
        {headings.map((heading, index) => (
          <li key={`${heading.id}_${index}`} className="" style={{ 
            fontSize: `${1.5 - (heading.level * 0.2)}em`, // Example: h1 -> 1.3em, h2 -> 1.1em, etc.
            marginLeft: `${(heading.level - 1) * 20}px` // Example: h1 -> 0px, h2 -> 20px, etc.
          }}>
            <a className="no-underline text-gray-600 text-base" href={`#${heading.id}`}>
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
