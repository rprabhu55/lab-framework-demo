import { ToC } from "@/app/components/toc"

export default function MdxLayout({ children }) {

  // Create any shared layout or styles here
  return (
    <div className="flex">
      <div className="p-2">
        <ToC />
      </div>
      <div className="flex-grow p-4 pr-10">
        {children}
      </div>
    </div>
  )
}
