"use client";
import {useEffect, useState} from 'react'
import { ToC } from '@/app/components/toc'

export default function MdxLayout({ children }) {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    // Get all the headings on the page
    const headingElements = document.querySelectorAll('h1, h2')
    const headings = Array.from(headingElements).map((heading) => ({
      title: heading.innerText,
      id: heading.innerText.toLowerCase().replace(/\s/g, '-'),
    }))
    setHeadings(headings)
  }, [])
  // Create any shared layout or styles here
  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <ToC headings={headings}/>
      </div>
      <div className="flex-grow p-4">
        {children}
      </div>
    </div>
  )
}