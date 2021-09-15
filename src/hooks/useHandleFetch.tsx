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
    let offset: number = activePage * limit - limit
    if (offset > 4999) {
      offset = 4999 //08/09/2021 the query does not accept offset>4999
    }
    const query: string = `?q="${enteredFilter}"&api_key=${apiKey}&limit=${limit}&offset=${offset}`
    console.log("query", query)
    setIsLoading(true)
    fetch("http://api.giphy.com/v1/gifs/search" + query)
      .then((response) => {
        console.log("response.ok", response.ok)
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
        console.log("response", response)
        setIsLoading(false)
        if (typeof response !== "undefined") {
          const gifAuxArray: Data[] = []

          for (const key in response.data) {
            gifAuxArray.push({
              id: key,
              url: response.data[key].images.original.url,
            })
            if (response.pagination.total_count - limit >= 4999) {
              setTotalCount(4999 + limit) //08/09/2021 the query does not accept offset>4999
            } else {
              setTotalCount(response.pagination.total_count)
            }
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
