"use server"
export async function checkWebsiteStatus(url) {
    console.log("check")
    console.log(url)
    if (url) {
        await fetch(url, { cache: "no-store", mode: "no-cors" })
            .then((response) => {
                console.log(response.ok)
            })
            .then(() => {
                return true
            })
            .catch(error => {
                console.error("Error:", error)
                return false
            })
    }
}
