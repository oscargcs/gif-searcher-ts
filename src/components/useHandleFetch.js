import { useState } from "react"

const useHandleFetch = () => {
  const [gifArray, setGifArray] = useState([{ id: 0, title: "", url: "" }])
  const [totalCount, setTotalCount] = useState(0)
  const [foundGifs, setFoundGifs] = useState(false)

  const offset = activePage * limit - (limit - 1) //offset=0 or undefined causes response.ok==false, then it has to start at 1.
  const query = `?q="${enteredFilter}"&api_key=dc6zaTOxFJmzC&limit=${limit}&offset=${offset}`

  console.log("query", query)
  fetch("http://api.giphy.com/v1/gifs/search" + query) // Example'http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5&offset=4'
    .then((response) => {
      console.log("response.ok", response.ok)
      if (response.ok) {
        setFoundGifs(true)
        return response.json()
      } else {
        setFoundGifs(false)
        setGifArray([{ id: 0, title: "", url: "" }])
        setTotalCount(0)
        activePage = 1
      }
    })
    .then((response) => {
      if (typeof response !== "undefined") {
        // typeof is necessary (very important concept)
        console.log("response", response)
        const gifAuxArray = []
        for (const key in response.data) {
          gifAuxArray.push({
            id: key,
            title: response.data[key].images.original.title,
            url: response.data[key].images.original.url,
          })
          setTotalCount(response.pagination.total_count)
        }
        setGifArray(gifAuxArray)
      } else {
        setGifArray([{ id: 0, title: "", url: "" }])
        setTotalCount(0)
        activePage = 1
      }
    })

  return [gifArray, totalCount, foundGifs]
}

export default useHandleFetch
