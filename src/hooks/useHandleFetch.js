import { useState } from "react"

const useHandleFetch = () => {
  const [gifArray, setGifArray] = useState([{ id: 0, url: "" }])
  const [totalCount, setTotalCount] = useState(0)
  const [foundGifs, setFoundGifs] = useState(false)

  const handleFetch = (enteredFilter, activePage, key, limit) => {
    const offset = activePage * limit - (limit - 1)
    const query = `?q="${enteredFilter}"&api_key=${key}&limit=${limit}&offset=${offset}`

    fetch("http://api.giphy.com/v1/gifs/search" + query)
      .then((response) => {
        if (response.ok) {
          setFoundGifs(true)
          return response.json()
        } else {
          setFoundGifs(false)
          setGifArray([{ id: 0, url: "" }])
          setTotalCount(0)
          activePage = 1
        }
      })
      .then((response) => {
        if (typeof response !== "undefined") {
          const gifAuxArray = []
          for (const key in response.data) {
            gifAuxArray.push({
              id: key,
              url: response.data[key].images.original.url,
            })
            setTotalCount(response.pagination.total_count)
          }
          setGifArray(gifAuxArray)
        } else {
          setGifArray([{ id: 0, url: "" }])
          setTotalCount(0)
          activePage = 1
        }
      })
    return activePage
  }

  return { gifArray, totalCount, foundGifs, handleFetch }
}

export default useHandleFetch
