import { ToC } from "@/app/components/toc"

export default function MdxLayout({ children }) {
  
  return (
    <div className="flex">
      <div className="p-2">
        <ToC />
      </div>
      <div className="flex-grow p-4 md:pr-10 sm:pr-4 md:flex-wrap md:justify-center">
        {children}
      </div>
    </div>
  )
}