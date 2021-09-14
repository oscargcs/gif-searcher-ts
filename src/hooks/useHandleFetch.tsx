import { useState } from "react"
import Data from "../models/data"

interface FetchResult {
  gifArray: Data[]
  totalCount: number
  foundGifs: boolean
  isLoading: boolean
  handleFetch: (
    enteredFilter: string,
    activePage: number,
    apiKey: string,
    limit: number
  ) => number
}

const useHandleFetch = (): FetchResult => {
  const [gifArray, setGifArray] = useState<Data[]>([{ id: "", url: "" }])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [foundGifs, setFoundGifs] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFetch = (
    enteredFilter: string,
    activePage: number,
    apiKey: string,
    limit: number
  ) => {
    const offset: number = activePage * limit - limit
    const query: string = `?q="${enteredFilter}"&api_key=${apiKey}&limit=${limit}&offset=${offset}`
    setIsLoading(true)
    fetch("http://api.giphy.com/v1/gifs/search" + query)
      .then((response) => {
        if (response.ok) {
          setFoundGifs(true)
          return response.json()
        } else {
          setIsLoading(false)
          setFoundGifs(false)
          setGifArray([{ id: "", url: "" }])
          setTotalCount(0)
          activePage = 1
        }
      })
      .then((response) => {
        setIsLoading(false)
        if (typeof response !== "undefined") {
          const gifAuxArray: Data[] = []

          for (const key in response.data) {
            gifAuxArray.push({
              id: key,
              url: response.data[key].images.original.url,
            })
            setTotalCount(response.pagination.total_count)
          }
          setGifArray(gifAuxArray)
        } else {
          setGifArray([{ id: "", url: "" }])
          setTotalCount(0)
          activePage = 1
        }
      })
    return activePage
  }

  return { gifArray, totalCount, foundGifs, isLoading, handleFetch }
}

export default useHandleFetch
