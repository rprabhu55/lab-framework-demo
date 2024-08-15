import { ApiCheck } from "../components/apicheck";

export function ToC({ headings }) {
    return (
        // <div className="w-1/4 p-4 sticky top-0">
        <div className="p-1 w-80 sticky top-0 border-r-2">
            <ul className="list-none">
                {headings.map((heading) => (
                    <li key={heading.id} className="">
                        <a className="no-underline text-black text-xs" href={`#${heading.id}`}>{heading.title.substring(0,)}</a>
                    </li>
                ))}
            </ul>

            <ApiCheck
                name="NGINX Ready"
                url="http://localhost:55001"
            />
        </div>
    )
}
