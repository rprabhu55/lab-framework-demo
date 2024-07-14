"use client"
import { useState } from 'react'

export function ApiCheck({name, url}) {
    const [isOnline, setIsOnline] = useState(null)
    const CheckWebsiteStatus = async () => {    
        console.log('check')
        console.log(url)
        if (url) {
            await fetch(url, {cache: "no-store", mode: "no-cors"})
            // .then(response => response.text())
            .then(response => response.ok)
            .then(() => {
                setIsOnline(true)
            })
            .catch(error => {
                console.error('Error:', error)
                setIsOnline(false)
            });
        }
    }

    const handleClick = () => {
        CheckWebsiteStatus(url);
        console.log(getColor())
    }
    
    const getColor = () => {
        if (isOnline === null) return 'bg-orange-50'
        return isOnline ? 'bg-green-200' : 'bg-red-200'
    }

    return (
        <div className={"flex justify-center items-center ".concat(getColor())}>
        <span>
            <p className="text-gray-700 text-lg font-semibold">{name}</p>
            <p className="text-center">
                <button 
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    onClick={() => handleClick(url)}
                >Check</button>
            </p>
            </span> 
        </div>
    )
}