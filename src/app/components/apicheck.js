"use client"
import { useState, useRef } from "react"
import { checkWebsiteStatus } from "@/lib/componentUtils"

export function ApiCheck({ name, url, hideUrl = true }) {
    const [isOnline, setIsOnline] = useState(null)
    const urlInputRef = useRef(url)

    const getColor = () => {
        if (isOnline === null) return "bg-orange-50"
        return isOnline ? "bg-green-200" : "bg-red-200"
    }

    async function checkStatus() {
        const websiteStatus = await checkWebsiteStatus(urlInputRef.current.value)
        console.log(`here it is: ${websiteStatus}`)
        setIsOnline(websiteStatus)
    }


    return (
        <div className={"flex justify-center items-center ".concat(getColor())}>
            <span>
                <p className="text-gray-700 text-lg font-semibold">{name}</p>
                <p className="text-center">
                    <input type={hideUrl ? "hidden" : "text"} ref={urlInputRef} defaultValue={url} className="mb-5" />
                    <button
                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                        onClick={checkStatus}
                    >Check</button>
                </p>
            </span>
        </div>
    )
}
