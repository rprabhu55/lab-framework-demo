// /app/components/toc.js

export function ToC( { headings }) {
    return (
        <div className="w-1/4 p-4 sticky top-0">
            <ul className="list-none">
            {headings.map((heading) => (
                <li key={heading.id} className="mb-2">
                    <a className="no-underline text-black text-xs" href={`#${heading.id}`}>{heading.title}</a>
                </li>
            ))}
            </ul>
        </div>
    )
}